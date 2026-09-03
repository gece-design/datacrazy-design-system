# Calibração de fidelidade — <produto>
Limiar de aceite: diff ≤ 1,0% · geometria zero-divergente
Parâmetros de render: viewports <lista> · deviceScaleFactor 2 · diff via scripts/pixel-diff.js

<!-- Toda divergência recorrente vira regra AQUI. Releia antes de cada lote.
     2 ocorrências do mesmo desvio sem regra registrada = falha de processo. -->

## Regras de geração
| # | Situação no Figma | Regra no código | Origem (data/lote) |
|---|-------------------|-----------------|--------------------|
| 1 | line-height em px | leading-[Npx], nunca leading-* nomeado | <exemplo — remova> |

## Limitações de render aceitas (exceções permanentes)
| # | O quê | Por quê | Print | Aprovado por |
|---|-------|---------|-------|--------------|
