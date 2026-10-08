# Componente: IconeDeMarca

## Responsabilidade

Mostrar a marca de um canal ou integração — WhatsApp, Instagram, Google — num conjunto fechado, com o logo de verdade.

## Quando usar

- **Use** para a origem do lead, o canal da conversa e a integração conectada: na célula da tabela, no cartão, na opção de `Select` e de `Combobox`.
- **Use** sempre com o nome ao lado; sozinho, só em espaço apertado e com `rotulo`.
- **Use** `mono` quando a cor competiria com o dado da fileira (uma lista de configurações, um menu).
- **Não use** para ícone de ação ou de interface: é Phosphor, peso `regular`.
- **Não use** `<svg>` de marca colado na tela nem glifo pintado com cor solta: a marca que falta entra neste conjunto.
- **Não use** as cores das marcas em fundo, texto ou traço: elas existem só dentro do logo.

## Família

`midia` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Sem par no arquivo. Nasceu da crítica de design de 2026-09-28 ("falta um
componente ícone de integração com um conjunto fechado de marcas aprovadas").
Os desenhos são os logos de verdade, prontos — nenhum desenhado à mão: a
coleção "SVG Logos", de Gil Barbara (CC0), e o do Instagram de "Skill Icons"
(MIT). A primeira versão pintava o glifo do Phosphor com a cor da marca e foi
recusada ("coloque os corretos", humano, 2026-10-01). Registrado no ADR-048;
o Figma acompanha na remedição.

## Props

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `marca` | `Marca` | — | sim | `whatsapp` · `instagram` · `facebook` · `google` · `meta` · `linkedin` · `telegram` · `youtube` · `tiktok`. |
| `tamanho` | `12 \| 14 \| 16 \| 20` | `16` | não | 14 na célula da tabela, 16 em lista e botão, 20 em destaque. |
| `mono` | `boolean` | `false` | não | Sem as cores da marca: o glifo do Phosphor em peso `regular`, na cor do texto em volta. |
| `rotulo` | `string` | — | não | Nome da marca para leitor de tela. Só quando o ícone aparece sem o nome ao lado; com o nome, o ícone é decorativo. |
| `className` | `string` | — | não | — |

`MARCAS_DISPONIVEIS` lista as marcas do conjunto, na ordem em que aparecem num seletor.

### `IconeDeOrigem`

A origem de um lead como ícone, pelo nome que o CRM escreve: a marca de verdade
quando é marca (`marcaDe("WhatsApp")` → `whatsapp`), senão o ícone Phosphor que a
tela passa em `outros`, em `muted-foreground`. Era uma função copiada em quatro
telas; virou peça em 2026-10-07 (ADR-073).

| Prop | Tipo | Padrão | Obrigatória | Descrição |
|------|------|--------|-------------|-----------|
| `origem` | `string` | — | sim | O nome como vem do CRM: "WhatsApp", "Instagram", "Site", "Indicação", "Google Ads". |
| `outros` | `Record<string, Icon>` | — | não | O ícone do que não é marca, por nome (`{ Site: Globe, Indicação: Handshake }`). Sem par: `Globe`. |
| `tamanho` | `12 \| 14 \| 16` | `14` | não | 12 na linha de apoio, 14 na célula e no cartão, 16 em lista e campo. |
| `rotulo` | `string` | — | não | Nome da origem para leitor de tela. Só quando o ícone aparece sem o nome ao lado. |
| `className` | `string` | — | não | — |

`marcaDe(origem)` devolve a chave da marca para um nome (sem acento, espaço nem
caixa; "Google Ads" → `google`) ou `null`.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| colorido | Padrão. O logo de verdade, com as cores da marca. |
| `mono` | Glifo do Phosphor, `regular`, em `currentColor`: fileira em que a cor competiria com o dado. |

## Estados

<!-- kfe:estados:start -->
_Sem estado registrado — o componente não tem estados de interação._
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

## Tokens consumidos

`foreground` (o traço preto do TikTok acompanha o texto e inverte no escuro).
As cores das marcas não são tokens: moram no desenho de cada logo.

## Composição

Usa: os desenhos embutidos no próprio arquivo e, no `mono`, os glifos do `@phosphor-icons/react` ·
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
| Cor | Nunca é o único sinal: a marca tem forma própria e o nome ao lado |
| Tema | As cores da marca não mudam entre claro e escuro; só o traço preto do TikTok usa `foreground`, que inverte |
