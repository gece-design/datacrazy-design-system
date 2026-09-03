# Features

Cada arquivo descreve uma feature (caso de uso / área) seguindo o template
fixo do kit. Teste de granularidade: **a feature cabe inteira num prompt
junto com o código da área?** Se não cabe, divida.

## Inventário

<!-- kfe:index:start -->
<!-- Gerado por `kfe-docs index`. Não edite à mão. -->
<!-- kfe:index:end -->

## Regras

- Feature descreve o que ACONTECE com o objeto; o que o objeto TEM mora em
  [../objetos/](../objetos/).
- Feature nova = arquivo novo. Nunca anexe no fim de outra "porque é pequena".
- Toda feature lista os objetos e os componentes que toca — é isso que deixa
  a IA carregar só o necessário.

## Como adicionar uma feature

Arquivo novo a partir do template do kit (`templates/docs/features/feature.md`), com
TODAS as seções obrigatórias. Depois: `node <kit>/scripts/kfe-docs.mjs index`.
