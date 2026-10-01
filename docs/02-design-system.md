# Design system — DataCrazy (CRM)

O produto deste ciclo **é** este design system. Aqui mora o mapa
nome→semântica dos tokens e a direção visual que os justifica. O valor
efetivo vive em `app/globals.css` e `tailwind.config.ts`, espelhados do
Figma — divergiu, o Figma manda: conserte o config e depois esta tabela.

## Direção visual

<!-- Dono: fw-ux (U4). Evidência bruta (30 stickies do FigJam, tensões T1–T3,
     análises do board): processo/ux-direcao-visual.md. Aqui fica só a decisão. -->

**Tom:** autoridade e credibilidade — CRM de trabalho, não app de consumo.
**Personalidade:** densidade progressiva (pouco por padrão, resto sob demanda).
**Ambição:** *"algumas pinceladas"* sobre o que existe, não redesenho — o DS
tem de ser adotável de forma incremental sobre o `globals.css` do CRM.

**O que este produto NUNCA parece:** arredondado demais · card inteiro
colorido · saturação alta · amarelo de marca · gradiente de fundo · glass ·
dois menus ao mesmo tempo · abas para crescer · título+descrição decorativos
em toda tela · gráfico gastando espaço com eixo e legenda.

Lista completa com procedência e citações:
[processo/ux-direcao-visual.md](processo/ux-direcao-visual.md).

### O que cada eixo já decide

| Eixo | Decisão | Ainda em aberto |
|---|---|---|
| **Forma** | Raio contido e consistente entre botão, card e input | Valor exato do raio |
| **Cor** | Cor não preenche superfície — entra em borda e tag. Saturação baixa. Amarelo fora como cor de marca. Sem gradiente de fundo | Qual é a cor de marca aplicada |
| **Superfície** | Separação por tom ou borda, nunca por efeito. Glass fora | Tom vs. borda, e o comportamento no escuro |
| **Tipografia** | **Resolvido** · Geist + Geist Mono. Hierarquia por peso, maior título 26px | `text/heading-1/size` e `/weight` |
| **Navegação** | Um menu só. Sem abas para crescer. Sidebar colapsável com accordion e favoritos. Breadcrumb de 2 níveis, teto | — |
| **Densidade** | Progressiva. Sem título+descrição decorativos. Gráfico sem eixo/legenda | Onde exatamente cortar |
| **Iconografia** | **Phosphor**, peso único — decisão do humano que sobrepõe a anti-referência nº 14. Racional e cuidados: [01-arquitetura.md](01-arquitetura.md) | Peso padrão a aprovar (proposta: `regular`, `fill` no selecionado) |
| **Movimento** | Sem efeito pesado | Duração, curva, onde aplicar |

## Fundações

<!-- Dono: fw-ui / fw-onboard. Valores medidos no Figma (coleção Cor e Tipografia
     do arquivo DESIGN - DATA CRAZY), nunca estimados. Como os nomes foram
     escolhidos e o que foi corrigido no arquivo: processo/tokens-migracao.md. -->

### Cor — semânticos (mudam com o tema)

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `foreground` | `#1C1C25` | `#F4F5F6` | texto principal |
| `muted-foreground` | `#6A7581` | `#A0A8B1` | texto secundário |
| `subtle-foreground` | `#A0A8B1` | `#8B95A3` | texto terciário |
| `background` | `#EBEDEF` | `#16161D` | fundo da página |
| `muted` | `#F5F6F7` | `#1D1D25` | cinza entre o fundo e o card: cabeçalho e grupo da tabela, linha dos dias do calendário — o que sumia sobre o fundo |
| `card` | `#FFFFFF` | `#25252D` | superfície elevada |
| `accent` | `#E8F1FF` | `#232C3D` | realce de superfície |
| `surface-inverse` | `#232C3D` | `#F4F5F6` | superfície invertida (logo) |
| `primary` | →`base/blue/500` | →`base/blue/500` | ação primária (escuro: era blue/400; desceu para o rótulo branco, ADR-033) |
| `primary-hover` | →`base/blue/600` | →`base/blue/400` | hover da ação primária |
| `primary-foreground` | `#FFFFFF` | `#FFFFFF` | texto sobre o primário |
| `border` | `#E1E7EF` | `#3C3C49` | traço |
| `divider` | `#C3CCD8` | `#535364` | separador entre grupos de ação sobre `background` (Header) |
| `ring` | →`primary` | →`primary` | anel de foco |

### Cor — formulário

Onze tokens (node 431:2718). Todos são **alias exato** de um semântico que já
existe, nos dois modos — por isso vivem só no `:root` do `globals.css`: o
`var()` acompanha o tema sozinho, sem uma linha no `.dark`.

| Token | Aponta para |
|---|---|
| `input/bg` | `card` |
| `input/border` | `border` no claro · `#6A6A7C` no escuro (3,2:1 sobre o card, ADR-033) |
| `input/border-hover` | `muted-foreground` |
| `input/border-focus` | `primary` |
| `input/border-error` | `destructive` |
| `input/text` · `input/label` | `foreground` |
| `input/placeholder` · `input/helper` | `muted-foreground` |
| `input/bg-disabled` | `background` |
| `input/text-disabled` | `subtle-foreground` |

### Cor — overlay

Seis tokens (node 431:2787), para o que flutua sobre a página.

| Token | Claro | Escuro |
|---|---|---|
| `overlay/bg` | →`card` | →`card` |
| `overlay/border` | →`border` | →`border` |
| `overlay/item-hover` | →`accent` | →`base/neutral/800` |
| `overlay/item-selected` | →`base/blue/50` | →`accent` |
| `overlay/item-text-selected` | →`base/blue/600` | →`base/blue/300` |
| `overlay/scrim` | `#0D0F14` | `#000000` |

Os três do meio trocam de token entre os modos e por isso reaparecem no
`.dark` — mesmo caso do `--sidebar-avatar` (regra D11).

### Cor — primitivos (mesmo valor nos dois modos)

`base/blue/50` `#F0F6FF` · `100` `#E0EDFF` · `200` `#ADCEFF` · `300` `#80B3FF` ·
`400` `#599CFF` · `500` `#3385FF` · `600` `#1266E2` · `700` `#114797` ·
`base/neutral/900` `#1E1E24` · `base/neutral/800` `#2A2F3A`

**Marcas**: não há token. O `IconeDeMarca` traz os logos de verdade, e as
cores de cada marca moram no próprio desenho, como numa imagem (ADR-048).

### Cor — estados

| Token | Claro | Escuro |
|---|---|---|
| `success` | `#267952` | `#64CEA2` |
| `success-hover` | `#294F3D` | `#8BDAB9` |
| `destructive` | `#C6323C` | `#DF4950` |
| `destructive-hover` | `#753237` | `#E36369` |
| `warning` | `#975E1D` | `#EDAD5E` |
| `warning-hover` | `#5E4221` | `#F2C288` |
| `info` | `#25719D` | `#67B6E4` |
| `info-hover` | `#274B60` | `#93CBEC` |

Resolvido em 2026-09-04: o Figma passou a dar o par escuro dos oito (node
431:2667) e `npm run check:temas` ficou verde pela primeira vez. Histórico:
[processo/tokens-estados-escuro.md](processo/tokens-estados-escuro.md).

### Cor — componente

Tokens que pertencem a um componente, não à paleta. No Figma vivem na mesma
coleção `Cor`, com os dois modos; no código são variáveis em `app/globals.css`
e cores nomeadas em `tailwind.config.ts`.

| Token (Figma) | Classe | Claro | Escuro |
|---|---|---|---|
| `nav/item/text-default` | `text-nav-item` | `muted-foreground` | `muted-foreground` |
| `nav/item/bg-hover` | `bg-nav-item-hover` | `background` | `card` |
| `nav/item/bg-selected` | `bg-nav-item-selected` | `blue-50` | `accent` |
| `nav/item/text-selected` | `text-nav-item-selected-foreground` | `blue-600` | `blue-300` |
| `nav/item/icon-selected` | `text-nav-item-selected-icon` | `blue-600` | `blue-300` |

Todos são alias. `text-default` aponta para o mesmo alias nos dois modos, e é a
única exceção declarada em `scripts/check-temas.mjs` — o alias repete, o valor
não, porque `muted-foreground` já inverte entre os temas.

Dois tokens do painel não existem como variável no Figma: cada variante de tema
escolheu uma variável diferente, e o código dá nome a essa escolha para não
ramificar por tema.

| Token | Uso | Claro | Escuro |
|---|---|---|---|
| `--sidebar-avatar` | círculo do avatar sem foto | `surface-inverse` | `blue-700` |
| `--avatar-md-fundo` | disco do Avatar `md` | `accent` | `card` |
| `--avatar-md-anel` | anel do Avatar `md` | `card` | `accent` |
| `--button-soft-bg` · `-foreground` · `-hover` | Button `soft` | `blue-50` · `blue-600` · `blue-100` | `accent` · `blue-300` · `neutral-800` |
| `--segmented-item-selected` | opção escolhida do Segmented e do View Switcher | `accent` | `background` |
| `--tom-anel` · `--tom-texto` · `--tom-tag` · `--tom-brilho` | perfil do Drawer, dentro de `[data-tom]` | `accent` · `blue-600` · `primary` · `blue-100` | `accent` · `blue-300` · `primary` · `accent` **(derivado)** |

Os dois do Avatar `md` são o mesmo caso: o arquivo troca os papéis de disco e
anel entre as variantes de tema. Os de tom são diferentes: valem só dentro de
um `[data-tom]`. O azul aponta para tokens; `roxo` usa os hex do arquivo, que
são o azul com o matiz em 266°; `rosa` (330°) e `laranja` (24°) seguem a mesma
regra por decisão do humano (2026-09-15). O brilho escuro e os escuros dos três
tons são **derivados**. Ver [Drawer](componentes/Drawer.md).
Em 2026-09-18 entraram `verde` (142°), `ciano` (190°), `ambar` (45°) e
`vermelho` (356°). Os três primeiros baixam o L da letra e da tag até o
contraste empatar com o do azul — no L do arquivo o texto da tag não se lê
sobre o fundo claro.
Em 2026-10-01 entraram mais seis, pela mesma regra, para a paleta de quinze
cores que o cliente pediu na criação da tag (ADR-051): `indigo` (240°),
`fucsia` (298°), `amarelo` (60°), `lima` (88°), `turquesa` (166°) e `marrom`
(25°, com menos saturação). São catorze tons mais a tag sem tom.
No mesmo dia a letra de `rosa` e de `laranja` desceu de L (47,8 → 42,5 e 37,7):
no L do azul elas ficavam em 3,7:1 e 3,0:1 sobre o próprio brilho; agora
fecham 4,5:1.

Os três últimos nascem da mesma causa: o arquivo repete o modo Claro no Escuro
e o código não pode repetir junto (decisão do humano, 2026-09-18). O `soft`
saía branco-azulado sobre fundo escuro; a opção escolhida em `accent` (#232C3D)
era quase o `card` (#25252D) da trilha e a seleção sumia.

Efeito de sombra: `button inner shadow` do Figma (`inset 2px 4px 8px #E8F1FF66`)
é `shadow-button-inner`, sai de `--shadow-button-inner` e **vale só no Claro** —
é um brilho claro, e no Escuro ele lava a superfície; usam-no `tertiary`, `soft`,
a busca do Header e a opção do View Switcher. Button `primary`, `destructive` e
o botão de adicionar tag são planos nos dois temas: "prefiro plano" (cliente,
2026-09-24, ADR-037). O literal `shadow-button-inner-primary` deixou de existir.

### Tipografia

Família **Geist** (mono: **Geist Mono**), carregada por `next/font`. Quinze
papéis. Line-height em px literal (G1) e tracking em `em` (G2).

| Token | Tamanho / line-height | Peso | Tracking |
|---|---|---|---|
| `display` | 26px / 32px | 600 | -0.0231em |
| `h1` | 22px / 28px | 600 | -0.0182em |
| `h2` | 18px / 24px | 600 | -0.0111em |
| `h3` | 15px / 20px | 600 | 0 |
| `h4` | 13px / 18px | 600 | 0 |
| `body-lg` | 13px / 18px | 400 | 0 |
| `body-md` | 12px / 17px | 400 | 0 |
| `body-sm` | 11px / 16px | 400 | 0 |
| `label-lg` | 12px / 16px | 500 | 0 |
| `label-md` | 11px / 15px | 500 | 0 |
| `label-sm` | 10px / 14px | 500 | 0 |
| `caption` | 10px / 14px | 400 | 0 |
| `overline` | 10px / 14px | 500 | 0.05em |
| `button` | 13px / 18px | 500 | 0 |
| `metric` | 16px / 21px | 600 | -0.0125em |

Coluna de número alinha com `tabular-nums`, nunca trocando para `font-mono`
(regra D7). Fontes instaladas e checagem anti-fallback:
[processo/fonts-checklist.md](processo/fonts-checklist.md).

### Espaçamento

Catorze degraus (node 431:2893): 0 · 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 ·
40 · 48 · 64 · 80. Todos caem na escala do Tailwind sem extensão — 0, `0.5`,
`1`, `1.5`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `20`. É a única
fundação que não gerou linha de código.

Por papel: padding de componente 6–20 · gap entre itens 4–16 · gutter de
layout 24 · entre seções 32 · respiro de página 40. O arquivo dá as faixas,
não o apelido de cada degrau dentro delas — não invente `padding-md`.

### Raio

Sete degraus (node 431:2860), todos derivados de `--radius` = 8px:

| Degrau | Valor | Cálculo | Onde |
|---|---|---|---|
| `none` | 0px | — | — |
| `xs` | 2px | `--radius − 6` | checkbox |
| `sm` | 4px | `--radius − 4` | — |
| `md` | 6px | `--radius − 2` | button · input · card · nav-item |
| `lg` | 8px | `--radius` | popover |
| `xl` | 12px | `--radius + 4` | drawer |
| `full` | 999px | — | badge · avatar |

Mudar `--radius` move a escala inteira. Os três degraus sem componente
atribuído existem na escala e não têm dono: ausência é decisão.

### Elevação

Quatro níveis (node 431:3016), medindo **altura de flutuação**, não ênfase.
A cor é `#0A0D14` nas sete camadas — azul quase preto, nunca preto puro.

| Classe | Camadas | Onde |
|---|---|---|
| `shadow-sm` | `0 1px 2px 0 / 6%` | cards e superfícies em repouso |
| `shadow-md` | `0 1px 2px −1px / 6%` + `0 2px 4px −1px / 8%` | dropdown, tooltip, flutuantes curtos |
| `shadow-lg` | `0 2px 4px −2px / 6%` + `0 8px 16px −4px / 10%` | popover, datepicker, menu de contexto |
| `shadow-xl` | `0 4px 8px −4px / 8%` + `0 16px 32px −8px / 14%` | modal e drawer |

Os nomes `sm`–`xl` **sobrescrevem** os do Tailwind de propósito: com o nome
ocupado, a sombra de fábrica deixa de ser alcançável por engano.

Mais duas sombras nomeadas, de nós concretos da sidebar:

| Classe | Valor | De onde veio |
|---|---|---|
| `shadow-highlight` | `inset 0 1px 4px 0 rgb(255 255 255 / 0.25)` | realce interno que o Figma aplica em toda superfície da sidebar |
| `shadow-float` | `0 4px 4px 0 rgb(0 0 0 / 0.08)` | botão de colapsar, o único elemento que flutua sobre o painel |

Fora dessas seis, nenhuma sombra se inventa: sem token, é bloqueio, não
estimativa.

### Camadas (`z-index`)

`base` 0 · `dropdown` 10 · `sticky` 20 · `overlay` 30 · `modal` 40 ·
`popover` 50 · `toast` 60. Número solto de sobreposição é proibido (#86338, #86178).

### Motion

Dono único: `lib/movimento.ts` (regra D20). O `tailwind.config` importa de lá;
o JavaScript que espera uma animação acabar também. Valores aprovados nos
gates (ADR-010, ADR-019, ADR-021), não desenhados no Figma.

| Token | Valor | Uso |
|---|---|---|
| `duration-fast` / `delay-fast` | 150ms | Cor e opacidade: todo `transition-colors`, `fade-in-fast` (Tooltip, Modal, painéis) |
| `duration-base` / `delay-base` | 200ms | Tamanho e posição; toda saída (`fade-out`, `drawer-sai`, Toast) |
| `duration-slow` / `delay-slow` | 280ms | Entrada de painel (`drawer-entra`, `fade-in` do Toast) |
| `ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Entrada: desacelera no fim |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Saída: acelera |
| `ease-settle` | `cubic-bezier(0.32, 0.72, 0, 1)` | Painel que desliza e assenta (Drawer) |
| `ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot (estrela do Rating) |

Animações nomeadas (`animate-*`): `fade-in` · `fade-in-fast` · `fade-out` ·
`drawer-entra` · `drawer-sai` · `toast-open` · `estrela-pop` (420ms) ·
`estrela-brilho` (480ms). Os nomes são públicos no registry: só se acrescenta.

**Redução de movimento é global** (`globals.css`, regra I12): toda animação e
transição cai para 0 quando o sistema pede menos movimento; o JS pergunta
`reduzido()`. Página: [/foundations/motion](../app/foundations/motion/page.tsx).

### Escalas de dimensão

| Escala | Degraus | Onde |
|---|---|---|
| Ícone (`size` do Phosphor) | 12 · 14 · 16 · 20 | 12 dentro de tag e chevron pequeno · 14 em célula · 16 em botão e campo · 20 na navegação. Fora disso é divergência (`check:tokens`) |
| Altura de controle | 28 (`sm`) · 32 (`md`) · 36 (`lg` e campo de formulário) | Button, Segmented, Select `md`/`field`, Input. O Select `sm` de 29px é medida do arquivo: só a remedição decide |
| Traço interno | `ring-1.5 ring-inset` | Checkbox, Radio, selo do sino (D18) |
| Opacidade | `opacity-disabled` (50%) · `/scrim` (40%) | Controle apagado (I5) · fundo de Modal e Drawer |
| Foco | 2px na cor `ring`, offset 2 (D6) · `ring-inset` onde o contêiner corta (D19) | Constante `foco` em `lib/estados.ts` a partir do lote B3 |

## Famílias de componente

O contrato do produto fecha **5 categorias**: `Ações` · `Formulários` ·
`Navegação` · `Exibição de dados` · `Feedback e sobreposições`. O kit trabalha
com 7 famílias, que definem a regra de estado herdada:

| Categoria (contrato do produto) | Família (kit) |
|---|---|
| Ações | `acao` |
| Formulários | `entrada` |
| Navegação | `navegacao` |
| Exibição de dados | `superficie` · `midia` |
| Feedback e sobreposições | `feedback` · `overlay` |

Catálogo por componente: [componentes/](componentes/). Plano de construção e
escopo negativo: [processo/roadmap-componentes.md](processo/roadmap-componentes.md).
Declaração de estados: [processo/interactions.md](processo/interactions.md).

## Fonte canônica

O Figma manda no estado de repouso (camada 1), medido por pixel-diff.
Estados de interação são camada 2 — declarados, não desenhados: é a **exceção
E-01** registrada em [processo/kfe-state.md](processo/kfe-state.md), com o
contrato em [processo/interactions.md](processo/interactions.md).
Divergência visual é bug do código — ver
[processo/calibration.md](processo/calibration.md).

## Em aberto

| # | O quê | Por quê importa |
|---|---|---|
| 1 | Rampa neutra ainda curta — só `base/neutral/800` e `900` | Falta degrau claro para superfícies e bordas intermediárias |
| 2 | Valores soltos no design: `#09090B` (1.764 usos), `#71717A` (1.538), gradientes dos gráficos | Não acompanham o tema; religar muda cor levemente e precisa de decisão |
| 3 | Gráficos com gradiente solto que clareia até quase branco | Some no tema escuro |
| 4 | ~~Motion não tokenizado~~ | **Resolvido em 2026-09-19** (lote B2): `lib/movimento.ts`, escalas no config, redução global |
| 5 | Tons do perfil (roxo, rosa, laranja) sem variável no Figma | Resolvido no código por `[data-tom]` (decisão do humano, 2026-09-15); falta levar ao arquivo como coleção com modos |
| 6 | Button redesenhado no Figma (269:32): texto 12px, gap 6, sombra interna | O código segue 13px e gap 8; só a sombra e as variantes `soft`/`outline`/`tertiary` entraram. É o que deixa as ações do Header a 5,18% do arquivo (o resto fecha em ~1%) |
| 7 | Scrim sem opacidade definida | `overlay/scrim` existe, mas a camada nunca foi desenhada; Drawer e Modal usam 40% — agora `opacity.scrim` no config (`bg-overlay-scrim/scrim`), aplicado no lote B5 |
