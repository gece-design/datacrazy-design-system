# Contrato de API — <produto>

Especificação executável: [api-contract.yaml](api-contract.yaml).
Este arquivo explica os **padrões**; o yaml lista as rotas.

## Auth

<ex.: token Bearer via Sanctum. Fluxo: login → token → header Authorization.>
Rotas de auth: <lista>.

## Envelope de resposta

```json
{ "data": <payload>, "meta": { }, "errors": [ ] }
```

| Campo | Quando aparece |
|-------|----------------|
| data | sucesso |
| meta | paginação, totais |
| errors | falha (data = null) |

## Paginação

<padrão: page/per_page? cursor? — decidir, nunca acidental>

## Erros

| HTTP | Significado | Corpo |
|------|-------------|-------|
| 401 | não autenticado | errors[] |
| 403 | autenticado, sem permissão | errors[] |
| 422 | falha de validação | errors[] por campo |

## Convenções

| Item | Decisão |
|------|---------|
| Idioma dos campos | <PT \| EN> |
| Datas | <ISO-8601 UTC> |
| Dinheiro | <centavos inteiros> |
| IDs | <UUID> |

## Regra de ouro

O front nasce sobre mocks que espelham este contrato. Quando o endpoint real
chegar, ele passa nos MESMOS testes E2E — o front não refatora, muda a origem
do dado. Protocolo completo: [processo/handoff-backend.md](processo/handoff-backend.md).
