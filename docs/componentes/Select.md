# Componente: Select

## Responsabilidade

Escolher uma opção numa lista curta.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Nodes: `261:333` (recorte do Card) e `261:463` (filtro da Data Table) ·
Lote: `2`.

Nasceu de duas ocorrências: o mesmo controle aparece nos dois lugares com a
mesma cara, então é um componente só, com dois tamanhos.

**A lista aberta não está no arquivo.** O Figma desenha só o estado fechado. O
painel foi derivado dos tokens `overlay/*`, que existem exatamente para o que
flutua sobre a página, e da escala de elevação (`shadow-lg`, o degrau que a
página de Elevation reserva a popover e menu de contexto).

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `opcoes` | `OpcaoSelect[]` | — | sim | `valor` e `rotulo`. |
| `rotulo` | `string` | — | sim | Nome do controle para leitor de tela. Ex.: "Filtrar por etapa". |
| `valor` | `string` | — | sim | O valor escolhido (controlado). Vazio = o gatilho mostra `textoVazio`. |
| `aoEscolher` | `(v: string) => void` | — | não | Chamado ao escolher. |
| `textoVazio` | `string` | `"Selecione"` | não | O que o gatilho mostra sem escolha. |
| `size` | `"md" \| "sm" \| "field"` | `"md"` | não | `md` no Card (32px, com realce interno); `sm` na tabela (29px); `field` é o campo de formulário (36px, a caixa do Input). |
| `cartao` | `boolean` | `false` | não | O cartão do drawer: o cartão inteiro é o gatilho, com o rótulo visível em bold, o valor na linha de 24 e o caret. A casca do `CampoEditavel` ao lado (ADR-041). Ignora `size`. |
| `className` | `string` | — | não | — |

`SelectTrigger` recebe `aberto` (gira o caret e marca o gatilho como ativo) e `vazio` (no `field`, o texto sai na cor de placeholder).

`SelectTrigger` é exportado à parte, para quando a abertura for controlada por
outro componente.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `md` | Cabeçalho de card. |
| `sm` | Barra de filtros de tabela. |
| `cartao` | Cartão do drawer, ao lado de `CampoEditavel`: mesmo fundo, respiro e rótulo, com o caret. Nunca `field` dentro de `CartaoDeCampo` ali. |
| `field` | Formulário: a caixa do Input (36px). Ao lado de um Input é sempre `field` — o `md` (card, cinza com realce) ao lado de um campo branco lê como desabilitado (cliente, 2026-09-24, ADR-038). |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `text-foreground` | banco | I1 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
| aberto | `caret girado 180 + text-foreground` | humano | L11 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`card` · `background` · `muted-foreground` · `foreground` · `ring` ·
`overlay/bg` · `overlay/border` · `overlay/item-hover` ·
`overlay/item-selected` · `overlay/item-text-selected` · `radius/md` ·
`radius/lg` · `radius/sm` · `text/label-lg`

## Composição

Usa: `PainelFlutuante` do [Popover](Popover.md) na lista aberta, `useCliqueFora` (lib) para fechar no clique fora e, no `size="field"`, a própria `caixaDeCampo` de `lib/campo.ts` — a caixa do [Input](Input.md), com o traço + anel interno no foco em vez do outline do botão. `SelectTrigger` é o gatilho, também usado pelo Card ·
Usado por: [Card](Card.md) e [DataTable](DataTable.md)

## Exemplo de uso

```tsx
<Select
  size="sm"
  rotulo="Filtrar por etapa"
  opcoes={etapas}
  valor={etapa}
  aoEscolher={setEtapa}
/>
```

No cartão do drawer:

```tsx
<Select cartao rotulo="Etapa do funil" opcoes={etapas} valor={etapa} aoEscolher={setEtapa} />
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | Gatilho com `aria-haspopup="listbox"` e `aria-expanded`; painel com `role="listbox"` e opções com `role="option"` + `aria-selected` |
| Teclado | Setas abrem e movem, Home e End vão às pontas, Enter e Espaço escolhem, Escape fecha e devolve o foco ao gatilho, Tab fecha |
| Foco visível | `outline` com offset (regra D6). O foco entra no painel ao abrir — sem isso as setas não moveriam nada |
| Realce | O item sob o cursor e o item sob o teclado usam o MESMO destaque: quem navega por seta vê o que quem usa mouse vê |
| Clique fora | Fecha sem devolver o foco, que é o que a pessoa espera de quem clicou noutro lugar |
| Alvo de toque | 29–32px de altura — **abaixo dos 44 da regra I15** |
| Movimento | Lista entra em `fade-in-fast` e sai em `fade-out` (casca do Popover + `useSaida`); com redução de movimento, nada anima |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-159, AUD-160, AUD-161, AUD-162 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
