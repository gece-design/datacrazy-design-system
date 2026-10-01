# DataCrazy — Regras — **v2**

> **v1 → v2:** acrescentadas as regras que nascem de bug real registrado. Cada
> uma delas fecha um padrão de falha dos 22 tickets confirmados — resolver no
> DS é resolver uma vez, em vez de tela a tela.

## Regras de negócio

**Fora deste ciclo.** Acesso, planos, estados de domínio e cobrança são regras
de produto — entram quando as telas entrarem, vindas do humano. O CRM já as
tem implementadas; documentá-las é trabalho retroativo de outro ciclo.

## Regras que nascem de bug (evidência nos tickets)

| # | Regra | Origem |
|---|---|---|
| E1 | **Texto que pode truncar carrega tooltip com o conteúdo completo.** Não existe truncamento mudo no DS. | #83283 · #83274 · #59567 |
| E2 | **`z-index` só via escala de camadas do DS** (ex.: base → dropdown → sticky → modal → toast). Número cru em componente é rejeitado. | #86338 · #86178 |
| E3 | **Componente responde a zoom e a viewport.** Nada de dimensão que só fecha em 100% de zoom; verificação inclui pelo menos um nível de zoom além de 100%. | #83285 · #80170 · #79852 · #53179 |
| E4 | **Nenhuma variável de tema repete valor entre claro e escuro** sem intenção declarada por escrito. Vale checagem automática — é literalmente o bug #80174, 13 de ~30 variáveis. | #80174 |
| E5 | **Densidade é decisão de design, não acúmulo.** Componente que empilha informação repetida precisa de justificativa; o cliente já reclamou de não achar a etapa do funil. | #34395 |
| E6 | **Erro de validação não é mensagem solta.** O DS oferece o padrão (inline + modal quando bloqueante); a escolha é da spec, nunca do improviso. | #39683 |
| E7 | **Acessibilidade é critério de pronto**, mesmo sem exigência formal de WCAG: foco visível, navegação por teclado, contraste. | #62306 · #61699 · #85316 · #79729 |

## Regras que nascem das anti-referências

Fonte: FigJam · PASSO 3 · DEFINE, coluna "O que MENOS gosta". Interpretação e
contexto em `docs/processo/ux-direcao-visual.md`.

| # | Regra | Anti-referência |
|---|---|---|
| A1 | **Raio contido e uniforme.** Arredondamento forte está fora — *"passa aplicativozinho de iOS baratinho; CRM precisa de autoridade"*. E o mesmo raio vale para botão, card e input: forma diferente exige motivo | nº 1, nº 2 |
| A2 | **Cor não preenche superfície.** Cor entra em **borda e tag**, não no corpo do card. Saturação baixa. **Amarelo não é cor de marca** | nº 3, 4, 5 |
| A3 | **Sem gradiente de fundo e sem glass.** Efeito pesado para quem passa o dia na tela | nº 6, 7 |
| A4 | **Hierarquia por contraste, não por tamanho.** Título discreto; texto uniforme sem contraste é o que faz *"parecer visual de e-mail"* | nº 8, 9 |
| A5 | **Um menu só.** Lateral **ou** superior, nunca os dois. Abas não são estratégia de crescimento — quebram por navegador e viram duas linhas | nº 10, 11 |
| A6 | **Nada de título e descrição decorativos** em toda tela. Se o usuário já sabe onde está, o texto é ruído | nº 12 |
| A7 | **Gráfico minimalista:** sem eixo, legenda embaixo, valor no hover | nº 13 e gosto nº 12 |
| A8 | **Ícones Phosphor** (pedido do cliente numa das primeiras reuniões; decisão de 2026-09-01), com **um único peso** em toda a interface — `regular` padrão, `fill` para selecionado. Peso misto é quebra de padronização. Logo de marca não é ícone de interface: é `IconeDeMarca` (ADR-048) | nº 14 (conflito registrado em `docs/01-arquitetura.md`) e nº 2 |
| A9 | **"Algumas pinceladas", não layout novo.** O DS é adotável de forma incremental sobre o que existe — coerente com a regra 14 | nº 15 |

## Padrões que o time quer (do "O que MAIS gosta")

| # | Padrão | Onde vira componente |
|---|---|---|
| G1 | Drawer lateral do registro (fino à direita ou tela cheia, fecha no X), com accordion dentro | Sobreposições |
| G2 | Edição inline: clica no campo e edita, sem abrir formulário | Formulários |
| G3 | Sidebar colapsável com grupos em accordion, favoritos e últimos acessos | Navegação |
| G4 | Colapsar a sidebar inteira — heavy user não perde 15–20% da tela | Navegação |
| G5 | Breadcrumb de no máximo 2 níveis | Navegação |
| G6 | Canto superior direito reservado a perfil, tema, notificação, IA e chat | Navegação |
| G7 | Busca com listagem e atalhos de teclado **visíveis** (Esc, setas, Enter) | Navegação |
| G8 | Lista sem header de coluna quando o dado é auto-evidente | Exibição de dados |
| G9 | Tabela com resize de coluna e duplo clique para ajustar ao conteúdo | Exibição de dados |
| G10 | Modal em três áreas: grupos à esquerda, conteúdo à direita, botões separados | Sobreposições |
| G11 | Card colapsável com seta de "ver dados detalhados"; dashboard montado pelo usuário | Exibição de dados |

## Regras de uso do design system

### Tema
1. Todo componente funciona em claro **e** escuro sem ramificação de código:
   a troca acontece no token.
2. Componente nunca lê cor direto — só token.
3. Valor que existe no Figma em um só tema é **bloqueio**, não licença para
   estimar o outro.

### i18n (multi-idioma é requisito — R3)
4. Componente do DS não embute texto. Toda string vem de fora, via `next-intl`.
5. Todo componente é testado com string longa: alemão-simulado, `es` e `pt-br`
   costumam ser 20–30% mais longos que `en`. Quebrou o layout, é bug (ver E1).

### Composição
6. Variante nova só existe se existe no Figma.
7. Antes de criar componente, procure no showcase — duplicata é proibida.
8. Componente do DS não conhece domínio: `<LeadCard>` é componente de produto,
   não do DS.

### Estados
9. Todo componente interativo define default, hover, focus-visible, active,
   disabled e — quando aplicável — loading, empty e error.
10. `hover:` sempre sob `hoverOnlyWhenSupported`; o equivalente para toque é
    decidido explicitamente (G7).

### Uma superfície só
- A `TelaBase` põe o Header e o conteúdo num painel só (`card`, com traço),
  sobre o fundo da aplicação (ADR-055). O conteúdo NÃO repete esse painel:
  nada de `bg-card rounded border` em volta da tela inteira.
- Tela de lista, quadro ou chat: `recuo={false}` na `TelaBase`, e o conteúdo
  encosta nas bordas do painel — a `DataTable` vai com `className="rounded-none
  border-0"`, e faixas (barra de filtros, resumo) se separam por `border-b`.
  Tela de dashboard ou formulário: recuo padrão, blocos com traço (`Card`,
  `KpiCard`, `DataTable`).
- Dentro do painel, o que é cinza é `bg-background` (coluna neutra do quadro,
  trilho, botão de apoio); o que é branco já é a superfície. Não use
  `bg-card` para destacar um bloco: use traço.

### Header de uma linha
- O Header é uma linha: trilha, título e, à direita, ações e sino (ADR-053). A
  trilha traz só os níveis acima — `Breadcrumb ancestrais` — e o `titulo` é a
  página. Nunca repita o nome da página como último item da trilha.
- O botão de recolher a navegação mora na linha da marca da Sidebar (ADR-052);
  a `TelaBase` já cuida disso.
- A navegação é plana, 220px (48 recolhida), item de 32 (ADR-054). Atalhos que
  a pessoa fixou vão em `SidebarGrupo rotulo="Favoritos" ocultarRecolhida`,
  depois dos destinos. Não use `recuo` no `SidebarGrupo`: não tem mais efeito.

### Busca, filtros e divisor no Header
- A busca é sempre `HeaderBusca` e os filtros sempre `HeaderFiltros`; nunca um
  Button com texto no lugar. Fileira de ações só com botões: busca aberta
  (184px) e filtros com rótulo. Com troca-visão, período ou data: busca
  `recolhida` (só a lupa; clicar abre) e filtros `recolhido` (só o ícone, com
  tooltip). Por tela, não por largura (ADR-028).
- `HeaderDivisor` só entre o grupo de visão (troca-visão, período, data) e a
  ação principal. Fileira só com busca, filtros e a ação não leva divisor.
- Os filtros em si são a `BarraDeFiltros`, sob o Header: cada filtro ativo é um
  chip ("Etapa: Proposta"), o "+ Filtro" lista os campos, e cada campo abre a
  própria lista com busca. O `HeaderFiltros` mostra e esconde a barra e exibe
  `contarFiltros(valor)`. Campo de um valor só leva `unico`. Aplica na hora:
  sem botão de confirmar, sem modal (ADR-050).

### Formulário, rolagem e relevo
- Select ao lado de Input é sempre `size="field"` (a caixa do Input). O `md` é
  de card e, num formulário, parece desabilitado (ADR-038).
- Escolha em lista: até ~10 opções fechadas é `Select`; lista longa, com busca
  ou com várias escolhas é `Combobox` / `ComboboxMultiplo`. Os dois aceitam
  `grupo` (cabeçalho) e `icone` por opção (ADR-049).
- Marca (WhatsApp, Instagram, Google…) é sempre `IconeDeMarca`, com o nome ao
  lado: o logo de verdade, num conjunto fechado. Nunca um `<svg>` de logo colado
  na tela, nem a cor de uma marca fora do ícone (ADR-048).
- Área que rola usa `rolagemDiscreta` (lib/estados.ts): barra fina, visível só
  sob o cursor. Nunca `[scrollbar-width:thin]` solto.
- Button `primary` e `destructive` são planos (ADR-037). A sombra interna
  (`shadow-button-inner`) fica em `tertiary`, `soft` e na busca do Header, e
  some no escuro.
- Cabeçalho do Modal: 12 em cima, 8 embaixo, título `h4`, X de 24 (ADR-039).
- Alça da coluna da tabela: dois cliques ou Enter ajustam ao conteúdo.
- Cartão do drawer: rótulo em bold e valor numa linha de 24 (`linhaDoCartao`).
  Select dentro do cartão é `cartao`, nunca `field` dentro de `CartaoDeCampo`.
- Drawer abre com 840px e a pessoa arrasta a borda esquerda (720 a 1080);
  `memoria` no `DrawerPainel` lembra a largura por tela. O conteúdo nunca tem
  número fixo de colunas: cartões em `gradeDeCartoes` (auto-fill de 220px).

### Telas: receitas (o que uma tela do CRM é)
Toda tela nasce do bloco `@datacrazy/tela` (TelaBase: Sidebar + Header + conteúdo).
O conteúdo segue uma destas quatro receitas — a referência viva é o bloco
`@datacrazy/pipeline` (`app/pipeline/`), feito pelo time do DS.
- **Lista de registros** (contatos, leads, negócios): `DataTable` (nasce
  `densa`; não passe `layout`), `icone` em cada coluna, com
  `useAjustesDaTabela` e `DataTableToolbar` (só rótulo e
  total); `BotaoAgrupar` e `BotaoColunas` recolhidos na fileira do Header, ao
  lado de `HeaderBusca recolhida` e `HeaderFiltros recolhido`, que mostra e
  esconde a `BarraDeFiltros` sob o Header; `Pagination` embaixo; seleção em massa com `useSelecaoDaTabela` + `BarraDeSelecao`;
  clique na linha abre o registro no `Drawer`. Células: `CelulaLead` (nome +
  `Tag` neutra com `status`), `CelulaProgresso` (etapa), `Tag foto` (pessoa),
  `CelulaEditavel` (valor editável), `CelulaEscolha` (valor que vem de lista:
  tags, etapa — edita na célula, sem modal), origem com `IconeDeMarca`.
- **Cadastro / edição** (poucos campos): `Modal size="md"` com `Input`,
  `Select size="field"`, `InputTelefone`, `DatePicker`; rodapé com `Button
  size="sm"` (`outline` cancela, `primary` confirma). Muitos campos ou edição
  de um registro existente: não é modal — é o `Drawer` com cartões
  (`CampoEditavel`, `Select cartao`, `Rating`) em `gradeDeCartoes`.
- **Dashboard**: bloco `@datacrazy/dashboard` (`app/dashboard/`). Três faixas,
  do resumo ao detalhe, com `gap-3`: (1) `KpiCard` em grade `grid-cols-1
  sm:grid-cols-2 xl:grid-cols-4` (com a Sidebar aberta, quatro só acima de 1280
  — senão o número trunca); (2) `grid xl:grid-cols-3` com o `Card` do gráfico
  (`CardChart`, sem eixo) em `xl:col-span-2` e a repartição (`CardDonut`) ao
  lado; (3) `grid xl:grid-cols-3 items-start` com a `DataTable` do que precisa
  de atenção (`xl:col-span-2`, direto na superfície, nunca dentro de `Card`) e
  o ranking (`CardList`) ao lado. Período no Header (`SegmentedControl` ou
  `DateRangePicker`), valendo para a tela toda; dashboard não tem ação principal.
  `trend` do KpiCard é a direção literal do número, não "bom" ou "ruim".
- **Atendimento (chat, inbox, mensagens)**: bloco `@datacrazy/atendimento`
  (`app/atendimento/`). `recuo={false}`: três colunas encostadas nas bordas
  do painel da tela, separadas por traço: lista de conversas (320, abas de situação com
  `Tabs`), mensagens (`role="log"`, recebida à esquerda em `muted`, enviada à
  direita em `button-soft`, nota interna em `warning/10`, evento do sistema em
  uma linha) e o lead (320, cartões do drawer). Compositor: `Textarea
  rotuloOculto linhas={1}` + `SegmentedControl` Mensagem / Nota interna.
  Abaixo de 1280 o lead abre por cima; abaixo de 768, lista OU conversa.
- **Detalhe de um registro**: `Drawer` + `DrawerPainel` (perfil à esquerda com
  `DrawerPerfil`, `DrawerMetricas`, `DrawerMenu`; conteúdo à direita com
  `DrawerConteudo` e `DrawerSecao`).

### Telas: densidade (os números que o cliente pediu)
O cliente comparou com o Twenty e o Attio: "menos gap, menos padding, stroke
nas divs; o nosso parece gigante". Os números que fecham isso:
- Linha de tabela: 36px (`densa`, o padrão da Table), traço entre colunas e entre linhas.
- Espaço vazio tem critério. É respiro quando separa grupos (`gap-6` entre
  seções). É desperdício quando fica ENTRE itens do mesmo grupo ou quando o
  conteúdo estica para preencher a tela: cartão e campo têm a largura do
  conteúdo (`gradeDeCartoes`), lista com poucos itens termina onde termina — não
  se centraliza nem se alarga — e o que sobra fica embaixo, uma vez só.
- Cartão de campo: 68px (rótulo em bold + linha de valor de 24).
- Cabeçalho e rodapé de Modal: 44px; botões `sm` (28px).
- Espaço entre cartões e blocos: `gap-3` (12). Recuo do conteúdo da tela: 16
  (`p-4`), dado pela `TelaBase`. Entre seções: `gap-6`.
- Título de tela uma vez, no Header (é o `h1`, em 13px, ao lado da trilha);
  dentro do conteúdo só `h3`/`h4` e
  `label-*`. Nada de `h2` decorativo, subtítulo explicativo ou texto de apoio
  que a pessoa já sabe (regra A6).
- Escala de espaço: 4 · 8 · 12 · 16 · 24 · 32. Fora dela é invenção.

### Telas: anti-padrões (o que faz "parecer o DataCrazy antigo")
- `grid-cols-N` fixo em conteúdo que muda de largura → `gradeDeCartoes` ou
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- `Select` na barra da tabela para filtrar → `BarraDeFiltros` sob o Header; a
  barra da tabela só tem rótulo, total e, no máximo, Button `tertiary` + `Menu`.
- `Modal` com grupos de `Checkbox` empilhados para filtrar → `BarraDeFiltros`.
- `Select` com vinte opções, ou vários `Checkbox` para escolher numa lista longa
  → `Combobox` / `ComboboxMultiplo`.
- Logo de marca colado como `<svg>`, ou glifo pintado com a cor da marca → `IconeDeMarca`.
- `DataTable layout="confortavel"` (linha alta, a do arquivo) para lista de
  registros → tire a prop: a Table nasce `densa`. `confortavel` é para
  leitura com respiro (relatório, doc).
- `Tag tom="…"` sorteada para cada etiqueta → `Tag` neutra com `status`; cor só
  quando o produto define a cor daquele dado (etapa do funil, tom do perfil).
  O cliente tirou a variação colorida em 18/09 ("vibe code").
- Formulário longo em `Modal` → `Drawer` com cartões. Modal é decisão curta.
- Sidebar ou Header montados à mão, ou tela sem `TelaBase`.
- Card dentro de card, frame dentro de frame, tabela dentro de `Card`: uma
  superfície por bloco, e toda superfície tem traço (`border`).
- Espaço em branco no lugar de traço: onde a informação é densa (tabela,
  cartões do drawer), o `border`/`divider` separa; o respiro fica para o
  dashboard.
- Título + descrição no topo de toda seção, botão `lg` onde cabe `md`,
  ícone de 20/24 em botão (é 16).

### Fidelidade
11. Pronto = diff ≤ 1% contra o Figma **e** geometria sem divergência.
12. Divergência visual é bug do código até prova em contrário registrada como
    exceção aprovada com print.
13. Corrigiu a mesma divergência 2x → vira regra em `docs/processo/calibration.md`
    antes de continuar.

### Retroatividade (cenário C)
14. **Nunca big-bang.** O DS cobre as telas-alvo do lote; o resto do CRM migra
    lote a lote, guiado por demanda.
15. Token existente com nome ruim (`--red`) só é renomeado com plano de
    migração — renomear sem migrar quebra produção.
