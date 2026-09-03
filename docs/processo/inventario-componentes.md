# DataCrazy — Inventário de componentes do lote 1 (etapa 5 · UX, parte 2)

Derivado da tela **`Dashboard — BoardUI style / Datacrazy`** (node `135:2`,
1268×1757, página NOVAS TELAS), lida via MCP em 2026-09-01. Organizado pelas
**5 categorias fechadas em contrato**.

> ⚠️ **Confirmar que esta é a home.** A página NOVAS TELAS tem outros
> candidatos: `CRM Datacrazy` (101:51, 154:22703, 154:25088) e 18 frames
> chamados apenas `Breakpoint // Desktop`. Escolhi esta pelo conteúdo —
> KPIs + gráficos + tabela é o que uma home de CRM mostra. Se for outra, o
> inventário muda.
>
> Nada aqui foi inventado: todo item abaixo aparece na tela. O que **não**
> aparece está listado como lacuna, não presumido.

## 1 · Ações

| Componente | Como aparece | Variantes observadas |
|---|---|---|
| `Button` | Botões de filtro no topo dos cards e da tabela: "Valor ▾", "Colunas ▾", "Todas as etapas ▾", "Todos os atendentes ▾" | Secundário/outline com ícone à direita |
| `IconButton` | `+` no card "Total criados"; ícones de gráfico nos demais KPIs; `⋯` em cada linha da tabela | Sutil, sem fundo |
| `PaginationButton` | "Anterior", 1–4, "Próxima" | Ativo / inativo |

**Lacunas:** botão primário (o único azul da tela é link de texto), estados
hover/focus/disabled, botão destrutivo, botão com loading.

## 2 · Formulários

| Componente | Como aparece | Observação |
|---|---|---|
| `Select` | Todos os "▾" da tela são seletores de filtro | Só o estado fechado aparece |

**Lacunas — grandes.** Input, checkbox, radio, textarea, toggle, datepicker,
combobox e todos os estados de erro/validação **não estão nesta tela**.
Formulários vão precisar de outra tela-fonte ou de desenho novo.
Lembrar do padrão G2 ("edição inline: clica no campo e edita") e do E6
(erro não é mensagem solta) em `docs/regras.md`.

## 3 · Navegação

| Componente | Como aparece |
|---|---|
| `Pagination` | Rodapé da tabela: "Mostrando 10 de 37 negócios" + controles |

A **sidebar não está neste frame** — vive em `Sidebar - Navegacao principal`
(119:1761, 256×937) e em `Sidebar` (124:2114). Precisa entrar no lote: os
padrões G3–G7 (grupos colapsáveis, favoritos, colapsar inteira, breadcrumb de
2 níveis, canto superior direito reservado, busca com atalhos) são todos de
navegação e estão entre os mais desejados pelo time.

**Lacunas:** breadcrumb, busca com atalhos, tabs (proibidas como forma de
crescer — anti-referência nº 11), header/topbar.

## 4 · Exibição de dados — a categoria mais densa da tela

| Componente | Como aparece | Anatomia observada |
|---|---|---|
| `StatCard` (KPI) | 5 no topo: Total criados / ganhos / perdidos / em aberto / negócios | Rótulo + ícone de ação · valor grande (`text/display` ou `text/metric`) · badge de contagem ("37 negócios") |
| `BarChart` | "Dados diários", valor por negócio | **Com eixo Y (R$) e eixo X (datas)** |
| `DonutChart` | "Percentual por atendente" | Rosca com valor central (100.0%) + legenda em lista com % à direita |
| `Table` | 37 negócios: Lead · Produto · Atividades · Atendente · Etapa · Dados · ações | Header cinza · linhas com múltiplas informações empilhadas · `⋯` por linha |
| `Tag` / `Badge` | "Frio", "sinal", "+1" sob o nome do lead | Neutra, cantos suaves, com padrão de excedente ("+1") |
| `ProgressBar` | Coluna "Etapa": barra + rótulo + tempo | Azul `Primary` sobre trilho claro |
| `Avatar` | Lista de atendentes: círculo com inicial | Com cor de fundo por pessoa |
| `ListItem` | "Atendentes com mais vendas": avatar + nome + e-mail + 3 métricas | Linha densa, métricas rotuladas à direita |
| `EmptyState` | "Produtos mais vendidos": ícone + "Não há dados" + explicação | Centralizado no card |
| `Card` | Contêiner de todos os blocos acima | Borda sutil, fundo claro, raio contido |

## 5 · Feedback e sobreposições

| Componente | Como aparece |
|---|---|
| `EmptyState` | Único presente (ver acima) |

**Lacunas — a categoria inteira, essencialmente.** Modal, drawer, toast,
tooltip, alerta e skeleton de loading não aparecem nesta tela.

Dois são obrigatórios por regra, não por gosto:
- **`Tooltip`** — a regra E1 exige tooltip em todo texto truncado, e a tabela
  desta tela é cheia de texto que vai truncar
- **`Drawer`** — é o padrão G1 mais desejado ("drawer lateral do registro,
  abre fino à direita ou em tela cheia, fecha no X")

## Contradição a resolver no gate

**Os gráficos desta tela contrariam a direção declarada.**

| O que o time disse | O que a tela faz |
|---|---|
| Gosta: *"gráfico minimalista: sem eixo, legenda embaixo, valor no hover"* | Barras **com** eixo Y e eixo X |
| Não gosta: *"gráfico gastando espaço com eixo e legenda"* | Rosca **com** legenda lateral completa |

Não vou escolher por você. Ou a tela é anterior às anti-referências e precisa
ser atualizada, ou a preferência tem exceção para o dashboard. **Decisão sua**
— e ela muda o desenho de dois componentes.

## Observação de prontidão do Figma

A página tem **18 frames chamados apenas `Breakpoint // Desktop`** e formas
nomeadas `Rectangle 4`…`Rectangle 8`. O checklist
(`docs/processo/figma-checklist.md`) exige nomes semânticos — "zero Frame 427". Do jeito
que está, eu não consigo dizer qual frame é qual tela sem abrir um a um.
Renomear é barato agora e caro depois.

Também há imagens de referência coladas na página (`Twenty Web Screens`,
`WhatsApp Image …`). Não atrapalham, mas precisam ficar fora da geração.

## Proposta de recorte do lote 1

Fundações primeiro (tokens de `docs/02-design-system.md` + tipografia Geist), e
então, por ordem de dependência:

1. `Card` · `Tag` · `Avatar` · `Button` · `IconButton` — primitivos que tudo usa
2. `StatCard` · `EmptyState` · `ProgressBar` · `ListItem`
3. `Table` + `Pagination` — o mais caro, e o que mais devolve valor
4. `Tooltip` — destrava a regra E1 na tabela
5. `Select`
6. Sidebar (G3–G7) — se entrar, é lote próprio: são 5 padrões desejados

Gráficos ficam fora até a contradição acima ser resolvida.

**Para aprovar:** confirme a home, resolva a contradição dos gráficos e diga se
a sidebar entra no lote 1 ou vira lote 2.
