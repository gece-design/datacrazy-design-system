# Componente: Switch

## Responsabilidade

Ligar ou desligar algo que passa a valer na hora, sem botão de salvar.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `547:66` (component set "Switch", canvas `↳ Form controls`) · Também
instanciado no drawer (`595:10896`), só desligado · Lote: `3` (antecipado) ·
Última verificação: **2026-09-14**, medição de valor computado — trilho,
botão, posição do botão, cores e gap nos 4 estados × 2 temas, em densidade 1× e
2×. Zero divergência. Diff de pixels não medido (ponte `figma-console` fora do ar).

A primeira versão deste arquivo saiu da instância do drawer, com o ligado e o
desabilitado derivados. Foi substituída por esta, que segue o component set —
acordado com a sessão do drawer em 2026-09-14.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `children` | `ReactNode` | — | não | Rótulo: **o que** liga. Sem ele, `aria-label`. |
| `linha` | `boolean` | `false` | não | A linha inteira é o alvo do clique: texto à esquerda, Switch à direita, toda a largura. O Switch de lista (reunião de 2026-09-18). |
| `descricao` | `ReactNode` | — | não | Segunda linha do rótulo, em `muted-foreground`. Só com `linha`. |
| `checked` / `defaultChecked` | `boolean` | — | não | Controlado ou solto. |
| `onChange` | `ChangeEventHandler` | — | não | Evento nativo: `e.target.checked`. |
| `disabled`, `name`, `aria-*` | nativos | — | não | Repassados ao `<input>`. |

É um `<input type="checkbox" role="switch">`.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| com rótulo | Preferência isolada ("Notificações por e-mail"). |
| sem rótulo | Linha de lista (automações, integrações), com `aria-label` citando o item. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `bg-input-border-hover (desligado) · bg-primary-hover (ligado)` | banco | I1 |
| focus | `outline outline-2 outline-offset-2 outline-ring no trilho (peer-focus-visible)` | banco | D6 |
| ligado | `bg-primary + botao translate-x-4` | figma | — |
| disabled | `bg-input-bg-disabled · ligado bg-subtle-foreground · rotulo input-text-disabled` | figma | — |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`input/border` · `input/border-hover` · `input/bg-disabled` ·
`input/text-disabled` · `primary` · `primary-hover` · `subtle-foreground` ·
`card` · `foreground` · `ring` · `radius/full` · `text/body-md`

## Composição

Usa: nenhum componente do DS — é primitivo ·
Usado por: Drawer (`components/ui/drawer.tsx`) e a página do Input, da outra
frente de trabalho.

## Exemplo de uso

```tsx
<Switch checked={ativa} onChange={(e) => alternarAutomacao(e.target.checked)}>
  {t("notificacoesPorEmail")}
</Switch>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | Outline de 2px com respiro transparente (D6), no trilho |
| Papel/rótulo | `role="switch"`: anuncia ligado/desligado |
| Teclado | Espaço alterna — nativo. Verificado com Playwright |
| Estado sem depender de cor | O botão muda de lado (E7) |
| Alvo de toque | 20px de trilho, estendido pelo `<label>`. Abaixo dos 44px da I15 |
| Movimento | Botão desliza 16px; `motion-reduce` desliga a transição |
| Contraste | Ver divergências 1 e 2 |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-163, AUD-164, AUD-165, AUD-166, AUD-167 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
