# Componente: DatePicker

## Responsabilidade

Período em dois meses, com atalhos: um gatilho no estilo do Button `tertiary`
que abre o painel de intervalo. `CalendarioDeDia` é a mesma grade com um dia
só, para o [TimePicker](TimePicker.md) não redesenhar calendário.

## Quando usar

- **Use** `DatePicker` para uma data; `DateRangePicker` para período, com atalhos, no Header ou num filtro.
- **Não use** para data com hora: é `DateTimePicker`, do TimePicker.
- **Não use** três Selects (dia, mês, ano) nem `Input` com máscara de data.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node não registrado no log (o arquivo estava em edição pelo humano em
2026-09-14) · Lote: `1` · Escrito em 2026-09-03, antes do registro existir ·
O estado "hoje" não está desenhado: é derivado (sinal por cor, não moldura) ·
Diff de pixels não medido.

## Props

`DateRangePicker`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `valor` | `IntervaloDeDatas` | sim | `{ inicio: Date \| null, fim: Date \| null }`. Só `Date`: comparar por chave AAAAMMDD evita o "mesmo dia, horas diferentes". |
| `onValorChange` | `(valor: IntervaloDeDatas) => void` | sim | No Aplicar e nos atalhos. |
| `rotulos` | `RotulosDoDatePicker` | sim | `vazio`, `atalhos`, `mes`, `ano`, `mesAnterior`, `proximoMes`, `aplicar`, `cancelar` — todos obrigatórios (i18n). |
| `locale` | `string` | sim | BCP-47. No CRM é o locale ativo do next-intl, nunca um literal: decide o primeiro dia da semana e o formato do intervalo. |
| `atalhos` | `AtalhoDeIntervalo[]` | não | `{ id, rotulo, intervalo(hoje) }`. `criarAtalhos` em `lib/periodos.ts` traz 16 contas prontas. |
| `dataMinima`, `dataMaxima` | `Date` | não | Fora delas o dia não clica. |
| `meses` | `1 \| 2` | não | Quantos meses lado a lado. Padrão 2; 1 para um filtro curto ou um painel estreito (reunião de 2026-09-18). |
| `disabled`, `className` | — | não | — |

`CalendarioDeDia`: `valor: Date \| null`, `aoEscolher(dia)`, `locale`,
`rotulos: RotulosDoCalendario` (`mes`, `ano`), `dataMinima`, `dataMaxima`,
`className`.

### `DatePicker`

Uma data, um calendário (reunião de 2026-09-18): o mesmo gatilho do período,
um mês só, e o dia escolhido fecha o painel na hora — sem Aplicar. Hoje e
Limpar no rodapé.

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `valor` | `Date \| null` | sim | O dia. |
| `aoMudar` | `(valor: Date \| null) => void` | sim | No clique do dia, em Hoje e em Limpar. |
| `locale` | `string` | sim | BCP-47. |
| `rotulos` | `RotulosDoDatePickerSimples` | sim | `vazio`, `mes`, `ano`, `mesAnterior`, `proximoMes`, `hoje`, `limpar`. |
| `dataMinima`, `dataMaxima` | `Date` | não | Fora delas o dia não clica. |
| `disabled`, `className` | — | não | — |

O painel dos três tem recuo 16 e vão de 32 entre as grades ("melhorar o
espaço do popup", reunião de 2026-09-18).

## Variantes

| Variante | Quando |
|----------|--------|
| dois meses | Padrão do intervalo |
| um mês | `meses={1}`: filtro curto ou painel estreito |
| `DatePicker` | Uma data: vencimento, nascimento, dia da visita |
| com atalhos | Coluna à esquerda com os períodos prontos |
| `CalendarioDeDia` | Um mês, um dia — dentro do `DateTimePicker` |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `dia sob o cursor: bg-accent com texto muted-foreground (empresta a superfície do selecionado, texto separa os dois)` | banco | L2 |
| selected | `intervalo bg-accent text-accent-foreground · extremos bg-primary text-primary-foreground` | figma | L7 |
| hoje | `cor, não moldura (sinal por texto primary)` | banco | E-01 (estado derivado) |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| disabled | `opacity-50 pointer-events-none no gatilho; dia fora de dataMinima/dataMaxima não clica` | banco | I5 |
| aberto | `painel absoluto z-popover, border/card/shadow-float (migra para overlay-* em B5, D22); vira de lado quando não cabe; clique fora e Escape fecham` | humano | L11 |
<!-- kfe:estados:end -->

## Tokens consumidos

`accent` · `accent-foreground` · `primary` · `primary-foreground` · `card` ·
`border` · `foreground` · `muted-foreground` · `subtle-foreground` · `ring` ·
`radius/md` · `radius/lg` · `shadow-float` · `text/body-lg` · `text/body-md` ·
`text/label-lg` · `text/h4`

## Composição

Usa: [Button](Button.md) (gatilho `tertiary`, setas `ghost`, rodapé), `<select>` nativo para mês e ano (mesma escolha do [Telefone](Telefone.md)), `PainelFlutuante` do [Popover](Popover.md) no painel — `overlay-*` e `shadow-lg` (D22, decisão do humano em 2026-09-19; antes era `border`/`card`/`shadow-float`), `usePosicao` e `useCliqueFora` (lib) ·
Usado por: [TimePicker](TimePicker.md) (`CalendarioDeDia`), [Header](Header.md) pelos exemplos
As contas de data (chave do dia, grade do mês, primeiro dia da semana por locale) moram em `lib/datas.ts` desde T4 (2026-09-23), compartilhadas com o [Calendario](Calendario.md) — regra D21.

## Exemplo de uso

```tsx
<DateRangePicker
  valor={periodo}
  onValorChange={setPeriodo}
  locale={locale}
  rotulos={rotulos}
  atalhos={criarAtalhos(["hoje", "ultimos7", "esteMes"], t)}
  dataMaxima={hoje}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | Outline de 2px (D6); foco itinerante na grade — um dia por vez com `tabIndex 0` |
| Teclado | Setas movem o dia, mês anterior/próximo mantêm o foco dentro da grade; Escape fecha |
| Lado do painel | Medido, não presumido: com zoom acima de 100% o painel de ~660px vira para o lado que cabe (E3) |
| Dia de outro mês | Visível para fechar a grade, nunca clicável: o mesmo dia em dois lugares é ambiguidade |
| Intervalo | Primeiro clique abre, segundo fecha; clicar antes do início recomeça em vez de inverter |
| Movimento | Painel entra em `fade-in-fast` e sai em `fade-out`, montado até o fim (`useSaida`) |

## Divergências abertas (para o gate)

Nenhuma registrada além das da auditoria (AUD-009, AUD-041).
