# Design system — <produto>

## Direção visual

<!-- Dono: fw-ux (U4). Proposta da IA, gosto final do humano. -->

Referências: <links/prints> · Tom: <palavras> · Personalidade: <palavras>
O que este produto NUNCA parece: <o anti-moodboard, tão útil quanto o moodboard>

## Fundações

<!-- Dono: fw-ui / fw-onboard. Valores saem do Figma (variables), nunca de estimativa.
     Esta tabela é o MAPA nome→semântica, não uma segunda fonte de verdade: o valor
     efetivo vive no config de estilo, gerado a partir do Figma. Divergiu? O Figma
     manda; conserte o config e a tabela, nessa ordem. Liste só o que tem nome
     semântico — não recopie a paleta inteira. -->

### Cor
| Token | Valor | Uso |
|-------|-------|-----|
| <color/brand/500> | <#hex> | <ação primária> |

### Tipografia
| Token | Família | Peso | Tamanho / line-height |
|-------|---------|------|------------------------|
| <text/body/md> | <família> | <400> | <16px / 24px> |

Fontes instaladas e checagem anti-fallback: [processo/fonts-checklist.md](processo/fonts-checklist.md).

### Espaçamento e raio
| Token | Valor |
|-------|-------|
| <space/3> | <12px> |
| <radius/md> | <8px> |

### Elevação
| Token | Sombra (x/y/blur/spread/cor/alpha) |
|-------|------------------------------------|

### Motion
| Nome | Duração | Uso |
|------|---------|-----|
| fast | 120ms | micro-feedback (hover, press) |
| base | 200ms | transição de estado |
| slow | 320ms | entrada/saída de superfície |

`prefers-reduced-motion` é obrigatório em todo motion (regra I12).

## Famílias de componente

`acao` · `entrada` · `navegacao` · `superficie` · `feedback` · `overlay` · `midia`

Família define a regra de estado herdada. Declaração por componente:
[processo/interactions.md](processo/interactions.md). Catálogo:
[componentes/](componentes/).

## Fonte canônica

O Figma manda no estado de repouso. Divergência visual é bug do código,
medida por pixel-diff — ver [processo/calibration.md](processo/calibration.md).
