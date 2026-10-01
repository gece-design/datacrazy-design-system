# Componente: SegmentedControl

## Responsabilidade

Escolha exclusiva à vista entre 2 e 4 opções — período, escopo, visualização.

## Quando usar

- **Use** para alternar entre 2 e 4 opções à vista que mudam o que a tela mostra (período, escopo).
- **Use** `ViewSwitcher` para trocar a visualização do mesmo dado (quadro, lista, calendário), com ícone.
- **Não use** para seções de um registro: é `Tabs`.
- **Não use** para valor de formulário: `RadioGroup` ou `Select`.
- **Não use** com mais de 4 opções: é `Select`.

## Família

`navegacao` — define a regra de estado herdada
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
| `SegmentedControl` | trilha `card` h32 recuo 4 · opção h28 px10 raio 6 · `body-md`. No `Header`: trilha h28, opção h24 (ADR-057) |
| `ViewSwitcher` | trilha `card` h32 recuo 2, mínimo 116 · opções dividem a largura, raio 4 · ícone 16. No `Header`: trilha h28 (ADR-057) |

As variantes `Selected=Default/Active` do set 269:68 são o gatilho do Date
Picker, que já existe.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| selecionada | `Segmented: bg-segmented-item-selected text-overlay-item-text-selected · View: + text-primary e sombra interna (só no Claro) · aria-checked` | figma | Selected=Mês (269:54) · View=Chart (471:2940) |
| hover | `text-foreground` | inferido | L2 |
| focus | `outline-2 outline-offset-2 outline-ring` | declarado | D6 |
| disabled | `opacity-50 pointer-events-none, pulada pelas setas` | banco | I5 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`card` (trilho sobre o fundo da aplicação) · `background` (trilho dentro do
painel da tela, `data-superficie` — ADR-055) · `segmented-item-selected` · `overlay/item-text-selected` · `primary` ·
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

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-154, AUD-155, AUD-156, AUD-157, AUD-158 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
