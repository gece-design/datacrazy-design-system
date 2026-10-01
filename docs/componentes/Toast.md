# Componente: Toast

## Responsabilidade

Confirmar o resultado de uma ação sem bloquear a tela.

## Quando usar

- **Use** para confirmar o resultado de uma ação sem bloquear: salvo, movido, transferido, erro que dá para tentar de novo.
- **Não use** para erro de campo: o erro é inline, no próprio campo.
- **Não use** para pedir decisão: é `Modal`.
- **Não use** para conteúdo que a pessoa precisa consultar depois: ele some.

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
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
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

Usa: `BotaoFechar` do [Button](Button.md) em `size="icon-xs"` (24px, glifo 14 — a medida do arquivo).


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

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-186, AUD-187, AUD-188, AUD-189, AUD-190, AUD-191 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
