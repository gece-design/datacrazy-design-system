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
    padding: "16px", gap: "12px", radius: "6px", borderWidth: "1px",
    // 140 é a altura da FILEIRA: numa grade os cards esticam para o mais alto.
    // O Figma dá 139 para o Neutral isolado e 140 para Up/Down — a diferença é
    // o slot, 1px mais baixo no Neutral porque as barras medem 13 e a seta 16.
    altura: 140,
    fill: { bg: [255, 255, 255], border: [255, 255, 255] },
    outline: { bg: null, border: [255, 255, 255], borderWidth: "2px", gap: "16px", altura: 172 },
  },
  titulo: { size: "13px", lineHeight: "18px", weight: "600", cor: [106, 117, 129] },
  slot: {
    ladoNeutral: 27, ladoSeta: 28, radius: "6px",
    fill: { bg: [232, 241, 255], border: null },
    outline: { bg: null, border: [232, 241, 255] },
    glifo: { lado: 12, cor: [51, 133, 255] },
  },
  valor: { size: "26px", lineHeight: "32px", weight: "600", tracking: -0.601, cor: [28, 28, 37] },
  chip: {
    padding: "4px 8px", radius: "4px", size: "12px", lineHeight: "16px", weight: "500",
    fill: { bg: [235, 237, 239], cor: [106, 117, 129] },
    // No Outline o chip é o rodapé: fundo `card`, texto `foreground`, 8/6.
    outline: { bg: [255, 255, 255], cor: [28, 28, 37], padding: "6px 8px" },
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
  // O card é o único elemento com gap 12 e recuo de 16 (1 de traço + 15 de
  // padding) — assinatura do Figma.
  const recuo = (s) => parseFloat(s.paddingTop) + parseFloat(s.borderTopWidth);
  const todos = [...document.querySelectorAll("div")];
  const cards = todos.filter((el) => { const s = getComputedStyle(el); return s.rowGap === "12px" && recuo(s) === 16; });
  const outlines = todos.filter((el) => { const s = getComputedStyle(el); return s.rowGap === "16px" && recuo(s) === 16 && s.borderTopWidth === "2px"; });
  const ler = (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const titulo = el.querySelector("p.truncate");
    const slot = el.querySelector("span");
    const glifo = el.querySelector("span > *");
    const valor = [...el.querySelectorAll("p")].find((p) => p !== titulo);
    // No Fill o chip é o último bloco. No Outline o último bloco é o rodapé
    // inteiro, e o chip é o span de dentro.
    const chip = el.querySelector(":scope > div:last-child > span") ?? el.querySelector(":scope > div:last-child");
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
        glifoCor: g(slot).color, glifoW: glifo ? Math.round(box(glifo).width) : null,
      },
      valor: g(valor) && { size: g(valor).fontSize, lineHeight: g(valor).lineHeight, weight: g(valor).fontWeight, tracking: g(valor).letterSpacing, cor: g(valor).color, variant: g(valor).fontVariantNumeric },
      chip: g(chip) && { padding: `${g(chip).paddingTop} ${g(chip).paddingLeft}`, radius: g(chip).borderTopLeftRadius, size: g(chip).fontSize, lineHeight: g(chip).lineHeight, weight: g(chip).fontWeight, bg: g(chip).backgroundColor, border: g(chip).borderTopColor, cor: g(chip).color },
    };
  };
  return { total: cards.length, primeiro: ler(cards[0]), seta: ler(cards[1]), outline: ler(outlines[0]) };
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

conf("slot neutral · altura", f.slot.h, SPEC.slot.ladoNeutral);
conf("slot seta · altura", medido.seta.slot.h, SPEC.slot.ladoSeta);
conf("slot seta · largura", medido.seta.slot.w, SPEC.slot.ladoSeta);
conf("slot · radius", f.slot.radius, SPEC.slot.radius);
confCor("slot fill · fundo", f.slot.bg, SPEC.slot.fill.bg);
conf("glifo neutral · largura (3 barras + 2 gaps)", f.slot.glifoW, SPEC.slot.glifo.lado);
confCor("glifo · cor", f.slot.glifoCor, SPEC.slot.glifo.cor);

conf("valor · tamanho", f.valor.size, SPEC.valor.size);
conf("valor · entrelinha", f.valor.lineHeight, SPEC.valor.lineHeight);
conf("valor · peso", f.valor.weight, SPEC.valor.weight);
conf("valor · tracking", Math.round(parseFloat(f.valor.tracking) * 1000) / 1000, SPEC.valor.tracking);
confCor("valor · cor", f.valor.cor, SPEC.valor.cor);
conf("valor · tabular-nums (regra D7)", f.valor.variant, "tabular-nums");

conf("chip · recuo", f.chip.padding, SPEC.chip.padding);
conf("chip · radius", f.chip.radius, SPEC.chip.radius);
conf("chip · tamanho", f.chip.size, SPEC.chip.size);
conf("chip · peso", f.chip.weight, SPEC.chip.weight);
confCor("chip fill · fundo", f.chip.bg, SPEC.chip.fill.bg);
confCor("chip fill · cor", f.chip.cor, SPEC.chip.fill.cor);

const o = medido.outline;
conf("outline · traço", o.card.borderWidth, SPEC.card.outline.borderWidth);
conf("outline · recuo (traço+padding)", `${parseFloat(o.card.padding) + parseFloat(o.card.borderWidth)}px`, SPEC.card.padding);
conf("outline · gap", o.card.gap, SPEC.card.outline.gap);
conf("outline · altura", o.card.h, SPEC.card.outline.altura);
confCor("outline · fundo", o.card.bg, SPEC.card.outline.bg);
confCor("outline · borda", o.card.border, SPEC.card.outline.border);
conf("outline rodapé · recuo", o.chip.padding, SPEC.chip.outline.padding);
confCor("outline rodapé · fundo", o.chip.bg, SPEC.chip.outline.bg);
confCor("outline rodapé · cor", o.chip.cor, SPEC.chip.outline.cor);

await browser.close();

console.log(`PASSOU (${oks.length}):`);
for (const l of oks) console.log("  ok   " + l);
if (falhas.length) {
  console.log(`\nFALHOU (${falhas.length}):`);
  for (const l of falhas) console.log("  FAIL " + l);
}
console.log(`\n${falhas.length === 0 ? "TUDO BATENDO" : `${falhas.length} DIVERGÊNCIA(S)`} · ${oks.length}/${oks.length + falhas.length}`);
process.exit(falhas.length ? 1 : 0);
