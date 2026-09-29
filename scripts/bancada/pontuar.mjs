// Pontua uma rodada da bancada: o que o Claude escreveu no projeto, medido
// pelas regras do DS (as mesmas do check-tokens) mais as regras de tela;
// compila; constrói; e captura cada rota nova nos dois temas.
//
//   node scripts/bancada/pontuar.mjs <pasta-da-rodada> [--sem-build]
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { BASE, listar, rodar, flags } from "./lib.mjs";
import { regrasParaTela, semTelaBase } from "../lib/regras-tokens.mjs";

const { args, tem } = flags();
const DIR = path.resolve(args[0]);
if (!fs.existsSync(DIR)) throw new Error(`rodada não existe: ${DIR}`);

/* Só o que mudou em relação à base: é o que o Claude escreveu. */
const daBase = new Set(listar(BASE));
const mudados = listar(DIR).filter((rel) => {
  const b = path.join(BASE, rel);
  return !daBase.has(rel) || fs.readFileSync(b, "utf8") !== fs.readFileSync(path.join(DIR, rel), "utf8");
});
const novosDoDS = mudados.filter((r) => r.startsWith("components/ui/") && !daBase.has(r)); // instalou do catálogo: ok
const editouDS = mudados.filter((r) => r.startsWith("components/ui/") && daBase.has(r)); // editou componente do DS: não
const escritos = mudados.filter((r) => !r.startsWith("components/ui/"));

const semComentario = (l) => l.replace(/\/\*.*?\*\//g, "").replace(/(^|\s)\/\/.*$/, "");
const achados = [];
const info = {};
const usados = new Set();
const paginas = [];
for (const rel of escritos) {
  const texto = fs.readFileSync(path.join(DIR, rel), "utf8");
  const linhas = texto.split("\n");
  for (const m of texto.matchAll(/from ["']@\/components\/ui\/([\w-]+)["']/g)) usados.add(m[1]);
  const vizinho = (spec) => {
    for (const ext of ["", ".tsx", ".ts", "/index.tsx"]) {
      const abs = path.join(DIR, path.dirname(rel), spec + ext);
      if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return fs.readFileSync(abs, "utf8");
    }
    return null;
  };
  if (/\/page\.tsx$/.test(rel)) paginas.push({ rel, telaBase: !semTelaBase(rel, texto, vizinho), rota: "/" + rel.replace(/^app\//, "").replace(/\/?page\.tsx$/, "") });
  linhas.forEach((bruta, i) => {
    const linha = semComentario(bruta);
    for (const r of regrasParaTela(rel)) {
      const m = r.teste(linha, rel, r.multilinha ? linhas.slice(i).join("\n") : undefined, r.multilinha ? texto : undefined);
      if (!m || !m.length) continue;
      if (r.informativa) { info[r.regra] = (info[r.regra] ?? 0) + m.length; continue; }
      achados.push({ regra: r.regra, arquivo: rel, linha: i + 1, trecho: [...new Set(m)].join(" ") });
    }
  });
}
for (const p of paginas) if (!p.telaBase) achados.push({ regra: "sem-tela-base", arquivo: p.rel, linha: 1, trecho: "página sem TelaBase" });
for (const r of editouDS) achados.push({ regra: "editou-o-ds", arquivo: r, linha: 1, trecho: "componente do DS alterado" });

/* Compila e constrói. */
let tsc = "ok";
try { rodar("npx tsc --noEmit", DIR, { silencioso: true }); } catch (e) { tsc = String(e.stdout).split("\n").filter(Boolean).slice(0, 6).join("\n"); }
let build = "pulado";
const capturas = [];
if (!tem("sem-build")) {
  fs.rmSync(path.join(DIR, ".next"), { recursive: true, force: true }); // resto do `next dev` do agente
  try { rodar("npx next build", DIR, { silencioso: true, timeout: 600000 }); build = "ok"; } catch (e) { build = String(e.stdout || e.message).split("\n").filter((l) => /error|Error|✗/.test(l)).slice(0, 6).join("\n") || "falhou"; }
  if (build === "ok" && paginas.length) {
    const porta = 4400 + Math.floor(Math.random() * 100);
    const servidor = spawn("npx", ["next", "start", "-p", String(porta)], { cwd: DIR, stdio: "ignore" });
    await new Promise((r) => setTimeout(r, 4000));
    try {
      const { chromium } = await import("playwright");
      const browser = await chromium.launch();
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      fs.mkdirSync(path.join(DIR, "capturas"), { recursive: true });
      for (const p of paginas) {
        for (const tema of ["claro", "escuro"]) {
          await page.goto(`http://localhost:${porta}${p.rota || "/"}`, { waitUntil: "networkidle", timeout: 30000 }).catch(() => null);
          await page.evaluate((t) => document.documentElement.classList.toggle("dark", t === "escuro"), tema);
          await page.waitForTimeout(400);
          const arquivo = path.join(DIR, "capturas", `${(p.rota || "raiz").replace(/\//g, "_") || "raiz"}.${tema}.png`);
          await page.screenshot({ path: arquivo, fullPage: false });
          capturas.push(path.relative(DIR, arquivo));
        }
      }
      await browser.close();
    } finally {
      servidor.kill();
    }
  }
}

/* O resultado do Claude, se a rodada guardou. */
let claude = null;
const j = path.join(DIR, "claude.json");
if (fs.existsSync(j)) {
  try {
    const r = JSON.parse(fs.readFileSync(j, "utf8"));
    claude = { turnos: r.num_turns, duracao_s: Math.round((r.duration_ms ?? 0) / 1000), custo_usd: +(r.total_cost_usd ?? 0).toFixed(2), erro: r.is_error ?? false };
  } catch { claude = { erro: "claude.json ilegível" }; }
}

const porRegra = {};
for (const a of achados) porRegra[a.regra] = (porRegra[a.regra] ?? 0) + 1;
const resultado = { rodada: DIR, escritos, instalados: novosDoDS, editouDS, paginas, componentesDoDS: [...usados].sort(), achados, porRegra, informativos: info, tsc, build, capturas, claude };
fs.writeFileSync(path.join(DIR, "pontuacao.json"), JSON.stringify(resultado, null, 2) + "\n");

console.log(`\n# ${path.basename(DIR)}`);
console.log(`arquivos escritos: ${escritos.length} · instalados do DS: ${novosDoDS.length} · DS usado: ${[...usados].join(", ") || "nenhum"}`);
console.log(`páginas: ${paginas.map((p) => `${p.rota || "/"}${p.telaBase ? "" : " (sem TelaBase)"}`).join(", ") || "nenhuma"}`);
console.log(`violações: ${achados.length}${Object.keys(porRegra).length ? " — " + Object.entries(porRegra).map(([k, v]) => `${k} ${v}`).join(" · ") : ""}`);
if (Object.keys(info).length) console.log(`informativos: ${Object.entries(info).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
console.log(`tsc: ${tsc === "ok" ? "ok" : "falhou"} · build: ${build} · capturas: ${capturas.length}`);
if (claude) console.log(`claude: ${claude.turnos} turnos · ${claude.duracao_s}s · US$ ${claude.custo_usd}${claude.erro ? " · ERRO" : ""}`);
for (const a of achados.slice(0, 30)) console.log(`  ${a.regra}  ${a.arquivo}:${a.linha}  ${a.trecho.slice(0, 80)}`);
if (tsc !== "ok") console.log("\ntsc:\n" + tsc);
