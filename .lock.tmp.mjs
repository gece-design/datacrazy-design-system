import { chromium } from "playwright";
const dir = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
await p.goto("http://localhost:4399/", { waitUntil: "load" });
await p.waitForTimeout(500);
const r = await p.evaluate(() => {
  const item = [...document.querySelectorAll('nav[aria-label="Navegação"] li')]
    .find(li => li.textContent.includes("Let's begin"));
  const contador = document.querySelector("main .grid")?.previousElementSibling?.textContent;
  return {
    ehLink: !!item?.querySelector("a"),
    temCadeado: item?.innerHTML.includes("svg") && item.textContent.trim() === "Let's begin",
    classe: item?.firstElementChild?.className.includes("cursor-not-allowed"),
    contadorTopo: document.querySelector("main p")?.textContent?.slice(0, 40),
  };
});
console.log(JSON.stringify(r));
await p.locator('nav[aria-label="Navegação"]').screenshot({ path: `${dir}/lock-menu.png` });
await p.close();
await b.close();
