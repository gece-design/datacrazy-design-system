#!/usr/bin/env node
/**
 * kfe-docs.mjs — a arquitetura da documentação do KFE (v3.2)
 * Uso (raiz do produto): node <kit>/scripts/kfe-docs.mjs <comando>
 *
 *   init [--dry]   cria a árvore docs/ a partir de <kit>/templates/docs/
 *                  (idempotente) e migra o layout antigo para o novo
 *   index          regenera os índices lendo os arquivos REAIS
 *   audit          verifica a arquitetura — exit 1 se houver erro
 *
 * Contrato: .claude/skills/kill-front-end/doc-architecture.md
 * Zero dependências. Não escreve conteúdo de produto: só estrutura e índice.
 * Índice gerado é índice que não mente — por isso nenhum README de pasta é
 * mantido à mão.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DOCS = 'docs';
const TPL = fileURLToPath(new URL('../templates/docs/', import.meta.url));

const CORE = [
  'README.md', '00-visao-geral.md', '01-arquitetura.md', '02-design-system.md',
  '03-contrato-api.md', '04-navegacao.md', '05-contratos.md', 'regras.md', 'glossario.md',
];
const DESCR = {
  'README.md': 'roteador — comece por aqui',
  '00-visao-geral.md': 'o que é, pra quem, escopo v1, NÃO-ESCOPO',
  '01-arquitetura.md': 'stack, lista negativa, estrutura, fronteira do back',
  '02-design-system.md': 'direção visual + fundações (tokens, fontes, motion)',
  '03-contrato-api.md': 'auth, envelope, paginação, erro',
  '04-navegacao.md': 'rotas + user flows',
  '05-contratos.md': 'catálogo de contratos (props, ports, estados)',
  'regras.md': 'regras de negócio transversais',
  'glossario.md': 'nome canônico de cada coisa',
  'api-contract.yaml': 'OpenAPI — consumido pelo back',
};
/** `item` = template de UM arquivo da pasta. O índice de cada pasta é sempre
 *  <pasta>/README.md, espelhando o destino em docs/. */
const PASTAS = {
  objetos: { item: 'objeto.md', rotulo: 'entidade(s) — atributos, invariantes, relações', resumo: 'Responsabilidade' },
  features: { item: 'feature.md', rotulo: 'feature(s) — casos de uso e áreas', resumo: 'Objetivo' },
  componentes: { item: 'componente.md', rotulo: 'componente(s) do design system', resumo: 'Responsabilidade' },
  processo: { item: null, rotulo: 'maquinário do KFE', resumo: null },
};
const SECOES = {
  objetos: ['Responsabilidade', 'Atributos', 'Invariantes / Regras', 'Relacionamentos', 'Usado em'],
  features: ['Objetivo', 'Atores', 'Pré-condições', 'Fluxo principal', 'Estados e exceções',
    'Regras de negócio', 'Objetos envolvidos', 'Componentes envolvidos', 'Rotas/telas', 'Contratos consumidos'],
  componentes: ['Responsabilidade', 'Família', 'Par no Figma', 'Props', 'Variantes', 'Estados',
    'Tokens consumidos', 'Composição', 'Exemplo de uso', 'Acessibilidade'],
};
/** Layout antigo → novo. `merge` = anexa como seção (não dá pra renomear 2 arquivos no mesmo destino). */
const RENOMEIA = [
  ['prd.md', '00-visao-geral.md'],
  ['stack.md', '01-arquitetura.md'],
];
const FUNDE = [
  ['escopo-v1.md', '00-visao-geral.md'],
  ['direcao-visual.md', '02-design-system.md'],
  ['flows.md', '04-navegacao.md'],
];
const PROCESSO = ['kfe-state.md', 'metrics.md', 'interactions.md', 'components-registry.json',
  'calibration.md', 'figma-checklist.md', 'fonts-checklist.md', 'audit.md', 'onboard-plan.md',
  'adr.md', 'qa-release.md', 'handoff-backend.md', 'kfe-retro.md'];
/** Caminhos canônicos que nascem em etapas posteriores: link para eles é aviso, não erro. */
const PENDENTES = new Set(['api-contract.yaml', ...PROCESSO.map(f => `processo/${f}`)]);
const MARCA_MIGRACAO = 'migrado de';
const LIMITE_LINHAS = 150;

const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const existe = p => fs.existsSync(p);
const ler = p => fs.readFileSync(p, 'utf8');
const mds = dir => (existe(dir) ? fs.readdirSync(dir) : [])
  .filter(f => f.endsWith('.md') && f !== 'README.md').sort();

function exigeDocs(cmd) {
  if (!existe(DOCS)) {
    console.error(`docs/ não encontrado na raiz atual.\n${cmd === 'init' ? 'Rode na raiz do produto.' : 'Rode `kfe-docs.mjs init` antes.'}`);
    process.exit(2);
  }
}
function emGit() {
  try { execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' }); return true; }
  catch { return false; }
}
function mover(de, para, git) {
  fs.mkdirSync(path.dirname(para), { recursive: true });
  if (git) { try { execFileSync('git', ['mv', de, para], { stdio: 'ignore' }); return; } catch { /* fallback */ } }
  fs.renameSync(de, para);
}

/* ---------------------------------------------------------------- init --- */

function init(args) {
  const dry = args.includes('--dry');
  const git = emGit();
  const log = [];
  const marca = dry ? '[dry] ' : '';
  fs.mkdirSync(DOCS, { recursive: true });

  // 1. Migrar o layout antigo ANTES de criar do template (senão o template ganha o nome).
  for (const [de, para] of RENOMEIA) {
    const src = path.join(DOCS, de), dst = path.join(DOCS, para);
    if (existe(src) && !existe(dst)) {
      if (!dry) mover(src, dst, git);
      log.push(`${marca}movido  docs/${de} → docs/${para}`);
    } else if (existe(src)) {
      log.push(`${marca}ATENÇÃO docs/${de} e docs/${para} coexistem — funda à mão e apague o antigo`);
    }
  }
  const especiais = new Set([...RENOMEIA.map(r => r[0]), ...FUNDE.map(r => r[0]), ...PROCESSO]);
  // specs/ → features/
  if (existe(path.join(DOCS, 'specs'))) {
    for (const f of mds(path.join(DOCS, 'specs'))) {
      const src = path.join(DOCS, 'specs', f), dst = path.join(DOCS, 'features', f);
      if (existe(dst)) { log.push(`${marca}ATENÇÃO docs/specs/${f} e docs/features/${f} coexistem — funda à mão`); continue; }
      if (!dry) mover(src, dst, git);
      log.push(`${marca}movido  docs/specs/${f} → docs/features/${f}`);
    }
    const resto = existe(path.join(DOCS, 'specs')) ? fs.readdirSync(path.join(DOCS, 'specs')) : [];
    if (!dry && resto.length === 0) fs.rmdirSync(path.join(DOCS, 'specs'));
  }
  // maquinário → processo/
  for (const f of PROCESSO) {
    const src = path.join(DOCS, f), dst = path.join(DOCS, 'processo', f);
    if (!existe(src)) continue;
    if (existe(dst)) { log.push(`${marca}ATENÇÃO docs/${f} e docs/processo/${f} coexistem — funda à mão`); continue; }
    if (!dry) mover(src, dst, git);
    log.push(`${marca}movido  docs/${f} → docs/processo/${f}`);
  }

  // 2. Criar do template o que falta (nunca sobrescrever).
  // O nome do produto sai do estado, se já existir — um placeholder a menos pra IA preencher.
  const est = path.join(DOCS, 'processo', 'kfe-state.md');
  const produto = existe(est) ? (ler(est).match(/Produto:\s*([^·\n]+)/) || [])[1]?.trim() : null;
  let criados = 0;
  const criar = (tplNome, destino) => {
    if (existe(destino)) return false;
    if (!existe(path.join(TPL, tplNome))) { log.push(`ERRO    template ausente no kit: templates/docs/${tplNome}`); return false; }
    if (!dry) {
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      const corpo = ler(path.join(TPL, tplNome));
      fs.writeFileSync(destino, produto ? corpo.replaceAll('<produto>', produto) : corpo);
    }
    log.push(`${marca}criado  ${destino}`); criados++; return true;
  };
  for (const f of CORE) criar(f, path.join(DOCS, f));
  for (const pasta of Object.keys(PASTAS)) {
    if (!dry) fs.mkdirSync(path.join(DOCS, pasta), { recursive: true });
    criar(`${pasta}/README.md`, path.join(DOCS, pasta, 'README.md'));
  }

  // 3. Fundir os arquivos que viraram seção de outro.
  for (const [de, para] of FUNDE) {
    const src = path.join(DOCS, de), dst = path.join(DOCS, para);
    if (!existe(src) || !existe(dst)) continue;
    if (!dry) {
      const corpo = ler(src).replace(/^#\s+.*$/m, '').trim();
      fs.appendFileSync(dst, `\n\n<!-- ${MARCA_MIGRACAO} ${de} — revisar e fundir na seção correta, depois apagar este comentário -->\n\n${corpo}\n`);
      fs.rmSync(src);
    }
    log.push(`${marca}fundido docs/${de} → docs/${para} (revisar: virou seção, não arquivo)`);
  }

  console.log(`\nDOC INIT${dry ? ' (simulação — nada foi escrito)' : ''}`);
  console.log(log.length ? log.map(l => '  ' + l).join('\n') : '  nada a criar nem migrar — árvore já está no formato');
  if (!dry && criados) console.log(`\nPróximo: preencha os arquivos e rode \`kfe-docs.mjs index\`.`);
  if (log.some(l => l.includes(MARCA_MIGRACAO) || l.includes('fundido'))) {
    console.log(`\nHá conteúdo migrado aguardando fusão manual. O \`audit\` avisa até você resolver.`);
  }
  if (log.some(l => l.startsWith('ERRO'))) process.exit(1);
}

/* --------------------------------------------------------------- index --- */

function titulo(arq) {
  const m = ler(arq).match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : path.basename(arq, '.md');
}
function resumo(arq, secao) {
  const txt = ler(arq);
  const corpo = secao
    ? (txt.split(new RegExp(`^##\\s+${secao}\\s*$`, 'm'))[1] ?? '').split(/^##\s+/m)[0]
    : txt.replace(/^#\s+.*$/m, '');
  const linha = corpo.split('\n')
    .map(l => l.trim())
    .find(l => l && !l.startsWith('<!--') && !l.startsWith('#') && !l.startsWith('|') && !l.startsWith('```'));
  return linha ? linha.replace(/\|/g, '\\|').slice(0, 110) : '—';
}
function substituiBloco(arq, marcador, conteudo) {
  const txt = ler(arq);
  const re = new RegExp(`(<!--\\s*kfe:${marcador}:start\\s*-->)[\\s\\S]*?(<!--\\s*kfe:${marcador}:end\\s*-->)`);
  if (!re.test(txt)) return false;
  const novo = txt.replace(re, `$1\n${conteudo}\n$2`);
  if (novo !== txt) fs.writeFileSync(arq, novo);
  return true;
}
function arvore() {
  const raiz = fs.readdirSync(DOCS).filter(f => fs.statSync(path.join(DOCS, f)).isFile())
    .sort((a, b) => (a === 'README.md' ? -1 : b === 'README.md' ? 1 : a.localeCompare(b)));
  const pastas = Object.keys(PASTAS).filter(p => existe(path.join(DOCS, p)));
  const itens = [
    ...raiz.map(f => [f, DESCR[f] ?? titulo(path.join(DOCS, f))]),
    ...pastas.map(p => {
      const n = p === 'processo'
        ? (fs.readdirSync(path.join(DOCS, p)).filter(f => f !== 'README.md').length)
        : mds(path.join(DOCS, p)).length;
      return [p + '/', p === 'processo' ? `${PASTAS[p].rotulo} (${n} arquivo(s))` : `${n} ${PASTAS[p].rotulo}`];
    }),
  ];
  const larg = Math.max(...itens.map(i => i[0].length)) + 2;
  const linhas = itens.map(([nome, d], i) =>
    `${i === itens.length - 1 ? '└──' : '├──'} ${nome.padEnd(larg)}→ ${d}`);
  return '```\ndocs/\n' + linhas.join('\n') + '\n```';
}
function inventario(pasta) {
  const cfg = PASTAS[pasta], dir = path.join(DOCS, pasta);
  const arqs = mds(dir);
  if (!arqs.length) return '_Nenhum arquivo ainda._';
  const linhas = arqs.map(f => `| [${f}](${f}) | ${resumo(path.join(dir, f), cfg.resumo)} |`);
  return ['| Arquivo | Responsabilidade |', '|---------|------------------|', ...linhas].join('\n');
}
/** O registro é o dono do fato "estado"; o markdown do componente é a vista dele. */
function registro() {
  const f = path.join(DOCS, 'processo', 'components-registry.json');
  if (!existe(f)) return null;
  try { return JSON.parse(ler(f)).components || []; }
  catch { return null; }
}
function tabelaEstados(c) {
  const st = Object.entries(c.states || {});
  if (!st.length) return '_Sem estado registrado — o componente não tem estados de interação._';
  return ['| Estado | Implementação | Origem | Precedente / regra |',
    '|--------|---------------|--------|--------------------|',
    ...st.map(([nome, s]) => `| ${nome} | \`${s.impl ?? '—'}\` | ${s.source ?? '—'} | ${s.rule || s.precedent || '—'} |`),
  ].join('\n');
}

function index() {
  exigeDocs('index');
  const out = [];
  const readme = path.join(DOCS, 'README.md');
  if (existe(readme)) {
    out.push(substituiBloco(readme, 'tree', arvore())
      ? '  ok      docs/README.md — árvore'
      : '  AVISO   docs/README.md sem marcadores <!-- kfe:tree:start/end --> — pulado');
  } else out.push('  AVISO   docs/README.md não existe — rode `init`');
  for (const pasta of Object.keys(PASTAS)) {
    if (pasta === 'processo') continue; // índice do processo é curado à mão (é fixo)
    const r = path.join(DOCS, pasta, 'README.md');
    if (!existe(r)) { out.push(`  AVISO   docs/${pasta}/README.md não existe — rode \`init\``); continue; }
    out.push(substituiBloco(r, 'index', inventario(pasta))
      ? `  ok      docs/${pasta}/README.md — ${mds(path.join(DOCS, pasta)).length} item(ns)`
      : `  AVISO   docs/${pasta}/README.md sem marcadores <!-- kfe:index:start/end --> — pulado`);
  }
  // Estados dos componentes: vista gerada do registro
  const comps = registro();
  const dirC = path.join(DOCS, 'componentes');
  if (comps && existe(dirC)) {
    let n = 0, semRegistro = [];
    for (const f of mds(dirC)) {
      const arq = path.join(dirC, f);
      if (!ler(arq).includes('kfe:estados:start')) continue;
      const nome = titulo(arq).replace(/^Componente:\s*/i, '').trim();
      const c = comps.find(x => x.name === nome || x.name === path.basename(f, '.md'));
      if (!c) { semRegistro.push(f); continue; }
      if (substituiBloco(arq, 'estados', tabelaEstados(c))) n++;
    }
    if (n) out.push(`  ok      docs/componentes/ — tabela de estados de ${n} componente(s), do registro`);
    if (semRegistro.length) out.push(`  AVISO   sem entrada no registro: ${semRegistro.join(', ')} — rode a fw-doc (C6)`);
  } else if (existe(dirC) && mds(dirC).length) {
    out.push('  AVISO   docs/processo/components-registry.json ausente ou inválido — estados não gerados');
  }

  console.log('\nDOC INDEX\n' + out.join('\n'));
}

/* --------------------------------------------------------------- audit --- */

function todosMd(dir, acc = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) todosMd(p, acc);
    else if (f.endsWith('.md')) acc.push(p);
  }
  return acc;
}
function audit() {
  exigeDocs('audit');
  const erros = [], avisos = [], pendentes = new Set();
  const arquivos = todosMd(DOCS);
  let links = 0;

  for (const arq of arquivos) {
    const txt = ler(arq), rel = arq.replace(/\\/g, '/');
    const linhas = txt.split('\n');

    // DIP — links relativos quebrados
    for (const m of txt.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const alvo = m[1].trim();
      if (/^(https?:|mailto:|#)/.test(alvo) || alvo.includes('<') || alvo.includes('>')) continue;
      links++;
      const destino = path.resolve(path.dirname(arq), alvo.split('#')[0]);
      if (existe(destino)) continue;
      const dentro = path.relative(path.resolve(DOCS), destino).replace(/\\/g, '/');
      if (PENDENTES.has(dentro)) pendentes.add(dentro);
      else erros.push(`${rel} — link quebrado: ${alvo}`);
    }

    // LSP — seções obrigatórias do tipo
    const pasta = path.basename(path.dirname(arq));
    if (SECOES[pasta] && path.basename(arq) !== 'README.md') {
      const presentes = linhas.filter(l => l.startsWith('## ')).map(l => norm(l.slice(3)));
      const faltam = SECOES[pasta].filter(s => !presentes.includes(norm(s)));
      // Arquivo inteiro fora do template vira UMA linha; falta pontual vira uma por seção.
      if (faltam.length > SECOES[pasta].length / 2) {
        erros.push(`${rel} — fora do template de ${pasta}/ (${faltam.length} de ${SECOES[pasta].length} seções ausentes): reescreva a partir de <kit>/templates/docs/${pasta}/${PASTAS[pasta].item}`);
      } else for (const s of faltam) erros.push(`${rel} — falta a seção obrigatória "## ${s}" (LSP)`);
      // DIP — feature deve CITAR por link, não repetir
      for (const s of ['Objetos envolvidos', 'Componentes envolvidos']) {
        if (!SECOES[pasta].includes(s)) continue;
        const bloco = (txt.split(new RegExp(`^##\\s+${s}\\s*$`, 'm'))[1] ?? '').split(/^##\s+/m)[0];
        const conteudo = bloco.split('\n').map(l => l.trim()).filter(Boolean).join(' ');
        if (conteudo && !conteudo.includes('](') && !conteudo.includes('—')) {
          avisos.push(`${rel} — "${s}" cita sem link relativo (DIP): use [Nome](../objetos/x.md)`);
        }
      }
    }

    // DIP — tabela de atributos só pode existir em objetos/
    // (componentes/ tem tabela de Props, que é contrato do componente, não atributo de entidade)
    if (pasta !== 'objetos' && pasta !== 'componentes') {
      const cab = linhas.findIndex(l => /^\|\s*nome\s*\|/i.test(l) && /\btipo\b/i.test(l) && /obrigat/i.test(l));
      if (cab >= 0) erros.push(`${rel}:${cab + 1} — tabela de atributos fora de objetos/ (DIP): mova e linke`);
    }

    // Migração pendente
    if (txt.includes(MARCA_MIGRACAO)) avisos.push(`${rel} — conteúdo migrado aguardando fusão manual`);

    // SRP/ISP — tamanho
    if (linhas.length > LIMITE_LINHAS) avisos.push(`${rel} — ${linhas.length} linhas (limite ${LIMITE_LINHAS}): provavelmente são dois assuntos (SRP)`);
  }

  // Órfãos de índice
  for (const pasta of ['objetos', 'features', 'componentes']) {
    const dir = path.join(DOCS, pasta), r = path.join(dir, 'README.md');
    if (!existe(dir)) continue;
    if (!existe(r)) { erros.push(`docs/${pasta}/README.md ausente — o índice é obrigatório`); continue; }
    const idx = ler(r);
    for (const f of mds(dir)) {
      if (!idx.includes(`(${f})`)) erros.push(`docs/${pasta}/${f} — órfão: fora do índice. Rode \`kfe-docs.mjs index\``);
    }
  }

  if (pendentes.size) avisos.push(`${pendentes.size} caminho(s) canônico(s) ainda não criado(s) pela etapa dona: ${[...pendentes].sort().join(' · ')}`);

  // As duas faces do componente têm que contar a mesma história
  const comps = registro(), dirC = path.join(DOCS, 'componentes');
  if (comps && existe(dirC)) {
    const docs = mds(dirC).map(f => titulo(path.join(dirC, f)).replace(/^Componente:\s*/i, '').trim());
    for (const c of comps) {
      if (String(c.name).startsWith('<')) continue;
      if (!docs.includes(c.name)) erros.push(`docs/componentes/${c.name}.md ausente — está no registro mas não tem doc (fw-doc C2)`);
    }
    for (const d of docs) {
      if (!comps.some(c => c.name === d)) erros.push(`docs/componentes/${d}.md — sem entrada no registro (fw-doc C6): as duas faces divergiram`);
    }
  }

  // Arquivos canônicos ausentes
  for (const f of CORE) if (!existe(path.join(DOCS, f))) avisos.push(`docs/${f} ausente — rode \`kfe-docs.mjs init\``);

  console.log(`\nDOC AUDIT\n  ${arquivos.length} arquivo(s) · ${links} link(s) relativo(s) verificado(s)`);
  for (const e of erros) console.log(`  ✗ ${e}`);
  for (const a of avisos) console.log(`  ! ${a}`);
  if (!erros.length && !avisos.length) console.log('  ✓ arquitetura íntegra');
  console.log(`\n${erros.length} erro(s) · ${avisos.length} aviso(s)`);
  if (erros.length) {
    console.log('Contrato: .claude/skills/kill-front-end/doc-architecture.md');
    process.exit(1);
  }
}

/* ----------------------------------------------------------------- cli --- */

const [cmd, ...args] = process.argv.slice(2);
const cmds = { init: () => init(args), index, audit };
if (!cmds[cmd]) {
  console.error('Uso: kfe-docs.mjs <init [--dry] | index | audit>');
  process.exit(2);
}
cmds[cmd]();
