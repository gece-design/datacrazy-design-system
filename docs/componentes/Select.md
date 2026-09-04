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
| `valor` | `string` | — | não | O valor escolhido. |
| `aoEscolher` | `(v: string) => void` | — | não | Chamado ao escolher. |
| `textoVazio` | `string` | `"Selecione"` | não | O que o gatilho mostra sem escolha. |
| `size` | `"md" \| "sm"` | `"md"` | não | `md` no Card (32px, com realce interno); `sm` na tabela (29px). |

`SelectTrigger` é exportado à parte, para quando a abertura for controlada por
outro componente.

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
| aberto | `caret girado 180 + text-foreground` | humano | — |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`card` · `background` · `muted-foreground` · `foreground` · `ring` ·
`overlay/bg` · `overlay/border` · `overlay/item-hover` ·
`overlay/item-selected` · `overlay/item-text-selected` · `radius/md` ·
`radius/lg` · `radius/sm` · `text/label-lg`

## Composição

Usa: `CaretDown` do Phosphor ·
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

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | Gatilho com `aria-haspopup="listbox"` e `aria-expanded`; painel com `role="listbox"` e opções com `role="option"` + `aria-selected` |
| Teclado | Setas abrem e movem, Home e End vão às pontas, Enter e Espaço escolhem, Escape fecha e devolve o foco ao gatilho, Tab fecha |
| Foco visível | `outline` com offset (regra D6). O foco entra no painel ao abrir — sem isso as setas não moveriam nada |
| Realce | O item sob o cursor e o item sob o teclado usam o MESMO destaque: quem navega por seta vê o que quem usa mouse vê |
| Clique fora | Fecha sem devolver o foco, que é o que a pessoa espera de quem clicou noutro lugar |
| Alvo de toque | 29–32px de altura — **abaixo dos 44 da regra I15** |

## Divergências abertas (para o gate)

1. **Caret do Phosphor, não o do arquivo.** O Figma desenha um triângulo cheio
   de 8×5; aqui vai o `CaretDown` da biblioteca. Decisão do humano em
   2026-09-04, valendo para todos os componentes — a fonte de ícone do DS é o
   Phosphor, e um triângulo desenhado à mão é um ícone fora dela.
2. **A lista aberta é derivação, não desenho.** Espaçamento, elevação e realce
   saíram dos tokens, não do arquivo. Vale desenhar para confirmar.
3. **Alvo de toque.** 29px no `sm` e 32 no `md`, contra os 44 da regra I15.
4. **Não é um `<select>` nativo nem Radix.** Foi feito à mão porque a base do
   projeto só tem `react-slot` e trazer pacote é decisão de stack. Se o Radix
   entrar, este componente é o primeiro a migrar.
