# Objetos do domínio

Cada arquivo descreve uma entidade: atributos, invariantes, relacionamentos e
onde é usada. **Os atributos vivem aqui e em mais lugar nenhum** — os outros
documentos linkam para cá.

> **Vazio de propósito neste ciclo.** A entrega é um design system, e
> componente de DS **não conhece domínio** (`<LeadCard>` é do produto, não
> daqui). Os objetos do CRM entram quando telas entrarem, nos ciclos
> `new-screens`. Ver [../00-visao-geral.md](../00-visao-geral.md) § NÃO-ESCOPO.
> Não preencha este diretório "por completude": objeto inventado aqui vira
> componente errado lá.

## Inventário

<!-- kfe:index:start -->
_Nenhum arquivo ainda._
<!-- kfe:index:end -->

## Como adicionar um objeto

Arquivo novo a partir do template do kit
(`.kfe-kit/templates/docs/objetos/objeto.md`), com TODAS as seções
obrigatórias. Depois: `node .kfe-kit/scripts/kfe-docs.mjs index`.
