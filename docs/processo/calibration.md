# Calibração de fidelidade — DataCrazy
## Regras de geração
| # | Situação no Figma | Regra no código | Origem |
|---|-------------------|-----------------|--------|
| G1 | line-height em px | leading-[Npx] — nunca leading-* nomeado (arredonda) | AlumyPlay |
| G2 | letter-spacing em % | tracking-[N em]: converta % → em (÷100) — nunca tracking-wide aproximado | AlumyPlay |
| G3 | Fill container / Hug | Fill → w-full ou flex-1 conforme o eixo; Hug → w-fit — nunca largura fixa "que coube" | kit |
| G4 | Sombra multi-camada | shadow-[...] custom com TODAS as camadas — nunca shadow-md "parecida" | kit |
| G5 | Cor com alpha | token/NN (ex.: bg-base/40) — nunca rgba() solto | AlumyPlay |
| G6 | Gap do auto-layout | gap-* no container — nunca margin nos filhos | kit |
| G7 | Interação hover-only | hover: sempre sob hoverOnlyWhenSupported; definir o equivalente touch na spec | AlumyPlay |

## Regras do DataCrazy (nascem daqui pra frente)

<!-- Toda divergência corrigida 2x vira linha aqui, ANTES de continuar.
     É o que faz o ajuste humano tender a zero ao longo dos lotes.
     Regras genéricas o bastante para qualquer produto sobem para o kit
     (.kfe-kit/calibration-global.md) na retro da etapa 9. -->

| # | Situação | Regra no código | Origem |
|---|----------|-----------------|--------|
| D1 | Escala tipográfica com nomes próprios (`text-body-md`, `text-h2`…) | O `tailwind-merge` precisa ser estendido com esses nomes em `classGroups`. Sem isso ele trata `text-body-md` e `text-muted-foreground` como o mesmo grupo, descarta um, e o componente cai nos 16px do navegador — **em silêncio**. Ver `lib/utils.ts` | Site do DS, 2026-09-01 |
| D3 | Layout da moldura do site de documentação | A moldura (sidebar, header, índice) **não é superfície do produto**: usa as medidas do Figma de referência tal e qual, em classes `.chrome-*` rotuladas em `app/globals.css`. Os tokens do produto ficam só para os componentes. Sem essa separação, ou o site fica errado ou os tokens do CRM ganham valores que existem só para a documentação. **A moldura tem escala de leitura própria** (`.chrome-h1`…`.chrome-caption`), ancorada nos 14px do item da sidebar: os tokens do produto foram calibrados para densidade de CRM (corpo de 12px) e, na coluna de leitura, ficam menores que o próprio menu | Auditoria da sidebar, 2026-09-01 · escala de leitura, 2026-09-04 |
| D4 | Auditar layout contra o Figma | Comparar por **medição dos dois lados** (`get_design_context` no Figma × `getComputedStyle` no render), campo a campo. Geometria pode bater e tipografia, peso, raio e cor divergirem — foi exatamente o caso | Auditoria da sidebar, 2026-09-01 |
| D5 | Conector de árvore em navegação | Não é traço reto: o SVG do Figma é `M0.5 0 V11 C… 5.5 16 H11.5` — vertical, **curva de raio 5**, saída horizontal de 6px. E a vertical termina no **centro do último item**, não no fim do grupo. Em CSS: linha absoluta com `height: calc(100% - 16px)` + por item um box 11×5 com `border-l`, `border-b` e `rounded-bl-[5px]` | Node 255:6522, 2026-09-01 |
| D6 | Anel de foco em componente que pode viver sobre qualquer superfície | Use `outline` com `outline-offset`, **não** `ring` com `ring-offset-*`. O offset do ring é pintado com **cor sólida**: dentro de card, modal ou linha de tabela ele vira um halo da cor errada. O vão do `outline` é transparente e mostra a superfície real, sem o componente precisar saber sobre o que está. Regra curta: **respiro de foco não se pinta, se deixa passar** | Página do Button, 2026-09-01 |
| D7 | Coluna de número que precisa alinhar (KPI, tabela, moeda) | Use `tabular-nums`, **não** `font-mono`. Trocar a família é o código decidindo o que o Figma não decidiu — `text/metric` declara Geist. A Geist tem dígito de largura fixa; a classe só liga o recurso. Mesma família, mesmo peso, colunas alinhadas | Página do Card, 2026-09-01 |
| D8 | Token de cor que existe nos dois temas | Rode `npm run check:temas`. Ele reprova qualquer variável semântica com valor idêntico em `:root` e `.dark` sem intenção declarada — é a regra E4, e é o bug #80174 automatizado. Primitivos (`blue-*`, `neutral-*`) e casos declarados ficam numa lista de exceção explícita, não implícita | Auditoria do próprio DS, 2026-09-01 |
| D9 | Nó do Figma com `stroke` grosso (≥ 8px) em cor de superfície | Não é traço: é respiro do container. Traduza como `border-[Npx] border-<token>` e conte com o `border-box` — o raio interno vira `raio − espessura`, que é o que o Figma desenha. A sidebar tem stroke INSIDE de 16px em `background`: por fora 24px de raio, por dentro 8px, e os 282px de largura já incluem os 16 de cada lado | Sidebar, node 270:15429, 2026-09-03 |
| D10 | Superfície que é cor num tema e gradiente no outro | Tokenize **sempre como gradiente**, inclusive no tema em que é chapada (`linear-gradient(180deg, X 0%, X 100%)`), e aplique com `bg-[image:var(--token)]`. `background-color` e `background-image` são propriedades diferentes: alternar entre as duas obriga a ramificar o componente por tema, que é o que o critério de pronto nº 3 proíbe | Sidebar, `--sidebar-surface`, 2026-09-03 |
| D11 | Variante de tema do Figma que usa uma variável **diferente** da variante clara | Não copie o nome da variável da variante escura: ela foi escolhida pelo valor que tem no modo **Claro** do documento, e o rascunho não usa modes. Leia o valor visual, ache o token que entrega esse valor no modo Escuro, e se não houver um único token que sirva aos dois, crie um token de componente com os dois valores. Nunca `dark:` no componente | Sidebar, `--sidebar-avatar` (B8), 2026-09-03 |
| D12 | Texto que trunca dentro de componente | `truncate` + `title` com o texto inteiro — nunca `overflow: clip` seco, que é o que o Figma desenha. No estado colapsado, o `title` sobe para o elemento raiz, porque vira a única forma de saber o que o ícone significa. É a rede dos tickets #83283, #83274 e #59567 | Sidebar Item, 2026-09-03 |
| D13 | Ícone de controle (caret, chevron, seta) que o Figma pinta em `subtle-foreground` | Suba um degrau para `muted-foreground`. `subtle-foreground` sobre `card` dá **2.4:1** no claro — abaixo dos 3:1 que a WCAG 1.4.11 exige de componente gráfico não textual. Um caret que promete um menu é affordance, não decoração, e o critério de pronto nº 8 vence a fidelidade de tom aqui | Sidebar: caret do usuário e chevron do toggle, 2026-09-03 |
| D14 | Nó do Figma com `stroke` **fino** (1–2px) e padding de auto-layout | O Figma desenha o traço POR DENTRO e o CSS soma POR FORA. Traduzir `padding: 18` + `stroke: 1` como `border p-[18px]` engorda a caixa em 2px por eixo. A regra é **borda + padding = padding do Figma**: `border p-[17px]`. Vale para cada caixa aninhada — no KPI Card o erro somava 4px (2 do card + 2 do chip) e a altura fechava em 152 em vez de 148 | KPI Card, node 269:53, 2026-09-03 |
| D15 | Fileira de cards de métrica (KPI, stat) | Conte em **piso medido**, não em número de colunas. `grid-cols-5` fixo é promessa que a largura não cumpre: meça o conteúdo mais largo (`R$ 480,00` em 26/600 = 123px), some o traço e o recuo do card (36px) e use `repeat(auto-fit, minmax(<piso>px, 1fr))`. Quem decide quantas colunas cabem é a largura real — cinco no dashboard, quatro na coluna de leitura, uma no celular — e nenhum breakpoint precisa ser mantido à mão. O componente ainda leva `min-w-0` + `truncate`/`title` como rede: grade errada não pode virar número sangrando para fora do card | KPI Card, fileira "Em grade", 2026-09-04 |
| D16 | Coluna que só tem conteúdo acima de um breakpoint (índice, trilho, painel lateral) | A coluna precisa **deixar de existir** onde o conteúdo dela não aparece, não só esconder o conteúdo. Uma coluna com largura fixa e filho `hidden xl:block` continua reservando a largura e o `gap` em toda tela: no site do DS eram 220px + 64px de buraco entre `lg` e `xl`, e no celular a coluna de leitura ficava com uma palavra por linha. Ponha o `hidden`/`xl:block` **na coluna**, não no filho — em flex, item com `display:none` também não gera `gap` | `components/ds/colunas.tsx`, 2026-09-04 |
| D17 | Cartão em par lado a lado com `flex-1` e texto truncado | `flex-1` sozinho não encolhe abaixo do conteúdo: falta `min-w-0`, e sem ele o `truncate` de dentro nunca dispara e o par vaza a tela. No celular o par ainda vira pilha — dois cartões em 358px sobram ~170px cada, onde só cabe a seta | Paginação do site, 2026-09-04 |
| D2 | Fonte via `next/font` | Verificar `font-family` computado com Playwright antes de qualquer medição. `GeistSans` esperado; qualquer fallback invalida o diff | `docs/processo/fonts-checklist.md` |

## Divergências recorrentes em observação

**D1 foi encontrada por medição, não a olho.** O item da sidebar renderizava em
16px/24px em vez de 12px/17px, e visualmente não gritava. Só apareceu ao ler o
`getComputedStyle` com Playwright. Fica a regra: **conferir tamanho computado,
não confiar na aparência** — a classe pode estar no JSX e não chegar no CSS.

Ferramentas no repo: `scripts/medir.mjs` (estilos computados) e
`scripts/shot.mjs` (screenshot nos dois temas, com checagem anti-fallback de fonte).

**Cache do `.next` esconde token novo.** Cor ou sombra acrescentada em
`tailwind.config.ts` não aparece no CSS até o `.next` ser apagado e o dev server
reiniciado — o PostCSS não observa o config. O sintoma engana: a classe está no
JSX, o elemento renderiza, e a cor simplesmente não é a esperada. Antes de
investigar o componente, confirme que a utility existe:
`curl -s localhost:4321/_next/static/css/app/layout.css | grep <classe>`.

## Herdado com ressalva

As regras G1–G7 acima vêm do kit e valem para qualquer produto web. Duas
merecem atenção específica aqui:

- **G5 (cor com alpha)** — o `globals.css` do DataCrazy usa HSL em variáveis.
  A forma `token/NN` do Tailwind funciona sobre isso, mas só se a variável
  guardar os canais sem `hsl()` ao redor. Confirmar na mineração.
- **G7 (hover)** — o CRM tem app mobile e tickets de a11y móvel (#62306,
  #61699). O equivalente de toque não é detalhe: é onde a dor já foi
  registrada.
