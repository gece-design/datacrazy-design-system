# Checklist de prontidão do Figma — DataCrazy

<!-- BLOQUEANTE: frame reprovado em qualquer critério não entra na geração.
     Publicado antecipadamente (artefato da etapa 4) porque o Figma está em
     construção e o humano pediu as indicações de refinamento. Os parâmetros
     de render marcados como "confirmar" dependem do repo, sem acesso hoje. -->

Arquivo: `DESIGN---DATA-CRAZY` · https://www.figma.com/design/LD0EAR1hUILlLvNi0Rkl7e/DESIGN---DATA-CRAZY

## Critérios (por frame)

- [ ] **Auto-layout em 100% dos containers** — exceções listadas e
      justificadas no fim deste arquivo. Sem auto-layout, sem geração:
      largura "que coube" vira valor mágico no código (regra G3)
- [ ] **Nomes semânticos do glossário** — zero `Frame 427`, zero `Group 12`.
      O nome do componente no Figma é o nome da classe React
- [ ] **Cor, tipografia, espaçamento e raio via variables** — zero valor
      solto. Um hex digitado à mão é um token que não existe
- [ ] **Variantes estruturais** — tamanho, tipo, densidade. **NÃO** estados de
      interação: hover, focus, active, disabled e loading saem do Figma por
      decisão registrada (exceção **E-01** no estado). Eles são derivados por
      regra em `docs/processo/interactions.md`
- [ ] **Estados de conteúdo continuam no Figma**: vazio, erro e carregando
      mudam o **layout**, não só a cor — regra não resolve, desenho resolve
- [ ] **Assets marcados para export** (ícones e imagens). O logo já existe no
      repo (`datacrazy.svg` + variações claro/escuro): use as mesmas, não
      redesenhe

## Critérios específicos do DataCrazy

Cada um fecha um padrão de bug real (ver `docs/regras.md` · E1–E7):

- [ ] **Os dois temas desenhados.** Todo frame e todo componente existem em
      claro **e** escuro. Dark mode é requisito confirmado (R1) — e a cor do
      escuro **não pode ser deduzida** do claro por mim: sem o frame escuro,
      a geração para
- [ ] **Nenhuma variable com o mesmo valor nos dois temas** sem intenção
      declarada. É o bug #80174 chegando ao Figma pela porta da frente
- [ ] **Estado de texto longo previsto.** Todo componente que exibe texto
      dinâmico tem variante com string longa — `es` e `pt-br` são ~20–30%
      maiores que `en` (R3)
- [ ] **Truncamento sempre com tooltip.** Se o design trunca, existe a
      variante com tooltip ao lado. Truncamento mudo não passa (E1)
- [ ] **Camadas declaradas.** Sobreposição (dropdown, sticky, modal, toast)
      segue uma ordem nomeada, não improviso por frame (E2)
- [ ] **Densidade justificada.** Card do lead e do negócio: informação
      repetida precisa de motivo — o cliente já reclamou de não achar a
      etapa do funil (#34395)
- [ ] **Foco:** não precisa ser desenhado (E-01), mas o **token do anel de
      foco** precisa existir nas variáveis — foco visível continua sendo
      critério de pronto (E7)

## Convenção de handoff

| No Figma | Vira |
|----------|------|
| Componente | Componente React (par 1:1) |
| Variante | Prop/estado do componente |
| Variable | Token do config (`globals.css` / `tailwind.config.ts`) |
| Instância | Uso/import — nunca reimplementação |
| Frame de tema | Classe `.dark`, nunca componente duplicado |

## Parâmetros de verificação do produto

- **Viewports (= larguras dos frames):** desktop e mobile no mínimo.
  Os breakpoints reais vêm do `tailwind.config.ts`, que tem `2xl` e `3xl`
  customizados — **confirmar valores** (sem acesso ao repo).
  Proposta até lá: `1440` desktop · `390` mobile.
- **deviceScaleFactor:** 2
- **Diff:** `.kfe-kit/scripts/pixel-diff.js` (threshold de anti-aliasing 0.1)
- **Aceite:** ≤ 1% de pixels divergentes **e** geometria sem divergência
- **Zoom:** verificação inclui pelo menos um nível acima de 100% (E3)
- **Fontes:** Inter — pesos a confirmar. Ver `docs/processo/fonts-checklist.md`.
  Fallback do sistema no render = diff inválido

## Exceções de auto-layout aprovadas

- <frame> · <motivo> · <aprovado por>
