# Componente: KpiCard

## Responsabilidade

Exibe uma métrica única — número em destaque, rótulo do que ele mede e uma
legenda de apoio.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `269:53` (component set "KPI Card") · Lote: `1` ·
Última verificação: **38/38 campos batendo** por medição de valor computado
(`scripts/medir-kpi-card.mjs`), em 2026-09-04 contra a revisão de recuo 16 /
gap 12 do arquivo.

Diff de pixels **não medido**: exportar o PNG do frame depende da ponte de
escrita do Figma (`figma-console`), que estava fora do ar. A geometria e a cor
foram conferidas campo a campo, que é a metade objetiva do protocolo; a metade
por imagem fica pendente.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `title` | `string` | — | sim | Rótulo da métrica. Trunca com tooltip nativo. |
| `value` | `string` | — | sim | O número, já formatado pelo chamador. |
| `caption` | `string` | — | não | Legenda de apoio. Sem ela o chip não renderiza. |
| `trend` | `"neutral" \| "up" \| "down"` | `"neutral"` | não | Qual glifo ocupa o slot. Não muda cor. |
| `variant` | `"fill" \| "outline"` | `"fill"` | não | Superfície cheia ou só contorno. |
| `icon` | `React.ReactNode` | glifo do `trend` | não | Substitui o conteúdo do slot. |

O eixo `theme` do Figma **não virou prop**: os dois temas saem dos mesmos
tokens sob `.dark`.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `fill` | Padrão. A faixa de métricas no topo do dashboard. |
| `outline` | Métrica secundária ou desabilitada, sem peso de superfície. |
| `trend="neutral"` | Não há comparação com período anterior. |
| `trend="up"` | Variação positiva. |
| `trend="down"` | Variação negativa. |

## Estados

<!-- kfe:estados:start -->
_Sem estado registrado — o componente não tem estados de interação._
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher. Errado aqui = errado no registro: corrija
lá (fw-doc C6) e rode `kfe-docs index`.

O KpiCard não tem nenhum: é leitura, não controle. O Figma não desenhou estado
de interação e o [interactions.md](../processo/interactions.md) não declara
nenhum. Se um dia o card virar link para o funil filtrado, passa a ser
interativo e aí ganha `focus-visible` (I4) e alvo de toque (I15).

## Tokens consumidos

`card` · `accent` · `background` · `primary` · `foreground` ·
`muted-foreground` · `subtle-foreground` · `radius/md` ·
`text/heading-4` · `text/display` · `text/label-lg`

## Composição

Usa: nenhum componente do DS — é primitivo ·
Usado por: faixa de métricas do dashboard (tela ainda não construída)

## Exemplo de uso

```tsx
<div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
  <KpiCard title="Total ganhos" value="R$ 1,20K" caption="12 negócios" trend="up" />
  <KpiCard title="Total perdidos" value="R$ 480,00" caption="5 negócios" trend="down" />
</div>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | Não se aplica — o componente não é focável |
| Papel/rótulo | Texto real, na ordem título → valor → legenda. O slot é `aria-hidden`: o glifo é decorativo e não acrescenta informação que o texto já não dê |
| Alvo de toque | Não se aplica — não é interativo |
| Movimento | Não há transição |
| Contraste | `muted-foreground` sobre `card` = 4,6:1 no claro. Ver a divergência aberta abaixo sobre o Outline no escuro |

## Divergências abertas (para o gate)

1. **Cor do trend.** A descrição do componente no Figma promete `success` para
   up e `destructive` para down; os glifos do arquivo estão os dois em
   `primary`. O código segue o arquivo — decisão do humano em 2026-09-03. Ou o
   arquivo se corrige, ou a descrição.
2. **Outline foi REDESENHADO no Figma em 2026-09-04 e o código ainda não
   acompanha.** Deixou de ser o Fill sem preenchimento e virou outro card:
   traço de 2px, pílula de percentual no header (`+12,5%` sobre `card`), linha
   divisória, e um rodapé de duas linhas (chip + legenda em
   `subtle-foreground`). Altura 172. Continua desenhado para uma tendência só —
   agora `Up`, antes `Down`. Implementar isso muda a API do componente: entram
   props de variação, de rodapé e de legenda. **Aguardando decisão.**
3. ~~Outline some no tema escuro.~~ **Resolvido em 2026-09-04** pela mudança de
   token: `card` no escuro passou de `#1E1E24` para `#25252D` e `background` de
   `#1C1C25` para `#16161D`. O contraste entre os dois deixou de ser nulo e a
   borda do Outline aparece.
