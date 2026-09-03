/**
 * medir-kpi-card.mjs — confere o render do KPI Card contra o que foi extraído
 * do Figma (component set 269:53), campo a campo.
 *
 * Não é screenshot: é valor computado pelo navegador contra valor do arquivo.
 * Cor com folga de ±2 por canal, porque os tokens passam por HSL e voltam.
 *
 * Uso: node scripts/medir-kpi-card.mjs [url]
 */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://localhost:4321/data-display/kpi-card";

/** Valores do Figma. Nenhum foi estimado — todos saíram do MCP. */
const SPEC = {
  card: {
    padding: "18px", gap: "14px", radius: "6px", borderWidth: "1px",
    altura: 148,
    fill: { bg: [255, 255, 255], border: [255, 255, 255] },
    outline: { bg: null, border: [255, 255, 255] },
  },
  titulo: { size: "13px", lineHeight: "18px", weight: "600", cor: [106, 117, 129] },
  slot: {
    lado: 28, radius: "6px",
    fill: { bg: [232, 241, 255], border: [232, 241, 255] },
    outline: { bg: null, border: [232, 241, 255] },
    glifo: { lado: 16, cor: [51, 133, 255] },
  },
  valor: { size: "26px", lineHeight: "32px", weight: "600", tracking: -0.601, cor: [28, 28, 37] },
  chip: {
    padding: "4px 8px", radius: "4px", size: "12px", lineHeight: "16px", weight: "500",
    fill: { bg: [244, 245, 246], cor: [106, 117, 129] },
    outline: { bg: null, border: [244, 245, 246], cor: [160, 168, 177] },
  },
};

const rgb = (s) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
const transparente = (s) => /rgba\(.*,\s*0\)/.test(s) || s === "transparent";

const falhas = [];
const oks = [];
function conf(nome, obtido, esperado) {
  const bate = String(obtido) === String(esperado);
  (bate ? oks : falhas).push(`${nome}: ${obtido}${bate ? "" : ` (esperado ${esperado})`}`);
}
function confCor(nome, obtidoStr, esperado) {
  if (esperado === null) {
    const bate = transparente(obtidoStr);
    (bate ? oks : falhas).push(`${nome}: ${obtidoStr}${bate ? "" : " (esperado transparente)"}`);
    return;
  }
  const o = rgb(obtidoStr);
  const bate = o.length === 3 && o.every((v, i) => Math.abs(v - esperado[i]) <= 2);
  (bate ? oks : falhas).push(
    `${nome}: rgb(${o.join(", ")})${bate ? "" : ` (esperado rgb(${esperado.join(", ")}))`}`,
  );
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: "networkidle" });

// Anti-fallback de fonte: o kit reprova o lote inteiro se a Geist não carregou.
const fonte = await page.evaluate(() => getComputedStyle(document.body).fontFamily.split(",")[0].replace(/["']/g, ""));
conf("fonte carregada", fonte, "GeistSans");

const medido = await page.evaluate(() => {
  // O card é o único elemento com gap 14 e recuo de 18 (1 de traço + 17 de
  // padding) — assinatura do Figma.
  const cards = [...document.querySelectorAll("div")].filter((el) => {
    const s = getComputedStyle(el);
    return s.rowGap === "14px" && parseFloat(s.paddingTop) + parseFloat(s.borderTopWidth) === 18;
  });
  const ler = (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const titulo = el.querySelector("p.truncate");
    const slot = el.querySelector("span");
    const svg = el.querySelector("svg");
    const valor = [...el.querySelectorAll("p")].find((p) => p !== titulo);
    const chip = el.querySelector(":scope > div:last-child");
    const g = (n) => (n ? getComputedStyle(n) : null);
    const box = (n) => (n ? n.getBoundingClientRect() : null);
    return {
      card: {
        padding: s.paddingTop, gap: s.rowGap, radius: s.borderTopLeftRadius,
        borderWidth: s.borderTopWidth, bg: s.backgroundColor, border: s.borderTopColor,
        w: Math.round(box(el).width), h: Math.round(box(el).height),
      },
      titulo: g(titulo) && { size: g(titulo).fontSize, lineHeight: g(titulo).lineHeight, weight: g(titulo).fontWeight, cor: g(titulo).color },
      slot: g(slot) && {
        w: Math.round(box(slot).width), h: Math.round(box(slot).height),
        radius: g(slot).borderTopLeftRadius, bg: g(slot).backgroundColor, border: g(slot).borderTopColor,
        glifoCor: g(slot).color, glifoW: svg ? Math.round(box(svg).width) : null,
      },
      valor: g(valor) && { size: g(valor).fontSize, lineHeight: g(valor).lineHeight, weight: g(valor).fontWeight, tracking: g(valor).letterSpacing, cor: g(valor).color, variant: g(valor).fontVariantNumeric },
      chip: g(chip) && { padding: `${g(chip).paddingTop} ${g(chip).paddingLeft}`, radius: g(chip).borderTopLeftRadius, size: g(chip).fontSize, lineHeight: g(chip).lineHeight, weight: g(chip).fontWeight, bg: g(chip).backgroundColor, border: g(chip).borderTopColor, cor: g(chip).color },
    };
  };
  return { total: cards.length, primeiro: ler(cards[0]), outline: ler(cards[4]) };
});

console.log(`\ncards encontrados na página: ${medido.total}\n`);

const f = medido.primeiro;
// Recuo efetivo = traço + padding. É assim que se compara com o Figma, que
// desenha o traço por dentro; comparar só o padding do CSS dá falso negativo.
conf("card · recuo (traço+padding)", `${parseFloat(f.card.padding) + parseFloat(f.card.borderWidth)}px`, SPEC.card.padding);
conf("card · gap", f.card.gap, SPEC.card.gap);
conf("card · radius", f.card.radius, SPEC.card.radius);
conf("card · borda", f.card.borderWidth, SPEC.card.borderWidth);
conf("card · altura calculada", f.card.h, SPEC.card.altura);
confCor("card fill · fundo", f.card.bg, SPEC.card.fill.bg);
confCor("card fill · borda", f.card.border, SPEC.card.fill.border);

conf("título · tamanho", f.titulo.size, SPEC.titulo.size);
conf("título · entrelinha", f.titulo.lineHeight, SPEC.titulo.lineHeight);
conf("título · peso", f.titulo.weight, SPEC.titulo.weight);
confCor("título · cor", f.titulo.cor, SPEC.titulo.cor);

conf("slot · largura", f.slot.w, SPEC.slot.lado);
conf("slot · altura", f.slot.h, SPEC.slot.lado);
conf("slot · radius", f.slot.radius, SPEC.slot.radius);
confCor("slot fill · fundo", f.slot.bg, SPEC.slot.fill.bg);
conf("glifo · lado", f.slot.glifoW, SPEC.slot.glifo.lado);
confCor("glifo · cor", f.slot.glifoCor, SPEC.slot.glifo.cor);

conf("valor · tamanho", f.valor.size, SPEC.valor.size);
conf("valor · entrelinha", f.valor.lineHeight, SPEC.valor.lineHeight);
conf("valor · peso", f.valor.weight, SPEC.valor.weight);
conf("valor · tracking", Math.round(parseFloat(f.valor.tracking) * 1000) / 1000, SPEC.valor.tracking);
confCor("valor · cor", f.valor.cor, SPEC.valor.cor);
conf("valor · tabular-nums (regra D7)", f.valor.variant, "tabular-nums");

conf("chip · recuo (traço+padding)", `${parseFloat(f.chip.padding) + 1}px ${parseFloat(f.chip.padding.split(" ")[1]) + 1}px`, SPEC.chip.padding);
conf("chip · radius", f.chip.radius, SPEC.chip.radius);
conf("chip · tamanho", f.chip.size, SPEC.chip.size);
conf("chip · peso", f.chip.weight, SPEC.chip.weight);
confCor("chip fill · fundo", f.chip.bg, SPEC.chip.fill.bg);
confCor("chip fill · cor", f.chip.cor, SPEC.chip.fill.cor);

const o = medido.outline;
confCor("card outline · fundo", o.card.bg, SPEC.card.outline.bg);
confCor("card outline · borda", o.card.border, SPEC.card.outline.border);
confCor("slot outline · fundo", o.slot.bg, SPEC.slot.outline.bg);
confCor("slot outline · borda", o.slot.border, SPEC.slot.outline.border);
confCor("chip outline · fundo", o.chip.bg, SPEC.chip.outline.bg);
confCor("chip outline · borda", o.chip.border, SPEC.chip.outline.border);
confCor("chip outline · cor", o.chip.cor, SPEC.chip.outline.cor);

await browser.close();

console.log(`PASSOU (${oks.length}):`);
for (const l of oks) console.log("  ok   " + l);
if (falhas.length) {
  console.log(`\nFALHOU (${falhas.length}):`);
  for (const l of falhas) console.log("  FAIL " + l);
}
console.log(`\n${falhas.length === 0 ? "TUDO BATENDO" : `${falhas.length} DIVERGÊNCIA(S)`} · ${oks.length}/${oks.length + falhas.length}`);
process.exit(falhas.length ? 1 : 0);
