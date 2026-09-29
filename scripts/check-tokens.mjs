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

// As regras moram em scripts/lib/regras-tokens.mjs: a bancada (scripts/bancada)
// pontua o projeto de quem instala o DS com as mesmas.
import { EXCECOES, REGRAS } from "./lib/regras-tokens.mjs";

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
      const m = r.teste(linha, rel, r.multilinha ? linhas.slice(i).join("\n") : undefined, r.multilinha ? linhas.join("\n") : undefined);
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
