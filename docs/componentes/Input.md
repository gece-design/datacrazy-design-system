# Componente: Input

## Responsabilidade

Receber um valor curto digitado, com rótulo visível e erro inline.

## Quando usar

- **Use** para um valor curto, de uma linha, com rótulo visível.
- **Use** `CampoEditavel` no cartão do drawer: o valor aparece como texto e vira campo no clique.
- **Não use** para várias linhas (`Textarea`), telefone (`InputTelefone`), escolha em lista (`Select`) ou data (`DatePicker`).
- **Não use** `<input>` cru nem placeholder no lugar do rótulo.

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
| `ajuda` | `string` | não | Texto de apoio sob o campo: para que ele serve, quando o rótulo não basta. Some enquanto há `erro` (ADR-071). |
| `obrigatorio` | `boolean` | não | Asterisco depois do rótulo e `aria-required`. O erro continua vindo por `erro`. |
| `prefixo` | `string` | não | Texto fixo antes do valor, apagado: "R$", "+55". Diz o tipo do campo sem ocupar o rótulo. |
| `iconeInicio` | `Icon` | não | Ícone de 16px antes do texto. |
| `acoes` | `ReactNode` | não | Ações de 16px depois do texto (`AcaoCampo`). |
| `cartao` | `boolean` | não | Põe o campo no cartão do drawer: rótulo em bold, superfície própria, caixa sangrando 8px para os lados. Em formulário aberto não use. |
| demais | `InputHTMLAttributes` | — | `value`, `placeholder`, `disabled`… vão para o `<input>`. |

### `AcaoCampo`

`icone` e `rotulo` (obrigatório — é botão só de ícone).

### `AcaoCopiar`

`rotulo`, `rotuloCopiado` e, fora de um Input (modo leitura do `CampoEditavel`), `valor` — o texto a copiar. Copia o valor atual do próprio campo (lido pelo
contexto do Input) e vira um check em `success` por 1,5s, anunciado por
`role="status"`. Campo vazio: só leva o foco para ele.

### `CampoEditavel`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | Rótulo do cartão. |
| `valor` | `string` | sim | O texto em leitura. |
| `aoSalvar` | `(valor: string) => void` | sim | Enter salva; Escape desfaz e não vaza para o drawer. |
| `rotuloEditar` | `string` | sim | O que o botão de leitura anuncia. Ex.: "Editar razão social". |
| `textoVazio` | `string` | sim | No lugar do valor vazio. Ex.: "Adicionar". |
| `acoes` | `ReactNode` | não | À direita, no modo leitura. Ex.: `AcaoCopiar` com `valor`. |
| `iconeInicio`, `placeholder`, `inputMode`, `className` | — | não | Vão para o `<input>` do modo edição. |

A linha do valor tem 24px em leitura e em edição (`linhaDoCartao`): o rótulo e
o valor andam juntos — "gap menor entre o título e o conteúdo" (cliente,
2026-09-28, ADR-041). Era a linha de 36 do Input.

### Helpers de classe

`caixaDeCampo({ erro?, disabled? })`, `blocoDeCampo({ realce? })`, `rotuloDeCampo(cartao?)`, `caixaNoCartao`, `linhaDoCartao`, `gradeDeCartoes` e `erroDeCampo` são as classes do campo. Moram em `lib/campo.ts` (regra D21, lote B6) — `InputTelefone`, `TimePicker`, `Rating` e `Select size="field"` importam de lá — e o Input as re-exporta por compatibilidade.

### `Rating`

Tem doc própria: [Rating.md](Rating.md). Resumo: `rotulo`, `valor`, `max` (padrão **10**, decisão do humano em 2026-09-17) e
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

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-129, AUD-130, AUD-131, AUD-132, AUD-133, AUD-134, AUD-135 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
