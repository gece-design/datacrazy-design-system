# Objeto: <Entidade>

## Responsabilidade

<uma frase: o que esta entidade representa no domínio.>

## Atributos

| Nome | Tipo | Obrigatório | Observação |
|------|------|-------------|------------|
| id | UUID | sim | PK |
| <campo> | <tipo> | <sim/não> | <FK → [<Outra>](<outra>.md) \| regra curta> |
| created_at | timestamp | sim | |
| updated_at | timestamp | sim | |

## Invariantes / Regras

<!-- O que é SEMPRE verdade sobre esta entidade. Regras de fluxo ficam na
     feature; aqui fica o que o objeto garante sozinho. -->

- <ex.: `(tenant_id, numero)` é único.>
- Transições de status válidas:
  - `<de> → <para>` (<quando>)

## Relacionamentos

- <N:1> com [<Entidade>](<arquivo>.md)
- <1:N> com [<Entidade>](<arquivo>.md) (<composição/agregação>)

## Usado em

- [<Feature>](../features/<feature>.md) — <papel>
- [<Componente>](../componentes/<Componente>.md) — <papel>
