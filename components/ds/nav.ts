export type ItemNav = { titulo: string; href: string; pronto?: boolean; icone?: string; descricao?: string };
export type CategoriaNav = { titulo: string; descricao: string; itens: ItemNav[] };

// Títulos em inglês: é nomenclatura de front-end (decisão do humano, 2026-09-01).
// As 5 categorias de componentes seguem o contrato do FigJam · PASSO 1.
//
// `icone` é uma CHAVE, não um componente: este arquivo é a verdade da navegação
// e não deve importar nada de renderização. O mapa chave → glifo Phosphor mora
// em `components/ds/sidebar.tsx`. Todo item tem um — o menu recolhido mostra só
// o glifo, e item sem ícone lá vira um buraco na coluna.
export const navegacao: CategoriaNav[] = [
  {
    titulo: "Getting Started",
    descricao: "O ponto de partida.",
    itens: [
      { titulo: "Let's begin", href: "/", icone: "foguete", pronto: true , descricao: "O que é e a regra que sustenta"},
      { titulo: "Installation", href: "/getting-started/installation", icone: "download", pronto: true, descricao: "Usar o DS no Claude Code"},
    ],
  },
  {
    titulo: "Foundations",
    descricao: "Os tokens sobre os quais tudo é construído.",
    itens: [
      { titulo: "Color", href: "/foundations/color", icone: "paleta", pronto: true , descricao: "Paleta e tokens semânticos"},
      { titulo: "Typography", href: "/foundations/typography", icone: "texto", pronto: true , descricao: "Escala, pesos e estilos"},
      { titulo: "Icons", href: "/foundations/icons", icone: "formas", pronto: true , descricao: "Phosphor, peso e tamanhos"},
      { titulo: "Spacing", href: "/foundations/spacing", icone: "espaco", pronto: true , descricao: "Catorze degraus, de 0 a 80"},
      { titulo: "Radius", href: "/foundations/radius", icone: "raio", pronto: true , descricao: "Sete degraus, todos de --radius"},
      { titulo: "Elevation", href: "/foundations/elevation", icone: "elevacao", pronto: true , descricao: "Quatro alturas de flutuação"},
    ],
  },
  {
    titulo: "Actions",
    descricao: "O que o usuário aciona.",
    itens: [
      { titulo: "Button", href: "/actions/button", icone: "clique", pronto: true , descricao: "Ação do usuário, quatro variantes"},
      { titulo: "Icon Button", href: "/actions/icon-button", icone: "toque" , descricao: "Ação sem rótulo"},
    ],
  },
  {
    titulo: "Forms",
    descricao: "Entrada e edição de dados.",
    itens: [
      { titulo: "Input", href: "/forms/input", icone: "campo", pronto: true , descricao: "Campo de texto de uma linha"},
      { titulo: "Select", href: "/forms/select", icone: "selecao" , descricao: "Escolha numa lista"},
      { titulo: "Checkbox", href: "/forms/checkbox", icone: "caixa", pronto: true , descricao: "Marcação, com indeterminado"},
      { titulo: "Radio Group", href: "/forms/radio-group", icone: "radio", pronto: true , descricao: "Escolha exclusiva por setas"},
      { titulo: "Switch", href: "/forms/switch", icone: "interruptor", pronto: true , descricao: "Liga e desliga na hora"},
      { titulo: "Date Picker", href: "/forms/date-picker", icone: "calendario", pronto: true , descricao: "Período em dois meses, com atalhos"},
    ],
  },
  {
    titulo: "Navigation",
    descricao: "Como o usuário se move pelo produto.",
    itens: [
      { titulo: "Sidebar", href: "/navigation/sidebar", icone: "painel", pronto: true, descricao: "Navegação principal"},
      { titulo: "Header", href: "/navigation/header", icone: "cabecalho", pronto: true, descricao: "Topo da página: trilha, título e ações"},
      { titulo: "Breadcrumb", href: "/navigation/breadcrumb", icone: "trilha", pronto: true, descricao: "Trilha que recolhe os níveis do meio"},
      { titulo: "Pagination", href: "/navigation/pagination", icone: "paginas", pronto: true , descricao: "Controles de página de uma lista"},
      // Estava no escopo negativo do roadmap (anti-referência nº 11). Entrou por
      // decisão do humano em 2026-09-15, com fileira que rola em vez de quebrar.
      { titulo: "Tabs", href: "/navigation/tabs", icone: "abas", pronto: true , descricao: "Seções do mesmo registro"},
    ],
  },
  {
    titulo: "Data Display",
    descricao: "O CRM é denso: esta é a categoria que mais pesa.",
    itens: [
      // Nome do component set no Figma (269:53). O slot nasceu no roadmap como
      // "Stat Card"; quem batiza é o arquivo.
      { titulo: "Card", href: "/data-display/card", icone: "cartao", pronto: true , descricao: "Lista, rosca e barras"},
      { titulo: "KPI Card", href: "/data-display/kpi-card", icone: "metrica", pronto: true , descricao: "Métrica em destaque"},
      { titulo: "Tag", href: "/data-display/tag", icone: "etiqueta", pronto: true, descricao: "Etiqueta do lead e seletor"},
      { titulo: "Avatar", href: "/data-display/avatar", icone: "pessoa", pronto: true , descricao: "Identificação de pessoa"},
      { titulo: "Table", href: "/data-display/table", icone: "tabela", pronto: true , descricao: "A tabela de negócios do CRM"},
      { titulo: "Progress", href: "/data-display/progress", icone: "progresso" , descricao: "Andamento de etapa"},
    ],
  },
  {
    titulo: "Feedback & Overlays",
    descricao: "O que aparece por cima e o que responde ao usuário.",
    itens: [
      { titulo: "Tooltip", href: "/feedback/tooltip", icone: "balao", pronto: true , descricao: "Conteúdo de texto truncado"},
      { titulo: "Toast", href: "/feedback/toast", icone: "sino", pronto: true , descricao: "Confirmação que não bloqueia"},
      { titulo: "Empty State", href: "/feedback/empty-state", icone: "bandeja" , descricao: "Ausência de dados"},
      { titulo: "Modal", href: "/feedback/modal", icone: "camada", pronto: true , descricao: "Camada que exige decisão"},
      { titulo: "Drawer", href: "/feedback/drawer", icone: "gaveta", pronto: true , descricao: "O lead aberto pela direita"},
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
