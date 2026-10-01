# Componente: KpiCard

## Responsabilidade

Exibe uma métrica única — número em destaque, rótulo do que ele mede e uma
legenda de apoio.

## Quando usar

- **Use** para uma métrica em destaque no topo do dashboard. `fill` quando é número e contagem; `outline` quando há variação e o que ela significa.
- **Não use** para lista ou gráfico: é `Card`.
- **Não use** mais de quatro numa fileira: a grade é `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`.
- **Não use** `trend` como enfeite: só quando o dado tem direção de verdade.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `269:53` (component set "KPI Card") · Lote: `1` ·
Última verificação: **40/40 campos batendo** por medição de valor computado
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
| `trend` | `"neutral" \| "up" \| "down"` | `"neutral"` | não | Qual glifo aparece. Não muda cor. |
| `variant` | `"fill" \| "outline"` | `"fill"` | não | Qual das duas leituras. |
| `caption` | `string` | — | não | **Fill.** Contagem no chip abaixo do número. |
| `icon` | `React.ReactNode` | glifo do `trend` | não | **Fill.** Substitui o conteúdo do slot. |
| `delta` | `string` | — | não | **Outline.** A variação, na pílula ao lado do rótulo. |
| `footnote` | `string` | — | não | **Outline.** O que a variação significa, no chip do rodapé. |
| `hint` | `string` | — | não | **Outline.** Linha de contexto abaixo do rodapé. |

O eixo `theme` do Figma **não virou prop**: os dois temas saem dos mesmos
tokens sob `.dark`.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `fill` | Padrão. Um número e uma contagem. A faixa do topo do dashboard. Altura 139–140. Tem traço de 1px em `border` (ADR-045): sem ele o cartão sumia sobre superfície clara. |
| `outline` | Um número, a variação dele e o que ela significa. Tem divisória e rodapé. Traço de 2px, altura 172. |
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

Usa: [Card](Card.md) como casca (raio, traço `card` e fundo; lote B6) — o KPI só muda largura, recuo por variante (D14) e, no Outline, o traço de 2 sem fundo; glifos exportados do arquivo ·
Usado por: home do site (galeria) e dashboard (tela ainda não construída)

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

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-136, AUD-137, AUD-138 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
