# Contrato de API — DataCrazy

**Fora do escopo deste ciclo, de propósito.** A entrega é uma biblioteca de
componentes: componente de design system não conhece domínio nem faz
requisição. Ver [00-visao-geral.md](00-visao-geral.md) § NÃO-ESCOPO.

Especificação executável (esqueleto vazio, também de propósito):
[api-contract.yaml](api-contract.yaml).

## Por que está vazio

O DataCrazy é um CRM **em produção**, com API REST já existente. Convenção de
API aqui não se decide — descobre-se lendo a API real. A v1 deste arquivo fixou
envelope, paginação e idioma dos campos presumindo produto novo; foi **revogada
em 2026-09-01**, quando o cenário foi reclassificado para C.

## O que se sabe

Evidência: `Artefato-01 Ponto Zero.pdf`, de 18/08/2026 — secundária, de outra
data, e não confirmada contra o repositório.

| Item | O que se sabe |
|---|---|
| Tipo de API | REST (sem GraphQL/Apollo nas dependências do front) |
| Consumo no front | `fetch` nativo via hook próprio do time |
| `@tanstack/react-query` | Está nas dependências, **não** é o padrão real de uso |

## O que NÃO se sabe (não presumir)

- Linguagem e framework do back — repositório nunca auditado
- Formato do envelope de resposta
- Convenção de paginação
- Idioma dos nomes de campo (EN ou PT)
- Formato de erro e de autenticação

Fechar isso depende do bloqueio B1 (acesso ao repo do CRM):
[processo/kfe-state.md](processo/kfe-state.md).
