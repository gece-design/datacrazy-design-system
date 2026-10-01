# Componente: Textarea

## Responsabilidade

Receber um texto de várias linhas — observação, nota interna, a mensagem do chat — na mesma caixa do Input, crescendo com o conteúdo.

## Quando usar

- **Use** para texto de várias linhas: observação, nota interna, mensagem. Com `rotuloOculto` e `linhas={1}`, é o compositor do chat.
- **Não use** para valor curto: é `Input`.
- **Não use** `<textarea>` cru nem altura fixa em px: use `linhas` e `maximoDeLinhas`.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Sem par no arquivo. Nasceu da tela de Atendimento (2026-09-29): o compositor do
chat e a nota interna precisam de várias linhas e o DS só tinha o Input de uma.
Herda a caixa do Input (`caixaDeCampo`, node 544:129) — traço, foco, erro e
desabilitado são os dele. Registrado no ADR-042; o Figma acompanha na remedição.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `rotulo` | `string` | — | sim | Texto do rótulo. Visível, salvo com `rotuloOculto`. |
| `rotuloOculto` | `boolean` | `false` | não | Tira o rótulo da tela e o mantém para o leitor de tela: o compositor do chat. |
| `erro` | `string` | — | não | Mensagem de erro. Presente = estado de erro. |
| `linhas` | `number` | `3` | não | Linhas em repouso. |
| `maximoDeLinhas` | `number` | `8` | não | Cresce com o texto até este número de linhas; depois rola por dentro. |
| `value`, `onChange`, `placeholder`, `disabled`, `name`… | nativos | — | não | Repassados ao `<textarea>`. `rows` não: use `linhas`. |

## Variantes

| Variante | Quando usar |
|----------|-------------|
| com rótulo | Formulário: observação, descrição, motivo. |
| `rotuloOculto` com `linhas={1}` | Compositor do chat: nasce com uma linha e cresce. Enter envia e Shift+Enter quebra linha é regra da tela, não do componente. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `border-input-border-hover (fora do foco)` | banco | I1 |
| focus | `border-input-border-focus + ring-1 inset` | banco | Input (mesma caixa, lib/campo.ts) |
| erro | `border-input-border-error + caption destructive + aria-invalid` | banco | Input (mesma caixa, lib/campo.ts) |
| disabled | `bg-input-bg-disabled + text-input-text-disabled` | banco | Input (mesma caixa, lib/campo.ts) |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`input/bg` · `input/border` · `input/border-hover` · `input/border-focus` ·
`input/border-error` · `input/bg-disabled` · `input/text` ·
`input/text-disabled` · `input/placeholder` · `input/label` · `destructive` ·
`divider` · `radius/md` · `text/body-md` · `text/label-md` · `text/caption`

## Composição

Usa: `caixaDeCampo`, `rotuloDeCampo` e `erroDeCampo` de `lib/campo.ts` e `rolagemDiscreta` de `lib/estados.ts` ·
Usado por: a tela de Atendimento (compositor e nota interna) e a página do Input.

## Exemplo de uso

```tsx
<Textarea
  rotulo="Observação"
  placeholder="O que o próximo atendente precisa saber"
  value={observacao}
  onChange={(e) => setObservacao(e.target.value)}
/>
```

No compositor do chat:

```tsx
<Textarea
  rotulo="Mensagem"
  rotuloOculto
  linhas={1}
  maximoDeLinhas={6}
  placeholder="Escreva uma mensagem"
  value={texto}
  onChange={(e) => setTexto(e.target.value)}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | O traço e o anel interno da caixa do Input (`focus-within`) |
| Papel/rótulo | `<label htmlFor>` sempre presente; `rotuloOculto` só tira da tela (`sr-only`) |
| Erro | `aria-invalid` e `aria-describedby` apontando a mensagem |
| Teclado | Nativo. Tab entra e sai; o campo não prende o foco |
| Texto longo | Cresce até `maximoDeLinhas` e rola por dentro, com a barra discreta do DS |
| Zoom | Altura em linhas, não em px fixos: acompanha o tamanho do texto |
