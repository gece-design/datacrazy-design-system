# UX — direção visual: a evidência (etapa 5 · parte 1)

> **O que este arquivo é.** A evidência bruta que produziu a direção visual:
> os 30 stickies do FigJam, as tensões abertas e as análises do board.
> **As decisões que saíram daqui moram em
> [../02-design-system.md](../02-design-system.md)** — aqui não se decide nada,
> aqui se registra de onde a decisão veio. Dono: `fw-ux` (U4).

> **v1 → v2:** a v1 listava 8 eixos em aberto e registrava as anti-referências
> como bloqueio. Elas **existem** — estavam no FigJam, seção PASSO 3 · DEFINE,
> em duas colunas de 15 stickies. Lidas via MCP do Figma Dev Mode em
> 2026-09-01. Bloqueio B3 encerrado.
>
> **Procedência:** os 30 stickies não têm autor registrado no arquivo (os
> demais do board são do Gabriel). O vocabulário sugere fala de time
> ("o cara sabe", "dane-se"). Vale confirmar de quem são antes de tratar
> como decisão do cliente.


## O que o time MAIS gosta (15)

**Registro e edição**
1. Drawer lateral do registro: abre fino no canto direito ou em tela cheia, fecha no X — *Twenty*
2. Accordion dentro do drawer para minimizar informação — *Twenty*
3. Edição inline: clica no campo e edita, sem abrir formulário — *Twenty / Linear*

**Navegação**
4. Sidebar com grupos colapsáveis em accordion — *Linear*
5. Favoritos e últimos acessos fixados na sidebar — *Linear / Attio*
6. Colapsar a sidebar inteira — heavy user não quer perder 15–20% da tela
7. Breadcrumb de 2 níveis: `Leads > nome do lead`. Nunca mais que isso
8. Canto superior direito reservado a ações genéricas: perfil, tema, notificação, IA, chat
9. Busca com listagem e atalhos de teclado visíveis: Esc, setas, Enter — *Attio*

**Exibição de dados**
10. Lista sem header de coluna — *"não preciso dizer que a data é a data de criação, o cara sabe"*
11. Tabela com resize de coluna e duplo clique para ajustar ao conteúdo — *Attio*
12. Gráfico minimalista: sem eixo, legenda embaixo, valor no hover
13. Dashboard montado pelo usuário, com card colapsável e seta de ver dados detalhados

**Sobreposição e cor**
14. Modal com grupos à esquerda, conteúdo à direita e área de botão separada — *Attio*
15. Card de conexão com cor sutil de fundo e marca d'água no lugar do ícone — *respond.io*

## O que o time MENOS gosta — as anti-referências (15)

**Forma**
1. **Borda muito arredondada** — *"passa aplicativozinho de iOS baratinho. CRM precisa de autoridade e credibilidade"*
2. **Quebra de padronização** — botão redondo num lugar e card quadrado no outro, sem motivo

**Cor**
3. **Card inteiro colorido** — cor entra só em borda e em tag
4. **Cores muito saturadas**
5. **Amarelo como cor de marca**
6. **Gradiente de fundo** no sistema inteiro

**Superfície**
7. **Glass e liquid glass** — efeito pesado para quem fica o dia inteiro na tela

**Tipografia**
8. **Fonte exagerada em título**
9. **Muita informação com a mesma fonte, sem contraste** — *"parece visual de e-mail"*

**Navegação**
10. **Menu lateral e menu superior ao mesmo tempo**
11. **Abas como forma de crescer** — quebram por navegador e viram duas linhas

**Densidade**
12. **Título e descrição em toda tela** — *"dane-se, o cara sabe"*
13. **Gráfico gastando espaço com eixo e legenda**

**Iconografia**
14. **Ícones muito arredondados** (respond.io) — manter o padrão atual, **Lucide**

**Escopo**
15. **Layout "diferentão"** — o diferente é *"algumas pinceladas"*, não um layout novo

## O que isso já decide

Movido para [../02-design-system.md](../02-design-system.md) § Direção visual —
decisão tem um dono só (DIP).

## Tensões a resolver no gate (decisão sua, não minha)

**T1 · Tipografia — RESOLVIDA em 2026-09-01: é a Geist.**
O humano confirmou, e as 72 variáveis `text/*` do Figma declaram `Geist`
(mono: `Geist Mono`). A escala inteira está em [tokens-migracao.md](tokens-migracao.md). Sobra
uma consequência: o app roda Inter, então há migração de fonte a planejar.

<details><summary>Registro da tensão original</summary>

Os insights do PASSO 1 dizem: *"INTER é uma fonte super manjada, é o default de
plataformas de IA. Podemos usar outra? Talvez até parecida com a atual. Não
mudar drasticamente. Continuar com legibilidade boa e formalidade."*
Mas [fonts-checklist.md](fonts-checklist.md) e o PRD tratam Inter como resolvida (Google Font,
sem licenciamento). **São coisas diferentes:** licença está resolvida; a
escolha, não. Trocar a família muda toda a escala tipográfica e invalida
qualquer medição feita antes.
→ Resolvido: Geist.
</details>

**T2 · "Mais cor" vs. "cor não preenche superfície"**
Insight de marca: *"mais cores, mais ilustrações, mais motion, talvez o mascote
Eisten como agente geral, linguagem um pouco mais descontraída."*
Anti-referências: card colorido, saturação alta e gradiente estão fora.
→ Compatível, mas exige regra: a expansão de cor vive em **ilustração, mascote
e comunicação**, não na estrutura da interface. Confirmar.

**T3 · "Site mais clean" vs. produto denso**
Insight: aproximar o visual da marca do site à plataforma, deixando o site mais
clean. A análise própria diz que **densidade é estrutural** no produto.
→ São dois artefatos com metas diferentes. Confirmar que o DS serve o produto,
e o site herda a marca — não o contrário.

## As três análises do board (do Gabriel, sobre a desk research)

1. **DENSIDADE É ESTRUTURAL, NÃO ESTÉTICA** — chat multicanal, kanban, automações
   e BI convivem no mesmo painel; a interface acumula camadas por natureza da
   proposta all-in-one. O #34395 é consequência do modelo de produto, não caso
   isolado.
2. **O USUÁRIO NÃO É ANALISTA** — PME e agência brasileira: clínica, loja,
   infoprodutor. Não é usuário de Salesforce, sem tolerância a curva de
   aprendizado. Empurra para **densidade progressiva**.
3. **A ESCALA JÁ CHEGOU** — 500+ empresas, ~30% de crescimento mensal, app
   publicado. Não é produto buscando mercado, é produto buscando consistência.
   O entregável precisa ser **adotável de forma incremental** sobre o
   `globals.css` existente.

> Essas três análises são o melhor argumento a favor do cenário C e contra o
> big-bang. Estão alinhadas com a regra 14 de [../regras.md](../regras.md).

## Categorias de componentes — já fechadas em contrato

O board registra: *"As 5 categorias de componentes já estão fechadas em
contrato"* — Ações · Formulários · Navegação · Exibição de dados · Feedback e
sobreposições. Mapeamento para as famílias do kit:
[../02-design-system.md](../02-design-system.md) § Famílias de componente.
Inventário do lote 1 por categoria: [inventario-componentes.md](inventario-componentes.md).

## Saída ainda esperada desta etapa

1. **Moodboard** resolvendo T1, T2 e T3 (seu)
2. **Inventário de componentes** do primeiro lote, por categoria — derivado da
   home do CRM. Preciso ver a home: print, node do Figma ou acesso ao repo
3. Gate forte: você aprova direção + inventário item a item
