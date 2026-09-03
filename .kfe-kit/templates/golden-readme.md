# tests/golden/ — telas-padrão do pipeline
<!-- Copie este arquivo para tests/golden/README.md do produto. -->

A golden screen é a tela piloto aprovada, congelada como TESTE DE REGRESSÃO
DO PIPELINE: se ela quebrar, o problema é no sistema (tokens, fontes,
dependência, config) — não na tela nova que você está fazendo.

## Estrutura
tests/golden/<tela>/figma.png      ← export do Figma aprovado
tests/golden/<tela>/render.png     ← render aprovado no gate
tests/golden/<tela>/params.md      ← viewport, dsf, data, % do aceite

## Quando rodar (obrigatório)
- Toda mudança em tokens/config de estilo
- Todo upgrade de dependência de UI (Tailwind, framework, fontes)
- Início de cada lote (barato: 1 comando)

## Como rodar
1. Re-renderize a tela nos params registrados → novo-render.png
2. node scripts/pixel-diff.js tests/golden/<tela>/figma.png novo-render.png
3. FAIL → PARE o lote e trate como bloqueio de pipeline (protocolo de falha).
