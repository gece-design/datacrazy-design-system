#!/usr/bin/env node
// O check do DS no projeto de quem instala: valor de estilo fora dos tokens,
// paleta e tipografia do Tailwind, elemento cru onde o DS tem componente,
// ícone de outra biblioteca, página sem TelaBase. As regras são as mesmas que
// guardam o próprio design system (scripts/lib/regras-tokens.mjs).
//
//   node scripts/ds-check.mjs                 varre app/ e components/ (fora de components/ui)
//   node scripts/ds-check.mjs app/x/page.tsx  só esses arquivos
//   node scripts/ds-check.mjs --json          saída para máquina
//   node scripts/ds-check.mjs --hook          PostToolUse do Claude Code: lê o arquivo do stdin
//                                             e devolve as violações (exit 2) para o agente corrigir
//
// Exceção pontual: a linha (ou a de cima) leva `ds-check:ignore <regra> — motivo`.
import fs from "node:fs";
import path from "node:path";
import { REGRAS, REGRAS_DE_TELA, semTelaBase } from "./lib/regras-tokens.mjs";

const RAIZ = process.cwd();
const args = process.argv.slice(2);
const json = args.includes("--json");
const hook = args.includes("--hook");
const pedidos = args.filter((a) => !a.startsWith("--"));

function listar(dir) {
  const out = [];
  const abs = path.join(RAIZ, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) {
      if (rel !== "components/ui" && e.name !== "node_modules") out.push(...listar(rel));
    } else if (/\.tsx?$/.test(e.name)) out.push(rel);
  }
  return out;
}

let arquivos;
if (hook) {
  // o Claude Code manda o evento em JSON; só o arquivo escrito interessa
  let entrada = "";
  try { entrada = fs.readFileSync(0, "utf8"); } catch { /* sem stdin */ }
  const caminho = entrada && (JSON.parse(entrada).tool_input?.file_path ?? JSON.parse(entrada).tool_response?.filePath);
  const rel = caminho ? path.relative(RAIZ, caminho) : "";
  arquivos = /^(app|components)\//.test(rel) && !rel.startsWith("components/ui/") && /\.tsx?$/.test(rel) && fs.existsSync(caminho) ? [rel] : [];
} else {
  arquivos = pedidos.length ? pedidos.map((p) => path.relative(RAIZ, path.resolve(p))) : [...listar("app"), ...listar("components"), ...listar("src/app"), ...listar("src/components")];
}

const semComentario = (l) => l.replace(/\/\*.*?\*\//g, "").replace(/(^|\s)\/\/.*$/, "");
const achados = [];
const informativos = [];
for (const rel of arquivos) {
  const texto = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  const linhas = texto.split("\n");
  // as regras do próprio DS valem em app/ e components/ como lá: a de
  // components/ui (dark:, setTimeout) fica de fora — components/ui é o DS
  // `<button>` cru só reprova sem a constante `foco` (a regra multilinha do DS),
  // em app/ e em components/: uma tela pode ter botão próprio, desde que com o foco do DS
  const doArquivo = [
    ...REGRAS.filter((r) => r.onde(rel) && r.ativa !== false && r.regra !== "fundo-da-caixa" && !(r.regra === "botao-cru" && !r.multilinha)),
    ...REGRAS.filter((r) => r.regra === "botao-cru" && r.multilinha && !r.onde(rel)),
    ...REGRAS_DE_TELA,
  ];
  linhas.forEach((bruta, i) => {
    const anterior = linhas[i - 1] ?? "";
    const ignora = (regra) => [bruta, anterior].some((l) => new RegExp(`(?:ds-check|check-tokens):ignore\\s+${regra}\\b`).test(l));
    const linha = semComentario(bruta);
    for (const r of doArquivo) {
      if (ignora(r.regra)) continue;
      const m = r.teste(linha, rel, r.multilinha ? linhas.slice(i).join("\n") : undefined, r.multilinha ? texto : undefined);
      if (!m || !m.length) continue;
      (r.informativa ? informativos : achados).push({ regra: r.regra, origem: r.origem, arquivo: rel, linha: i + 1, trecho: [...new Set(m)].join(" ").slice(0, 120) });
    }
  });
  if (semTelaBase(rel, texto)) achados.push({ regra: "sem-tela-base", origem: "toda tela começa pela TelaBase (@datacrazy/tela)", arquivo: rel, linha: 1, trecho: "página sem TelaBase" });
}

if (json) {
  console.log(JSON.stringify({ arquivos, achados, informativos }, null, 2));
  process.exit(achados.length ? 1 : 0);
}
const saida = hook ? console.error : console.log;
if (!achados.length) {
  if (!hook) saida(`✓ ${arquivos.length} arquivo(s) sem violação do DS${informativos.length ? ` · ${informativos.length} aviso(s) informativo(s)` : ""}`);
  process.exit(0);
}
let ultima = null;
for (const a of achados.sort((x, y) => x.regra.localeCompare(y.regra) || x.arquivo.localeCompare(y.arquivo) || x.linha - y.linha)) {
  if (a.regra !== ultima) { saida(`\n## ${a.regra}  (${a.origem})`); ultima = a.regra; }
  saida(`  ${a.arquivo}:${a.linha}  ${a.trecho}`);
}
saida(`\n✗ ${achados.length} violação(ões) do DS em ${new Set(achados.map((a) => a.arquivo)).size} arquivo(s). Corrija com os tokens e os componentes do @datacrazy (skill datacrazy-ds).`);
process.exit(hook ? 2 : 1);
