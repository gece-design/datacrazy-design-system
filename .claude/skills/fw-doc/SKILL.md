---
name: fw-doc
description: Etapa 7 do Kill Front-End — DOC. Dona da arquitetura de documentação do produto (SOLID aplicado a docs) — escreve a doc dos componentes, sincroniza regras e features, registra ADRs, regenera os índices e roda a auditoria da estrutura. Use quando o orquestrador indicar a etapa 7, ao fim de cada lote da etapa 6, ou quando o usuário pedir para atualizar/organizar a documentação de um produto do framework.
---

# Etapa 7 — DOC

Doc automática ou doc mentirosa: toda doc que depende de alguém lembrar vai
mentir em 30 dias. Esta etapa roda ao fim de CADA lote da UI, não uma vez.

Esta skill é a **dona da arquitetura de documentação**. O contrato (árvore,
donos, seções obrigatórias por tipo, regras duras) está em
`.claude/skills/kill-front-end/doc-architecture.md` — leia antes de escrever
qualquer arquivo. Formato não se inventa: sai de `<kit>/templates/docs/`.

## Pré-voo
Lote da fw-ui recém-fechado (esta etapa roda por lote, nunca "no final");
árvore `docs/` existente (`node <kit>/scripts/kfe-docs.mjs init` se não);
pipeline de extração funcionando — se o passo manual apareceu, conserte o
pipeline antes.

## Processo

1. **C1 · Auditoria de doc no código**: varra os componentes do lote. Cada um
   tem doc no padrão (descrição, props, exemplo)? Sem doc → escreva agora,
   lendo o código. Componente sem doc não entra no DS.
2. **C2 · Componentes → `docs/componentes/<Componente>.md`**: um arquivo por
   componente, a partir de `templates/docs/componentes/componente.md`, com TODAS as
   seções do tipo. Preencha **lendo o código gerado** — props reais,
   variantes reais, tokens reais, exemplo copiado do uso real. Nunca de
   memória. **Não escreva a seção Estados**: ela é gerada no passo C7 a
   partir do registro — o JSON é o dono do fato, o markdown é a vista. Atualize também o catálogo/página /design-system do produto: se
   o processo exigiu passo manual, conserte o pipeline antes de seguir.
3. **C3 · Sincronizar features, objetos e regras**: decisões de negócio
   tomadas durante o lote (novas regras, mudanças de estado, exceções)
   voltam pra `docs/regras.md`, pras `docs/features/*` e pros
   `docs/objetos/*` afetados. Regra transversal mora em `regras.md`; regra
   de um caso de uso mora na feature; invariante de entidade mora no objeto.
   **Nunca nos três.** A doc continua viva — a IA da próxima sessão gera
   contra regras atuais, não mortas.
4. **C4 · Contratos** (`docs/05-contratos.md`): port, prop compartilhada ou
   contrato de estado que nasceu no lote entra no catálogo. Implementação
   nova NÃO muda o contrato — só acrescenta uma linha na lista (OCP).
5. **C5 · ADRs**: cada desvio de padrão aprovado no lote vira uma entrada em
   `docs/processo/adr.md`: data, o que desviou, por quê, quem aprovou. Três
   linhas bastam.
6. **C6 · Registro de componentes (a memória da camada 2)**: para cada
   componente do lote, grave a entrada em
   `docs/processo/components-registry.json` lendo o código gerado — nome,
   família, node do Figma, lote, variants, tokens, motion e, por estado,
   `impl` + `source` (`figma|declarado|banco|inferido|humano`) + `rule` +
   `precedent` + `approvedIn`. Nunca à mão, nunca de memória. Este arquivo é
   o que faz o componente 40 nascer sabendo o que os 39 anteriores
   decidiram; o `docs/componentes/<X>.md` do passo C2 é a face legível dele
   — e o `audit` reprova se um existir sem o outro. Depois de gravar, rode
   `node <kit>/scripts/kfe-interactions.mjs audit` e `... pending` e leve o
   resultado pro gate da UI.
7. **C7 · Índice e auditoria da arquitetura** (o passo que impede a doc de
   apodrecer):
   ```bash
   node <kit>/scripts/kfe-docs.mjs index   # regenera os índices
   node <kit>/scripts/kfe-docs.mjs audit   # verifica a estrutura
   ```
   `index` reescreve `docs/README.md`, os READMEs de `objetos/`, `features/`
   e `componentes/` lendo os arquivos reais, e a tabela **Estados** de cada
   `docs/componentes/<X>.md` a partir do registro — **nunca edite nada disso
   à mão**. `audit` vermelho = etapa não fechou: link quebrado,
   arquivo fora do template do seu tipo, órfão de índice ou atributo
   duplicado fora de `objetos/` são bugs, não estilo. Corrija e rode de novo.
8. **C8 · Paridade**: rode a auditoria Figma ↔ código do lote. Componente
   órfão de um lado → reporte no gate da UI.

## Definição de pronto (artefatos)

- `docs/componentes/<X>.md` para TODO componente do lote, no template do tipo
- Catálogo/página /design-system atualizada com o lote
- `docs/regras.md`, `docs/features/*` e `docs/objetos/*` sincronizados ·
  `docs/05-contratos.md` atualizado · `docs/processo/adr.md` com os desvios
- `docs/processo/components-registry.json` com TODO componente do lote ·
  `kfe-interactions audit` sem divergência de regra não registrada
- **`kfe-docs audit` sem erro** (avisos permitidos e reportados no gate)

## Gate (técnico)

Checklist verde: todo componente do lote com doc no template, registro
atualizado, índices regenerados, `kfe-docs audit` sem erro, pipeline rodou
sem passo manual, zero órfão de paridade (ou órfãos reportados). Sem
aprovação humana dedicada — o resultado aparece no gate da UI.

## Regras

- Doc é parte da definição de pronto, não um extra.
- Um fato tem UM dono. Duplicata é a origem de toda doc contraditória.
- Índice é gerado, nunca escrito. Índice à mão mente na segunda semana.
- Desvio sem ADR é bug esperando ser "corrigido" de volta.

Protocolos comuns: `.claude/skills/kill-front-end/protocols.md`.
Arquitetura da doc: `.claude/skills/kill-front-end/doc-architecture.md`.
