// Os exemplos publicados (aba "Código" das páginas e "Exemplo de uso" das
// docs) são o que o agente copia. Três coisas podem estar erradas neles:
// citam componente que não existe (fantasma), citam componente que o item do
// registry não instala (fora das dependências) ou simplesmente não compilam.
// O gerador colhe as mesmas strings (scripts/lib/fonte.mjs · exemplosDaPagina).
//
//   node scripts/check-exemplos.mjs [--estrito|--atualizar-base|--json]
//   node scripts/check-exemplos.mjs --sem-compilar     só fantasma e dependências (rápido)
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { RAIZ, ler, existe, pascal, componentesUi, exportsDe, lerNavegacao, exemplosDaPagina, secoesDoMd, blocosDeCodigo } from "./lib/fonte.mjs";
import { catraca, flags } from "./lib/ratchet.mjs";

const f = flags();
const compilar = !process.argv.includes("--sem-compilar");
const PAGINA_FIXA = { "data-table": "table" };

// índice: export → arquivo de ui/ ou lib/
const indice = new Map();
for (const n of componentesUi()) for (const e of exportsDe(ler(`components/ui/${n}.tsx`))) indice.set(e, `@/components/ui/${n}`);
for (const l of fs.readdirSync(path.join(RAIZ, "lib")).filter((x) => x.endsWith(".ts")))
  for (const e of exportsDe(ler(`lib/${l}`))) if (!indice.has(e)) indice.set(e, `@/lib/${l.replace(/\.ts$/, "")}`);

const nav = lerNavegacao();
const snippets = [];
for (const nome of componentesUi()) {
  const slug = PAGINA_FIXA[nome] ?? nome;
  const pagina = nav.find((p) => p.href.split("/").pop() === slug);
  exemplosDaPagina(pagina && `app${pagina.href}/page.tsx`).forEach((codigo, i) =>
    snippets.push({ id: `${nome}#pagina-${i + 1}`, componente: nome, origem: `app${pagina.href}/page.tsx`, codigo }));
  const secoes = secoesDoMd(`docs/componentes/${pascal(nome)}.md`);
  blocosDeCodigo(secoes?.["Exemplo de uso"]).forEach((codigo, i) =>
    snippets.push({ id: `${nome}#doc-${i + 1}`, componente: nome, origem: `docs/componentes/${pascal(nome)}.md`, codigo }));
}

const ehPhosphor = (nome) => existe(`node_modules/@phosphor-icons/react/dist/csr/${nome}.d.ts`);
const REACT = new Set(["useState", "useEffect", "useRef", "useMemo", "useCallback", "useId", "useReducer", "useContext", "Fragment"]);

const achados = [];
const marca = (regra, s, detalhe) => achados.push({ chave: `${regra}|${s.componente}`, regra, arquivo: s.origem, linha: 0, snippet: s.id, trecho: detalhe });

// O que o agente lê é a skill publicada: cada exemplo em skill/componentes/<X>.md
// precisa dizer "Exige: @datacrazy/<item>" para todo componente de outro item que
// use (o gerador escreve a linha; aqui se confere o resultado).
function conferirPublicados() {
  if (!existe("public/r/setup.json")) return;
  const setup = JSON.parse(ler("public/r/setup.json"));
  for (const f of setup.files.filter((f) => /^skill\/componentes\//.test(f.path))) {
    const componente = f.path.split("/").pop().replace(/\.md$/, "");
    const nome = componentesUi().find((n) => pascal(n) === componente) ?? componente;
    const deps = depsDoItem(nome) ?? new Set();
    let i = 0;
    for (const m of f.content.matchAll(/```tsx\n([\s\S]*?)```/g)) {
      i++;
      const bloco = m[1];
      const exige = new Set([...bloco.matchAll(/Exige:\s*([^\n]+)/g)].flatMap((x) => x[1].split(",").map((y) => y.trim().replace(/^@datacrazy\//, ""))));
      const locais = new Set([...bloco.matchAll(/\b(?:function|const|let|class)\s+([A-Z]\w*)/g)].map((x) => x[1]));
      for (const t of new Set([...bloco.matchAll(/<([A-Z]\w*)/g)].map((x) => x[1]))) {
        const arq = indice.get(t);
        if (!arq || locais.has(t)) continue;
        const item = arq.split("/").pop();
        if (item === nome || deps.has(item) || exige.has(item)) continue;
        achados.push({ chave: `fora-das-dependencias|${nome}`, regra: "fora-das-dependencias", arquivo: `public/r/setup.json#${f.path}`, linha: 0, snippet: `${nome}#publicado-${i}`, trecho: `<${t}> vem de @datacrazy/${item}: nem em registryDependencies nem em "Exige:" do exemplo publicado` });
      }
    }
  }
}

const depsDoItem = (nome) => {
  const rel = `public/r/${nome}.json`;
  if (!existe(rel)) return null;
  return new Set((JSON.parse(ler(rel)).registryDependencies ?? []).map((u) => u.split("/").pop().replace(/\.json$/, "")));
};

for (const s of snippets) {
  const locais = new Set([...s.codigo.matchAll(/\b(?:function|const|let|class)\s+([A-Z]\w*)/g)].map((m) => m[1]));
  const importados = new Set([...s.codigo.matchAll(/import\s*\{([^}]+)\}/g)].flatMap((m) => m[1].split(",").map((x) => x.trim().split(/\s+as\s+/).pop())));
  const tags = new Set([...s.codigo.matchAll(/<([A-Z]\w*)/g)].map((m) => m[1]));
  const exige = new Set([...s.codigo.matchAll(/Exige:\s*([^\n]+)/g)].flatMap((m) => m[1].split(",").map((x) => x.trim().replace(/^@datacrazy\//, "").replace(/`/g, ""))));
  const deps = depsDoItem(s.componente);
  // "…" no trecho = pseudocódigo. A regra da página (04-navegacao.md) pede o
  // JSX real do exemplo ao lado; reportado como tal, e não vai ao compilador.
  if (/…/.test(s.codigo)) { marca("pseudocodigo", s, `trecho com "…" — a aba Código deve ter o JSX real`); s.pseudo = true; }
  for (const tag of tags) {
    if (locais.has(tag) || /^(?:React|Fragment)$/.test(tag)) continue;
    if (!indice.has(tag) && !ehPhosphor(tag)) marca("fantasma", s, `<${tag}> não é exportado por components/ui nem lib`);
  }
  s.tags = tags; s.locais = locais; s.importados = importados;
}

conferirPublicados();

if (compilar && snippets.length) {
  const cfg = ts.readConfigFile(path.join(RAIZ, "tsconfig.json"), ts.sys.readFile).config;
  delete cfg.compilerOptions.plugins;
  delete cfg.compilerOptions.incremental;
  const { options } = ts.parseJsonConfigFileContent(cfg, ts.sys, RAIZ);
  options.noEmit = true;
  options.noImplicitAny = false; // o trecho é exemplo, não código do produto: dado da tela vira `any`

  /** Monta um módulo a partir do trecho: imports gerados pelo índice + o
   *  trecho, como módulo se parsear assim, senão embrulhado num componente. */
  const montar = (s, declaracoes = []) => {
    const cabecalho = [`import * as React from "react";`];
    const porArquivo = new Map();
    for (const tag of s.tags) {
      if (s.locais.has(tag) || s.importados.has(tag) || !indice.has(tag)) continue;
      const a = indice.get(tag);
      if (!porArquivo.has(a)) porArquivo.set(a, new Set());
      porArquivo.get(a).add(tag);
    }
    for (const [a, nomes] of porArquivo) cabecalho.push(`import { ${[...nomes].join(", ")} } from "${a}";`);
    const icones = [...s.tags].filter((t) => !indice.has(t) && !s.locais.has(t) && ehPhosphor(t) && !s.importados.has(t));
    if (icones.length) cabecalho.push(`import { ${icones.join(", ")} } from "@phosphor-icons/react";`);
    const hooks = [...new Set([...s.codigo.matchAll(/\b(use[A-Z]\w*|Fragment)\b/g)].map((m) => m[1]))].filter((h) => REACT.has(h) && !s.importados.has(h));
    if (hooks.length) cabecalho.push(`import { ${hooks.join(", ")} } from "react";`);
    const importsDoTrecho = [...s.codigo.matchAll(/^import[\s\S]*?from\s+"[^"]+";?\s*$/gm)].map((m) => m[0]);
    const corpo = importsDoTrecho.reduce((c, imp) => c.replace(imp, ""), s.codigo).trim();
    const pre = [...cabecalho, ...importsDoTrecho, ...declaracoes.map((d) => `declare const ${d}: any;`)].join("\n");
    const parseia = (txt) => ts.createSourceFile("x.tsx", txt, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX).parseDiagnostics.length === 0;
    const candidatos = [
      `${pre}\n${corpo}\n`,
      `${pre}\nexport function Exemplo() {\n  return (\n<>\n${corpo}\n</>\n  );\n}\n`,
      // JSX como expressão solta dentro de uma função: aceita declarações e
      // elementos misturados em qualquer ordem
      `${pre}\nexport function Exemplo() {\n${corpo}\n}\n`,
    ];
    const i = corpo.split("\n").findIndex((l) => /^\s*</.test(l));
    if (i > 0) {
      const antes = corpo.split("\n").slice(0, i).join("\n");
      const jsx = corpo.split("\n").slice(i).join("\n");
      candidatos.push(`${pre}\nexport function Exemplo() {\n${antes}\n  return (\n<>\n${jsx}\n</>\n  );\n}\n`);
    }
    return candidatos.find(parseia) ?? null;
  };

  const virtual = new Map();
  const caminho = (s) => path.join(RAIZ, ".exemplos", `${s.id.replace(/[#]/g, "__")}.tsx`);
  const norm = (p) => path.resolve(p);
  const rodar = (declPorSnippet) => {
    virtual.clear();
    for (const s of snippets) {
      if (s.pseudo) continue;
      const txt = montar(s, declPorSnippet.get(s.id) ?? []);
      if (txt === null) { s.naoParseia = true; continue; }
      virtual.set(norm(caminho(s)), txt);
    }
    const host = ts.createCompilerHost(options, true);
    const orig = { fileExists: host.fileExists.bind(host), readFile: host.readFile.bind(host), getSourceFile: host.getSourceFile.bind(host) };
    host.fileExists = (p) => virtual.has(norm(p)) || orig.fileExists(p);
    host.readFile = (p) => virtual.get(norm(p)) ?? orig.readFile(p);
    host.getSourceFile = (p, lang, onError, should) => virtual.has(norm(p)) ? ts.createSourceFile(p, virtual.get(norm(p)), lang, true, ts.ScriptKind.TSX) : orig.getSourceFile(p, lang, onError, should);
    const program = ts.createProgram([...virtual.keys()], options, host);
    return ts.getPreEmitDiagnostics(program).filter((d) => d.file && virtual.has(norm(d.file.fileName)));
  };

  // 1ª passada: nomes que o trecho usa sem declarar (handlers, estado da tela) viram `any`
  const decl = new Map();
  for (const d of rodar(decl)) {
    if (![2304, 2552, 2503, 18004].includes(d.code)) continue;
    const id = path.basename(d.file.fileName, ".tsx").replace(/__/g, "#");
    const nome = ts.flattenDiagnosticMessageText(d.messageText, " ").match(/(?:name|property) '([^']+)'/)?.[1];
    if (!nome) continue;
    if (!decl.has(id)) decl.set(id, new Set());
    decl.get(id).add(nome);
  }
  for (const [id, nomes] of decl) decl.set(id, [...nomes]);
  // 2ª passada: o que sobra é erro de verdade
  for (const d of rodar(decl)) {
    const id = path.basename(d.file.fileName, ".tsx").replace(/__/g, "#");
    const s = snippets.find((x) => x.id === id);
    const pos = d.file.getLineAndCharacterOfPosition(d.start ?? 0);
    marca("nao-compila", s, `TS${d.code} ${ts.flattenDiagnosticMessageText(d.messageText, " ").slice(0, 140)} (linha ${pos.line + 1} do módulo montado)`);
  }
  for (const s of snippets.filter((x) => x.naoParseia)) marca("nao-parseia", s, `o trecho não parseia nem como módulo nem embrulhado em componente`);
}

if (!f.json) {
  let ultimo = null;
  for (const a of achados.sort((x, y) => x.regra.localeCompare(y.regra) || x.snippet.localeCompare(y.snippet))) {
    if (a.regra !== ultimo) { console.log(`\n## ${a.regra}`); ultimo = a.regra; }
    console.log(`  ${a.snippet.padEnd(28)} ${a.trecho}`);
  }
  console.log(`\n${snippets.length} trecho(s) lidos de ${new Set(snippets.map((s) => s.origem)).size} arquivo(s)`);
}
process.exit(catraca("exemplos", achados, f));
