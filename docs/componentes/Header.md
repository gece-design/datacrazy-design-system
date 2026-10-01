# Componente: Header

## Responsabilidade

O topo de uma página do CRM, numa linha só: onde a pessoa está, que página é e
o que dá para fazer nela.

## Quando usar

- **Use** uma vez por tela, pela prop `cabecalho` da `TelaBase`. Busca é `HeaderBusca`, filtros `HeaderFiltros`, sino `Notificacoes`.
- **Use** `HeaderFiltros` para mostrar e esconder a `BarraDeFiltros`, com a conta dos filtros ativos.
- **Use** a trilha com `Breadcrumb ancestrais`: ela traz os níveis acima, e o `titulo` é a página — o último nível.
- **Não use** montado à mão, nem um segundo título dentro do conteúdo.
- **Não use** o nome da página como último item da trilha: ele apareceria duas vezes, na trilha e no título.
- **Não use** `subtitulo` decorativo: só quando a frase diz o que o título não diz.
- **Não use** Button com texto no lugar da busca ou dos filtros.

## Família

`navegacao` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `601:464` (set "Header", 6 variantes) · Lote: `3` · **uma linha**, 60px sozinho e 48 como primeira faixa do painel da `TelaBase`. Não tem fundo nem traço próprios: fica sobre a superfície de quem o hospeda (ADR-055). O arquivo desenha duas linhas, 111px, com traço; o código já tinha fechado em 102 (ADR-029) e passou a uma linha em 2026-10-01, a pedido do cliente (ADR-053) ·
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
| `titulo` | `string` | — | sim | `h1` em `h4` (13px), logo depois da trilha: é o último nível dela. Trunca com `title`. |
| `subtitulo` | `string` | — | não | `body-sm`, depois do título, na mesma linha; só aparece com 960px ou mais de largura. **Fora por padrão** (2026-09-18): título e descrição decorativos em toda tela são anti-referência. |
| `inicio` | `ReactNode` | — | não | Antes da trilha. É onde a `TelaBase` põe o botão de menu (< 1024px). |
| `trilha` | `ReactNode` | — | não | À esquerda, antes do título: os níveis acima da página. Normalmente `Breadcrumb ancestrais`. Abaixo de 640px de largura do Header, sai. |
| `utilitarios` | `ReactNode` | — | não | Na ponta direita, depois das ações. Normalmente `Notificacoes`. |
| `acoes` | `ReactNode` | — | não | À direita, na mesma linha do título, com 28px e vão de 8: o Header encolhe sozinho o Button `md` e `icon`, o `SegmentedControl`, o `ViewSwitcher` e o gatilho de data (ADR-057) — não passe `size`. Quando não cabem, descem para uma linha própria (ADR-053). |

Peças do mesmo arquivo:

| Peça | Props | O que é |
|------|-------|---------|
| `HeaderDivisor` | `className?` | Traço 1×20 em `divider` (601:55), `role="separator"`. Some abaixo de 640px, quando as ações quebram em linhas centradas |
| `HeaderNotificacoes` | `rotulo`, `contagem?` + props de botão | Button `tertiary` `icon` com sino e selo; acima de 99, "99+" |
| `HeaderBusca` | `rotulo`, `recolhida?` + props de input | A busca do Header: aberta (184px, variante Search 610:14049) ou só a lupa (28px) — regra abaixo |
| `HeaderFiltros` | `rotulo`, `contagem?`, `rotuloComContagem?`, `recolhido?` + props de botão | O botão de filtros: com rótulo ou só o ícone (mesma regra da busca); com filtro ativo vira `soft` e mostra a conta |

Controles que entram em `acoes` e têm doc própria: [Button](Button.md)
(`tertiary`), [SegmentedControl](SegmentedControl.md), [Breadcrumb](Breadcrumb.md), Date Picker.

### `HeaderBusca`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | Nome do campo para leitor de tela. |
| `recolhida` | `boolean` | não | Começa como só a lupa (32px); clicar abre a caixa de 184 com movimento (`base` · `enter`) e o foco entra; sem texto, fecha ao sair ou no Escape. ADR-028. |

### `HeaderFiltros`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | Texto do botão; com `recolhido`, nome acessível e tooltip. |
| `contagem` | `number` | não | Filtros ativos. Acima de zero, `soft` com a conta (pílula no rótulo; selo no canto quando recolhido). |
| `rotuloComContagem` | `(n: number) => string` | não | Nome acessível com a conta. Padrão: `"rotulo (n)"`. |
| `recolhido` | `boolean` | não | Só o ícone (28px), com tooltip. Mesma regra da busca. |

**Quando recolher** (humano, 2026-09-23 e 24): a fileira de ações só tem
botões → busca aberta e filtros com rótulo. Tem troca-visão, período ou
seletor de data — ou a tela abre o registro ao lado (`lateral` da `TelaBase`),
e a fileira encolhe quando ele abre → `recolhida` e `recolhido`. A escolha é por tela, não por
largura: o estado não muda quando a janela encolhe. Busca e filtros são
sempre `HeaderBusca` e `HeaderFiltros` — os botões com texto do arquivo
(601:12) não se usam (AUD-204). O `HeaderDivisor` só entra entre o grupo de
visão e a ação principal; fileira só com busca, filtros e a ação não leva.

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
era bug). Não lidas em `accent` + `primary` com o ponto azul; lidas em `background` +
`subtle-foreground`. Usa o `PainelFlutuante` do [Popover](Popover.md).

## Variantes

Não tem. Ver "Par no Figma".

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| repouso | `px-8 py-4 bg-background, sem traço embaixo · linha de cima min-h-8 · 6 até o título (gap-1.5), h1 no topo da fileira (items-start) · ações gap-2` | humano | ADR-029 |
| sem espaço | `ações descem para linha própria (flex-wrap + ml-auto) e quebram entre si; abaixo de 640 da largura do Header (container query) trilha, título e ações centrados` | humano | E3 · ADR-032 |
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

`background` · `foreground` · `muted-foreground` · `card` ·
`divider` · `destructive` · `primary-foreground` · `ring` · `overlay/*` (painel
de notificações da tela) · `text/heading-1` ·
`text/body-sm` · `text/label-sm` · `text/label-lg` · `radius/md` ·
`radius/full` · `button inner shadow`

## Composição

Usa: Button · Tooltip · (por encaixe) Breadcrumb, SegmentedControl, ViewSwitcher, DateRangePicker · Usado por: —

## Exemplo de uso

```tsx
<Header
  titulo="Comercial"
  trilha={<Breadcrumb ancestrais rotulo="Trilha de navegação" rotuloRecolhidos={(n) => `Mostrar ${n} níveis ocultos`} itens={[{ rotulo: "Início", href: "/" }, { rotulo: "Pipelines", href: "/pipelines" }]} link={Link} />}
  utilitarios={<HeaderNotificacoes rotulo={t("notificacoes", { n })} contagem={n} />}
  acoes={
    <>
      <HeaderBusca recolhida rotulo={t("pesquisar")} placeholder={t("pesquisar")} value={busca} onChange={(e) => setBusca(e.target.value)} />
      <HeaderFiltros recolhido rotulo={t("filtros")} contagem={filtrosAtivos} rotuloComContagem={(n) => t("filtrosAtivos", { n })} />
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
| Teclado | Ordem natural: menu, trilha, ações, sino. Controles segmentados entram por uma opção só e andam por setas |
| Nome acessível | Sino, filtros recolhidos e opções do View Switcher só têm ícone: `aria-label` obrigatório e tooltip com o mesmo texto; selo e pílula `aria-hidden` (a contagem vai no rótulo) |
| Foco visível | Outline com folga (D6) em todos os controles |
| Texto longo | O título trunca com `title` e nunca fica com menos de 160px: antes disso as ações descem de linha, em vez de vazar |
| Zoom | Nenhuma largura fixa além da busca (184, com `max-w-full`) |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-120, AUD-121, AUD-122, AUD-123, AUD-124, AUD-125, AUD-126, AUD-127, AUD-128 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
