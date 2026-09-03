# Arquitetura — <produto>

## Stack

| Camada | Escolha | Motivo (se desvio da base) |
|--------|---------|----------------------------|
| Build | <Vite> | — |
| UI | <React + TypeScript strict> | — |
| Estilo | <Tailwind + tokens> | — |
| Componentes | <shadcn/Radix> | — |
| Validação | <zod nas bordas> | — |
| Dados | <mocks realistas + hooks/contexts> | — |

## Lista negativa (PROIBIDO)

<!-- Vinda da etapa STACKS. Cada linha é uma alucinação que não vai acontecer. -->

- <ex.: styled-components>
- <ex.: Redux>
- <ex.: CSS solto fora do padrão de tokens>
- <ex.: qualquer lib fora da base sem aprovação registrada em processo/adr.md>

## Estrutura de pastas

```
<árvore do src/ — o que mora onde e o que NÃO mora>
```

## Fronteira com o back-end

Back-end **não é implementado aqui**: define-se e entrega-se pronto.

| Item | Decisão |
|------|---------|
| Stack do back | <ex.: Laravel + Sanctum> |
| Quem implementa | <time/pessoa> |
| Contrato | [03-contrato-api.md](03-contrato-api.md) · [api-contract.yaml](api-contract.yaml) |
| Estado hoje | 100% sobre mocks |

Mapa mock → endpoint na entrega: [processo/handoff-backend.md](processo/handoff-backend.md).
