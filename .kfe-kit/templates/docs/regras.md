# Regras de negócio — <produto>

Regras **transversais** a várias features. Regra que só vale dentro de uma
feature mora no arquivo dela, em [features/](features/). Regra que só vale
dentro de uma entidade mora em [objetos/](objetos/), como invariante.

Escritas como regra ("usuário free vê X, não Y"), nunca como código.

## Acesso e perfis

| Perfil | Vê | Faz | Não pode |
|--------|----|-----|----------|
| <perfil> | <o quê> | <o quê> | <o quê> |

## Planos e cobrança

| Plano | Limites | O que libera |
|-------|---------|--------------|
| <plano> | <limites> | <recursos> |

## Estados e transições transversais

| De | Para | Quando | Quem pode |
|----|------|--------|-----------|

## Exceções

| Regra | Exceção | Por quê | Aprovada por |
|-------|---------|---------|--------------|

<!-- Toda decisão de negócio tomada durante um lote volta pra cá (fw-doc C3).
     A doc é contrato quando nasce antes; vira ata quando nasce depois. -->
