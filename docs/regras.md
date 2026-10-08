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
9. Tudo o que uma tela do protótipo mostra é componente do design system
   (cliente, reunião de 2026-10-02; ADR-073). A tela só monta: dados, palavras
   (`rotulos`) e o que vai dentro de cada encaixe. Peça que nasce numa tela
   (um cartão, uma lista, um canvas) sai dela para `components/ui` com página
   e doc antes de a tela ser entregue — senão a geração de uma tela nova
   reinventa a peça.

### Estados
9. Todo componente interativo define default, hover, focus-visible, active,
   disabled e — quando aplicável — loading, empty e error.
10. `hover:` sempre sob `hoverOnlyWhenSupported`; o equivalente para toque é
    decidido explicitamente (G7).
11. **Vazio** é `EstadoVazio` (ADR-077): com ícone quando a área inteira da
    tela está vazia (a conta nova, a busca que não achou), sem ícone e
    `tamanho="sm"` dentro de lista, aba, coluna ou cartão. O título diz o que
    não há e por quê; a ação tira do vazio. Nunca um `<p>` solto com "Nada
    encontrado". Toda tela do protótipo aceita `vazio` (`?vazio=1`).
12. **Carregando** é `Skeleton` (ADR-078): `SkeletonDaTela` com o `modelo` da
    tela que vem (tabela, cartões, quadro, conversa, painel, canvas) no lugar
    do conteúdo, enquanto a API responde. O brilho vai e volta em
    `duration/ciclo` com `ease/vaivem`. Nunca um spinner no meio da página.
13. **Lista longa pagina** (ADR-076): 20 por página, `Pagination` sob a
    tabela com "Mostrando 1–20 de 84 leads"; busca e filtros voltam para a
    primeira; sem registro visível, sem paginação.
14. **Toggles com vão** (ADR-075): `SegmentedControl`, `ViewSwitcher` e o tema
    da `Sidebar` têm 2px de trilho entre as opções — a selecionada não encosta
    nas vizinhas.

### O padrão de fundo: o mesmo em toda tela
Quatro tons, sempre nos mesmos lugares (humano, 2026-10-02, ADR-066) — dashboard,
lista, quadro e chat seguem igual:
- **Navegação**: `background` (o cinza da aplicação).
- **Topo** (Header, faixa de filtros): `card`, branco, com traço embaixo.
- **Conteúdo**: `muted`, o cinza claro — é o padrão da `TelaBase`; não passe
  `fundo`. Não é o cinza da navegação nem o branco dos blocos.
- **Blocos**: `card` com traço `border` e raio `md`. `Card` e `KpiCard` quando
  têm recuo; `blocoDaTela` (lib/estados) quando o conteúdo encosta nas bordas —
  a tabela, a lista, cada coluna do chat.
- Tela de dashboard ou formulário: recuo padrão da `TelaBase` (16), blocos em
  grade. Tela de lista: `recuo={false}`, a faixa de filtros branca encostada
  nas bordas e, embaixo, `p-3` com a `DataTable` (`rounded-none border-0`)
  dentro de um `blocoDaTela` — o bloco tem a altura do conteúdo e rola por
  dentro quando passa da tela. Quadro: as colunas direto sobre o `muted`,
  com `p-3`. Chat: cada coluna é um `blocoDaTela`, com `gap-3`; no celular a
  coluna ocupa a tela, sem margem.
- Dentro de um bloco branco, o que é cinza é `bg-background` (trilho, botão de
  apoio, coluna neutra do quadro). Nunca bloco branco direto sobre o Header
  sem o fundo `muted` em volta, nem a tela inteira branca.

### Contraste na navegação e nos controles de apoio
Vale para o item da `Sidebar`, o Button `tertiary`, o `SegmentedControl`, o
`ViewSwitcher`, a `HeaderBusca` e o gatilho de data (humano, 2026-10-02, ADR-067):
- **Repouso**: texto e ícone em `foreground` — preto, não cinza.
- **Hover**: o fundo clareia meio degrau — branco a 50% (`hoverDeApoio` e
  `hoverNoTrilho`, lib/estados). Não troca de cor nem vai para o azul.
- **Ativo / selecionado**: fundo branco (`card`), com o ícone PREENCHIDO
  (`weight="fill"`) e o texto em azul. O azul clarinho de fundo saiu.
- Não reescreva essas cores por `className`: as peças já saem assim.
- Sidebar recolhida: o símbolo da marca fica em cima, com 20px (o tamanho de
  um ícone de item), e o botão de expandir embaixo dele, sempre à vista.
  Nunca o símbolo grande que vira botão sob o cursor (cliente, 2026-10-02,
  ADR-072).

### Movimento nas telas
- Trocar de tela, abrir filtro, trocar de seção no drawer: `animate-fade-in-fast`.
  O conteúdo da `TelaBase` já entra em fade sozinho.
- O que entra numa lista que já está na tela (cartão do quadro, mensagem do
  chat): `animate-surgir` — sobe 4px. Barra de gráfico: `animate-crescer`.
- O que a pessoa conduz com a mão (arrastar, rolar, pinçar) segue o dedo, sem
  transição; o que ela pede por botão ou tecla desliza até o lugar.
- Sempre com `motion-safe:`; duração e curva só as da escala (`duration-fast`,
  `-base`, `-slow`; `ease-enter`, `-exit`, `-settle`). Nada de `duration-200`.

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
  (184px) e filtros com rótulo. Com troca-visão, período ou data — ou em tela
  que abre o registro ao lado (`lateral`), onde a fileira encolhe quando ele
  abre —: busca `recolhida` (só a lupa; clicar abre) e filtros `recolhido` (só
  o ícone, com tooltip). Por tela, não por largura (ADR-028).
- `HeaderDivisor` só entre o grupo de visão (troca-visão, período, data) e a
  ação principal. Fileira só com busca, filtros e a ação não leva divisor.
- Os filtros em si são a `BarraDeFiltros`, sob o Header: cada filtro ativo é um
  chip ("Etapa: Proposta"), o "+ Filtro" lista os campos, e cada campo abre a
  própria lista com busca. O `HeaderFiltros` mostra e esconde a barra e exibe
  `contarFiltros(valor)`. Campo de um valor só leva `unico`. Aplica na hora:
  sem botão de confirmar, sem modal (ADR-050).

### Listas de escolha: a opção leva os sinais da peça, sem a pílula
- Regra do design system inteiro (humano, 2026-10-02; cliente, 2026-10-02,
  ADR-069): quando o que a pessoa escolhe aparece na tela como uma `Tag`, cada
  opção da lista mostra os MESMOS sinais antes do nome — a foto do atendente
  num disco de 20px, a bolinha na cor da tag, o ícone da temperatura na cor —
  mas NÃO a pílula. A Tag inteira dentro de um campo ou de uma lista lia como
  "campo dentro de campo" (reunião de 02/10). Nunca só o nome escrito: quem
  abre a lista vê a cor e a foto que vão para a tela.
- Como: `foto`, `tom`, `status` e `icone` na opção — `{ valor, rotulo, foto: a.foto }`,
  ou `{ valor, rotulo, ...sinaisDaTag(t) }` para uma tag do catálogo. Vale para
  `Select`, `Combobox`, `ComboboxMultiplo`, `ComboboxPainel`, `CelulaEscolha` e
  os campos da `BarraDeFiltros`; o gatilho mostra o mesmo sinal depois de
  escolhida. `conteudo` fica para conteúdo que não é tag nem pessoa. O
  `rotulo` continua obrigatório: é o que a busca procura e o que o leitor de
  tela lê.
- A pílula da Tag é peça solta: cartão do quadro, célula da tabela, perfil do
  drawer e o `SeletorTags` (que é o seletor DE tags, não um campo).
- Monte a lista de opções UMA vez por tela (`OPCOES_DE_ATENDENTE`,
  `OPCOES_DE_TAG`) e use a mesma no filtro, na célula, no formulário e no
  drawer: a peça não pode mudar de um lugar para outro.
- Escolher um atendente ou uma tag numa lista não é `Menu`: `Menu` é para
  ações, e só tem texto. É `ComboboxPainel` (ancorado no botão) com as Tags.

### Tags: cor, ícone e criar
- A cor de uma tag é a bolinha (`tom` ou `status`). Grupo que é uma escala
  (temperatura) leva ícone colorido nas três: `icone` + `tom`.
- Tag de LISTA (segmento, lista de leads) não tem cor: leva um ícone cinza,
  um dos doze de `ICONES_DE_TAG`, que quem cria escolhe — `iconeLivre` na aba
  do `SeletorTags`, ou `SeletorDeIcone` num formulário. Nunca um ícone de fora
  do conjunto.
- Onde a pessoa digita para achar uma tag, digitar um nome que não existe
  SEMPRE oferece criar: `aoCriar` no `SeletorTags` e na `CelulaEscolha` de
  tags. O catálogo de tags é estado da tela (um só para a lista, o cartão, o
  filtro e o drawer), para a tag criada aparecer em todo lugar na hora.
- Menu de ações (`Menu`): todo item com `icone`. Menu só de texto é lista de
  marcar (`tipo: "check"`).

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
- Caixa de marcar é uma só: o `Checkbox` (18px, raio 4, traço de 1,5) e, nas
  listas (Combobox de várias escolhas, seletor de tags, item `check` do Menu),
  `caixaDeMarcar` de lib/campo.ts em 16px — a mesma caixa, não uma mais
  redonda que a da tabela (cliente, 2026-10-02, ADR-070).

### Conteúdo do modal (e de todo formulário curto)
A casca do Modal já estava fechada (ADR-039); o que vai dentro não tinha regra,
e cada tela empilhava campos sem rótulo nos selects (reunião de 02/10, ADR-071).
- **Todo campo tem rótulo visível.** `Input`, `Textarea`, `Select size="field"`
  e `Combobox size="field"` já o desenham a partir de `rotulo`; nunca um `<p>`
  por cima nem `rotuloOculto` num formulário.
- **Apoio onde o rótulo não basta**: `ajuda` sob o campo diz para que ele serve
  ("Como o lead aparece na lista"). Uma frase. Some enquanto há `erro`.
- **Obrigatório marcado**: `obrigatorio` põe o asterisco e o `aria-required`;
  o erro vem inline, no próprio campo (`erro`), nunca num Toast.
- **Pares lado a lado**: dois campos curtos que se leem juntos ocupam a mesma
  linha (`linhaDeCampos`): empresa e valor, telefone e e-mail, etapa e
  atendente. Texto longo, lista de escolha com busca e descrição ocupam a
  linha inteira. Nunca três por linha num modal `sm`.
- **O tipo do campo aparece dentro dele**: `prefixo="R$"` no valor,
  `iconeInicio` (empresa, telefone, e-mail, calendário). É sinal, não enfeite:
  só quando ajuda a ler o que vai ali.
- **Ordem**: identificação (nome) → contato → classificação (etapa, atendente,
  origem) → observações. O corpo é `formulario` (16px entre campos).
- **Rodapé**: `Cancelar` em `secondary` e a ação em `primary`, os dois
  `size="sm"`; a `descricao` do Modal diz o que acontece ao confirmar.
- Vale igual no `PainelLateral` e no cartão do drawer que vira formulário.
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
  clique na linha abre o lead no `Drawer` do lead (ver "Detalhe de um registro"). Células: `CelulaLead` (nome +
  `Tag` sem cor ou com `status`), `CelulaProgresso` (etapa), `Tag foto` (pessoa),
  `CelulaEditavel` (valor editável), `CelulaEscolha` (valor que vem de lista:
  tags, etapa — edita na célula, sem modal), origem com `IconeDeMarca`.
- **Quadro (kanban)**: o componente `Quadro` (`components/ui/quadro.tsx`, página
  `/data-display/quadro`) com `QuadroCartao` em `renderizar`; a tela só dá as
  colunas, os itens e as palavras (`rotulos`) — ver `QuadroDoFunil` em
  `app/pipeline/quadro.tsx`. É compacto: coluna com piso de 220 que cresce até 300 (`min-w-[220px]
  max-w-[300px] flex-1 basis-0`), vão de 8, recuo 6; cinco etapas cabem em
  1440 sem rolar. Cabeçalho da coluna numa linha de 24: bolinha, nome, contagem
  e o total à direita. Cartão enxuto, com traço e sem sombra (`rounded-md border
  bg-card p-2`): iniciais coloridas e nome; valor com a origem e os dias à
  direita; uma linha por detalhe (ícone + valor, o nome do campo no `title`);
  atendente e tags no fim. O que o cartão mostra é escolha da pessoa; de
  fábrica vem o essencial. "Novo lead" fica no pé da coluna; criar etapa é um
  botão estreito no fim do trilho, não uma coluna vazia.
- **Cadastro / edição** (poucos campos): `Modal size="md"` com `Input`,
  `Select size="field"`, `InputTelefone`, `DatePicker` e, quando o registro
  guarda arquivos, `Upload`; rodapé com `Button size="sm"` (`outline` cancela,
  `primary` confirma). O conteúdo segue a receita de "Conteúdo do modal". Muitos campos ou edição
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
- **Lista de registros (contatos, empresas, produtos)**: bloco `@datacrazy/leads`
  (`app/leads/`). `recuo={false}`; `DataTable` densa encostada nas bordas do
  painel, com `icone` em toda coluna e `minimo` por coluna. A primeira coluna é
  `CelulaLead avatar aoAbrir` — o nome com as iniciais na cor que ele sorteia,
  e o nome é o botão que abre o registro (nunca um `<button>` à mão na célula). Valor de lista edita na célula com
  `CelulaEscolha` (tags com `multiplo`; origem com `grupo` e `icone` por
  opção, marca em `IconeDeMarca`); célula sem valor mostra um traço. Busca
  aberta e `HeaderFiltros` com rótulo no Header, `BotaoAgrupar` e
  `BotaoColunas` recolhidos ao lado; o nome abre o `Drawer` do lead;
  filtros em `BarraDeFiltros`; ações em
  massa na `BarraDeSelecao`. Criar tag é `Modal size="sm"` com `Input` e
  `SeletorDeTom tamanho="md" comNeutro` — as quinze cores, nunca um seletor
  de cor livre.
- **Atendimento (chat, inbox, mensagens)**: bloco `@datacrazy/atendimento`
  (`app/atendimento/`). `recuo={false}`: três colunas, cada uma num bloco
  branco (`rounded-md border bg-card`) sobre o fundo `muted`, com `gap-3`: a
  `ListaDeConversas` (320, abas de situação e uma linha por conversa), a
  `Conversa` (`ConversaCabecalho` + `Mensagens` com `Balao`, `EventoDaConversa`
  e `DivisorDeDia` + `Compositor` Mensagem / Nota interna) e o lead (320,
  campos em linha: `ListaDeCampos` + `LinhaDeCampo`). As peças são de
  `components/ui/conversa.tsx` e `lista-de-conversas.tsx`; a tela monta.
  Abaixo de 1280 o lead abre por cima; abaixo de 768, lista OU conversa.
- **Fluxo, automação, editor em canvas**: bloco `@datacrazy/automacoes`
  (`app/automacoes/`). `recuo={false}`; o canvas é `bg-muted` com fundo
  pontilhado — o cinza claro que não é o da navegação nem o branco dos blocos
  — e funciona como canvas de verdade (o componente `Canvas`,
  `components/ui/canvas.tsx`, página `/data-display/canvas`, sem lib de
  grafo): arrastar o fundo move a tela, rolar ou pinçar dá zoom no cursor,
  arrastar da bolinha de uma saída liga a outro bloco, clicar na ligação e
  Delete desfaz, dois cliques no fundo adicionam um bloco, Shift + arrastar
  marca vários, botão direito abre as ações; barra `card` no canto com
  desfazer, refazer, zoom, enquadrar, organizar, mapa e a lista de gestos. A
  tela guarda o fluxo e o histórico; o canvas só pede (`aoMover`, `aoLigar`…).
  Cada bloco é um cartão com traço (`bg-card border rounded-lg`): cabeçalho com
  o ícone do tipo, resumo do que está configurado, uma linha por saída e a
  contagem. Conector é traço em `subtle-foreground`; cor só nas saídas de
  alerta (`warning`) e de erro (`destructive`). Clicar num bloco abre o
  `PainelLateral` ao lado — nunca um modal por cima do fluxo —, e o destino de
  cada saída se escolhe numa lista (`CelulaEscolha`). Liga e desliga é `Switch`
  no Header; a ação principal é Salvar.
- **Catálogo em cartões com cadastros ao lado** (agentes de IA, modelos,
  integrações): bloco `@datacrazy/agentes` (`app/agentes/`). Recuo padrão da
  `TelaBase`; dois lados a partir de 1280 (`grid-cols-1 xl:grid-cols-2
  items-start`), um sobre o outro abaixo disso. De um lado, os itens em `Card`
  (`p-3`) direto sobre o `muted`, em `gradeDeCartoes` com `gap-3` e a contagem
  em cima: `Avatar md` com as iniciais na cor do nome, nome com `title`,
  descrição em duas linhas e, sob um traço, os números que se comparam (rótulo
  em `caption`, valor em `h4`; o que é escolha de lista vai em `Tag`). Do
  outro, o que os itens usam num `blocoDaTela` só: `Tabs` e, em cada aba,
  `DataTableToolbar` (total + Button `tertiary` de criar) e a `DataTable`
  densa — clicar na linha abre o cadastro. Uma busca só, `HeaderBusca` aberta,
  filtra os dois lados; com texto na busca, cada aba mostra quantos achou. A
  ação principal do Header cria o item do catálogo. Ações de cada item num
  Button `ghost icon-xs` com `DotsThree` + `Menu` (Editar, Duplicar, Excluir);
  excluir confirma em `Modal variant="destructive"`.
- **Detalhe de um registro**: o lead — e todo registro do CRM com perfil
  (pessoa, empresa, negócio) — abre no `Drawer` do lead, o mesmo em toda tela
  (humano, 2026-10-02, ADR-061): `<Drawer>` com o `DrawerLead` que vem nos
  blocos (`drawer-lead.tsx`), recebendo `dados` (nome, tipo, contato, as
  quatro métricas), `tags` (a fileira do perfil, com `SeletorTags`), `tom` e
  `secoes` — o conteúdo de Histórico e de Perfil com o dado do registro, em
  cartões (`CampoEditavel`, `Select cartao`) dentro de `gradeDeCartoes`. Nunca
  monte um segundo drawer nem um painel próprio para o lead. O `PainelLateral`
  (encaixe `lateral` da `TelaBase`) fica para o que não é registro com perfil e
  se edita olhando para a tela de trás: o bloco de uma automação, um item de
  configuração — com `ListaDeCampos` + `LinhaDeCampo`.

### Telas: densidade (os números que o cliente pediu)
O cliente comparou com o Twenty e o Attio: "menos gap, menos padding, stroke
nas divs; o nosso parece gigante". Os números que fecham isso:
- Linha de tabela: 32px (`densa`, o padrão da Table), traço entre colunas e entre linhas.
- Topo da tela: 48px, com os controles em 28. O `Header` encolhe sozinho o Button, o
  `SegmentedControl`, o `ViewSwitcher` e o gatilho de data que estão nele — use o tamanho
  padrão; não passe `size="sm"` nem altura por `className`.
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

### Telas: no celular
O produto é responsivo, não desktop-first. Toda tela é conferida em 390px.
- A casca é da `TelaBase`: abaixo de 1024 a navegação vira um menu por cima, o
  painel da tela ocupa a janela sem margem, o Header centra o título e desce
  as ações para a linha de baixo. A tela não escreve breakpoint para isso.
- A página nunca rola de lado. Grade cai para uma coluna (`grid-cols-1
  sm:grid-cols-2 xl:grid-cols-4`), nada tem largura fixa, e o que é largo por
  natureza rola DENTRO de si: a `DataTable` (o `minimo` de cada coluna é o
  piso), o quadro, o canvas.
- Mestre-detalhe vira um OU outro: o `PainelLateral` já ocupa a tela abaixo de
  1024; lista e conversa alternam, com um botão de voltar. Com o detalhe
  aberto, busca, filtros e a ação principal do Header saem — a tela é o detalhe.
- Controle tem 32px de altura (28 no topo da tela, onde o `Header` encolhe sozinho); ícone clicável nunca fica solto com menos de 24.
- Rótulo que não cabe some inteiro ou trunca com `title` — nunca vira "0…". O
  `CardChart` já mostra só os rótulos que cabem.

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
- `Tag tom="…"` sorteada para cada etiqueta → `Tag` sem cor, ou com `status`; `tom` só
  quando a pessoa escolheu a cor da tag ou o produto define a cor daquele dado
  (etapa do funil, tom do perfil). A Tag é pílula com traço e texto como foi
  escrito (ADR-059): nunca `uppercase`, `rounded-full` nem `bg-*` por `className`.
  O cliente tirou a variação colorida em 18/09 ("vibe code").
- Formulário longo em `Modal` → `Drawer` com cartões, ou `PainelLateral` com
  campos em linha. Modal é decisão curta.
- `Modal` ou painel próprio para abrir o lead clicado numa lista → o `Drawer`
  do lead: um só, igual em toda tela.
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
