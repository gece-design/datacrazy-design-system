#!/usr/bin/env node
/**
 * lote-report.mjs — relatório de lote apresentável pro cliente (v2.5)
 * Uso (raiz do produto): node <kit>/scripts/lote-report.mjs <lote> [pasta-imgs]
 * Lê a linha do lote em docs/processo/metrics.md e os pares <item>.figma.png /
 * <item>.render.png (+ opcional <item>.diff.txt com o %) da pasta
 * (default: reports/lote-<lote>/). Gera reports/lote-<lote>.html.
 * Zero dependências.
 */
import fs from 'node:fs';
import path from 'node:path';

const lote = process.argv[2];
if (!lote) { console.error('Uso: node lote-report.mjs <lote> [pasta-imgs]'); process.exit(2); }
const imgDir = process.argv[3] || `reports/lote-${lote}`;
const outFile = `reports/lote-${lote}.html`;

/** v3.2: o maquinário mora em docs/processo/. Fallback pro caminho antigo
 *  enquanto o produto não roda `kfe-docs.mjs init`. */
const doc = f => fs.existsSync(`docs/processo/${f}`) ? `docs/processo/${f}` : `docs/${f}`;

let produto = 'Produto';
try {
  const st = fs.readFileSync(doc('kfe-state.md'), 'utf8');
  produto = (st.match(/Produto:\s*([^·\n]+)/) || [])[1]?.trim() || produto;
} catch {}

let row = null;
try {
  const mm = fs.readFileSync(doc('metrics.md'), 'utf8');
  for (const m of mm.matchAll(/^\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/gm)) {
    const c = m.slice(1).map(s => s.trim());
    if (c[0] === String(lote)) { row = { itens: c[1], tempo: c[2], diff: c[3], ciclos: c[4], corr: c[5], data: c[6] }; break; }
  }
} catch {}

const pairs = [];
if (fs.existsSync(imgDir)) {
  for (const f of fs.readdirSync(imgDir).filter(f => f.endsWith('.figma.png')).sort()) {
    const item = f.replace('.figma.png', '');
    const render = path.join(imgDir, `${item}.render.png`);
    if (!fs.existsSync(render)) continue;
    let diff = null;
    const dtxt = path.join(imgDir, `${item}.diff.txt`);
    if (fs.existsSync(dtxt)) diff = fs.readFileSync(dtxt, 'utf8').trim();
    const rel = p => path.relative(path.dirname(outFile), p).split(path.sep).join('/');
    pairs.push({ item, figma: rel(path.join(imgDir, f)), render: rel(render), diff });
  }
}

const stat = (l, v) => `<div class="s"><div class="l">${l}</div><div class="v">${v ?? '—'}</div></div>`;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>${produto} — lote ${lote}</title><style>
body{font:15px/1.6 Inter,system-ui,sans-serif;color:#1B2430;max-width:960px;margin:40px auto;padding:0 24px}
h1{font-size:24px;margin:0}.mut{color:#5A6472}
.stats{display:flex;gap:14px;margin:22px 0}.s{background:#F1F5FC;border-radius:12px;padding:14px 18px;flex:1}
.l{font-size:12px;color:#5A6472}.v{font-size:22px;font-weight:700;color:#1E4FC4}
.pair{margin:26px 0;padding:18px;border:1px solid #E3E8F2;border-radius:12px}
.pair h3{margin:0 0 4px;font-size:16px}.imgs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}
.imgs figure{margin:0}.imgs img{width:100%;border:1px solid #E3E8F2;border-radius:8px}
figcaption{font-size:12px;color:#5A6472;margin-top:4px}
.ok{color:#0F7B4D;font-weight:600}.foot{margin-top:34px;font-size:12px;color:#8FA0BC}
</style></head><body>
<h1>${produto} — relatório do lote ${lote}</h1>
<div class="mut">${row?.data || new Date().toISOString().slice(0, 10)} · gerado pelo Kill Front-End</div>
<div class="stats">${stat('Itens', row?.itens)}${stat('Tempo', row?.tempo)}${stat('Fidelidade média', row?.diff)}${stat('Ciclos médios', row?.ciclos)}</div>
${pairs.map(p => `<div class="pair"><h3>${p.item}</h3>${p.diff ? `<span class="ok">diff ${p.diff}</span>` : ''}<div class="imgs"><figure><img src="${p.figma}" alt="Figma — ${p.item}"><figcaption>Figma (verdade)</figcaption></figure><figure><img src="${p.render}" alt="Render — ${p.item}"><figcaption>Código (render)</figcaption></figure></div></div>`).join('') || '<p class="mut">Sem pares de imagem em ' + imgDir + ' — o relatório sai só com os números.</p>'}
<div class="foot">Fidelidade medida por diff de pixels (scripts/pixel-diff.js) contra o export do Figma, no viewport do frame.</div>
</body></html>`;

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, html);
console.log(`Relatório: ${outFile} (${pairs.length} pares de imagem)`);
