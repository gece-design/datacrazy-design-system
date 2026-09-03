# Handoff back-end — <produto> · <data>

## Como rodar o front em 5 minutos
clone → install → dev (detalhes no README do repo). Tudo roda sobre mocks.

## Protocolo de integração
A troca é endpoint a endpoint. O mock só morre quando o endpoint real passa
nos MESMOS testes E2E (tests/e2e/). O front não refatora — muda a origem do dado.

## Mapa mock → endpoint
| Rota (contrato) | Mock atual | Regra de negócio (docs/regras.md) | Teste E2E que valida |
|-----------------|-----------|------------------------------------|----------------------|

## Auth
Sanctum com token · fluxo: <descrição> · rotas de auth no contrato: <lista>

## Convenções de resposta
Envelope { data, meta, errors } · paginação: <padrão> · idioma dos campos: <PT|EN>

## Dúvidas previstas (responda antes de perguntarem)
- …
