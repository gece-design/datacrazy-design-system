# Componente: SegmentedControl

## Responsabilidade

Escolha exclusiva à vista entre 2 e 4 opções — período, escopo, visualização.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Nodes: `269:68` (set "Segmented Control", 10 variantes Selected × theme) e
`471:2947` (set "View Switcher", 6 variantes View × theme) · Lote: `3` ·
Última verificação: ver [processo/kfe-state.md](../processo/kfe-state.md), entrada de 2026-09-15.

Dois sets, duas exportações no mesmo arquivo (`segmented-control.tsx`): a
geometria muda, o comportamento não.

## Props

`SegmentedControl` e `ViewSwitcher` recebem as mesmas props.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `itens` | `OpcaoSegmentada[]` · `OpcaoDeVisualizacao[]` | — | sim | `valor`, `rotulo`, `disabled?`; no View Switcher também `icone`. |
| `atual` | `string` | — | sim | O `valor` selecionado. |
| `aoEscolher` | `(valor: string) => void` | — | sim | Clique e setas. |
| `rotulo` | `string` | — | sim | Nome do grupo para leitor de tela. |

## Variantes

| Exportação | Geometria |
|---|---|
| `SegmentedControl` | trilha `card` h32 recuo 4 · opção h28 px10 raio 6 · `body-md` |
| `ViewSwitcher` | trilha `card` h32 recuo 2, mínimo 116 · opções dividem a largura, raio 4 · ícone 16 |

As variantes `Selected=Default/Active` do set 269:68 são o gatilho do Date
Picker, que já existe.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| selecionada | `Segmented: bg-accent text-overlay-item-text-selected · View: bg-accent text-primary shadow-button-inner · aria-checked` | figma | Selected=Mês (269:54) · View=Chart (471:2940) |
| hover | `text-foreground` | inferido | Tabs |
| focus | `outline-2 outline-offset-2 outline-ring` | declarado | D6 |
| disabled | `opacity-50 pointer-events-none, pulada pelas setas` | banco | I5 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`card` · `accent` · `overlay/item-text-selected` · `primary` ·
`muted-foreground` · `foreground` · `ring` · `radius/md` · `radius/sm` ·
`text/body-md` · `button inner shadow`

## Composição

Usa: Tooltip (View Switcher) · Usado por: Header (por encaixe)

## Exemplo de uso

```tsx
<SegmentedControl rotulo={t("periodo")} itens={periodos} atual={periodo} aoEscolher={setPeriodo} />
<ViewSwitcher rotulo={t("visualizacao")} itens={visoes} atual={visao} aoEscolher={setVisao} />
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `radiogroup` com `aria-label`; opções `radio` com `aria-checked` |
| Teclado | Tab entra só na selecionada; setas (4 direções) movem e selecionam; Home e End às pontas |
| Nome acessível | View Switcher só tem ícone: `aria-label` = rótulo, e tooltip com o mesmo texto |
| Cor não é o único sinal | Selecionada tem superfície `accent` além da cor do texto |
| Texto longo | Opção encolhe e trunca com `title` |

## Divergências abertas (para o gate)

1. **"Semana" em `label-lg`** no arquivo, as outras em `body-md`. Código usa
   `body-md` em todas: peso por opção muda a largura quando a seleção troca.
2. **Descrição do set diz "ativa recebe superfície card"**; o desenho usa `accent`. Código segue o desenho.
3. **View Switcher escuro sem sombra interna** no arquivo; o código mantém a
   sombra nos dois temas (a sombra não tem token por tema).
4. **Hover não está desenhado.**
