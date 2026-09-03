#!/usr/bin/env node
/**
 * pixel-diff.js — verificação objetiva de fidelidade (Kill Front-End v2.1)
 * Uso: node scripts/pixel-diff.js <figma.png> <render.png> [saida-diff.png] [--threshold=0.1] [--max=1.0]
 * Saída: % de pixels divergentes + PASS/FAIL contra --max (default 1.0%).
 * Falha também se as dimensões divergirem (geometria = zero tolerância).
 * Requer: npm i -D pixelmatch pngjs
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const flags = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.replace('--', '').split('=')));
const [figmaPath, renderPath, outPath = 'diff.png'] = args;
const threshold = parseFloat(flags.threshold ?? '0.1'); // sensibilidade anti-aliasing
const maxPct = parseFloat(flags.max ?? '1.0');          // limiar de aceite (%)

if (!figmaPath || !renderPath) {
  console.error('Uso: node pixel-diff.js <figma.png> <render.png> [diff.png] [--threshold=0.1] [--max=1.0]');
  process.exit(2);
}
const a = PNG.sync.read(fs.readFileSync(figmaPath));
const b = PNG.sync.read(fs.readFileSync(renderPath));
if (a.width !== b.width || a.height !== b.height) {
  console.error(`FAIL geometria: ${a.width}x${a.height} (figma) vs ${b.width}x${b.height} (render).`);
  console.error('Dimensões devem ser idênticas — confira viewport e deviceScaleFactor.');
  process.exit(1);
}
const diff = new PNG({ width: a.width, height: a.height });
const bad = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold, includeAA: false });
fs.writeFileSync(outPath, PNG.sync.write(diff));
const pct = (bad / (a.width * a.height)) * 100;
const ok = pct <= maxPct;
console.log(`${ok ? 'PASS' : 'FAIL'} · diff ${pct.toFixed(3)}% (${bad} px) · limite ${maxPct}% · mapa: ${path.resolve(outPath)}`);
process.exit(ok ? 0 : 1);
