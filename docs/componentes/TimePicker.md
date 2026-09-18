# Componente: TimePicker

## Responsabilidade

Escolher uma hora, e uma data com hora, sabendo de fuso.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

**Não tem.** Entraram por pedido do humano em 2026-09-17, montados com o que o
DS já tem: a caixa do [Input](Input.md) no gatilho, os tokens `overlay/*` na
lista, a escala de elevação no painel e a grade do Date Picker no calendário
(`CalendarioDeDia`, exportado de `date-picker.tsx`).

## Props

### `TimePicker`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | Rótulo visível. |
| `valor` | `string \| null` | sim | `"HH:MM"` ou `"HH:MM:SS"`. |
| `aoMudar` | `(v: string \| null) => void` | sim | Escolha, "Agora" e "Limpar". |
| `segundos` | `boolean` | não | Liga a terceira coluna. |
| `passoMinutos` | `number` | não | Padrão 5. |
| `passoSegundos` | `number` | não | Padrão 10. |
| `fuso` | `string` | não | IANA. Padrão: o do navegador. |
| `locale` | `string` | sim | BCP-47. |
| `rotulos` | `RotulosDeHora` | sim | `vazio`, `horas`, `minutos`, `segundos`, `agora`, `limpar`, `fuso`. |

### `DateTimePicker`

Tudo o que o `TimePicker` tem, mais:

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `valor` | `Date \| null` | sim | O **instante**, não o texto. |
| `aoMudarFuso` | `(f: string) => void` | não | Com ela e `fusos`, o rodapé ganha o seletor. |
| `fusos` | `string[]` | não | A lista do seletor. |
| `rotulos` | `RotulosDeHora & RotulosDoCalendario` | sim | Soma os rótulos de mês e ano. |
| `dataMinima` · `dataMaxima` | `Date` | não | Limites do calendário. |

## Variantes

| Componente | Guarda | Quando usar |
|---|---|---|
| `TimePicker` | texto | Hora de parede: funcionamento, janela de disparo. |
| `DateTimePicker` | `Date` | Compromisso: reunião, atendimento, vencimento. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-overlay-item-hover no item da lista` | figma | Select Item 544:99 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | I4 |
| selecionado | `bg-overlay-item-selected + text-overlay-item-text-selected` | figma | Select Item 544:99 |
| aberto | `painel com elevacao lg; vira para cima quando nao cabe` | inferido | DateRangePicker |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`input/bg` · `input/border` · `input/border-focus` · `input/text` ·
`input/placeholder` · `input/label` · `overlay/bg` · `overlay/border` ·
`overlay/item-hover` · `overlay/item-selected` · `overlay/item-text-selected` ·
`border` · `muted-foreground` · `radius/lg` · `radius/md` · `elevation/lg` ·
`text/body-md` · `text/label-md` · `text/caption`

## Composição

Usa: `caixaDeCampo` do [Input](Input.md) · `CalendarioDeDia` do Date Picker ·
`Button` no rodapé · `lib/fusos.ts` ·
Usado por: agenda de atendimento (tela ainda não construída)

## Exemplo de uso

```tsx
<TimePicker rotulo="Abre às" valor={hora} aoMudar={setHora} locale="pt-BR" rotulos={rotulos} />

<DateTimePicker
  rotulo="Início do atendimento"
  valor={quando}
  aoMudar={setQuando}
  fuso={fuso}
  aoMudarFuso={setFuso}
  fusos={["America/Sao_Paulo", "Europe/Lisbon", "UTC"]}
  locale="pt-BR"
  rotulos={{ ...rotulos, mes: "Mês", ano: "Ano", mesAnterior: "Mês anterior", proximoMes: "Próximo mês" }}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | Gatilho com `aria-haspopup="dialog"` e `aria-expanded`; painel `role="dialog"`; cada coluna é uma `listbox` com `aria-selected` |
| Teclado | Tab anda pelas opções; Escape fecha e devolve o foco ao gatilho — e para ali, sem fechar o drawer atrás |
| Abertura | A coluna rola até o valor atual ao abrir, em vez de começar na meia-noite |
| Fuso | Escrito no gatilho e no rodapé (`GMT-3`), não só implícito |
| Hidratação | O texto que depende de fuso sai com `suppressHydrationWarning`: servidor e navegador formatam diferente |

## Divergências abertas (para o gate)

1. **Não está no Figma.** Tudo aqui é derivação de tokens e de componentes que
   já existiam. Vale desenhar para confirmar.
2. **Lista, não roleta.** Em celular o padrão do sistema é roleta; aqui são
   colunas roláveis, iguais nos dois.
3. **`passoMinutos` some com valores fora do passo.** Uma hora vinda do back com
   `09:07` aparece no gatilho, mas não fica marcada na coluna de 5 em 5.
4. **Sem intervalo de hora.** "Das 9 às 18" são dois componentes hoje.
