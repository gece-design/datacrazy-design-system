# Componente: IconeDeMarca

## Responsabilidade

Mostrar a marca de um canal ou integração — WhatsApp, Instagram, Google — num conjunto fechado, com a cor da marca.

## Quando usar

- **Use** para a origem do lead, o canal da conversa e a integração conectada: na célula da tabela, no cartão, na opção de `Select` e de `Combobox`.
- **Use** sempre com o nome ao lado; sozinho, só em espaço apertado e com `rotulo`.
- **Use** `mono` quando a cor competiria com o dado da fileira (uma lista de configurações, um menu).
- **Não use** para ícone de ação ou de interface: é Phosphor, peso `regular`.
- **Não use** logo pintado com cor solta nem `<svg>` de marca colado na tela: a marca que falta entra neste conjunto.
- **Não use** as cores `marca/*` em fundo, texto ou traço: são só do ícone.

## Família

`midia` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Sem par no arquivo. Nasceu da crítica de design de 2026-09-28 ("falta um
componente ícone de integração com um conjunto fechado de marcas aprovadas").
Os glifos são os logos do Phosphor, a biblioteca de ícones do DS — nenhum
desenhado à mão; as cores são as oficiais de cada marca, nos primitivos
`marca/*`. Registrado no ADR-048; o Figma acompanha na remedição.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `marca` | `Marca` | — | sim | `whatsapp` · `instagram` · `facebook` · `google` · `meta` · `linkedin` · `telegram` · `youtube` · `tiktok`. |
| `tamanho` | `12 \| 14 \| 16 \| 20` | `16` | não | 14 na célula da tabela, 16 em lista e botão, 20 em destaque. |
| `mono` | `boolean` | `false` | não | Sem a cor da marca: peso `regular`, na cor do texto em volta. |
| `rotulo` | `string` | — | não | Nome da marca para leitor de tela. Só quando o ícone aparece sem o nome ao lado; com o nome, o ícone é decorativo. |
| `className` | `string` | — | não | — |

`MARCAS_DISPONIVEIS` lista as marcas do conjunto, na ordem em que aparecem num seletor.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| colorido | Padrão. Glifo `fill` na cor da marca — a única exceção ao peso único do DS. |
| `mono` | Glifo `regular` em `currentColor`: fileira em que a cor competiria com o dado. |

## Estados

<!-- kfe:estados:start -->
_Sem estado registrado — o componente não tem estados de interação._
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`marca/whatsapp` · `marca/instagram` · `marca/facebook` · `marca/google` ·
`marca/meta` · `marca/linkedin` · `marca/telegram` · `marca/youtube` ·
`foreground` (TikTok)

## Composição

Usa: os logos do `@phosphor-icons/react` ·
Usado por: a tela do Pipeline (origem no cartão, na lista, no filtro e no "Novo lead") e as páginas do Select e do Combobox.

## Exemplo de uso

```tsx
<p className="flex items-center gap-1.5 text-label-lg text-foreground">
  <IconeDeMarca marca="whatsapp" tamanho={14} />
  WhatsApp
</p>
```

Como ícone de opção, no Select e no Combobox:

```tsx
<Select
  size="field"
  rotulo="Origem"
  valor={origem}
  aoEscolher={setOrigem}
  opcoes={[
    { valor: "whatsapp", rotulo: "WhatsApp", grupo: "Redes sociais", icone: <IconeDeMarca marca="whatsapp" /> },
    { valor: "instagram", rotulo: "Instagram", grupo: "Redes sociais", icone: <IconeDeMarca marca="instagram" /> },
    { valor: "site", rotulo: "Site", grupo: "Outras" },
  ]}
/>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Decorativo por padrão | Com o nome ao lado, o ícone tem `aria-hidden`: o leitor de tela lê o nome uma vez só |
| Sozinho | `rotulo` vira `role="img"` + `aria-label` |
| Cor | Nunca é o único sinal: a marca tem forma própria e o nome ao lado. O verde do WhatsApp não fecha 3:1 sobre branco — por isso o ícone não aparece sem o nome |
| Tema | A cor da marca não muda entre claro e escuro; TikTok usa `foreground`, que inverte |
