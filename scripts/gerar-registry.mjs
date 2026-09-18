// Gera o catálogo do design system no formato shadcn — public/r/*.json,
// public/r/registry.json e public/llms.txt — lendo o próprio código.
//
// Roda antes de todo build (`prebuild`) e de todo `dev` (`predev`). O catálogo
// nunca é editado à mão: é uma vista de components/ui/, lib/, globals.css,
// tailwind.config.ts e docs/, e por isso não tem como divergir deles.
//
// Uso:  node scripts/gerar-registry.mjs
//       DS_URL=http://localhost:4321 node scripts/gerar-registry.mjs   (teste local)

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const URL_DS = (process.env.DS_URL || "https://datacrazy-design-system.vercel.app").replace(/\/$/, "");
const NAMESPACE = "@datacrazy";
// `~` é a raiz do projeto de quem instala, não a home do usuário.
const PASTA_SKILL = "~/.claude/skills/datacrazy-ds";
const SAIDA = path.join(RAIZ, "public/r");
const SCHEMA_ITEM = "https://ui.shadcn.com/schema/registry-item.json";

const ler = (rel) => fs.readFileSync(path.join(RAIZ, rel), "utf8");
const existe = (rel) => fs.existsSync(path.join(RAIZ, rel));
const urlDoItem = (nome) => `${URL_DS}/r/${nome}.json`;
const pascal = (nome) => nome.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
const umaLinha = (t) => t.replace(/\s+/g, " ").trim();

// Componente sem página nem doc própria: a descrição tem de vir de algum lugar,
// e inventar a partir do código é pior que declarar aqui.
const DESCRICAO_FIXA = {
  badge: "Selo curto de status — a cor fica na borda e no texto, nunca preenchendo a superfície.",
  rating: "Avaliação de 0 a 10 estrelas (o máximo é prop): editável por setas, ou só leitura.",
  "logo-datacrazy": "Símbolo e logotipo do DataCrazy, em currentColor para acompanhar o tema.",
};
const TITULO_FIXO = { "data-table": "Data Table", "logo-datacrazy": "Logo DataCrazy" };
// Slug da página no site quando difere do nome do arquivo.
const PAGINA_FIXA = { "data-table": "table" };

// O que da doc do componente serve a quem USA. Par no Figma, lote e divergências
// abertas são maquinário do nosso processo — ficam fora.
const SECOES_UTEIS = ["Props", "Variantes", "Estados", "Composição", "Exemplo de uso", "Acessibilidade"];

/* ------------------------------------------------------------------------- */

function lerNavegacao() {
  const fonte = ler("components/ds/nav.ts");
  const paginas = [];
  let categoria = null;
  // Categoria: `titulo` seguido de `descricao`. Item: `titulo` seguido de `href`.
  for (const m of fonte.matchAll(/titulo:\s*"([^"]+)",\s*(href:\s*"([^"]+)"[^}]*)?/g)) {
    if (!m[2]) {
      categoria = m[1];
      continue;
    }
    paginas.push({
      titulo: m[1],
      href: m[3],
      categoria,
      descricao: m[2].match(/descricao:\s*"([^"]+)"/)?.[1],
    });
  }
  return paginas;
}

function importsDe(fonte) {
  return [...fonte.matchAll(/(?:from|import)\s+"([^"]+)"/g)].map((m) => m[1]);
}

/** Separa o que vira item do catálogo do que vira pacote do npm. */
function dependenciasDe(fonte, arquivo) {
  const itens = new Set();
  const pacotes = new Set();
  for (const spec of importsDe(fonte)) {
    if (spec.startsWith("@/components/ui/") || spec.startsWith("@/lib/") || spec.startsWith("./")) {
      itens.add(path.basename(spec));
    } else if (spec.startsWith("@/") || spec.startsWith(".")) {
      // Import de fora de ui/ e lib/ (ex.: components/ds) não existe no projeto
      // de quem instala. Melhor quebrar a geração do que publicar componente quebrado.
      throw new Error(`${arquivo}: import "${spec}" não pode ir para o catálogo`);
    } else {
      const pacote = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
      if (!["react", "react-dom", "next"].includes(pacote)) pacotes.add(pacote);
    }
  }
  return { itens: [...itens], pacotes: [...pacotes] };
}

function exportsDe(fonte) {
  const nomes = new Set();
  for (const m of fonte.matchAll(/export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class|type|interface|enum)\s+([A-Za-z_]\w*)/g)) {
    nomes.add(m[1]);
  }
  for (const m of fonte.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
    for (const parte of m[1].split(",")) {
      const nome = parte.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop();
      if (nome) nomes.add(nome);
    }
  }
  return [...nomes];
}

function secoesDoMd(rel) {
  if (!existe(rel)) return null;
  const secoes = {};
  for (const parte of ler(rel).split(/^## /m).slice(1)) {
    const [titulo, ...resto] = parte.split("\n");
    secoes[titulo.trim()] = resto
      .join("\n")
      // link relativo aponta para o nosso repo, que o cliente não tem
      .replace(/\[([^\]]+)\]\((?!https?:)[^)]+\)/g, "$1")
      .replace(/<!-- kfe:[^>]+-->\n?/g, "")
      .trim();
  }
  return secoes;
}

/** Os trechos da aba "Código" da página do componente no site. */
function exemplosDaPagina(rel) {
  if (!rel || !existe(rel)) return [];
  const exemplos = new Set();
  for (const m of ler(rel).matchAll(/codigo\w*\s*=\s*\{?\s*`((?:\\[\s\S]|[^`\\])*)`/g)) {
    // interpolação de verdade: o texto final só existe em runtime
    if (/(^|[^\\])\$\{/.test(m[1])) continue;
    exemplos.add(m[1].replace(/\\([`$\\])/g, "$1").trim());
  }
  return [...exemplos];
}

/* ------------------------------------------------------------------------- */
/* Tokens                                                                    */
//
// Duas versões, porque o formato da variável de cor muda de verdade:
//
//   v3  a variável guarda o CANAL ("216 100% 97.1%") e o tailwind.config
//       monta `hsl(var(--x))` — é o que deixa `bg-card/40` funcionar.
//   v4  a variável guarda a COR INTEIRA ("hsl(216 100% 97.1%)") e o `@theme`
//       aponta `--color-card: var(--card)`; a transparência sai do color-mix.
//
// O shadcn CLI não converte tudo sozinho: ele embrulha o canal em hsl() nas
// variáveis de :root/.dark, mas não no que vem por `css` nem dentro de um
// gradiente. Por isso a conversão para o v4 é feita aqui, inteira.

function regrasDaCamadaBase() {
  const css = ler("app/globals.css").replace(/\/\*[\s\S]*?\*\//g, "");
  const abre = css.indexOf("{", css.indexOf("@layer base"));
  let profundidade = 0;
  let fim = abre;
  for (; fim < css.length; fim++) {
    if (css[fim] === "{") profundidade++;
    else if (css[fim] === "}" && --profundidade === 0) break;
  }
  return [...css.slice(abre + 1, fim).matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
    seletor: umaLinha(m[1]),
    declaracoes: m[2].split(";").map((d) => d.trim()).filter(Boolean),
  }));
}

const dividir = (d) => {
  const i = d.indexOf(":");
  return [d.slice(0, i).trim(), d.slice(i + 1).trim()];
};
const variaveis = (declaracoes) =>
  Object.fromEntries(declaracoes.filter((d) => d.startsWith("--")).map(dividir).map(([k, v]) => [k.slice(2), v]));
const kebab = (s) => s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
const ehCanalHsl = (v) => {
  const partes = v.split(" ");
  return partes.length === 3 && partes.slice(1).every((p) => p.endsWith("%"));
};
/** Valor do formato v3 escrito no formato v4. */
const corInteira = (v) => (ehCanalHsl(v) ? `hsl(${v})` : v.replace(/hsl\(var\((--[\w-]+)\)\)/g, "var($1)"));

/** O `theme.extend` do tailwind.config, escrito como variáveis de `@theme` do v4. */
function temaV4(ext) {
  const tema = {};
  const achatar = (obj, prefixo) => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") tema[`${prefixo}-${k}`] = corInteira(v);
      else achatar(v, `${prefixo}-${k}`);
    }
  };
  achatar(ext.colors, "color");
  for (const [k, v] of Object.entries(ext.fontFamily)) tema[`font-${k}`] = [...v, "ui-sans-serif", "system-ui", "sans-serif"].join(", ");
  for (const [k, [tamanho, extra]] of Object.entries(ext.fontSize)) {
    tema[`text-${k}`] = tamanho;
    tema[`text-${k}--line-height`] = extra.lineHeight;
    tema[`text-${k}--letter-spacing`] = extra.letterSpacing;
    tema[`text-${k}--font-weight`] = extra.fontWeight;
  }
  for (const [k, v] of Object.entries(ext.boxShadow)) tema[`shadow-${k}`] = v;
  for (const [k, v] of Object.entries(ext.borderRadius)) tema[`radius-${k}`] = v;
  for (const [k, v] of Object.entries(ext.zIndex)) tema[`z-index-${k}`] = v;
  for (const [k, v] of Object.entries(ext.animation)) tema[`animate-${k}`] = v;
  return tema;
}

function itemTokens(ext, versao) {
  const v4 = versao === "v4";
  const regras = regrasDaCamadaBase();
  const doSeletor = (s) => regras.find((r) => r.seletor === s)?.declaracoes ?? [];
  const valor = (v) => (v4 ? corInteira(v) : v);
  const converter = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, valor(v)]));

  // Da camada base só vai o tom do perfil ([data-tom]). `*` e `body` ficam: o
  // `shadcn init` do projeto já escreveu os dele.
  const tons = {};
  for (const r of regras.filter((r) => r.seletor.includes("[data-tom"))) {
    tons[r.seletor] = converter(Object.fromEntries(r.declaracoes.map(dividir)));
  }

  const item = {
    $schema: SCHEMA_ITEM,
    name: v4 ? "tokens" : "tokens-v3",
    type: "registry:theme",
    title: v4 ? "Tokens" : "Tokens (Tailwind v3)",
    description: `Cor (claro e escuro), tipografia, raio, sombra, camadas e movimento do DataCrazy, para Tailwind ${versao}.`,
    cssVars: { light: converter(variaveis(doSeletor(":root"))), dark: converter(variaveis(doSeletor(".dark"))) },
    css: { "@layer base": tons },
  };

  if (v4) {
    item.cssVars.theme = temaV4(ext);
    for (const [nome, quadros] of Object.entries(ext.keyframes)) {
      item.css[`@keyframes ${nome}`] = Object.fromEntries(
        Object.entries(quadros).map(([quadro, props]) => [
          quadro,
          Object.fromEntries(Object.entries(props).map(([p, v]) => [kebab(p), v])),
        ]),
      );
    }
    // o v4 não tem namespace de tema para background-image
    for (const [nome, imagem] of Object.entries(ext.backgroundImage)) {
      item.css[`@utility bg-${nome}`] = { "background-image": corInteira(imagem) };
    }
  } else {
    const chaves = ["colors", "fontFamily", "fontSize", "boxShadow", "backgroundImage", "borderRadius", "zIndex", "keyframes", "animation"];
    item.tailwind = { config: { theme: { extend: Object.fromEntries(chaves.map((k) => [k, ext[k]])) } } };
  }
  return item;
}

/* ------------------------------------------------------------------------- */
/* Skill do Claude                                                           */

function regrasParaQuemUsa() {
  const md = ler("docs/regras.md");
  const tabela = (letra) =>
    md
      .split("\n")
      .filter((l) => new RegExp(`^\\| ${letra}\\d`).test(l))
      .map((l) => {
        const [, id, regra] = l.split("|");
        return `| ${id.trim()} | ${regra.trim()} |`;
      });
  // Fidelidade e retroatividade são regras de quem constrói o DS, não de quem usa.
  const uso = md.split("## Regras de uso do design system")[1].split("### Fidelidade")[0].trim();
  return [
    "### Nascidas de bug real no CRM",
    "",
    "| # | Regra |",
    "|---|---|",
    ...tabela("E"),
    "",
    "### Direção visual",
    "",
    "| # | Regra |",
    "|---|---|",
    ...tabela("A"),
    "",
    uso.replace(/^### /gm, "### Uso · "),
  ].join("\n");
}

function skill(ext, componentes) {
  const lista = (nomes) => nomes.map((n) => `\`${n}\``).join(" · ");
  const cores = [];
  const achatar = (obj, prefixo) => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") cores.push(prefixo ? `${prefixo}-${k}` : k);
      else achatar(v, prefixo ? `${prefixo}-${k}` : k);
    }
  };
  achatar(ext.colors, "");
  const semanticas = cores.filter((c) => !c.startsWith("base-"));
  const primitivas = cores.filter((c) => c.startsWith("base-"));

  return `---
name: datacrazy-ds
description: Design system do DataCrazy (CRM). Use SEMPRE que for criar ou alterar tela, componente ou estilo de interface neste projeto — diz qual componente usar, quais tokens existem e o que é proibido.
---

# DataCrazy Design System

Componentes React + Tailwind do CRM DataCrazy, instalados pelo registry
\`${NAMESPACE}\` (shadcn). Todos os componentes, vivos: ${URL_DS}

## Como trabalhar

1. **Procure antes de criar.** O catálogo no fim deste arquivo lista tudo o que
   existe. Se o componente existe e não está em \`components/ui/\`, instale:
   \`npx shadcn@latest add ${NAMESPACE}/<nome>\` (ou pela ferramenta MCP do shadcn).
2. **Leia a referência antes do primeiro uso:** \`componentes/<Nome>.md\`, nesta
   pasta — props, variantes, estados, exemplos e acessibilidade.
3. **As props são em português** (\`rotulo\`, \`titulo\`, \`aberto\`, \`aoFechar\`).
   Siga o arquivo do componente, não o costume do shadcn/ui.
4. **Não existe?** Componha com os componentes e os tokens do DS. Não crie
   variante nova de componente do DS nem edite \`components/ui/\` para encaixar
   um caso: isso é decisão do time de design.
5. **Texto nunca dentro do componente.** Toda string entra por prop — o produto
   é multi-idioma.

## Tokens — a única fonte de estilo

Estilo só com as classes abaixo. Hex, \`rgb()\`, \`hsl(var(--…))\`,
\`text-sm\`/\`text-base\`, \`z-50\`, sombra do Tailwind padrão e cor da paleta
padrão (\`bg-blue-500\`, \`text-gray-600\`) estão fora.

- **Cor** (\`bg-\`, \`text-\`, \`border-\`, \`ring-\`, \`outline-\`, \`fill-\`, \`stroke-\`): ${lista(semanticas)}
- **Primitivas** (só onde o componente já usa; tela usa as semânticas): ${lista(primitivas)}
- **Transparência:** \`bg-destructive/10\` — nunca \`rgba()\`.
- **Tipografia** (\`text-\`; cada uma já traz entrelinha, peso e tracking): ${lista(Object.keys(ext.fontSize))}
- **Raio** (\`rounded-\`): ${lista(Object.keys(ext.borderRadius))}
- **Sombra** (\`shadow-\`): ${lista(Object.keys(ext.boxShadow))}
- **Camadas** (\`z-\`, de baixo para cima): ${lista(Object.keys(ext.zIndex))}
- **Movimento** (\`animate-\`, sempre com \`motion-safe:\`): ${lista(Object.keys(ext.animation))}
- **Cor em SVG:** \`fill="currentColor"\` / \`stopColor="currentColor"\` mais a classe
  de texto do token (\`text-primary\`).
- **Ícones:** \`@phosphor-icons/react\`, \`weight="regular"\` na interface inteira
  (\`fill\` só no item selecionado); 16px em botão e campo.
- **Tema escuro:** classe \`dark\` no \`<html>\`. Os tokens trocam sozinhos —
  nunca ramifique código por tema.
- **Fonte:** Geist, pela variável \`--font-geist-sans\` (a do create-next-app).

## Regras

${regrasParaQuemUsa()}

## Catálogo

| Componente | Instalar | Referência | Para quê |
|---|---|---|---|
${componentes
  .map((c) => `| ${c.title} | \`${NAMESPACE}/${c.name}\` | \`componentes/${pascal(c.name)}.md\` | ${c.description} |`)
  .join("\n")}
`;
}

function referenciaDoComponente(c) {
  const linhas = [
    `# ${c.title}`,
    "",
    c.description,
    "",
    `- Instalar: \`npx shadcn@latest add ${NAMESPACE}/${c.name}\``,
    `- Importar de \`@/components/ui/${c.name}\`: ${c.exports.map((e) => `\`${e}\``).join(", ")}`,
  ];
  if (c.pagina) linhas.push(`- Ver vivo: ${URL_DS}${c.pagina.href}`);
  for (const s of SECOES_UTEIS) {
    if (c.md?.[s]) linhas.push("", `## ${s}`, "", c.md[s]);
  }
  if (c.exemplos.length) {
    linhas.push("", "## Exemplos do site", "");
    for (const e of c.exemplos) linhas.push("```tsx", e, "```", "");
  }
  return linhas.join("\n").trim() + "\n";
}

/* ------------------------------------------------------------------------- */

const paginas = lerNavegacao();
const ext = require("tailwindcss/loadConfig")(path.join(RAIZ, "tailwind.config.ts")).theme.extend;

const componentes = fs
  .readdirSync(path.join(RAIZ, "components/ui"))
  .filter((f) => f.endsWith(".tsx"))
  .sort()
  .map((arquivo) => {
    const name = arquivo.replace(/\.tsx$/, "");
    const rel = `components/ui/${arquivo}`;
    const fonte = ler(rel);
    if (/hsl\(var\(/.test(fonte)) {
      // no v4 a variável já é a cor inteira: hsl(var(--x)) vira hsl(hsl(…)) e some
      throw new Error(`${rel}: hsl(var(--…)) só funciona no Tailwind v3 — use a classe do token (ex.: currentColor + text-primary)`);
    }
    const slug = PAGINA_FIXA[name] ?? name;
    const pagina = paginas.find((p) => p.href.split("/").pop() === slug);
    const md = secoesDoMd(`docs/componentes/${pascal(name)}.md`);
    const description =
      DESCRICAO_FIXA[name] ?? (md?.Responsabilidade && umaLinha(md.Responsabilidade)) ?? pagina?.descricao;
    if (!description) throw new Error(`${rel}: sem descrição — crie a doc ou declare em DESCRICAO_FIXA`);
    const { itens, pacotes } = dependenciasDe(fonte, rel);
    return {
      name,
      rel,
      fonte,
      title: TITULO_FIXO[name] ?? pagina?.titulo ?? name.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join(" "),
      description,
      categoria: pagina?.categoria,
      pagina,
      md,
      exports: exportsDe(fonte),
      exemplos: exemplosDaPagina(pagina && `app${pagina.href}/page.tsx`),
      itens,
      pacotes,
    };
  });

// lib/ entra só no que algum componente importa — o resto de lib/ é do site.
const libs = new Map();
const pendentes = componentes.flatMap((c) => c.itens).filter((n) => existe(`lib/${n}.ts`));
while (pendentes.length) {
  const name = pendentes.pop();
  if (libs.has(name)) continue;
  const rel = `lib/${name}.ts`;
  const fonte = ler(rel);
  const deps = dependenciasDe(fonte, rel);
  libs.set(name, { name, rel, fonte, ...deps });
  pendentes.push(...deps.itens);
}

const arquivo = (rel, fonte, type) => ({ path: rel, type, content: fonte });

const itensDeLib = [...libs.values()].map((l) => ({
  $schema: SCHEMA_ITEM,
  name: l.name,
  type: "registry:lib",
  title: l.name,
  description:
    l.name === "utils"
      ? "cn() com o tailwind-merge estendido para a escala tipográfica do DS. Sem ele, text-body-md e text-muted-foreground se anulam."
      : `lib/${l.name}.ts, usado pelos componentes do DS.`,
  dependencies: l.pacotes,
  registryDependencies: l.itens.map(urlDoItem),
  files: [arquivo(l.rel, l.fonte, "registry:lib")],
}));

// Componente NÃO puxa os tokens: os tokens dependem da versão do Tailwind, e
// quem escolhe a versão é o setup, instalado uma vez.
const itensDeComponente = componentes.map((c) => ({
  $schema: SCHEMA_ITEM,
  name: c.name,
  type: "registry:ui",
  title: c.title,
  description: c.description,
  dependencies: c.pacotes,
  registryDependencies: c.itens.map(urlDoItem),
  files: [arquivo(c.rel, c.fonte, "registry:ui")],
  ...(c.categoria && { categories: [c.categoria] }),
  ...(c.pagina && { docs: `${c.title}: ${URL_DS}${c.pagina.href}` }),
}));

const arquivosDaSkill = [
  { path: "skill/SKILL.md", type: "registry:file", target: `${PASTA_SKILL}/SKILL.md`, content: skill(ext, itensDeComponente) },
  ...componentes.map((c) => ({
    path: `skill/componentes/${pascal(c.name)}.md`,
    type: "registry:file",
    target: `${PASTA_SKILL}/componentes/${pascal(c.name)}.md`,
    content: referenciaDoComponente({ ...c, ...itensDeComponente.find((i) => i.name === c.name) }),
  })),
];

const itemSetup = (versao) => ({
  $schema: SCHEMA_ITEM,
  name: versao === "v4" ? "setup" : "setup-v3",
  // `registry:theme` de propósito: só com esse tipo o shadcn SOBRESCREVE as
  // cores que o `shadcn init` já escreveu. Com item comum ele só acrescenta, e
  // --background, --primary e cia. continuam os do shadcn.
  type: "registry:theme",
  title: versao === "v4" ? "Setup" : "Setup (Tailwind v3)",
  description: `A base do DS para Tailwind ${versao}: tokens, cn() e a skill datacrazy-ds para o Claude Code, com as regras e a referência de cada componente.`,
  registryDependencies: [urlDoItem(versao === "v4" ? "tokens" : "tokens-v3"), urlDoItem("utils")],
  files: arquivosDaSkill,
  docs: "Skill instalada em .claude/skills/datacrazy-ds. Reinicie o Claude Code para ele carregar.",
});

const todos = {
  $schema: SCHEMA_ITEM,
  name: "all",
  type: "registry:item",
  title: "Todos os componentes",
  description: "Todos os componentes do DS de uma vez. Rode o setup antes.",
  registryDependencies: componentes.map((c) => urlDoItem(c.name)),
};

const base = [itemSetup("v4"), itemSetup("v3"), todos, itemTokens(ext, "v4"), itemTokens(ext, "v3"), ...itensDeLib];
const itens = [...base, ...itensDeComponente];

fs.rmSync(SAIDA, { recursive: true, force: true });
fs.mkdirSync(SAIDA, { recursive: true });
for (const item of itens) {
  fs.writeFileSync(path.join(SAIDA, `${item.name}.json`), JSON.stringify(item, null, 2) + "\n");
}

// Catálogo: o que `shadcn list/search @datacrazy` e o MCP leem. Sem o conteúdo
// dos arquivos — quem quer o código busca o item.
fs.writeFileSync(
  path.join(SAIDA, "registry.json"),
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "datacrazy",
      homepage: URL_DS,
      items: itens.map(({ $schema, files, cssVars, css, tailwind, docs, ...resto }) => ({
        ...resto,
        ...(files && { files: files.map(({ content, ...f }) => f) }),
      })),
    },
    null,
    2,
  ) + "\n",
);

const linkDe = (i) => `- [${i.title}](${urlDoItem(i.name)}): ${i.description}`;
fs.writeFileSync(
  path.join(RAIZ, "public/llms.txt"),
  `# DataCrazy Design System

> Componentes React + Tailwind do CRM DataCrazy, publicados como registry shadcn (\`${NAMESPACE}\`). Tokens em variáveis CSS, tema claro e escuro, ícones Phosphor, props em português.

## Instalar

1. \`npx shadcn@latest registry add ${NAMESPACE}=${URL_DS}/r/{name}.json\`
2. \`npx shadcn@latest add ${NAMESPACE}/setup\` — tokens, cn() e a skill datacrazy-ds para o Claude Code (Tailwind v3: \`${NAMESPACE}/setup-v3\`)
3. \`npx shadcn@latest mcp init --client claude\`

## Base

${base.map(linkDe).join("\n")}

## Componentes

${itensDeComponente.map(linkDe).join("\n")}

## Catálogo

- [registry.json](${URL_DS}/r/registry.json): todos os itens, sem o código
`,
);

console.log(`${itens.length} itens em public/r · catálogo em public/r/registry.json · public/llms.txt · ${URL_DS}`);
