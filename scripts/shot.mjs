import { chromium } from "playwright";

const rotas = process.argv[2] ? process.argv[2].split(",") : ["/"];
const tema = process.argv[3] || "claro";
const dir = process.argv[4] || "/tmp/dc-shots";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
for (const rota of rotas) {
  await page.goto("http://localhost:4321" + rota, { waitUntil: "networkidle" });
  if (tema === "escuro") {
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForTimeout(300);
  }
  // checagem anti-fallback de fonte (docs/processo/fonts-checklist.md)
  const fonte = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  const nome = (rota === "/" ? "home" : rota.slice(1).replace(/\//g, "-")) + "-" + tema;
  await page.screenshot({ path: `${dir}/${nome}.png`, fullPage: true });
  console.log(`${nome}.png · font-family: ${fonte}`);
}
await browser.close();
