# Componente: Tag

## Responsabilidade

Mostrar uma etiqueta que o usuário pôs no lead.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `538:197` ("Tag", canvas do Drawer) · Lote: `3` · Oito temas: Text,
Status, theme8, Status 2, Atendente, Empresa, Pessoa, Adicionar.

Diff de pixels **não medido** (`figma-console` fora do ar).

## Props

### `Tag`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `status` | `"destructive" \| "info" \| "success"` | não | Bolinha de 6px antes do texto. |
| `tipo` | `"pessoa" \| "empresa"` | não | Ícone de 12px e texto em `primary`. |
| `foto` | `string` | não | Foto de 22px encostada à esquerda (atendente). |
| `children` | `ReactNode` | sim | O texto. A caixa alta é CSS. |

### `TagAdicionar`

`rotulo` (obrigatório) e os atributos de `<button>`.

## Variantes

| Arquivo | Código |
|---------|--------|
| Text | `<Tag>` |
| Status · theme8 · Status 2 | `status="destructive"` · `"info"` · `"success"` |
| Pessoa · Empresa | `tipo="pessoa"` · `"empresa"` |
| Atendente | `foto` |
| Adicionar | `<TagAdicionar>` |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-primary-hover no TagAdicionar` | banco | I1 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | I4 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

A `Tag` é leitura. Só o `TagAdicionar` é interativo.

## Tokens consumidos

`input/bg-disabled` · `foreground` · `primary` · `primary-hover` ·
`destructive` · `info` · `success` · `background` · `radius/full` ·
`text/label-sm` · `shadow-button-inner`

## Composição

Usa: Phosphor (`User`, `Buildings`, `Plus`) ·
Usado por: [Drawer](Drawer.md) (perfil, tabela de negócios, nó da hierarquia) ·
página do Badge

## Exemplo de uso

```tsx
<div className="flex flex-wrap justify-center gap-1">
  <Tag foto="/fotos/esther.png">Esther</Tag>
  <Tag>Lista de leads</Tag>
  <Tag status="destructive">Abandonou</Tag>
  <TagAdicionar rotulo="Adicionar tag" onClick={abrirSeletor} />
</div>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Cor | A bolinha é `aria-hidden`: o sentido está no texto, não na cor |
| Caixa alta | `uppercase` no CSS — o leitor de tela lê a string original |
| Adicionar | `<button>` com `aria-label` e `title` (regra E7) |
| Alvo de toque | `TagAdicionar` tem 22px — **abaixo dos 44 da regra I15** |

## Divergências abertas (para o gate)

1. **Tag de tipo no perfil tem override do arquivo.** O componente usa fundo
   `input/bg-disabled` e recuo 6px; a instância sobre o avatar usa `background`
   e 4px em volta. O Drawer repete o override por `className`.
2. **Ícone do "+" em `background`.** O SVG vem em `#EBEDEF`. No escuro,
   `background` é quase preto sobre o azul claro — confere com o
   `primary-foreground` escuro, mas não é o mesmo token.
3. **Empresa roxa.** Na variante roxa do perfil a tag de empresa é `#8B33FF`,
   sem variável. Não entrou (ver [Drawer](Drawer.md)).
