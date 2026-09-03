---
name: fw-srs
description: Etapa 2 do Kill Front-End — SRS. Gera a documentação global do projeto (PRD, objetos de domínio, regras de negócio, specs por área, glossário) e a skill do projeto. Use quando o orquestrador indicar a etapa 2, ou quando o usuário pedir a documentação-fonte de um produto do framework.
---

# Etapa 2 — SRS

A doc explica o produto para humanos; a skill comanda a geração para a IA.
São dois artefatos, dois papéis. Nunca fundir.

## Pré-voo
`docs/01-arquitetura.md` aprovado (a SRS escreve sobre a stack decidida);
árvore de doc criada (`node <kit>/scripts/kfe-docs.mjs init` — idempotente);
acesso ao humano para as perguntas de PRD — sem ele presente, não conclua D1.

Todo arquivo abaixo nasce do template do seu tipo em `<kit>/templates/docs/`
e obedece o `.claude/skills/kill-front-end/doc-architecture.md`: seções
fixas, na ordem fixa. Formato não se inventa.

## Processo

1. **D1 · Visão geral** (`docs/00-visao-geral.md`): o que é, pra quem,
   proposta de valor — e a seção NÃO-ESCOPO explícita (mínimo 5 itens).
   Entreviste o humano; não invente posicionamento. (A seção Escopo v1 fica
   vazia aqui: quem preenche é a fw-ux, no gate forte.)
2. **D2 · Objetos** (`docs/objetos/<entidade>.md`, um por entidade, template
   `objeto.md`): Responsabilidade · Atributos · Invariantes · Relacionamentos
   · Usado em. Esses arquivos são a fonte dos tipos TS e dos mocks — escreva-os
   pensando nisso. **O atributo mora aqui e em mais lugar nenhum**: os outros
   documentos linkam. Depois, regenere o índice (`kfe-docs index`).
3. **D3 · Regras** (`docs/regras.md`): só o que é **transversal** — acesso e
   planos, estados possíveis, transições, cobrança. Escritas como regra
   ("usuário free vê X, não Y"), nunca como código. Regra de um caso de uso
   vai na feature; invariante de entidade vai no objeto. Nunca nos três.
4. **D4 · Features** (`docs/features/<feature>.md`, uma por área/caso de uso,
   template `feature.md`): objetivo, atores, fluxo, estados e exceções,
   regras, e as listas de objetos/componentes envolvidos **por link**.
   Teste de granularidade: a feature cabe inteira num prompt junto com o
   código da área? Se não cabe, divida — feature nova é arquivo novo (OCP).
5. **D6 · Glossário** (`docs/glossario.md`): nome canônico de cada coisa,
   idioma decidido na STACKS aplicado. Um conceito = um nome.
6. **D5 · Skill do projeto** (`.claude/skills/<produto>-frontend/SKILL.md`):
   destile TUDO — stack, lista negativa, convenções, estrutura, 1 exemplo de
   componente correto, referências por caminho para docs/ — aponte para o
   roteador `docs/README.md`, não para a pasta inteira. Enxuta: regras
   operacionais, não prosa. Preencha `docs/api-contract.yaml` com as rotas
   que os objetos e regras implicam, e os padrões em `docs/03-contrato-api.md`.
7. **D7 · Fechamento**: `node <kit>/scripts/kfe-docs.mjs index` e depois
   `... audit`. Audit vermelho = SRS não concluída — a saída diz o arquivo,
   o defeito e o template a usar.

## Definição de pronto (artefatos)

- `docs/00-visao-geral.md` · `docs/objetos/*` · `docs/regras.md` · `docs/features/*`
- `docs/glossario.md` · `docs/03-contrato-api.md` · skill do projeto v1 ·
  `docs/api-contract.yaml` com rotas
- Índices regenerados e **`kfe-docs audit` sem erro**

## Gate (humano)

O humano revisa PRD + não-escopo + regras de negócio. Objetos e specs são
apresentados em resumo; ele mergulha se quiser.

## Regras

- Doc nasce ANTES do código que governa. Doc depois é ata; antes é contrato.
- Não invente regra de negócio: pergunta aberta > suposição registrada.

Protocolos comuns: `.claude/skills/kill-front-end/protocols.md`.
Arquitetura da doc: `.claude/skills/kill-front-end/doc-architecture.md`.
