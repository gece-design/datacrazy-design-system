# Componente: Checkbox

## Responsabilidade

Marcar ou desmarcar uma opção independente, inclusive o "parte marcada" de
quem seleciona um grupo.

## Quando usar

- **Use** para marcar várias opções independentes, confirmar um aceite e selecionar linhas da Table.
- **Não use** para ligar algo que passa a valer na hora: é `Switch`.
- **Não use** para escolher uma entre poucas (`RadioGroup`) ou uma entre muitas (`Select`).
- **Não use** empilhado em grupos num modal para filtrar uma lista: é `BarraDeFiltros`.
- **Não use** para várias escolhas numa lista longa: é `ComboboxMultiplo`.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `547:28` (component set "Checkbox", canvas `↳ Form controls`) · Lote: `2`
(o roadmap também põe Radio Group e Switch no lote 3; os três vieram juntos do
mesmo canvas) · Última verificação: **2026-09-14**, medição de valor computado
contra o arquivo — caixa, traço, raio, fundo, cor do rótulo, gap, fonte e
entrelinha nos 4 estados × 2 temas, em densidade 1× e 2×. Zero divergência.

Diff de pixels **não medido**, pelo mesmo motivo dos lotes anteriores: a ponte
de exportação do Figma (`figma-console`) não estava de pé.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `children` | `ReactNode` | — | não | Rótulo, já traduzido. Sem ele, `aria-label` é obrigatório. |
| `indeterminado` | `boolean` | `false` | não | Liga `input.indeterminate`. Só existe como propriedade de DOM. |
| `checked` / `defaultChecked` | `boolean` | — | não | Controlado ou solto — os dois funcionam. |
| `onChange` | `ChangeEventHandler` | — | não | Evento nativo: `e.target.checked`. |
| `disabled`, `name`, `value`, `aria-*` | nativos | — | não | Repassados ao `<input>`. |

É um `<input type="checkbox">` real, escondido só da vista. A caixa desenhada
lê o estado por CSS (`peer-*`), sem estado próprio.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| com rótulo | Formulário. O `<label>` torna o texto clicável. |
| sem rótulo | Seleção de linha na tabela. `aria-label` diz qual linha. |
| `indeterminado` | Pai de um grupo com só parte dos filhos marcada ("Colunas ▾"). |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `ring-input-border-hover (desmarcado) · bg-primary-hover (marcado)` | banco | I1 |
| focus | `outline outline-2 outline-offset-2 outline-ring na caixa (peer-focus-visible)` | banco | D6 |
| marcado | `bg-primary + Check 12px em primary-foreground` | figma | — |
| indeterminado | `input.indeterminate + fundo do marcado + Minus 12px` | inferido | marcado (mesmo fundo e glifo na mesma medida) |
| disabled | `bg-input-bg-disabled · marcado bg-subtle-foreground · rotulo input-text-disabled` | figma | — |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

Desmarcado, marcado e os dois desabilitados são desenho do arquivo. O
indeterminado não está desenhado: segue o marcado com o glifo `Minus`.

## Tokens consumidos

`input/bg` · `input/border` · `input/border-hover` · `input/bg-disabled` ·
`input/text-disabled` · `primary` · `primary-hover` · `primary-foreground` ·
`subtle-foreground` · `foreground` · `ring` · `radius/xs` · `text/body-md`

## Composição

Usa: glifos `Check` e `Minus` do Phosphor (o check do arquivo é o `Check`
regular, mesmo path) ·
Usado por: nenhuma tela ainda. Destino: seleção de linha da Data Table (lote 7,
junto do Bulk Action Bar) e a lista "Colunas ▾".

## Exemplo de uso

```tsx
const marcadas = colunas.filter((c) => visiveis.includes(c));
const todas = marcadas.length === colunas.length;

<Checkbox
  checked={todas}
  indeterminado={marcadas.length > 0 && !todas}
  onChange={() => setVisiveis(todas ? [] : colunas)}
>
  {t("todasAsColunas")}
</Checkbox>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | Outline de 2px com respiro transparente (D6), na caixa, via `peer-focus-visible` |
| Papel/rótulo | Input nativo. O indeterminado é anunciado como "misto" pelo navegador, sem `aria-checked` manual |
| Teclado | Espaço marca — nativo |
| Alvo de toque | 18px de caixa; o `<label>` estende para o texto. Abaixo dos 44px da I15 — ver divergência 4 |
| Movimento | Só `transition` de cor e sombra |
| Contraste | Ver divergências 1 e 2 |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-098, AUD-099, AUD-100, AUD-101, AUD-102 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
