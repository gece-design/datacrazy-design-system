# Componente: Rating

## Responsabilidade

Avaliação de 0 a 10 estrelas (o máximo é prop): editável por clique e setas,
ou só leitura. Mostra a nota também em número.

## Quando usar

- **Use** para nota de 0 a N num campo do lead (score), editável ou só leitura.
- **Não use** para progresso de etapa: é `CelulaProgresso`.
- **Não use** para porcentagem ou meta: é número, no `KpiCard`.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `590:3000` (Field do canvas do drawer) · Lote: `3` · Estrela cheia em
`primary` e vazia em `base/blue/300`, que é o que o arquivo **pinta**; a
descrição do componente no Figma promete `foreground` e `subtle-foreground`
(divergência migrada de Input.md). Máximo 10 por decisão do humano
(2026-09-17). Diff de pixels não medido.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `rotulo` | `string` | — | sim | Rótulo do cartão e nome do grupo. |
| `valor` | `number` | — | sim | De 0 até `max`. |
| `max` | `number` | `10` | não | Quantas estrelas. Acima de seis elas caem de 20 para 16px e o respiro de 8 para 4 — senão não cabem na coluna de 232px do drawer. |
| `aoMudar` | `(valor: number) => void` | — | não | Com ela é um grupo de rádio; sem ela, só leitura. |
| `className` | `string` | — | não | — |

## Variantes

| Variante | Quando |
|----------|--------|
| editável | Com `aoMudar`: score do lead |
| só leitura | Sem `aoMudar`: satisfação já registrada |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `prévia da nota (estrelas até a do cursor em primary/70) + scale-125 e -translate-y-px sob motion-safe` | humano | — |
| active | `scale-90 sob motion-safe — parte da animação da estrela` | humano | — |
| focus | `outline outline-2 outline-offset-1 outline-ring` | banco | D6 |
| marcado | `estrela cheia weight=fill em primary; vazia regular em base/blue/300` | figma | — |
<!-- kfe:estados:end -->

## Tokens consumidos

`primary` · `primary/70` (prévia) · `primary/25` (brilho) · `base/blue/300` ·
`input-label` · `muted-foreground` · `background/50` e `accent` (cartão, via
`blocoDeCampo`) · `ring` · `radius/sm` · `text/label-md`

## Composição

Usa: `blocoDeCampo` do [Input](Input.md) — o mesmo cartão do `CampoEditavel`,
**não** a caixa do Input (ela tinha `overflow-hidden` e cortava a última
estrela em coluna estreita; a fileira quebra de linha em vez de cortar) ·
Usado por: [Drawer](Drawer.md) pelos exemplos.

## Exemplo de uso

```tsx
<Rating rotulo={t("score")} valor={nota} aoMudar={setNota} />
<Rating rotulo={t("satisfacao")} valor={4} max={5} />
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | Editável: `role="radiogroup"` com um `role="radio"` por estrela (`aria-checked`); leitura: `role="img"` com "rótulo: 7 de 10" |
| Teclado | Setas e Home/End mudam a nota e movem o foco; um `tabIndex 0` por vez |
| Foco visível | Outline de 2px (D6) com offset 1 — a fileira é apertada |
| Nota sem contar | `7/10` em número ao lado do rótulo |
| Movimento | Pulo em cascata (`estrela-pop`) e halo (`estrela-brilho`) sob `motion-safe:`; com redução, a nota muda sem animação |
| Alvo de toque | 16–20px, abaixo dos 44 da I15 — adiado para a remedição |

## Divergências abertas (para o gate)

A cor da estrela vazia (arquivo pinta `blue-300`, descrição promete
`subtle-foreground`) está em [../processo/consistencia.json](../processo/consistencia.json),
lote `figma`.
