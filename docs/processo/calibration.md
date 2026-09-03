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
| D3 | Layout da moldura do site de documentação | A moldura (sidebar, header, índice) **não é superfície do produto**: usa as medidas do Figma de referência tal e qual, em classes `.chrome-*` rotuladas em `app/globals.css`. Os tokens do produto ficam só para os componentes. Sem essa separação, ou o site fica errado ou os tokens do CRM ganham valores que existem só para a documentação | Auditoria da sidebar, 2026-09-01 |
| D4 | Auditar layout contra o Figma | Comparar por **medição dos dois lados** (`get_design_context` no Figma × `getComputedStyle` no render), campo a campo. Geometria pode bater e tipografia, peso, raio e cor divergirem — foi exatamente o caso | Auditoria da sidebar, 2026-09-01 |
| D5 | Conector de árvore em navegação | Não é traço reto: o SVG do Figma é `M0.5 0 V11 C… 5.5 16 H11.5` — vertical, **curva de raio 5**, saída horizontal de 6px. E a vertical termina no **centro do último item**, não no fim do grupo. Em CSS: linha absoluta com `height: calc(100% - 16px)` + por item um box 11×5 com `border-l`, `border-b` e `rounded-bl-[5px]` | Node 255:6522, 2026-09-01 |
| D6 | Anel de foco em componente que pode viver sobre qualquer superfície | Use `outline` com `outline-offset`, **não** `ring` com `ring-offset-*`. O offset do ring é pintado com **cor sólida**: dentro de card, modal ou linha de tabela ele vira um halo da cor errada. O vão do `outline` é transparente e mostra a superfície real, sem o componente precisar saber sobre o que está. Regra curta: **respiro de foco não se pinta, se deixa passar** | Página do Button, 2026-09-01 |
| D7 | Coluna de número que precisa alinhar (KPI, tabela, moeda) | Use `tabular-nums`, **não** `font-mono`. Trocar a família é o código decidindo o que o Figma não decidiu — `text/metric` declara Geist. A Geist tem dígito de largura fixa; a classe só liga o recurso. Mesma família, mesmo peso, colunas alinhadas | Página do Card, 2026-09-01 |
| D8 | Token de cor que existe nos dois temas | Rode `npm run check:temas`. Ele reprova qualquer variável semântica com valor idêntico em `:root` e `.dark` sem intenção declarada — é a regra E4, e é o bug #80174 automatizado. Primitivos (`blue-*`, `neutral-*`) e casos declarados ficam numa lista de exceção explícita, não implícita | Auditoria do próprio DS, 2026-09-01 |
| D2 | Fonte via `next/font` | Verificar `font-family` computado com Playwright antes de qualquer medição. `GeistSans` esperado; qualquer fallback invalida o diff | `docs/processo/fonts-checklist.md` |

## Divergências recorrentes em observação

**D1 foi encontrada por medição, não a olho.** O item da sidebar renderizava em
16px/24px em vez de 12px/17px, e visualmente não gritava. Só apareceu ao ler o
`getComputedStyle` com Playwright. Fica a regra: **conferir tamanho computado,
não confiar na aparência** — a classe pode estar no JSX e não chegar no CSS.

Ferramentas no repo: `scripts/medir.mjs` (estilos computados) e
`scripts/shot.mjs` (screenshot nos dois temas, com checagem anti-fallback de fonte).

## Herdado com ressalva

As regras G1–G7 acima vêm do kit e valem para qualquer produto web. Duas
merecem atenção específica aqui:

- **G5 (cor com alpha)** — o `globals.css` do DataCrazy usa HSL em variáveis.
  A forma `token/NN` do Tailwind funciona sobre isso, mas só se a variável
  guardar os canais sem `hsl()` ao redor. Confirmar na mineração.
- **G7 (hover)** — o CRM tem app mobile e tickets de a11y móvel (#62306,
  #61699). O equivalente de toque não é detalhe: é onde a dor já foi
  registrada.
