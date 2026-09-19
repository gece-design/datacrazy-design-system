import { chromium } from "playwright";

import { lerNavegacao } from "./lib/fonte.mjs";

// As rotas vêm do nav: ele é o dono (docs/04-navegacao.md). Uma lista aqui
// era uma segunda verdade, e ficou para trás em /exemplos/tags-proposta.
const ROTAS = lerNavegacao().filter((p) => p.pronto).map((p) => p.href);

const browser = await chromium.launch();
// O site tem portão por senha (middleware.ts). O cookie de acesso vale o login:
// o hash é público no código, e sem ele toda rota responde a tela de senha.
const { HASH_DA_SENHA, COOKIE_ACESSO } = await import("../lib/acesso.ts").catch(() => ({
  HASH_DA_SENHA: "8d6d4bf3a078bb9bd89767b596bdce8646765af2184858d5aaa05111743a9b2f",
  COOKIE_ACESSO: "dc-acesso",
}));
const contexto = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await contexto.addCookies([{ name: COOKIE_ACESSO, value: HASH_DA_SENHA, domain: "localhost", path: "/" }]);
const page = await contexto.newPage();
let falhas = 0;

for (const rota of ROTAS) {
  const erros = [];
  page.removeAllListeners("console");
  page.on("console", (m) => { if (m.type() === "error") erros.push(m.text().slice(0, 120)); });

  let status = 0;
  try {
    const resp = await page.goto("http://localhost:4321" + rota, { waitUntil: "networkidle", timeout: 30000 });
    status = resp.status();
  } catch (e) {
    console.log(`✗ ${rota.padEnd(32)} navegação falhou: ${e.message.slice(0, 60)}`);
    falhas++;
    continue;
  }

  const r = await page.evaluate(() => {
    const h1 = document.querySelector("main h1");
    const secoes = [...document.querySelectorAll("main section h2")].map((h) => h.textContent.trim());
    // só o trilho "Nesta página" conta como índice — âncora de exemplo dentro
    // de um preview (a Sidebar tem dezenas) não é item de sumário.
    const indice = [...document.querySelectorAll('main nav[aria-label="Nesta página"] a[href^="#"]')]
      .map((a) => a.textContent.trim());
    const abas = document.querySelectorAll("main section button[aria-pressed]").length / 2;
    const fonte = getComputedStyle(document.body).fontFamily.split(",")[0];
    // valores soltos: cor inline que não venha de var(). As variáveis
    // `--shiki-*` do realce de código (tema duplo do Shiki) são o mecanismo
    // do highlighter, não estilo do DS — ficam de fora.
    const inline = [...document.querySelectorAll("main [style]")]
      .map((e) => e.getAttribute("style").replace(/--shiki-[\w-]+:[^;]+;?/g, ""))
      .filter((s) => /#[0-9a-f]{3,8}|rgb\(/i.test(s) && !/var\(/.test(s));
    return { titulo: h1?.textContent.trim(), secoes, indice, abas, fonte, inline: inline.length };
  });

  const indiceOk = r.indice.length === 0 || r.indice.every((i) => r.secoes.includes(i));
  const fonteOk = /Geist/.test(r.fonte);
  const ok = status === 200 && r.titulo && indiceOk && fonteOk && erros.length === 0 && r.inline === 0;
  if (!ok) falhas++;

  console.log(`${ok ? "✓" : "✗"} ${rota.padEnd(32)} ${String(status)}  "${r.titulo ?? "sem h1"}"`);
  console.log(`   seções: ${r.secoes.length}  índice: ${r.indice.length}${indiceOk ? "" : " ✗ não bate com as seções"}  abas de código: ${r.abas}`);
  if (!fonteOk) console.log(`   ✗ fonte computada: ${r.fonte}`);
  if (r.inline > 0) console.log(`   ✗ ${r.inline} estilo(s) inline com cor fora de var()`);
  for (const e of erros.slice(0, 3)) console.log(`   ✗ console: ${e}`);
}

console.log(falhas === 0 ? "\nTodas as páginas passaram." : `\n${falhas} página(s) com problema.`);
await browser.close();
process.exit(falhas === 0 ? 0 : 1);
