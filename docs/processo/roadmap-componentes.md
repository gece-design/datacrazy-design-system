# DataCrazy — Roadmap de componentes do design system

> **O que este documento é.** O plano de construção do DS do CRM DataCrazy:
> catálogo deduplicado, ordem de lotes e escopo negativo. Nasce do cruzamento de
> quatro levantamentos independentes — telas reais do produto, cobertura de cinco
> design systems maduros, engenharia reversa a partir dos 22 tickets, e auditoria
> da infraestrutura em código. Nenhum item foi inventado: cada linha aponta para
> um ticket, uma regra (A1–A9, E1–E7, G1–G11), um nó do Figma, um arquivo do repo
> ou um DS de referência.
>
> **O que este documento não é.** Não é spec de componente e não é cronograma.
> Spec sai por componente, na etapa 6. Aqui se decide **o quê**, **em que ordem**
> e **o que fica de fora**.
>
> **Revisão de completude (2026-09-01).** Passou por uma leitura que perguntava
> só uma coisa — *o que ficou de fora?* — e o documento mudou em cinco frentes:
> dois bloqueios novos (**B7**, de onde vem o desenho de componente sem frame;
> **B8**, a paleta categórica que o `Avatar` do lote 2 já precisa); quatro itens
> que nenhum dos quatro ângulos viu (`Pointer Drag`, `Token Bridge`,
> `Assistant Launcher` e a rede de proteção da §3.4, que é onde E4, E7 e a regra
> 5 finalmente ganham dono); **nove dependências que apontavam para um lote
> posterior** ao do próprio componente, mais o `Popover`, que estava catalogado
> e não estava em lote nenhum; um item devolvido ao escopo negativo por não ter
> evidência (`Context Menu`); e duas promessas reduzidas ao que de fato entregam
> — o lote 0 e a "home inteira" do lote 2. Detalhe de cada uma no lugar onde ela
> vive.

---

## 0 · Como ler

**Convergência.** Quatro agentes levantaram os componentes por ângulos diferentes
e sem se ver. Quando o mesmo componente aparece em vários ângulos com nomes
diferentes, isso não é redundância — é sinal. A coluna `Conv.` registra em quantos
dos quatro ângulos o item apareceu:

| Ângulo | Método |
|---|---|
| **A1 · Telas** | Percorreu as dez superfícies que o produto tem evidência de ter (PRD §1, inventário do node `135:2`, tokens `nav/item/*`) |
| **A2 · DSs maduros** | Cruzou BoardUI (72), Twilio Paste (~90), Zendesk Garden (~50), GitLab Pajamas (61) e Salesforce SLDS (85), subtraiu o contrato e filtrou por relevância de CRM |
| **A3 · Defeito** | Perguntou de cada bug (E1–E7), anti-referência (A1–A9) e padrão desejado (G1–G11): *qual componente teria impedido isso de nascer?* |
| **A4 · Infraestrutura** | Auditou `tailwind.config.ts`, `package.json`, `node_modules/@radix-ui/` e o código por grep — o que falta na camada de baixo |

Um `4/4` significa: quem olhou a tela, quem olhou o mercado, quem olhou o bug e
quem olhou o código chegaram no mesmo componente. É o sinal mais forte de
prioridade que este projeto tem.

**`—` na coluna `Conv.`** significa **zero ângulos**: item que os quatro
levantamentos perderam e que entrou na revisão de completude. Não é sinal fraco
— é o oposto do sinal. São quatro: `Pointer Drag`, `Token Bridge`,
`Assistant Launcher` e a rede de proteção da §3.4. Cada um deles fecha uma
regra ou um item de G6/E7 que estava escrito nos docs e não tinha dono. O `—`
também aparece no `Button`, por outro motivo: ele já está pronto.

**Marcadores.**
`[nav]` = já está em `components/ds/nav.ts`, ou seja, já foi prometido na
navegação do showcase. `[pronto]` = já existe em código.

**Prioridade.** `alta` = destrava tela de dor concentrada, fecha regra nascida de
bug, ou é dependência de vários outros. `média` = necessário, mas depois.
`baixa` = registrado para não nascer fora do DS depois; não entra no ciclo 1.

---

## 1 · Estado atual — o mapa completo, não só o backlog

### 1.1 · O que já existe em código

| Arquivo | O que é | Estado |
|---|---|---|
| `components/ui/button.tsx` | `Button` — 4 variantes (primary, secondary, ghost, destructive) × 3 tamanhos (h-7/h-8/h-9), com `focus-visible:ring-ring` e `disabled:opacity-50` | **Pronto**, com ressalva: o anel de foco usa `ring` mas a decisão **D1** (qual é o anel, com contraste nos dois temas) nunca foi tomada. E não tem estado `loading` — lacuna que o próprio inventário registra |
| `components/ui/card.tsx` | `Card` + `CardHeader` + `CardTitle` + `CardContent` — borda `border`, fundo `card`, raio `lg` | **Pronto** |
| `components/ui/badge.tsx` | `Badge` — 6 variantes (neutral, primary, success, warning, destructive, info), cor em borda e fundo a 10% | **Pronto**, com ressalva: `success`, `warning`, `destructive` e `info` têm **o mesmo valor nos dois temas** (aberto nº 1 de `tokens-cor.md`). Quatro das seis variantes ainda não funcionam no escuro |

### 1.2 · O que existe mas **não é** do produto

`components/ds/shell.tsx`, `sidebar.tsx`, `theme-toggle.tsx`, `tree.tsx`,
`preview.tsx`, `colunas.tsx`, `logo.tsx` são a **moldura do site de documentação**.
A regra **D3** de `docs/processo/calibration.md` é explícita: *"a moldura não é superfície
do produto; usa classes `.chrome-*`, e os tokens do produto ficam só para os
componentes."* Consequência para este roadmap: **Sidebar, Theme Toggle e Topbar do
produto ainda estão por fazer** — o que existe com esse nome não serve.

### 1.3 · A fundação que já está de pé

- **Tokens de cor**: coleção `Cor` reestruturada no Figma — modos Claro/Escuro
  criados, 27 variáveis renomeadas por papel medido em 84.775 nós, inversão de
  alias `primary`/`base-blue-500` corrigida, 3 tokens criados (`border`,
  `primary-foreground`, `ring`), 521 bordas soltas em `#E1E7EF` religadas.
- **Tipografia**: 15 papéis (`display` 26px → `caption`/`overline` 10px) espelhados
  em `tailwind.config.ts` com as regras G1 (leading em px) e G2 (tracking em em).
- **Escala de camadas**: `zIndex: base → dropdown → sticky → overlay → modal →
  popover → toast` **já declarada** em `tailwind.config.ts` — resposta à regra E2.
- **Ferramental de verificação**: `scripts/medir.mjs`, `scripts/shot.mjs`,
  `scripts/auditar-sidebar.mjs`, Playwright + pixelmatch.

### 1.4 · Contrato vs. realidade

`components/ds/nav.ts` promete **18 componentes** em 5 categorias. Três estão
prontos. E o contrato tem **órfãos**: `Icon Button` está lá e a home usa `⋯` em
cada uma das 37 linhas da tabela — mas não existe nada que esse `⋯` abra.
`Input` está lá sem `Form Field`. `Modal` está lá sem `Confirm Dialog`. Os cinco
DSs de referência tratam esses pares como inseparáveis.

Este roadmap unifica **97 componentes**, **27 primitivos** e **3 verificações**
(§3.4). O `nav.ts` vai precisar crescer; a ordem de crescimento é a dos lotes
da §9.

---

## 2 · Bloqueios — decisões que travam construção

Nenhum lote abaixo do lote 0 pode começar antes destas. Não é burocracia: cada
uma delas, se ficar aberta, faz cada componente inventar a própria resposta — que
é literalmente a anti-referência nº 2 ("quebra de padronização") entrando pela
porta dos fundos.

| # | Bloqueio | Onde está registrado | O que trava |
|---|---|---|---|
| **B1** | **D1–D7 não decididas** — anel de foco, hover em superfície neutra, disabled, active, hover de success/danger, spinner vs. skeleton, superfícies do tema escuro | `docs/processo/interactions.md`, Parte 2. O próprio doc diz: *"nenhum componente deve ser construído antes delas"* | Todo componente interativo. O `Button` já foi construído sem D1 e usa `ring-ring` por convenção, não por decisão |
| **B2** | **Estados sem versão escura** — `success`, `destructive`, `warning`, `info` têm o mesmo valor nos dois modos, e os `-hover` deles são escuros e dessaturados | `docs/02-design-system.md`, aberto nº 1 | `Alert`, `Toast`, `Status Dot`, `Message Status`, 4 das 6 variantes do `Badge`. É o bug **#80174 se repetindo dentro do DS novo** |
| **B3** | **Rampa neutra incompleta** — só existe `base/neutral/900` | `docs/02-design-system.md`, aberto nº 2 | `Skeleton`, `Scrim`, `Elevation`, hover neutro (D2), trilho do `Progress` |
| **B4** | **Contradição dos gráficos** — a home desenha eixo X, eixo Y e legenda lateral; a anti-referência nº 13 rejeita exatamente isso, e o gosto nº 12 pede "sem eixo, legenda embaixo, valor no hover" | `docs/processo/inventario-componentes.md`, seção "Contradição a resolver no gate" | Todos os gráficos. Já estão em NÃO-ESCOPO (PRD §5.4); a decisão muda o desenho, não a prioridade |
| **B5** | **Conflito Phosphor × Lucide** — `regras.md` A8 decide Phosphor (humano, 2026-09-01); `direcao-visual.md` anti-ref nº 14 diz "manter o padrão atual, **Lucide**" | `docs/01-arquitetura.md`, seção Ícones | O componente `Icon`. A decisão vale (Phosphor); o que falta é **fixar um peso** — hoje há **10 arquivos** importando `@phosphor-icons/react` direto, sem invólucro que garanta isso |
| **B6** | **Versão do Tailwind do CRM** — v3 e v4 declaram tokens de formas diferentes | `docs/01-arquitetura.md`, pendência 1 | A portabilidade inteira. Este repo roda `tailwindcss ^3.4.17`; se o CRM estiver na v4, a adoção quebra na hora da entrega |
| **B7** | **De onde vem o desenho de cada componente** — a regra 6 diz *"variante nova só existe se existe no Figma"* e a regra 11 define pronto como *"diff ≤ 1% contra o Figma"*. Mas o PRD §2.1 diz que **o Figma é rascunho**, e o inventário registra que a categoria Formulários inteira *"vai precisar de outra tela-fonte ou de desenho novo"*. Dos 97 componentes deste roadmap, a **grande maioria não tem frame nenhum** | `docs/00-visao-geral.md` §2.1 · `docs/processo/inventario-componentes.md` §2 · regras 6 e 11 | **Todo lote a partir do 2.** Ou a exceção **E-01** é estendida por escrito (o Figma entrega token e repouso; estrutura e estados saem de regra), ou cada componente sem frame para na porta do critério de pronto. Hoje E-01 cobre só os estados de interação, não a anatomia de componente inexistente |
| **B8** | **Paleta categórica não existe** — `tokens-cor.md` tem semânticos, uma rampa de azul, um neutro e quatro estados. **Nada** para cor por categoria | `docs/02-design-system.md` (não consta) | `Avatar` (cor de fundo por pessoa, já na tela), `Channel Badge` (WhatsApp/Instagram/Facebook), `Status Dot` além dos quatro estados, e as séries do lote 8. O próprio §10.3 admite que *"a paleta terá de ser fechada, ou A2 e A4 são furadas por dentro"* — **mas o `Avatar` está no lote 2**, muito antes disso. Sem paleta fechada, o lote 2 inventa uma |

**Bloqueio de infraestrutura, não de decisão:** o `package.json` **não tem
`next-intl`** e o código não tem uma única ocorrência de `Intl.`,
`toLocaleString` ou `useId`. Existe **uma** ocorrência de `aria-live`, e ela está
numa página do site de documentação. O requisito R3 (en/es/pt-br) e a regra E7
não têm nem primitivo nem harness — é o que o lote 0 resolve.

---

## 3 · Primitivos e infraestrutura

Não são componentes visíveis e não ganham rota no showcase; são a camada que
torna os outros possíveis. **Este é o achado central do ângulo 4, e ele foi
verificado em código, não em documento:** `tailwind.config.ts` declara a escala de
camadas da regra E2 e **nenhum componente a consome**, porque não existe `Portal`
para consumi-la — `node_modules/@radix-ui/` tem apenas `react-slot` e
`react-compose-refs`. Zero infraestrutura de sobreposição.

**Como se sabe que um primitivo está pronto.** Aqui a regra 11 (*"diff ≤ 1%
contra o Figma"*) **não se aplica**: primitivo não tem frame. E a regra 7
(*"antes de criar componente, procure no showcase"*) também não, porque
primitivo não ganha rota. Duas consequências que o roadmap precisa assumir em
vez de deixar implícitas: (1) o critério de pronto dos primitivos é a **rede de
proteção da §3.4** — medição por Playwright, checagem de tema, teclado — não o
diff de pixels; (2) eles precisam de uma página em **Foundations**, ao lado de
Color/Typography/Icons, ou a regra 7 vira letra morta justo na camada onde
duplicar sai mais caro.

### 3.1 · Render e tipografia

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Text** | Primitivo que aplica os 15 papéis tipográficos (`display`…`overline`) | A anti-referência nº 9 exige hierarquia por peso e cor, não por tamanho. E é o único lugar que conhece a armadilha da regra **D1** do `calibration.md`: o `tailwind-merge` tratou `text-body-md` e `text-muted-foreground` como o mesmo grupo, descartou um, e o componente caiu nos 16px do navegador — **em silêncio**, só apareceu medindo com Playwright | — | 2/4 |
| **Icon** | Invólucro de `@phosphor-icons/react` com peso fixo (`regular` padrão, `fill` para selecionado) e tamanho preso à escala | Import direto deixa entrar seis pesos, que é a anti-referência nº 2. Hoje **10 arquivos** importam Phosphor sem invólucro. O peso `fill` casa com os tokens `nav/item/icon-selected` que já existem | Density Provider | 3/4 |
| **Fluid Scale** | Ponte px→rem na escala tipográfica e de espaçamento | A escala inteira do `tailwind.config.ts` está **em px** (`"body-md": ["12px", …]`), então quem aumenta o tamanho de fonte do sistema não é atendido — só quem dá zoom. É a metade invisível dos quatro tickets de zoom (#83285, #80170, #79852, #53179) | Text | 1/4 |
| **Density Provider** | Contrato de densidade (compacto/confortável) herdado por contexto: altura de linha, padding, tamanho de controle | E5 diz que densidade é decisão de design, não acúmulo, e a análise do board diz que ela é **estrutural**. Só é operável como contrato herdado — e `tailwind.config.ts` **não tem nenhuma chave `spacing`** própria | — | 2/4 |
| **Elevation** | Tokens de sombra por degrau de camada | Glass e gradiente estão barrados (A3, anti-refs nº 6 e 7), então destacar do fundo sobra para tom e sombra. Não existe **nenhuma chave `boxShadow`** no config — o primeiro overlay vai inventar um `shadow-md` "parecido", que a regra G4 da calibração proíbe | — | 1/4 |
| **Motion Provider** | Duração, curva e `prefers-reduced-motion`, mais estado de presença (animar a saída antes de desmontar) | `estados-interacao.md` Parte 4 é literal: *"não vale para movimento: duração e curva não têm token nem desenho"*. Sem token, cada overlay escolhe seu tempo e o resultado é o "efeito pesado" da anti-referência nº 7. Config sem `transitionDuration` e sem `keyframes` | — | 1/4 |
| **Responsive Container** | Container queries — reagir à largura do **contêiner**, não da janela | Os quatro tickets de zoom não se resolvem com breakpoint de tela: um card dentro do drawer estreito precisa reagir à largura dele. Config sem `screens` e sem plugin de container query | — | 1/4 |
| **Overflow Group** | Mede o que cabe, colapsa o excedente num `+N` ou num menu `⋯` | O padrão `+N` já está na tela (`"Frio"`, `"sinal"`, `"+1"` sob o nome do lead). É o mesmo mecanismo que impede a barra de filtros de virar duas linhas em zoom 150% com strings 20–30% mais longas em pt-br | Responsive Container, Dropdown Menu | 1/4 |
| **Scroll Area** | Contêiner que rola em vez de estourar, com barra consistente entre navegadores | Os quatro tickets de E3 têm a mesma raiz: altura fixa e overflow sem dono. É o que permite a tabela rolar na horizontal, o modal caber em 150% de zoom e o drawer rolar sem empurrar a página. E a anti-referência nº 11 reclama explicitamente de coisa que "quebra por navegador" | Elevation | 3/4 |

### 3.2 · Camada, foco e anúncio

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Portal** | Renderiza fora da árvore do pai | Overflow, transform e stacking context do card ou da linha da tabela cortam ou reordenam a camada. É a peça zero de Tooltip, Modal, Drawer, Toast, Popover, Select e Dropdown — **todos no roadmap, todos travados sem ela** | — | 4/4 |
| **Layer** | Consome a escala nomeada (`base → dropdown → sticky → overlay → modal → popover → toast`); número cru é rejeitado em revisão | A regra **E2** e os tickets **#86338** e **#86178** não são bug de valor, são bug de arquitetura. A escala já está em `tailwind.config.ts` e **nenhum componente a usa**. Layer é o consumidor que torna E2 verificável em vez de combinada | Portal | 4/4 |
| **Focus Scope** | Prende o foco enquanto a camada está aberta e devolve ao gatilho ao fechar | Sem ele, o drawer do registro (G1) e o modal de três áreas (G10) deixam o teclado passear pela tela de trás. E7 é critério de pronto, com quatro tickets por trás (#62306, #61699, #85316, #79729) | Portal | 1/4 |
| **Dismissable Layer** | Pilha central que decide quem fecha com Esc, quem fecha com clique fora e em que ordem | Camada sobre camada — drawer com select aberto dentro — sem pilha central faz o Esc fechar a coisa errada. G7 pede Esc como atalho **visível**; se ele for imprevisível, o atalho vira armadilha | Portal, Layer | 1/4 |
| **Popper** | Posicionamento ancorado com flip, shift e detecção de colisão | Causa raiz dos **dois** padrões de bug ao mesmo tempo: o que sobrepõe errado (E2) e o que muda de comportamento conforme viewport e zoom (E3). Tooltip, Select, Dropdown, Combobox e Date Picker herdam todos daqui | Portal, Layer | 2/4 |
| **Scroll Lock** | Trava o scroll do corpo quando modal ou drawer abre, compensando a barra | O pulo de 15px ao abrir uma camada é a mesma família de instabilidade dos tickets de E3 | Portal | 1/4 |
| **Scrim** | O fundo por trás da camada, com token próprio | Não pode ser `bg-black/50` solto: a anti-referência nº 7 proíbe glass e blur, então a separação é por tom — e precisa funcionar nos dois temas sem virar preto sobre preto no escuro. Não existe token de overlay em `tokens-cor.md` | Layer, B3 | 1/4 |
| **Live Region** | Região de anúncio para leitor de tela (`aria-live`) | Mudança longe do foco — toast, erro de formulário, "salvo", contagem de resultados filtrados — **não existe** para leitor de tela sem ela. Verificado: uma única ocorrência de `aria-live` no repo, e ela está numa página do site de documentação | — | 1/4 |
| **Visually Hidden** | Nome acessível sem pixel na tela | Sem ele o Icon Button só tem duas saídas: rótulo visível (quebra a densidade) ou nome nenhum (é o bug). A home tem `+`, ícones de gráfico e `⋯` em 37 linhas, todos sem texto. É o utilitário de quatro linhas que faz E7 ser barato | — | 2/4 |
| **Roving Focus** | Um grupo = uma parada de Tab, navegação interna por setas | Sidebar, toolbar, menu, lista e grade de tabela precisam disso. É a peça compartilhada de G3, G7 e G9, e a diferença entre teclado usável e 40 Tabs até chegar na tabela | — | 1/4 |
| **Pointer Drag** | Arrasto por ponteiro com `pointer capture`, limiar de início, alvo de toque mínimo e **alternativa por teclado obrigatória** | **Lacuna que nenhum ângulo pegou.** Três coisas do roadmap são o mesmo gesto e hoje cada uma nasceria com o seu: o **resize de coluna** da `Table` (G9, lote 2), o **redimensionamento** do `Split Panel` (lote 6) e o **arraste do card** no kanban (`Draggable Card` + `Drop Zone`, lote 7). O `Drop Zone` já admite que *"E7 exige uma alternativa declarada ao arraste por teclado"* — mas isso não é decisão dele: é do primitivo, senão a alternativa existe no kanban e não existe no resize. E arrasto é exatamente onde os tickets de a11y móvel (#62306, #61699) moram, porque `mousedown` não é `pointerdown` | Layer, Live Region | — |
| **Shortcut Registry** | Registro central de atalhos por escopo, que os exibe como `Kbd` e evita colisão entre camadas | G7 não pede atalhos: pede atalhos **visíveis** (Esc, setas, Enter). Sem registro, Esc fecha a busca e o drawer ao mesmo tempo | Dismissable Layer | 1/4 |
| **Focus Ring** | Primitivo único do anel de foco | O `Button` já usa `ring-ring`, mas **D1 nunca foi decidida**. Centralizar é o que impede os próximos 20 componentes de cada um inventar o seu | B1 | 1/4 |
| **Pressable** | Base interativa: hover, active, focus-visible, disabled — e o equivalente de toque | A regra 10 exige `hover:` sob `hoverOnlyWhenSupported` e **essa flag não está ligada** no config (`future` ausente). Num produto com app mobile e quatro tickets de a11y móvel, hover grudado no toque é dor já registrada | Focus Ring, B1 | 1/4 |
| **Async Action** | Os quatro estados de uma ação assíncrona: ocioso, em voo, sucesso, erro | Bloquear duplo clique, anunciar resultado e não deslocar o layout ao trocar rótulo por spinner. Motor do botão com loading (lacuna declarada no inventário §1), da edição inline e do submit. Sem indicação de envio, o usuário clica duas vezes e o erro que volta parece instabilidade — é o **#39683** | Spinner, Live Region | 1/4 |

### 3.3 · Tema, locale e raiz

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Theme Provider** | Aplica o tema sem flash na primeira pintura, respeita `prefers-color-scheme`, expõe o tema atual | R1 é requisito confirmado pelo Davi, e o pior bug do produto é dark mode pela metade (#80174, 13 de ~30 variáveis). Gráfico, logo e ilustração precisam **ler** o tema para decidir. O `theme-toggle.tsx` que existe serve o site (regra D3), não o produto | — | 1/4 |
| **Locale Provider** | Fonte única de locale e fuso para todo formatador | R3 é requisito (`en`, `es`, `pt-br` via next-intl) e a regra 4 diz que componente não embute texto — mas todo formatador precisa saber o locale. Sem provider único, o pt-BR aparece como MM/DD num canto e DD/MM em outro. **`next-intl` não está no `package.json` deste repo e não há uma única ocorrência de `Intl.`** | — | 1/4 |
| **App Shell** | A moldura do produto: regiões (`banner`, `nav`, `main`, `aside`), rail colapsável, cabeçalho fixo | É ela que garante "um menu só" (A5, anti-ref nº 10), que colapsar a sidebar devolva os 15–20% da tela (G4) e que exista um `<main>` para o Skip Link apontar. O `shell.tsx` existente é chrome do site — regra D3 proíbe confundir | Responsive Container | 1/4 |
| **DS Provider** | Raiz única que compõe tema, locale, densidade, raiz de camadas, fila de toast e região de anúncio | A regra 14 e a anti-referência nº 15 ("algumas pinceladas") exigem adoção **incremental** — o que só funciona se o custo de entrada for uma linha. Montar seis providers na ordem certa é adoção big-bang disfarçada | Theme, Locale, Density, Portal, Layer, Live Region | 1/4 |
| **Token Bridge** | Camada de compatibilidade que mapeia as variáveis do `globals.css` do CRM (`--title`, `--subtitle`, `--red`, `--muted`) para os tokens semânticos deste DS, com a lista do que fica obsoleto | **O roadmap tem 97 componentes e nenhuma peça que os faça pousar no CRM** — que é o objetivo declarado do ciclo (DS *retroativo*). A regra 15 é explícita: *"token existente com nome ruim (`--red`) só é renomeado com plano de migração — renomear sem migrar quebra produção"*, e a regra 14 proíbe big-bang. Sem a ponte, "algumas pinceladas" (A9) vira ou fork de estilo, ou substituição total. É também onde **B6** (Tailwind v3 × v4) deixa de ser risco abstrato: a ponte é o único arquivo que precisa saber a versão | Theme Provider, B6 | — |

### 3.4 · Rede de proteção — as regras que não geraram componente nenhum

Três regras dos docs **não viram componente e por isso quase ficaram de fora**:
elas viram verificação. Sem elas, a regra vale enquanto alguém lembra — que é
exatamente como os 22 tickets nasceram. O repo já tem o ferramental de base
(`scripts/medir.mjs`, `scripts/shot.mjs`, Playwright + pixelmatch); o que falta
é o que roda em cima dele.

| Guarda | Regra que ela cumpre | Por que não dá para deixar como combinado |
|---|---|---|
| **`check:temas`** — falha o build se alguma variável tiver **o mesmo valor** em `:root` e `.dark` sem exceção declarada por escrito | **E4**, que já pede *"checagem automática"* na letra da regra | É o #80174 inteiro (13 de ~30 variáveis). E o DS **já reintroduziu o bug**: `success`, `warning`, `destructive` e `info` repetem valor hoje (B2). Um componente não detecta isso; um script detecta em 200ms |
| **Lint de a11y** (`eslint-plugin-jsx-a11y` + checagem de nome acessível em `Icon Button`) | **E7** e **R4** — a11y é critério de pronto | A auditoria é literal: *"lint de acessibilidade **não existe**; auditoria de a11y **nunca foi realizada**"* (gap nº 7), com quatro tickets abertos. `Visually Hidden` torna o nome acessível barato; só o lint torna a ausência dele **impossível de mergear** |
| **`check:i18n-longa`** — renderiza o showcase com string 30% mais longa e em zoom 150%, e falha em overflow ou quebra de linha nova | **Regra 5** (*"todo componente é testado com string longa"*) + **E3/R2** (*"verificação inclui pelo menos um nível de zoom além de 100%"*) | São as duas regras mais fáceis de esquecer e as de maior evidência: quatro tickets de zoom, e `es`/`pt-br` 20–30% maiores. `shot.mjs` já tira print nos dois temas — falta a terceira dimensão |

Não ganham rota e não são componente. Entram no **lote 0** junto com os
primitivos, porque são o critério de pronto de um lote que não tem tela.

---

## 4 · Actions

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Button** `[nav]` `[pronto]` | Ação com rótulo, 4 variantes × 3 tamanhos | Existe. Falta `loading` (lacuna do inventário §1) e a confirmação de D1 | Pressable, Async Action | — |
| **Icon Button** `[nav]` | Ação sem rótulo, sutil, sem fundo | A home usa três: `+` no card "Total criados", ícones de gráfico nos demais KPIs e `⋯` em **cada uma das 37 linhas** da tabela. É o epicentro dos quatro tickets de a11y — o componente existe para tornar o `label` acessível uma prop **obrigatória em TypeScript**: sem nome, não compila. Absorve o `Close Button` (o X do drawer, G1) como variante | Icon, Visually Hidden, Tooltip | 2/4 |
| **Dropdown Menu** | Menu de ações ancorado, com setas, Home/End, type-ahead e Esc | O `⋯` de 37 linhas precisa abrir alguma coisa e **hoje não abre nada** — o contrato tem `Icon Button` órfão. É também o menu do perfil (G6), o de coluna e o de ações do card do kanban: quatro telas, um componente. Dentro da tabela é onde E2 é testada — menu de linha sob header sticky | Popper, Layer, Roving Focus | 3/4 |
| **Toolbar** | Barra de ações com foco itinerante e colapso do excedente em `⋯` | A home tem quatro acionadores adjacentes ("Valor ▾", "Colunas ▾", "Todas as etapas ▾", "Todos os atendentes ▾"). Pelo teclado são quatro paradas de Tab; em zoom 150% com rótulos 20–30% maiores em pt-br, viram duas linhas. Toolbar é a diferença entre um layout que degrada e um que quebra — e a A6 proíbe título decorativo, então o que sobra no topo da página **é** a toolbar | Roving Focus, Overflow Group, Dropdown Menu | 4/4 |
| **Button Group** | Botões adjacentes com raio e borda coerentes nas pontas | Agrupar é o que impede quatro larguras e quatro espaçamentos por tela — a inconsistência que gerou os 22 tickets. A1/A2 são taxativos: o mesmo raio vale para botão, card e input (anti-refs nº 1 e 2) | Button | 2/4 |
| **Segmented Control** | Alternador de visão do mesmo dado, número fixo e pequeno de opções | **A alternativa sancionada às abas.** A anti-referência nº 11 barra abas como forma de crescer; o mesmo pipeline aparece como kanban e como tabela e alguém precisa alternar. Também serve dia/semana/mês e meus/todos. Unifica o que A1 chamou de `View Switcher` | Button Group, Icon | 2/4 |
| **Link** | Âncora com foco visível, canal além da cor e indicação de destino externo | O inventário registra que **"o único azul da tela é link de texto"** — o link já é o portador de cor primária da home e não tem definição. Sem componente, a cor primária vaza para texto comum e a hierarquia por contraste (A4) quebra | Icon | 3/4 |
| **Theme Toggle** | Alternador de tema no canto superior direito | Dark mode é R1 e G6 reserva o canto a perfil, tema, notificação, IA e chat. Não corrige o #80174, mas o torna **visível o tempo todo**: sem troca fácil, ninguém percebe a variável que não muda. É o instrumento de verificação de E4 virando componente | Icon Button, Theme Provider | 2/4 |
| **Copy Button** | Copiar com confirmação anunciada | Telefone, e-mail, ID do negócio e chave de API. Consequência prática de E1: quando o valor trunca, ver no tooltip não basta — o usuário quer levar. Copiar em um clique remove o motivo de o dev alargar a coluna e quebrar o layout. **Nota de leitura: 4/4 e todos os quatro ângulos o marcaram como baixa — todo mundo vê, ninguém precisa primeiro** | Icon Button, Toast | 4/4 |
| **Bulk Action Bar** | Barra flutuante de ações em massa sobre seleção de linhas | Assim que a tabela de 37 negócios ganhar checkbox de linha, precisa existir onde as ações aparecem. Sem componente, cada tela inventa a própria barra flutuante e reabre o problema de camada (E2) | Checkbox, Table, Layer | 1/4 |

---

## 5 · Forms

Esta é a categoria com a maior lacuna medida: o inventário §2 diz que **a única
coisa de formulário na home é o estado fechado do `Select`**, e lista input,
checkbox, radio, textarea, toggle, datepicker, combobox e todos os estados de
erro como ausentes. Formulário é onde E6 vive.

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Form Field** | Amarra rótulo, dica, obrigatoriedade, erro e controle com `id` gerado — `aria-describedby` e `aria-invalid` nascem ligados | **O item de maior convergência do levantamento inteiro, junto com Truncate.** É o componente que cumpre E6: o **#39683** (erro ao criar lead sem nome) nasceu de mensagem improvisada. Form Field faz do erro inline o caminho de menor esforço, e a escolha entre inline e modal passa a ser da spec, como a regra exige. Absorve o que A1 chamou de `Field Error`. Verificado: **zero ocorrências de `useId` no repo** | Text, B1 | 4/4 |
| **Input** `[nav]` | Campo de texto | Lacuna nº 1 declarada pelo inventário e pendência do `nav.ts`. Sem Input não há E6 — o erro do #39683 acontece num campo de texto. Absorve `Input Group` (prefixo/sufixo: `R$` no valor, `%` na conversão, `+55` no telefone) como slots, em vez de cada tela posicionar adorno com padding absoluto e errar de um jeito diferente em zoom | Form Field, B1 | 3/4 |
| **Number Input** | Entrada numérica com parse por locale | Valor do negócio em R$ é o dado mais importante do CRM e o que a home mostra em maior destaque (eixo Y em R$). Entrada é o inverso da formatação e ninguém lembra dela: em pt-BR o operador digita `1.234,56` com vírgula decimal. Sem parse por locale, o formulário aceita bonito e grava errado. Unifica o `Locale Input` de A4 | Input, Locale Provider | 2/4 |
| **Textarea** | Texto longo que cresce sem truncar mudo | Nota no lead, descrição do negócio, template de mensagem. É onde E3 e R3 se encontram: altura fixa que não acompanha o conteúdo é a família dos tickets de zoom, e string 30% maior em pt-br transborda. Absorve `Character Count` (limite de caracteres do WhatsApp) | Form Field | 3/4 |
| **Select** `[nav]` | Seletor de opção única, ancorado | Todos os `▾` da home são seletores de filtro e **só o estado fechado existe** no Figma. Aberto, é sobreposição — cai em E2, e é o candidato clássico a Select dentro de Modal, que é o cenário dos tickets #86338/#86178. Rótulo de opção é texto traduzido: trunca, logo pede E1 | Popper, Layer, Truncate | 2/4 |
| **Combobox** | Select com busca dentro da lista | "Todos os atendentes ▾" e "Todas as etapas ▾" são Selects hoje, mas com **500+ empresas** e equipes reais a lista passa do ponto em que rolar resolve. Nome de atendente trunca na opção **e** no valor selecionado | Popper, Search Input, List, Truncate | 3/4 |
| **Multi Select** | Entrada de múltiplos valores com pílulas removíveis | As tags do lead (`"Frio"`, `"sinal"`, `"+1"`) aparecem **prontas** na tabela, mas nenhuma tela mostra onde são atribuídas — sem isso a tag é read-only e o dado não se edita. N escolhas num campo de largura fixa é truncamento garantido, e cabe o mesmo padrão `+N` da tela. Unifica o `Token Input` de A2 | Combobox, Badge Group | 3/4 |
| **Checkbox** `[nav]` | Caixa de marcação, com estado indeterminado | Pendência do `nav.ts` e lacuna do inventário. Habilita seleção de linha na tabela e a lista do botão "Colunas ▾". Indeterminado (selecionar tudo numa página de 10 de 37) é requisito real, e é onde implementação caseira erra o `aria-checked="mixed"` | Icon, Form Field | 2/4 |
| **Radio Group** | Escolha exclusiva | Quando disparar a automação, canal de origem do lead, motivo de perda. Sem ele o time usa Select para dois itens. Tem regra própria de teclado (setas movem **e** selecionam; Tab sai do grupo) que implementação caseira quase sempre erra — são quatro tickets de a11y abertos | Form Field, Roving Focus | 3/4 |
| **Switch** | Liga/desliga com efeito imediato | Automação Inteligente liga e desliga; integração conecta e desconecta; tema e notificação idem. É o controle mais óbvio do módulo de Automações e não existe. Diferente de Checkbox porque aplica sem submit, o que muda o padrão de feedback. Não pode comunicar estado só por cor (E7) | Form Field, B1 | 3/4 |
| **Search Input** | Busca com ícone, limpar, estado de carregando e slot para o atalho | Duas telas exigem: a busca global com atalhos visíveis (G7) e a busca da lista de conversas do multiatendimento. É o mesmo primitivo com chrome diferente — replicado em três lugares, diverge em três, que é a assinatura do problema do PRD | Input, Icon Button, Kbd | 3/4 |
| **Filter Chip** | Filtro aplicado, visível e removível | Quatro filtros no topo e nenhum jeito de ver o que está aplicado sem reabrir cada dropdown. Cor em borda e tag — exatamente onde A2 permite. É densidade a favor do usuário: substitui a releitura de quatro menus por uma linha, atacando o #34395 pelo lado oposto | Badge, Icon Button | 2/4 |
| **Inline Edit** | Clica no campo e edita, sem abrir formulário | **Padrão nº 3 da lista do que o time mais gosta** (G2, referência Twenty/Linear), e não é componente visual: é comportamento — clique ativa, Esc cancela, Enter salva, blur decide, erro reverte, tudo anunciado. Sem ele o drawer do lead vira formulário modal e perde o motivo de existir. Feito uma vez, serve célula de tabela, campo do drawer e card do negócio | Form Field, Input, Select, Async Action, Live Region | 4/4 |
| **Date Picker** | Seleção de data com calendário | Agendar follow-up e datar atividade é operação básica de CRM, e o inventário registra datepicker como ausente. **O componente mais sensível a R3 do DS inteiro**: primeiro dia da semana, nome de mês e ordem dd/mm variam entre en, es e pt-br — formatação manual aqui é bug garantido. Traz o `Calendar` como peça interna, não como rota própria | Popper, Input, Locale Provider | 3/4 |
| **Date Range Picker** | Recorte de período | O gráfico "Dados diários" e as métricas de BI (LTV, CAC, conversão) só fazem sentido por período, e a home mostra o gráfico **sem nenhum controle de intervalo** | Date Picker | 2/4 |
| **Form** | Raiz do formulário: erro global, submit bloqueado durante envio, foco no primeiro campo inválido, resumo focável | Fecha o último buraco de E6 — o erro que não pertence a nenhum campo (falha do servidor ao criar o lead). Um modal com seis erros precisa de um resumo que leve ao campo; sem ele o erro bloqueante é parede sem porta, que é a leitura do #39683. Unifica o `Form Error Summary` de A4 | Form Field, Alert, Async Action | 2/4 |
| **Form Section** | Agrupamento com título e separação, sem título decorativo | Configurações e o modal de três áreas (G10) precisam agrupar sem cair no título+descrição que A6 proíbe. Absorve o `Form Layout` de A4: o formulário em duas colunas que não colapsa em zoom alto é exatamente o padrão dos quatro tickets, e a correção é container query, não breakpoint | Separator, Responsive Container | 2/4 |
| **File Upload** | Dropzone com progresso e erro por arquivo | Duas necessidades distintas: importar CSV de leads (o jeito de sair de outra ferramenta — o produto promete substituir 4 a 6) e anexar arquivo numa conversa. `input file` cru quebra a11y (E7) e responsividade (E3) | Button, Progress | 2/4 |
| **Message Composer** | Campo de composição do chat: multilinha que cresce, anexo, emoji, envio por Enter, template rápido | Multiatendimento e Chat é a **área de dor nº 1 declarada no PRD** e não há um único componente de conversa no contrato. Não é Textarea com botão do lado: é um componente | Textarea, Icon Button, File Upload | 2/4 |
| **Secret Field** | Campo mascarado com revelar e copiar | O módulo Integrações e API expõe chave e token. Pequeno, mas sem ele cada tela de integração inventa o seu — e o botão de revelar tem regra de a11y própria (rótulo que muda de estado, foco visível). Unifica o `Password Input` de A2 | Input, Copy Button, Icon Button | 2/4 |
| **Rule Row** | Linha de condição repetível: gatilho, operador, valor | Automação é "quando X, faça Y". É o componente que define a tela de automações — **segunda área de dor do PRD** — e sem ele cada linha de regra nasce de markup solto | Select, Input, Combobox, Icon Button | 1/4 |

---

## 6 · Navigation

A sidebar **não está no frame da home** — vive em `Sidebar - Navegacao principal`
(`119:1761`, 256×937) e em `Sidebar` (`124:2114`). Ela concentra cinco dos onze
padrões mais desejados (G3–G7) e é o único menu permitido, já que lateral +
superior ao mesmo tempo é anti-referência nº 10.

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Sidebar** `[nav]` | Navegação principal, colapsável inteira | Concentra G3–G7 e sustenta A5. O colapso não é conforto: o heavy user *"não quer perder 15–20% da tela"* (G4), e é mitigação de E3 em zoom alto, onde a sidebar fixa come a área útil. Absorve `Sidebar Collapse` e `Favorites List` (G3: favoritos e últimos acessos fixados) como composições | Nav Item, Nav Group, Scroll Area, Tooltip, App Shell | 2/4 |
| **Nav Item** | Item de navegação com estados selecionado/hover | **O único componente do DS cujos tokens já existem e já foram consertados**: `nav/item/bg-selected`, `bg-hover`, `text-selected`, `icon-selected`, `text-default`. O bug registrado na correção nº 5 de `tokens-cor.md` é instrutivo — a pílula de selecionado usava os primitivos `base/blue/100` e `base/neutral/900`, que não mudam com o tema, e ficava branca no escuro. Nav Item existe para essa ligação acontecer **uma vez**, no componente-mãe. No modo colapsado o rótulo some e o tooltip vira obrigatório (E1) | Icon, Tooltip | 2/4 |
| **Nav Group** | Grupo colapsável em accordion | G3 pede três agrupamentos com o mesmo comportamento e rótulos diferentes (grupos, favoritos, últimos acessos). A calibração **D5** já mediu o conector de árvore no Figma (`255:6522`: vertical, curva de raio 5, saída horizontal de 6px, terminando no **centro do último item**, não no fim do grupo) — esse desenho pertence a este componente | Collapsible, Nav Item | 2/4 |
| **Breadcrumb** `[nav]` | Trilha de no máximo **dois** níveis | G5 não pede breadcrumb: pede um breadcrumb **com teto** — *"Leads > nome do lead. Nunca mais que isso"*. O valor está na API impor o limite, transformando preferência em algo que não dá para violar sem reescrever o componente. O segundo nível é nome de registro, ou seja, texto dinâmico que trunca (E1) | Truncate, Link | 2/4 |
| **Topbar** | Faixa de utilidade do canto superior direito: perfil, tema, notificação, IA, chat | G6 reserva esses cinco itens e eles não têm casa. O componente existe para **codificar A5**: a Topbar não é um segundo menu, é uma faixa de ações. Se ganhar itens de navegação, cai na anti-referência nº 10. Escrever a restrição no componente é mais barato que policiá-la em cada tela | Icon Button, Avatar, Dropdown Menu, Theme Toggle | 3/4 |
| **Panel Header** | Cabeçalho de painel: título, meta e ações à direita — variantes `page` e `panel` | **Unificação deliberada.** Quatro superfícies repetem a mesma anatomia: topo da página, cabeçalho da conversa, cabeçalho da coluna do kanban e cabeçalho do drawer. Um componente evita quatro desenhos divergentes, que é a causa raiz dos 22 tickets. A variante `page` carrega o Breadcrumb e a restrição da **A6** (descrição opcional e **desligada por padrão** — *"dane-se, o cara sabe"*); sem essa alternativa, a proibição volta a ser combinado verbal que a próxima tela ignora | Truncate, Breadcrumb, Icon Button, Toolbar | 2/4 |
| **Pagination** `[nav]` | Controle de página com colapso em elipse | O rodapé da tabela é literal: *"Mostrando 10 de 37 negócios"* + Anterior · 1–4 · Próxima, com ativo e inativo. Caso direto de E3: 37 negócios viram 4 páginas, mas 3.700 viram 370, e a linha estoura em qualquer zoom acima de 100%. Cada número precisa de nome acessível ("página 3 de 4"), não só do dígito. Absorve `Page Size Select` — "Mostrando 10 de 37" implica que 10 é escolha, e densidade é decisão de design (E5), não constante | Button, Icon Button, Visually Hidden, Select | 2/4 |
| **Command Palette** | Busca com listagem e atalhos de teclado **visíveis** | É o G7 inteiro (referência Attio) e o que permite a sidebar ficar colapsada (G4) sem custo de navegação: quem sabe o que quer não navega, digita. Também é a resposta a "não crescer o menu" (anti-ref nº 11). **É o componente que mais depende de infraestrutura** — camada, posicionamento, foco preso, região viva para anunciar a contagem, e virtualização quando a base tem milhares de leads. Propor sem os primitivos é garantir que nasça torto | Modal, Search Input, Kbd, List, Shortcut Registry, Virtualized List, Live Region | 4/4 |
| **Skip Link** | Pular para o conteúdo | Com sidebar de grupos, favoritos e últimos acessos (G3), quem navega por teclado atravessa dezenas de itens antes do conteúdo, em toda navegação. É o item de a11y mais barato que existe, e a auditoria registra que **lint de acessibilidade não existe e auditoria de a11y nunca foi realizada** | Visually Hidden, App Shell | 3/4 |
| **User Menu** | Menu de perfil | Um dos cinco itens que G6 reserva ao canto superior direito, e o ponto de saída para conta, idioma (R3) e tema. **Carrega a troca de idioma**, e vale dizer por quê: R1 (dark mode) ganhou um componente próprio, o `Theme Toggle`; **R3 é o único requisito confirmado sem componente nenhum no roadmap**. A escolha aqui é deliberada — trocar idioma é composição de `Select` + `Locale Provider` dentro deste menu, não item novo — mas precisa estar escrita, senão a próxima tela inventa um seletor de bandeirinha | Dropdown Menu, Avatar, Select, Locale Provider | 1/4 |
| **Notification Center** | Ícone com contador que abre lista com lido/não-lido e agrupamento | Notificação é item explícito do G6 — mas ali é componente, não ícone. Num CRM multicanal, é onde mensagem nova de WhatsApp/Instagram avisa fora da tela de chat. Unifica o `Notification Bell` de A1 | Popover, Badge, Topbar | 2/4 |
| **Assistant Launcher** | Botão ancorado no canto que abre um painel lateral persistente — uma instância para o **Crazy IA**, outra para o **chat** | **Dois dos cinco itens do G6 não tinham componente.** G6 reserva o canto superior direito a *"perfil, tema, notificação, **IA** e **chat**"*: perfil virou `User Menu`, tema virou `Theme Toggle`, notificação virou `Notification Center` — IA e chat viraram nada. E não é omissão pequena: Crazy IA é o **primeiro módulo do PRD §1** e reaparece na `Timeline` gerando evento de intenção, sentimento e comportamento. Um lançador com painel — não um Drawer de registro, porque não bloqueia e não é modal — cobre os dois, e é onde a `Message Composer` do lote 6 é reaproveitada fora da tela de chat. O **conteúdo** de cada painel é tela de produto e não entra aqui; o lançador e a casca, sim | Icon Button, Popover, Drawer, Layer, Topbar | — |
| **Split Panel** | Dois a três painéis redimensionáveis | O multiatendimento é lista de conversas + chat + (opcional) painel do contato. É exatamente onde moram os quatro tickets de comportamento que muda com zoom/viewport | Scroll Area, Separator, Responsive Container | 1/4 |
| **Stepper** | Sequência de etapas nomeadas, `interactive` ou `readonly` | **Unificação deliberada.** A1/A2 pediram o wizard (criar automação, conectar canal da Meta, importar base — público PME sem tolerância a curva de aprendizado); A3 pediu o indicador de etapa do funil. É o mesmo componente com dois modos. E responde ao **#34395** onde `Progress` não chega: a barra mostra *o quanto*, o Stepper mostra **onde** | Progress, Truncate, Icon | 3/4 |
| **Settings Nav List** | Grupos à esquerda, conteúdo à direita | Configurações e integrações no padrão que o time elogiou no Attio (G10) — e é o mesmo esqueleto do modal de três áreas | Nav Item, Nav Group | 1/4 |

---

## 7 · Data Display

*"A categoria mais densa da tela"*, nas palavras do inventário. É onde os 22
tickets se concentram e onde a densidade estrutural do produto all-in-one aparece.

### 7.1 · O que fecha regra

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Truncate** | Mede o overflow real (`scrollWidth > clientWidth` via `ResizeObserver`) e **só então** anexa o tooltip com o conteúdo completo | **O item de maior convergência do levantamento, e alta nos quatro ângulos.** E1 diz que não existe truncamento mudo no DS — mas isso só é cumprível se houver um primitivo que meça. Tooltip sempre ligado polui; ligado a olho volta a ser **#83283**, **#83274**, **#59567** — três tickets do mesmo padrão. Enquanto truncar for `truncate` do Tailwind escrito à mão, E1 é intenção; como componente, **truncar sem tooltip deixa de ser possível de escrever**. Cobre também a regra 5 de i18n (es/pt-br 20–30% maiores) e o modo colapsado da Sidebar | Tooltip | 4/4 |
| **Table** `[nav]` | Tabela de dados com header, seleção, ordenação, resize e colunas visíveis | *"O mais caro, e o que mais devolve valor"* — 37 negócios, 7 colunas (Lead · Produto · Atividades · Atendente · Etapa · Dados · ações), header cinza, `⋯` por linha. **Concentra quatro padrões de bug ao mesmo tempo:** G9 pede resize de coluna e duplo clique para ajustar ao conteúdo (Attio) — que é o antídoto direto do texto truncado, porque quem alarga a coluna não depende só do tooltip; E1 exige que cada célula trunque com tooltip; E3 exige rolagem horizontal em vez de estourar; E2 exige que o header sticky respeite a escala. **Absorve como partes nomeadas:** `Table Column Header`, `Column Resize` (G9), `Column Visibility Menu` (o botão "Colunas ▾" que já está na tela) e o `Data Table` de A2 — não são componentes separados, são a mesma peça | Truncate, Scroll Area, Checkbox, Dropdown Menu, Pagination, Skeleton | 4/4  **Construído (T1, 2026-09-23):** ordenar, colunas visíveis, reordenar, redimensionar e seleção em `useAjustesDaTabela`. |
| **Separator** | Divisória com papel semântico (decorativa vs. separadora) | A superfície se separa por tom ou borda, nunca por efeito — glass e gradiente estão fora (A3). A4 pede hierarquia por contraste e A6 barra o título decorativo que hoje faz o papel de separar blocos. Parece trivial, mas é o tipo de peça que sem existir vira `border-t border-[#E1E7EF]` solto: **`tokens-cor.md` registra 521 traços exatamente assim antes de serem religados ao token** | — | 4/4 |
| **Icon** | (ver §3.1) | | | 3/4 |

### 7.2 · Listas e registros

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **List** + **List Item** | Lista de **registros**, sem header de coluna | G8 é preferência forte e específica: *"não preciso dizer que a data é a data de criação, o cara sabe"*. Não é Table com header oculto — é outro componente, com ritmo e alinhamento próprios. Já está na tela como "Atendentes com mais vendas" (avatar + nome + e-mail + 3 métricas à direita), a linha mais densa do dashboard e portanto o teste mais duro de E5. O mesmo item se repete em conversa, favorito e resultado de busca | Truncate, Avatar, Text, Scroll Area | 2/4 |
| **Description List** + **Property Row** | Pares rótulo/valor de **um** registro | **Corte deliberado contra List:** List mostra N registros; Description List mostra N campos de 1 registro. É o miolo do drawer (G1) e o esqueleto sobre o qual a edição inline (G2) acontece, no padrão Twenty. Sem componente, cada drawer vira grade improvisada — e é essa improvisação empilhada que gerou o **#34395**. `dl/dt/dd` resolve a leitura por leitor de tela (E7) | Truncate, Inline Edit, Tooltip | 4/4 |
| **Stat Card** `[nav]` | KPI: rótulo + ícone de ação, valor grande, badge de contagem | São cinco no topo da home (Total criados / ganhos / perdidos / em aberto / negócios), com anatomia já medida. É o primeiro bloco que o usuário vê e o primeiro lugar onde E5 é testada — cada KPI é uma decisão de densidade. O valor precisa truncar com tooltip quando vier grande em pt-br | Card, Badge, Icon Button, Truncate | 2/4 |
| **Avatar** `[nav]` | Círculo com inicial, cor de fundo por pessoa | Está na tela em dois lugares (coluna Atendente e a lista de atendentes) e reaparece no chat, no card do kanban e na Topbar. **Traz uma tensão que se resolve no componente, não na tela:** cor de fundo por pessoa flerta com A2 ("cor não preenche superfície"), então a saída é paleta dessaturada derivada de hash, com contraste verificado nos dois temas (E4) — não cor livre. Absorve `Avatar Status Dot` como composição com Status Dot. **Essa paleta não existe** — é o bloqueio **B8**, e ele vence no lote 2, não no 7 | Text, Icon, B8 | 2/4 |
| **Avatar Group** | Empilhamento com excedente `+N` | Conversa com mais de um atendente, negócio com time responsável. Empilhar todos é acúmulo (E5); cortar sem dizer é truncamento mudo (E1). O conjunto precisa de **um** nome acessível, não N imagens sem alt | Avatar, Overflow Group, Tooltip | 3/4 |
| **Badge Group** | Conjunto de tags com remoção e excedente `+N` | Extensão do `Badge` que já existe, não duplicata: Badge é rótulo estático; Badge Group é conjunto. A home já mostra os dois comportamentos juntos (`"Frio"`, `"sinal"`, `"+1"`). O `+N` é decisão de densidade (E5) hoje improvisada tela a tela, e é texto escondido — logo pede tooltip com a lista completa (E1). Unifica `Tag Overflow` e `Tag Group` | Badge, Overflow Group, Tooltip | 4/4 |
| **Timeline** | Lista cronológica de eventos e notas | A tabela tem uma coluna **"Atividades"** — logo existe histórico por registro, e ele precisa aparecer no drawer. E o Crazy IA gera eventos (intenção, sentimento, comportamento) além das mensagens humanas. Sem componente, o histórico vira lista improvisada por tela | List Item, Avatar, Formatters, Separator | 2/4 |
| **Virtualized List** | Janela virtual com altura estimada, âncora de scroll e sentinela de carregamento | Chat multiatendimento e listas de negócios não têm teto de tamanho, e o produto cresce ~30% ao mês sobre 500+ empresas. Virtualizar é infraestrutura e precisa nascer compatível com teclado e leitor de tela, senão troca um bug por outro. Unifica o `Infinite Scroll` de A2 — a lista de conversas não pagina, rola | Scroll Area, Responsive Container, Spinner | 2/4 |

### 7.3 · Estado, medida e revelação

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Progress** `[nav]` | Barra determinada com rótulo | A coluna "Etapa" da tabela é barra + rótulo + tempo, azul `Primary` sobre trilho claro — e é justamente a etapa do funil que o cliente reclamou de não conseguir enxergar no **#34395**. Precisa de `aria-valuenow`/`valuetext` (E7) e trilho com contraste nos dois temas: trilho claro no escuro é o #80174 outra vez | Text, B3 | 2/4 |
| **Status Dot** | Ponto de estado com rótulo obrigatório | A2 é taxativa: cor entra em borda e tag, nunca preenchendo o card. O ponto é o portador de cor mais barato que existe — cabe onde um Badge seria acúmulo (E5). Serve automação ativa/pausada/com erro, integração conectada/desconectada, atendente online, e o indicador de não lidas do sino (G6). **Nunca sozinho:** cor não pode ser o único canal (E7). Unifica o `Status Indicator` de A2 | Visually Hidden, B2 | 3/4 |
| **Accordion** | Revelação progressiva com estado e teclado corretos | Pedido **duas vezes** na lista do que o time mais gosta: dentro do drawer para minimizar informação (G1) e na sidebar para agrupar navegação (G3). É a resposta estrutural a E5 e ao **#34395** — densidade progressiva significa mostrar pouco por padrão e o resto sob demanda, o que exige componente com `aria-expanded`, não `display:none` improvisado | Collapsible, Icon, Separator | 3/4 |
| **Collapsible** | O primitivo de revelação por baixo do Accordion | Três padrões desejados o usariam separadamente — accordion do drawer (G1), grupos da sidebar (G3) e card colapsável do dashboard (G11). Um só primitivo garante a mesma animação, o mesmo `aria-expanded` e o mesmo teclado, evitando a "quebra de padronização" da anti-referência nº 2 | Motion Provider | 1/4 |
| **Collapsible Card** | Card com seta de "ver dados detalhados" | G11 é literal, e é a materialização da densidade progressiva no nível do dashboard: pouco por padrão, resto sob demanda. Resposta direta ao #34395, onde o excesso simultâneo escondeu a informação que importava | Card, Collapsible, Icon Button | 3/4 |
| **Kbd** | Tecla renderizada, com mapeamento por plataforma (⌘ vs. Ctrl) | G7 não pede atalho: pede atalho **visível** — Esc, setas, Enter desenhados na tela. Sem o componente, a parte "visível" do G7 não se cumpre e cada tela escreve "Esc" como texto comum. Usa `Geist Mono`, já tokenizada. Mostrar o atalho é acessibilidade prática: o caminho de teclado deixa de ser folclore | Text | 3/4 |

### 7.4 · Formatadores (i18n)

Cinco peças pequenas, uma razão só: **R3 é requisito e a regra 4 proíbe texto
embutido**, mas todo número e toda data precisam saber o locale. Verificado: **zero
ocorrências de `Intl.` ou `toLocaleString` no repo**.

| Componente | O que é | Por que este produto precisa | Conv. |
|---|---|---|---|
| **Number** | Separador de milhar e decimal por locale | Invertem entre en e pt-BR (`1,234.5` vs. `1.234,5`). Os 5 KPIs e toda coluna numérica da tabela passam por aqui; hardcode em qualquer um é bug que ninguém vê em português | 2/4 |
| **Currency** | Moeda com símbolo, posição e espaçamento por locale | O produto vende e cobra em real (R$197–707/mês) e o gráfico tem eixo Y em R$. Valor monetário concatenado à mão é o erro mais comum e mais caro de um CRM de vendas | 1/4 |
| **DateTime** | Data com fuso **explícito**, não o do navegador | Num CRM multiatendimento, a hora da mensagem e a data de criação do lead precisam ser as mesmas para todo o time. E G8 assume que o usuário reconhece a data sem rótulo — o que só funciona se o formato for previsível | 2/4 |
| **Relative Time** | "há 3 dias", com plural correto nos três idiomas | Hora na conversa, tempo na etapa do funil ("barra + rótulo + tempo") e data de criação na lista sem header. Precisa de tick que atualize sem re-render da lista inteira, e de data completa no tooltip (E1) | 3/4 |
| **Duration** | "2h 14min" | Tempo parado na etapa, tempo de primeira resposta, SLA — a métrica que o CRM vende. Formatar à mão em três idiomas é o mesmo bug replicado por tela | 1/4 |

### 7.5 · Multiatendimento — a área de dor nº 1

*"Áreas que mais doem: Multiatendimento e Chat"* (PRD §2), e **a home não tem um
único componente de conversa**. Paste (Chat Log, Chat Composer, AI Chat Log), SLDS
(chat, publishers, docked-composer) e BoardUI (ai-chat, composer, chat-starter)
tratam conversa como categoria de primeira classe.

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Conversation List** | Painel esquerdo: lista rolável com busca, filtro por canal e agrupamento por não-lidas | A primeira metade da tela mais dolorida do produto | Conversation List Item, Search Input, Filter Chip, Virtualized List, Skeleton | 1/4 |
| **Conversation List Item** | Avatar + nome + prévia + horário + contador + ícone do canal | A prévia trunca **sempre** — cai direto em E1. E o estado selecionado precisa de token, como o `nav/item/bg-selected` que já existe | Avatar, Truncate, Unread Indicator, Channel Badge, Relative Time | 1/4 |
| **Message Bubble** | Balão com origem, canal, status de entrega, anexo, citação e hora | O chat é a área de dor nº 1 e não tem um único componente em código. Precisa de **raio contido**, porque bolha muito arredondada cai na anti-referência nº 1 (*"passa aplicativozinho de iOS baratinho"*) | Truncate, Attachment Preview, Message Status, Relative Time | 2/4 |
| **Message Group** | Agrupa mensagens em sequência do mesmo autor; divisor por dia | Sem isso o chat repete avatar e hora em cada linha — acúmulo, que é o que E5 proíbe | Message Bubble, Separator, Relative Time | 1/4 |
| **Message Status** | Enviado, entregue, lido, falhou | Semântica que o canal WhatsApp impõe. É **estado de cor** — e como os tokens de estado ainda têm o mesmo valor nos dois temas (B2), este componente é onde o problema aparece primeiro | Icon, Tooltip, B2 | 1/4 |
| **Unread Indicator** | Contador de não lidas por conversa e total por canal | É a informação que o atendente busca **primeiro** na tela, e não há componente para ela | Badge | 1/4 |
| **Channel Badge** | Marca de canal: WhatsApp, Instagram, Facebook | O atendente precisa saber de onde a conversa veio antes de responder. Usa cor de terceiro, o que exige regra explícita: cor em borda e ícone, **nunca preenchendo a superfície** (A2). Cor de marca de terceiro é o segundo caso de **B8**: verde do WhatsApp e o gradiente do Instagram não têm token e não passam no contraste do tema escuro sem serem tratados | Badge, Icon, B8 | 1/4 |
| **Attachment Preview** | Imagem, documento e áudio na bolha | Chegam pelos três canais e precisam aparecer sem quebrar o layout em zoom (E3) | Card, Icon, Skeleton | 1/4 |

### 7.6 · Pipeline e kanban

*"Kanbans Avançados"* é módulo declarado e *"Pipelines e Automações"* está entre as
áreas que mais doem. Nada disso existe.

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Kanban Board** | Contêiner com rolagem horizontal e colunas de largura fixa | Módulo declarado, área de dor declarada, zero código | Kanban Column, Scroll Area, Drop Zone | 1/4 |
| **Kanban Column** | Etapa do funil: título, contagem, soma de valor e menu | É onde o **#34395** se resolve ou se repete: se a coluna acumular informação repetida, o cliente volta a não achar a etapa | Panel Header, Badge, Scroll Area, Currency | 1/4 |
| **Draggable Card** | Card arrastável genérico | **Nome deliberado.** A regra 8 diz que componente do DS não conhece domínio: o card do negócio no kanban é `Draggable Card` + `Property Row`, não `DealCard`. O card de lead é componente de **produto**, montado sobre este | Card, Avatar, Badge Group, Truncate, Progress | 1/4 |
| **Drop Zone** | Alvo visível e placeholder durante o arraste | Sem alvo, mover card é adivinhação — e E7 exige uma alternativa declarada ao arraste por teclado | Kanban Column | 1/4 |
| **Connection Card** | Card de integração com cor sutil de fundo e marca d'água | **O único caso em que o time PEDIU cor de fundo** (gosto nº 15, referência respond.io). Convive com A2 apenas como **exceção nomeada**, e a tela de Integrações é onde ela vale. Registrar a exceção no componente é o que impede a exceção de vazar | Card, Switch, Status Dot, Badge | 1/4 |

---

## 8 · Feedback & Overlays

*"Lacunas — a categoria inteira, essencialmente"*, diz o inventário §5. Só o
`EmptyState` aparece na home.

| Componente | O que é | Por que este produto precisa | Depende de | Conv. |
|---|---|---|---|---|
| **Tooltip** `[nav]` | Dica ancorada, aberta por hover **e** por teclado | Obrigatório por regra, não por gosto: E1 exige tooltip em todo texto que pode truncar, e a tabela da home é cheia de texto que vai truncar. O Nav Item colapsado (G4) não tem rótulo nenhum. Precisa abrir por teclado (E7) e ter equivalente de toque decidido explicitamente — o CRM tem app mobile e dois tickets de a11y móvel (#62306, #61699) | Popper, Portal | 2/4 |
| **Popover** | Superfície flutuante **focável** | Tooltip não recebe interação. Filtro com opções, seletor de coluna, mini-formulário de edição rápida e a prévia do `+N` precisam disso. Centralizar aqui é o que faz E2 valer sem repetir cálculo de posição em cada componente — e é a base técnica de Select, Combobox, Date Picker e Dropdown Menu | Popper, Layer | 3/4 |
| **Modal** `[nav]` | Diálogo bloqueante, com `max-height` em unidades de viewport e rolagem interna | G10 descreve anatomia específica e incomum — grupos à esquerda, conteúdo à direita, área de botão separada (Attio) — o que é variante estrutural, não decoração. E3 exige que não quebre em zoom 150%; E2 o coloca como penúltima camada da escala. É também o recipiente do erro bloqueante de E6 | Portal, Layer, Focus Scope, Scroll Lock, Scrim, Scroll Area | 2/4 |
| **Confirm Dialog** | Confirmação de ação destrutiva: foco inicial no cancelar, sem fechar por clique fora, ação destrutiva nomeada | Excluir negócio, remover lead, desativar automação, desconectar integração. É o *"modal quando bloqueante"* da regra E6 — e o **#39683** registra a sugestão literal do cliente de trocar mensagem por modal. O `Button` já tem variante `destructive` **sem nenhum fluxo de confirmação**. Unifica o `Alert Dialog` de A2/A3 | Modal, Button, Async Action | 4/4 |
| **Two Pane Modal** | Modal de três áreas: grupos à esquerda, conteúdo à direita, botões separados | O G10 na forma literal. Serve as telas de configuração e a criação de automação | Modal, Settings Nav List, Form Section | 1/4 |
| **Drawer** `[nav]` | Painel lateral do registro: fino à direita **ou** tela cheia, fecha no X | **Padrão nº 1 da lista do que o time mais gosta** (G1, referência Twenty). Duas variantes estruturais, fechamento no X e por Esc, foco preso e devolvido, conteúdo rolando por dentro (E3) e seções em accordion. É onde o card do lead e do negócio — área de dor declarada — passa a viver | Portal, Layer, Focus Scope, Scroll Lock, Panel Header, Accordion, Description List, Icon Button | 2/4 |
| **Toast** | Confirmação não-bloqueante, com fila, tempo de vida e pausa no hover | A escala de camadas de E2 nomeia `toast` como o topo da pilha, e `tailwind.config.ts` já reserva `zIndex.toast` **sem nenhum componente que o use**. O #39683 mostra que hoje o feedback passa sensação de instabilidade: sucesso é silêncio, e silêncio depois de clicar é o bug. Precisa de `role="status"` e tempo de leitura suficiente para pt-br e es (R3) | Portal, Layer, Live Region, Motion Provider | 4/4 |
| **Alert** | Aviso inline que fica na tela, sem sequestrar o usuário | É a **metade inline** de E6 (*"inline + modal quando bloqueante"*). Sem componente, todo erro vira modal ou vira mensagem solta — os dois extremos que o ticket criticou. **Atenção B2:** `destructive`, `warning`, `info` e `success` têm o mesmo valor nos dois temas; construir Alert sem resolver isso é reproduzir o #80174 dentro do DS novo. Unifica o `Inline Alert` de A2/A4 | Icon, Text, B2 | 4/4 |
| **Empty State** `[nav]` | Ícone + mensagem + explicação + ação, centralizado | **Já aparece na tela**: "Produtos mais vendidos: ícone + Não há dados + explicação". E a regra 9 o torna estado obrigatório de todo componente que lista dados. Como o CRM é all-in-one, a home tem muitos blocos que podem vir vazios ao mesmo tempo — sem componente, cada card inventa o seu | Icon, Text, Button | 2/4 |
| **Error State** | Falha de carregamento: causa, ação de repetir, detalhe técnico recolhido | Anatomia própria e **diferente** do vazio. A regra 9 lista `error` como estado obrigatório e hoje só existe o Empty State | Empty State, Button, Alert | 2/4 |
| **Status View** | Invólucro que troca entre `loading`, `empty` e `error` | Unifica os três em um contrato, em vez de três invenções por tela. É a leitura de A4 sobre a regra 9: se `loading`, `empty` e `error` são obrigatórios, eles são infraestrutura, não enfeite | Skeleton, Spinner, Empty State, Error State | 1/4 |
| **Skeleton** | Carregamento que preserva a geometria final | Lacuna explícita do inventário §5, e a decisão **D6** (spinner, skeleton ou ambos) está em aberto bloqueando isso. Na home — 5 KPIs + 2 gráficos + tabela de 37 linhas + 2 listas carregando juntos — spinner em cada bloco é ruído; skeleton evita o salto de layout, que também é E3. Sem animação pesada: A3 barra efeito caro para quem passa o dia na tela | Density Provider, B1, B3 | 4/4 |
| **Spinner** | Carregamento pontual e indeterminado | A outra metade de D6: dentro do Button durante submit, no Inline Edit salvando, no Combobox buscando. A regra 9 cobra `loading` de todo componente interativo e o `Button` já tem quatro variantes **sem ele**. Precisa respeitar `prefers-reduced-motion` e anunciar-se, senão o botão em loading é mudo | Visually Hidden, Live Region, B1 | 4/4 |
| **Error Boundary** | Limite de falha por região | Falha de render de um bloco não pode derrubar o painel inteiro — o diagnóstico do #39683 é literalmente *"sensação de instabilidade"*. Um limite por bloco do dashboard degrada só o card que quebrou | Status View | 1/4 |
| **Typing Indicator** | "Fulano está digitando" | No chat é o sinal de que a conversa está viva. Pequeno, mas é o tipo de elemento que sem componente nasce diferente em cada canal | Message Bubble, Avatar | 1/4 |
| **Global Banner** | Aviso de sistema no topo, acima de tudo | Canal do WhatsApp desconectado, limite do plano perto, manutenção. Distinto do Alert porque é global e persistente — e num CRM multicanal, canal caído é o aviso que não pode ficar escondido numa tela só | Alert, Layer | 1/4 |
| **Illustration** | Slot ilustrado dentro do Empty State | **É onde a tensão T2 se resolve.** A expansão de cor e personalidade que o time quer (mais cores, mais ilustrações, o mascote Eisten) vive em ilustração, não na estrutura da interface. Sem slot definido, ou não entra, ou entra colorindo card e violando A2. **Ressalva de sequenciamento:** T2 está registrada como *tensão a confirmar no gate* em `direcao-visual.md` e **não é** um dos bloqueios da §2 — então este é o único item do roadmap cuja premissa ainda pode ser negada inteira | Empty State, T2 | 1/4 |
| **New Messages Pill** | Volta ao fim da conversa quando chega mensagem nova | Conversa longa rolada para cima. É elemento `sticky` — e `sticky` é um degrau nomeado da escala de camadas de E2 | Layer, Scroll Area, Badge | 1/4 |

---

## 9 · Ordem de construção

**Princípio.** Cada lote entrega **uma superfície utilizável**, não peças soltas.
E cada lote é escolhido por duas coisas ao mesmo tempo: o que ele destrava
tecnicamente (dependência) e qual dor do PRD ele encosta (evidência).

**Advertência de sequenciamento.** A "Proposta de recorte do lote 1" do
`inventario-componentes.md` começa por `Card · Tag · Avatar · Button · IconButton`.
Isso está certo em espírito e **errado em ordem**: `IconButton` depende de
`Tooltip`, que depende de `Popper`, que depende de `Portal` — e Portal não existe.
Construir o lote 1 do inventário antes do lote 0 abaixo significa Tooltip sem
posicionamento (repete #86338), Modal sem foco preso (repete os quatro tickets de
a11y) e truncamento sem primitivo (repete #83283). A ordem abaixo corrige isso.

**A exceção ao princípio, declarada.** Os lotes **0 e 1 não entregam superfície
utilizável nenhuma** — e isso contraria o princípio do primeiro parágrafo. A
exceção é deliberada (não dá para construir Tooltip sem Portal), mas ela cobra
uma coisa: **um lote sem tela precisa de um critério de pronto que não seja a
tela.** Por isso a §3.4 entra no lote 0 e a página de Foundations entra no lote
1 — sem elas, "lote 0 pronto" vira opinião, e a regra 11 não alcança nenhum dos
dois. Do lote 2 em diante o princípio volta a valer sem exceção.

**Onde a ordem foi corrigida nesta revisão.** Nove dependências apontavam para
um lote **posterior** ao do próprio componente: `DS Provider` (0→1), `Overflow
Group` (1→2), `Pagination`/Page Size (2→3), `Checkbox`/`Form Field` (2→3),
`Status View`/`Error State` (2→4), `Button` com `loading` sem `Async Action`
(2→3), `Search Input`/`Kbd` (3→5), `Panel Header`/`Breadcrumb` (4→5) e
`Command Palette`/`Virtualized List` (5→6). Cada uma está resolvida abaixo — ou
movendo a peça, ou declarando o que o lote entrega pela metade e onde fecha.
E um componente inteiro **não estava em lote nenhum**: o `Popover`, catalogado
na §8 com 3/4 de convergência e citado como dependência do `Notification
Center`, aparecia só na lista do que o lote 1 *destrava*. Entra no lote 2.

---

### Lote 0 · Fundações de render — *destrava tudo*

**Pré-requisito:** decidir **B1** (D1–D7) e **B2** (estados no escuro). Sem elas
cada componente inventa o próprio hover, que é a anti-referência nº 2.

Text · Icon · Focus Ring · Pressable · Visually Hidden · Fluid Scale ·
Density Provider · Elevation · Motion Provider · Responsive Container ·
Theme Provider · Locale Provider · Token Bridge · Formatters (Number, Currency,
DateTime, Relative Time, Duration) · **Rede de proteção da §3.4**
(`check:temas` · lint de a11y · `check:i18n-longa`)

**Retrofit dos três que já existem.** `Badge` tem **quatro das seis variantes
com o mesmo valor nos dois temas** (§1.1) e nenhum lote consertava isso —
conserta aqui, assim que B2 for decidido, porque é o próprio `check:temas` que
vai reprovar o componente. `Button` reencosta em D1 (anel de foco) e `Card` na
`Elevation`, que passa a existir neste lote.

**`DS Provider` saiu deste lote.** Ele compõe *"raiz de camadas, fila de toast
e região de anúncio"* — `Portal`, `Layer` e `Live Region` são do **lote 1**, e a
fila de toast só existe no lote 3. Prometer `<DSProvider>` em uma linha no fim
do lote 0 era prometer um provider que não podia ser escrito ainda.

**Entrega:** nada visível — e é esse o ponto. Ao fim do lote o tema troca sem
flash, a tipografia não cai mais nos 16px do navegador (regra D1), o hover
respeita `hoverOnlyWhenSupported`, o Icon tem um peso só (fecha B5 na execução),
todo número e data sabem o locale (fecha o buraco de R3 verificado por grep), e
**E4, E7 e a regra 5 param de depender de alguém lembrar**.
**Destrava:** literalmente todo componente subsequente.

---

### Lote 1 · Camada e anúncio — *fecha E2 e a metade de E7*

Portal · Layer · Focus Scope · Dismissable Layer · Popper · Scroll Lock ·
Scrim · Live Region · Scroll Area · Roving Focus · Overflow Group ·
Pointer Drag · DS Provider · **página de Foundations no showcase**

**Duas ressalvas de dependência.** (1) `Overflow Group` tem dois modos e só um
cabe aqui: o `+N` (que a home já mostra) sai no lote 1; o modo *"colapsa no menu
`⋯`"* depende do `Dropdown Menu` e **fecha no lote 2** — a `Toolbar`, que é a
consumidora desse modo, também é do lote 2. (2) `DS Provider` desceu do lote 0
para cá, porque é aqui que `Portal`, `Layer` e `Live Region` passam a existir;
o slot da fila de toast fica declarado e vazio até o lote 3.

**Entrega:** a escala de camadas que já está em `tailwind.config.ts` ganha o
primeiro consumidor, `<DSProvider>` vira uma linha de verdade, e os primitivos
dos lotes 0 e 1 ganham **rota em Foundations** — o que faz a regra 7 ("procure
no showcase antes de criar") valer também para eles. Número cru de `z-index`
passa a ser rejeitável em revisão, não combinado verbal.
**Destrava:** Tooltip, Popover, Modal, Drawer, Toast, Select, Dropdown Menu,
header sticky da Table, Command Palette, e o resize de coluna do G9 (via
`Pointer Drag`). **Fecha os tickets #86338 e #86178 na origem** — não como
correção, como impossibilidade.

---

### Lote 2 · A tabela de negócios — *a tela medida, e o fim de E1*

Truncate · Tooltip · **Popover** · Icon Button · Dropdown Menu · Checkbox ·
Table (com column header, resize G9 e column visibility) · Pagination ·
Stat Card · Progress · Avatar · Badge Group · List + List Item · Skeleton ·
Spinner · **Async Action** · Empty State · Separator · Toolbar ·
Button Group · Link

**`Popover` não estava em lote nenhum.** Ele aparece na §8 com 3/4 de
convergência, é declarado *"a base técnica de Select, Combobox, Date Picker e
Dropdown Menu"*, e é dependência do `Notification Center` (lote 5) — mas a §9
citava ele só na lista do que o lote 1 *destrava*, e nunca o construía. Entra
aqui, junto do `Tooltip` e do `Dropdown Menu`, que são os outros dois
consumidores diretos do `Popper`.

**Três limites deste lote, para não prometer o que ele não fecha:**

- **`Pagination` sai sem o `Page Size Select`.** "Mostrando 10 de 37" implica
  que 10 é escolha (E5), mas o `Select` é do lote 3. O slot nasce declarado e
  fecha lá.
- **A seleção de linha da `Table` nasce desligada.** O `Bulk Action Bar` é do
  lote 7; ligar checkbox de linha antes dele é entregar seleção sem lugar para
  a ação aparecer — que é literalmente o argumento do próprio componente.
- **`Checkbox` sai sem `Form Field`.** Aqui ele existe para dois usos que não
  pedem rótulo amarrado — seleção de linha e a lista do botão "Colunas ▾" —
  incluindo o estado indeterminado com `aria-checked="mixed"`. A versão de
  formulário, com rótulo, dica e erro ligados por `id`, é do lote 3.
- **`Status View` e `Error State` saíram para o lote 3.** `Status View` troca
  entre `loading`, `empty` e `error`, e `Error State` depende de `Alert` — que
  é do lote 3. No lote 2 os três estados existem soltos (Skeleton, Spinner,
  Empty State); o invólucro que os unifica vem com o Alert.

**`Async Action` subiu do lote 3 para cá**, porque ele só depende de `Spinner`
(este lote) e `Live Region` (lote 1) — e sem ele o "`Button` ganha `loading`"
prometido abaixo seria um spinner sem motor: sem bloqueio de duplo clique, sem
anúncio de resultado, sem reserva de largura.

**Entrega:** a home do CRM medida no node `135:2` — 5 KPIs, tabela de 37
negócios com 7 colunas e `⋯` por linha, "Mostrando 10 de 37", lista de
atendentes, empty state de "Produtos mais vendidos" — **menos três coisas que
não são deste lote e precisam ser ditas**: os dois gráficos (bloqueados por
**B4**, lote 8), o estado **aberto** dos quatro filtros `▾` (é `Select`, lote 3
— o fechado renderiza aqui) e a moldura em volta (App Shell, Sidebar e Topbar
são do lote 5). É a home como conteúdo, não como página.
**Destrava:** E1 deixa de ser possível violar (três tickets), G9 entra (resize
Attio, sobre `Pointer Drag`), o `⋯` órfão do contrato passa a abrir alguma
coisa, e o `Button` ganha `loading`. É o lote que o inventário chama de *"o mais
caro, e o que mais devolve valor"*.

---

### Lote 3 · Formulário e erro — *fecha E6*

Form Field · Input · Number Input · Textarea · Select · Radio Group · Switch ·
Search Input · **Kbd** · Combobox · Form · Alert · Modal · Confirm Dialog ·
Toast · **Status View** · **Error State** · Filter Chip

**`Kbd` subiu do lote 5.** O `Search Input` tem *"slot para o atalho"* e é
construído aqui; o `Kbd` estava no lote 5. Como ele só depende de `Text`, o
custo de antecipar é zero e a metade "visível" do G7 deixa de chegar dois lotes
depois do campo que a mostra.

**`Status View` e `Error State` desceram do lote 2 e do lote 4**, pelo mesmo
motivo: `Error State` precisa de `Alert`, e `Alert` é daqui. Fechados os três
estados obrigatórios da regra 9 (`loading`, `empty`, `error`) num contrato só, e
não em três invenções por tela.

**Entrega:** o primeiro formulário do produto que não improvisa erro. O caminho
de menor esforço passa a ser o inline ancorado no campo; o modal bloqueante
existe para quando a spec pedir. E a `Pagination` do lote 2 ganha o seu
`Page Size Select`.
**Destrava:** **#39683** deixa de ter como acontecer. Todo o módulo de
configurações e todo cadastro. E preenche a lacuna que o inventário §2 chama de
*"grandes"* — a categoria Formulários inteira.

---

### Lote 4 · O registro — *G1 e G2, a área de dor "card do lead e do negócio"*

Drawer · Collapsible · Accordion · Description List · Property Row · Inline Edit ·
Panel Header · **Breadcrumb** · Avatar Group · Status Dot · Timeline ·
Collapsible Card · Error Boundary

**`Breadcrumb` subiu do lote 5.** A variante `page` do `Panel Header` *"carrega
o Breadcrumb"* — e o `Panel Header` é deste lote. Como o `Breadcrumb` só depende
de `Truncate` e `Link` (lote 2), ele vem junto; o que fica no lote 5 é a
`Sidebar`, não a trilha.

**Entrega:** o drawer do lead e do negócio funcionando: abre fino à direita ou em
tela cheia, fecha no X, accordion dentro, e clica-no-campo-e-edita sem abrir
formulário. Com o `Panel Header`, as quatro superfícies que repetem a mesma
anatomia (topo de página, conversa, coluna do kanban, drawer) passam a ter um
desenho só.
**Destrava:** os **dois padrões mais desejados** da lista de 15 (G1 e G2) e a
terceira área de dor do PRD. Também é onde E5 vira mecanismo — densidade
progressiva deixa de ser intenção.

---

### Lote 5 · A moldura — *G3–G7 e A5, cinco padrões desejados de uma vez*

App Shell · Sidebar (colapsável, com favoritos e últimos acessos) · Nav Item ·
Nav Group · Topbar · Theme Toggle · Skip Link · Shortcut Registry ·
**Virtualized List** · Command Palette · User Menu · Notification Center ·
**Assistant Launcher**

**`Virtualized List` subiu do lote 6.** O `Command Palette` já declarava
depender dela (*"virtualização quando a base tem milhares de leads"*) e é deste
lote; ela estava no 6. Sobe inteira — o lote 6 continua sendo o consumidor
pesado, mas não é mais o dono.

**`Assistant Launcher` é item novo, e fecha o G6.** Dos cinco itens que o G6
reserva ao canto superior direito, o roadmap só tinha componente para três:
perfil (`User Menu`), tema (`Theme Toggle`) e notificação (`Notification
Center`). **IA e chat não tinham nenhum** — apesar de o Crazy IA ser o primeiro
módulo do PRD. O lançador entra aqui, com a `Topbar` que o hospeda; o conteúdo
dos painéis é tela de produto, não deste ciclo.

**Entrega:** o produto ganha casca. Um menu só (A5), sidebar que colapsa e
devolve os 15–20% da tela, canto superior direito com os **cinco** itens que G6
reserva — não três — e busca com atalhos visíveis. Com o `App Shell`, a home do
lote 2 finalmente vira página, com `<main>` para o Skip Link apontar.
**Destrava:** cinco dos onze padrões desejados. E os tokens `nav/item/*` — os
únicos do DS que já existem, já foram renomeados e já foram religados aos
semânticos — finalmente ganham o componente que os consome.

---

### Lote 6 · Multiatendimento — *a área de dor nº 1*

Split Panel · Conversation List · Conversation List Item · Message Bubble ·
Message Group · Message Status · Message Composer · Attachment Preview ·
Typing Indicator · Unread Indicator · Channel Badge · File Upload ·
New Messages Pill · Global Banner

*(`Virtualized List` foi para o lote 5, onde o `Command Palette` já dependia
dela. O `Split Panel` traz o segundo consumidor do `Pointer Drag` do lote 1 —
redimensionar painel é o mesmo gesto do resize de coluna, e precisa da mesma
alternativa por teclado.)*

**Entrega:** a tela que o PRD nomeia primeiro entre as que mais doem, e que **não
tem um único componente hoje**.
**Destrava:** o módulo Multiatendimento inteiro. Por que só agora: ela depende de
Split Panel (Scroll Area + container queries), de virtualização e do Message
Composer — nenhum deles construível antes dos lotes 0, 1 e 3.

---

### Lote 7 · Pipeline, automação e configuração

Kanban Board · Kanban Column · Draggable Card · Drop Zone · Segmented Control ·
Stepper · Rule Row · Date Picker · Date Range Picker · Multi Select ·
Form Section · Two Pane Modal · Settings Nav List · Connection Card ·
Secret Field · Bulk Action Bar · Copy Button · Illustration

**Entrega:** o kanban de pipeline, o construtor de automação ("quando X, faça Y")
e as telas de configuração/integrações. **E aqui a seleção de linha da `Table`
liga**: o `Bulk Action Bar` chega junto, e é ele que dá endereço à ação em massa
que a seleção implica.
**Destrava:** a segunda área de dor (Pipelines e Automações) e o G10 na forma
literal. O `Segmented Control` aqui é o que permite alternar kanban↔tabela **sem
abas**, honrando a anti-referência nº 11. `Draggable Card` e `Drop Zone` são o
terceiro consumidor do `Pointer Drag` — e o último, o que significa que a
alternativa por teclado ao arraste (E7) foi decidida uma vez, no lote 1, e não
três vezes aqui.

---

### Lote 8 · BI e visualização — *bloqueado, não adiado*

Bar Chart · Donut Chart · Line Chart · Funnel Chart · Chart Legend ·
Chart Tooltip · Trend Indicator · Meter · Dashboard Grid · Animated Number

**Não começa** antes de **B4** ser decidido no gate. Está em NÃO-ESCOPO pelo PRD
§5.4, e tem uma trava técnica própria: o aberto nº 4 de `tokens-cor.md` registra
que barras e rosca usam **gradiente solto que clareia até quase branco** — some no
tema escuro, e é #80174 e A3 no mesmo componente.

---

## 10 · O que NÃO vamos construir

Escopo negativo vale tanto quanto o positivo. Cada linha tem motivo, não omissão.

### 10.1 · Barrado por regra

| Não construímos | Por quê |
|---|---|
| **Tabs** como navegação | Anti-referência nº 11 é explícita: *"abas como forma de crescer — quebram por navegador e viram duas linhas"*. Apareceu em **5/5 dos DSs de referência** e em dois ângulos, e mesmo assim fica fora. **A alternativa existe e está no roadmap:** `Segmented Control` para alternar visão do mesmo dado, `Accordion` para seções do registro, `Filter Chip` para recorte. As abas Preview/Código do site de documentação são **chrome** (regra D3), não superfície do produto — não viram componente do DS |
| **Menu superior de navegação** | Anti-referência nº 10 — lateral **ou** superior, nunca os dois. A `Topbar` existe e carrega essa restrição escrita: é faixa de utilidade (G6), e se ganhar item de navegação vira o bug |
| **Card colorido, gradiente de fundo, glass** | Anti-referências nº 3, 6 e 7. A única exceção nomeada é o `Connection Card` (cor sutil de fundo), porque o time **pediu** explicitamente (gosto nº 15, respond.io) — e ela vale só na tela de Integrações |
| **Welcome Mat / onboarding overlay** | Conflita frontalmente com A6 (*"nada de título e descrição decorativos"* — "dane-se, o cara sabe"). O público sem tolerância a curva de aprendizado é atendido pelo `Stepper` dentro do fluxo, não por uma parede de boas-vindas |
| **Density Toggle** exposto ao usuário | E5 diz que densidade é **decisão de design**. Construímos o `Density Provider` (contrato herdado por contexto), não um controle que devolve a decisão para quem já reclamou de não achar a etapa do funil |
| **`LeadCard`, `DealCard`, `ContactCard`** e similares | Regra 8: componente do DS não conhece domínio. Entregamos `Draggable Card` + `Property Row` + `Description List`; o card de lead é componente de **produto**, montado sobre eles |

### 10.2 · Fora do escopo declarado

| Não construímos | Por quê |
|---|---|
| **Gráficos** (Bar, Donut, Line, Funnel, Legend, Chart Tooltip, Trend Indicator) | PRD §5.4 tira do escopo até serem desenhados no Figma, **e** a contradição B4 está aberta: a home desenha eixo e legenda lateral; as anti-referências rejeitam exatamente isso. A decisão muda o desenho de dois componentes — decidir antes de construir é mais barato |
| **Dashboard Grid** (widgets reordenáveis) | G11 é desejo real, mas depende do `Collapsible Card` de pé e cai no mesmo NÃO-ESCOPO §5.4 |
| **Mobile Nav Bar · Bottom Sheet** | PRD §5.5: o alvo deste ciclo é o front web. Os quatro tickets de a11y móvel são reais e ficam **registrados** aqui exatamente para a navegação mobile não nascer fora do DS depois — mas portar é desvio novo, com ADR |
| **Multi-marca / white-label / theming API** | PRD §5.6 — um produto só. O `Theme Provider` cobre claro/escuro e para aí |
| **Adaptadores de `react-query`** | Lista negativa de `stack.md`, confirmado pelo Gava: o time usa `fetch` com hook próprio. E componente de DS não faz requisição |
| **Telas do produto** | PRD §5.1. Este ciclo entrega a biblioteca; telas entram por `/kfe-new-screens`, lote a lote |
| **Correção dos 22 tickets** | PRD §5.7. O DS cria a **condição** para corrigi-los — Truncate torna #83283 impossível de escrever, Layer torna #86338 rejeitável em revisão — mas a correção de cada tela é trabalho de lote |

**Divergência com o PRD que este roadmap propõe, e não pode esconder.** O
NÃO-ESCOPO §5.4 não fala só de gráficos: a linha inteira é *"componentes de
dados/visualização — **tabela avançada, filtros** e **KPI do BI** ficam para
lote futuro, e só depois de desenhados no Figma"*. Este roadmap coloca a
`Table` com resize e column visibility (= tabela avançada) e o `Stat Card`
(= KPI) no **lote 2**, e o `Filter Chip` no **lote 3**. O argumento é que os
três estão medidos na home do node `135:2` — não são o BI, são a tela que o
produto já mostra. Mas isso é **reinterpretar o NÃO-ESCOPO, não cumpri-lo**, e
a reinterpretação é decisão do gate, não minha. Se o §5.4 valer ao pé da letra,
o lote 2 perde a metade que mais devolve valor. Está na §12 como item aberto.

### 10.3 · Sem evidência que justifique agora

Estes apareceram nos DSs de referência ou como derivação de módulo, e **não há
tela, ticket ou regra** que os peça. Ficam registrados para não serem
redescobertos do zero:

**Tree** (hierarquia pipeline > etapa > negócio — nenhuma tela precisa hoje) ·
**Slider** (uso estreito: score de lead, faixa de valor) ·
**Rich Text Editor** (o componente mais caro da lista, com alternativa viável em
texto simples com variáveis) · **OTP Input** (uma tela de autenticação, fora das
áreas de dor) · **Transfer List** (o caso real — escolher colunas visíveis — já é
coberto pelo Column Visibility Menu dentro da Table) · **Visual Picker** ·
**Color Picker** (só quando a tela de personalização de etapa/tag existir no
Figma; e a paleta terá de ser fechada, ou A2 e A4 são furadas por dentro) ·
**Time Picker** (absorvido pelo Date Picker) · **Meter** (não há tela de limite de
plano) · **Audio Player** (áudio é dominante no WhatsApp brasileiro, mas nenhuma
tela lida confirma o player) · **Export Menu** (derivação do módulo de BI, não
observação) · **Split Button** (Button + Dropdown Menu cobre) · **Code Block**
(o caso do produto é Integrações e API; o do showcase é chrome) ·
**Animated Number** (polimento, não estrutura) · **Agent Status** (Crazy IA é
módulo declarado, mas não há tela — o que existe agora é o `Assistant Launcher`,
que é a **casca** exigida pelo G6, não o conteúdo).

**Movido para cá nesta revisão:**

- **Context Menu** (menu de botão direito) — estava na §4 com 1/4 de
  convergência e a própria linha admitia: *"derivação, não observação de tela"*.
  Era o único item do catálogo sem tela, sem ticket e sem regra, o que é
  exatamente a definição desta seção. Some ele e a §4 volta a ter só itens com
  evidência. Contra ele há ainda a análise nº 2 do board (*"o usuário não é
  analista"*): afordância que só existe no botão direito é padrão de heavy user
  numa base que não é de heavy users. O `Dropdown Menu` do `⋯` cobre o caso real.

**Fluxo inteiro sem componente e sem evidência, registrado para não sumir:**
**autenticação e gestão de acesso** — login, recuperação de senha, convite de
usuário, papéis e permissões. Nenhum dos quatro levantamentos passou por lá:
não há frame no Figma lido, não há ticket entre os 22 e o PRD trata acesso e
planos como *"regras de produto, fora deste ciclo"* (`regras.md`). É a única
área do produto que **certamente existe** e sobre a qual este roadmap não diz
nada — o que é diferente de dizer que não é necessária. Quando entrar, entra
como composição de `Form` + `Form Field` + `Input` + `Secret Field` (o
`Password Input` já absorvido) + `Alert`; o único item genuinamente novo seria
o `OTP Input` acima.

**Descartados por serem de outro domínio** (levantados e cortados pelo ângulo 2):
Carousel, Brand Band, Map, Expression Builder, Sankey/Radar/Scatter chart, Media
Object, Aspect Ratio, Blockquote, Footnote e os utilitários de render do Pajamas
(Socks, Sprintf, Intersperse).

---

## 11 · Mapa de cobertura

### 11.1 · Contrato `nav.ts` × roadmap

| Categoria | No `nav.ts` hoje | Pronto | Lote em que fecha |
|---|---|---|---|
| **Actions** | Button, Icon Button | Button | Icon Button no lote 2 |
| **Forms** | Input, Select, Checkbox | — | Checkbox no lote 2; Input e Select no lote 3 |
| **Navigation** | Sidebar, Breadcrumb, Pagination | — | Pagination no lote 2; Breadcrumb no lote 4; Sidebar no lote 5 |
| **Data Display** | Card, Stat Card, Badge, Avatar, Table, Progress | Card, Badge | Stat Card, Avatar, Table, Progress no lote 2 — e o **retrofit do `Badge`** (4 de 6 variantes iguais nos dois temas) no lote 0 |
| **Feedback & Overlays** | Tooltip, Empty State, Modal, Drawer | — | Tooltip e Empty State no lote 2; Modal no lote 3; Drawer no lote 4 |

O contrato promete 18 itens; o roadmap unifica **97 componentes** e **27
primitivos**, mais as **3 verificações da §3.4**. `nav.ts` precisa crescer na
ordem dos lotes — e os primitivos da §3 **ganham uma página em Foundations**
(junto de Color, Typography e Icons) no lote 1, sem rota por componente. Sem
essa página, a regra 7 ("procure no showcase antes de criar") não alcança
justamente a camada onde duplicar sai mais caro.

**Nem tudo que está pronto está fechado.** `[pronto]` no `nav.ts` significa que
o componente existe, não que passa no critério: `Badge` reprova no
`check:temas` em 4 das 6 variantes, e `Button` usa `ring-ring` por convenção
enquanto D1 não for decidida. Os dois estão no retrofit do lote 0.

### 11.2 · Os itens de maior convergência

Sete componentes foram apontados pelos **quatro** ângulos. Quatro deles são
`alta` em todos:

| Componente | Por que os quatro chegaram nele |
|---|---|
| **Truncate** | Tela (a tabela vai truncar) · mercado (Pajamas tem dois) · bug (três tickets) · código (não existe primitivo) |
| **Form Field** | Tela (formulário é a maior lacuna) · mercado (5/5 tratam como componente próprio) · bug (#39683) · código (zero `useId`) |
| **Portal / Layer** | Tela (todo `▾` abre camada) · mercado (Garden e Paste tokenizam) · bug (#86338, #86178) · código (escala declarada, zero consumidores) |
| **Inline Edit** | Tela (drawer sem ele vira formulário) · mercado (SLDS inline edit) · gosto declarado G2 · código (comportamento, não estilo) |
| **Toast · Alert · Skeleton · Spinner · Confirm Dialog** | Todos convergem em E6 e na regra 9: se `loading`, `empty` e `error` são estados obrigatórios de todo interativo, então eles são infraestrutura |
| **Separator · Badge Group · Description List · Toolbar · Copy Button** | Convergência em peças pequenas — sinal de que a inconsistência entre telas nasce no detalhe repetido, não no componente grande |

O caso do **Copy Button** merece leitura: 4/4 de convergência e **baixa** nos
quatro. Quando todos os ângulos veem e nenhum prioriza, o item é real e não é
urgente — vai para o lote 7, não para o 2.

---

## 12 · O que este documento não decide

1. **B1–B8** continuam abertos e são gate humano, não escolha minha. Dois deles
   nasceram nesta revisão e mudam o começo, não o fim: **B7** (de onde vem o
   desenho de um componente que não tem frame — a maioria) e **B8** (a paleta
   categórica que o `Avatar` do lote 2 já precisa).
2. **Qual é a home** — o inventário registra a ressalva: a página NOVAS TELAS tem
   outros candidatos (`CRM Datacrazy` 101:51, 154:22703, 154:25088) e **18 frames
   chamados apenas `Breakpoint // Desktop`**. Se a home for outra, o lote 2 muda.
3. **As telas-alvo do primeiro lote** seguem pendentes no `audit.md` — as
   candidatas por concentração de dor (Multiatendimento/Chat, Pipelines/Automações,
   card do lead) são os lotes 4, 6 e 7 deste roadmap, e a ordem entre elas é sua.
4. **Procedência dos 30 stickies** (Q9 do PRD): os padrões G1–G11 e as
   anti-referências A1–A9 sustentam boa parte deste roadmap. Se forem análise
   interna e não fala do cliente, o peso muda — não o conteúdo.
5. **Se o NÃO-ESCOPO §5.4 vale ao pé da letra.** Ele tira do ciclo *"tabela
   avançada, filtros e KPI do BI"*, e o lote 2 entrega os três porque estão
   medidos na home. Ou o §5.4 se referia só ao BI (e a home é escopo), ou o
   lote 2 encolhe pela metade. Ver a nota da §10.2 — é a divergência mais cara
   deste documento com o PRD, e a única que muda o primeiro lote visível.
6. **Se a expansão de marca (T2) é aprovada.** `Illustration` é o único
   componente do roadmap cuja premissa inteira ainda pode ser negada: T2 está
   registrada em `direcao-visual.md` como tensão a confirmar, não como decisão.
7. **Onde o produto pousa.** O `Token Bridge` (§3.3) assume que a adoção é
   sobre o `globals.css` existente, com as variáveis antigas (`--title`,
   `--red`) mapeadas e depreciadas em vez de trocadas. É a leitura das regras 14
   e 15 — mas a lista do que fica obsoleto depende do repo do CRM, que segue
   inacessível (Q1 do PRD, gap nº 1 da auditoria).
