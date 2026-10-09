export type ItemNav = {
  titulo: string;
  href: string;
  pronto?: boolean;
  icone?: string;
  descricao?: string;
  /** O dia da última mudança que a pessoa VÊ na página (AAAA-MM-DD). O selo "new" do menu aparece por sete dias a partir dele. */
  atualizado?: string;
};
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
      { titulo: "SystemCrazy", href: "/getting-started/installation", icone: "download", pronto: true, descricao: "Usar o DS no Claude Code"},
      { titulo: "Protótipo SystemCrazy", href: "/prototipo", atualizado: "2026-10-02", icone: "tela", pronto: true, descricao: "O CRM navegável, montado só com o design system" },
    ],
  },
  {
    titulo: "Foundations",
    descricao: "Os tokens sobre os quais tudo é construído.",
    itens: [
      { titulo: "Color", href: "/foundations/color", icone: "paleta", pronto: true , descricao: "Paleta e tokens semânticos"},
      { titulo: "Typography", href: "/foundations/typography", icone: "texto", pronto: true , descricao: "Escala, pesos e estilos"},
      { titulo: "Icons", href: "/foundations/icons", atualizado: "2026-10-01", icone: "formas", pronto: true , descricao: "Phosphor, peso e tamanhos"},
      { titulo: "Spacing", href: "/foundations/spacing", icone: "espaco", pronto: true , descricao: "Catorze degraus, de 0 a 80"},
      { titulo: "Radius", href: "/foundations/radius", icone: "raio", pronto: true , descricao: "Sete degraus, todos de --radius"},
      { titulo: "Elevation", href: "/foundations/elevation", icone: "elevacao", pronto: true , descricao: "Quatro alturas de flutuação"},
      { titulo: "Motion", href: "/foundations/motion", atualizado: "2026-10-02", icone: "movimento", pronto: true, descricao: "Três durações, quatro curvas"},
    ],
  },
  {
    titulo: "Actions",
    descricao: "O que o usuário aciona.",
    itens: [
      { titulo: "Button", href: "/actions/button", atualizado: "2026-10-02", icone: "clique", pronto: true , descricao: "Ação do usuário, quatro variantes"},
      { titulo: "Icon Button", href: "/actions/icon-button", icone: "toque", pronto: true, descricao: "Ação só de ícone, em quatro tamanhos"},
    ],
  },
  {
    titulo: "Forms",
    descricao: "Entrada e edição de dados.",
    itens: [
      { titulo: "Input", href: "/forms/input", atualizado: "2026-10-07", icone: "campo", pronto: true , descricao: "Campo de texto de uma linha"},
      { titulo: "Select", href: "/forms/select", atualizado: "2026-10-07", icone: "selecao", pronto: true, descricao: "Escolha numa lista, com a lista aberta"},
      { titulo: "Combobox", href: "/forms/combobox", atualizado: "2026-10-07", icone: "lupa", pronto: true, descricao: "Lista com busca, uma ou várias escolhas"},
      { titulo: "Checkbox", href: "/forms/checkbox", atualizado: "2026-10-07", icone: "caixa", pronto: true , descricao: "Marcação, com indeterminado"},
      { titulo: "Radio Group", href: "/forms/radio-group", icone: "radio", pronto: true , descricao: "Escolha exclusiva por setas"},
      { titulo: "Switch", href: "/forms/switch", icone: "interruptor", pronto: true , descricao: "Liga e desliga na hora"},
      { titulo: "Date Picker", href: "/forms/date-picker", icone: "calendario", pronto: true , descricao: "Período em dois meses, com atalhos"},
      { titulo: "Time Picker", href: "/forms/time-picker", icone: "relogio", pronto: true , descricao: "Hora e data-hora, cientes de fuso"},
      { titulo: "Upload", href: "/forms/upload", atualizado: "2026-10-08", icone: "anexo", pronto: true, descricao: "Zona de soltar e a lista dos arquivos" },
    ],
  },
  {
    titulo: "Navigation",
    descricao: "Como o usuário se move pelo produto.",
    itens: [
      { titulo: "Sidebar", href: "/navigation/sidebar", atualizado: "2026-10-07", icone: "painel", pronto: true, descricao: "Navegação principal"},
      { titulo: "Header", href: "/navigation/header", atualizado: "2026-10-02", icone: "cabecalho", pronto: true, descricao: "Topo da página: trilha, título e ações"},
      { titulo: "Breadcrumb", href: "/navigation/breadcrumb", icone: "trilha", pronto: true, descricao: "Trilha que recolhe os níveis do meio"},
      { titulo: "Pagination", href: "/navigation/pagination", icone: "paginas", pronto: true , descricao: "Controles de página de uma lista"},
      // Estava no escopo negativo do roadmap (anti-referência nº 11). Entrou por
      // decisão do humano em 2026-09-15, com fileira que rola em vez de quebrar.
      { titulo: "Tabs", href: "/navigation/tabs", icone: "abas", pronto: true , descricao: "Seções do mesmo registro"},
      { titulo: "Filtros", href: "/navigation/barra-de-filtros", atualizado: "2026-10-01", icone: "funil", pronto: true, descricao: "Cada filtro ativo é um chip" },
    ],
  },
  {
    titulo: "Data Display",
    descricao: "O CRM é denso: esta é a categoria que mais pesa.",
    itens: [
      // Nome do component set no Figma (269:53). O slot nasceu no roadmap como
      // "Stat Card"; quem batiza é o arquivo.
      { titulo: "Card", href: "/data-display/card", atualizado: "2026-10-01", icone: "cartao", pronto: true , descricao: "Lista, rosca e barras"},
      { titulo: "KPI Card", href: "/data-display/kpi-card", atualizado: "2026-10-01", icone: "metrica", pronto: true , descricao: "Métrica em destaque"},
      { titulo: "Tag", href: "/data-display/tag", atualizado: "2026-10-07", icone: "etiqueta", pronto: true, descricao: "Etiqueta do lead e seletor"},
      { titulo: "Avatar", href: "/data-display/avatar", atualizado: "2026-10-01", icone: "pessoa", pronto: true , descricao: "Identificação de pessoa"},
      { titulo: "Table", href: "/data-display/table", atualizado: "2026-10-02", icone: "tabela", pronto: true , descricao: "A tabela de negócios do CRM"},
      { titulo: "Calendário", href: "/data-display/calendario", icone: "agenda", pronto: true, descricao: "Os negócios no mês ou na semana, pela próxima ação" },
      { titulo: "Cartão de catálogo", href: "/data-display/cartao-de-catalogo", atualizado: "2026-10-07", icone: "catalogo", pronto: true, descricao: "Nome, descrição, ações e 2 a 3 métricas no pé" },
      { titulo: "Quadro", href: "/data-display/quadro", atualizado: "2026-10-07", icone: "kanban", pronto: true, descricao: "O kanban: colunas de 220 a 300 e cartões que se arrastam" },
      { titulo: "Conversa", href: "/data-display/conversa", atualizado: "2026-10-07", icone: "conversa", pronto: true, descricao: "O chat: balões, eventos e o compositor" },
      { titulo: "Lista de conversas", href: "/data-display/lista-de-conversas", atualizado: "2026-10-07", icone: "conversas", pronto: true, descricao: "Abas de situação e uma linha por conversa" },
      { titulo: "Canvas", href: "/data-display/canvas", atualizado: "2026-10-07", icone: "canvas", pronto: true, descricao: "Blocos ligados numa folha com zoom de 25% a 200%" },
    ],
  },
  {
    titulo: "Feedback & Overlays",
    descricao: "O que aparece por cima e o que responde ao usuário.",
    itens: [
      { titulo: "Tooltip", href: "/feedback/tooltip", icone: "balao", pronto: true , descricao: "Conteúdo de texto truncado"},
      { titulo: "Toast", href: "/feedback/toast", icone: "sino", pronto: true , descricao: "Confirmação que não bloqueia"},
      { titulo: "Modal", href: "/feedback/modal", atualizado: "2026-10-07", icone: "camada", pronto: true , descricao: "Camada que exige decisão"},
      { titulo: "Painel lateral", href: "/feedback/painel-lateral", atualizado: "2026-10-01", icone: "lateral", pronto: true, descricao: "O registro aberto ao lado da lista" },
      { titulo: "Drawer", href: "/feedback/drawer", atualizado: "2026-10-02", icone: "gaveta", pronto: true , descricao: "O registro completo, por cima da tela"},
{ titulo: "Drawer variações", href: "/feedback/drawer-variacoes", icone: "proposta", pronto: true, descricao: "Cores, menu, linha do tempo e propostas"},
      { titulo: "Versões do lead", href: "/feedback/drawer-versoes", atualizado: "2026-10-09", icone: "gaveta", pronto: true, descricao: "Com menu, com abas, ao lado ou em página: para decidir" },
      { titulo: "Estado vazio", href: "/feedback/estado-vazio", atualizado: "2026-10-08", icone: "vazio", pronto: true, descricao: "A tela sem nada: com ícone, ou só a frase" },
      { titulo: "Carregamento", href: "/feedback/carregamento", atualizado: "2026-10-08", icone: "carregando", pronto: true, descricao: "Skeleton: a forma do que vai chegar, brilhando" },
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

/**
 * As telas do protótipo, uma a uma. Saíram do menu em 2026-10-02 (humano:
 * "junte todas as telas de exemplo em uma só") — o menu leva ao Protótipo
 * SystemCrazy, que liga todas pela navegação. Continuam sendo rotas: cada uma
 * é a página que um bloco instala, e os scripts de rota e de regressão as
 * leem daqui.
 *
 * ATENÇÃO: o cliente lê título e descrição. Nada de linguagem interna.
 */
export const telasDoPrototipo: ItemNav[] = [
  { titulo: "Tela base", href: "/exemplos/tela-base", icone: "tela", pronto: true, descricao: "A casca de toda tela nova: Sidebar, Header, subcabeçalho e breakpoints" },
  { titulo: "Dashboard", href: "/exemplos/dashboard", icone: "progresso", pronto: true, descricao: "Indicadores, gráfico e o que precisa de atenção" },
  { titulo: "Pipeline", href: "/exemplos/pipeline", icone: "kanban", pronto: true, descricao: "Funil em kanban, com arrastar e soltar" },
  { titulo: "Leads", href: "/exemplos/leads", icone: "contatos", pronto: true, descricao: "A lista de contatos: grade densa, edição na célula e criar tag" },
  { titulo: "Atendimento", href: "/exemplos/atendimento", icone: "conversa", pronto: true, descricao: "Conversas, mensagens e o lead na mesma tela" },
  { titulo: "Automações", href: "/exemplos/automacoes", icone: "fluxo", pronto: true, descricao: "O fluxo em blocos, com o bloco aberto ao lado" },
  { titulo: "Agentes de IA", href: "/exemplos/agentes", icone: "robo", pronto: true, descricao: "Os agentes em cartões, com score, modelo e ferramentas; bases de conhecimento e servidores MCP ao lado" },
  { titulo: "Tags coloridas", href: "/exemplos/tags-proposta", icone: "etiqueta", pronto: true, descricao: "Antes e depois: a cor da tag vem da regra do grupo" },
];
