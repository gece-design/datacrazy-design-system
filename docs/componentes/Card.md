# Componente: Card

## Responsabilidade

Superfície que carrega um bloco de dados do dashboard.

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
| `rotulo` | `string` | A linha pequena sob ele. |

### `CardChart`

| Prop | Tipo | Descrição |
|------|------|-----------|
| `barras` | `BarraDoGrafico[]` | `rotulo` e `valor`. |
| `eixoY` | `string[]` | Rótulos do topo para a base, já formatados. |

### `CardSelect`

Gatilho do recorte. Botão de verdade, com foco visível, mas **sem menu**: o
Select do DS não existe e o Figma desenha só o estado fechado.

## Variantes

| Conteúdo | Quando usar |
|----------|-------------|
| `CardList` | Comparar pessoas ou categorias por mais de um número. |
| `CardDonut` | Distribuição percentual entre **poucas** categorias. |
| `CardChart` | Série por período. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| hover | `text-foreground` | banco | I1 |
| focus | `outline outline-2 outline-offset-2 outline-ring` | banco | I4 |
<!-- kfe:estados:end -->

Estado que não está nesta tabela **o componente não tem**. Ausência é
decisão, não buraco a preencher.

A casca e os três conteúdos são leitura. O único elemento interativo é o
`CardSelect`, que tem `hover` e `focus-visible` (regra I4).

## Tokens consumidos

`card` · `accent` · `background` · `primary` · `foreground` ·
`muted-foreground` · `subtle-foreground` · `radius/md` · `radius/sm` ·
`text/heading-3` · `text/heading-4` · `text/heading-1` · `text/display` ·
`text/body-md` · `text/body-sm` · `text/caption` · `text/label-lg`

## Composição

Usa: nenhum componente do DS ·
Usado por: dashboard (tela ainda não construída)

## Exemplo de uso

```tsx
<Card className="min-h-[452px] gap-5">
  <CardHeader
    title="Dados diários"
    value="R$ 3,00K"
    subtitle="Visualização por valor dos negócios"
    action={<CardSelect>Valor</CardSelect>}
  />
  <CardChart barras={dias} eixoY={eixoY} />
</Card>
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Foco visível | `CardSelect` usa `outline` com offset (regra D6) |
| Papel/rótulo | Texto real em toda parte. Anel, barras, avatar e eixos são `aria-hidden`: são desenho do número que já está escrito ao lado |
| Alvo de toque | `CardSelect` mede 32px de altura — **abaixo dos 44 da regra I15** |
| Movimento | Só a transição de cor do seletor |
| Contraste | `muted-foreground` sobre `card` = 4,6:1 no claro |

## Divergências abertas (para o gate)

1. **A lista não tem separador visível.** O traço entre linhas está ligado ao
   token `card` — a mesma cor do fundo. O que separa é o respiro de 13px. Pode
   ser intenção ou pode ser um `border` que ficou apontando para o token
   errado; o arquivo não diz.
2. **Rosca sem paleta categórica.** O gradiente vale para o anel inteiro, então
   duas fatias com valor saem da mesma cor e ficam indistinguíveis. Com uma
   fatia em 100% — o caso desenhado — bate exato. É o bloqueio **B8** do
   roadmap, e ele agora tem um segundo dono.
3. **Alvo de toque do seletor.** 32px de altura contra os 44 que a regra I15
   pede. O arquivo desenha 32.
4. **Altura mínima, não fixa.** O arquivo fixa 382 e 452 com corte; o código usa
   `min-h`. Na largura de desenho a medida é a mesma, mas um nome longo faz o
   card crescer em vez de esconder conteúdo.
