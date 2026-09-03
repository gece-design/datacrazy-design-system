import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:4321/actions/button", { waitUntil: "networkidle", timeout: 60000 });
const r = await p.evaluate(() => {
  return [...document.querySelectorAll("main section")].map(s => {
    const h2 = s.querySelector("h2")?.textContent.trim();
    const cx = s.querySelector(".rounded-2xl");
    if (!cx) return { h2, caixa: null };
    const box = cx.getBoundingClientRect();
    // texto da caixa que NÃO está dentro de um <button>
    const solto = [];
    const w = document.createTreeWalker(cx, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) {
      if (!n.textContent.trim()) continue;
      if (n.parentElement.closest("button")) continue;
      solto.push(n.textContent.trim());
    }
    return { h2, altura: Math.round(box.height), botoes: cx.querySelectorAll("button").length, textoSolto: solto };
  });
});
console.log(JSON.stringify(r, null, 1));
await b.close();
