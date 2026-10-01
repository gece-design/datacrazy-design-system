// Doc ↔ código. `docs/componentes/<Nome>.md` é a vista do componente; se a
// tabela de Props diz uma coisa e o TypeScript diz outra, quem instala pelo
// registry escreve código que não compila — é o vetor nº 1 de alucinação.
// Lê o .tsx pela API do TypeScript (só sintaxe), o .md por seção e o registro
// de componentes. O `kfe-docs audit` compara .md ↔ registro; este compara os
// dois com components/ui/.
//
//   node scripts/check-doc-codigo.mjs [--estrito|--atualizar-base|--json]
//   node scripts/check-doc-codigo.mjs --rascunho drawer     tabela de Props lida do código
import ts from "typescript";
import { RAIZ, ler, existe, pascal, componentesUi, exportsDe, secoesDoMd, blocosDeCodigo } from "./lib/fonte.mjs";
import { catraca, flags } from "./lib/ratchet.mjs";

// Atributos HTML que a doc pode citar sem que o componente os declare.
const HTML = new Set(["children", "className", "style", "id", "disabled", "name", "value", "defaultValue", "checked", "defaultChecked",
  "onChange", "onClick", "onBlur", "onFocus", "type", "placeholder", "ref", "autoFocus", "required", "readOnly", "aria-label", "href", "title", "src", "alt", "role", "tabIndex", "key"]);

const f = flags();

/** Lê declarações de props, exports e variantes cva de um .tsx. */
function lerComponente(nome) {
  const rel = `components/ui/${nome}.tsx`;
  const fonte = ler(rel);
  const sf = ts.createSourceFile(rel, fonte, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const props = []; // { dono, nome, opcional, tipo, doc }
  const variantes = {}; // eixo → [valores]
  const texto = (n) => n.getText(sf);
  const jsdoc = (n) => (ts.getJSDocCommentsAndTags(n)[0]?.comment ?? "").toString().replace(/\s+/g, " ");
  const exportado = (n) => !!(ts.canHaveModifiers(n) && ts.getModifiers(n)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword));
  const membros = (dono, tipo) => {
    if (!tipo) return;
    if (ts.isIntersectionTypeNode(tipo)) return tipo.types.forEach((t) => membros(dono, t));
    if (!ts.isTypeLiteralNode(tipo) && !ts.isInterfaceDeclaration(tipo)) return;
    for (const m of tipo.members) {
      if (!ts.isPropertySignature(m) || !m.name) continue;
      props.push({ dono, nome: texto(m.name).replace(/^["']|["']$/g, ""), opcional: !!m.questionToken, tipo: m.type ? texto(m.type) : "?", doc: jsdoc(m) });
    }
  };
  const visitar = (n) => {
    if (ts.isInterfaceDeclaration(n) && exportado(n)) membros(n.name.text, n);
    else if (ts.isTypeAliasDeclaration(n) && exportado(n)) membros(n.name.text, n.type);
    else if (ts.isFunctionDeclaration(n) && n.name && exportado(n) && n.parameters[0]?.type) membros(n.name.text, n.parameters[0].type);
    else if (ts.isVariableDeclaration(n) && n.initializer && exportado(n.parent.parent)) {
      const fn = ts.isArrowFunction(n.initializer) ? n.initializer
        : ts.isCallExpression(n.initializer) && n.initializer.arguments[0] && ts.isArrowFunction(n.initializer.arguments[0]) ? n.initializer.arguments[0] : null;
      if (fn && fn.parameters[0]?.type) membros(texto(n.name), fn.parameters[0].type);
    }
    if (ts.isCallExpression(n) && texto(n.expression) === "cva" && n.arguments[1] && ts.isObjectLiteralExpression(n.arguments[1])) {
      const v = n.arguments[1].properties.find((p) => p.name && texto(p.name) === "variants");
      if (v && ts.isPropertyAssignment(v) && ts.isObjectLiteralExpression(v.initializer)) {
        for (const eixo of v.initializer.properties) {
          if (!ts.isPropertyAssignment(eixo) || !ts.isObjectLiteralExpression(eixo.initializer)) continue;
          variantes[texto(eixo.name)] = eixo.initializer.properties.map((p) => texto(p.name).replace(/^["']|["']$/g, ""));
        }
      }
    }
    ts.forEachChild(n, visitar);
  };
  visitar(sf);
  return { nome, rel, fonte, props, variantes, exports: exportsDe(fonte) };
}

const nomes = componentesUi();
const comps = nomes.map(lerComponente);
const indiceExports = new Map(); // export → arquivo
for (const c of comps) for (const e of c.exports) indiceExports.set(e, c.nome);

if (f.resto[0] === "rascunho" || process.argv.includes("--rascunho")) {
  const alvo = process.argv[process.argv.indexOf("--rascunho") + 1] ?? f.resto[1];
  const c = comps.find((x) => x.nome === alvo);
  if (!c) { console.error(`sem components/ui/${alvo}.tsx`); process.exit(2); }
  for (const dono of [...new Set(c.props.map((p) => p.dono))]) {
    console.log(`\n### \`${dono}\`\n\n| Prop | Tipo | Obrigatória | Descrição |\n|------|------|-------------|-----------|`);
    for (const p of c.props.filter((p) => p.dono === dono)) console.log(`| \`${p.nome}\` | \`${p.tipo.replace(/\|/g, "\\|")}\` | ${p.opcional ? "não" : "sim"} | ${p.doc} |`);
  }
  if (Object.keys(c.variantes).length) console.log(`\nVariantes (cva): ${Object.entries(c.variantes).map(([k, v]) => `${k}: ${v.join(" · ")}`).join(" — ")}`);
  console.log(`\nExports: ${c.exports.join(", ")}`);
  process.exit(0);
}

// ícone da biblioteca é dependência declarada, não componente do DS
const ehPhosphor = (nome) => existe(`node_modules/@phosphor-icons/react/dist/csr/${nome}.d.ts`);

const registro = JSON.parse(ler("docs/processo/components-registry.json")).components.map((c) => c.name);
const achados = [];
const marca = (nivel, regra, comp, detalhe, linha = 0) =>
  achados.push({ chave: `${regra}|${comp}`, nivel, regra, arquivo: `components/ui/${comp}.tsx`, linha, trecho: detalhe });

for (const c of comps) {
  const docRel = `docs/componentes/${pascal(c.nome)}.md`;
  if (!existe(docRel)) { marca("erro", "sem-doc", c.nome, `${docRel} não existe`); continue; }
  const secoes = secoesDoMd(docRel);
  const docInteira = ler(docRel);
  const propsTxt = secoes.Props ?? "";
  const cita = (txt, nome) => new RegExp("`[^`]*\\b" + nome.replace(/[$]/g, "\\$") + "\\b[^`]*`").test(txt);

  // "Quando usar" é o que a skill lê para ESCOLHER o componente; apontar para
  // um componente que não existe é mandar o agente inventar.
  const guia = secoes["Quando usar"];
  if (!guia) marca("erro", "sem-quando-usar", c.nome, `${docRel} não tem a seção "Quando usar"`);
  else {
    if (!/^- \*\*Use\*\* /m.test(guia) || !/^- \*\*Não use\*\* /m.test(guia))
      marca("erro", "quando-usar-incompleto", c.nome, `"Quando usar" precisa de ao menos um "- **Use** …" e um "- **Não use** …"`);
    for (const [, cod] of guia.matchAll(/`([^`]+)`/g)) {
      const nome = cod.match(/^<?([A-Z][A-Za-z]+)\b/)?.[1];
      if (nome && !indiceExports.has(nome) && !ehPhosphor(nome))
        marca("erro", "quando-usar-fantasma", c.nome, `\`${nome}\` no "Quando usar" não é exportado por nenhum components/ui`);
    }
  }

  for (const p of c.props) {
    if (p.nome === "className" || p.nome === "children") continue; // convenção, não contrato
    if (!cita(propsTxt, p.nome)) marca("erro", "prop-fora-da-doc", c.nome, `\`${p.dono}.${p.nome}\` (${p.opcional ? "opcional" : "obrigatória"}) não aparece na seção Props`);
  }
  // linhas de tabela: | `a`, `b` | tipo | sim/não | ...
  const declaradas = new Set([...c.props.map((p) => p.nome), ...Object.keys(c.variantes)]);
  let tabelaDeProps = false;
  for (const linha of propsTxt.split("\n")) {
    if (/^\|/.test(linha) && !/^\|\s*-/.test(linha) && !/^\|\s*`/.test(linha)) tabelaDeProps = /^\|\s*Props?\b/i.test(linha);
    if (!tabelaDeProps) continue;
    const m = linha.match(/^\|\s*((?:`[^`]+`\s*,?\s*)+)\|(.*)$/);
    if (!m) continue;
    const nomesDoc = [...m[1].matchAll(/`([^`]+)`/g)].map((x) => x[1].replace(/\?$/, ""));
    for (const n of nomesDoc) {
      if (!declaradas.has(n) && !HTML.has(n) && !/[.\s(*-]/.test(n)) marca("aviso", "prop-so-na-doc", c.nome, `\`${n}\` está na tabela e não é prop declarada em ${c.rel}`);
    }
    // obrigatoriedade, quando a tabela tem a coluna
    const cabecalho = propsTxt.split("\n").find((l) => /^\|.*Obrigat/i.test(l));
    if (cabecalho && nomesDoc.length === 1 && declaradas.has(nomesDoc[0])) {
      const colunas = cabecalho.split("|").map((s) => s.trim().toLowerCase());
      const idx = colunas.findIndex((s) => s.startsWith("obrigat"));
      const celulas = linha.split("|").map((s) => s.trim().toLowerCase());
      const dito = celulas[idx];
      const decls = c.props.filter((p) => p.nome === nomesDoc[0]);
      if (dito && /^(sim|não|nao)$/.test(dito) && decls.every((p) => (dito === "sim") === p.opcional))
        marca("erro", "obrigatoriedade", c.nome, `\`${nomesDoc[0]}\`: doc diz "${dito}", código diz ${decls[0].opcional ? "opcional (?)" : "obrigatória"} (${decls.map((p) => p.dono).join(", ")})`);
    }
  }
  for (const [eixo, valores] of Object.entries(c.variantes)) {
    for (const v of valores) if (!new RegExp("\\b" + v + "\\b").test(secoes.Variantes ?? "") && !cita(docInteira, v))
      marca("aviso", "variante-fora-da-doc", c.nome, `cva ${eixo}="${v}" não aparece na doc`);
  }
  for (const e of c.exports) {
    if (/Props$|Variants$/.test(e)) continue;
    if (!new RegExp("\\b" + e + "\\b").test(docInteira)) marca("aviso", "export-fora-da-doc", c.nome, `export \`${e}\` não é citado na doc`);
  }
  for (const bloco of blocosDeCodigo(secoes["Exemplo de uso"])) {
    const locais = new Set([...bloco.matchAll(/\b(?:function|const|let)\s+([A-Z]\w*)/g)].map((m) => m[1]));
    for (const tag of new Set([...bloco.matchAll(/<([A-Z]\w*)/g)].map((m) => m[1]))) {
      if (!indiceExports.has(tag) && !locais.has(tag) && !/^(?:React|Fragment)$/.test(tag) && !ehPhosphor(tag))
        marca("erro", "exemplo-fantasma", c.nome, `<${tag}> no "Exemplo de uso" não é exportado por nenhum components/ui`);
    }
  }
}

for (const c of comps) if (!registro.includes(pascal(c.nome)) && !registro.includes(c.nome)) marca("erro", "fora-do-registro", c.nome, `sem entrada em docs/processo/components-registry.json`);
for (const r of registro) if (!nomes.some((n) => pascal(n) === r || n === r)) achados.push({ chave: `registro-sem-codigo|${r}`, nivel: "erro", regra: "registro-sem-codigo", arquivo: "docs/processo/components-registry.json", linha: 0, trecho: `"${r}" no registro e nenhum components/ui/*.tsx corresponde` });

if (!f.json) {
  for (const nivel of ["erro", "aviso"]) {
    const lista = achados.filter((a) => a.nivel === nivel);
    if (!lista.length) continue;
    console.log(`\n## ${nivel}s (${lista.length})`);
    for (const a of lista) console.log(`  ${a.regra.padEnd(22)} ${a.arquivo.replace("components/ui/", "").padEnd(22)} ${a.trecho}`);
  }
}
// --json leva erros E avisos (o consistencia.mjs verifica os dois); a catraca conta só erros
if (f.json) { console.log(JSON.stringify(achados, null, 2)); process.exit(achados.length ? 1 : 0); }
process.exit(catraca("doc-codigo", achados.filter((a) => a.nivel === "erro"), f));
