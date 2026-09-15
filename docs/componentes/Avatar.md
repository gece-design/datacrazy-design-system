# Componente: Avatar

## Responsabilidade

Identificar pessoa ou empresa pela inicial, ou pela foto.

## Família

`midia` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `538:200` ("Avatar", canvas do Drawer) · Lote: `3` · Tamanhos sm 32,
md 48, lg 90, em claro e escuro.

Diff de pixels **não medido** (`figma-console` fora do ar).

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `nome` | `string` | — | sim | Dá a inicial (primeira letra) e o `aria-label`. |
| `src` | `string` | — | não | Foto. Sem ela, a inicial. |
| `size` | `"sm" \| "md" \| "lg"` | `"sm"` | não | 32, 48 ou 90px. |

## Variantes

| Tamanho | Quando usar |
|---------|-------------|
| `sm` | Lista, linha de tabela. Anel 4px. |
| `md` | Empresa com nome ao lado, nó da hierarquia. Anel 6px. |
| `lg` | Só o topo do perfil no drawer. Anel 10px. |

## Estados

<!-- kfe:estados:start -->
_Sem estado registrado — o componente não tem estados de interação._
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

Avatar é leitura. Se clicar abre algo, o clique vai no elemento em volta.

## Tokens consumidos

`card` · `accent` · `--avatar-md-fundo` · `--avatar-md-anel` ·
`nav/item/text-selected` · `radius/full` · `text/label-md` · `text/heading-3`

## Composição

Usa: nenhum componente do DS ·
Usado por: [Drawer](Drawer.md) (perfil, empresa mãe, nó da hierarquia)

## Exemplo de uso

```tsx
<Avatar nome="Rafael Pinto Pinheiro" size="lg" />

<div className="flex items-center gap-2">
  <Avatar nome="Jojota Podcast LTDA." size="md" aria-hidden="true" />
  <p className="text-label-lg text-foreground">Jojota Podcast LTDA.</p>
</div>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `role="img"` com o nome inteiro como `aria-label`; a letra é `aria-hidden` |
| Nome repetido | Com o nome escrito ao lado, passe `aria-hidden` para não ler duas vezes |
| Foto | `alt=""`: o nome já está no `aria-label` do disco |
| Contraste | `nav/item/text-selected` sobre `accent`/`card` nos dois temas |

## Divergências abertas (para o gate)

1. **Letra do `lg` fora da escala.** 29,25/36 semibold, com tracking de
   -0,675px, é o valor do arquivo — não bate com nenhum degrau tipográfico.
2. **O `md` troca papéis entre os temas.** Resolvido com dois tokens de
   componente (`--avatar-md-fundo`, `--avatar-md-anel`); no Figma são duas
   variáveis diferentes por variante de tema, não um token.
3. **Sem cor por pessoa.** Todas as iniciais saem no mesmo azul. Se o CRM
   quiser distinguir pessoas pela cor, é paleta categórica — o bloqueio B8.
