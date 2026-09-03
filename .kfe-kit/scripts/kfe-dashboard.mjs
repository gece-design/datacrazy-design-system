#!/usr/bin/env node
/**
 * kfe-dashboard.mjs — painel visual automático do Kill Front-End (v2.4)
 * Uso (na raiz do produto): node <kit>/scripts/kfe-dashboard.mjs [porta]
 * Lê docs/processo/kfe-state.md + docs/processo/metrics.md e renderiza a jornada
 * gamificada em http://localhost:4242 — auto-atualiza a cada 3s.
 * Zero dependências.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = parseInt(process.argv[2] || '4242', 10);
/** v3.2: o maquinário mora em docs/processo/. Fallback pro caminho antigo
 *  enquanto o produto não roda `kfe-docs.mjs init`. */
const doc = f => fs.existsSync(`docs/processo/${f}`) ? `docs/processo/${f}` : `docs/${f}`;
const STATE = path.resolve(doc('kfe-state.md'));
const METRICS = path.resolve(doc('metrics.md'));

function parseState() {
  if (!fs.existsSync(STATE)) return { error: 'docs/processo/kfe-state.md não encontrado — rode um comando /kfe-* primeiro.' };
  const md = fs.readFileSync(STATE, 'utf8');
  const meta = {};
  for (const line of md.split('\n').slice(0, 6)) {
    for (const part of line.replace(/^#.*/, '').split('·')) {
      const m = part.match(/\s*([\wÀ-ú ]+):\s*(.+)\s*/);
      if (m) meta[m[1].trim()] = m[2].trim();
    }
  }
  const stages = [];
  for (const m of md.matchAll(/^\|\s*(\d|0[ab])\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/gm)) {
    const [, num, etapa, status, gate, aprovado] = m.map(s => (s || '').trim());
    if (/^-+$/.test(etapa)) continue;
    stages.push({ num, etapa, status: status.toLowerCase(), gate, aprovado });
  }
  const lotes = [];
  const lotesSec = md.split(/## Lotes/)[1]?.split(/\n## /)[0] || '';
  for (const m of lotesSec.matchAll(/^\|\s*([^|#-][^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/gm)) {
    const cols = m.slice(1).map(s => s.trim());
    if (cols[0].toLowerCase() === 'lote' || /^-+$/.test(cols[0])) continue;
    lotes.push({ lote: cols[0], itens: cols[1], tempo: cols[2], diff: cols[3], gate: cols[4] });
  }
  const log = [...(md.split(/## Log/)[1] || '').matchAll(/^- (.+)$/gm)].map(m => m[1]).slice(-8).reverse();
  let metrics = null;
  if (fs.existsSync(METRICS)) {
    const mm = fs.readFileSync(METRICS, 'utf8');
    const g = mm.match(/Ganho:\s*([^\n]+)/);
    metrics = { ganho: g ? g[1].trim() : null };
  }
  return { meta, stages, lotes, log, metrics, ts: Date.now() };
}

const HTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Kill Front-End — painel</title>
<style>
  :root{--bg:#10151F;--card:#171E2B;--ink:#EAF0FA;--mut:#8FA0BC;--blue:#2F6FED;
    --ok:#3ECF8E;--warn:#F5B83D;--bad:#F26D6D;--pend:#3A4457}
  *{box-sizing:border-box;margin:0}body{background:var(--bg);color:var(--ink);
    font:15px/1.5 Inter,system-ui,sans-serif;padding:32px;max-width:1080px;margin:auto}
  h1{font-size:26px;margin-bottom:4px}.mut{color:var(--mut)}
  .bar{height:12px;background:var(--pend);border-radius:8px;overflow:hidden;margin:14px 0 6px}
  .bar i{display:block;height:100%;background:linear-gradient(90deg,var(--blue),var(--ok));
    border-radius:8px;transition:width .6s}
  .map{display:flex;flex-wrap:wrap;gap:26px 34px;margin:26px 0;padding:22px;
    background:var(--card);border-radius:14px}
  .st{width:96px;text-align:center;position:relative}
  .c{width:64px;height:64px;border-radius:50%;margin:0 auto 8px;display:flex;
    align-items:center;justify-content:center;font-weight:700;font-size:11px;
    background:var(--pend);color:var(--mut);border:3px solid transparent}
  .concluída .c{background:var(--ok);color:#08281A}
  .em-andamento .c{background:var(--blue);color:#fff;animation:pu 1.4s infinite}
  .aguardando-gate .c{background:var(--warn);color:#3A2A05}
  .bloqueada .c{background:var(--bad);color:#fff}
  @keyframes pu{50%{box-shadow:0 0 0 10px rgba(47,111,237,.18)}}
  .tag{font-size:10px;letter-spacing:.4px;text-transform:uppercase;color:var(--mut)}
  .grid{display:grid;grid-template-columns:1.3fr .9fr;gap:18px}
  .card{background:var(--card);border-radius:14px;padding:18px}
  .badges{display:flex;flex-wrap:wrap;gap:10px}
  .bg{padding:8px 12px;border-radius:20px;background:#20304D;font-size:12.5px}
  .bg.off{opacity:.32;filter:grayscale(1)}
  table{width:100%;border-collapse:collapse;font-size:13px}
  td,th{padding:6px 8px;text-align:left;border-bottom:1px solid #232C3D}
  .quest{border-left:4px solid var(--warn);padding-left:12px}
  .log li{color:var(--mut);font-size:12.5px;margin-bottom:4px}
</style></head><body>
<h1 id="titulo">Kill Front-End</h1><div class="mut" id="sub">carregando…</div>
<div class="bar"><i id="prog" style="width:0%"></i></div>
<div class="mut" id="pct"></div>
<div class="map" id="map"></div>
<div class="grid">
  <div class="card"><h3>🎯 Missão atual</h3><div class="quest" id="quest">—</div>
    <h3 style="margin-top:16px">🏅 Conquistas</h3><div class="badges" id="badges"></div></div>
  <div class="card"><h3>📦 Lotes</h3><table id="lotes"></table>
    <h3 style="margin-top:14px">🕓 Últimos eventos</h3><ul class="log" id="log"></ul></div>
</div>
<script>
const icon=s=>({'concluída':'✓','em-andamento':'▶','aguardando-gate':'🔒','bloqueada':'✕'}[s]||'');
async function tick(){
  const r=await fetch('/state.json');const d=await r.json();
  if(d.error){document.getElementById('sub').textContent=d.error;return}
  const m=d.meta;
  document.getElementById('titulo').textContent=(m['Produto']||'Kill Front-End');
  document.getElementById('sub').textContent='Cenário '+(m['Cenário']||'—')+' · Modo '+(m['Modo']||'—')+' · '+(m['Kit']||'')+(m['Baseline de fidelidade']&&m['Baseline de fidelidade']!=='—'?' · fidelidade '+m['Baseline de fidelidade']:'');
  const done=d.stages.filter(s=>s.status==='concluída').length;
  const pct=d.stages.length?Math.round(done/d.stages.length*100):0;
  document.getElementById('prog').style.width=pct+'%';
  document.getElementById('pct').textContent=done+' de '+d.stages.length+' etapas · nível '+pct+'%';
  document.getElementById('map').innerHTML=d.stages.map(s=>'<div class="st '+s.status.replace(/\\s.*/,'')+'"><div class="c">'+(icon(s.status)||'')+' '+s.etapa.split('(')[0].trim()+'</div><div class="tag">'+s.status+'</div></div>').join('');
  const nx=d.stages.find(s=>s.status!=='concluída');
  document.getElementById('quest').innerHTML=nx?('<b>'+nx.etapa.trim()+'</b><br><span class="mut">'+(nx.status==='aguardando-gate'?'Aguardando você: gate '+nx.gate:nx.status==='bloqueada'?'Bloqueada — veja o protocolo de falha no chat':'Próxima do loop · gate: '+nx.gate)+'</span>'):'🏆 Ciclo completo!';
  const has=t=>d.log.some(l=>l.toLowerCase().includes(t));
  const B=[['🚀 Kickoff',d.stages.length>0],['🎨 Piloto aprovada',d.stages.some(s=>/MCP/i.test(s.etapa)&&s.status==='concluída')],['🎯 Fidelidade ≤1%',parseFloat((m['Baseline de fidelidade']||'').replace(',','.'))<=1],['📦 1º lote',d.lotes.length>=1],['🔥 5 lotes',d.lotes.length>=5],['🛡️ Golden ativa',has('golden')],['🔁 Retro feita',has('retro')],['🏆 Ciclo completo',d.stages.length>0&&d.stages.every(s=>s.status==='concluída')]];
  document.getElementById('badges').innerHTML=B.map(([n,on])=>'<span class="bg'+(on?'':' off')+'">'+n+'</span>').join('');
  document.getElementById('lotes').innerHTML='<tr><th>Lote</th><th>Itens</th><th>Tempo</th><th>Diff</th></tr>'+(d.lotes.map(l=>'<tr><td>'+l.lote+'</td><td>'+l.itens+'</td><td>'+l.tempo+'</td><td>'+l.diff+'</td></tr>').join('')||'<tr><td colspan=4 class=mut>ainda sem lotes</td></tr>');
  document.getElementById('log').innerHTML=d.log.map(l=>'<li>'+l+'</li>').join('')||'<li>—</li>';
}
tick();setInterval(tick,3000);
</script></body></html>`;

http.createServer((req, res) => {
  if (req.url === '/state.json') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(parseState()));
  } else {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(HTML);
  }
}).listen(PORT, () => console.log(`Painel Kill Front-End: http://localhost:${PORT} (lendo ${STATE})`));
