---
name: fw-ux
description: Etapa 5 do Kill Front-End — UX. Design thinking com IA na síntese (pesquisa, user flows, moodboard, corte do MVP). Tem modo completo (produto novo) e modo lite (telas novas). Use quando o orquestrador indicar a etapa 5, ou quando o usuário pedir síntese de pesquisa, fluxos ou definição de escopo de telas.
---

# Etapa 5 — UX

A IA acelera a síntese; a escuta continua humana.

## Pré-voo
Modo completo: PRD existente (o corte v1 conversa com o não-escopo). Modo lite: produto onboardado (stack + skill + checklist no repo) e telas-alvo definidas pelo humano.

## Processo (modo completo — new-product)

1. **U1 · Descoberta**: peça o material bruto (entrevistas, notas, benchmark,
   dados). Se NÃO existir: gere roteiro de entrevista + lista de benchmarks
   sugeridos e PARE — pesquisa não se inventa. Retome quando houver material.
2. **U2 · Síntese**: transcreva/organize, clusterize dores e desejos, extraia
   insights. Apresente como hipóteses ("o material sugere X") — o humano
   valida o que é real e o que é ruído.
3. **U3 · User flows**: desenhe os fluxos principais em Mermaid na seção
   **Fluxos** de `docs/04-navegacao.md` (um diagrama por jornada), e preencha
   a tabela de rotas do mesmo arquivo. Nenhuma tela antes disso.
4. **U4 · Direção visual**: preencha a seção **Direção visual** de
   `docs/02-design-system.md` — referências, tom, personalidade, e o
   anti-moodboard (o que este produto NUNCA parece). Proponha; o gosto final
   é do humano. As Fundações logo abaixo não são suas: quem preenche é a
   fw-ui, com valores extraídos do Figma.
5. **U5 · Corte da v1**: liste features candidatas e proponha o corte, ligado
   ao NÃO-ESCOPO. Preencha a seção **Escopo v1** de `docs/00-visao-geral.md`:
   o que entra, o que fica pra depois, com uma linha de motivo cada — entra
   e não-entra são a mesma conversa, por isso moram no mesmo arquivo.

## Modo lite (new-screens)

Pule U1/U4. Execute: U3 pro fluxo das telas novas (adicione ao
`docs/04-navegacao.md`, seção Fluxos, e à tabela de rotas), U5 mini-corte
(o que exatamente entra neste lote) e confira as features das áreas novas em
`docs/features/` — se não existem, crie-as agora a partir de
`<kit>/templates/docs/features/feature.md` (regra D4) e rode
`node <kit>/scripts/kfe-docs.mjs index`.

## Definição de pronto (artefatos)

- `docs/04-navegacao.md` (rotas + fluxos) · seção Escopo v1 de
  `docs/00-visao-geral.md` (ou adendo do lote)
- Modo completo: síntese de pesquisa + seção Direção visual de
  `docs/02-design-system.md`
- Modo lite: `docs/features/*` das áreas novas, no template do tipo

## Gate (humano — FORTE)

Fluxos + corte são decisão de produto. Apresente com opções onde houver
dúvida e espere aprovação explícita item a item. Este é o gate mais
importante do framework: tudo depois dele é execução.

## Regras

- IA sintetiza, humano escuta: nunca invente dado de usuário ou persona.
- Tela nenhuma nasce antes do fluxo aprovado.

Protocolos comuns: `.claude/skills/kill-front-end/protocols.md`.
