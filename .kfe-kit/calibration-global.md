# Calibração GLOBAL do kit (herdada por todo produto novo)
<!-- Regras de geração válidas pra QUALQUER produto web. A fw-install copia
     estas regras pro docs/processo/calibration.md do produto no dia 1. Regras
     específicas de um Figma ficam no produto; as genéricas sobem pra cá
     na retro (fw-github). Aprendizado composto: o projeto 3 começa com as
     cicatrizes dos projetos 1 e 2 já curadas. -->

## Regras de geração
| # | Situação no Figma | Regra no código | Origem |
|---|-------------------|-----------------|--------|
| G1 | line-height em px | leading-[Npx] — nunca leading-* nomeado (arredonda) | AlumyPlay |
| G2 | letter-spacing em % | tracking-[N em]: converta % → em (÷100) — nunca tracking-wide aproximado | AlumyPlay |
| G3 | Fill container / Hug | Fill → w-full ou flex-1 conforme o eixo; Hug → w-fit — nunca largura fixa "que coube" | kit |
| G4 | Sombra multi-camada | shadow-[...] custom com TODAS as camadas — nunca shadow-md "parecida" | kit |
| G5 | Cor com alpha | token/NN (ex.: bg-base/40) — nunca rgba() solto | AlumyPlay |
| G6 | Gap do auto-layout | gap-* no container — nunca margin nos filhos | kit |
| G7 | Interação hover-only | hover: sempre sob hoverOnlyWhenSupported; definir o equivalente touch na spec | AlumyPlay |
