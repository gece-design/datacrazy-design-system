# Componente: Toast

## Responsabilidade

Confirmar o resultado de uma ação sem bloquear a tela.

## Família

`feedback` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `548:52` (canvas `↳ Feedback`, 8 variantes: Type × theme) · Lote: `2` ·
Última verificação: `diff 0,87%` (Success claro, 380×66, mesmo texto do arquivo).
Medido no render, nos dois temas: 380×66, raio 6, círculo de 28 em (16,16),
barra de 3, texto em (56,16), X de 24 a 12 da direita.

Tema não virou prop: é token, e um componente atende os dois temas.

## Props

`Toast` — o cartão.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `variant` | `"success" \| "destructive" \| "warning" \| "info"` | `"success"` | não | Cor da barra, do glifo e do círculo. |
| `titulo` | `string` | — | sim | O que aconteceu. |
| `descricao` | `string` | — | não | Uma linha de detalhe. |
| `aoFechar` | `() => void` | — | não | Sem ele, o X não aparece. |
| `rotuloFechar` | `string` | `"Fechar notificação"` | não | Nome do X para leitor de tela. |

`Toaster` — a fila. Monte uma vez; dispare com `toast({ variant, titulo, descricao, duracao })`,
que devolve o id para `fecharToast(id)`.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `maximo` | `number` | `3` | não | Quantos ficam visíveis. O mais antigo sai primeiro. |
| `rotulo` | `string` | `"Notificações"` | não | Nome da região para leitor de tela. |
| `rotuloFechar` | `string` | — | não | Repassado a cada cartão. |

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `success` | A ação terminou como a pessoa esperava. Glifo `Check`. |
| `destructive` | A ação falhou. Glifo `Warning`. No arquivo, `Error`. |
| `warning` | Terminou, com ressalva. Glifo `Warning` — o título precisa dizer a diferença para o erro. |
| `info` | Algo aconteceu longe do foco. Glifo `ChatText`. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `X: bg-overlay-item-hover text-foreground` | inferido | Pagination (overlay/item-hover) |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | I4 |
| pausado | `relógio parado com cursor ou foco dentro` | declarado | roadmap-componentes § Toast |
| saindo | `translate-x-[calc(100%+1rem)] opacity-0, depois grid-rows-[0fr] -mt-2` | humano | I12 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`overlay/bg` · `overlay/border` · `overlay/item-hover` · `success` ·
`destructive` · `warning` · `info` · `foreground` · `muted-foreground` ·
`ring` · `radius/md` · `elevation/lg` · `text/label-lg` · `text/body-sm` ·
`z/toast`

## Composição

Usa: `Check`, `Warning`, `ChatText` e `X` do Phosphor · Usado por: —

## Exemplo de uso

```tsx
<Toaster />

toast({ variant: "success", titulo: "Negócio salvo", descricao: "As alterações já aparecem no funil." });
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Anúncio | A lista do `Toaster` é `aria-live="polite"` e existe desde o primeiro render — região criada junto com a mensagem costuma não ser lida |
| Tempo de leitura | 8s por padrão (`duracao`), e o relógio para com cursor ou foco em cima |
| Papel/rótulo | X é `<button>` com `aria-label` vindo de fora |
| Foco visível | `outline` com offset (regra D6) |
| Alvo de toque | X de 24px — **abaixo dos 44 da regra I15** |
| Movimento | Entra abrindo o espaço (200ms) e dissolvendo (250ms); sai deslizando para a direita (200ms) e depois fecha o vão (200ms). Tudo sob `motion-safe:` — com `prefers-reduced-motion`, aparece e some na hora (I12) |
| Cor não é o único sinal | Glifo por variante; erro e atenção compartilham o glifo, então o título carrega a diferença |

## Divergências abertas (para o gate)

1. **Tema escuro do círculo e do glifo.** No arquivo, as variantes `theme=Dark`
   pintam o círculo e o glifo com o valor **claro** do token (`success`
   `#267952` a 12% sobre `#25252D`), enquanto a barra usa o escuro (`#64CEA2`).
   É o modo da variável errado na camada `Icon`. Aqui os três seguem o token,
   então no escuro o círculo e o glifo saem mais claros que no arquivo.
2. **12% medido, não lido.** O Figma não exporta a opacidade do preenchimento do
   círculo. As quatro variantes do claro fecham em 0,12 nos três canais do pixel.
   A ponte do Figma desktop estava desconectada para ler o valor direto.
3. **Fila, posição e tempo não estão no arquivo.** Canto inferior direito a 16px,
   8px entre cartões, três visíveis e 8s são derivação. O humano pediu mais
   tempo que os 5s de antes (2026-09-15); os 8s são o valor escolhido.
4. **Texto quebra linha.** O arquivo usa texto numa linha só; aqui quebra, para
   não truncar mudo (E1) em `es` e `pt-br`.
5. **Hover do X** usa `overlay/item-hover` (E-01). Não está desenhado.
6. **Movimento não está no arquivo nem tem token.** Durações e curvas vivem
   nomeadas em `tailwind.config.ts` (`fade-in`, `toast-open`) até a pendência 4
   de `02-design-system.md` fechar. Pedido do humano em 2026-09-15: dissolver na
   entrada, deslizar para o lado na saída.
