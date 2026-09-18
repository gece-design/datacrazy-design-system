# Componente: Telefone

## Responsabilidade

Receber um telefone com o país separado do número.

## Família

`entrada` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

**Não tem.** O arquivo desenha o telefone como campo de texto comum
(`535:48`). A bandeira e o DDI entraram por pedido do humano em 2026-09-17:
telefone de CRM é discado e comparado entre países, e sem o DDI separado não
dá para saber se falta país ou falta DDD.

## Props

### `InputTelefone`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `rotulo` | `string` | sim | Rótulo visível do campo. |
| `valor` | `string` | sim | Só o número, sem DDI. |
| `aoMudar` | `(v: string) => void` | sim | Digitação do número. |
| `pais` | `string` | sim | ISO 3166-1 alpha-2. Ex.: `"BR"`. |
| `aoMudarPais` | `(codigo: string) => void` | sim | Troca de país. |
| `rotuloPais` | `string` | sim | Nome do seletor para leitor de tela. |
| `paises` | `Pais[]` | não | Padrão: `PAISES`, os doze do CRM hoje. |
| `acoes` | `ReactNode` | não | Ações de 16px depois do número. |
| `erro` | `string` | não | Mensagem sob o campo. |

`telefoneCompleto(pais, numero)` monta o `+55 …` que vai para o back e para o
`tel:`.

## Variantes

Não tem. O que muda é o país escolhido.

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `border-input-border-hover (fora do foco)` | banco | I1 |
| focus | `border-input-border-focus + ring-1 inset` | figma | Input |
| erro | `border-input-border-error + caption destructive` | figma | Input |
| disabled | `bg-input-bg-disabled + text-input-text-disabled` | figma | Input |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

Os mesmos do [Input](Input.md): `input/bg` · `input/border` ·
`input/border-hover` · `input/border-focus` · `input/border-error` ·
`input/text` · `input/placeholder` · `input/label` · `destructive` ·
`radius/md` · `text/label-md` · `text/body-md`

## Composição

Usa: a caixa do [Input](Input.md) (`caixaDeCampo`) · `CaretDown` do Phosphor ·
Usado por: [Drawer](Drawer.md) (contatos e empresa mãe)

## Exemplo de uso

```tsx
<InputTelefone
  rotulo="Telefone"
  rotuloPais="País do telefone"
  pais={pais}
  aoMudarPais={setPais}
  valor={numero}
  aoMudar={setNumero}
  acoes={<AcaoCampo icone={Phone} rotulo="Ligar" onClick={ligar} />}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Seletor de país | `<select>` nativo com `aria-label`: teclado, busca por letra e a roda do sistema no celular, sem código |
| Número | `type="tel"`, `inputMode="tel"` e `autoComplete="tel-national"` |
| Erro | `aria-invalid` e `aria-describedby`, como no Input |
| Bandeira | `aria-hidden`: quem carrega a informação é o DDI escrito ao lado |

## Divergências abertas (para o gate)

1. **Não está no Figma.** Decisão do humano; o arquivo ainda mostra o telefone
   como campo de texto.
2. **Bandeira é emoji.** O Windows não desenha bandeira: lá aparece o código do
   país. Por isso o DDI fica escrito ao lado, e não só a bandeira.
3. **Sem máscara.** O número entra como a pessoa digita. Máscara por país é
   decisão de produto, e muda a cada país da lista.
