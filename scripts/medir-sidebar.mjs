// Auditoria de fidelidade do componente Sidebar do PRODUTO. Não confundir com
// `auditar-sidebar.mjs`, que audita a moldura do site de documentação (regra D3).
//
// Mede geometria e token contra o node 124:2114 do Figma e checa contraste nos
// dois temas. Regra D4: comparar por medição dos dois lados, não a olho.
//
//   node scripts/medir-sidebar.mjs [claro|escuro] [dir de screenshots]
import { chromium } from "playwright";

const tema = process.argv[2] || "claro";
const dir = process.argv[3] || null;

// O que o Figma entrega, campo a campo (nós 124:2113 e 282:4917).
const FIGMA = {
  painelLargura: 282,
  painelColapsada: 88,
  painelRaio: "24px",
  painelBorda: 16,
  painelPadding: "16px 8px",
  painelGap: "20px",
  itemAltura: 36,
  itemLargura: 230,
  itemPadding: "8px",
  itemRaio: "6px",
  rotulo: "13px/18px",
  rotuloPeso: "500",
  rotuloMaxLargura: "160px",
  toggleTamanho: 32,
  toggleDireita: 3,
  toggleTopo: 59,
  switchLargura: 68,
  switchAltura: 36,
  switchPadding: "2px",
  userAltura: 40,
  userRaio: "12px",
  userPadding: "10px 8px",
  avatar: 32,
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:4321/navigation/sidebar", { waitUntil: "networkidle" });
if (tema === "escuro") {
  await page.evaluate(() => document.documentElement.classList.add("dark"));
}
// `networkidle` pode resolver com o HTML sem o CSS do Tailwind aplicado — em
// dev o Next compila sob demanda. Espere um sinal do próprio componente.
await page.waitForFunction(
  () => {
    const nav = document.querySelector('nav[aria-label="Navegação principal"]');
    return nav && Math.round(nav.getBoundingClientRect().width) === 282;
  },
  { timeout: 30000 }
);
await page.waitForFunction(() => document.fonts.status === "loaded");
await page.waitForTimeout(200);

const r = await page.evaluate(() => {
  const lum = (c) => {
    const [r, g, b] = c
      .match(/\d+(\.\d+)?/g)
      .map(Number)
      .slice(0, 3)
      .map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const l1 = lum(a),
      l2 = lum(b);
    return +(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2));
  };
  const paineis = document.querySelectorAll('nav[aria-label="Navegação principal"]');
  const nav = paineis[0],
    col = paineis[1];
  const wrap = nav.parentElement;
  const cs = getComputedStyle(nav);
  const fundo = (cs.backgroundImage.match(/rgb\([^)]+\)/g) || ["rgb(255,255,255)"])[0];
  const item = nav.querySelector("li:first-child a"),
    is = getComputedStyle(item);
  const sel = nav.querySelector('[aria-current="page"]'),
    ss = getComputedStyle(sel);
  const lbl = sel.querySelector("span > span:last-child"),
    ls = getComputedStyle(lbl);
  const ico = getComputedStyle(sel.querySelector("svg"));
  const tg = wrap.querySelector(":scope > button"),
    ts = getComputedStyle(tg);
  const sw = wrap.querySelector('[role="radiogroup"]'),
    sws = getComputedStyle(sw);
  const ativo = sw.querySelector('[aria-checked="true"]'),
    as = getComputedStyle(ativo);
  const user = [...wrap.querySelectorAll("button")].find((b) => b.textContent.includes("@")),
    us = getComputedStyle(user);
  const nome = user.querySelector("span span span"),
    email = nome.nextElementSibling;
  const av = user.querySelector("span span"),
    avs = getComputedStyle(av);
  const wr = wrap.getBoundingClientRect(),
    tr = tg.getBoundingClientRect();

  const foco = [];
  for (const el of [item, sel, tg, user, ativo]) {
    el.focus();
    const s = getComputedStyle(el);
    foco.push({
      alvo: el.getAttribute("aria-label") || el.textContent.trim().slice(0, 16),
      anel: `${s.outlineWidth} ${s.outlineColor} offset ${s.outlineOffset}`,
    });
  }
  // o screenshot sai depois desta medição: devolver o foco evita anel de foco
  // congelado na imagem.
  document.activeElement?.blur?.();

  return {
    medido: {
      painelLargura: nav.getBoundingClientRect().width,
      painelColapsada: col.getBoundingClientRect().width,
      painelRaio: cs.borderRadius,
      painelBorda: parseFloat(cs.borderTopWidth),
      painelPadding: cs.padding,
      painelGap: cs.gap,
      itemAltura: item.getBoundingClientRect().height,
      itemLargura: item.getBoundingClientRect().width,
      itemPadding: is.padding,
      itemRaio: is.borderRadius,
      rotulo: `${ls.fontSize}/${ls.lineHeight}`,
      rotuloPeso: ls.fontWeight,
      rotuloMaxLargura: ls.maxWidth,
      toggleTamanho: tr.width,
      toggleDireita: +(wr.right - tr.right).toFixed(1),
      toggleTopo: +(tr.top - wr.top).toFixed(1),
      switchLargura: sw.getBoundingClientRect().width,
      switchAltura: sw.getBoundingClientRect().height,
      switchPadding: sws.padding,
      userAltura: user.getBoundingClientRect().height,
      userRaio: us.borderRadius,
      userPadding: `${us.paddingLeft} ${us.paddingRight}`,
      avatar: parseFloat(avs.width),
    },
    cores: {
      itemRepouso: is.color,
      itemSelecionadoBg: ss.backgroundColor,
      itemSelecionadoTexto: ss.color,
      itemSelecionadoIcone: ico.color,
      painelTopo: fundo,
      switchAtivoBg: as.backgroundColor,
      avatar: avs.backgroundColor,
      toggleBg: ts.backgroundColor,
    },
    contraste: {
      "item repouso": ratio(is.color, fundo),
      "item selecionado": ratio(ss.color, ss.backgroundColor),
      "nome do usuário": ratio(getComputedStyle(nome).color, fundo),
      "e-mail": ratio(getComputedStyle(email).color, fundo),
      "chevron do toggle": ratio(ts.color, ts.backgroundColor),
    },
    foco,
    focaveis: nav.querySelectorAll("a[href], button").length,
  };
});

if (dir) {
  const paineis = await page.$$('nav[aria-label="Navegação principal"]');
  for (const [i, p] of paineis.entries()) {
    const wrap = (await p.evaluateHandle((n) => n.parentElement)).asElement();
    await wrap.screenshot({ path: `${dir}/sb-${i === 0 ? "aberta" : "colapsada"}-${tema}.png` });
  }
}

const divergencias = [];
for (const [k, esperado] of Object.entries(FIGMA)) {
  const obtido = r.medido[k];
  const igual = typeof esperado === "number" ? Math.abs(obtido - esperado) < 0.5 : obtido === esperado;
  if (!igual) divergencias.push(`   ✗ ${k}: Figma ${esperado} · render ${obtido}`);
}

console.log(`SIDEBAR · tema ${tema}`);
console.log(`  geometria: ${Object.keys(FIGMA).length - divergencias.length}/${Object.keys(FIGMA).length} campos batem com o Figma`);
for (const d of divergencias) console.log(d);
console.log(`  cores: ${JSON.stringify(r.cores)}`);

// Texto normal precisa de 4.5:1; ícone e componente gráfico, 3:1 (WCAG 1.4.11).
const MINIMO = { "chevron do toggle": 3 };
const reprovados = Object.entries(r.contraste).filter(([k, v]) => v < (MINIMO[k] ?? 4.5));
console.log(`  contraste: ${JSON.stringify(r.contraste)}`);
for (const [k, v] of reprovados) console.log(`   ✗ ${k}: ${v}:1 abaixo do mínimo`);

const semAnel = r.foco.filter((f) => f.anel.startsWith("0px"));
console.log(`  foco: ${r.foco.length - semAnel.length}/${r.foco.length} com anel · ${r.focaveis} focáveis no painel`);
for (const f of semAnel) console.log(`   ✗ sem anel de foco: ${f.alvo}`);

const falhas = divergencias.length + reprovados.length + semAnel.length;
console.log(falhas === 0 ? "\n✓ sem divergência" : `\n✗ ${falhas} problema(s)`);
await browser.close();
process.exit(falhas === 0 ? 0 : 1);
