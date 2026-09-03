# Features

Cada arquivo descreve uma feature (caso de uso / área) seguindo o template
fixo do kit. Teste de granularidade: **a feature cabe inteira num prompt
junto com o código da área?** Se não cabe, divida.

> **Vazio de propósito neste ciclo.** `new-ds` entrega componentes, não
> fluxos de negócio. As features do CRM entram nos ciclos `new-screens` —
> ver [../00-visao-geral.md](../00-visao-geral.md) § NÃO-ESCOPO. O que o site
> do DS tem de "telas" é catálogo, e está em
> [../04-navegacao.md](../04-navegacao.md).

## Inventário

<!-- kfe:index:start -->
_Nenhum arquivo ainda._
<!-- kfe:index:end -->

## Regras

- Feature descreve o que ACONTECE com o objeto; o que o objeto TEM mora em
  [../objetos/](../objetos/).
- Feature nova = arquivo novo. Nunca anexe no fim de outra "porque é pequena".
- Toda feature lista os objetos e os componentes que toca — é isso que deixa
  a IA carregar só o necessário.

## Como adicionar uma feature

Arquivo novo a partir do template do kit
(`.kfe-kit/templates/docs/features/feature.md`), com TODAS as seções
obrigatórias. Depois: `node .kfe-kit/scripts/kfe-docs.mjs index`.
