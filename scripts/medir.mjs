import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4321/", { waitUntil: "networkidle" });
const m = await page.evaluate(() => {
  const g = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return { texto: el.textContent.trim().slice(0, 22), fontSize: s.fontSize, lineHeight: s.lineHeight, fontWeight: s.fontWeight, letterSpacing: s.letterSpacing, color: s.color, fontFamily: s.fontFamily.split(",")[0] };
  };
  return {
    h1: g("h1"),
    h2: g("h2"),
    itemSidebar: g("aside nav a"),
    corpo: g("main p"),
    body: g("body"),
    larguraSidebar: document.querySelector("aside").getBoundingClientRect().width,
  };
});
console.log(JSON.stringify(m, null, 2));
await browser.close();
