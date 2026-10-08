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
Atualização (2026-10-01): a letra de `rosa` (330°) e de `laranja` (24°) desce de L — 47,8 → 42,5 e 37,7 — para fechar 4,5:1 sobre o próprio brilho no claro (eram 3,7:1 e 3,0:1). Aprovado pelo humano no mesmo dia. `vermelho` (4,3:1) e `azul` (4,4:1, token do arquivo) ficavam um fio abaixo; o humano aprovou escurecer também (2026-10-01): `vermelho` 45,3 → 43,7 e `azul` 47,8 → 46,9 — o `--tom-texto` do azul deixa de ser alias de `blue-600` e ganha valor próprio. Os catorze tons passam de 4,5:1 no claro.

## ADR-052 · O botão de recolher sai da borda da Sidebar · 2026-10-01
Desvio: o arquivo desenha o botão de recolher como um disco de 32px com sombra, pendurado na borda do painel (3px da borda, 59px do topo). No código ele passa a ser um botão quadrado de 28px, sem relevo, com o ícone do painel, na linha da marca (`SidebarBrand`). Recolhida, o símbolo da marca é o botão de expandir. Os nomes do botão viram prop (`rotulos`), como todo texto.
Motivo: crítica de design de 2026-09-28, ponto 1 ("o botão de toggle fica visualmente flutuando e é o único botão 100% redondo… padrão que deveríamos evitar repetir do design antigo"). É a primeira parte da proposta visual, que o humano mandou aplicar por partes (2026-10-01).
Aprovado por: humano (2026-10-01: "por partes").

## ADR-053 · Header de uma linha · 2026-10-01
Desvio: o arquivo (601:464) desenha o Header em duas linhas — trilha e sino em cima, título `h1` (22px) e ações embaixo, 111px; o código já estava em 102 (ADR-029). Agora é uma linha: a trilha (só os ancestrais, `Breadcrumb ancestrais`), o separador, o título como último nível (`h1` no tamanho `h4`, 13px) e, à direita, as ações e os utilitários. 64px sozinho, 56 na `TelaBase`. `Header` ganha `inicio` (o botão de menu da TelaBase); `subtitulo` vai para a mesma linha e só aparece com largura. Abaixo de 640px a trilha sai, o título fica centrado entre o menu e o sino e as ações descem (mantém o ADR-032). Não há variante de duas linhas: o componente muda em todas as telas.
Motivo: crítica de design de 2026-09-28, ponto 7 ("o header possui bastante espaço em branco e ocupa duas linhas"). É a segunda parte da proposta visual (referência Twenty e Attio), que o humano mandou aplicar por partes (2026-10-01).
Aprovado por: humano (2026-10-01: "por partes"). Os controles seguem com 32px; a proposta desenhava 28 — fica para a parte da superfície única, se ele quiser.

## ADR-054 · Navegação plana de 220, com Favoritos · 2026-10-01
Desvio: o arquivo (124:2114) desenha a Sidebar como um painel em cartão de 282px (88 recolhida), com moldura de 16, superfície em gradiente, marca d'água, item de 36 com ícone de 20 e `shadow-highlight`. No código ela passa a ser plana: sem cartão, direto sobre `background`, 220px aberta e 48 recolhida, item de 32 com ícone de 16 (`fill` no selecionado — é o uso que a regra A8 já previa), rótulo em `body-lg`, 2px entre itens. O hover é `card`, não o `nav-item-hover` do arquivo (`background` sobre `background` sumiria). `SidebarGrupo` ganha `rotulo` (seção com nome) e `ocultarRecolhida`, e com eles o grupo de Favoritos — um dos pedidos do FigJam ("sidebar com favoritos"). Seletor de tema com botões de 28 e linha do usuário com avatar de 24; `--sidebar-surface` e a marca d'água saem. Na `TelaBase`, o recuo esquerdo do conteúdo passa de 4 para 8.
Motivo: proposta visual (referência Twenty e Attio: navegação de 220, item de 32), terceira parte; o humano mandou seguir (2026-10-01: "sim").
Aprovado por: humano (2026-10-01).

## ADR-055 · Uma superfície só: Header e conteúdo no mesmo painel · 2026-10-01
Desvio: no arquivo o Header e o conteúdo ficam soltos sobre o fundo da aplicação, e cada bloco é um cartão. Na `TelaBase`, os dois passam a morar num painel só — `card`, traço `border`, raio `lg`, a 8px da janela e da navegação —, com o Header como primeira faixa (48px, traço embaixo) e o conteúdo encostando nas bordas quando a tela é lista, quadro ou chat (`recuo={false}`). O `Header` perde o fundo próprio. Os controles de apoio — Button `tertiary`, trilho do `SegmentedControl` e do `ViewSwitcher`, `HeaderBusca` — usam a superfície oposta à de onde estão (`superficieDeApoio`, lib/estados): `card` sobre o fundo da aplicação, `background` dentro do painel, marcado com `data-superficie`; no escuro, a opção selecionada do segmentado passa a `card` ali dentro (token re-escopado no globals.css, sem ramificar componente). Telas de exemplo: a lista do pipeline e o atendimento deixam de ser cartão; a coluna neutra do quadro vira `background`. Os controles seguem com 32px e a linha da tabela com 36: a proposta desenhava 28 e 32, e isso não entrou.
Motivo: proposta visual (referência Twenty e Attio: "uma superfície só, separada por traço"), quarta parte; o humano mandou seguir (2026-10-01).
Aprovado por: humano (2026-10-01).

## ADR-056 · PainelLateral: o registro abre ao lado da lista · 2026-10-01
Desvio: componente novo sem par no arquivo (regra 6), e mudança do padrão de detalhe. O arquivo abre o registro no Drawer, por cima da lista (840px, perfil e seções em cartões). Agora o registro que abre de uma lista, de um quadro ou de um calendário vai num `PainelLateral`: `<aside>` de 480px dentro do painel da tela, com traço à esquerda, cabeçalho de 48, que EMPURRA o conteúdo — a lista continua à vista e clicar em outra linha troca o registro. Não é diálogo: não prende o foco nem escurece. Campos em linha (`ListaDeCampos` + `LinhaDeCampo`, 32px) no lugar do cartão de 68, editando no lugar com `CelulaEditavel` e `CelulaEscolha`. Botão de tela cheia; abaixo de 1024px o painel já ocupa a tela. A `TelaBase` ganha os encaixes `lateral` e `lateralCheia`. O `Drawer` continua no DS para o registro completo (perfil, métricas, menu de seções). O pipeline passa a usar o painel; o bloco `pipeline` deixa de levar o `drawer-lead`. A página de proposta (`/exemplos/proposta-visual`) sai: as cinco partes estão no DS.
Motivo: proposta visual (referência Twenty e Attio: "registro em painel lateral que empurra a lista, com campos em linha"), quinta e última parte; pedido registrado desde a reunião de 24/09 ("painel lateral no lugar do Drawer"). O humano mandou seguir (2026-10-01).
Aprovado por: humano (2026-10-01).

## ADR-057 · Controles de 28 no topo e linha de tabela de 32 · 2026-10-01
Desvio: o arquivo desenha os controles do Header com 32px e a linha da tabela com 56; o código estava em 32 e 36 (ADR-043). Agora o topo da tela é uma faixa compacta: o `Header` se marca com `data-compacto` e o Button `md` e `icon`, o trilho do `SegmentedControl` e do `ViewSwitcher`, o gatilho de data e a `HeaderBusca` medem 28 dentro dele — sem a tela passar `size`. Fora do Header nada muda: o mesmo `<Button>` continua com 32 no conteúdo, no Modal e nos menus (que abrem em portal, fora da marca). O Header sozinho fica com 60px; na `TelaBase`, 48 com o traço, alinhado ao cabeçalho do `PainelLateral`. A Table `densa` desce de 36 para 32 por linha (recuo vertical da célula de 4 para 2); o cabeçalho segue com 28.
Motivo: proposta visual (referência Twenty e Attio: "topo de 48 com ações de 28, linha de 32"). Ficou anotado como pendência na ADR-053; o humano mandou aplicar (2026-10-01: "sim, do jeito da proposta").
Aprovado por: humano (2026-10-01).

## ADR-058 · Iniciais coloridas, seletor de cor como peça e a tela de Leads · 2026-10-01
Desvio: três acréscimos sem par no arquivo (regra 6). (1) `Avatar` ganha `tom` — um dos catorze tons da Tag ou `"auto"`, que tira a cor do nome (`tomDe`): pastel no fundo, a cor escura na letra; o arquivo desenha o disco sempre azul. A `CelulaLead` ganha `avatar` (o disco de 20px antes do nome) e `aoAbrir` (o nome vira o botão que abre o registro). (2) `SeletorDeTom`: a fileira de amostras que já existia dentro do `SeletorTags` vira peça exportada, com `tamanho="md"` (24px, com check) e `comNeutro` (a décima quinta cor), para uso em formulário. Os tons saem da Tag para `lib/tons.ts` (D21). (3) `CelulaTags` conta com "+N" as etiquetas que não couberam; a lista do `Combobox` passa de 256 para 320px de altura (dez opções à vista). A tela `/exemplos/leads` (bloco `leads`) junta as peças: grade densa com ícone por coluna, tags e origem editadas na célula, filtros em chips, agrupar, seleção em massa, registro ao lado e o modal de criar tag. O painel do lead do Atendimento troca os cartões pelos campos em linha do `PainelLateral`. A regra de recolher busca e filtros no Header passa a incluir a tela que abre registro ao lado.
Motivo: crítica de design de 2026-09-28 — a tela de Leads de referência ("ícone ao lado de cada rótulo de coluna, avatares com iniciais coloridas, origem com ícone de marca") e o modal de criar tag com ~15 cores. O humano mandou seguir com o documento (2026-10-01).
Aprovado por: humano (2026-10-01: "segui com o pdf do design critique"), no escopo. Em 2026-10-02 ele mandou aplicar a recomendação nas duas pendências que esperavam conferência — os seis tons novos (ficam como estão, com a bolinha corrigida na ADR-059) e a busca e os filtros só com ícone na tela de Leads (ficam) — e conferir depois. O Figma acompanha na remedição.

## ADR-059 · Tag: pílula com traço, texto como foi escrito, cor na bolinha · 2026-10-02
Desvio: o arquivo (538:197) desenha a Tag com fundo cinza cheio (`input/bg-disabled`), raio total e texto de 10px em caixa alta; com `tom`, o código pintava o fundo de pastel e a letra na cor (ADR-051). Agora a Tag é uma pílula com traço — `card` + `border`, raio `md`, 22px —, texto de 11px (`label-md`) como foi escrito, sempre em `foreground`. A cor mora na bolinha de 6px: com `tom` a bolinha já vem, na cor do tom (`tom/tag`); com `icone`, é o ícone que leva a cor (`tom/texto`). `status` continua pondo a bolinha na cor da situação. A foto do atendente passa a 18px, por dentro do traço. As amostras do `SeletorDeTom` viram a cor cheia da bolinha. Os tokens `tom/brilho` e `tom/texto` seguem no Avatar, no perfil do Drawer, nas colunas do quadro e nos eventos do calendário.
Motivo: crítica de design de 2026-09-28 — as telas de referência que o time montou (Leads, dropdown de tags, modal de criar tag) usam a tag assim: traço, caixa normal, bolinha colorida. O humano mandou aplicar (2026-10-02: "precisa fazer todos").
Aprovado por: humano (2026-10-02). O Figma acompanha na remedição.
Atualização (2026-10-02): a bolinha ganha token próprio, `tom/ponto`. A `tom/tag` de `ambar`, `amarelo`, `lima`, `verde`, `turquesa` e `ciano` tem o L baixo para servir de texto sobre fundo claro; como bolinha e como amostra, âmbar, amarelo e lima viravam o mesmo verde-oliva. No Claro esses seis têm valor próprio, na cor que o nome promete; no Escuro a bolinha aponta para a `tom/tag`, que já é viva. A `tom/tag` não muda. O humano mandou aplicar a recomendação e conferir depois (2026-10-02).
Atualização (2026-10-02): com `icone`, o ícone entra no lugar da bolinha e leva a cor — do `tom` ou, sem tom, do `status`. As tags de temperatura dos exemplos passam a ter ícone colorido nas três (frio, morno, quente), a pedido do humano.

## ADR-060 · Lista com busca: sem caixa na busca, texto de apoio, criar e ação no pé · 2026-10-02
Desvio: sem par no arquivo (o Combobox já era derivado do Select Menu 544:122, ADR-048). A busca do `ComboboxPainel` e do `SeletorTags` deixa a caixa do Input (36px com traço e anel) e vira uma faixa de 36 sem caixa, com traço embaixo (`buscaDoPainel`, lib/campo): o foco fica nela o tempo todo, e o cursor do texto é o sinal. A opção ganha `detalhe` (texto de apoio à direita, que entra na busca); o painel ganha `aoCriar` (linha de criar no fim da lista, com `rotulos.criar`) e `acao` (uma ação fixa no pé, fora da lista; Tab chega nela). `Combobox`, `ComboboxMultiplo` e `CelulaEscolha` repassam. No `SeletorTags`, a tag escolhida deixa a faixa azul com check à direita e passa a ter caixa de marcar à esquerda, como o Combobox de várias escolhas.
Motivo: crítica de design de 2026-09-28, ponto 3 — o seletor de tags ao lado do combobox e do painel de atributos do Attio ("a diferença de acabamento é visual, direta"). O humano mandou fechar (2026-10-02: "precisa fazer todos").
Aprovado por: humano (2026-10-02). A exceção ao anel de foco na busca fica registrada aqui: vale só para a busca de painel flutuante.

## ADR-061 · O lead abre no Drawer do lead em toda tela · 2026-10-02
Desvio: reverte, para o lead, a quinta parte da proposta visual (ADR-056). Lá o registro clicado numa lista passou a abrir num `PainelLateral` de 480px ao lado. Agora o lead — e todo registro do CRM com perfil — abre no `Drawer` do lead, o mesmo da página do Drawer (`DrawerLead`: perfil, métricas, menu de seções, 840px que a pessoa arrasta), em todas as telas de exemplo: Pipeline (quadro, lista, calendário), Leads, Atendimento (pelo botão de abrir o lead completo; a coluna ao lado do chat continua como resumo) e Dashboard (negócios parados). Cada tela só entrega os dados do registro, a fileira de tags e o conteúdo de Histórico e Perfil; o drawer é um só e vai junto nos blocos (`drawer-lead.tsx`). O `PainelLateral` continua no DS, para o que não tem perfil e se edita olhando para a tela de trás — o bloco da automação. A tela de Leads volta à busca aberta e aos filtros com rótulo no Header.
Motivo: decisão do humano depois de ver as telas com o painel ao lado (2026-10-02: "usa este drawer para as telas de exemplo").
Aprovado por: humano (2026-10-02).

## ADR-062 · Fundo `muted` para canvas e tela de cartões; o canvas das Automações vira canvas · 2026-10-02
Desvio: (1) a superfície única (ADR-055) deixava o conteúdo sempre sobre `card`; o canvas das Automações usava `background`, o mesmo cinza da navegação. Agora a área inteira que precisa de um fundo próprio usa `muted` — o cinza claro entre `background` e `card`: a `TelaBase` ganha `fundo="muted"` (tela de cartões: dashboard) e o canvas é `bg-muted` com pontilhado em `divider`. (2) O canvas da tela de Automações, que só rolava e tinha zoom por botão, passa a ser um canvas: vista por translação e escala; arrastar o fundo, o botão do meio ou Espaço movem a tela; roda e pinça (trackpad e toque) dão zoom no cursor; ligação por arrasto da saída, com lista de blocos ao soltar no vazio; ligação marcável e removível; seleção de vários (Shift + clique, Shift + arrastar); menu no botão direito; desfazer e refazer com histórico na tela; organizar automático; mapa; atalhos de teclado e cartão de gestos; blocos assentam numa grade de 8. Continua sem biblioteca de grafo e continua sendo arranjo da tela, não componente do DS.
Motivo: pedido do humano (2026-10-02: "diferenciar a cor de fundo do menu, arrastar e mover a tela como um canvas, zoom com gestos e mouse, e todas as outras funções que faltam"; "dashboard com um fundo cinza claro que não seja o do menu nem o dos cards").
Aprovado por: humano (2026-10-02). O Figma acompanha na remedição.

## ADR-063 · A opção da lista é a peça final · 2026-10-02
Desvio: o Select Item do arquivo (544:99) é texto. Agora, quando o que a pessoa escolhe aparece na tela como uma `Tag`, a opção da lista é essa mesma Tag: `OpcaoSelect` ganha `conteudo` (antes só o Combobox tinha), e `Select`, `Combobox`, `ComboboxMultiplo`, `ComboboxPainel`, `CelulaEscolha` e a `BarraDeFiltros` mostram a peça na lista e no gatilho. O `rotulo` segue obrigatório (busca e leitor de tela). Nas telas de exemplo, atendente aparece como Tag com foto em todo filtro, célula, formulário e drawer; "Transferir" (Atendimento) e "Aplicar tag" (Leads) deixam de ser `Menu` de texto e viram `ComboboxPainel` com as Tags.
Motivo: regra pedida pelo humano para o design system inteiro (2026-10-02: "sempre que aparecer um dropdown com itens de tag, eles já devem aparecer com a mesma aparência da visualização final… ajuda na UX em saber exatamente como vai ficar").
Aprovado por: humano (2026-10-02).

## ADR-064 · Tag: traço mais forte, lista com ícone cinza e criar sempre à mão · 2026-10-02
Desvio: três ajustes sobre a Tag do ADR-059, sem par no arquivo. (1) O traço da pílula passa de `border` para `divider` — um degrau acima, para a tag se ler sobre branco e sobre cinza. (2) A tag de lista deixa a cor: leva um ícone cinza (`muted-foreground`), um dos doze do conjunto fechado `ICONES_DE_TAG`, escolhido por quem cria — `GrupoTags.iconeLivre` mostra a fileira de ícones no `SeletorTags`, `aoCriar` recebe a chave, e o `SeletorDeIcone` fica disponível para formulário. (3) Digitar um nome que não existe sempre oferece criar: os `SeletorTags` das telas passam `aoCriar` (o do Atendimento só filtrava), a célula de tags cria pela `CelulaEscolha`, e o catálogo de tags vira estado da tela para a tag nova valer na lista, no cartão, no filtro e no drawer. `rotulos.icone` passa a ser obrigatório no `SeletorTags`.
Motivo: pedido do humano (2026-10-02: "tags de lista deve conter ícone cinza escuro e com opção de escolher na hora de criar; sempre deve aparecer a opção de criar uma nova tag ao digitar; cinza do stroke nas tags pode ter mais contraste, em todas").
Aprovado por: humano (2026-10-02).

## ADR-065 · Drawer plano, com menos respiro e botões de 28 · 2026-10-02
Desvio: o arquivo (565:6447) desenha o perfil do Drawer com degradê no topo (card → brilho do tom) e os cartões de métrica com degradê na diagonal; eram as duas exceções à regra A3 (sem gradiente de fundo). Os dois saem: o perfil é `card` chapado e a métrica é um cartão com traço `border`. Os tokens `bg-drawer-perfil` e `bg-metrica` deixam de existir. Os respiros descem: recuo do perfil e do conteúdo 20 → 16, entre blocos 16 → 12, item do menu 36 → 32, cartões do conteúdo a 8 (`gradeDeCartoes`), seção com 8. O `DrawerPainel` se marca com `data-compacto`: o `Button` `md` e `icon` de dentro medem 28 sem a tela passar `size` (o mesmo mecanismo do Header, ADR-057). Os botões de canto passam de 29 para 24, sem caixa.
Motivo: pedido do humano (2026-10-02: "atualizar o drawer de todas as telas, deixar igual a este porém sem gradients, gaps menores e com botões menores"); o gradiente do menu do lead já vinha da crítica de 2026-09-28 (ponto 9).
Aprovado por: humano (2026-10-02). O Figma acompanha na remedição.

## ADR-066 · O mesmo padrão de fundo em toda tela · 2026-10-02
Desvio: ajusta a superfície única do ADR-055, em que lista, quadro e chat encostavam direto no painel branco da tela. Agora toda tela tem os mesmos quatro tons: navegação em `background`, topo (Header e faixa de filtros) em `card`, conteúdo em `muted` e blocos em `card` com traço. `TelaBase.fundo` passa a ter `muted` como padrão. A lista de Leads e a do Pipeline vão num bloco branco (`blocoDaTela`, lib/estados) que tem a altura do conteúdo; o quadro fica direto sobre o `muted`; no Atendimento cada coluna é um bloco. O painel da tela (`card` com traço, a 8px da janela) continua.
Motivo: pedido do humano, mostrando o dashboard (2026-10-02: "este padrão de cores de fundo precisa seguir em todas as telas — chat, leads e pipeline estão diferentes").
Aprovado por: humano (2026-10-02).

## ADR-067 · Mais contraste na navegação e nos controles de apoio · 2026-10-02
Desvio: no arquivo o item da navegação e os controles de apoio têm texto e ícone em `muted-foreground`, e o selecionado é o azul clarinho (`blue-50` / `accent`). Agora, na `Sidebar`, no Button `tertiary`, no `SegmentedControl`, no `ViewSwitcher`, na `HeaderBusca` e no gatilho de data: texto e ícone em `foreground` no repouso; hover = branco a 50% (o fundo clareia meio degrau — `hoverDeApoio` e `hoverNoTrilho`, lib/estados); selecionado = fundo `card` (branco), com o ícone preenchido e o texto em azul. O token `--segmented-item-selected` passa a ser a superfície oposta à do trilho nos dois temas (`background` fora da tela, `card` dentro de `data-superficie`). Os tokens `nav-item-*` não mudam de valor: o menu do Drawer, que fica sobre branco, continua com o selecionado em azul claro.
Motivo: pedido do humano (2026-10-02: "precisamos de mais contraste aqui… onde está cinza nos ícones e nos textos deixar preto, onde está azul clarinho deixar branco, padroniza o hover com branco 50% e no ativo o ícone preenchido azul").
Aprovado por: humano (2026-10-02). O Figma acompanha na remedição.

## ADR-068 · Movimento nas telas: duas entradas novas na escala · 2026-10-02
Desvio: acréscimo à escala de movimento (ADR-021), sem par no arquivo. Duas animações nomeadas — `surgir` (opacidade + 4px para cima, `base` · `enter`) e `crescer` (scaleY do chão, `slow` · `settle`). Onde entram: o conteúdo da `TelaBase` e a `BarraDeFiltros` entram em `fade-in-fast`; o cartão do quadro e a mensagem do chat, em `surgir`; as barras do `CardChart` crescem em sequência (30ms entre uma e outra) e deslizam a altura quando o valor muda — exceção registrada à regra de não animar altura, como o Toast; trocar de seção no Drawer do lead entra em fade. No canvas das Automações, o que a pessoa conduz (arrasto, roda, pinça) segue o dedo, e o que ela pede por botão ou tecla (zoom, enquadrar, organizar) desliza em `base`, com os conectores remedidos a cada quadro. Voltam o levantar do cartão do quadro no hover e a transição do zoom, que tinham saído na reescrita. Tudo sob `motion-safe`; a redução continua global.
Motivo: pedido do humano (2026-10-02: "precisa aplicar os motions na tela que parece que você tirou… aplique novamente e melhore ainda mais onde não tinha").
Aprovado por: humano (2026-10-02).

## ADR-069 · A opção da lista leva os sinais da Tag, sem a pílula · 2026-10-07
Desvio: ajusta a ADR-063. A opção de `Select`, `Combobox`, `ComboboxMultiplo`, `ComboboxPainel`, `CelulaEscolha` e `BarraDeFiltros` deixa de levar `conteudo: <Tag …>` e passa a levar os sinais da peça — `foto` (um disco de 20px, o `Avatar xs`), `tom` ou `status` (a bolinha de 6px, ou a cor do `icone`) e `icone` — antes do nome, na lista e no gatilho (`SinalDaOpcao`, `temSinal`; `sinaisDaTag(t)` monta os quatro). `conteudo` continua existindo para o que não é tag nem pessoa. O `SeletorTags` segue mostrando a pílula: é o seletor DE tags, não um campo. A cor da bolinha por status sai da Tag para `lib/sinais.ts`.
Motivo: na reunião de 2026-10-02 a Tag do atendente dentro do Select do "Novo lead" leu como "campo dentro de campo" (Angélica, Gava); o lead (Avatar com iniciais) e o atendente (foto na pílula) pareciam peças de sistemas diferentes (Ryan). O sinal sem a pílula mantém o que a ADR-063 queria — ver a cor e a foto antes de escolher — e harmoniza as duas pessoas no mesmo disco de 20px.
Aprovado por: humano (2026-10-07, "pode iniciar" sobre a lista de 2026-10-07).

## ADR-070 · Uma caixa de marcar só: raio 4, traço de 1,5 · 2026-10-07
Desvio: o `Checkbox` passa de `rounded-xs` (2px, o do arquivo) para `rounded-sm` (4px); as caixas das listas (Combobox de várias escolhas, seletor de tags, item `check` do Menu) deixam de ser uma caixa própria de `border` e passam a `caixaDeMarcar` (lib/campo.ts): 16px, o mesmo fundo, o mesmo traço de 1,5 por `ring-inset` e o mesmo raio do Checkbox. O glifo é o `Check` regular de 12px nos dois.
Motivo: Angélica notou na reunião de 2026-10-02 que a caixa do seletor de tags era mais redonda que a da tabela e preferiu a redonda; Gava leu a diferença como "alguma coisa não está pegando o mesmo componente". Eram três desenhos da mesma caixa.
Aprovado por: humano (2026-10-07).

## ADR-071 · Conteúdo do modal: rótulo em todo campo, apoio, obrigatório, pares · 2026-10-07
Desvio: regra nova, sem par no arquivo (a casca do Modal é a ADR-039; o que vai dentro não tinha regra). `Select size="field"` e `Combobox size="field"` passam a desenhar o `rotulo` (era só `aria-label`; `rotuloOculto` tira da tela quando outro texto já o diz). `Input`, `Textarea`, `Select field` e `Combobox field` ganham `ajuda` (texto de apoio sob o campo, some com `erro`) e `obrigatorio` (asterisco + `aria-required`); `Input` ganha `prefixo` ("R$"). `lib/campo.ts` ganha `ajudaDeCampo`, `asteriscoDeCampo`, `linhaDeCampos` (dois campos lado a lado) e `formulario` (o corpo, 16px). A receita inteira está em `docs/regras.md` § "Conteúdo do modal": ordem, pares, prefixo e ícone, rodapé. Os formulários do protótipo (Novo lead do Pipeline e de Leads, Nova tag, Agentes, bloco da Automação) seguem a receita.
Motivo: reunião de 2026-10-02 — o "Novo lead" tinha três campos com rótulo e três selects sem (Gava: "parece que tem três campos e depois três jogados embaixo"); Ryan: "a única diretriz é a estrutura do modal, não como os componentes se comportam dentro"; Bryan: sem padrão escrito, a IA monta "o melhor jeito", não o jeito padronizado. Referência citada: o modal do Attio.
Aprovado por: humano (2026-10-07).

## ADR-072 · Sidebar recolhida: símbolo de 20px e botão de expandir à vista · 2026-10-07
Desvio: ajusta a ADR-052. Recolhida, a `SidebarBrand` mostra o símbolo com 20px (o tamanho de um ícone de item, `[&>svg]:size-5`) numa linha de 32 e, embaixo, o `SidebarToggle` — sempre à vista. Sai o símbolo de 32 que virava botão de expandir sob o cursor ou o foco.
Motivo: Gava, na reunião de 2026-10-02: "achei grande o ícone da DataCrazy" e "esse efeito de hover para expandir, não gostei"; sem referência, a proposta é minha.
Aprovado por: humano (2026-10-07).

