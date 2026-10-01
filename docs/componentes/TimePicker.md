# Componente: TimePicker

## Responsabilidade

Escolher uma hora, e uma data com hora, sabendo de fuso.

## Quando usar

- **Use** `TimePicker` para hora; `DateTimePicker` para data com hora (agendamento), com `fusos` quando o time atende em mais de um fuso.
- **Não use** para duração ("esperar 5 minutos"): é `Input` numérico com a unidade.
- **Não use** para só a data: é `DatePicker`.

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
| `segundos` | `boolean` | não | Liga a roda de segundos. |
| `passoMinutos` | `number` | não | Padrão 5. |
| `passoSegundos` | `number` | não | Padrão 10. |
| `formato` | `FormatoDeHora` | não | `"12h"` (com a roda de AM/PM) ou `"24h"`. Sem a prop, o costume do `locale`. O valor guardado é sempre 24h. |
| `fuso` | `string` | não | IANA. Padrão: o do navegador. |
| `aoMudarFuso` | `(f: string) => void` | não | Com ela e `fusos`, o rodapé ganha o seletor de fuso: um painel do DS com busca. |
| `fusos` | `string[]` | não | A lista do seletor. |
| `locale` | `string` | sim | BCP-47. |
| `rotulos` | `RotulosDeHora` | sim | Os sete textos obrigatórios: `vazio`, `horas`, `minutos`, `segundos`, `agora`, `limpar`, `fuso` (aria-label do seletor de fuso). Opcionais: `am`, `pm` (padrão "AM"/"PM") e `buscarFuso` (placeholder da busca, padrão "Buscar"). |
| `disabled`, `className` | — | não | — |

### `DateTimePicker`

Tudo o que o `TimePicker` tem, mais:

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `valor` | `Date \| null` | sim | O **instante**, não o texto. |
| `rotulos` | `RotulosDeHora & RotulosDoCalendario` | sim | Soma os rótulos de mês e ano. |
| `dataMinima` · `dataMaxima` | `Date` | não | Limites do calendário. |

As rodas (reunião de 2026-09-18): cinco valores à vista, o do meio numa
faixa é o escolhido e cresce ~2px; rola e para no valor (`scroll-snap`), os
das pontas inclinam até 60° e apagam sob um sombreado em cima e embaixo. As
rodas dividem a largura do painel; o botão do fuso mostra só o ícone e o
deslocamento (a cidade vai no `title` e no painel). Setas, PageUp e
PageDown, Home e End andam; clicar num valor escolhe. O valor só muda quando a
rolagem para. O seletor de fuso é um painel do DS (`overlay/*`) com busca por
cidade, no lugar do `<select>` nativo; Escape fecha só ele.

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
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| selecionado | `bg-overlay-item-selected + text-overlay-item-text-selected` | figma | Select Item 544:99 |
| aberto | `painel com elevacao lg; vira para cima quando nao cabe` | inferido | L11 |
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

Usa: [Button](Button.md) (gatilho e rodapé), `CalendarioDeDia` do [DatePicker](DatePicker.md), `caixaDeCampo` do [Input](Input.md), `PainelFlutuante` do [Popover](Popover.md) nos dois painéis, `usePosicao` e `useCliqueFora` (lib), `lib/fusos.ts` ·
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
| Movimento | Os dois painéis entram em `fade-in-fast` e saem em `fade-out` (casca do Popover + `useSaida`) |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-182, AUD-183, AUD-184, AUD-185 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
