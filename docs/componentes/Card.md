# Componente: Card

## Responsabilidade

Superfície que carrega um bloco de dados do dashboard.

## Quando usar

- **Use** para um bloco de dados do dashboard com título e ação: lista (`CardList`), rosca (`CardDonut`) ou barras (`CardChart`).
- **Não use** para uma métrica só: é `KpiCard`.
- **Não use** card dentro de card, nem como contêiner de formulário ou de tabela: a Table já é a superfície.
- **Não use** `CardDonut` com mais de quatro fatias: vire lista ou barras.

## Família

`superficie` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Node: `304:5313` (component set "Card") · Lote: `2` ·
Última verificação: geometria das barras medida no render — 8 barras em
218/3px, plot de 224 e eixo Y de 66, os mesmos do arquivo.

Diff de pixels **não medido**: depende da ponte de escrita do Figma
(`figma-console`), que segue fora do ar.

## Props

A casca e os três conteúdos são peças separadas. No Figma isso é um eixo
`Content` com três valores; aqui não vira prop, porque `content="chart"`
obrigaria a casca a receber dados de gráfico só para repassar.

### `Card`

Só superfície. Aceita `className` e filhos.

### `CardHeader`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `title` | `string` | sim | Rótulo do card. |
| `value` | `string` | não | Número em destaque. A lista não usa. |
| `subtitle` | `string` | não | Linha que explica o recorte. |
| `action` | `React.ReactNode` | não | Canto direito — no arquivo, o seletor. |

### `CardList`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `linhas` | `LinhaDaLista[]` | `nome`, `detalhe`, `inicial` e `metricas[]`. |

### `CardDonut`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `fatias` | `FatiaDaRosca[]` | `nome` e `percentual`. |
| `destaque` | `string` | O número grande no centro. |
| `formatar` | `(percentual: number) => string` | Como o percentual aparece na legenda. Padrão: uma casa e ponto ("46.0%"); passe o formato do idioma. |
| `rotulo` | `string` | A linha pequena sob ele. |

### `CardChart`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `barras` | `BarraDoGrafico[]` | `rotulo` e `valor`. |
| `eixoY` | `string[]` | Opcional. Rótulos do topo para a base, já formatados. Sem eles o gráfico fica sem eixo (regra A7). |
| `formatar` | `(valor: number) => string` | Como o valor aparece no balão da barra, ao passar o cursor. Padrão: o número. |

### Seletor do cabeçalho

O recorte usa o [Select](Select.md), que virou componente próprio quando a Data
Table pediu o mesmo controle.

## Variantes

A casca `Card` tem traço de 1px em `border` (ADR-045): toda superfície do dashboard — card, KPI, tabela — tem o mesmo contorno.

| Conteúdo | Quando usar |
|----------|-------------|
| `CardList` | Comparar pessoas ou categorias por mais de um número. |
| `CardDonut` | Distribuição percentual entre **poucas** categorias. Cor chapada em `primary`; as fatias se distinguem pela opacidade (100 · 60 · 35 · 20%). |
| `CardChart` | Série por período. Barras chapadas em `primary` (o gradiente do arquivo saiu, ADR-044), valor no balão ao passar o cursor, eixo opcional. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `text-foreground` | banco | L2 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | D6 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

A casca e os três conteúdos são leitura. O único elemento interativo é o
[Select](Select.md) do cabeçalho.

## Tokens consumidos

`card` · `accent` · `background` · `primary` · `foreground` ·
`muted-foreground` · `subtle-foreground` · `radius/md` · `radius/sm` ·
`text/heading-3` · `text/heading-4` · `text/heading-1` · `text/display` ·
`text/body-md` · `text/body-sm` · `text/caption` · `text/label-lg`

## Composição

Usa: `SelectTrigger` do [Select](Select.md) no cabeçalho ·
Usado por: [KpiCard](KpiCard.md) (a casca, desde o lote B6) e as páginas do site

## Exemplo de uso

```tsx
<Card className="min-h-[452px] gap-5">
  <CardHeader
    title="Dados diários"
    value="R$ 3,00K"
    subtitle="Visualização por valor dos negócios"
    action={<Select size="md" rotulo="Ver por" opcoes={porValor} valor={por} aoEscolher={setPor} />}
  />
  <CardChart barras={dias} eixoY={eixoY} />
</Card>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | O [Select](Select.md) usa `outline` com offset (regra D6) |
| Papel/rótulo | Texto real em toda parte. Anel, barras, avatar e eixos são `aria-hidden`: são desenho do número que já está escrito ao lado |
| Alvo de toque | O [Select](Select.md) mede 32px de altura — **abaixo dos 44 da regra I15** |
| Movimento | Só a transição de cor do seletor |
| Contraste | `muted-foreground` sobre `card` = 4,6:1 no claro |

## Divergências abertas (para o gate)

Migradas para [../processo/consistencia.json](../processo/consistencia.json) em
2026-09-19 (lote B1 da auditoria de consistência): AUD-094, AUD-095, AUD-096, AUD-097 — status
`adiado`, lote `figma`. Reabrem na remedição contra o arquivo.
