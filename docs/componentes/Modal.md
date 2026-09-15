# Componente: Modal

## Responsabilidade

Pedir uma decisão bloqueando a tela até ela ser tomada.

## Família

`overlay` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `545:168` (12 variantes: Type × Size × theme) · Lote: `3` ·
Última verificação: `diff 0,90%` claro · `0,94%` escuro (Destructive sm, 400×240,
mesmo texto do arquivo; 0,19% e 0,32% fora do rodapé, onde mora a divergência 5).
Medido no render, nos dois temas: 400×240, raio 8, círculo de 40 em (20,20),
título em (72,20), X de 28 a 20 da direita, traço do rodapé em 176, botões em 188.

Tema não virou prop: é token, e um componente atende os dois temas.

## Props

`ModalPainel` — a caixa.

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `variant` | `"default" \| "destructive"` | `"default"` | não | O destrutivo põe o alerta ao lado do título. |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` | não | Largura: 400, 520 ou 720px. |
| `titulo` | `string` | — | sim | A decisão pedida. Vira o nome do diálogo. |
| `descricao` | `string` | — | não | Uma linha de consequência. Vira a descrição do diálogo. |
| `acoes` | `ReactNode` | — | não | Botões do rodapé. Sem eles, não há rodapé. |
| `aoFechar` | `() => void` | — | não | Sem ele, o X não aparece. |
| `rotuloFechar` | `string` | `"Fechar"` | não | Nome do X para leitor de tela. |
| `children` | `ReactNode` | — | não | O corpo. Rola quando não cabe. |

`Modal` — a camada. Recebe tudo do `ModalPainel`, mais:

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `aberto` | `boolean` | — | sim | Mostra ou não a camada. |
| `aoFechar` | `() => void` | — | sim | X, Escape e clique no fundo chamam. |
| `fecharNoFundo` | `boolean` | `variant !== "destructive"` | não | Clique no fundo fecha. |

## Variantes

| Variante | Quando usar |
|----------|-------------|
| `default` | Decidir e seguir: renomear, aplicar filtro, formulário curto. |
| `destructive` | Confirmar o que não tem volta: excluir negócio, remover integração. Foco abre no Cancelar (`autoFocus`). |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `X: bg-overlay-item-hover text-foreground` | inferido | Toast (X do cartao) |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | I4 |
| aberto | `portal no body, z-modal, scrim overlay/scrim 40%, foco preso, Escape fecha, rolagem travada, foco volta ao gatilho` | declarado | E7 |
| fundo | `clique no scrim fecha; no destructive nao fecha (fecharNoFundo troca)` | inferido | roadmap-componentes § Confirm Dialog |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`overlay/bg` · `overlay/border` · `overlay/item-hover` · `overlay/scrim` ·
`border` · `destructive` · `foreground` · `muted-foreground` · `ring` ·
`radius/lg` · `radius/md` · `elevation/xl` · `text/heading-3` ·
`text/body-sm` · `z/modal`

## Composição

Usa: `Warning` e `X` do Phosphor · `useCamada` (`lib/use-camada.ts`) ·
nos exemplos, [Button](../../components/ui/button.tsx) e [Input](Input.md) ·
Usado por: —

## Exemplo de uso

```tsx
<Modal
  aberto={aberto}
  aoFechar={() => setAberto(false)}
  variant="destructive"
  titulo="Excluir negócio?"
  descricao="Ele sai do funil e do histórico. Não dá para desfazer."
  acoes={
    <>
      <Button variant="outline" autoFocus onClick={() => setAberto(false)}>Cancelar</Button>
      <Button variant="destructive" onClick={excluir}><Trash size={16} />Excluir</Button>
    </>
  }
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel/rótulo | `role="dialog"` + `aria-modal`; nome pelo título (`aria-labelledby`), descrição por `aria-describedby` |
| Foco | Preso na caixa (Tab e Shift+Tab giram), Escape fecha, foco volta ao gatilho. Só a camada do topo escuta |
| Foco visível | `outline` com offset (regra D6) |
| Rolagem | Página de trás travada, com a largura da barra compensada; o corpo rola, cabeçalho e rodapé ficam |
| Zoom | Caixa limitada à janela menos 16px de cada lado |
| Alvo de toque | X de 28px — **abaixo dos 44 da regra I15** |
| Movimento | Fundo e caixa dissolvem em 150ms na entrada, sob `motion-safe:` (I12). Saída seca |
| Cor não é o único sinal | Destrutivo tem glifo de alerta, e o botão de confirmar diz o que faz ("Excluir") |

## Divergências abertas (para o gate)

1. **Alerta no escuro.** O arquivo pinta círculo e glifo com o `destructive`
   **claro** (`#C6323C`) nas variantes `theme=Dark`, e o botão com o escuro
   (`#EB7076`). Mesmo erro de modo da camada `Icon` do Toast. Aqui os dois
   seguem o token.
2. **12% medido, não lido.** O Figma não exporta a opacidade do círculo; o pixel
   fecha em 0,12 nos três canais do claro. Ponte do Figma desktop desligada.
3. **Cancelar no escuro.** No arquivo é o Ghost escuro (331:762): sem traço,
   texto `muted-foreground`. O `outline` do código mantém traço `background` e
   texto `surface-inverse` nos dois temas — resolver pede token por tema no
   Button, não no Modal.
4. **Lixeira do escuro** sai `#1C1C25` no arquivo, e o texto do mesmo botão
   `primary-foreground` (`#10131A`). O código usa a cor do texto nos dois.
5. **Texto e vão dos botões.** Arquivo: 12px e 6px entre ícone e texto; Button
   do código: 13px e 8px. Divergência já aberta no Button.
6. **Não está no arquivo:** fundo (40%, derivado do Drawer), foco preso,
   Escape, clique fora, movimento, quebra de linha do título e vão de 12 entre
   título e X.
