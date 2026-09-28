# DataCrazy — Regras — **v2**

> **v1 → v2:** acrescentadas as regras que nascem de bug real registrado. Cada
> uma delas fecha um padrão de falha dos 22 tickets confirmados — resolver no
> DS é resolver uma vez, em vez de tela a tela.

## Regras de negócio

**Fora deste ciclo.** Acesso, planos, estados de domínio e cobrança são regras
de produto — entram quando as telas entrarem, vindas do humano. O CRM já as
tem implementadas; documentá-las é trabalho retroativo de outro ciclo.

## Regras que nascem de bug (evidência nos tickets)

| # | Regra | Origem |
|---|---|---|
| E1 | **Texto que pode truncar carrega tooltip com o conteúdo completo.** Não existe truncamento mudo no DS. | #83283 · #83274 · #59567 |
| E2 | **`z-index` só via escala de camadas do DS** (ex.: base → dropdown → sticky → modal → toast). Número cru em componente é rejeitado. | #86338 · #86178 |
| E3 | **Componente responde a zoom e a viewport.** Nada de dimensão que só fecha em 100% de zoom; verificação inclui pelo menos um nível de zoom além de 100%. | #83285 · #80170 · #79852 · #53179 |
| E4 | **Nenhuma variável de tema repete valor entre claro e escuro** sem intenção declarada por escrito. Vale checagem automática — é literalmente o bug #80174, 13 de ~30 variáveis. | #80174 |
| E5 | **Densidade é decisão de design, não acúmulo.** Componente que empilha informação repetida precisa de justificativa; o cliente já reclamou de não achar a etapa do funil. | #34395 |
| E6 | **Erro de validação não é mensagem solta.** O DS oferece o padrão (inline + modal quando bloqueante); a escolha é da spec, nunca do improviso. | #39683 |
| E7 | **Acessibilidade é critério de pronto**, mesmo sem exigência formal de WCAG: foco visível, navegação por teclado, contraste. | #62306 · #61699 · #85316 · #79729 |

## Regras que nascem das anti-referências

Fonte: FigJam · PASSO 3 · DEFINE, coluna "O que MENOS gosta". Interpretação e
contexto em `docs/processo/ux-direcao-visual.md`.

| # | Regra | Anti-referência |
|---|---|---|
| A1 | **Raio contido e uniforme.** Arredondamento forte está fora — *"passa aplicativozinho de iOS baratinho; CRM precisa de autoridade"*. E o mesmo raio vale para botão, card e input: forma diferente exige motivo | nº 1, nº 2 |
| A2 | **Cor não preenche superfície.** Cor entra em **borda e tag**, não no corpo do card. Saturação baixa. **Amarelo não é cor de marca** | nº 3, 4, 5 |
| A3 | **Sem gradiente de fundo e sem glass.** Efeito pesado para quem passa o dia na tela | nº 6, 7 |
| A4 | **Hierarquia por contraste, não por tamanho.** Título discreto; texto uniforme sem contraste é o que faz *"parecer visual de e-mail"* | nº 8, 9 |
| A5 | **Um menu só.** Lateral **ou** superior, nunca os dois. Abas não são estratégia de crescimento — quebram por navegador e viram duas linhas | nº 10, 11 |
| A6 | **Nada de título e descrição decorativos** em toda tela. Se o usuário já sabe onde está, o texto é ruído | nº 12 |
| A7 | **Gráfico minimalista:** sem eixo, legenda embaixo, valor no hover | nº 13 e gosto nº 12 |
| A8 | **Ícones Phosphor** (decisão do humano, 2026-09-01), com **um único peso** em toda a interface — `regular` padrão, `fill` para selecionado. Peso misto é quebra de padronização | nº 14 (conflito registrado em `docs/01-arquitetura.md`) e nº 2 |
| A9 | **"Algumas pinceladas", não layout novo.** O DS é adotável de forma incremental sobre o que existe — coerente com a regra 14 | nº 15 |

## Padrões que o time quer (do "O que MAIS gosta")

| # | Padrão | Onde vira componente |
|---|---|---|
| G1 | Drawer lateral do registro (fino à direita ou tela cheia, fecha no X), com accordion dentro | Sobreposições |
| G2 | Edição inline: clica no campo e edita, sem abrir formulário | Formulários |
| G3 | Sidebar colapsável com grupos em accordion, favoritos e últimos acessos | Navegação |
| G4 | Colapsar a sidebar inteira — heavy user não perde 15–20% da tela | Navegação |
| G5 | Breadcrumb de no máximo 2 níveis | Navegação |
| G6 | Canto superior direito reservado a perfil, tema, notificação, IA e chat | Navegação |
| G7 | Busca com listagem e atalhos de teclado **visíveis** (Esc, setas, Enter) | Navegação |
| G8 | Lista sem header de coluna quando o dado é auto-evidente | Exibição de dados |
| G9 | Tabela com resize de coluna e duplo clique para ajustar ao conteúdo | Exibição de dados |
| G10 | Modal em três áreas: grupos à esquerda, conteúdo à direita, botões separados | Sobreposições |
| G11 | Card colapsável com seta de "ver dados detalhados"; dashboard montado pelo usuário | Exibição de dados |

## Regras de uso do design system

### Tema
1. Todo componente funciona em claro **e** escuro sem ramificação de código:
   a troca acontece no token.
2. Componente nunca lê cor direto — só token.
3. Valor que existe no Figma em um só tema é **bloqueio**, não licença para
   estimar o outro.

### i18n (multi-idioma é requisito — R3)
4. Componente do DS não embute texto. Toda string vem de fora, via `next-intl`.
5. Todo componente é testado com string longa: alemão-simulado, `es` e `pt-br`
   costumam ser 20–30% mais longos que `en`. Quebrou o layout, é bug (ver E1).

### Composição
6. Variante nova só existe se existe no Figma.
7. Antes de criar componente, procure no showcase — duplicata é proibida.
8. Componente do DS não conhece domínio: `<LeadCard>` é componente de produto,
   não do DS.

### Estados
9. Todo componente interativo define default, hover, focus-visible, active,
   disabled e — quando aplicável — loading, empty e error.
10. `hover:` sempre sob `hoverOnlyWhenSupported`; o equivalente para toque é
    decidido explicitamente (G7).

### Busca, filtros e divisor no Header
- A busca é sempre `HeaderBusca` e os filtros sempre `HeaderFiltros`; nunca um
  Button com texto no lugar. Fileira de ações só com botões: busca aberta
  (184px) e filtros com rótulo. Com troca-visão, período ou data: busca
  `recolhida` (só a lupa; clicar abre) e filtros `recolhido` (só o ícone, com
  tooltip). Por tela, não por largura (ADR-028).
- `HeaderDivisor` só entre o grupo de visão (troca-visão, período, data) e a
  ação principal. Fileira só com busca, filtros e a ação não leva divisor.

### Formulário, rolagem e relevo
- Select ao lado de Input é sempre `size="field"` (a caixa do Input). O `md` é
  de card e, num formulário, parece desabilitado (ADR-038).
- Área que rola usa `rolagemDiscreta` (lib/estados.ts): barra fina, visível só
  sob o cursor. Nunca `[scrollbar-width:thin]` solto.
- Button `primary` e `destructive` são planos (ADR-037). A sombra interna
  (`shadow-button-inner`) fica em `tertiary`, `soft` e na busca do Header, e
  some no escuro.
- Cabeçalho do Modal: 12 em cima, 8 embaixo, título `h4`, X de 24 (ADR-039).
- Alça da coluna da tabela: dois cliques ou Enter ajustam ao conteúdo.
- Cartão do drawer: rótulo em bold e valor numa linha de 24 (`linhaDoCartao`).
  Select dentro do cartão é `cartao`, nunca `field` dentro de `CartaoDeCampo`.
- Drawer abre com 920px e a pessoa arrasta a borda esquerda (720 a 1240);
  `memoria` no `DrawerPainel` lembra a largura por tela.

### Fidelidade
11. Pronto = diff ≤ 1% contra o Figma **e** geometria sem divergência.
12. Divergência visual é bug do código até prova em contrário registrada como
    exceção aprovada com print.
13. Corrigiu a mesma divergência 2x → vira regra em `docs/processo/calibration.md`
    antes de continuar.

### Retroatividade (cenário C)
14. **Nunca big-bang.** O DS cobre as telas-alvo do lote; o resto do CRM migra
    lote a lote, guiado por demanda.
15. Token existente com nome ruim (`--red`) só é renomeado com plano de
    migração — renomear sem migrar quebra produção.
