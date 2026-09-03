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
| `subtle-foreground` | `#A0A8B1` | `#6A7581` | texto terciário |
| `background` | `#F4F5F6` | `#1C1C25` | fundo da página |
| `card` | `#FFFFFF` | `#1E1E24` | superfície elevada |
| `accent` | `#E8F1FF` | `#232C3D` | realce de superfície |
| `surface-inverse` | `#232C3D` | `#F4F5F6` | superfície invertida (logo) |
| `primary` | →`base/blue/500` | →`base/blue/400` | ação primária |
| `primary-hover` | →`base/blue/600` | →`base/blue/300` | hover da ação primária |
| `primary-foreground` | `#FFFFFF` | `#FFFFFF` | texto sobre o primário |
| `border` | `#E1E7EF` | `#2E2E38` | traço |
| `ring` | →`primary` | →`primary` | anel de foco |

### Cor — primitivos (mesmo valor nos dois modos)

`base/blue/50` `#F0F6FF` · `100` `#E0EDFF` · `200` `#ADCEFF` · `300` `#80B3FF` ·
`400` `#599CFF` · `500` `#3385FF` · `600` `#1266E2` · `700` `#114797` ·
`base/neutral/900` `#1E1E24`

### Cor — estados

`success` `#267952` · `success-hover` `#294F3D` · `destructive` `#C6323C` ·
`destructive-hover` `#753237` · `warning` `#975E1D` · `warning-hover` `#5E4221` ·
`info` `#25719D` · `info-hover` `#274B60`

⚠️ Os oito repetem valor entre claro e escuro — violação da regra E4, reprovada
por `npm run check:temas`. Proposta de correção pendente de aprovação:
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

### Espaçamento e raio

Escala de espaço: a do Tailwind, sem extensão. Raio: `--radius` em
`app/globals.css`, com `lg` = `--radius`, `md` = `−2px`, `sm` = `−4px`.
O valor de `--radius` é a pendência do eixo Forma.

### Elevação

Não há **escala** de sombra: o Figma não entregou uma. O que existe são duas
sombras nomeadas, extraídas de nós concretos e registradas em
`tailwind.config.ts` para não virarem valor mágico espalhado (G5).

| Classe | Valor | De onde veio |
|---|---|---|
| `shadow-highlight` | `inset 0 1px 4px 0 rgb(255 255 255 / 0.25)` | realce interno que o Figma aplica em toda superfície da sidebar |
| `shadow-float` | `0 4px 4px 0 rgb(0 0 0 / 0.08)` | botão de colapsar, o único elemento que flutua sobre o painel |

Fora dessas duas, nenhuma sombra se inventa: sem token, é bloqueio, não
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
| 1 | Estados sem versão escura (8 variáveis) | Contraste ruim no escuro; reprova no `check:temas` — [proposta](processo/tokens-estados-escuro.md) |
| 2 | Rampa neutra incompleta — só existe `base/neutral/900` | Falta escala para superfícies e bordas intermediárias |
| 3 | Valores soltos no design: `#09090B` (1.764 usos), `#71717A` (1.538), gradientes dos gráficos | Não acompanham o tema; religar muda cor levemente e precisa de decisão |
| 4 | Gráficos com gradiente solto que clareia até quase branco | Some no tema escuro |
| 5 | Escala de elevação e de motion inexistentes | Bloqueiam componentes de sobreposição |
