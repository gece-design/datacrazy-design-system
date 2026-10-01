# ADRs — DataCrazy
<!-- 3 linhas bastam. Desvio sem ADR é bug esperando ser "corrigido" de volta.
     Criado em 2026-09-19 (lote B0 da auditoria de consistência) com as
     decisões já tomadas nos gates de 09-01 a 09-18 — todas lidas do log em
     kfe-state.md e dos comentários no código, nenhuma inventada aqui. -->

## ADR-001 · Estados de interação não são desenhados no Figma · 2026-09-01
Desvio: o checklist do kit exige variante para todo estado; fica suspenso (exceção E-01).
Motivo: uma regra resolve uma vez o que custaria desenhar em cada componente; a regra é sempre ancorada em token existente.
Aprovado por: humano · contrato em `interactions.md`.

## ADR-002 · Foco por `outline`, não por `ring` com offset · 2026-09-01
Desvio: I4 fala em ring; o DS usa `outline outline-2 outline-offset-2 outline-ring` (D6).
Motivo: o offset do ring é pintado com cor sólida e vira halo errado dentro de card, modal e linha de tabela; o vão do outline é transparente.
Aprovado por: humano, na página do Button.

## ADR-003 · Ícones vêm do Phosphor, com um peso só · 2026-09-01
Desvio: anti-referência nº 14 (ícone de biblioteca); o Figma desenhava carets à mão.
Motivo: o cliente pediu Phosphor numa das primeiras reuniões (registrado em 2026-09-29; o sticky "manter o padrão atual, Lucide" do moodboard é anterior e está superado). 9.000 ícones, 6 pesos, MIT; peso único (`regular`, `fill` no selecionado) mitiga a anti-referência. Caret desenhado à mão saiu (2026-09-04).
Aprovado por: humano, a pedido do cliente.

## ADR-004 · Moldura do site de docs não é superfície do produto · 2026-09-01
Desvio: `components/ds` usa classes `.chrome-*` e medidas próprias, fora dos tokens do CRM (D3).
Motivo: sem a separação, ou o site fica errado ou os tokens do CRM ganham valores que só existem para a documentação.
Aprovado por: humano.

## ADR-005 · Espaçamento não é estendido no `tailwind.config` · 2026-09-04
Desvio: os 14 degraus do Figma estão documentados, não tokenizados; nada impede `p-7`.
Motivo: os degraus caem exatos na escala padrão do Tailwind; estender só duplicaria nomes.
Aprovado por: fw-ui, registrado no log · **revisar em B2** se a escala de dimensão exigir nomes.

## ADR-006 · Página atual da paginação com dois sinais · 2026-09-04
Desvio: o arquivo marca só a borda; o código usa fundo `accent` + texto `primary`.
Motivo: no escuro a borda sozinha some contra o fundo do próprio botão (I9: sinal persistente).
Aprovado por: humano.

## ADR-007 · Hover na linha da tabela, que o arquivo não desenha · 2026-09-04
Desvio: estado derivado (`overlay-item-hover`) sem desenho.
Motivo: leitura de tabela densa precisa da linha sob o cursor; token já existia.
Aprovado por: humano.

## ADR-008 · Tabs entra no DS e a fileira rola em vez de quebrar · 2026-09-15
Desvio: estava no escopo negativo do roadmap (anti-referência nº 11: abas viram duas linhas).
Motivo: a resposta à anti-referência está no componente — nunca quebra linha, rola na horizontal.
Aprovado por: humano.

## ADR-009 · Foco das abas por `ring-inset` · 2026-09-15
Desvio: única exceção à D6 (D19).
Motivo: contêiner que rola corta o outline com offset; o anel interno não é cortado.
Aprovado por: fw-ui, documentado no componente · confirmado no gate B0.

## ADR-010 · Toast com movimento e 8s na tela · 2026-09-15
Desvio: sem desenho de animação; kit pede 320ms (I10 slow) e o Toast usa 200/250.
Motivo: "muito morto" a 5s sem animação (humano). Primeiras animações do DS, sob `motion-safe:`.
Aprovado por: humano.

## ADR-011 · Header sem prop de variante · 2026-09-15
Desvio: o set do Figma tem 6 variantes; o código expõe três encaixes (`trilha`, `utilitarios`, `acoes`).
Motivo: trilha, título e ações variam sem limite no produto; variante fechada seria mentira.
Aprovado por: humano.

## ADR-012 · Badge sai do showcase, fica no código · 2026-09-15
Desvio: componente sem página própria (`/data-display/tag` tomou o lugar).
Motivo: o produto usa Tag; Badge continua servindo a DataTable.
Aprovado por: humano.
**Complemento em 2026-09-24**: a DataTable passou a usar a Tag nas etiquetas ("outro padrão de tags?"); Badge fica no código sem consumidor, candidata a sair na remedição.

## ADR-013 · Scrim a 40% · 2026-09-15
Desvio: `overlay-scrim` tem cor e não alfa; Drawer e Modal usam `/40` derivado.
Motivo: a camada nunca foi desenhada; valor aprovado no Drawer e reusado no Modal. **Vira token em B2** (pendência 7).
Aprovado por: humano.

## ADR-014 · Sombra interna só no tema claro · 2026-09-18
Desvio: `--shadow-button-inner` vira `none` no `.dark`; só `primary` mantém o brilho.
Motivo: o brilho é claro e lava `tertiary`, `soft`, a busca do Header e o View Switcher sobre superfície escura.
Aprovado por: humano.
**Ajuste em 2026-09-24**: o `destructive` entra na exceção do `primary` — "era pra adicionar só no botão de excluir". O resto do escuro segue sem a sombra.

## ADR-015 · Button `soft` com par escuro próprio · 2026-09-18
Desvio: o arquivo repete `base/blue/50` + `blue-600` nos dois modos.
Motivo: saía branco-azulado no escuro; par `accent` + `blue-300`, hover `neutral-800` (o mesmo de `nav/item`).
Aprovado por: humano.

## ADR-016 · Seleção do Segmented visível no escuro · 2026-09-18
Desvio: `--segmented-item-selected` é `accent` no claro e `background` no escuro.
Motivo: `accent` (#232C3D) era quase o `card` (#25252D) da trilha — "os seletores não funcionam".
Aprovado por: humano.

## ADR-017 · Subtítulo do Header fora por padrão · 2026-09-18
Desvio: o arquivo desenha subtítulo; o código guarda só o espaço (`min-h-[46px]`).
Motivo: título e descrição decorativos em toda tela são anti-referência nº 12; o Header fecha em 111px com ou sem ele.
Aprovado por: humano.
**Complemento em 2026-09-23 (ADR-029)**: o espaço reservado (`min-h-[46px]`) saiu; sem subtítulo o Header fecha em 103.

## ADR-018 · Interruptor lista/cards do Drawer não é o Switch do DS · 2026-09-18
Desvio: `SeletorDeVisao` é um `role="switch"` próprio, cinza (AUD-045).
Motivo: o Switch fica azul quando ligado e competiria com o item selecionado, que é o que a pessoa procura. Alternativa para um lote futuro: variante neutra do Switch.
Aprovado por: humano.
**Revogada em 2026-09-22**: o cliente tirou o modo cards do menu (reunião de 2026-09-18, "parecia mobile"); `SeletorDeVisao` saiu do código. Sem interruptor, sem desvio.

## ADR-019 · Drawer entra em 280ms com curva própria · 2026-09-18
Desvio: I10 pede 320ms; o Drawer usa 280 com `cubic-bezier(0.32,0.72,0,1)` e sai em 200 `ease-in`.
Motivo: "tá muito seco" (humano); a curva assenta o painel em vez de parar. Vira `slow` + `ease-settle` em B2.
Aprovado por: humano.

## ADR-020 · Auditoria de consistência corrige sem remedir o Figma · 2026-09-19
Desvio: lotes B0–B9 mudam implementação, tokens, movimento e docs com o estado de repouso congelado (regressão a 0%), sem pixel-diff contra o arquivo.
Motivo: a ponte do Figma está fechada; o que diverge do arquivo fica `adiado` em `consistencia.json` (lote `figma`).
Aprovado por: humano.

## ADR-021 · Escala de movimento fast 150 · base 200 · slow 280 · 2026-09-19
Desvio: a I10 do kit diz 120 / 200 / 320.
Motivo: 150 é o Tooltip aprovado e o valor de fato de todo hover (default do Tailwind); 280 é o Drawer aprovado. O fade do Toast sobe de 250 para 280 para caber na escala. Mudar o hover para 120 seria alterar o produto sem aprovação.
Aprovado por: humano, gate B0.

## ADR-022 · A Sidebar anima a largura ao colapsar · 2026-09-19
Desvio: a I11 proíbe animar `width` (custa layout); o painel vai de 282 para 88px em `base` (200ms).
Motivo: sem transição o menu inteiro saltava ("muito seco"). Precedente: o Toast anima `grid-template-rows` (ADR-010). Os rótulos somem na hora ao colapsar e dissolvem ao voltar — o texto não participa da animação de largura.
Aprovado por: humano, gate B5.

## ADR-023 · Componente de leitura não tem movimento · 2026-09-19
Desvio: a auditoria apontou Avatar, Badge, Card, KpiCard, Logo, Telefone e Header "sem movimento nenhum".
Motivo: nenhum deles tem estado de interação próprio — as regras de movimento (I10) animam mudança de estado. Ausência é decisão (fw-ui, camada 2), não buraco.
Aprovado por: humano, gate B7.

## ADR-024 · Telas de exemplo e propostas mantêm peças próprias · 2026-09-19
Desvio: a página de propostas do Drawer (botões de 38px) e a tela Pipeline (botão tracejado "Nova etapa", seta do trilho, radiogroup de cor) não usam o Button do DS onde o degrau não existe.
Motivo: são mocks que o cliente vê como estão; trocar por um degrau da escala muda o que foi aprovado no print. Mudam com o Figma, não com a auditoria.
Aprovado por: humano, gate B7.

## ADR-025 · A tabela emite a ordenação; quem ordena os dados é a tela · 2026-09-23
Desvio: `DataTable` recebe as linhas como filhos e não conhece os dados; a referência do cliente (grid do ExtJS) ordena a store por dentro.
Motivo: ordenar dentro do componente exigiria que ele soubesse ler cada célula (texto, número, data, etapa do funil). A tela sabe; a tabela só marca a coluna (`aria-sort`, caret) e chama `aoOrdenar`. `ordenarPor` cobre o caso comum. Mesmo princípio para esconder e reordenar: a linha reencaixa as células pela `chave` (`coluna=`), sem a tabela conhecer o conteúdo.
Aprovado por: humano ("Manda bala", 2026-09-23).

## ADR-026 · Esconder coluna tem dois caminhos: menu do cabeçalho e botão Colunas · 2026-09-23
Desvio: a referência só tem o menu do cabeçalho (submenu Columns).
Motivo: menu escondido no cabeçalho ninguém acha — o mesmo aprendizado do interruptor do Drawer (2026-09-18, "dentro da caixa do menu ninguém acha"). O botão na barra é o caminho visível; o menu fica para quem já está com o cursor na coluna. Os dois mexem no mesmo estado (`useAjustesDaTabela`).
Aprovado por: humano.

## ADR-027 · Breakpoints moram na casca da tela, não em cada tela · 2026-09-23
Desvio: o arquivo é desktop (1440) e o cliente disse "um problema por vez" sobre mobile (2026-09-18); a `TelaBase` já traz os três degraus (sidebar aberta ≥ 1280, recolhida em 1024–1279, menu por cima abaixo de 1024) e os recuos 16 · 24 · 32.
Motivo: pedido do humano (2026-09-23): toda tela nova nasce da mesma casca, responsiva, sem repetir Sidebar e Header nem pedir por prompt. Os degraus usam só o que existe (Sidebar colapsada, Scrim, camada); nada de pixel novo nos componentes. O menu por cima é a única decisão visual nova e vai ao cliente como tal.
Aprovado por: humano ("Pode aprovar essa… manda bala").

## ADR-028 · Na tela, recuo de 24 e busca que abre da lupa · 2026-09-23
Desvio: o arquivo desenha o Header com 32 de recuo e a busca sempre aberta (184px); a `TelaBase` usa 24 (16 abaixo de 768) e a `HeaderBusca recolhida` anima a largura de 32 para 184 (I11 proíbe animar largura).
Motivo: humano (2026-09-23): "tá sobrando muito espaço cinza na tela" e o header do pipeline não cabia com todas as ações. A largura anima com o precedente da Sidebar (ADR-022), em `base` · `enter`; com `prefers-reduced-motion` não anima. A página do Header no DS continua com os 32.
Ajuste no mesmo dia (print com medidas, "ainda tem muito espaço"): recuo 16 em toda largura, no Header e no conteúdo, e o Header sem recuo embaixo (`pb-0`) — as ações encostam no traço; o respiro é o do conteúdo. Em 2026-09-24: à esquerda, com a sidebar no lugar (≥ 1024), o recuo cai a 4 — a Sidebar já traz 16 de moldura na cor do fundo e "somava visualmente".
Regra de quando recolher (humano, 2026-09-23, "em telas que têm espaço pode manter o campo; com muitos itens de filtro, só o ícone"): a fileira de ações só tem botões → busca aberta (184); tem troca-visão, período ou data → `recolhida`. Por tela, não por largura. A busca do Header é sempre `HeaderBusca`; o botão "Pesquisar" com texto do arquivo (601:12) não se usa. Vale para toda tela e para a página do Header no DS.
Em 2026-09-24 a mesma regra vale para os filtros ("o botão de filtro deve se comportar igual o de pesquisar"): `HeaderFiltros` com rótulo ou `recolhido`. E o `HeaderDivisor` só entre o grupo de visão e a ação principal — fileira só com busca, filtros e a ação não leva ("em alguns casos não precisa").
Aprovado por: humano.

## ADR-029 · Header: 6px entre as linhas e título no topo da fileira · 2026-09-23
Desvio: o arquivo desenha 14px entre a linha da trilha e a do título (a caixa de 46 que o subtítulo ocupava) e fecha o Header em 111, com o título centrado com as ações. Agora: 6px (`gap-1.5`), título alinhado ao topo da fileira de ações (`items-start`), 103px sem subtítulo (com o traço).
Motivo: humano (2026-09-23, print com medidas): "tem um espaço cinza me incomodando muito". A mudança entra no componente, não na tela: vale para toda tela de uma vez (regra do humano — o DS é o sistema; componente que muda, muda em todas as telas).
Aprovado por: humano.
**Complemento em 2026-09-24**: o traço de baixo do Header sai ("linha divisória que eu já pedi pra remover"); fecha em 102. Na `TelaBase`, 8 de recuo embaixo — o zero era para o subcabeçalho, que já não existe.

## ADR-030 · Token `muted`: um cinza entre o fundo e o card · 2026-09-24
Desvio: o arquivo pinta cabeçalho e grupos da tabela com `background`, o mesmo cinza da página — sobre a página, a tabela perdia a borda de cima e as linhas de grupo sumiam.
Motivo: humano (2026-09-24, print): "precisamos de um cinza mais claro que o fundo pra aplicar nos componentes que perdem o contraste". `muted` (#F5F6F7 · #1D1D25) fica entre `background` e `card` nos dois temas. Entra onde a superfície cinza encosta na página: cabeçalho e grupo da Table, linha dos dias do Calendário. Onde o cinza está sobre um card branco (pílula do KPI, rodapé do Modal, Badge neutra) `background` segue.
Aprovado por: humano.

## ADR-031 · Agrupar como botão com menu; seleção em massa com barra · 2026-09-24
Desvio: a referência (grid do ExtJS) agrupa pelo menu da coluna e o arquivo não desenha seleção em massa nem barra de ações; a tela atual do CRM tem a caixa na linha e as ações no ⋯ de cada uma.
Motivo: humano (2026-09-24): "falta de padrão dos botões ali de select e de colunas" — o Agrupar era um Select ao lado de um Button; agora é o mesmo botão `tertiary` com menu de rádio, `soft` com grupo ativo (o sinal do Filtros do Header). E "ações em massa": caixa no cabeçalho e nas linhas (`chave`), Shift+clique por faixa, barra fixa embaixo com as ações da tela. A tabela só sabe quais linhas estão na tela; a tela guarda os ids (`useSelecaoDaTabela`), como na ordenação (ADR-025).
Aprovado por: humano ("boa ideia, pode seguir").
**Complemento no mesmo dia**: na tela do pipeline os dois botões saem da barra da tabela e vão para a fileira do Header, só com o ícone (`recolhido`), ao lado da lupa e do troca-visão — "e se eles ficarem no header?". A barra da tabela fica só com o resumo. E a lista passa a mostrar o que o cartão mostra, do mesmo jeito: tags com a bolinha de status, etapa na cor da coluna (`CelulaProgresso tom`), atendente com foto, origem com ícone, dias com relógio ou aviso — "a tabela está super diferente do kanban".

## ADR-032 · Header estreito centrado, medido pela própria largura · 2026-09-24
Desvio: o arquivo é desktop; abaixo de 640 o Header não tem desenho. O código centra trilha, título e ações e põe as ações em linha própria.
Motivo: humano (2026-09-24, print do pipeline no celular): "gostei desta ideia de centralizar no mobile". A medida é a largura de conteúdo do próprio Header (`container-type: inline-size` + `@container`, que mede a caixa sem o recuo), não a da janela: é o que faz o preview estreito da página do Header mostrar o mesmo que o celular, e o que vale dentro de um painel estreito.
Aprovado por: humano.

## ADR-033 · Escuro: traços com contraste e rótulo branco no primário · 2026-09-24
Desvio: o arquivo pinta o escuro com `border` a 20% sobre um card a 16% e o texto do primário em `#10131A`. Agora `border` 26%, `divider` 36%, `input/border` com valor próprio a 45% (3,2:1 sobre o card — a caixa do Checkbox aparece), `primary-foreground` branco nos dois modos, `primary` do escuro em `blue/500` (era `blue/400`; 3,5:1 com o branco, o que o claro já aceita) com hover em `blue/400`, e o `destructive` do escuro em 58% (4,4:1). O selo do sino e dos filtros usa `card` no texto (escuro sobre o vermelho claro); o Tooltip usa `surface-inverse-foreground`. Os valores de traço são estimados, não do arquivo: o arquivo não tem par que funcione, e a decisão é do humano.
Motivo: humano (2026-09-24, print do modal de filtros no escuro): "as cores de stroke, linhas e etc como esta do checkbox não tem contraste nenhum! e os botões não ficariam melhor com a label branco?". Vale em todo componente: é token.
Aprovado por: humano.

## ADR-034 · Hora em rodas, fuso em painel do DS, data única, Switch de linha · 2026-09-24
Desvio: nada disto está no arquivo (o Time Picker nunca esteve). As colunas de hora viram rodas como as do iPhone — cinco à vista, a do meio escolhida, `scroll-snap`, inclinação discreta e sombreado nas pontas — com a roda de AM/PM no formato de 12 horas; o fuso deixa o `<select>` nativo por um painel do DS com busca; o Date Picker ganha `meses={1}` e o `DatePicker` de uma data, e o painel ganha respiro (recuo 16, vão 32); o Switch ganha `linha`, com a linha inteira como alvo do clique.
Motivo: reunião de 2026-09-18 e lembrete do humano (2026-09-24): "melhorar o espaço do popup, cenário de uma data só, melhorar o fuso e criar popup do DS dele, scroll das horas como o da Apple, tamanhos, olho de peixe discreto, sombreamento, AM e PM; nos switches, o clique na row inteira".
Aprovado por: humano.

## ADR-035 · Rodapé do Modal compacto; edição na célula da Table · 2026-09-27
Desvio: o arquivo desenha o rodapé do Modal com 12 em cima e embaixo e botões de 32; a Table não tem edição no lugar.
Motivo: cliente (Guilherme, WhatsApp de 2026-09-26): "me parece que o footer e os botões ocupam muito espaço" → rodapé com 8 em cima e embaixo, corpo com 12 embaixo e botões `sm` (28) — o rodapé fecha em 44 em vez de 56. E "ter a opção de editar os dados na tabela, nas células" → `CelulaEditavel`: texto com lápis no hover, clique vira campo de 32px na célula, Enter e sair salvam, Escape desfaz; a tela grava. Entra na página da Table e no valor da lista do pipeline.
Aprovado por: humano ("precisamos aplicar este pedido de ajuste").

## ADR-036 · Grade densa de lista, com traço entre colunas (referência: Twenty) · 2026-09-27
Desvio: o arquivo desenha a tabela com respiro (linha de ~64px, recuo 20, sem traço vertical). O `layout="densa"` tem linha de 36px, recuo 8, traço `border` entre colunas e entre linhas, e cada célula numa linha só (nome e etiquetas lado a lado, empresa · cidade, etapa com a barra curta ao lado, estatísticas em linha, campo editável de 24px).
Motivo: cliente (2026-09-27, com o print do Twenty): "menos gap, menos padding, stroke nas divs". Entra como layout, não como troca do padrão: a lista do pipeline usa `densa`; o `padrao` segue o arquivo para leitura com respiro.
Aprovado por: humano.

## ADR-037 · Button `primary` e `destructive` planos, sem a sombra interna · 2026-09-28
Desvio: o arquivo (269:32, 545:168) desenha o `primary` e o Excluir do Modal com o `button inner shadow` (inset 2px 4px 8px #E8F1FF66). No código os dois são planos nos dois temas e o literal `shadow-button-inner-primary` deixou de existir. A sombra interna fica só onde é relevo sobre superfície clara (`tertiary`, `soft`, busca do Header, View Switcher) e continua `none` no escuro (decisão de 2026-09-18). O botão de adicionar tag acompanha: usava o mesmo literal.
Motivo: cliente, reunião de 2026-09-24 ("prefiro plano"; ninguém defendeu manter). Supera as decisões de 2026-09-15 (destructive ganha a sombra), 2026-09-18 (só o primary a mantém no escuro) e 2026-09-24 (só o Excluir).
Aprovado por: humano (2026-09-28: "pode tirar").

## ADR-038 · Select ao lado de Input é sempre `field` · 2026-09-28
Desvio: regra de uso, não do arquivo. O `md` (card: fundo `background` com realce) ao lado de um Input branco lê como desabilitado. Em formulário (Modal "Novo lead", painel do lead) o Select é `size="field"`, a caixa do Input (544:129).
Motivo: cliente, 2026-09-24 (Angélica: "os selects estão cinza e as outras coisas não"; Ryan: "parece que tá disable").
Aprovado por: humano.

## ADR-039 · Cabeçalho do Modal compacto · 2026-09-28
Desvio: o arquivo (545:168) tem cabeçalho com 16 em cima e 12 embaixo, título `heading-3` e X de 28; no destrutivo, círculo de 40 com `Warning` de 20. O código fecha o cabeçalho em 44: 12 em cima, 8 embaixo, título `heading-4` colado na descrição (o vão de 4 saiu em 2026-09-28), X de 24, círculo de 32 com ícone de 16.
Motivo: cliente, 2026-09-24 (Angélica: "o header também parece ocupar mais", referência Attio); continua o pedido de 2026-09-26 sobre o rodapé. Cabeçalho e rodapé passam a ter a mesma altura.
Aprovado por: humano.

## ADR-040 · Drawer abre com 840px e a pessoa arrasta a largura até 1080 · 2026-09-28
Desvio: o arquivo desenha o painel com 1080px fixos. O código abre com 840 (`LARGURA_DO_PAINEL`; foi 920 por algumas horas — "pode diminuir mais") e a borda esquerda é uma alça: sob o cursor aparece um traço de 3px em `divider` e o arrasto vai de 720 a 1080 (o desenho do arquivo é o teto), nunca mais que a janela menos 48; o conteúdo acompanha com `gradeDeCartoes` (auto-fill de 220px), porque três colunas fixas amassavam os cartões; `memoria` guarda a medida no navegador, por tela. Alça focável, setas ±16 (Shift ±64).
Motivo: cliente, 2026-09-28 ("diminua o tamanho que o drawer ocupa na tela e adiciona opção de ajustar, passando o mouse no canto, stroke de 3px cinza, com limite"). A borda arrastável é a esquerda porque a direita encosta na tela.
Aprovado por: humano.

## ADR-041 · Cartão do drawer com linha de 24 e Select `cartao` · 2026-09-28
Desvio: o arquivo dá ao cartão do campo a linha de 36 do Input; o código usa 24 (`linhaDoCartao`) em leitura e em edição, e o cartão fecha em 68. O Select ganha a variante `cartao`, sem par no arquivo (exceção à regra 6, a pedido do cliente): o cartão inteiro é o gatilho, com o rótulo em bold, o valor na linha de 24 e o caret — a mesma casca do `CampoEditavel` ao lado, no lugar de `field` dentro de `CartaoDeCampo`.
Motivo: cliente, 2026-09-28 ("gap menor entre o título e o conteúdo"; "etapa do funil deve ter uma variante com o mesmo visual dos cards ao lado, e mantém o ícone de arrow").
Aprovado por: humano.

## ADR-042 · Textarea nasce sem par no arquivo, da tela de Atendimento · 2026-09-29
Desvio: exceção à regra 6 (variante ou componente novo só existe se existe no Figma). `Textarea` herda a caixa do Input (544:129) — traço, foco, erro e desabilitado — com altura livre: cresce com o texto até `maximoDeLinhas` e rola por dentro. `rotuloOculto` tira o rótulo da tela e o mantém para o leitor de tela.
Motivo: o time confirmou atacar as telas que mais doem (FigJam, PASSO 1: Multiatendimento e Chat em primeiro). O compositor do chat e a nota interna precisam de várias linhas e o DS só tinha o Input de uma.
Aprovado por: humano (2026-09-29: "vamos atacar sim").

## ADR-043 · A Table nasce densa; a linha alta vira `confortavel` · 2026-10-01
Desvio: o arquivo desenha a tabela com linha alta (64) e esse era o padrão do código. Agora `DataTable` e `DataTableToolbar` nascem `layout="densa"` (36px); o desenho do arquivo passa a se chamar `confortavel` (`padrao` continua aceito, como apelido). `ColunaTabela` ganha `icone`, de 14px, antes do rótulo do cabeçalho.
Motivo: crítica de design de 2026-09-28 (Ryan Pacheco): "tabelas com espaçamento excessivo", referência Twenty e Attio, ícone por coluna. A bancada já mostrava o mesmo: sem a receita, o Claude gerava a tabela alta.
Aprovado por: humano (2026-10-01: "vai").

## ADR-044 · Gráficos chapados, valor no balão, eixo opcional · 2026-10-01
Desvio: o arquivo pinta as barras do `CardChart` e as fatias do `CardDonut` com gradiente. O código usa `primary` chapado; as fatias da rosca se distinguem por opacidade (100 · 60 · 35 · 20%). A barra mostra o valor no Tooltip ao passar o cursor (`formatar`) e tem nome acessível; `eixoY` vira opcional — sem ele o gráfico fica sem eixo, como pede a regra A7.
Motivo: crítica de design de 2026-09-28 ("gradientes nos gráficos parecem datados; cor chapada"), e o FigJam ("gráfico sem eixo").
Aprovado por: humano (2026-10-01).

## ADR-045 · KpiCard `fill` com traço visível · 2026-10-01
Desvio: no arquivo o `fill` não tem contorno (o traço é da cor do cartão). O código usa `border`.
Motivo: crítica de design de 2026-09-28 ("os cartões de métrica não possuem contorno e têm pouca visibilidade").
Aprovado por: humano (2026-10-01).
Atualização (2026-10-01, dashboard): o traço `border` sobe para a casca — o `Card` inteiro, não só o KpiCard `fill`. Lado a lado no dashboard, KPI com traço, Table com traço e Card sem traço eram três superfícies diferentes; o pedido do cliente é um só ("stroke nas divs").

## ADR-046 · Etiqueta de tipo do perfil no fluxo, sob o nome · 2026-10-01
Desvio: o arquivo flutua a etiqueta "PESSOA"/"EMPRESA" sobre o avatar do `DrawerPerfil`. O código põe a etiqueta no fluxo, sob o nome.
Motivo: crítica de design de 2026-09-28 ("a etiqueta sobreposta ao avatar atrapalha a leitura").
Aprovado por: humano (2026-10-01).

## ADR-047 · "Quando usar" é seção obrigatória da doc do componente · 2026-10-01
Decisão: toda `docs/componentes/*.md` tem `## Quando usar`, com itens "**Use**" e "**Não use**" — o segundo sempre aponta o componente certo. A seção é a primeira da referência que a skill entrega ao Claude e aparece na página do componente no site (`lib/quando-usar.json`, gerado; a página que já tinha a sua, com exemplo vivo, fica com ela). `check-doc-codigo` reprova doc sem a seção e seção que cita componente inexistente.
Motivo: crítica de design de 2026-09-28 ("falta dizer quando usar cada componente"; "menu usado onde devia ser select"). É a mesma lacuna que faz o agente escolher o componente errado.
Aprovado por: humano (2026-10-01).

## ADR-048 · IconeDeMarca: conjunto fechado de logos de verdade · 2026-10-01
Desvio: componente novo sem par no arquivo (regra 6). `IconeDeMarca`, com nove marcas — WhatsApp, Instagram, Facebook, Google, Meta, LinkedIn, Telegram, YouTube, TikTok. Os desenhos são os logos de verdade, prontos: coleção "SVG Logos", de Gil Barbara (CC0), e o do Instagram de "Skill Icons" (MIT). As cores moram no desenho, como numa imagem: não são tokens, não mudam com o tema e não existem fora do ícone (por isso o arquivo é a única exceção à regra "sem hex" no check de tokens). `mono` troca o logo pelo glifo do Phosphor em `regular`, em `currentColor` — dentro da regra A8, sem exceção.
Motivo: crítica de design de 2026-09-28 ("ícone de marca não existe no DS… falta um componente ícone de integração com um conjunto fechado de marcas aprovadas"). Sem a peça, cada tela colaria um `<svg>` ou pintaria um glifo com cor solta.
Histórico: a primeira versão, do mesmo dia, pintava o glifo `fill` do Phosphor com a cor da marca (tokens `marca/*`). Recusada pelo humano ("os ícones de marcas estão horríveis, coloque os corretos"); os tokens `marca/*` saíram.
Aprovado por: humano (2026-10-01).

## ADR-049 · Combobox, grupos e ícone no Select, CelulaEscolha · 2026-10-01
Desvio: exceção à regra 6. `Combobox`, `ComboboxMultiplo` e `ComboboxPainel` nascem sem par no arquivo: gatilho do Select (`SelectTrigger`), painel do Popover, busca do `SeletorTags`, caixa de marcar do `Menu` — nenhuma superfície nova. `OpcaoSelect` ganha `grupo` (cabeçalho) e `icone`; `agruparOpcoes` e `GrupoDeOpcoes` servem ao Select e ao Combobox. Na Table, `CelulaEscolha` abre o `ComboboxPainel` na própria célula. A regra de escolha fica escrita: até ~10 opções fechadas é Select; lista longa, com busca ou várias escolhas é Combobox.
Motivo: crítica de design de 2026-09-28, pontos 3 e 1.3 ("dropdown sem agrupamento nem ícone por opção"; "o catálogo nem lista um componente chamado Combobox separado do Select"; "multi-seleção por check editando direto na célula").
Aprovado por: humano (2026-10-01: "vai").

## ADR-050 · BarraDeFiltros substitui o modal de filtros · 2026-10-01
Desvio: exceção à regra 6 (sem par no arquivo), e revisão de uma decisão anterior: o pipeline filtrava num Modal com tudo à vista (sete grupos de Checkbox, "nada de dropdown"). Agora os filtros são chips sob o Header: cada campo ativo é um chip (`Button soft`), o "+ Filtro" lista os campos, cada campo abre a própria lista com busca (`ComboboxPainel`), `unico` separa o campo de um valor do de vários, e chip sem valor some. O `HeaderFiltros` mostra e esconde a barra e exibe `contarFiltros`.
Motivo: crítica de design de 2026-09-28 ("filtro com muitas opções não tem padrão… sete grupos de checkbox empilhados, sem busca, sem hierarquia entre filtro de um valor só e de múltiplos valores"). Referência: Twenty, Attio, Linear.
Aprovado por: humano (2026-10-01: "vai").

## ADR-051 · Paleta da Tag: de oito para catorze tons (quinze cores com o neutro) · 2026-10-01
Desvio: seis tons sem par no arquivo — `indigo` (240°), `fucsia` (298°), `amarelo` (60°), `lima` (88°), `turquesa` (166°) e `marrom` (25°, com menos saturação). Valores DERIVADOS pela regra dos tons de 18/09: o matiz gira e o L da letra é o que dá pelo menos 4,5:1 sobre o próprio brilho e 5,2:1 sobre card; no escuro repetem o S/L do azul escuro (o índigo sobe o L da letra para 78%). `TONS` passa a seguir a ordem do círculo de cores. O sorteio (`tomDe`) continua nos seis de antes: abrir a paleta não pode trocar a cor de lista que já existe. Valem onde vale `[data-tom]`: Tag, perfil do Drawer, coluna do pipeline, evento do Calendário.
Motivo: crítica de design de 2026-09-28 ("paleta de cor da Tag: 8 tons fixos vs. paleta livre… seletor de cor com ~15 opções na criação da tag") e decisão do humano (2026-10-01: "colorida pra 15").
Aprovado por: humano (2026-10-01). Os valores dos seis tons ficam para conferência dele; o Figma acompanha na remedição.
Atualização (2026-10-01): a letra de `rosa` (330°) e de `laranja` (24°) desce de L — 47,8 → 42,5 e 37,7 — para fechar 4,5:1 sobre o próprio brilho no claro (eram 3,7:1 e 3,0:1). Aprovado pelo humano no mesmo dia. `vermelho` (4,3:1) e `azul` (4,4:1, token do arquivo) ficam um fio abaixo e não foram mexidos.

## ADR-052 · O botão de recolher sai da borda da Sidebar · 2026-10-01
Desvio: o arquivo desenha o botão de recolher como um disco de 32px com sombra, pendurado na borda do painel (3px da borda, 59px do topo). No código ele passa a ser um botão quadrado de 28px, sem relevo, com o ícone do painel, na linha da marca (`SidebarBrand`). Recolhida, o símbolo da marca é o botão de expandir. Os nomes do botão viram prop (`rotulos`), como todo texto.
Motivo: crítica de design de 2026-09-28, ponto 1 ("o botão de toggle fica visualmente flutuando e é o único botão 100% redondo… padrão que deveríamos evitar repetir do design antigo"). É a primeira parte da proposta visual, que o humano mandou aplicar por partes (2026-10-01).
Aprovado por: humano (2026-10-01: "por partes").

## ADR-053 · Header de uma linha · 2026-10-01
Desvio: o arquivo (601:464) desenha o Header em duas linhas — trilha e sino em cima, título `h1` (22px) e ações embaixo, 111px; o código já estava em 102 (ADR-029). Agora é uma linha: a trilha (só os ancestrais, `Breadcrumb ancestrais`), o separador, o título como último nível (`h1` no tamanho `h4`, 13px) e, à direita, as ações e os utilitários. 64px sozinho, 56 na `TelaBase`. `Header` ganha `inicio` (o botão de menu da TelaBase); `subtitulo` vai para a mesma linha e só aparece com largura. Abaixo de 640px a trilha sai, o título fica centrado entre o menu e o sino e as ações descem (mantém o ADR-032). Não há variante de duas linhas: o componente muda em todas as telas.
Motivo: crítica de design de 2026-09-28, ponto 7 ("o header possui bastante espaço em branco e ocupa duas linhas"). É a segunda parte da proposta visual (referência Twenty e Attio), que o humano mandou aplicar por partes (2026-10-01).
Aprovado por: humano (2026-10-01: "por partes"). Os controles seguem com 32px; a proposta desenhava 28 — fica para a parte da superfície única, se ele quiser.

