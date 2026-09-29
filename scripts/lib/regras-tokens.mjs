// As regras de "valor de estilo fora dos tokens", num módulo só: o
// check-tokens (este repo) e a bancada (projeto de quem instala o DS) leem as
// mesmas. Cada regra tem um nome estável (é a `verificacao` dos achados em
// docs/processo/consistencia.json) e diz de onde vem.
export const UI = (f) => f.startsWith("components/ui/");
export const COMPONENTES = (f) => f.startsWith("components/");
export const PAGINAS = (f) => f.startsWith("app/");
export const ICONES = new Set([12, 14, 16, 20]);

// arquivo → regras que não valem nele, com motivo
export const EXCECOES = {
  // D19: fileira que rola corta o outline com offset; ring-inset é a exceção documentada
  "components/ui/tabs.tsx": ["foco-ring"],
  // o próprio Button: é ele que define a base
  "components/ui/button.tsx": ["botao-cru"],
  // a página da paleta MOSTRA os hex: é documentação do token, não estilo
  "app/foundations/color/page.tsx": ["hex"],
};

/** @type {Array<{regra:string, origem:string, onde:(f:string)=>boolean, ativa?:boolean, informativa?:boolean, teste:(linha:string, f:string)=>string[]|null}>} */
export const REGRAS = [
  { regra: "duracao-literal", origem: "D20 · I10", onde: () => true, teste: (l) => l.match(/\b(?:duration|delay)-\d+\b/g) },
  { regra: "curva-literal", origem: "D20 · I10", onde: () => true, teste: (l) => l.match(/\bease-(?:in-out|in|out|linear)\b|\bease-\[[^\]]*\]/g) },
  { regra: "transition-all", origem: "I11", onde: () => true, teste: (l) => l.match(/\btransition-all\b/g) },
  { regra: "foco-ring", origem: "D6", onde: () => true, teste: (l) => l.match(/focus-visible:ring-\S+/g) },
  { regra: "ring-offset", origem: "D6", onde: () => true, teste: (l) => l.match(/\bring-offset-\S+/g) },
  { regra: "opacidade-literal", origem: "I5 · tokens", onde: () => true, teste: (l) => l.match(/\bopacity-(?:50|\[[^\]]+\])/g) },
  { regra: "scrim-literal", origem: "tokens · pendência 7", onde: () => true, teste: (l) => l.match(/\b(?:overlay-scrim|neutral-\d+|black|white)\/\d+\b/g) },
  { regra: "sombra-arbitraria", origem: "G4 · escala de elevação", onde: () => true, teste: (l) => l.match(/\bshadow-\[[^\]]+\]/g) },
  { regra: "tipografia-arbitraria", origem: "tokens text/*", onde: () => true, teste: (l) => l.match(/\b(?:text|tracking)-\[[^\]]+\]/g) },
  { regra: "z-cru", origem: "E2", onde: () => true, teste: (l) => l.match(/\bz-(?:\d+|\[[^\]]+\])\b/g) },
  { regra: "hex", origem: "lista negativa", onde: () => true, teste: (l) => l.match(/[\["']#[0-9a-fA-F]{3,8}\b/g) },
  { regra: "dark-no-componente", origem: "D11", onde: UI, teste: (l) => l.match(/\bdark:[\w-]+/g) },
  { regra: "timeout-literal", origem: "D20", onde: UI, teste: (l) => l.match(/setTimeout\([^,]+,\s*\d+|const\s+\w+_MS\s*=\s*\d+/g) },
  {
    regra: "icone-fora-da-escala", origem: "escala de ícone", onde: () => true,
    teste: (l) => [...l.matchAll(/\bsize=\{(\d+(?:\.\d+)?)\}/g)].filter((m) => !ICONES.has(Number(m[1]))).map((m) => m[0]),
  },
  { regra: "botao-cru", origem: "lista negativa · duplica o Button", onde: PAGINAS, teste: (l) => l.match(/<button\b/g) },
  // O fundo da caixa de preview é do seletor de fundo (components/ds/fundo-preview):
  // um `bg-*` no className da <Secao> vence pelo tailwind-merge e a amostra
  // deixa de trocar a cor (2026-09-21). Quem quer outro fundo inicial passa `fundo=`.
  { regra: "fundo-da-caixa", origem: "seletor de fundo do preview", onde: PAGINAS, multilinha: true,
    teste: (l, f, resto) => {
      if (!/<Secao\b/.test(l)) return null;
      // só o atributo da tag: o `codigo={`…`}` traz className e ">" de exemplo,
      // então os template literals saem antes de procurar o fim da tag
      const tag = (resto ?? l).slice(0, 8000).replace(/`[\s\S]*?`/g, "").split(/(?<!=)>/)[0];
      // sem seletor não há amostra a vencer: a caixa pode ser transparente
      if (/\bsemSeletorDeFundo\b/.test(tag)) return null;
      const m = tag.match(/className=\{?"[^"]*\bbg-[\w-]+[^"]*"\}?/);
      return m ? [m[0]] : null;
    },
  },
  // Desde o lote B3 (lib/estados.ts existe): um <button> em componente cuja tag
  // não usa a constante `foco` (nem `buttonVariants`) copiou o anel — ou não tem.
  // A tag pode ocupar várias linhas: a regra recebe o resto do arquivo.
  { regra: "botao-cru", origem: "lista negativa · sem `foco` compartilhado (D21)", onde: COMPONENTES, multilinha: true,
    teste: (l, f, resto, arquivoInteiro) => {
      if (!/<button\b/.test(l)) return null;
      // a tag até o primeiro ">" que não seja de arrow function
      const tag = (resto ?? l).slice(0, 1200).split(/(?<!=)>/)[0];
      // constantes do arquivo que carregam o foco (`const botao = \`…${foco}…\``, cva com a base)
      const portadores = [...(arquivoInteiro ?? "").matchAll(/const\s+(\w+)\s*=[^;]*?\$\{foco\w*\}/gs)].map((m) => m[1]);
      const ok = /\bfoco\w*\b|buttonVariants/.test(tag) || portadores.some((n) => new RegExp("\\b" + n + "\\b").test(tag));
      return ok ? null : ["<button sem foco"];
    } },
  {
    // Informativa: conta os valores arbitrários (a maioria vem de medida do
    // Figma e só se resolve com a remedição). Nunca reprova.
    regra: "arbitrario", origem: "inventário", onde: COMPONENTES, informativa: true,
    teste: (l) =>
      [...l.matchAll(/(?<![\w-])([a-z][a-z-]*)-\[([^\]]+)\]/g)]
        .filter((m) => !/^(?:has|group-has|peer-has|transition|bg-\[?image|grid-cols|grid-rows|content)$/.test(m[1]))
        .filter((m) => !/^(?:&|data-|inherit|var\(|image:|:|\[)/.test(m[2]) && !/^\[/.test(m[2]))
        .filter((m) => !/^(?:shadow|text|tracking|z|opacity)$/.test(m[1])) // já contadas nas regras próprias
        .map((m) => m[0]),
  },
];

/* ------------------------------------------------------------------------- */

/** As regras de TELA: o que uma página montada com o DS não pode ter. Valem
 *  em app/ e components/ (fora de components/ui, que é o próprio DS). São as
 *  da bancada (scripts/bancada) e do check instalado no projeto do cliente. */
const PALETA = "(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)";
export const REGRAS_DE_TELA = [
  { regra: "paleta-tailwind", origem: "tokens · só cor semântica", teste: (l) => l.match(new RegExp(`\\b(?:bg|text|border|ring|from|to|fill|stroke)-${PALETA}-\\d{2,3}\\b`, "g")) },
  { regra: "tipografia-tailwind", origem: "tokens text/*", teste: (l) => l.match(/\btext-(?:xs|sm|base|lg|xl|\dxl)\b/g) },
  { regra: "raio-fora-da-escala", origem: "tokens radius", teste: (l) => l.match(/\brounded-(?:2xl|3xl)\b/g) },
  { regra: "elemento-cru", origem: "o DS tem o componente", teste: (l) => l.match(/<(?:input|select|textarea|table)\b/g) },
  { regra: "icones-fora", origem: "A8 · Phosphor", teste: (l) => l.match(/from ["'](?:lucide-react|@heroicons\/[\w-]+|react-icons[\w/]*)["']/g) },
  { regra: "radix-direto", origem: "componha com o DS", teste: (l) => l.match(/from ["']@radix-ui\/(?!react-slot)[\w-]+["']/g) },
  { regra: "estilo-inline", origem: "tokens", teste: (l) => l.match(/style=\{\{[^}]*(?:color|background|fontSize|padding|margin)\b/g) },
  { regra: "grid-fixo", origem: "auto-layout · gradeDeCartoes", informativa: true, teste: (l) => l.match(/\bgrid-cols-\d\b/g) },
];

/** `page.tsx` de tela do CRM sem `TelaBase`: montou Sidebar e Header à mão, ou
 *  nem isso. Vale para toda página em app/ menos a raiz (que costuma ser
 *  redirecionamento) — `ds-check:ignore sem-tela-base` dispensa. */
export function semTelaBase(rel, fonte) {
  if (!/^app\/.+\/page\.tsx$/.test(rel)) return false;
  if (/ds-check:ignore\s+sem-tela-base/.test(fonte)) return false;
  return !/\bTelaBase\b/.test(fonte);
}
