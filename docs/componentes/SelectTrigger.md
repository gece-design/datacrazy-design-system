# Componente: SelectTrigger

## Responsabilidade

O gatilho de um seletor: rótulo, caret e nada mais.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Nodes: `261:333` (recorte do Card) e `261:463` (filtro da Data Table) ·
Lote: `2`.

Nasceu de duas ocorrências: o mesmo controle aparece nos dois lugares com a
mesma cara, então é um componente só, com dois tamanhos.

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `size` | `"md" \| "sm"` | `"md"` | `md` é o do Card (32px, com realce interno); `sm` é o da tabela (29px, sem realce). |

Aceita tudo que um `<button>` aceita.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `md` | Cabeçalho de card. |
| `sm` | Barra de filtros de tabela. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `text-foreground` | banco | I1 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | I4 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`card` · `background` · `muted-foreground` · `foreground` · `ring` ·
`radius/md` · `text/label-lg`

## Composição

Usa: nenhum ·
Usado por: [Card](Card.md) e [DataTable](DataTable.md)

## Exemplo de uso

```tsx
<SelectTrigger size="sm">Todas as etapas</SelectTrigger>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | `outline` com offset (regra D6) |
| Papel/rótulo | É `<button type="button">` com texto real; o caret é `aria-hidden` |
| Alvo de toque | 29–32px de altura — **abaixo dos 44 da regra I15** |
| Movimento | Só transição de cor |
| Contraste | `muted-foreground` sobre `background` = 4,5:1 no claro |

## Divergências abertas (para o gate)

1. **Não abre menu.** O Select do DS não existe e o arquivo desenha só o estado
   fechado. Isto é um botão de verdade — focável, anunciável —, mas quem clica
   não vê opção nenhuma. Quando o Select existir, este vira o `trigger` dele.
2. **Alvo de toque.** 29px no tamanho `sm` e 32 no `md`, contra os 44 da regra
   I15. É o que o arquivo desenha.
