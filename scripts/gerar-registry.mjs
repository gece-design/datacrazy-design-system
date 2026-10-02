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
import {
  RAIZ, ler, existe, pascal, umaLinha,
  lerNavegacao, dependenciasDe, exportsDe, secoesDoMd as secoesBrutas, exemplosDaPagina,
} from "./lib/fonte.mjs";

const require = createRequire(import.meta.url);
// A URL pública mora em lib/site.ts (dono único); DS_URL só para teste local.
const URL_DS = (process.env.DS_URL || ler("lib/site.ts").match(/URL_DS = "([^"]+)"/)[1]).replace(/\/$/, "");
const NAMESPACE = "@datacrazy";
// `~` é a raiz do projeto de quem instala, não a home do usuário.
const PASTA_SKILL = "~/.claude/skills/datacrazy-ds";
const SAIDA = path.join(RAIZ, "public/r");
const SCHEMA_ITEM = "https://ui.shadcn.com/schema/registry-item.json";

const urlDoItem = (nome) => `${URL_DS}/r/${nome}.json`;

// Todo componente tem doc (lote B1 da auditoria): a descrição vem da seção
// Responsabilidade. Sem doc, a geração quebra de propósito.
const DESCRICAO_FIXA = {};
const TITULO_FIXO = { "data-table": "Data Table", "logo-datacrazy": "Logo DataCrazy", "icone-de-marca": "Ícone de marca", "barra-de-filtros": "Barra de filtros", "painel-lateral": "Painel lateral" };
// Slug da página no site quando difere do nome do arquivo.
const PAGINA_FIXA = { "data-table": "table" };
// Componente que vive como SEÇÃO de outra página (decisão do humano, 2026-09-19):
// o `docs:` aponta para a âncora da seção, não para uma página própria.
const SECAO_FIXA = {
  rating: { pagina: "/forms/input", ancora: "rating" },
  telefone: { pagina: "/forms/input", ancora: "telefone" },
  textarea: { pagina: "/forms/input", ancora: "textarea" },
  "icone-de-marca": { pagina: "/foundations/icons", ancora: "marcas" },
  "segmented-control": { pagina: "/navigation/header", ancora: "segmented-control-e-view-switcher" },
};

// O que da doc do componente serve a quem USA. Par no Figma, lote e divergências
// abertas são maquinário do nosso processo — ficam fora.
const SECOES_UTEIS = ["Quando usar", "Props", "Variantes", "Estados", "Composição", "Exemplo de uso", "Acessibilidade"];

/* ------------------------------------------------------------------------- */

// Leitores do código (nav, imports, exports, seções do .md, exemplos das
// páginas) moram em scripts/lib/fonte.mjs — os check-*.mjs leem pelos mesmos.

/** Seções do .md como quem USA vai ler: link relativo aponta para o nosso
 *  repo, que o cliente não tem; marcador kfe é maquinário nosso. */
const secoesDoMd = (rel) =>
  secoesBrutas(rel, (t) =>
    t.replace(/\[([^\]]+)\]\((?!https?:)[^)]+\)/g, "$1").replace(/<!-- kfe:[^>]+-->\n?/g, ""),
  );

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
  // movimento (lote B2): o v4 tem namespace para duração e curva
  for (const [k, v] of Object.entries(ext.transitionDuration ?? {})) tema[`duration-${k}`] = v;
  for (const [k, v] of Object.entries(ext.transitionTimingFunction ?? {})) tema[`ease-${k}`] = v;
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
    // nem para opacidade com nome, nem para delay
    for (const [nome, valor] of Object.entries(ext.opacity ?? {})) item.css[`@utility opacity-${nome}`] = { opacity: valor };
    for (const [nome, valor] of Object.entries(ext.transitionDelay ?? {})) item.css[`@utility delay-${nome}`] = { "transition-delay": valor };
  } else {
    const chaves = ["colors", "fontFamily", "fontSize", "boxShadow", "backgroundImage", "borderRadius", "zIndex", "keyframes", "animation",
      "transitionDuration", "transitionDelay", "transitionTimingFunction", "opacity", "ringWidth"];
    // lib/estados.ts carrega classes: sem o content, o Tailwind de quem instala as descarta
    item.tailwind = { config: { content: ["./lib/**/*.{ts,tsx}"], theme: { extend: Object.fromEntries(chaves.map((k) => [k, ext[k]])) } } };
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

0. **Tela nova começa pela tela base.** \`npx shadcn@latest add ${NAMESPACE}/tela\`
   cria \`app/nova-tela/page.tsx\` com Sidebar, Header e conteúdo
   já ligados e responsivos (\`TelaBase\`). Renomeie a pasta e preencha os
   encaixes. Nunca monte Sidebar e Header à mão numa tela.
   Tela de lista, quadro, calendário ou registro aberto? Instale
   \`npx shadcn@latest add ${NAMESPACE}/pipeline\` e copie o padrão de lá
   (\`app/pipeline/\`): é a tela do funil inteira, feita pelo time do DS —
   Header de uma linha com busca, filtros em chips (\`BarraDeFiltros\`), Table
   densa com seleção em massa e edição na célula, e o lead aberto no
   \`Drawer\` do lead (\`drawer-lead.tsx\`, o mesmo em toda tela). É a referência de densidade e composição; não invente layout.
   Lista de registros (contatos, empresas, produtos)? \`${NAMESPACE}/leads\`
   (\`app/leads/\`): grade densa com ícone por coluna, edição na célula,
   filtros em chips, seleção em massa e o lead no \`Drawer\` do lead.
   Chat, inbox ou qualquer tela de mensagens? \`${NAMESPACE}/atendimento\`
   (\`app/atendimento/\`): conversas, mensagens e o lead em três colunas
   numa superfície só.
   Fluxo, automação ou qualquer editor em canvas? \`${NAMESPACE}/automacoes\`
   (\`app/automacoes/\`): canvas com mover, zoom, ligar por arrasto,
   desfazer e mapa; o bloco aberto num \`PainelLateral\`.
   Dashboard, painel ou relatório? \`${NAMESPACE}/dashboard\`
   (\`app/dashboard/\`, \`fundo="muted"\` na TelaBase): indicadores, gráfico ao lado da repartição, tabela
   do que precisa de atenção ao lado do ranking, período no Header.
1. **Procure antes de criar.** O catálogo no fim deste arquivo lista tudo o que
   existe. Se o componente existe e não está em \`components/ui/\`, instale:
   \`npx shadcn@latest add ${NAMESPACE}/<nome>\` (ou pela ferramenta MCP do shadcn).
2. **Leia a referência antes do primeiro uso:** \`componentes/<Nome>.md\`, nesta
   pasta. Comece pelo **Quando usar**: ele diz o que o componente resolve e,
   quando o caso é de outro, qual. Depois props, variantes, estados, exemplos
   e acessibilidade.
3. **As props são em português** (\`rotulo\`, \`titulo\`, \`aberto\`, \`aoFechar\`).
   Siga o arquivo do componente, não o costume do shadcn/ui.
4. **Não existe?** Componha com os componentes e os tokens do DS. Não crie
   variante nova de componente do DS nem edite \`components/ui/\` para encaixar
   um caso: isso é decisão do time de design.
5. **Texto nunca dentro do componente.** Toda string entra por prop — o produto
   é multi-idioma.
6. **Antes de dar a tela por pronta, rode \`node scripts/ds-check.mjs\`** (o setup
   instala) e corrija tudo que ele apontar: valor fora dos tokens, paleta ou
   tipografia do Tailwind, \`<input>\`/\`<table>\` cru, ícone de outra biblioteca,
   página sem \`TelaBase\`. Zero violação é critério de pronto. Depois, \`tsc\`.

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
- **Movimento** — duração (\`duration-\`, \`delay-\`): ${lista(Object.keys(ext.transitionDuration))} · curva (\`ease-\`): ${lista(Object.keys(ext.transitionTimingFunction))} · animação (\`animate-\`): ${lista(Object.keys(ext.animation))}. Nunca \`duration-200\`, \`ease-out\` ou \`setTimeout(…, 200)\` soltos; o JS lê \`DURACAO\` de \`@/lib/movimento\`. A redução de movimento é global no CSS.
- **Opacidade** (\`opacity-\` e modificador \`/\`): ${lista(Object.keys(ext.opacity))} — \`opacity-disabled\` no controle apagado, \`bg-overlay-scrim/scrim\` no fundo de camada.
- **Estados** (\`@/lib/estados\`): \`foco\` (outline 2px com respiro transparente — nunca ring com offset), \`focoAnel\` (contêiner que rola), \`focoInterno\` (célula colada), \`focoPeer\` (controle nativo escondido), \`focoDentro\` (campo composto), \`desabilitado\` (opacidade por token + cursor, eventos mantidos; hover sob \`enabled:\`), \`desabilitadoLink\`. Todo \`<button>\` e link interativo usa \`foco\` — nunca escreva o anel à mão. O \`content\` do tailwind precisa incluir \`./lib/**/*.{ts,tsx}\`.
- **Traço interno** de 1.5px: \`ring-1.5 ring-inset\` (regra D18), nunca \`border-[1.5px]\`.
- **Cor em SVG:** \`fill="currentColor"\` / \`stopColor="currentColor"\` mais a classe
  de texto do token (\`text-primary\`).
- **Ícones:** \`@phosphor-icons/react\`, \`weight="regular"\` na interface inteira
  (\`fill\` só no item selecionado); 16px em botão e campo.
- **Tema escuro:** classe \`dark\` no \`<html>\`. Os tokens trocam sozinhos —
  nunca ramifique código por tema.
- **Gradiente** (\`bg-\`): ${lista(Object.keys(ext.backgroundImage))}
- **Fonte:** Geist, pela variável \`--font-geist-sans\`. O setup instala o pacote
  \`geist\`; a variável só existe se o layout raiz a declarar:

  \`\`\`tsx
  import { GeistSans } from "geist/font/sans";
  import { GeistMono } from "geist/font/mono";
  <html lang="pt-BR" className={\`\${GeistSans.variable} \${GeistMono.variable}\`}>
  \`\`\`

  Conferir com \`getComputedStyle(document.body).fontFamily\` — tem de começar com GeistSans.

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

/** Itens do catálogo que um trecho usa além do próprio: vira a linha "Exige:"
 *  no exemplo publicado, para o agente instalar antes de copiar (AUD-066). */
function exigeDe(trecho, c, componentes) {
  const itens = new Set();
  for (const m of trecho.matchAll(/<([A-Z]\w*)/g)) {
    const dono = componentes.find((x) => x.name !== c.name && x.exports.includes(m[1]));
    if (dono && !c.itens.includes(dono.name)) itens.add(dono.name);
  }
  return [...itens].sort();
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
  const exige = (trecho) => {
    const itens = exigeDe(trecho, c, componentes);
    return itens.length ? `// Exige: ${itens.map((n) => `${NAMESPACE}/${n}`).join(", ")}\n` : "";
  };
  for (const s of SECOES_UTEIS) {
    if (!c.md?.[s]) continue;
    // no "Exemplo de uso", cada bloco de código ganha a linha "Exige:" com os
    // itens do catálogo que ele usa além do próprio — o agente instala antes de copiar
    const corpo = s === "Exemplo de uso" ? c.md[s].replace(/```tsx\n([\s\S]*?)```/g, (_, t) => `\`\`\`tsx\n${exige(t)}${t}\`\`\``) : c.md[s];
    linhas.push("", `## ${s}`, "", corpo);
  }
  if (c.exemplos.length) {
    linhas.push("", "## Exemplos do site", "");
    for (const e of c.exemplos) linhas.push("```tsx", exige(e) + e, "```", "");
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
    const secao = SECAO_FIXA[name];
    const pagina = secao
      ? { ...paginas.find((p) => p.href === secao.pagina), href: `${secao.pagina}#${secao.ancora}` }
      : paginas.find((p) => p.href.split("/").pop() === slug);
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

// Blocos: telas inteiras do site publicadas como `registry:block` — `shadcn add
// @datacrazy/tela` escreve app/nova-tela/page.tsx pronta (pedido do humano,
// 2026-09-23); `@datacrazy/pipeline` escreve a tela do funil inteira (quadro,
// lista, calendário, lead no drawer), para o agente copiar o padrão de uma tela
// real em vez de inventar (bancada, 2026-09-28). Import de fora de ui/ e lib/
// vira vizinho do bloco (`reescritas`).
const BLOCOS = [
  {
    name: "tela",
    title: "Tela",
    description: "Uma tela nova, pronta: Sidebar, Header e conteúdo já ligados e responsivos (TelaBase). Toda tela começa por aqui.",
    arquivos: [{ de: "app/exemplos/tela-base/page.tsx", para: "app/nova-tela/page.tsx" }],
    docs: `Tela base: ${URL_DS}/exemplos/tela-base — renomeie a pasta app/nova-tela e preencha os encaixes.`,
  },
  {
    name: "pipeline",
    title: "Pipeline",
    description: "O funil do CRM inteiro, pronto: quadro com arrastar e soltar, lista densa com seleção em massa e edição na célula, calendário, filtros em chips e o lead aberto no Drawer do lead. A tela de referência para lista, quadro e detalhe — copie o padrão dela.",
    arquivos: [
      { de: "app/exemplos/pipeline/page.tsx", para: "app/pipeline/page.tsx" },
      { de: "app/exemplos/pipeline/tela.tsx", para: "app/pipeline/tela.tsx" },
      { de: "app/exemplos/pipeline/lista.tsx", para: "app/pipeline/lista.tsx" },
      { de: "app/exemplos/pipeline/quadro.tsx", para: "app/pipeline/quadro.tsx" },
      { de: "app/exemplos/pipeline/painel-lead.tsx", para: "app/pipeline/painel-lead.tsx" },
      { de: "app/exemplos/pipeline/dados.ts", para: "app/pipeline/dados.ts" },
      // o Drawer do lead é o da página do Drawer: vai junto, como vizinho
      { de: "app/feedback/drawer/drawer-lead.tsx", para: "app/pipeline/drawer-lead.tsx" },
    ],
    // a foto do atendente é do site (/ds/…): no projeto de quem instala a Tag fica só com o nome
    reescritas: [
      ["@/app/feedback/drawer/drawer-lead", "./drawer-lead"],
      [' foto="/ds/atendente.png"', ""],
      ['foto: "/ds/atendente.png"', "foto: undefined"],
    ],
    docs: `Pipeline: ${URL_DS}/exemplos/pipeline — a tela em app/pipeline; troque os dados de exemplo (dados.ts) pelos do CRM.`,
  },
  {
    name: "leads",
    title: "Leads",
    description: "A lista de contatos do CRM, pronta: grade densa com ícone por coluna e iniciais coloridas, tags e origem editadas na célula, filtros em chips, agrupar, seleção em massa, o lead aberto no Drawer do lead e o modal de criar tag com as quinze cores. A tela de referência para lista de registros — copie o padrão dela.",
    arquivos: [
      { de: "app/exemplos/leads/page.tsx", para: "app/leads/page.tsx" },
      { de: "app/exemplos/leads/tela.tsx", para: "app/leads/tela.tsx" },
      { de: "app/exemplos/leads/painel-lead.tsx", para: "app/leads/painel-lead.tsx" },
      { de: "app/exemplos/leads/dados.ts", para: "app/leads/dados.ts" },
      { de: "app/feedback/drawer/drawer-lead.tsx", para: "app/leads/drawer-lead.tsx" },
    ],
    reescritas: [
      ["@/app/feedback/drawer/drawer-lead", "./drawer-lead"],
      [' foto="/ds/atendente.png"', ""],
      ['foto: "/ds/atendente.png"', "foto: undefined"],
    ],
    docs: `Leads: ${URL_DS}/exemplos/leads — a tela em app/leads; troque os dados de exemplo (dados.ts) pelos do CRM.`,
  },
  {
    name: "atendimento",
    title: "Atendimento",
    description: "O multiatendimento inteiro, pronto: lista de conversas com abas de situação, mensagens com nota interna e respostas rápidas, e o lead editável ao lado. A tela de referência para chat e para o cartão do lead — copie o padrão dela.",
    arquivos: [
      { de: "app/exemplos/atendimento/page.tsx", para: "app/atendimento/page.tsx" },
      { de: "app/exemplos/atendimento/tela.tsx", para: "app/atendimento/tela.tsx" },
      { de: "app/exemplos/atendimento/lista.tsx", para: "app/atendimento/lista.tsx" },
      { de: "app/exemplos/atendimento/conversa.tsx", para: "app/atendimento/conversa.tsx" },
      { de: "app/exemplos/atendimento/painel.tsx", para: "app/atendimento/painel.tsx" },
      { de: "app/exemplos/atendimento/lead-completo.tsx", para: "app/atendimento/lead-completo.tsx" },
      { de: "app/exemplos/atendimento/dados.ts", para: "app/atendimento/dados.ts" },
      { de: "app/feedback/drawer/drawer-lead.tsx", para: "app/atendimento/drawer-lead.tsx" },
    ],
    reescritas: [
      ["@/app/feedback/drawer/drawer-lead", "./drawer-lead"],
      [' foto="/ds/atendente.png"', ""],
      ['foto: "/ds/atendente.png"', "foto: undefined"],
    ],
    docs: `Atendimento: ${URL_DS}/exemplos/atendimento — a tela em app/atendimento; troque os dados de exemplo (dados.ts) pelos da API.`,
  },
  {
    name: "automacoes",
    title: "Automações",
    description: "O construtor de automações, pronto: um canvas de verdade, sem biblioteca de grafo — arrastar o fundo move a tela, rolar ou pinçar dá zoom, arrastar de uma saída liga os blocos; com desfazer, organizar, mapa, seleção de vários e menu no botão direito — e o bloco aberto num painel ao lado para editar nome, conteúdo e destino de cada saída. A tela de referência para fluxo, canvas e editor visual — copie o padrão dela.",
    arquivos: [
      { de: "app/exemplos/automacoes/page.tsx", para: "app/automacoes/page.tsx" },
      { de: "app/exemplos/automacoes/tela.tsx", para: "app/automacoes/tela.tsx" },
      { de: "app/exemplos/automacoes/canvas.tsx", para: "app/automacoes/canvas.tsx" },
      { de: "app/exemplos/automacoes/painel-bloco.tsx", para: "app/automacoes/painel-bloco.tsx" },
      { de: "app/exemplos/automacoes/dados.ts", para: "app/automacoes/dados.ts" },
    ],
    docs: `Automações: ${URL_DS}/exemplos/automacoes — a tela em app/automacoes; troque os dados de exemplo (dados.ts) pelos da API.`,
  },
  {
    name: "dashboard",
    title: "Dashboard",
    description: "O dashboard do CRM, pronto: quatro indicadores, receita por dia ao lado da origem dos negócios, e os negócios parados ao lado do ranking de atendentes, com o período no Header. A tela de referência para painel e relatório — copie o padrão dela.",
    arquivos: [
      { de: "app/exemplos/dashboard/page.tsx", para: "app/dashboard/page.tsx" },
      { de: "app/exemplos/dashboard/tela.tsx", para: "app/dashboard/tela.tsx" },
      { de: "app/exemplos/dashboard/lead-parado.tsx", para: "app/dashboard/lead-parado.tsx" },
      { de: "app/exemplos/dashboard/dados.ts", para: "app/dashboard/dados.ts" },
      { de: "app/feedback/drawer/drawer-lead.tsx", para: "app/dashboard/drawer-lead.tsx" },
    ],
    reescritas: [
      ["@/app/feedback/drawer/drawer-lead", "./drawer-lead"],
      [' foto="/ds/atendente.png"', ""],
      ['foto: "/ds/atendente.png"', "foto: undefined"],
    ],
    docs: `Dashboard: ${URL_DS}/exemplos/dashboard — a tela em app/dashboard; troque os dados de exemplo (dados.ts) pelos da API.`,
  },
];

const blocos = BLOCOS.map((b) => {
  const itens = new Set();
  const pacotes = new Set();
  const files = b.arquivos.map(({ de, para }) => {
    let fonte = ler(de);
    for (const [antes, depois] of b.reescritas ?? []) {
      // import: troca o especificador entre aspas; texto solto: troca literal
      fonte = antes.startsWith("@/") ? fonte.split(`"${antes}"`).join(`"${depois}"`) : fonte.split(antes).join(depois);
    }
    const deps = dependenciasDe(fonte, de);
    // vizinho do bloco (./dados, ./tela) não é item do catálogo
    for (const i of deps.itens) if (!b.arquivos.some((a) => path.basename(a.para, path.extname(a.para)) === i)) itens.add(i);
    for (const p of deps.pacotes) pacotes.add(p);
    return { path: para, type: para.endsWith("page.tsx") ? "registry:page" : "registry:file", target: para, content: fonte };
  });
  return { ...b, itens: [...itens], pacotes: [...pacotes], files };
});
const itensDeBloco = blocos.map((b) => ({
  $schema: SCHEMA_ITEM,
  name: b.name,
  type: "registry:block",
  title: b.title,
  description: b.description,
  dependencies: b.pacotes,
  registryDependencies: b.itens.map(urlDoItem),
  files: b.files,
  categories: ["telas"],
  docs: b.docs,
}));

// lib/ entra só no que algum componente importa — o resto de lib/ é do site.
const libs = new Map();
const pendentes = [...componentes.flatMap((c) => c.itens), ...blocos.flatMap((b) => b.itens)].filter((n) => existe(`lib/${n}.ts`));
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
  // só rota que existe: item do nav com pronto:false era um 404 publicado (AUD-070)
  ...(c.pagina?.pronto && { docs: `${c.title}: ${URL_DS}${c.pagina.href}` }),
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

// O check do DS para o projeto de quem instala: scripts/ds-check.mjs com as
// regras embutidas (lá não existe scripts/lib). Vai dentro do setup.
function checkInstalavel() {
  const regras = ler("scripts/lib/regras-tokens.mjs").replace(/^export /gm, "");
  const corpo = ler("scripts/ds-check.mjs").replace(/^import \{ REGRAS, REGRAS_DE_TELA, semTelaBase \} from "\.\/lib\/regras-tokens\.mjs";\n/m, "");
  const [cabecalho, resto] = corpo.split('import path from "node:path";\n');
  return `${cabecalho}import path from "node:path";\n\n/* ---- regras (geradas de scripts/lib/regras-tokens.mjs do DS) ---- */\n${regras}\n/* ---- fim das regras ---- */\n${resto}`;
}

const HOOK_DO_CHECK = `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{ "type": "command", "command": "node scripts/ds-check.mjs --hook" }]
      }
    ]
  }
}`;

const itemSetup = (versao) => ({
  $schema: SCHEMA_ITEM,
  name: versao === "v4" ? "setup" : "setup-v3",
  // `registry:theme` de propósito: só com esse tipo o shadcn SOBRESCREVE as
  // cores que o `shadcn init` já escreveu. Com item comum ele só acrescenta, e
  // --background, --primary e cia. continuam os do shadcn.
  type: "registry:theme",
  title: versao === "v4" ? "Setup" : "Setup (Tailwind v3)",
  description: `A base do DS para Tailwind ${versao}: tokens, cn() e a skill datacrazy-ds para o Claude Code, com as regras e a referência de cada componente.`,
  // A escala tipográfica inteira aponta para --font-geist-sans: sem o pacote,
  // tudo cai na fonte de sistema em silêncio (AUD-067).
  dependencies: ["geist"],
  registryDependencies: [urlDoItem(versao === "v4" ? "tokens" : "tokens-v3"), urlDoItem("utils")],
  files: [...arquivosDaSkill, { path: "scripts/ds-check.mjs", type: "registry:file", target: "scripts/ds-check.mjs", content: checkInstalavel() }],
  docs: "Skill instalada em .claude/skills/datacrazy-ds (reinicie o Claude Code) e o check do DS em scripts/ds-check.mjs — rode `node scripts/ds-check.mjs` depois de cada tela, ou ligue o hook em .claude/settings.json (ver a página de instalação).",
});

const todos = {
  $schema: SCHEMA_ITEM,
  name: "all",
  type: "registry:item",
  title: "Todos os componentes",
  description: "Todos os componentes do DS de uma vez. Rode o setup antes.",
  registryDependencies: componentes.map((c) => urlDoItem(c.name)),
};

// "Quando usar" de cada doc, por rota do site: a página do componente mostra o
// mesmo texto que a skill lê. Dono único é o .md; a página não repete à mão.
const quandoUsar = {};
for (const c of componentes) {
  const guia = c.md?.["Quando usar"];
  if (!guia) throw new Error(`docs/componentes/${pascal(c.name)}.md: sem a seção "Quando usar"`);
  if (!c.pagina) continue;
  const itens = (rotulo) =>
    guia
      .split("\n")
      .filter((l) => l.startsWith(`- **${rotulo}** `))
      .map((l) => l.slice(`- **${rotulo}** `.length).trim());
  (quandoUsar[c.pagina.href.split("#")[0]] ??= []).push({ componente: c.pagina.href.includes("#") ? pascal(c.name) : c.title, ancora: c.pagina.href.includes("#"), usar: itens("Use"), naoUsar: itens("Não use") });
}
// o dono da página vem primeiro; quem vive como seção dela vem depois
for (const grupos of Object.values(quandoUsar)) grupos.sort((a, b) => a.ancora - b.ancora);
fs.writeFileSync(
  path.join(RAIZ, "lib/quando-usar.json"),
  JSON.stringify(
    Object.fromEntries(
      Object.keys(quandoUsar)
        .sort()
        .map((rota) => [rota, quandoUsar[rota].map(({ ancora, ...g }) => g)]),
    ),
    null,
    2,
  ) + "\n",
);

const base = [itemSetup("v4"), itemSetup("v3"), ...itensDeBloco, todos, itemTokens(ext, "v4"), itemTokens(ext, "v3"), ...itensDeLib];
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
2. \`npx shadcn@latest add ${NAMESPACE}/setup\` — tokens, cn(), a skill datacrazy-ds para o Claude Code e o check do DS (scripts/ds-check.mjs) (Tailwind v3: \`${NAMESPACE}/setup-v3\`)
3. \`npx shadcn@latest mcp init --client claude\`
4. \`npx shadcn@latest add ${NAMESPACE}/tela\` — a tela base: toda tela nova começa por ela; \`${NAMESPACE}/pipeline\` traz o funil inteiro (quadro, lista, calendário, drawer) e \`${NAMESPACE}/atendimento\` o multiatendimento (conversas, mensagens, lead) como referência de tela real

## Verificar

\`node scripts/ds-check.mjs\` aponta o que saiu do DS numa tela (tokens, paleta, elemento cru, TelaBase). Como hook do Claude Code, em .claude/settings.json:

\`\`\`json
${HOOK_DO_CHECK}
\`\`\`

## Base

${base.map(linkDe).join("\n")}

## Componentes

${itensDeComponente.map(linkDe).join("\n")}

## Catálogo

- [registry.json](${URL_DS}/r/registry.json): todos os itens, sem o código
`,
);

console.log(`${itens.length} itens em public/r · catálogo em public/r/registry.json · public/llms.txt · ${URL_DS}`);
