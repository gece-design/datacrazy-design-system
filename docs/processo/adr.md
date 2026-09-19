# ADRs — DataCrazy
<!-- 3 linhas bastam. Desvio sem ADR é bug esperando ser "corrigido" de volta.
     Criado em 2026-09-19 (lote B0 da auditoria de consistência) com as
     decisões já tomadas nos gates de 09-01 a 09-18 — todas lidas do log em
     kfe-state.md e dos comentários no código, nenhuma inventada aqui. -->

## ADR-001 · Estados de interação não são desenhados no Figma · 2026-09-01
Desvio: o checklist do kit exige variante para todo estado; fica suspenso (exceção E-01).
Motivo: uma regra resolve uma vez o que custaria desenhar em cada componente; a regra é sempre ancorada em token existente.
Aprovado por: humano · contrato em `interactions.md`.

## ADR-002 · Foco por `outline`, não por `ring` com offset · 2026-09-01
Desvio: I4 fala em ring; o DS usa `outline outline-2 outline-offset-2 outline-ring` (D6).
Motivo: o offset do ring é pintado com cor sólida e vira halo errado dentro de card, modal e linha de tabela; o vão do outline é transparente.
Aprovado por: humano, na página do Button.

## ADR-003 · Ícones vêm do Phosphor, com um peso só · 2026-09-01
Desvio: anti-referência nº 14 (ícone de biblioteca); o Figma desenhava carets à mão.
Motivo: 9.000 ícones, 6 pesos, MIT; peso único (`regular`, `fill` no selecionado) mitiga a anti-referência. Caret desenhado à mão saiu (2026-09-04).
Aprovado por: humano.

## ADR-004 · Moldura do site de docs não é superfície do produto · 2026-09-01
Desvio: `components/ds` usa classes `.chrome-*` e medidas próprias, fora dos tokens do CRM (D3).
Motivo: sem a separação, ou o site fica errado ou os tokens do CRM ganham valores que só existem para a documentação.
Aprovado por: humano.

## ADR-005 · Espaçamento não é estendido no `tailwind.config` · 2026-09-04
Desvio: os 14 degraus do Figma estão documentados, não tokenizados; nada impede `p-7`.
Motivo: os degraus caem exatos na escala padrão do Tailwind; estender só duplicaria nomes.
Aprovado por: fw-ui, registrado no log · **revisar em B2** se a escala de dimensão exigir nomes.

## ADR-006 · Página atual da paginação com dois sinais · 2026-09-04
Desvio: o arquivo marca só a borda; o código usa fundo `accent` + texto `primary`.
Motivo: no escuro a borda sozinha some contra o fundo do próprio botão (I9: sinal persistente).
Aprovado por: humano.

## ADR-007 · Hover na linha da tabela, que o arquivo não desenha · 2026-09-04
Desvio: estado derivado (`overlay-item-hover`) sem desenho.
Motivo: leitura de tabela densa precisa da linha sob o cursor; token já existia.
Aprovado por: humano.

## ADR-008 · Tabs entra no DS e a fileira rola em vez de quebrar · 2026-09-15
Desvio: estava no escopo negativo do roadmap (anti-referência nº 11: abas viram duas linhas).
Motivo: a resposta à anti-referência está no componente — nunca quebra linha, rola na horizontal.
Aprovado por: humano.

## ADR-009 · Foco das abas por `ring-inset` · 2026-09-15
Desvio: única exceção à D6 (D19).
Motivo: contêiner que rola corta o outline com offset; o anel interno não é cortado.
Aprovado por: fw-ui, documentado no componente · confirmado no gate B0.

## ADR-010 · Toast com movimento e 8s na tela · 2026-09-15
Desvio: sem desenho de animação; kit pede 320ms (I10 slow) e o Toast usa 200/250.
Motivo: "muito morto" a 5s sem animação (humano). Primeiras animações do DS, sob `motion-safe:`.
Aprovado por: humano.

## ADR-011 · Header sem prop de variante · 2026-09-15
Desvio: o set do Figma tem 6 variantes; o código expõe três encaixes (`trilha`, `utilitarios`, `acoes`).
Motivo: trilha, título e ações variam sem limite no produto; variante fechada seria mentira.
Aprovado por: humano.

## ADR-012 · Badge sai do showcase, fica no código · 2026-09-15
Desvio: componente sem página própria (`/data-display/tag` tomou o lugar).
Motivo: o produto usa Tag; Badge continua servindo a DataTable.
Aprovado por: humano.

## ADR-013 · Scrim a 40% · 2026-09-15
Desvio: `overlay-scrim` tem cor e não alfa; Drawer e Modal usam `/40` derivado.
Motivo: a camada nunca foi desenhada; valor aprovado no Drawer e reusado no Modal. **Vira token em B2** (pendência 7).
Aprovado por: humano.

## ADR-014 · Sombra interna só no tema claro · 2026-09-18
Desvio: `--shadow-button-inner` vira `none` no `.dark`; só `primary` mantém o brilho.
Motivo: o brilho é claro e lava `tertiary`, `soft`, a busca do Header e o View Switcher sobre superfície escura.
Aprovado por: humano.

## ADR-015 · Button `soft` com par escuro próprio · 2026-09-18
Desvio: o arquivo repete `base/blue/50` + `blue-600` nos dois modos.
Motivo: saía branco-azulado no escuro; par `accent` + `blue-300`, hover `neutral-800` (o mesmo de `nav/item`).
Aprovado por: humano.

## ADR-016 · Seleção do Segmented visível no escuro · 2026-09-18
Desvio: `--segmented-item-selected` é `accent` no claro e `background` no escuro.
Motivo: `accent` (#232C3D) era quase o `card` (#25252D) da trilha — "os seletores não funcionam".
Aprovado por: humano.

## ADR-017 · Subtítulo do Header fora por padrão · 2026-09-18
Desvio: o arquivo desenha subtítulo; o código guarda só o espaço (`min-h-[46px]`).
Motivo: título e descrição decorativos em toda tela são anti-referência nº 12; o Header fecha em 111px com ou sem ele.
Aprovado por: humano.

## ADR-018 · Interruptor lista/cards do Drawer não é o Switch do DS · 2026-09-18
Desvio: `SeletorDeVisao` é um `role="switch"` próprio, cinza (AUD-045).
Motivo: o Switch fica azul quando ligado e competiria com o item selecionado, que é o que a pessoa procura. Alternativa para um lote futuro: variante neutra do Switch.
Aprovado por: humano.

## ADR-019 · Drawer entra em 280ms com curva própria · 2026-09-18
Desvio: I10 pede 320ms; o Drawer usa 280 com `cubic-bezier(0.32,0.72,0,1)` e sai em 200 `ease-in`.
Motivo: "tá muito seco" (humano); a curva assenta o painel em vez de parar. Vira `slow` + `ease-settle` em B2.
Aprovado por: humano.

## ADR-020 · Auditoria de consistência corrige sem remedir o Figma · 2026-09-19
Desvio: lotes B0–B9 mudam implementação, tokens, movimento e docs com o estado de repouso congelado (regressão a 0%), sem pixel-diff contra o arquivo.
Motivo: a ponte do Figma está fechada; o que diverge do arquivo fica `adiado` em `consistencia.json` (lote `figma`).
Aprovado por: humano.

## ADR-021 · Escala de movimento fast 150 · base 200 · slow 280 · 2026-09-19
Desvio: a I10 do kit diz 120 / 200 / 320.
Motivo: 150 é o Tooltip aprovado e o valor de fato de todo hover (default do Tailwind); 280 é o Drawer aprovado. O fade do Toast sobe de 250 para 280 para caber na escala. Mudar o hover para 120 seria alterar o produto sem aprovação.
Aprovado por: humano, gate B0.
