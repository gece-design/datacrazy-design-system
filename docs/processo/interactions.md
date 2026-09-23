# Interações — DataCrazy
Kit: v3.2 · Banco herdado: `.kfe-kit/interactions-global.md` (regras I1–I15) · Reconciliado em 2026-09-19 (lote B0 da auditoria de consistência)

<!-- ONDE OS ESTADOS SÃO DECLARADOS. O Figma manda no estado de repouso (camada
     1, medido por pixel-diff); aqui se declara o resto, SEM desenhar — é a
     contrapartida da exceção E-01 (kfe-state.md). A IA lê este arquivo antes
     de gerar (fw-ui) e grava o resultado em components-registry.json (fw-doc).
     Este arquivo era um rascunho de 2026-09-01 com sete decisões "a tomar";
     27 componentes tomaram essas decisões no código. Aqui está o que foi
     decidido, lido do código e do log — nada foi inventado. -->

## 0. Divisão de responsabilidade (E-01)

| Vem do Figma | Vem de regra (aqui) |
|---|---|
| Tokens e variáveis · estado de repouso · variantes estruturais · layout e geometria · estados que mudam o **layout** (vazio, erro, carregando) | hover · foco · active · disabled · selected · movimento |

Estado que muda só cor, opacidade ou posição → regra. Estado que muda o que
aparece na tela → Figma. **Onde não existe token, não se inventa valor**: o
token passa a existir com o humano, e a regra aponta para ele.

## 1. Declaração por componente

Vocabulário: estados `hover` `active` `focus` `disabled` `loading` `selected`
`empty` `error` mais os estados próprios que o registro já usa (`aberto`,
`marcado`, `pausado`…) · famílias `acao` `entrada` `navegacao` `superficie`
`feedback` `overlay` `midia` · motion pela escala da L8.

| Componente | Família | Variantes | Estados | Motion | Observação |
|---|---|---|---|---|---|
| KpiCard | superficie | fill, outline, trend:neutral, trend:up, trend:down | — (só leitura) | none | set 269:53 |
| Card | superficie | shell, list, donut, chart, select | hover, focus | fast | set 304:5313 |
| DataTable | superficie | tabela, toolbar, paginacao, celulas, ajustes (menu da coluna, alça, arrasto, botão Colunas, Agrupar por, linha de grupo) | hover, focus, selecionada, ordenada, arrastando, alça, grupo recolhido | fast | set 331:1354 · comportamentos T1 (cliente, 2026-09-18) |
| Calendario | superficie | mes, semana, dia cheio, painel do dia | hover, focus, hoje, outro mês, dia cheio, mês trocando | fast | sem par (T4, cliente 2026-09-18) |
| TelaBase | superficie | xl aberta, lg recolhida, menu por cima | sidebar recolhida, menu aberto, focus | fast | sem par (casca, humano 2026-09-23) · ADR-027 |
| Select | entrada | md, sm, aberto | hover, focus, aberto | fast | set 261:333 / 261:463 |
| Pagination | navegacao | com resumo, sem resumo | hover, focus, disabled, atual | fast | set 261:790 |
| Toast | feedback | success, destructive, warning, info | hover, focus, pausado, saindo | entrada: toast-open 200ms + fade-in 250ms · saída: desliza 200ms e fecha o vão 200ms · reduce: nenhuma | set 548:52 |
| Tooltip | overlay | top, bottom, left, right | aberto, clique | entrada: fade-in-fast 150ms · saída: seca · reduce: nenhuma | set 548:73 |
| Drawer | overlay | camada, estilo:fill, estilo:outline, menu com fixados, menu em cards, painel, tom:azul, tom:laranja, tom:rosa, tom:roxo | hover, selecionado, focus, aberto, recolhido, fixado | drawer-entra 280ms / drawer-sai 200ms / fade do scrim | set 533:3809 / 565:5959 |
| Input | entrada | com acoes, com icone, copiar, editavel, rating, select field | hover, focus, erro, disabled | fast | set 535:48 / 590:3000 / 544:129 |
| Avatar | midia | sm, md, lg, com foto | — (só leitura) | none | set 538:200 |
| Tag | superficie | texto, status:destructive, status:info, status:success, tipo:pessoa, tipo:empresa, foto, adicionar, seletor | hover, focus, selecionada, aberto | fast | set 538:197 |
| Checkbox | entrada | com rotulo, sem rotulo, indeterminado | hover, focus, marcado, indeterminado, disabled | fast | set 547:28 |
| RadioGroup | entrada | vertical, em linha | hover, focus, marcado, disabled | fast | set 547:45 |
| Switch | entrada | com rotulo, sem rotulo | hover, focus, ligado, disabled | fast | set 547:66 / 595:10896 |
| Tabs | navegacao | — | selecionada, hover, focus, disabled | transition-colors | set 535:21 |
| Modal | overlay | default, destructive, size:sm, size:md, size:lg | hover, focus, aberto, fundo | entrada: fade-in-fast 150ms no fundo e na caixa · saida: seca · reduce: nenhuma | set 545:168 |
| Header | navegacao | — | repouso, sem espaço, texto longo, hover (sino), focus (busca), notificações | transition-colors | set 601:464 |
| Breadcrumb | navegacao | — | ancestral, atual, hover, focus, recolhida, texto longo | transition-colors | set 261:269 |
| SegmentedControl | entrada | SegmentedControl, ViewSwitcher (471:2947) | selecionada, hover, focus, disabled | transition-colors | set 269:68 |
| Telefone | entrada | por pais | hover, focus, erro, disabled | fast | sem desenho |
| TimePicker | entrada | hora, hora com segundos, data e hora, com seletor de fuso | hover, focus, selecionado, aberto | fast | sem desenho |
| Button | acao | primary, secondary, ghost, destructive, soft, outline, tertiary, sm, md, lg, icon | hover, focus, disabled | fast | sem doc e sem registro — lote B1 |
| Badge | feedback | neutral, primary, success, warning, destructive, info | — (só leitura) | none | só leitura; fora do showcase por decisão (2026-09-15) — lote B1 |
| Sidebar | navegacao | expandida, colapsada, selecionado | hover, focus, disabled, selected, recolhida | fast | colapso sem transição (AUD-011) — lote B1 |
| DateRangePicker | entrada | dois meses, com atalhos, CalendarioDeDia | hover, focus, disabled, selected, aberto | fast | painel abre seco (AUD-009) — lote B1 |
| Rating | entrada | editável, só leitura, max | hover, focus, active | estrela-pop 420ms · brilho 480ms | único componente com `active` (scale-90) — lote B1 |
| LogoDataCrazy | midia | símbolo, logotipo | — (só leitura) | none | currentColor — lote B1 |

Estado não declarado e não desenhado = o componente **não tem** aquele estado.
Ausência é decisão (Avatar, KpiCard, Badge, Logo são leitura).

## 2. Regras locais do produto (sobrescrevem o banco global)

Cada linha foi lida do código construído entre 2026-09-01 e 2026-09-18 e do
log em `kfe-state.md`. Onde o código faz duas coisas, a regra diz as duas e
aponta a decisão pendente.

| # | Estado / situação | Regra neste produto | Por quê | Data |
|---|---|---|---|---|
| L1 | `focus-visible` | `outline outline-2 outline-offset-2 outline-ring` (calibration **D6**). Em contêiner que rola e cortaria o offset (Tabs): `ring-2 ring-inset ring-ring` (**D19**). Campo composto (busca do Header, caixa de campo): o mesmo anel por `focus-within` no contêiner. Nunca `ring-offset-*` (pinta cor sólida) | I4 é obrigatória; D6 achou o halo errado do ring-offset dentro de card | 2026-09-01 · D19 2026-09-15 |
| L2 | `hover` em superfície neutra | Item **com fundo** (botão secondary/ghost/tertiary, linha de tabela, opção de lista, página da paginação): fundo `accent` no botão, `overlay-item-hover` em lista/linha/opção, `nav-item-hover` na navegação lateral e no menu do Drawer. Item **só texto** (aba, nível da trilha, chevron): sobe um degrau de texto (`subtle`→`muted`, `muted`→`foreground`), nunca muda peso (I2) | Decisões dos gates de 2026-09-04 (linha da tabela, paginação) e 09-15 (Tabs, Breadcrumb) | 2026-09-04 |
| L3 | `hover` em ação com cor | Token `*-hover` da própria cor: `primary-hover`, `destructive-hover`, `button-soft-hover`, `input-border-hover`. Os pares escuros existem desde 2026-09-04 (check:temas verde) | I1 aplicado ao token existente | 2026-09-01 |
| L4 | `disabled` | Ação e navegação: `opacity-50 pointer-events-none` (Button, Tabs, Pagination, Segmented, DatePicker, Sidebar por `aria-disabled`). Campo de entrada: tokens `input-bg-disabled` + `input-text-disabled` + `cursor-not-allowed`, eventos mantidos. **Decidido no gate B0 (2026-09-19): ação e navegação passam a seguir I5 no lote B3** — `opacity-disabled` + `cursor-not-allowed`, eventos mantidos (tooltip pode explicar), `aria-disabled` onde o elemento não aceita `disabled` | duas famílias, dois padrões; virou AUD-028 | 2026-09-14 |
| L5 | `active` / pressionado | **Não existe** no DS, salvo Rating (`active:scale-90`, parte da animação da estrela). Um degrau além do hover (I3) exigiria `primary-600`, que existe na rampa mas nunca foi aprovado como estado. **Ausência confirmada no gate B0 (2026-09-19).** Entrar exige token `primary-600` aprovado e uma tela que precise | nenhum componente construiu; nenhum gate pediu | 2026-09-19 |
| L6 | `loading` / `skeleton` / `empty` | **Não construídos.** Entram pelo roadmap (Skeleton, Spinner, Empty State 331:1364) como componentes, não como estado derivado (I6, I7 exigem peça do DS que ainda não existe) | ausência declarada | 2026-09-19 |
| L7 | `selected` / `checked` / atual | Sinal que sobrevive ao mouse sair (I9), sempre **dois**: fundo + texto/ícone. Paginação `accent` + `primary`; navegação `nav-item-selected` + `nav-item-icon-selected`; lista/opção `overlay-item-selected` + `overlay-item-text-selected` + Check; Segmented/ViewSwitcher `segmented-item-selected` (`accent` no claro, `background` no escuro); Tabs `primary` + traço 2px; controles de formulário conforme o desenho (`primary`) | decisões de 2026-09-04 (dois sinais) e 09-18 (seleção visível no escuro) | 2026-09-04 |
| L8 | Movimento — duração e curva | Valores **aprovados pelo humano**: Tooltip entra em 150ms · Toast abre espaço em 200 e dissolve em 250, sai deslizando em 200 · Drawer entra em 280 com `cubic-bezier(0.32,0.72,0,1)` e sai em 200 com `ease-in`. Escala derivada para o lote B2: `fast` 150 (cor/opacidade, todo `transition-colors`) · `base` 200 (tamanho/posição, saídas) · `slow` 280 (entrada de painel). `ease-out` na entrada, `ease-in` na saída (I10). **Decidido no gate B0 (2026-09-19): `fast` 150 · `base` 200 · `slow` 280**; o fade do Toast vai de 250 para 280. Desvio da I10 em ADR-021 | decisões de 2026-09-15 (Toast, Tooltip) e 09-18 (Drawer) | 2026-09-18 |
| L9 | `prefers-reduced-motion` (I12) | Global no `globals.css` a partir do lote B2: toda animação e transição cai para 0. JS que espera animação acabar (Drawer, Toast) lê `reduzido()` de `lib/movimento.ts` e desmonta na hora. Até lá, `motion-safe:` por classe | 5 de 40 arquivos cumpriam; disciplina por classe não segurou | 2026-09-19 |
| L10 | Camada bloqueante (`aberto` de Modal, Drawer) | Portal no body · `z-modal` · scrim `overlay-scrim` a 40% · foco preso · Escape fecha (só a camada do topo) · rolagem travada com barra compensada · foco devolvido a quem abriu (`lib/use-camada.ts`). Destrutivo não fecha com clique fora. Camadas empilham | roadmap § Focus Scope, Scroll Lock e Scrim · decisão 2026-09-15 | 2026-09-15 |
| L11 | Painel flutuante (`aberto` de Select, TimePicker, DatePicker, seletor de tags, notificações) | `z-popover` · `overlay-bg` + `overlay-border` + `shadow-lg` (**D22**) · vira de lado/para cima quando não cabe · Escape fecha só o painel · clique fora fecha · foco entra no painel e volta ao gatilho | derivação do Select (2026-09-04), reusada por todos | 2026-09-04 |
| L12 | Balão (`visivel` do Tooltip) | Cursor após 400ms (toque ignorado), foco de teclado na hora, Escape e clique fecham, `z-popover`, vira de lado quando não cabe. Não é camada: não prende foco | roadmap § Tooltip | 2026-09-14 |
| L13 | Alvo de toque (I15, 44px) | **Descumprido de propósito nesta rodada**: checkbox 18, switch 20, paginação 28, seletor do card 32. Registrado como divergência para a remedição contra o Figma, não para os lotes de consistência | mudar o alvo muda o repouso | 2026-09-14 |
| L14 | Texto que trunca | `truncate` + `title` (calibration **D12**); no estado colapsado o `title` sobe para a raiz | tickets #83283 #83274 #59567 | 2026-09-03 |

Regra local nasce de (a) decisão do humano num gate ou (b) inferência aprovada
2× para a mesma família. Nunca de opinião da IA.

## 3. Decisões inferidas (aguardando gate)

Nenhuma. As 11 inferências dos lotes 2–4 foram aprovadas em bloco no gate B0
(2026-09-19) e estão no registro com `approvedIn: "B0"`. A próxima entra aqui
pela fw-ui, com precedente citado (`kfe-interactions.mjs precedent`).

## 4. Estados desenhados no Figma (voltam para a camada 1)

Medidos por pixel-diff, não derivados. Lidos do registro (`source: figma`).

| Componente | Estado | Node do Figma |
|---|---|---|
| Drawer | hover | 533:3809 / 565:5959 |
| Drawer | selecionado | 533:3809 / 565:5959 |
| Input | focus | 535:48 / 590:3000 / 544:129 |
| Input | erro | 535:48 / 590:3000 / 544:129 |
| Input | disabled | 535:48 / 590:3000 / 544:129 |
| Tag | hover | Select Item 544:99 |
| Tag | selecionada | Select Item 544:99 |
| Checkbox | marcado | 547:28 |
| Checkbox | disabled | 547:28 |
| RadioGroup | marcado | 547:45 |
| RadioGroup | disabled | 547:45 |
| Switch | ligado | 547:66 / 595:10896 |
| Switch | disabled | 547:66 / 595:10896 |
| Tabs | selecionada | State=Selected (535:20) |
| Header | repouso | Actions=Default (601:12) |
| Breadcrumb | ancestral | theme=Light (261:269) |
| Breadcrumb | atual | theme=Light (261:269) |
| SegmentedControl | selecionada | Selected=Mês (269:54) · View=Chart (471:2940) |
| Telefone | focus | Input |
| Telefone | erro | Input |
| Telefone | disabled | Input |
| TimePicker | hover | Select Item 544:99 |
| TimePicker | selecionado | Select Item 544:99 |

## Como este arquivo evolui

1. **`calibration.md`** é o livro-razão: estado derivado que saiu errado e foi
   corrigido 2× vira regra lá, e a linha daqui passa a citá-la.
2. A regra estabilizada sobe para `.claude/skills/datacrazy-frontend/SKILL.md`.
3. A seção 3 esvazia a cada gate; a seção 2 cresce só por decisão.
