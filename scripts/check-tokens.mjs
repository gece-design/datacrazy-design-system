// Valor de estilo fora dos tokens, nos componentes e nas páginas. Cada regra
// tem um nome estável (é a `verificacao` dos achados em
// docs/processo/consistencia.json) e diz de onde a regra vem.
//
//   node scripts/check-tokens.mjs                 catraca contra scripts/baseline/tokens.json
//   node scripts/check-tokens.mjs --estrito       reprova tudo o que encontrar
//   node scripts/check-tokens.mjs --tudo          inclui as regras que ainda não estão ativas
//   node scripts/check-tokens.mjs --json          saída para o consistencia.mjs
//
// Exceção pontual: a linha (ou a de cima) leva um comentário
// `check-tokens:ignore <regra> — motivo`. Exceção de arquivo inteiro: EXCECOES.
import fs from "node:fs";
import path from "node:path";
import { RAIZ } from "./lib/fonte.mjs";
import { catraca, flags } from "./lib/ratchet.mjs";

const UI = (f) => f.startsWith("components/ui/");
const COMPONENTES = (f) => f.startsWith("components/");
const PAGINAS = (f) => f.startsWith("app/");
const ICONES = new Set([12, 14, 16, 20]);

// arquivo → regras que não valem nele, com motivo
const EXCECOES = {
  // D19: fileira que rola corta o outline com offset; ring-inset é a exceção documentada
  "components/ui/tabs.tsx": ["foco-ring"],
  // o próprio Button: é ele que define a base
  "components/ui/button.tsx": ["botao-cru"],
  // a página da paleta MOSTRA os hex: é documentação do token, não estilo
  "app/foundations/color/page.tsx": ["hex"],
};

/** @type {Array<{regra:string, origem:string, onde:(f:string)=>boolean, ativa?:boolean, informativa?:boolean, teste:(linha:string, f:string)=>string[]|null}>} */
const REGRAS = [
  { regra: "duracao-literal", origem: "D20 · I10", onde: () => true, teste: (l) => l.match(/\b(?:duration|delay)-\d+\b/g) },
  { regra: "curva-literal", origem: "D20 · I10", onde: () => true, teste: (l) => l.match(/\bease-(?:in-out|in|out|linear)\b|\bease-\[[^\]]*\]/g) },
  { regra: "transition-all", origem: "I11", onde: () => true, teste: (l) => l.match(/\btransition-all\b/g) },
  { regra: "foco-ring", origem: "D6", onde: () => true, teste: (l) => l.match(/focus-visible:ring-\S+/g) },
  { regra: "ring-offset", origem: "D6", onde: () => true, teste: (l) => l.match(/\bring-offset-\S+/g) },
  { regra: "opacidade-literal", origem: "I5 · tokens", onde: () => true, teste: (l) => l.match(/\bopacity-(?:50|\[[^\]]+\])/g) },
  { regra: "scrim-literal", origem: "tokens · pendência 7", onde: () => true, teste: (l) => l.match(/\b(?:overlay-scrim|neutral-\d+|black|white)\/\d+\b/g) },
  { regra: "sombra-arbitraria", origem: "G4 · escala de elevação", onde: () => true, teste: (l) => l.match(/\bshadow-\[[^\]]+\]/g) },
  { regra: "tipografia-arbitraria", origem: "tokens text/*", onde: () => true, teste: (l) => l.match(/\b(?:text|tracking)-\[[^\]]+\]/g) },
  { regra: "z-cru", origem: "E2", onde: () => true, teste: (l) => l.match(/\bz-(?:\d+|\[[^\]]+\])\b/g) },
  { regra: "hex", origem: "lista negativa", onde: () => true, teste: (l) => l.match(/[\["']#[0-9a-fA-F]{3,8}\b/g) },
  { regra: "dark-no-componente", origem: "D11", onde: UI, teste: (l) => l.match(/\bdark:[\w-]+/g) },
  { regra: "timeout-literal", origem: "D20", onde: UI, teste: (l) => l.match(/setTimeout\([^,]+,\s*\d+|const\s+\w+_MS\s*=\s*\d+/g) },
  {
    regra: "icone-fora-da-escala", origem: "escala de ícone", onde: () => true,
    teste: (l) => [...l.matchAll(/\bsize=\{(\d+(?:\.\d+)?)\}/g)].filter((m) => !ICONES.has(Number(m[1]))).map((m) => m[0]),
  },
  { regra: "botao-cru", origem: "lista negativa · duplica o Button", onde: PAGINAS, teste: (l) => l.match(/<button\b/g) },
  // Ativa a partir do lote B3, quando existir `foco` em lib/estados.ts: um
  // <button> em componente sem a constante é o sinal de que copiou o anel.
  { regra: "botao-cru", origem: "lista negativa · sem `foco` compartilhado", onde: COMPONENTES, ativa: false, teste: (l) => l.match(/<button\b/g) },
  {
    // Informativa: conta os valores arbitrários (a maioria vem de medida do
    // Figma e só se resolve com a remedição). Nunca reprova.
    regra: "arbitrario", origem: "inventário", onde: COMPONENTES, informativa: true,
    teste: (l) =>
      [...l.matchAll(/(?<![\w-])([a-z][a-z-]*)-\[([^\]]+)\]/g)]
        .filter((m) => !/^(?:has|group-has|peer-has|transition|bg-\[?image|grid-cols|grid-rows|content)$/.test(m[1]))
        .filter((m) => !/^(?:&|data-|inherit|var\(|image:|:|\[)/.test(m[2]) && !/^\[/.test(m[2]))
        .filter((m) => !/^(?:shadow|text|tracking|z|opacity)$/.test(m[1])) // já contadas nas regras próprias
        .map((m) => m[0]),
  },
];

const { estrito, atualizar, json, tudo } = flags();

function arquivos(dir) {
  const out = [];
  for (const e of fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) out.push(...arquivos(rel));
    else if (/\.tsx?$/.test(e.name)) out.push(rel);
  }
  return out;
}

const semComentario = (l) => l.replace(/\/\*.*?\*\//g, "").replace(/(^|\s)\/\/.*$/, "");
const achados = [];
const informativos = {};

for (const rel of [...arquivos("components"), ...arquivos("app")]) {
  const linhas = fs.readFileSync(path.join(RAIZ, rel), "utf8").split("\n");
  linhas.forEach((bruta, i) => {
    const anterior = linhas[i - 1] ?? "";
    const ignora = (regra) => new RegExp(`check-tokens:ignore\\s+${regra}\\b`).test(bruta) || new RegExp(`check-tokens:ignore\\s+${regra}\\b`).test(anterior);
    const linha = semComentario(bruta);
    for (const r of REGRAS) {
      if (!r.onde(rel) || (r.ativa === false && !tudo)) continue;
      if (EXCECOES[rel]?.includes(r.regra) || ignora(r.regra)) continue;
      const m = r.teste(linha, rel);
      if (!m || !m.length) continue;
      if (r.informativa) {
        informativos[rel] = (informativos[rel] ?? 0) + m.length;
        continue;
      }
      achados.push({ chave: `${r.regra}|${rel}`, regra: r.regra, origem: r.origem, arquivo: rel, linha: i + 1, trecho: [...new Set(m)].join(" ") });
    }
  });
}

if (!json) {
  let ultima = null;
  for (const a of achados.sort((x, y) => x.regra.localeCompare(y.regra) || x.arquivo.localeCompare(y.arquivo) || x.linha - y.linha)) {
    if (a.regra !== ultima) {
      const r = REGRAS.find((r) => r.regra === a.regra);
      console.log(`\n## ${a.regra}  (${r.origem})`);
      ultima = a.regra;
    }
    console.log(`  ${a.arquivo}:${a.linha}  ${a.trecho}`);
  }
  const totalArb = Object.values(informativos).reduce((s, n) => s + n, 0);
  console.log(`\n## arbitrario (informativa, não reprova): ${totalArb} em ${Object.keys(informativos).length} arquivo(s)`);
  for (const [f, n] of Object.entries(informativos).sort(([, a], [, b]) => b - a).slice(0, 8)) console.log(`  ${String(n).padStart(3)}  ${f}`);
}

process.exit(catraca("tokens", achados, { estrito, atualizar, json }));
