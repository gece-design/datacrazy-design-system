# Objetos do domínio

Cada arquivo descreve uma entidade: atributos, invariantes, relacionamentos e
onde é usada. **Os atributos vivem aqui e em mais lugar nenhum** — os outros
documentos linkam para cá.

## Inventário

<!-- kfe:index:start -->
<!-- Gerado por `kfe-docs index`. Não edite à mão. -->
<!-- kfe:index:end -->

## Relacionamentos

```
<Entidade> (1) ──< <Entidade>     (<cardinalidade em uma linha>)
```

## Convenções comuns a TODOS os objetos

- **PK**: `id` (<UUID>).
- **Timestamps**: `created_at`, `updated_at`<, `deleted_at?` (soft delete)>.
- **Audit mínimo**: `created_by` quando aplicável.

Persistência é decisão do back: [../03-contrato-api.md](../03-contrato-api.md).

## Como adicionar um objeto

Arquivo novo a partir do template do kit (`templates/docs/objetos/objeto.md`), com
TODAS as seções obrigatórias. Depois: `node <kit>/scripts/kfe-docs.mjs index`.
