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
| demais | `InputHTMLAttributes` | — | `value`, `placeholder`, `disabled`… vão para o `<input>`. |

### `AcaoCampo`

`icone` e `rotulo` (obrigatório — é botão só de ícone).

### `AcaoCopiar`

`rotulo` e `rotuloCopiado`. Copia o valor atual do próprio campo (lido pelo
contexto do Input) e vira um check em `success` por 1,5s, anunciado por
`role="status"`. Campo vazio: só leva o foco para ele.

### `Rating`

`rotulo`, `valor` (0–5) e `aoMudar`. Sem `aoMudar`, é só leitura.

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
`primary` · `base/blue/300` · `radius/md` · `text/label-md` · `text/body-md` ·
`text/caption`

## Composição

Usa: Phosphor ·
Usado por: [Drawer](Drawer.md) (Perfil e Campos adicionais)

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
4. **Rating sem hover de pré-visualização.** O arquivo não desenha; não
   entrou.
5. **Lista aberta do Select de formulário** é a mesma derivação do
   [Select](Select.md).
