# Catálogo de contratos — DataCrazy

O que uma parte do sistema promete à outra. Quem CONSOME lê aqui; quem
IMPLEMENTA linka pra cá. Assinatura mora neste arquivo e em mais nenhum.

<!-- Dono: fw-doc, por lote, LENDO o código. Nada aqui se escreve de memória. -->

## Contratos de dado (ports)

**Não existem, por decisão de escopo.** Componente de design system não busca
dado: recebe por prop. Ver [01-arquitetura.md](01-arquitetura.md) § Lista
negativa e [03-contrato-api.md](03-contrato-api.md).

## Contratos de componente

Props de cada componente ficam no arquivo do componente
([componentes/](componentes/)); aqui fica só o que é **compartilhado**.

| Contrato | O que padroniza | Quem implementa |
|---|---|---|
| _a preencher pela fw-doc no primeiro lote_ | — | — |

Candidatos já visíveis no código, ainda **não** formalizados: composição de
classe via `cn` (`lib/utils.ts`), variantes fechadas por `cva`, e o anel de
foco por `outline` + `outline-offset` (regra D6 em
[processo/calibration.md](processo/calibration.md)).

## Contratos de estado (camada 2)

Vocabulário de famílias: [02-design-system.md](02-design-system.md).
Declaração por componente e regras locais:
[processo/interactions.md](processo/interactions.md).
Banco global herdado (I1–I15): `.kfe-kit/interactions-global.md`.

## Como adicionar um contrato

Entrada nova aqui se for compartilhada entre componentes; no arquivo do
componente se for só dele. **Adicionar implementação não muda o contrato** —
só acrescenta uma linha na lista (OCP).
