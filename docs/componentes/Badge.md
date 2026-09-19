# Componente: Badge

## Responsabilidade

Selo curto de status — a cor fica na borda e no texto, nunca preenchendo a
superfície.

## Família

`feedback` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Sem node registrado: nasceu em 2026-09-01 com o site, das seis cores de estado
do arquivo, antes do registro existir. Saiu do showcase em 2026-09-15
(ADR-012): a página `/data-display/tag` tomou o lugar, e o `Badge` continua
servindo a [DataTable](DataTable.md). Diff de pixels não medido.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `variant` | `"neutral" \| "primary" \| "success" \| "warning" \| "destructive" \| "info"` | `"neutral"` | não | Ver Variantes. |
| `children` | `ReactNode` | — | sim | O texto do selo. |
| demais | `HTMLAttributes<HTMLSpanElement>` | — | não | Vão para o `<span>`. |

`badgeVariants` é exportado para quem precisa das classes sem o elemento.

## Variantes

| Variante | Borda | Fundo | Texto |
|----------|-------|-------|-------|
| `neutral` | `border` | `background` | `muted-foreground` |
| `primary` | `primary/25` | `accent` | `primary` |
| `success` · `warning` · `destructive` · `info` | cor de estado a 25% | a mesma a 10% | a cor de estado |

Anti-referência nº 3 (regra A2): cor entra em borda e tag, nunca no corpo.

## Estados

<!-- kfe:estados:start -->
_Sem estado registrado — o componente não tem estados de interação._
<!-- kfe:estados:end -->

É leitura: não tem hover, foco nem disabled. Ausência é decisão.

## Tokens consumidos

`border` · `background` · `muted-foreground` · `primary` · `accent` ·
`success` · `warning` · `destructive` · `info` · `radius/md` · `text/label-sm`

## Composição

Usa: nenhum componente do DS — é primitivo ·
Usado por: [DataTable](DataTable.md) (`CelulaLead`, etiquetas). O selo do sino
do [Header](Header.md) e as pílulas do [KpiCard](KpiCard.md) **não** o usam
(AUD-037, AUD-039 — adiados para a remedição).

## Exemplo de uso

```tsx
<Badge variant="success">{t("ganho")}</Badge>
<Badge variant="warning">{t("emNegociacao")}</Badge>
<Badge>{t("semEtapa")}</Badge>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Estado sem depender de cor | O texto diz o estado; a cor só reforça (E7) |
| Contraste | Texto na cor de estado sobre a mesma a 10%: conferir no lote da remedição |
| Texto longo | Não trunca: o selo cresce com o texto |

## Divergências abertas (para o gate)

Nenhuma registrada. Fidelidade ao arquivo nunca medida — entra na remedição.
