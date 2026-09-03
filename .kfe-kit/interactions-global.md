# Interações GLOBAIS do kit (banco de regras herdado por todo produto)
<!-- Camada 2 da verdade do KFE. O Figma manda no ESTADO DE REPOUSO (camada 1,
     medida por pixel-diff). Estados de interação NÃO precisam ser desenhados:
     são DECLARADOS em docs/processo/interactions.md e DERIVADOS por estas regras.
     A fw-install copia este arquivo para docs/processo/interactions.md do produto no
     dia 1 (seção "Regras herdadas"). Regras específicas de um produto ficam
     lá; as genéricas sobem pra cá na retro (fw-github). Mesmo mecanismo da
     calibration-global.md — aprendizado composto entre projetos. -->

## Cadeia de precedência (ordem obrigatória, para CADA estado de CADA componente)

| Ordem | Fonte | Marcação no registro | Vale como verdade? |
|---|---|---|---|
| 1 | Variante desenhada no Figma | `figma` | Sim — pixel-diff ≤ 1,0% |
| 2 | Declaração em `docs/processo/interactions.md` | `declarado` | Sim — implementar literal |
| 3 | Regra deste banco ou local do produto | `banco` | Sim — aplicar a regra |
| 4 | Inferência por analogia no registro de componentes | `inferido` | Provisória — vai ao gate |
| 5 | Nada acima resolve | — | BLOQUEIO: pergunte ao humano (`humano`) |

Regra dura da inferência (nível 4): **só existe inferência com precedente
citável**. A saída obrigatória é "estado X do componente Y = igual ao estado
X do componente Z (mesma família, lote N)". Sem componente Z, não é
inferência — é chute, e chute é BLOQUEIO. Isso mantém o "nunca inventar
valor" intacto: a IA copia o que já foi aprovado, nunca improvisa um valor.

Toda decisão nível 4 entra na lista "Decisões inferidas" do gate da UI. O
humano aprova em bloco ou corrige. Aprovada 2x para a mesma família → vira
regra local em `docs/processo/interactions.md`; genérica → sobe pra cá na retro.

## Famílias de componentes (define quem é "vizinho" para a analogia)

| Família | Componentes típicos |
|---|---|
| `acao` | Button, IconButton, Link, FAB, MenuTrigger |
| `entrada` | Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, Upload |
| `navegacao` | Tab, NavItem, MenuItem, Breadcrumb, Pagination, Stepper |
| `superficie` | Card, ListItem, Row, Accordion, Panel, Tile |
| `feedback` | Toast, Alert, Badge, Tooltip, Progress, Skeleton |
| `overlay` | Modal, Drawer, Popover, Dropdown, Sheet |
| `midia` | Avatar, Thumbnail, Player, Carousel, Gallery |

A analogia SÓ atravessa componentes da mesma família. Botão não herda de
card. Família nova sem nenhum precedente → nível 5 (pergunte).

## Regras de derivação
| # | Estado / situação | Regra no código | Origem |
|---|---|---|---|
| I1 | `hover` em elemento com fundo tokenizado | Sobe 1 degrau na escala do MESMO token (`brand/500` → `brand/600`); nunca cor nova fora da escala | kit |
| I2 | `hover` em elemento sem fundo (ghost/link) | Aplica a superfície de menor elevação da escala (`surface/subtle`); no link, `underline` — nunca mudar peso da fonte (causa reflow) | kit |
| I3 | `active`/`pressed` | Um degrau ALÉM do hover na mesma escala + zero deslocamento de layout (nada de `translate` que mova vizinhos) | kit |
| I4 | `focus-visible` | Ring do token de foco, 2px, offset 2px, SEMPRE visível no teclado; nunca `outline: none` sem substituto. Regra de a11y — não é opcional nem inferível | kit |
| I5 | `disabled` | Token de opacidade `disabled` + `cursor: not-allowed` + `pointer-events` mantidos para tooltip explicativo; nunca cinza inventado fora dos tokens | kit |
| I6 | `loading` | Preserva a caixa do estado de repouso (mesma largura/altura — zero salto de layout); conteúdo trocado por spinner/skeleton do DS; `aria-busy` | kit |
| I7 | `empty` | Componente de vazio do DS com a mesma caixa mínima do estado com dado; texto vem da spec — nunca escreva copy nova aqui | kit |
| I8 | `error` | Token semântico de erro (borda + texto de apoio); a mensagem vem da spec/regras — nunca invente texto de erro | kit |
| I9 | `selected`/`checked` | Estado persistente ≠ hover: precisa de sinal que sobreviva ao mouse sair (fundo, borda ou marca), nunca só cor de texto | kit |
| I10 | Duração da transição | `fast` 120ms (cor/opacidade) · `base` 200ms (tamanho/posição) · `slow` 320ms (entrada/saída de overlay); easing `ease-out` na entrada, `ease-in` na saída | kit |
| I11 | Transição — o que anima | Só `color`, `background`, `border`, `opacity`, `transform`. Nunca animar `width`/`height`/`top`/`left` (jank) | kit |
| I12 | `prefers-reduced-motion` | Todo motion tem versão reduzida: transição vira 0ms, animação contínua para. Obrigatório, não inferível | kit |
| I13 | Interação só-hover (herda G7 da calibração) | `hover:` sempre sob `hoverOnlyWhenSupported`; todo estado hover exige o equivalente de toque declarado (`active` ou revelado por padrão) | AlumyPlay |
| I14 | Ordem de aplicação no código | `disabled` > `loading` > `selected` > `active` > `hover` > `focus-visible` (foco convive com todos e nunca é suprimido) | kit |
| I15 | Alvo de toque | Qualquer elemento interativo com área mínima de toque de 44×44 CSS px, ainda que o visual do Figma seja menor (padding invisível) | kit |
