import { chromium } from "playwright";
const alvos = [
  ["https://www.boardui.com/components", "ref-components"],
  ["https://www.boardui.com/components/button", "ref-button"],
];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
for (const [url, nome] of alvos) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `/tmp/dc-shots/${nome}.png`, fullPage: false });
    const info = await page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return { titulo: document.title, bg: s.backgroundColor, cor: s.color, fonte: s.fontFamily, tamanho: s.fontSize };
    });
    console.log(nome, JSON.stringify(info));
  } catch (e) { console.log(nome, "ERRO:", e.message.slice(0, 90)); }
}
await browser.close();
