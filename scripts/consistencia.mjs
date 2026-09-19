// O backlog da auditoria de consistência. `docs/processo/consistencia.json` é
// o dono dos achados; `consistencia.md` é a vista, gerada aqui — nunca à mão.
//
//   node scripts/consistencia.mjs render            escreve docs/processo/consistencia.md
//   node scripts/consistencia.mjs lote B3           checklist do lote
//   node scripts/consistencia.mjs componente drawer achados que tocam o arquivo
//   node scripts/consistencia.mjs verificar         roda os checks e diz o que ainda dispara
//
// Este script não edita o JSON: quem fecha um achado é a sessão do lote, com
// o commit em `fechadoEm`.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { RAIZ } from "./lib/fonte.mjs";

const ARQ = path.join(RAIZ, "docs/processo/consistencia.json");
const VISTA = path.join(RAIZ, "docs/processo/consistencia.md");
const dados = JSON.parse(fs.readFileSync(ARQ, "utf8"));
const achados = dados.achados;
const [cmd, arg] = process.argv.slice(2);

const EIXOS = ["tokens", "movimento", "composicao", "paginas", "instalacao", "docs"];
const LOTES = ["A", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "figma", "depois"];
const GRAV = ["bloqueia", "alta", "media", "baixa"];
const linha = (a) => `| ${a.id} | ${a.titulo} | ${a.onde[0] ?? "—"}${a.onde.length > 1 ? ` (+${a.onde.length - 1})` : ""} | ${a.gravidade} | ${a.lote} |`;

function render() {
  const abertos = achados.filter((a) => a.status === "aberto");
  const cont = (f) => achados.filter(f).length;
  const out = [];
  out.push(`# Consistência do design system — backlog da auditoria`);
  out.push(``);
  out.push(`<!-- GERADO por scripts/consistencia.mjs render a partir de consistencia.json. Não edite à mão. -->`);
  out.push(``);
  out.push(`Varredura de ${dados.varredura} · ${achados.length} achados · ${abertos.length} abertos · atualizado em ${new Date().toISOString().slice(0, 10)}.`);
  out.push(`Dono: [consistencia.json](consistencia.json). Método e lotes: plano da rodada (${dados.plano}).`);
  out.push(``);
  out.push(`## O que é`);
  out.push(``);
  out.push(`Os componentes foram medidos contra o Figma um a um, nunca entre si. Esta lista é o que diverge`);
  out.push(`**entre** eles — tokens, movimento, composição, páginas, instalação e docs — com id estável,`);
  out.push(`arquivo:linha, gravidade e o lote que resolve. \`bloqueia\` = erro garantido para quem instala ·`);
  out.push(`\`alta\` = regra escrita descumprida · \`media\` = duplicação sem bug visível · \`baixa\` = cosmético.`);
  out.push(`Status: \`aberto\` · \`corrigido\` (commit em fechadoEm) · \`aceito\` (exige ADR) · \`adiado\` (lote figma).`);
  out.push(``);
  out.push(`## Abertos por eixo × lote`);
  out.push(``);
  const lotesUsados = LOTES.filter((l) => achados.some((a) => a.lote === l));
  out.push(`| eixo | ${lotesUsados.join(" | ")} | total |`);
  out.push(`|---|${lotesUsados.map(() => "---").join("|")}|---|`);
  for (const e of EIXOS) {
    const n = abertos.filter((a) => a.eixo === e);
    if (!n.length) continue;
    out.push(`| ${e} | ${lotesUsados.map((l) => n.filter((a) => a.lote === l).length || "·").join(" | ")} | ${n.length} |`);
  }
  out.push(`| **total** | ${lotesUsados.map((l) => abertos.filter((a) => a.lote === l).length || "·").join(" | ")} | ${abertos.length} |`);
  out.push(``);
  out.push(`## Por status`);
  out.push(``);
  out.push(`aberto ${cont((a) => a.status === "aberto")} · corrigido ${cont((a) => a.status === "corrigido")} · aceito ${cont((a) => a.status === "aceito")} · adiado ${cont((a) => a.status === "adiado")}`);
  out.push(``);
  out.push(`## Abertos que bloqueiam ou descumprem regra`);
  out.push(``);
  const graves = abertos.filter((a) => a.gravidade === "bloqueia" || a.gravidade === "alta").sort((x, y) => GRAV.indexOf(x.gravidade) - GRAV.indexOf(y.gravidade) || x.id.localeCompare(y.id));
  const LIMITE = 70;
  out.push(`| id | achado | onde | gravidade | lote |`);
  out.push(`|---|---|---|---|---|`);
  for (const a of graves.slice(0, LIMITE)) out.push(linha(a));
  if (graves.length > LIMITE) out.push(`| … | mais ${graves.length - LIMITE} no JSON | | | |`);
  out.push(``);
  const medios = abertos.filter((a) => a.gravidade === "media" || a.gravidade === "baixa");
  out.push(`Mais ${medios.length} abertos de gravidade média/baixa, listados no JSON. \`node scripts/consistencia.mjs lote <B>\` imprime o checklist de um lote.`);
  out.push(``);
  fs.writeFileSync(VISTA, out.join("\n") + "\n");
  console.log(`${path.relative(RAIZ, VISTA)}: ${out.length} linhas · ${achados.length} achados (${abertos.length} abertos)`);
}

function lote(l) {
  const lista = achados.filter((a) => a.lote === l);
  if (!lista.length) return console.log(`nenhum achado no lote ${l}`);
  console.log(`Lote ${l} — ${lista.length} achado(s), ${lista.filter((a) => a.status === "aberto").length} aberto(s)\n`);
  for (const a of lista.sort((x, y) => GRAV.indexOf(x.gravidade) - GRAV.indexOf(y.gravidade)))
    console.log(`[${a.status === "aberto" ? " " : "x"}] ${a.id}  ${a.gravidade.padEnd(8)} ${a.titulo}\n      ${a.onde.join(" · ")}${a.verificacao !== "manual" ? `\n      verificação: ${a.verificacao}` : ""}`);
}

function componente(nome) {
  const lista = achados.filter((a) => a.onde.some((o) => o.includes(nome)));
  console.log(`${lista.length} achado(s) tocam "${nome}"\n`);
  for (const a of lista) console.log(`${a.id}  ${a.status.padEnd(9)} ${a.lote.padEnd(5)} ${a.gravidade.padEnd(8)} ${a.titulo}`);
}

function verificar() {
  const cache = new Map();
  const saida = (script) => {
    if (!cache.has(script)) {
      let txt;
      try { txt = execFileSync("node", [`scripts/check-${script}.mjs`, "--json", "--tudo"], { cwd: RAIZ, encoding: "utf8", maxBuffer: 1 << 26 }); }
      catch (e) { txt = e.stdout; }
      cache.set(script, JSON.parse(txt || "[]"));
    }
    return cache.get(script);
  };
  let ainda = 0, sumiu = 0, manual = 0;
  for (const a of achados) {
    if (a.status !== "aberto") continue;
    const m = a.verificacao.match(/^check:([\w-]+)#([\w-]+)$/);
    if (!m) { manual++; continue; }
    // O achado aponta para a doc (Tag.md) e o check reporta o código (tag.tsx):
    // o alvo é o mesmo componente. Compara o nome-base normalizado.
    const base = (f) => f.split(":")[0].split("/").pop().replace(/\.\w+$/, "").replace(/-/g, "").toLowerCase();
    const arquivos = a.onde.map((o) => o.split(":")[0]);
    const dispara = saida(m[1]).some((v) => v.regra === m[2] && arquivos.some((f) => v.arquivo === f || v.arquivo.startsWith(f) || base(v.arquivo) === base(f)));
    if (dispara) ainda++; else sumiu++;
    console.log(`${dispara ? "✗ ainda dispara     " : "✓ não dispara mais  "} ${a.id}  ${a.titulo}${dispara ? "" : "  → marque corrigido no JSON"}`);
  }
  console.log(`\n${ainda} ainda disparam · ${sumiu} não disparam mais · ${manual} manuais (conferir no lote)`);
}

const cmds = { render, lote: () => lote(arg), componente: () => componente(arg), verificar };
if (!cmds[cmd]) { console.error("Comandos: render | lote <B> | componente <nome> | verificar"); process.exit(2); }
cmds[cmd]();
