import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:4321/", { waitUntil: "networkidle" });
const r = await page.evaluate(() => {
  const m = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el), b = el.getBoundingClientRect();
    return { w: +b.width.toFixed(1), h: +b.height.toFixed(1),
      pad: s.padding, radius: s.borderRadius, gap: s.gap,
      fs: s.fontSize, lh: s.lineHeight, fw: s.fontWeight, ls: s.letterSpacing,
      tt: s.textTransform, cor: s.color, bg: s.backgroundColor };
  };
  const aside = document.querySelector("aside");
  const busca = aside.querySelector("input");
  const kbd = aside.querySelector("kbd");
  const cab = aside.querySelector("nav button");
  const item = aside.querySelector("nav ul a");
  const icone = item?.querySelector("svg");
  const texto = item?.querySelector("span");
  const cotovelo = aside.querySelector("nav ul li > span[aria-hidden]");
  const cx = (el) => el ? +el.getBoundingClientRect().x.toFixed(1) : null;
  const ax = aside.getBoundingClientRect().x;
  return {
    sidebar: m(aside),
    busca: m(busca), kbd: m(kbd),
    cabecalho: m(cab), item: m(item), textoItem: m(texto),
    posicoes: {
      sidebarX: ax,
      iconeItemX: icone ? +(cx(icone) - ax).toFixed(1) : null,
      textoItemX: texto ? +(cx(texto) - ax).toFixed(1) : null,
      cotoveloX: cotovelo ? +(cx(cotovelo) - ax).toFixed(1) : null,
      cotoveloW: cotovelo ? +cotovelo.getBoundingClientRect().width.toFixed(1) : null,
    },
  };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
