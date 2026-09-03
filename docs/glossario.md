# DataCrazy — Glossário canônico — **v2**

> **v1 → v2:** a v1 propôs um conjunto de tokens semânticos inventado por mim
> (`surface`, `accent`, `text-muted`…). Em cenário C isso é erro de método: o
> conjunto canônico **se minera do código existente** e se aprova em gate
> (fw-onboard, modo C). Removido. O que fica aqui é o que tem evidência.

Um conceito = um nome. Idioma: **EN** para código, tokens e componentes
(alinhado a Tailwind/shadcn e ao que já existe no `globals.css`).
Documentação e conversa: PT.

## Tokens que EXISTEM hoje (evidência: `globals.css` + `tailwind.config.ts`)

Citados no PRD com evidência. Valores em HSL. **Ainda não auditados por mim.**

| Variável | Observação |
|---|---|
| `--primary` | entre as 13 com valor idêntico em `:root` e `.dark` |
| `--border` | idem |
| `--title` | idem — `240 10% 4%` sobre `--background` `0 0% 7%` no escuro |
| `--subtitle` | idem |
| `--red` | idem — nome **literal de cor**, candidato a renomear para semântico |
| `--muted` | — |
| `--destructive` | — |
| `--background` | branco no claro, `0 0% 7%` no escuro |

> São ~30 variáveis no total; o PDF nomeia estas. A lista completa e a razão
> token/valor-solto saem da mineração (fw-onboard C), não daqui.

## Conjunto canônico de tokens

**PENDENTE — saída da fw-onboard (modo C).** Processo obrigatório:
minerar paletas por frequência, escalas reais de tipo/espaçamento, raios e
sombras → propor o **menor conjunto que cobre 90%+ do que existe** → gate
humano → criar as variables no Figma. Nada de nome inventado antes disso.

Regra que já vale para o conjunto novo: **token de cor não carrega nome de
cor.** `--red` é o contraexemplo que já está no código.

## Componentes do ciclo 1

| Nome canônico | O que é | Nunca chamar de |
|---|---|---|
| `Button` | Ação primária do usuário | CTA, Btn, Action |
| `Input` | Campo de texto de uma linha | TextField, Textbox |
| `Select` | Escolha de uma opção numa lista | Dropdown, Combo |
| `Checkbox` | Alternância booleana | Check, Tick |
| `Card` | Contêiner de conteúdo agrupado | Box, Panel, Tile |
| `Modal` | Camada sobreposta que exige interação | Dialog, Popup, Overlay |
| `Table` | Dados tabulares | Grid, DataGrid, Listagem |

> Nomes a confirmar contra o que já existe no repo: se o código já chama
> `Dialog` (convenção Radix/shadcn), o nome existente vence o meu — renomear
> produto inteiro por gosto é retrabalho, não padronização.

## Vocabulário do domínio (do produto, evidência: PRD + landing)

| Termo | O que é |
|---|---|
| Lead | Contato em potencial de compra |
| Negócio | Oportunidade comercial (card do funil) |
| Pipeline / Funil | Sequência de etapas comerciais |
| Kanban | Visualização das etapas do pipeline |
| Multiatendimento | Atendimento unificado (WhatsApp, Instagram, Facebook) |
| Chat | Conversa dentro do multiatendimento |
| Automação | Fluxo disparado por regra de negócio |
| Crazy IA | Camada de IA: intenção de compra, sentimento, comportamento |
| BI Interno | Análise de funil, LTV, CAC, taxa de conversão |

> PT no domínio e EN no código convivem: `lead` e `deal` no código, "lead" e
> "negócio" na conversa e na UI traduzida. O que **não** pode é o mesmo
> conceito com dois nomes no mesmo lado.

## Vocabulário do processo (kit)

| Termo | Significado aqui |
|---|---|
| Golden screen | Tela de referência versionada que trava regressão do pipeline |
| Diff | % de pixels divergentes entre render e Figma (aceite ≤ 1%) |
| Lote | Conjunto de componentes gerado e aprovado num gate |
| Showcase | Página com todo componente em todas as variantes |
| Calibração | Ledger que converte divergência recorrente em regra |
