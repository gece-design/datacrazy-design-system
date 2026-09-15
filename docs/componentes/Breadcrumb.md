# Componente: Breadcrumb

## Responsabilidade

Mostrar o caminho até a página atual e levar de volta a qualquer nível dele.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `261:269` (componente "Breadcrumb", `theme=Light` e `theme=dark` 610:13743) ·
Lote: `3` · Última verificação: ver [processo/kfe-state.md](../processo/kfe-state.md), entrada de 2026-09-15.

A nota do arquivo diz "limite a 2 níveis visíveis; níveis intermediários
colapsam em reticências", mas o desenho tem três. O padrão segue o desenho
(`maximo = 3`); a nota fica a uma prop (`maximo={2}`).

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `itens` | `ItemBreadcrumb[]` | — | sim | `rotulo`, `href?`, `avatar?: { src?, destaque? }`, `icone?`. O último é a página atual. |
| `rotulo` | `string` | — | sim | `aria-label` do `nav`. |
| `rotuloRecolhidos` | `(n: number) => string` | — | sim | Nome do botão de reticências. |
| `maximo` | `number` | `3` | não | Níveis à vista antes de recolher (mínimo 2). |
| `link` | `ElementType` | `"a"` | não | No CRM, o `Link` do Next. |

## Variantes

Não tem. Adorno por nível (`avatar` com ou sem `destaque`, `icone`, nenhum) é dado, não variante.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| ancestral | `text-subtle-foreground, link` | figma | theme=Light (261:269) |
| atual | `text-muted-foreground + aria-current=page, não navega` | figma | theme=Light (261:269) |
| hover | `ancestral sobe para muted-foreground` | inferido | tom do nível atual |
| focus | `outline-2 outline-offset-2 outline-ring` | declarado | D6 |
| recolhida | `primeiro + botão de reticências + últimos (maximo − 1) · clique abre no lugar e passa o foco` | declarado | nota do componente no arquivo |
| texto longo | `truncate + title por nível` | declarado | D12 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`subtle-foreground` · `muted-foreground` · `accent` · `primary` · `card` ·
`ring` · `text/label-md` · `text/label-sm` · `space/component/gap-xs` ·
`space/2` · `radius/full`

## Composição

Usa: `inicialDe` (Avatar) · Usado por: Header (por encaixe)

## Exemplo de uso

```tsx
<Breadcrumb
  rotulo={t("trilha")}
  rotuloRecolhidos={(n) => t("mostrarNiveis", { n })}
  itens={[
    { rotulo: "Board team", href: "/times/board", avatar: { destaque: true } },
    { rotulo: "Mertcan", href: "/pessoas/mertcan", avatar: {} },
    { rotulo: "Marketing", icone: BellSimple },
  ]}
  link={Link}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `nav` com `aria-label` e `ol`; atual com `aria-current="page"`; separadores `aria-hidden` |
| Teclado | Links e reticências na ordem natural; ao abrir, o foco vai ao primeiro nível revelado |
| Nome acessível | Disco e ícone são `aria-hidden`: o nome é o rótulo |
| Contraste | **`subtle-foreground` sobre `background` dá 2,2:1** — ver divergência 1 |
| Texto longo | Todos os níveis encolhem juntos e truncam com `title` |

## Divergências abertas (para o gate)

1. **Contraste dos ancestrais abaixo de AA.** Está como o arquivo desenha;
   subir para `muted-foreground` apaga a diferença para o nível atual. Pede
   decisão de token.
2. **Nota × desenho**: dois ou três níveis à vista. Código segue o desenho.
3. **Reticências e hover não estão no arquivo.**
4. **Ícone do nível atual**: o arquivo usa um sino que não é Phosphor; o
   ícone é dado do item, e a doc usa `BellSimple`.
5. **Separador é o vetor do arquivo** (traço de 1,5), não `CaretRight`.
