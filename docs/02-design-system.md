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
| `background` | `#F4F5F6` | `#1C1C25` | fundo da página |
| `card` | `#FFFFFF` | `#1E1E24` | superfície elevada |
| `accent` | `#E8F1FF` | `#232C3D` | realce de superfície |
| `surface-inverse` | `#232C3D` | `#F4F5F6` | superfície invertida (logo) |
| `primary` | →`base/blue/500` | →`base/blue/400` | ação primária |
| `primary-hover` | →`base/blue/600` | →`base/blue/300` | hover da ação primária |
| `primary-foreground` | `#FFFFFF` | `#10131A` | texto sobre o primário |
| `border` | `#E1E7EF` | `#2E2E38` | traço |
| `ring` | →`primary` | →`primary` | anel de foco |

### Cor — formulário

Onze tokens (node 431:2718). Todos são **alias exato** de um semântico que já
existe, nos dois modos — por isso vivem só no `:root` do `globals.css`: o
`var()` acompanha o tema sozinho, sem uma linha no `.dark`.

| Token | Aponta para |
|---|---|
| `input/bg` | `card` |
| `input/border` | `border` |
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

### Cor — estados

| Token | Claro | Escuro |
|---|---|---|
| `success` | `#267952` | `#64CEA2` |
| `success-hover` | `#294F3D` | `#8BDAB9` |
| `destructive` | `#C6323C` | `#EB7076` |
| `destructive-hover` | `#753237` | `#F09499` |
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
| `--sidebar-surface` | superfície do painel, sempre gradiente | `card` → `card` | `background` → `accent` |
| `--sidebar-avatar` | círculo do avatar sem foto | `surface-inverse` | `blue-700` |

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
| `xl` | 12px | `--radius + 4` | — |
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

Não tokenizado ainda. Quando existir, `prefers-reduced-motion` é obrigatório
(regra I12 do banco global do kit).

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
| 4 | Motion não tokenizado | Duração, curva e `prefers-reduced-motion` sem dono (I12) |
