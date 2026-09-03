# DataCrazy — Tokens de estado no tema escuro (proposta, não aplicada)

## O problema

`scripts/check-temas.mjs` reprova hoje com **8 variáveis repetindo valor entre
Claro e Escuro**: `success`, `destructive`, `warning`, `info` e os quatro
`-hover` correspondentes.

Isso é a regra **E4** sendo violada dentro do próprio design system — e E4 nasceu
do ticket **#80174**, em que 13 de ~30 variáveis do CRM tinham valor idêntico nos
dois modos e o título ficava praticamente invisível no escuro. O DS reintroduziu
o mesmo defeito que existe para eliminar.

Consequência prática: sobre `background` no escuro (`#1C1C25`), um `success` de
luminosidade 31% não tem contraste. As seis variantes do `Badge` que usam cor de
estado ficam ilegíveis.

## Por que isto ainda não foi aplicado

**O Figma é a origem; `globals.css` é espelho.** Editar o valor aqui e não lá
significa que a próxima exportação desfaz a correção — e pior, cria divergência
silenciosa entre o arquivo e o código. A ponte de escrita do Figma estava fora do
ar quando isto foi escrito, então a proposta ficou pronta em vez de aplicada.

## A derivação

Espelha exatamente a relação que **já vale para o `primary`**, e que foi aprovada
quando o tema escuro foi montado:

- no **Claro**, o hover **escurece** — `primary` vai de `base/blue/500` (60,0%) para `base/blue/600` (47,8%)
- no **Escuro**, o hover **clareia** — `primary` vai de `base/blue/400` (67,5%) para `base/blue/300` (75,1%)

Aplicado aos estados: **matiz preservado ao centésimo**, luminosidade do default
em 60% e do hover em 70% — os mesmos ~10 pontos de distância entre `blue/400` e
`blue/300`. A saturação é contida por família, para não virar neon sobre fundo
escuro.

| Token | Claro (existe) | Escuro (proposto) |
|---|---|---|
| `success` | `#267952` · 151.8 52.2% 31.2% | `#6BC79C` · 151.8 45.0% 60.0% |
| `success-hover` | `#294F3D` · 151.6 31.7% 23.5% | `#90D5B4` · 151.6 45.0% 70.0% |
| `destructive` | `#C6323C` · 355.9 59.7% 48.6% | `#D16169` · 355.9 55.0% 60.0% |
| `destructive-hover` | `#753237` · 355.5 40.1% 32.7% | `#DD888F` · 355.5 55.0% 70.0% |
| `warning` | `#975E1D` · 32.0 67.8% 35.3% | `#D69D5C` · 32.0 60.0% 60.0% |
| `warning-hover` | `#5E4221` · 32.5 48.0% 24.9% | `#E0B685` · 32.5 60.0% 70.0% |
| `info` | `#25719D` · 202.0 61.9% 38.0% | `#61A8D1` · 202.0 55.0% 60.0% |
| `info-hover` | `#274B60` · 202.1 42.2% 26.5% | `#88BEDD` · 202.1 55.0% 70.0% |

## Como aplicar

1. Reabrir o plugin **Figma Desktop Bridge** no arquivo `DESIGN - DATA CRAZY`.
2. Aplicar `tokens/estados-escuro.json` com `figma_setup_design_tokens`
   (ou `figma_batch_update_variables` no modo `Escuro`, id `253:0`).
3. Reexportar `app/globals.css`.
4. Rodar `npm run check:temas` — precisa passar.

## O que fica em aberto mesmo depois disso

A luminosidade de 60/70% é uma **escolha**, não uma medição: nenhuma tela no tema
escuro usa cor de estado ainda, então não há valor no arquivo de onde tirá-la.
Quando existir uma tela escura com tag de estado desenhada, o valor de lá substitui
este — e a regra passa a ser observação, não derivação.
