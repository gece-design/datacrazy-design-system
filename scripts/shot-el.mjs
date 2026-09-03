import { chromium } from "playwright";
const sel = process.argv[2] || "aside";
const nome = process.argv[3] || "el";
const tema = process.argv[4] || "claro";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:4321/", { waitUntil: "networkidle" });
if (tema === "escuro") { await page.evaluate(() => document.documentElement.classList.add("dark")); await page.waitForTimeout(300); }
const el = await page.$(sel);
await el.screenshot({ path: `/tmp/dc-shots/${nome}.png` });
console.log(nome + ".png");
await browser.close();
