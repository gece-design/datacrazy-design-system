// Regressão visual do estado de repouso: a rodada de consistência promete
// que nenhum pixel muda. Captura as rotas prontas do nav nos dois temas e
// compara com uma base tirada ANTES do lote.
//
//   node scripts/regressao-visual.mjs baseline <pasta>            captura a base
//   node scripts/regressao-visual.mjs check <pasta> [--max=0]     compara e grava os mapas de diff
//
// Precisa do site no ar (npm run start ou dev) em DS_URL (padrão localhost:4321).
// Determinismo: movimento reduzido, relógio fixo, animações desligadas no
// screenshot, fonte carregada e conferida (Geist; fallback = falha).
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { RAIZ, lerNavegacao } from "./lib/fonte.mjs";

const [modo, pastaArg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const max = parseFloat((process.argv.find((a) => a.startsWith("--max=")) ?? "--max=0").slice(6));
if (!["baseline", "check"].includes(modo) || !pastaArg) {
  console.error("Uso: node scripts/regressao-visual.mjs baseline|check <pasta> [--max=0]");
  process.exit(2);
}
const pasta = path.resolve(pastaArg);
const SITE = (process.env.DS_URL || "http://localhost:4321").replace(/\/$/, "");
const TEMAS = ["claro", "escuro"];
const rotas = lerNavegacao().filter((p) => p.pronto).map((p) => p.href);
const nomeDe = (rota, tema) => `${rota === "/" ? "home" : rota.slice(1).replace(/\//g, "-")}.${tema}.png`;

// Rotas que ainda oscilam entre capturas mesmo com relógio fixo. Entram aqui
// COM motivo; o limiar não afrouxa para elas — são reportadas, não reprovadas.
const INSTAVEL = {
  // O período inicial ("últimos 7 dias") é calculado no build, no servidor: o
  // relógio fixo do Playwright só vale no navegador, e a hidratação mantém o
  // texto do servidor. Muda a cada dia em que o site é construído (2026-09-21).
  "/forms/date-picker": "período inicial vem do build, não do relógio fixo",
};

try {
  await fetch(SITE);
} catch {
  console.error(`site fora do ar em ${SITE} — suba com \`npm run start\` (ou dev) antes`);
  process.exit(2);
}

const { HASH_DA_SENHA, COOKIE_ACESSO } = await import("../lib/acesso.ts").catch(() => ({
  HASH_DA_SENHA: "8d6d4bf3a078bb9bd89767b596bdce8646765af2184858d5aaa05111743a9b2f",
  COOKIE_ACESSO: "dc-acesso",
}));

fs.mkdirSync(pasta, { recursive: true });
const browser = await chromium.launch();
const capturas = path.join(pasta, modo === "baseline" ? "." : "atual");
fs.mkdirSync(capturas, { recursive: true });

let falhas = 0;
const linhas = [];
for (const tema of TEMAS) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: tema === "escuro" ? "dark" : "light" });
  await ctx.addCookies([{ name: COOKIE_ACESSO, value: HASH_DA_SENHA, domain: new URL(SITE).hostname, path: "/" }]);
  await ctx.addInitScript((t) => localStorage.setItem("dc-tema", t), tema);
  const page = await ctx.newPage();
  await page.clock.setFixedTime(new Date("2026-09-19T12:00:00"));
  for (const rota of rotas) {
    const nome = nomeDe(rota, tema);
    await page.goto(SITE + rota, { waitUntil: "networkidle", timeout: 45000 });
    await page.evaluate(() => document.fonts.ready);
    const fonte = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    if (!/Geist/.test(fonte)) { console.log(`✗ ${nome}: fonte ${fonte} (fallback — captura inválida)`); falhas++; continue; }
    const alvo = path.join(capturas, nome);
    await page.screenshot({ path: alvo, fullPage: true, animations: "disabled", caret: "hide" });
    if (modo === "baseline") { linhas.push(`  ${nome}`); continue; }

    const base = path.join(pasta, nome);
    if (!fs.existsSync(base)) {
      // rota que nasceu neste lote: entra na base agora e é declarada no gate
      fs.copyFileSync(alvo, base);
      linhas.push(`  + ${nome}: rota nova, base criada`);
      continue;
    }
    const a = PNG.sync.read(fs.readFileSync(base));
    const b = PNG.sync.read(fs.readFileSync(alvo));
    if (a.width !== b.width || a.height !== b.height) {
      linhas.push(`  ✗ ${nome}: geometria ${a.width}×${a.height} → ${b.width}×${b.height}`);
      falhas++;
      continue;
    }
    const diff = new PNG({ width: a.width, height: a.height });
    const px = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1, includeAA: false });
    const pct = (px / (a.width * a.height)) * 100;
    const ok = pct <= max || INSTAVEL[rota];
    if (px > 0) fs.writeFileSync(path.join(capturas, nome.replace(/\.png$/, ".diff.png")), PNG.sync.write(diff));
    if (!ok) falhas++;
    linhas.push(`  ${ok ? "✓" : "✗"} ${nome.padEnd(44)} ${pct.toFixed(3)}% (${px} px)${INSTAVEL[rota] ? ` · instável: ${INSTAVEL[rota]}` : ""}`);
  }
  await ctx.close();
}
await browser.close();

console.log(modo === "baseline" ? `base em ${pasta}:` : `comparação contra ${pasta} (limite ${max}%):`);
console.log(linhas.join("\n"));
console.log(falhas ? `\n✗ ${falhas} captura(s) com problema` : `\n✓ ${rotas.length * TEMAS.length} capturas ${modo === "baseline" ? "na base" : "iguais à base"}`);
process.exit(falhas ? 1 : 0);
