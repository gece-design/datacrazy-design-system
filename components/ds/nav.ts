export type ItemNav = { titulo: string; href: string; pronto?: boolean; icone?: string; descricao?: string };
export type CategoriaNav = { titulo: string; descricao: string; itens: ItemNav[] };

// Títulos em inglês: é nomenclatura de front-end (decisão do humano, 2026-09-01).
// As 5 categorias de componentes seguem o contrato do FigJam · PASSO 1.
export const navegacao: CategoriaNav[] = [
  {
    titulo: "Getting Started",
    descricao: "O ponto de partida.",
    itens: [
      { titulo: "Let's begin", href: "/", pronto: true, icone: "foguete" , descricao: "O que é e a regra que sustenta"},
      { titulo: "Installation", href: "/getting-started/installation", pronto: true, icone: "download" , descricao: "Rodar, adotar e atualizar tokens"},
    ],
  },
  {
    titulo: "Foundations",
    descricao: "Os tokens sobre os quais tudo é construído.",
    itens: [
      { titulo: "Color", href: "/foundations/color", pronto: true, icone: "palette" , descricao: "Paleta e tokens semânticos"},
      { titulo: "Typography", href: "/foundations/typography", pronto: true, icone: "texto" , descricao: "Escala, pesos e estilos"},
      { titulo: "Icons", href: "/foundations/icons", pronto: true, icone: "formas" , descricao: "Phosphor, peso e tamanhos"},
      { titulo: "Spacing", href: "/foundations/spacing", pronto: true, icone: "formas" , descricao: "Catorze degraus, de 0 a 80"},
      { titulo: "Radius", href: "/foundations/radius", pronto: true, icone: "formas" , descricao: "Sete degraus, todos de --radius"},
      { titulo: "Elevation", href: "/foundations/elevation", pronto: true, icone: "formas" , descricao: "Quatro alturas de flutuação"},
    ],
  },
  {
    titulo: "Actions",
    descricao: "O que o usuário aciona.",
    itens: [
      { titulo: "Button", href: "/actions/button", pronto: true , descricao: "Ação do usuário, quatro variantes"},
      { titulo: "Icon Button", href: "/actions/icon-button" , descricao: "Ação sem rótulo"},
    ],
  },
  {
    titulo: "Forms",
    descricao: "Entrada e edição de dados.",
    itens: [
      { titulo: "Input", href: "/forms/input" , descricao: "Campo de texto de uma linha"},
      { titulo: "Select", href: "/forms/select" , descricao: "Escolha numa lista"},
      { titulo: "Checkbox", href: "/forms/checkbox" , descricao: "Alternância booleana"},
      { titulo: "Date Picker", href: "/forms/date-picker", pronto: true , descricao: "Período em dois meses, com atalhos"},
    ],
  },
  {
    titulo: "Navigation",
    descricao: "Como o usuário se move pelo produto.",
    itens: [
      { titulo: "Sidebar", href: "/navigation/sidebar", pronto: true, descricao: "Navegação principal"},
      { titulo: "Breadcrumb", href: "/navigation/breadcrumb" , descricao: "Trilha de dois níveis"},
      { titulo: "Pagination", href: "/navigation/pagination" , descricao: "Navegação entre páginas"},
    ],
  },
  {
    titulo: "Data Display",
    descricao: "O CRM é denso: esta é a categoria que mais pesa.",
    itens: [
      // Nome do component set no Figma (269:53). O slot nasceu no roadmap como
      // "Stat Card"; quem batiza é o arquivo.
      { titulo: "KPI Card", href: "/data-display/kpi-card", pronto: true , descricao: "Métrica em destaque"},
      { titulo: "Badge", href: "/data-display/badge", pronto: true , descricao: "Rótulo de estado"},
      { titulo: "Avatar", href: "/data-display/avatar" , descricao: "Identificação de pessoa"},
      { titulo: "Table", href: "/data-display/table" , descricao: "Dados tabulares"},
      { titulo: "Progress", href: "/data-display/progress" , descricao: "Andamento de etapa"},
    ],
  },
  {
    titulo: "Feedback & Overlays",
    descricao: "O que aparece por cima e o que responde ao usuário.",
    itens: [
      { titulo: "Tooltip", href: "/feedback/tooltip" , descricao: "Conteúdo de texto truncado"},
      { titulo: "Empty State", href: "/feedback/empty-state" , descricao: "Ausência de dados"},
      { titulo: "Modal", href: "/feedback/modal" , descricao: "Camada que exige decisão"},
      { titulo: "Drawer", href: "/feedback/drawer" , descricao: "Registro aberto lateralmente"},
    ],
  },
];

export function tituloDaRota(href: string) {
  for (const c of navegacao) {
    const i = c.itens.find((x) => x.href === href);
    if (i) return { categoria: c.titulo, item: i.titulo };
  }
  return null;
}

/** Lista plana, na ordem da navegação, só dos itens com página pronta. */
export const ordemDasPaginas: ItemNav[] = navegacao.flatMap((c) => c.itens.filter((i) => i.pronto));

export function vizinhos(href: string) {
  const i = ordemDasPaginas.findIndex((x) => x.href === href);
  if (i < 0) return { anterior: null, proxima: null };
  return {
    anterior: i > 0 ? ordemDasPaginas[i - 1] : null,
    proxima: i < ordemDasPaginas.length - 1 ? ordemDasPaginas[i + 1] : null,
  };
}
