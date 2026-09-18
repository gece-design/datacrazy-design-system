# Componente: Input

## Responsabilidade

Receber um valor curto digitado, com rótulo visível e erro inline.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `535:48` ("Field", canvas do Drawer) · Lote: `3` · Junto: Rating
`590:3000` e Select de formulário `544:129`.

Diff de pixels **não medido** (`figma-console` fora do ar).

## Props

### `Input`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | Rótulo sempre visível, ligado ao campo por `htmlFor`. |
| `erro` | `string` | não | Presente = estado de erro, com a mensagem embaixo. |
| `iconeInicio` | `Icon` | não | Ícone de 16px antes do texto. |
| `acoes` | `ReactNode` | não | Ações de 16px depois do texto (`AcaoCampo`). |
| `cartao` | `boolean` | não | Põe o campo no cartão do drawer: rótulo em bold, superfície própria, caixa sangrando 8px para os lados. Em formulário aberto não use. |
| demais | `InputHTMLAttributes` | — | `value`, `placeholder`, `disabled`… vão para o `<input>`. |

### `AcaoCampo`

`icone` e `rotulo` (obrigatório — é botão só de ícone).

### `AcaoCopiar`

`rotulo` e `rotuloCopiado`. Copia o valor atual do próprio campo (lido pelo
contexto do Input) e vira um check em `success` por 1,5s, anunciado por
`role="status"`. Campo vazio: só leva o foco para ele.

### `Rating`

`rotulo`, `valor`, `max` (padrão **10**, decisão do humano em 2026-09-17) e
`aoMudar`. Sem `aoMudar`, é só leitura. Acima de seis estrelas elas caem de 20
para 16px e o respiro de 8 para 4 — senão a fileira não cabe na coluna do
formulário.

**Não usa a caixa do Input em momento nenhum** (decisão do humano,
2026-09-18): é o mesmo cartão do `CampoEditavel` — superfície `background/50`
em repouso, `accent` sob o cursor, 12px de respiro e rótulo em bold. A caixa
tinha `overflow-hidden`, e em coluna estreita — o drawer dentro do preview —
cortava a última estrela; agora a fileira quebra de linha em vez de cortar. A
nota sai também em número (`7/10`) no fim da linha do rótulo, para não obrigar
a contar estrela.

Hover e foco mostram a nota que o clique daria; o clique responde com um pulo
da estrela em cascata e um halo que some crescendo. Tudo sob `motion-safe:`
(regra I12): quem pede menos movimento ao sistema vê a nota mudar sem animação.

### `CartaoDeCampo`

`rotulo`, `para` (o `id` do controle, quando couber `<label htmlFor>`) e o
filho, que é a caixa. É o cartão para quem já traz a própria caixa e não tem
prop `cartao` — no drawer, o Select de formulário. `Input` e `InputTelefone`
fazem o mesmo por dentro com `cartao`.

O rótulo fica nos 12px de respiro do cartão (é ele que alinha a grade) e a
caixa sangra 8px para os lados. Sem essa sangria um telefone com máscara
trunca dentro da coluna de 232px do drawer — e truncar mudo é bug conhecido
(#83283).

### Select de formulário

`<Select size="field" />` — ver [Select](Select.md).

## Variantes

Não tem eixo de variante. Os cinco "estados" do arquivo são estado de verdade
(abaixo), e `Filled` é só o campo com valor.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `border-input-border-hover (fora do foco)` | banco | I1 |
| focus | `border-input-border-focus + ring-1 inset` | figma | — |
| erro | `border-input-border-error + caption destructive + aria-invalid` | figma | — |
| disabled | `bg-input-bg-disabled + text-input-text-disabled` | figma | — |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`input/bg` · `input/border` · `input/border-hover` · `input/border-focus` ·
`input/border-error` · `input/text` · `input/placeholder` · `input/label` ·
`input/bg-disabled` · `input/text-disabled` · `destructive` · `muted-foreground` ·
`primary` · `accent` (realce do cartão sob o cursor) · `background/50`
(superfície do cartão em repouso — **falta token** de superfície sutil) ·
`base/blue/300` · `radius/md` · `radius/lg` · `text/label-md` · `text/body-md` ·
`text/caption`

## Composição

Usa: Phosphor ·
Usado por: [Drawer](Drawer.md) (Perfil e Campos adicionais) ·
Vizinhos que compartilham a caixa: [Telefone](Telefone.md) e
[TimePicker](TimePicker.md)

## Exemplo de uso

```tsx
<Input rotulo="E-mail" placeholder="Exemplo: email@dominio.com" />

<Input
  rotulo="Site"
  defaultValue="joeljota.com.br"
  acoes={<AcaoCampo icone={Copy} rotulo="Copiar site" onClick={copiar} />}
/>

<Rating rotulo="ScoreDavi" valor={nota} aoMudar={setNota} />
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Rótulo | `<label htmlFor>` sempre visível — placeholder não substitui nome |
| Erro | `aria-invalid` e `aria-describedby` apontando para a mensagem (regra E6) |
| Foco visível | Traço + anel interno somando 2px em `input/border-focus` |
| Ações | `AcaoCampo` é `<button>` com `aria-label` e `title` (regra E7) |
| Rating | `role="radiogroup"` com estrelas `role="radio"`; setas, Home e End mudam a nota |
| Alvo de toque | Caixa de 36px e estrela de 20px — **abaixo dos 44 da regra I15** |

## Divergências abertas (para o gate)

1. **Cor das estrelas.** O arquivo pinta cheia em `primary` e vazia em
   `base/blue/300`; a descrição do Rating no Figma promete `foreground` e
   `subtle-foreground`. O código segue a pintura.
2. **Foco com 2px de outro jeito.** O arquivo troca a borda para 2px; aqui é
   borda de 1 + anel interno de 1, para o texto não pular.
3. **Hover não desenhado.** Vem da regra I1, apoiado no token
   `input/border-hover`, que já existia.
4. **Rating com hover de pré-visualização e animação de clique.** O arquivo
   não desenha nenhum dos dois; entraram por pedido do humano (2026-09-18),
   sob a exceção E-01.
5. **Rating de 0 a 10.** O arquivo desenha cinco estrelas; o padrão do código é
   dez, por decisão do humano. `max={5}` volta ao desenho.
6. **`CampoEditavel` não está no arquivo.** Clicar para editar é pedido do
   humano (2026-09-17): em tela de leitura o campo é texto até o clique.
   Desde 2026-09-18 o bloco é cartão: superfície própria em repouso
   (`background/50`), realce `accent` sob o cursor, 12px de respiro, rótulo em
   bold e valor na mesma margem do rótulo. A caixa do Input só aparece no
   clique, por dentro do cartão. Tela de leitura não tem cara de formulário.
7. **Lista aberta do Select de formulário** é a mesma derivação do
   [Select](Select.md).
