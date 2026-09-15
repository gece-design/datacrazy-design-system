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
| aberto | `cursor após 400ms (exceto toque) · foco de teclado na hora · Escape e blur fecham` | declarado | E7 |
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
| Movimento | Dissolve ao abrir em 150ms (`fade-in-fast`); fecha seco, para não ficar por cima do próximo gatilho. Sob `motion-safe:` (I12) |
| Contraste | `primary-foreground` sobre `surface-inverse` nos dois temas |

## Divergências abertas (para o gate)

1. **Left e Right do arquivo não seguem Top e Bottom.** Top e Bottom nomeiam o
   lado onde o balão fica, com a seta apontando para o gatilho. No claro, Left e
   Right têm a seta do lado do nome — o contrário. No escuro, a seta está do lado
   certo mas gira para dentro do balão. Aqui os quatro seguem Top e Bottom.
2. **Distância até o gatilho (4px), margem até a janela (8px) e espera de 400ms**
   não estão no arquivo, que desenha o balão solto.
3. **Largura máxima de 320px** (`max-w-xs`). O arquivo usa uma linha só; acima
   disso o texto quebra em vez de atravessar a janela.
4. **Com a posição ajustada na borda, a seta continua no centro do balão** e pode
   não apontar para o meio do gatilho.
5. **Sem equivalente de toque** (G7). Falta decidir se toque longo abre.
6. **Ligado sempre, não só quando o texto corta.** Isso é o primitivo `Truncate`
   do roadmap, que ainda não existe.
7. **Diff de 9,5% é do texto.** Das 516 diferenças, 3 ficam fora da linha de
   texto: o balão tem 26 de altura, a seta 10×6 no lugar certo. O texto mede
   160,3 no navegador contra 161 no arquivo, e esse ajuste abaixo de 1px
   desloca todos os glifos. Numa peça de 181×30 o texto é metade da área, então
   o limite de 1% não fecha só com antialias.
