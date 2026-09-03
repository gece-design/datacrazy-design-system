# Checklist de prontidão do Figma — <produto>
<!-- BLOQUEANTE: frame reprovado em qualquer critério não entra na geração. -->

## Critérios (por frame)
- [ ] 100% dos containers com auto-layout (exceções listadas abaixo, justificadas)
- [ ] Nomes semânticos do glossário — zero "Frame 427"
- [ ] Cor, tipografia, espaçamento e raio via variables — zero valor solto
- [ ] Todo componente do frame tem linha em `docs/processo/interactions.md` (estados são DECLARADOS, não desenhados)
- [ ] Variantes desenhadas (opcionais) listadas na seção 4 do interactions.md — viram verdade absoluta e entram no pixel-diff
- [ ] Assets exportáveis (ícones/imagens marcados para export)

## Convenção de handoff
| No Figma | Vira |
|----------|------|
| Componente | Componente React (par 1:1) |
| Variante desenhada | Prop/estado do componente — medido por pixel-diff |
| Estado declarado (interactions.md) | Prop/estado do componente — derivado pela cadeia de precedência |
| Variable | Token do config |
| Instância | Uso/import — nunca reimplementação |

## Parâmetros de verificação do produto
- Viewports (= larguras dos frames): <ex.: 1440 desktop · 390 mobile>
- deviceScaleFactor: 2 · Diff: scripts/pixel-diff.js (threshold AA 0.1)
- Fontes instaladas (família + pesos): <lista> — fallback = reprovação

## Exceções de auto-layout aprovadas
- <frame> · <motivo> · <aprovado por>
