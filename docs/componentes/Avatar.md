# Componente: Avatar

## Responsabilidade

Identificar pessoa ou empresa pela inicial, ou pela foto.

## Quando usar

- **Use** para identificar pessoa ou empresa pela inicial ou pela foto: perfil do lead, lista de conversas, usuário logado.
- **Não use** para o atendente numa linha de tabela ou num cartão: ali é `Tag foto` (22px, já com o nome).
- **Não use** como botão nem como indicador de status: o status é `Tag status`.

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
| `iniciais` | `"uma" \| "duas"` | `"uma"` | não | Sem foto: só a letra do primeiro nome, ou primeiro + último ("Joel Jota" → "JJ"). |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"sm"` | não | 32, 48 ou 90px. |

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

Usa: nenhum componente do DS · Exporta também `inicialDe(nome)`, a inicial que o disco mostra ·
Usado por: [Drawer](Drawer.md) (perfil, empresa mãe, nó da hierarquia) e [Breadcrumb](Breadcrumb.md) (`size="xs"` no nível com avatar)

## Exemplo de uso

```tsx
<Avatar nome="Rafael Pinto Pinheiro" size="lg" />
<Avatar nome="Joel Jota" size="md" iniciais="duas" />

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

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-086, AUD-087, AUD-088 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
