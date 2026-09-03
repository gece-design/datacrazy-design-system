# Tokens no Figma — método e correções aplicadas

> **O que este arquivo é.** O registro de COMO a coleção `Cor` do arquivo
> `DESIGN - DATA CRAZY` foi reestruturada em 2026-09-01 e por que os nomes
> são esses. **Os valores em si moram em
> [../02-design-system.md](../02-design-system.md) § Fundações** — aqui fica a
> procedência, não a tabela. Substitui `tokens-figma.md` e `tokens-proposta.md`,
> que eram especulativos e foram apagados.


**Método:** os nomes não foram escolhidos por convenção — foram **medidos**.
Varredura de 84.775 nós contando cada binding por tipo de nó. `Surface escura`
tinha 1.285 preenchimentos de TEXT e 1.064 de VECTOR: era cor de texto, não
superfície. Todo rename abaixo saiu desse tipo de evidência.

## O que foi corrigido

1. **Modos criados.** `Mode 1` → `Claro`, e `Escuro` adicionado. Antes a coleção
   tinha um modo só — era o que impedia o requisito de dois temas.
2. **Inversão de alias.** `Primary 500` era alias de `Primary`: o primitivo
   apontava para o semântico. Invertido — `base/blue/500` guarda o literal e
   `primary` referencia ele. Sem isso, dar valor escuro ao `primary` arrastava
   a escala inteira junto.
3. **Elevação consertada.** `card` (`#1E1E24`) ficou mais claro que `background`
   (`#1C1C25`). Antes a superfície era mais escura que o fundo.
4. **21 textos religados.** Usavam `card` para ser branco sobre o azul; no
   escuro virariam escuros e sumiriam. Agora usam `primary-foreground`.
5. **Sidebar religada aos semânticos.** O item selecionado usava os primitivos
   `base/blue/100` e `base/neutral/900` — primitivo não muda com tema, então a
   pílula ficava branca no escuro. Corrigido no componente-mãe, não na instância.
6. **521 bordas ligadas ao token.** Estavam soltas em `#E1E7EF`; agora escurecem
   junto com o tema.

## Um único valor não veio do arquivo

`border` no modo Escuro (`#2E2E38`) — derivado um passo acima do `card`. Todo o
resto do tema escuro saiu de valores que já existiam, presos em variáveis com o
nome errado. Os nomes eram o problema, não a paleta.

## Verificado

Dashboard (`130:12522`) renderizado nos dois modos e comparado. O frame foi
devolvido ao modo Claro depois do teste.

## Em aberto

Movido para [../02-design-system.md](../02-design-system.md) § Em aberto —
pendência tem um dono só (DIP). A de número 1 tem proposta escrita:
[tokens-estados-escuro.md](tokens-estados-escuro.md).
