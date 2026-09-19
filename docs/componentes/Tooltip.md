# Componente: Tooltip

## Responsabilidade

Mostrar um texto curto ancorado num gatilho, por cursor ou teclado.

## Família

`overlay` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `548:73` (canvas `↳ Feedback`, 8 variantes: Position × theme) · Lote: `2` ·
Última verificação: `diff 9,50%` (Top claro) — **acima do limite de 1%**, ver divergência 7.

## Props

`Tooltip` — embrulha o gatilho.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `content` | `ReactNode` | — | sim | O texto do balão. |
| `position` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | não | Lado preferido. Vira para o oposto se não couber. |
| `delay` | `number` | `400` | não | Espera antes de abrir pelo cursor. Pelo teclado abre na hora. |
| `children` | `ReactElement` | — | sim | Um elemento só, focável, que repasse os eventos. |

`TooltipContent` — só o balão e a seta, sem comportamento. Aceita `position`.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `top` | Padrão. |
| `bottom` | Gatilho no topo da tela ou de um painel. |
| `left` / `right` | Gatilho numa coluna estreita, como a sidebar recolhida. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| clique | `fecha o balão (o clique abriu outra coisa por cima)` | declarado | sino do Header tapado pelo próprio tooltip |
| visivel | `cursor após 400ms (exceto toque) · foco de teclado na hora · Escape e blur fecham` | declarado | L12 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`surface-inverse` · `primary-foreground` · `radius/md` · `elevation/md` ·
`text/caption` · `z/popover`

## Composição

Usa: — · Usado por: —

## Exemplo de uso

```tsx
<Tooltip content="Copiar para a área de transferência">
  <Button variant="secondary" aria-label="Copiar">
    <Copy size={16} weight="regular" />
  </Button>
</Tooltip>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel/rótulo | Balão com `role="tooltip"`; gatilho com `aria-describedby`. Fechado, o texto fica no DOM com `hidden`, então a descrição existe desde o primeiro foco |
| Teclado | Abre com foco de teclado (`:focus-visible`), fecha no blur e no Escape |
| Toque | **Ignorado de propósito**: não há `pointerleave` no toque e o balão ficaria preso. O conteúdo não pode ser a única via para a informação |
| Posição | Portal no `body`, `fixed`, medido antes de pintar; vira de lado e se ajusta para ficar a 8px da borda da janela (E3) |
| Camada | `z-popover` (E2) |
| Movimento | Entra em `fade-in-fast` e sai em `fade-out-fast` (150ms): um balão que demora a sumir fica por cima do próximo gatilho |
| Contraste | `primary-foreground` sobre `surface-inverse` nos dois temas |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-192, AUD-193, AUD-194, AUD-195, AUD-196, AUD-197, AUD-198 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
