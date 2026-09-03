#!/usr/bin/env node
/**
 * kfe-interactions.mjs — a memória de interação do KFE (v3.1)
 * Uso (raiz do produto): node <kit>/scripts/kfe-interactions.mjs <comando>
 *
 *   precedent <Componente> <familia> <estado>   qual precedente citar (nível 4)
 *   audit                                        divergências dentro da família
 *   pending                                      inferências sem aprovação de gate
 *   summary                                      cobertura de estados por família
 *
 * Lê docs/processo/components-registry.json (escrito pela fw-doc a cada lote).
 * Zero dependências. Não decide nada sozinho: só devolve o precedente para a
 * fw-ui CITAR. Sem precedente, a saída é NENHUM — e isso é bloqueio, não chute.
 */
import fs from 'node:fs';

/** v3.2: o maquinário mora em docs/processo/. Fallback pro caminho antigo
 *  enquanto o produto não roda `kfe-docs.mjs init`. */
const doc = f => fs.existsSync(`docs/processo/${f}`) ? `docs/processo/${f}` : `docs/${f}`;
const FILE = doc('components-registry.json');
const CONFIAVEIS = ['figma', 'declarado', 'humano', 'banco'];

function load() {
  if (!fs.existsSync(FILE)) {
    console.error(`Registro não encontrado: ${FILE}\nCrie em docs/processo/ a partir de <kit>/templates/components-registry.json (fw-install).`);
    process.exit(2);
  }
  const reg = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  reg.components = (reg.components || []).filter(c => c.name && !String(c.name).startsWith('<'));
  return reg;
}

const ordem = c => Number(c.batch ?? 0);
const aprovado = s => CONFIAVEIS.includes(s.source) || (s.source === 'inferido' && !!s.approvedIn);

function precedent([nome, familia, estado]) {
  if (!nome || !familia || !estado) {
    console.error('Uso: precedent <Componente> <familia> <estado>'); process.exit(2);
  }
  const reg = load();
  const cand = reg.components
    .filter(c => c.family === familia && c.name !== nome)
    .filter(c => c.states?.[estado] && aprovado(c.states[estado]))
    .sort((a, b) => ordem(b) - ordem(a));

  if (!cand.length) {
    console.log(`PRECEDENTE: NENHUM (${familia}/${estado})`);
    console.log('AÇÃO: BLOQUEIO — nível 5 da cadeia. Pergunte ao humano; a resposta vira regra local em docs/processo/interactions.md.');
    process.exit(1);
  }
  const c = cand[0], s = c.states[estado];
  console.log(`PRECEDENTE: ${c.name}/${estado} (família ${familia}, lote ${c.batch ?? '?'}, origem ${s.source})`);
  console.log(`APLICAR: ${s.impl}${s.rule ? `  [regra ${s.rule}]` : ''}`);
  console.log(`CITAÇÃO PARA O GATE: "${estado} de ${nome} = igual ao ${estado} de ${c.name} (${familia}, lote ${c.batch ?? '?'})"`);
  if (cand.length > 1) {
    const outros = [...new Set(cand.map(x => x.states[estado].impl))];
    if (outros.length > 1) console.log(`ATENÇÃO: a família tem ${outros.length} implementações diferentes deste estado — rode 'audit' antes de copiar.`);
  }
}

function audit() {
  const reg = load();
  const mapa = new Map();
  for (const c of reg.components)
    for (const [estado, s] of Object.entries(c.states || {})) {
      if (s.source === 'figma') continue;           // camada 1: desenhado é verdade absoluta, não compara
      const k = `${c.family}/${estado}`;
      const criterio = s.rule || s.impl;            // mesma REGRA com tokens diferentes não é divergência
      if (!mapa.has(k)) mapa.set(k, new Map());
      const usos = mapa.get(k);
      if (!usos.has(criterio)) usos.set(criterio, []);
      usos.get(criterio).push(`${c.name}${s.rule ? '' : ` (${s.impl})`}`);
    }
  let n = 0;
  for (const [k, usos] of mapa) {
    if (usos.size > 1) {
      n++;
      console.log(`DIVERGÊNCIA · ${k}`);
      for (const [criterio, comps] of usos) console.log(`  ${criterio}  ←  ${comps.join(', ')}`);
    }
  }
  console.log(n ? `\n${n} divergência(s) de REGRA dentro de família. Isso é perda de fidelidade: unifique, ou registre a exceção como regra local em docs/processo/interactions.md.`
                : 'OK — nenhuma divergência de regra dentro de família.');
  process.exit(n ? 1 : 0);
}

function pending() {
  const reg = load();
  const linhas = [];
  for (const c of reg.components)
    for (const [estado, s] of Object.entries(c.states || {}))
      if (s.source === 'inferido' && !s.approvedIn)
        linhas.push(`| ${c.name} | ${estado} | ${s.impl} | ${s.precedent || '— SEM PRECEDENTE (bug: não deveria existir)'} | ${c.batch ?? '?'} |`);
  if (!linhas.length) { console.log('Nenhuma inferência pendente de gate.'); return; }
  console.log('| Componente | Estado | O que foi aplicado | Precedente citado | Lote |');
  console.log('|---|---|---|---|---|');
  console.log(linhas.join('\n'));
  console.log(`\n${linhas.length} decisão(ões) inferida(s) para o humano aprovar em bloco no gate da UI.`);
}

function summary() {
  const reg = load();
  const fam = new Map();
  for (const c of reg.components) {
    if (!fam.has(c.family)) fam.set(c.family, { comps: 0, estados: new Map(), fontes: new Map() });
    const f = fam.get(c.family); f.comps++;
    for (const [estado, s] of Object.entries(c.states || {})) {
      f.estados.set(estado, (f.estados.get(estado) || 0) + 1);
      f.fontes.set(s.source, (f.fontes.get(s.source) || 0) + 1);
    }
  }
  console.log(`Registro: ${reg.product || '?'} · ${reg.components.length} componente(s) · kit v${reg.kit || '?'}\n`);
  for (const [nome, f] of fam) {
    console.log(`${nome} — ${f.comps} componente(s)`);
    console.log(`  estados: ${[...f.estados].map(([e, n]) => `${e}(${n})`).join(' ') || '—'}`);
    console.log(`  origens: ${[...f.fontes].map(([s, n]) => `${s}(${n})`).join(' ') || '—'}`);
  }
}

const [cmd, ...rest] = process.argv.slice(2);
const comandos = { precedent: () => precedent(rest), audit, pending, summary };
if (!comandos[cmd]) {
  console.error('Comandos: precedent <Componente> <familia> <estado> | audit | pending | summary');
  process.exit(2);
}
comandos[cmd]();
