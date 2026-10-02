# Componente: Calendario

## Responsabilidade

Mostrar os negócios (ou qualquer evento datado) no mês ou na semana, pela
data, e devolver o clicado — a visão por data do pipeline, ao lado do Kanban
e da lista.

## Quando usar

- **Use** para ver registros com data (negócios, tarefas) no mês ou na semana, como visão alternativa da lista e do quadro.
- **Não use** para escolher uma data num campo: é `DatePicker`.
- **Não use** para agenda com horários de duração variável: o componente mostra o dia, não a hora.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há: o componente nasceu do pedido do cliente (reunião de 2026-09-18,
"visão de calendário" como quarta visão da grid) e das peças que já existiam.
Divergência registrada em [../processo/consistencia.json](../processo/consistencia.json)
(AUD-203, `adiado`, lote `figma`): o arquivo passa a acompanhar o código.

## Props

### `Calendario`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `eventos` | `EventoCalendario[]` | sim | `id`, `data` (AAAA-MM-DD), `rotulo`, `detalhe?`, `tom?`. |
| `referencia` | `Date` | sim | O dia que diz o mês (ou a semana) na tela. Estado da tela. |
| `aoMudarReferencia` | `(d: Date) => void` | sim | Setas, Hoje e a navegação por teclado que sai da grade. |
| `visao` | `"mes" \| "semana"` | não | Padrão `mes`. |
| `aoMudarVisao` | `(v) => void` | não | Com ele, o grupo mês/semana aparece na barra. |
| `locale` | `string` | sim | BCP-47. Nome de mês e dia e o primeiro dia da semana saem de `Intl`. |
| `rotulos` | `Partial<RotulosDoCalendario>` | não | Textos dos controles (i18n). Fábrica: `ROTULOS_DO_CALENDARIO`. |
| `aoAbrir` | `(evento) => void` | não | Clique num evento, na grade ou no painel do dia. |
| `aoEscolherDia` | `(dia: Date) => void` | não | Clique no número do dia. Ex.: criar algo naquela data. |
| `hoje` | `Date` | não | O dia marcado como hoje. Sem ele, o de agora, medido depois de montar. |
| `maximoPorDia` | `number` | não | Eventos por dia antes do "+N mais". Padrão 3 no mês, 8 na semana. |
| `className` | `string` | não | — |

### `RotulosDoCalendario`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `anterior`, `proximo`, `hoje` | `string` | sim | Os três botões da barra. |
| `mes`, `semana`, `visao` | `string` | sim | O grupo mês/semana e o nome dele. |
| `mais` | `(n) => string` | sim | O botão do dia cheio. "+2 mais". |
| `dia` | `(data, eventos) => string` | sim | Nome do botão do dia: a data por extenso e quantos eventos tem. |

`TomDoEvento` são os catorze tons do DS (os da [Tag](Tag.md) e do perfil do
[Drawer](Drawer.md)); só a bolinha do evento pinta.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `visao="mes"` | Planejar: a grade do mês, semanas inteiras, até três eventos por dia. |
| `visao="semana"` | A agenda de alguém: sete colunas altas, até oito eventos por dia. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-overlay-item-hover no evento e no número do dia` | humano | L2 |
| focus | `outline 2px por dentro (focoInterno)` | banco | D6 · D19 |
| hoje | `disco primary + aria-current=date` | humano | — |
| outro mês | `subtle-foreground + background/50` | humano | — |
| dia cheio | `+N mais em primary abre o painel do dia` | humano | — |
| mês trocando | `tbody entra com fade-in-fast` | humano | I12 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher. Não há seleção de dia: o calendário mostra
e devolve; escolher intervalo é o [DatePicker](DatePicker.md).

## Tokens consumidos

`card` · `muted` · `background` · `border` · `primary` · `primary-foreground` ·
`foreground` · `muted-foreground` · `subtle-foreground` · `overlay/item-hover` ·
`overlay/bg` · `overlay/border` · `elevation/lg` · `z/popover` · `--tom-ponto` ·
`radius/md` · `radius/sm` · `radius/full` · `text/heading-3` ·
`text/label-md` · `text/label-sm` · `text/caption` · `duration/fast`

## Composição

Usa: `lib/datas.ts` (a grade do mês e as contas de data, que saíram do
[DatePicker](DatePicker.md) — D21) · [Button](Button.md) `tertiary` nas setas e no
Hoje · [SegmentedControl](SegmentedControl.md) em mês/semana · `PainelFlutuante`
do [Popover](Popover.md) no painel do dia (`useCliqueFora`, `useSaida`).
Usado por: tela de leads (`/exemplos/pipeline`, visão em calendário)

## Exemplo de uso

```tsx
const [referencia, setReferencia] = useState(new Date());
const [visao, setVisao] = useState<VisaoCalendario>("mes");

<Calendario
  locale={locale}
  eventos={leads.map((l) => ({ id: l.id, data: l.proximaAcao, rotulo: l.nome, detalhe: l.empresa }))}
  referencia={referencia}
  aoMudarReferencia={setReferencia}
  visao={visao}
  aoMudarVisao={setVisao}
  aoAbrir={(evento) => abrirLead(evento.id)}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Estrutura | `<table role="grid">` com `th scope="col" abbr` nos dias da semana; o nome da grade é o mês |
| Teclado | Um dia por vez no Tab; setas andam pelos dias, Home/End pelas pontas da semana, PageUp/PageDown pelo mês (semana, na visão semana). Sair da grade pela seta leva o mês junto |
| Eventos | Botões; entram no Tab só no dia focado (senão uma grade cheia viraria cem paradas). O nome do dia diz quantos eventos tem |
| Hoje | `aria-current="date"` |
| Mês | `<h2 aria-live="polite">`: quem navega por teclado ouve o mês mudar |
| Dia cheio | `+N mais` com `aria-haspopup="dialog"`; o painel é `role="dialog"` nomeado pela data, o foco entra no primeiro evento, Escape fecha e devolve o foco |
| Idioma | Nada escrito à mão: mês, dia e primeiro dia da semana vêm de `Intl`; os rótulos dos controles vêm de fora |
| Movimento | Fade do mês (fast) e do painel; com `prefers-reduced-motion` não há (I12, global) |

## Divergências abertas (para o gate)

AUD-203 (`adiado`, lote `figma`): sem par no arquivo. Desenhar o Calendário no
Figma a partir do código, na remedição.
