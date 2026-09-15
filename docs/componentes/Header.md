# Componente: Header

## Responsabilidade

O topo de uma página do CRM: onde a pessoa está, que página é e o que dá para
fazer nela.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `601:464` (set "Header", 6 variantes) · Lote: `3` ·
Última verificação: ver [processo/kfe-state.md](../processo/kfe-state.md), entrada de 2026-09-15.

**O set está com erro no arquivo.** As seis variantes se chamam
`Actions=Default, theme=Light`; com nome repetido, o Figma recusa ler as
propriedades ("Component set has existing errors"). Não existe variante escura.

O Header **não tem prop de variante**. As seis combinações do arquivo — e as
que o produto ainda vai ter — são composição dos encaixes.

## Props

`Header` — a moldura.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `titulo` | `string` | — | sim | `h1`, trunca com `title`. |
| `subtitulo` | `string` | — | não | `body-sm` a 2px do título. |
| `trilha` | `ReactNode` | — | não | Em cima, à esquerda. Normalmente `Breadcrumb`. |
| `utilitarios` | `ReactNode` | — | não | Em cima, à direita. Normalmente `HeaderNotificacoes`. |
| `acoes` | `ReactNode` | — | não | Embaixo, à direita, alinhadas pela base do título. |

Peças do mesmo arquivo:

| Peça | Props | O que é |
|------|-------|---------|
| `HeaderDivisor` | `className?` | Traço 1×20 em `divider` (601:55), `role="separator"` |
| `HeaderNotificacoes` | `rotulo`, `contagem?` + props de botão | Button `tertiary` `icon` com sino e selo; acima de 99, "99+" |
| `HeaderBusca` | `rotulo` + props de input | Busca inline de 184px (variante Search, 610:14049) |

Controles que entram em `acoes` e têm doc própria: [Button](../../app/actions/button/page.tsx)
(`tertiary`), [SegmentedControl](SegmentedControl.md), [Breadcrumb](Breadcrumb.md), Date Picker.

## Variantes

Não tem. Ver "Par no Figma".

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| repouso | `px-8 py-4 border-b bg-background · linha de cima min-h-8 · ações gap-2` | figma | Actions=Default (601:12) |
| sem espaço | `ações descem para linha própria (flex-wrap + ml-auto) e quebram entre si` | inferido | E3 |
| texto longo | `título, subtítulo e níveis da trilha truncate + title` | declarado | D12 |
| hover (sino) | `hover:bg-accent do Button tertiary` | inferido | gatilho do Date Picker |
| focus (busca) | `focus-within:outline-2 outline-offset-2 outline-ring` | declarado | D6 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`background` · `border` · `foreground` · `muted-foreground` · `card` ·
`divider` · `destructive` · `primary-foreground` · `ring` · `text/heading-1` ·
`text/body-sm` · `text/label-sm` · `text/label-lg` · `radius/md` ·
`radius/full` · `button inner shadow`

## Composição

Usa: Button · Tooltip · (por encaixe) Breadcrumb, SegmentedControl, ViewSwitcher, DateRangePicker · Usado por: —

## Exemplo de uso

```tsx
<Header
  titulo="Dashboard"
  subtitulo="Acompanhe os principais indicadores do time"
  trilha={<Breadcrumb rotulo="Trilha de navegação" rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`} itens={trilha} link={Link} />}
  utilitarios={<HeaderNotificacoes rotulo={t("notificacoes", { n })} contagem={n} />}
  acoes={
    <>
      <Button variant="tertiary"><MagnifyingGlass size={16} weight="regular" />{t("pesquisar")}</Button>
      <SegmentedControl rotulo={t("periodo")} itens={periodos} atual={periodo} aoEscolher={setPeriodo} />
      <HeaderDivisor />
      <Button variant="primary"><Plus size={16} weight="regular" />{t("novoLead")}</Button>
    </>
  }
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `<header>` com `h1`; trilha é `nav` com `aria-label`; divisor é `separator` vertical |
| Teclado | Ordem natural: trilha, sino, ações. Controles segmentados entram por uma opção só e andam por setas |
| Nome acessível | Sino e opções do View Switcher só têm ícone: `aria-label` obrigatório e tooltip com o mesmo texto; selo `aria-hidden` (a contagem vai no rótulo) |
| Foco visível | Outline com folga (D6) em todos os controles |
| Texto longo | Trunca com `title`; ações quebram linha em vez de vazar |
| Zoom | Nenhuma largura fixa além da busca (184, com `max-w-full`) |

## Divergências abertas (para o gate)

1. **Set do Figma com erro**: seis variantes com o mesmo nome. Renomear `Actions`
   (ex.: Default, Date, Analytics, Compact, Minimal, Search) destrava leitura e
   a criação da variante escura no arquivo.
2. **Button do código ≠ Button do Header no arquivo**: 13px e vão 8 contra 12px
   e vão 6 — pendência nº 6 de [02-design-system.md](../02-design-system.md).
3. **Gatilho do Date Picker com 29px**, o arquivo desenha 32 no Header.
4. **Número do selo em `primary-foreground`**: o `destructive-foreground` do
   arquivo é branco nos dois modos (reprova a D8; 2,6:1 no escuro).
5. **`tertiary` escuro**: o arquivo pinta o texto de `base/blue/600`, cópia do
   Secondary; o código mantém `muted-foreground`.
6. **Quebra de linha das ações e truncamento** não estão no arquivo.
7. **Escuro do Header não desenhado**: saiu dos tokens; as peças (Button,
   Segmented, View Switcher, Breadcrumb) têm variante escura e batem.
