# Documentação — <produto>

Cada arquivo aqui tem **responsabilidade única** e referencia os demais por
link, em vez de duplicar conteúdo. Se você é uma IA: abra o que a tabela
abaixo manda abrir, não a pasta inteira.

## Como navegar

<!-- kfe:tree:start -->
<!-- Gerado por `kfe-docs index`. Não edite à mão. -->
<!-- kfe:tree:end -->

## Para fazer X, leia Y

| Quero... | Comece por |
|----------|-----------|
| Entender o produto | [00-visao-geral.md](00-visao-geral.md) |
| Entender o desenho técnico | [01-arquitetura.md](01-arquitetura.md) |
| Mexer em token, cor, escala ou fonte | [02-design-system.md](02-design-system.md) |
| Criar/alterar um componente | [componentes/](componentes/) + [processo/interactions.md](processo/interactions.md) |
| Implementar uma feature de negócio | [features/](features/) → o arquivo da feature |
| Entender uma entidade e seus campos | [objetos/](objetos/) → o arquivo da entidade |
| Criar/alterar tela ou rota | [04-navegacao.md](04-navegacao.md) + a feature relacionada |
| Consumir/alterar endpoint | [03-contrato-api.md](03-contrato-api.md) + [api-contract.yaml](api-contract.yaml) |
| Saber a prop ou o contrato de algo | [05-contratos.md](05-contratos.md) |
| Saber como chamar as coisas | [glossario.md](glossario.md) |
| Saber uma regra de negócio | [regras.md](regras.md) + a feature relacionada |
| Saber em que pé está o projeto | [processo/kfe-state.md](processo/kfe-state.md) |
| Entender por que algo fugiu do padrão | [processo/adr.md](processo/adr.md) |

## Princípios (SOLID aplicado a docs)

- **SRP** — 1 arquivo, 1 assunto.
- **OCP** — feature/objeto/componente novo = arquivo novo; a estrutura não muda.
- **LSP** — todo arquivo do mesmo tipo segue o mesmo template, na mesma ordem.
- **ISP** — cada arquivo carrega só o seu escopo; o resto é link.
- **DIP** — documentos referenciam por link relativo, nunca duplicam.

Contrato completo (donos, seções obrigatórias, regras):
`.claude/skills/kill-front-end/doc-architecture.md`.
Verificação: `node <kit>/scripts/kfe-docs.mjs audit`.
