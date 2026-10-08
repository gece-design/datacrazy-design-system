# Componente: Skeleton

## Responsabilidade

O modelo de carregamento de página: blocos cinza (o `background` da página)
com a forma do que vai chegar e uma banda clara que vai de uma ponta à outra
e volta. `Skeleton` é o
bloco; as montagens dão a forma de cada peça do DS (texto, tabela, cartão,
quadro, conversa, painel, canvas); `SkeletonDaTela` é a tela inteira
carregando, no padrão de fundo.

## Quando usar

- **Use** `SkeletonDaTela` no lugar do conteúdo enquanto a tela espera a API: `modelo` com a forma da tela que vem (`tabela`, `cartoes`, `quadro`, `conversa`, `painel`, `canvas`).
- **Use** os blocos soltos (`Skeleton`, `SkeletonDeTexto`) para uma parte que carrega sozinha: o gráfico de um cartão, o painel do lead.
- **Use** a montagem com a forma certa: a lista carrega como `SkeletonDaTabela`, não como `SkeletonDeCartoes` — senão o conteúdo pula ao chegar.
- **Não use** para uma ação curta (salvar, enviar): é o `Button` desabilitado e o `Toast`.
- **Não use** quando a resposta já veio vazia: é o `EstadoVazio`.
- **Não use** spinner no meio da página: a pessoa precisa ver onde cada coisa vai aparecer.

## Família

`feedback` — define a regra de estado herdada
([../02-design-system.md](../02-design-system.md)).

## Par no Figma

Não há: nasceu do pedido do cliente em 2026-10-08 ("modelo de carregamento
de página"), com a forma definida pelo humano ("skeleton loading com
animação de gradient indo e voltando") — ADR-078. O arquivo passa a
acompanhar o código na remedição (AUD-214, lote `figma`).

## Props

### `Skeleton`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `className` | `string` | não | A forma: `h-3 w-48` para uma linha, `size-10 rounded-full` para um avatar. Aceita o resto de `HTMLAttributes<HTMLDivElement>`. |

### `SkeletonDaTela`

| Prop | Tipo | Obrigatória | Descrição |
|------|------|-------------|-----------|
| `modelo` | `ModeloDeCarregamento` | sim | `tabela` · `cartoes` · `quadro` · `conversa` · `painel` · `canvas`. |
| `rotulo` | `string` | não | O que o leitor de tela ouve. Padrão "Carregando…". |
| `className` | `string` | não | — |

### As montagens

| Montagem | Props | O que desenha |
|----------|-------|---------------|
| `SkeletonDeTexto` | `linhas?` (3) | Linhas de 12px, a última em 60%. |
| `SkeletonDaTabela` | `linhas?` (8) · `colunas?` (5) | Cabeçalho e linhas de 36, iniciais na primeira coluna. |
| `SkeletonDoCartao` | — | Um cartão de catálogo: disco, nome, descrição, três métricas. |
| `SkeletonDeCartoes` | `quantidade?` (6) | A `gradeDeCartoes` com cartões. |
| `SkeletonDoQuadro` | `colunas?` (4) | Colunas de 240 com dois ou três cartões. |
| `SkeletonDaConversa` | — | Lista de 320, balões alternados, painel de 300. |
| `SkeletonDoPainel` | — | Quatro KPIs, gráfico de barras, lista. |
| `SkeletonDoCanvas` | — | Três blocos de 264 na folha. |

Todas aceitam `className`.

## Variantes

| Variante | Quando usar |
|----------|-------------|
| bloco | Uma parte só: a linha, o disco, o retângulo. |
| montagem | A forma de uma peça do DS, com as medidas dela. |
| tela | `SkeletonDaTela`: o conteúdo inteiro, no padrão de fundo, com `role="status"`. |

## Estados

<!-- kfe:estados:start -->
| Estado | Implementação | Origem | Precedente / regra |
|--------|---------------|--------|--------------------|
| carregando | `banda card/60 de 200% desliza em animate-brilho sobre o bloco background: ciclo de 1400 ms, curva vaivem, infinite alternate` | humano | ADR-078 |
| reduzido | `a redução global do globals.css para o degradê; o bloco cinza fica parado` | banco | I12 |
<!-- kfe:estados:end -->

O único estado é o brilho: `animate-brilho` (ciclo de 1,4 s, curva `vaivem`,
`infinite alternate`). Com `prefers-reduced-motion`, a redução global do
`globals.css` para o degradê e o bloco cinza fica parado.

## Tokens consumidos

`background` · `card` · `border` · `radius/md` · `radius/lg` · `radius/full` ·
`duration/ciclo` · `ease/vaivem`

## Composição

Usa: `lib/campo.ts` (`gradeDeCartoes`) · `lib/estados.ts` (`blocoDaTela`) ·
`lib/movimento.ts` (`DURACAO.ciclo`, `CURVA.vaivem`, pelo tailwind.config).
Usado por: o protótipo (`/prototipo`, ao trocar de tela e com
`?carregando=1`).

## Exemplo de uso

```tsx
// enquanto a API responde: a tela inteira com a forma do que vem
{carregando ? <SkeletonDaTela modelo="tabela" /> : tabela}

// uma parte só
<div className={blocoDaTela}>
  <SkeletonDaTabela linhas={6} colunas={5} />
</div>

// o bloco, na forma que precisar
<Skeleton className="size-10 rounded-full" />
<SkeletonDeTexto linhas={3} />
```

## Acessibilidade

| Item | Como está resolvido |
|------|---------------------|
| Papel | `SkeletonDaTela` é `role="status"` com `aria-busy`: anuncia "Carregando…" uma vez e marca a região como ocupada |
| Blocos | Cada `Skeleton` é `aria-hidden`: o leitor de tela não ouve dezenas de retângulos |
| Movimento | A redução é global (`globals.css`): com `prefers-reduced-motion` o brilho para |
| Idioma | `rotulo` vem da tela, no idioma de quem lê |

## Divergências abertas (para o gate)

AUD-214 (`adiado`, lote `figma`): sem par no arquivo. Desenhar o bloco e as
montagens no Figma a partir do código, na remedição.
