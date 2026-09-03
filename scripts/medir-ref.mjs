import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://www.boardui.com/components", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);
const r = await page.evaluate(() => {
  const info = (el, rot) => {
    if (!el) return { rot, achou: false };
    const s = getComputedStyle(el), b = el.getBoundingClientRect();
    return { rot, tag: el.tagName.toLowerCase(), classe: (el.className||"").toString().slice(0,90),
      w: Math.round(b.width), h: Math.round(b.height), x: Math.round(b.x), y: Math.round(b.y),
      bg: s.backgroundColor, cor: s.color, fs: s.fontSize, lh: s.lineHeight, fw: s.fontWeight,
      radius: s.borderRadius, border: s.border, pad: s.padding, margin: s.margin, gap: s.gap };
  };
  const out = [];
  const aside = document.querySelector("aside") || document.querySelector("nav")?.closest("div");
  out.push(info(aside, "sidebar"));
  out.push(info(document.querySelector("input"), "busca"));
  const h1 = document.querySelector("h1"); out.push(info(h1, "h1"));
  const h2s = [...document.querySelectorAll("h2")]; out.push(info(h2s[0], "h2 secao"));
  // primeiro card de componente: um link que contenha um heading
  const cards = [...document.querySelectorAll("a")].filter(a => a.querySelector("h3,h2,p") && a.getBoundingClientRect().width > 200 && a.getBoundingClientRect().height > 200);
  out.push(info(cards[0], "card componente"));
  // itens da sidebar
  const links = [...document.querySelectorAll("aside a, nav a")].filter(a=>a.textContent.trim().length&&a.getBoundingClientRect().height<60);
  out.push(info(links[3], "item sidebar"));
  const heads = [...document.querySelectorAll("*")].filter(e=>/GETTING STARTED|FOUNDATIONS|BASE/.test(e.textContent||"") && e.children.length<3 && e.getBoundingClientRect().height<40);
  out.push(info(heads[heads.length-1], "cabecalho categoria"));
  return { body: info(document.body, "body"), itens: out, largura: innerWidth };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
