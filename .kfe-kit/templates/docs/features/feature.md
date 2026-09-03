# Feature: <Nome>

## Objetivo

<uma frase: que problema do usuário isto resolve.>

## Atores

- <perfil> — <o que faz aqui>

## Pré-condições

- <o que precisa ser verdade antes de começar>

## Fluxo principal

```
1. <passo>
2. <passo>
3. <passo>
```

## Estados e exceções

| Estado | Quando | O que o usuário vê |
|--------|--------|--------------------|
| vazio | <sem dado> | <empty state> |
| carregando | <fetch em curso> | <skeleton \| spinner> |
| erro | <falha> | <mensagem + ação de recuperação> |
| <exceção> | <condição> | <comportamento> |

## Regras de negócio

<!-- Escritas como regra ("usuário free vê X, não Y"), nunca como código.
     Regra transversal a várias features mora em ../regras.md — aqui, link. -->

- <regra>

## Objetos envolvidos

- [<Entidade>](../objetos/<entidade>.md) — <papel nesta feature>

## Componentes envolvidos

- [<Componente>](../componentes/<Componente>.md) — <papel nesta feature>

## Rotas/telas

| Rota | Tela | Acesso |
|------|------|--------|
| <'/x'> | <Tela> | <perfil> |

Mapa completo: [../04-navegacao.md](../04-navegacao.md).

## Contratos consumidos

- [`I<Nome>`](../05-contratos.md#i<nome>)
- Endpoints: <lista> — padrões em [../03-contrato-api.md](../03-contrato-api.md)
