# Auditoria — DataCrazy (CRM) · 2026-09-01 — **PARCIAL**

> ⚠️ **Auditoria incompleta por bloqueio de acesso.** A fw-audit exige acesso
> ao repositório e ao Figma via MCP. Esta sessão **não tem nenhum dos dois**.
> Tudo abaixo é **evidência secundária**, extraída do `Artefato-01 Ponto
> Zero.pdf` (auditoria feita em 18/08/2026 sobre `datacrazy-front-end@develop`,
> ~2.700 tickets varridos no Gleap) e da landing pública.
> **Nada aqui foi medido por mim.** As métricas que a fw-audit pede — razão
> token/valor solto, % de markup ad-hoc, prontidão dos frames, listas de
> paridade — continuam **em aberto**.

## 1. Código — tokens

**Existe base estruturada** (P7). `globals.css` define variáveis CSS em HSL
(`--primary`, `--border`, `--muted`, `--destructive`, `--title`, `--subtitle`,
`--red`) combinadas com `tailwind.config.ts`, em estilo próximo ao shadcn/ui.
Diagnóstico do PDF: *"o que falta é documentação e consistência de aplicação,
não uma fundação a ser criada do zero."*

Razão tokens vs. valores soltos: **NÃO MEDIDA** — exige o repo.
Evidência dura de indisciplina: **13 de ~30 variáveis têm valor idêntico entre
`:root` e `.dark`** (`--title`, `--subtitle`, `--primary`, `--red`, `--border`).
`--title` = `240 10% 4%` enquanto `--background` vai de branco a `0 0% 7%` no
escuro ⇒ título quase invisível. Confirma o ticket #80174.

## 2. Código — componentes

Amostra de N telas: **NÃO FEITA** — exige o repo.
O que se sabe: usa **Radix UI**, mas os atributos ARIA aparecem *como
consequência* do Radix, não por decisão deliberada (P11).
Duplicatas suspeitas: **não levantadas**.

## 3. Figma — fundações

| Arquivo | Estado |
|---|---|
| `DESIGN---DATA-CRAZY` (Gabriel) | **Em andamento** — declarado pelo humano como sujeito a refinamento |
| Figma da base visual atual do CRM (Davi → João) | **Link não fornecido** a esta sessão |
| `FIGJAM---DATA-CRAZY` | PRD destrinchado + design thinking |

Variables definidas · variantes · auto-layout na amostra de 5 frames:
**NÃO VERIFICADOS** — não há MCP do Figma nesta sessão.

## 4. Paridade

| Pareados | Só no código | Só no Figma |
|----------|--------------|-------------|
| **não levantado** | **não levantado** | **não levantado** |

Exige os dois lados abertos ao mesmo tempo. É o gap mais caro em aberto.

## 5. Docs e infraestrutura

| Artefato | Existe? | Atual? |
|---|---|---|
| Manual de marca / brandbook | **Não** (P5) — nenhum versionado | — |
| stack.md | Não no produto | criado aqui como retrato (`docs/01-arquitetura.md` v2) |
| PRD / regras / glossário | Não no produto | criados aqui neste ciclo |
| Skill do projeto / CLAUDE.md | **Não verificado** no repo | — |
| Lint de acessibilidade | **Não existe** (P11) | — |
| Auditoria de a11y | **Nunca realizada** (P11) | — |
| i18n | Existe: `next-intl` com `en`, `es`, `pt-br` | cobertura x negócio a confirmar |

## 6. Classificação proposta

### Cenário **C** — sem design system consolidado

Justificativa por evidência:

1. **Lado do código: fundação existe, disciplina não.** Ter variáveis CSS não
   é ter DS. O dark mode quebrado em 13 variáveis prova que o conjunto não é
   governado — ninguém checa se um token *muda* entre temas.
2. **Lado do Figma: não estabelecido.** O arquivo canônico está em construção
   e o do estado atual sequer chegou a esta sessão. B exige tokens
   disciplinados **nos dois lados**.
3. **Paridade: desconhecida.** Sem as três listas, não há como afirmar B.
4. **Documentação: ausente.** Sem brandbook, sem doc de tokens, sem regra de
   uso — o que o próprio PDF aponta como o que falta.
5. **Sintoma de campo:** 22 tickets confirmados cujo padrão dominante é
   inconsistência **entre telas** — a assinatura clínica de C.

Regra do kit aplicada: *"Na dúvida entre B e C, classifique C — onboarding B
com base podre contamina tudo."* Aqui nem é dúvida: é falta de medição.

> **Nota honesta:** o PDF conclui que existe "base estruturada". Isso é
> compatível com C — C não significa "não tem nada", significa "não há DS
> governado". A mineração da fw-onboard (modo C) vai *aproveitar* essa base,
> não jogá-la fora.

## Gaps priorizados

1. **Acesso ao repo `datacrazy-front-end`** — sem isso a auditoria não fecha e
   a mineração de tokens da fw-onboard não roda. **Bloqueio nº 1.**
2. **MCP do Figma** — não conectado nesta sessão. Sem ele não há extração
   exata nem diff de pixels; o pipeline pixel-perfect inteiro para.
3. **Dark mode: 13 variáveis** com valor repetido entre temas — escopo
   definido da fase de tokens, já com bug de cliente associado (#80174).
4. **Escala de camadas (`z-index`)** ausente — dois tickets de sobreposição.
5. **Tooltip em texto truncado** — três tickets do mesmo padrão; é regra de
   componente, resolve-se uma vez no DS.
6. **Responsividade inconsistente** — quatro tickets; requisito confirmado,
   logo são regressões, não melhorias.
7. **Ausência de lint de a11y** — quatro tickets de acessibilidade sem nenhum
   guarda automático.
8. **Anti-referências não levantadas** (P4) — trava o moodboard da etapa 5.

## Telas-alvo do primeiro lote (definidas pelo humano no gate)

- **PENDENTE.** Candidatas por concentração de dor: Multiatendimento/Chat ·
  Pipelines/Automações · card do lead e do negócio.

## Fontes

- `Artefato-01 Ponto Zero.pdf` — PRD com evidência, 18/08/2026 (Gleap ~2.700
  tickets; auditoria de código em `datacrazy-front-end@develop`; conversas com
  Davi e Gava)
- https://datacrazy.io — posicionamento e módulos
- Links do Figma/FigJam em `docs/processo/referencias.md`
