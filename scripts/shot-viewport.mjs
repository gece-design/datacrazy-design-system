import { chromium } from "playwright";
const rota = process.argv[2] || "/";
const tema = process.argv[3] || "claro";
const nome = process.argv[4] || "viewport";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:4321" + rota, { waitUntil: "networkidle" });
if (tema === "escuro") { await page.evaluate(() => document.documentElement.classList.add("dark")); await page.waitForTimeout(300); }
await page.screenshot({ path: `/tmp/dc-shots/${nome}.png`, fullPage: false });
console.log(nome + ".png");
await browser.close();
