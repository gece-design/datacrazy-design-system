# Componente: Header

## Responsabilidade

O topo de uma página do CRM: onde a pessoa está, que página é e o que dá para
fazer nela.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `601:464` (set "Header", 6 variantes) · Lote: `3` · 111px, com ou sem subtítulo ·
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
| `subtitulo` | `string` | — | não | `body-sm` a 2px do título. **Fora por padrão** (2026-09-18): título e descrição decorativos em toda tela são anti-referência. A linha guarda `min-h-[46px]` — o espaço que ele ocupava — para as ações não encostarem no sino. |
| `trilha` | `ReactNode` | — | não | Em cima, à esquerda. Normalmente `Breadcrumb`. |
| `utilitarios` | `ReactNode` | — | não | Em cima, à direita. Normalmente `HeaderNotificacoes`. |
| `acoes` | `ReactNode` | — | não | Embaixo, à direita, alinhadas pela base do título. |

Peças do mesmo arquivo:

| Peça | Props | O que é |
|------|-------|---------|
| `HeaderDivisor` | `className?` | Traço 1×20 em `divider` (601:55), `role="separator"` |
| `HeaderNotificacoes` | `rotulo`, `contagem?` + props de botão | Button `tertiary` `icon` com sino e selo; acima de 99, "99+" |
| `HeaderBusca` | `rotulo` + props de input | Busca inline de 184px (variante Search, 610:14049) |

Controles que entram em `acoes` e têm doc própria: [Button](Button.md)
(`tertiary`), [SegmentedControl](SegmentedControl.md), [Breadcrumb](Breadcrumb.md), Date Picker.

### `HeaderBusca`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | Nome do campo para leitor de tela. |
| `recolhida` | `boolean` | não | Começa como só a lupa (32px); clicar abre a caixa de 184 com movimento (`base` · `enter`) e o foco entra; sem texto, fecha ao sair ou no Escape. ADR-028. |

### `Notificacoes`

O sino com o painel (virou peça em 2026-09-23: toda tela tem o sino e ele
precisa abrir alguma coisa). O conteúdo continua da tela.

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `itens` | `Notificacao[]` | sim | `id`, `icone`, `titulo`, `detalhe`, `quando` (texto), `lida`. |
| `aoMarcarLida` | `(id) => void` | sim | Clique num item. A tela marca como lida e abre o que for. |
| `aoMarcarTodas` | `() => void` | sim | O botão do topo do painel. |
| `rotulos` | `Partial<RotulosDasNotificacoes>` | não | `titulo`, `naoLidas(n)` (nome do sino), `marcarTodas`, `verTodas`, `verMenos`. Fábrica: `ROTULOS_DAS_NOTIFICACOES`. |
| `className` | `string` | não | — |

O painel abre em portal fixo abaixo do sino, alinhado pela direita, acompanha
a rolagem e a janela; clique fora e Escape fecham (de onde o foco estiver) e o
foco volta ao sino. "Ver todas" não sai do painel: a lista cresce até a altura
da janela e rola, e o botão vira "Ver menos" (humano, 2026-09-23 — um toast ali
era bug). Não
lidas em `accent` + `primary` com o ponto azul; lidas em `background` +
`subtle-foreground`. Usa o `PainelFlutuante` do [Popover](Popover.md).

## Variantes

Não tem. Ver "Par no Figma".

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| repouso | `px-8 py-4 border-b bg-background · linha de cima min-h-8 · ações gap-2` | figma | Actions=Default (601:12) |
| sem espaço | `ações descem para linha própria (flex-wrap + ml-auto) e quebram entre si` | banco | E3 |
| texto longo | `título, subtítulo e níveis da trilha truncate + title` | declarado | D12 |
| hover (sino) | `hover:bg-accent do Button tertiary` | inferido | gatilho do Date Picker |
| focus (busca) | `focus-within:outline-2 outline-offset-2 outline-ring` | declarado | D6 |
| notificações | `sino abre painel da tela (portal, overlay/*, shadow-lg); Escape devolve o foco` | declarado | L11 |
| painel de notificações | `sino com aria-expanded + PainelFlutuante role=dialog abaixo dele, fade-in-fast; sai com fade-out` | humano | L10 |
| busca abrindo | `largura 32 → 184 em base · enter (transition-[width]); o foco entra` | humano | I11 (exceção, ADR-028) |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`background` · `border` · `foreground` · `muted-foreground` · `card` ·
`divider` · `destructive` · `primary-foreground` · `ring` · `overlay/*` (painel
de notificações da tela) · `text/heading-1` ·
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

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-120, AUD-121, AUD-122, AUD-123, AUD-124, AUD-125, AUD-126, AUD-127, AUD-128 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
