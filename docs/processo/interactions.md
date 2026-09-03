# DataCrazy — Estados de interação por regra

> Este documento é a contrapartida da **exceção E-01**: se o Figma não desenha
> hover, foco, active, disabled e loading, então esses estados precisam ser
> **deriváveis por regra**, ancorados em token que existe. É isso que mantém a
> fidelidade sem custar tempo de desenho.
>
> **Regra de ouro:** onde não existe token, não se inventa valor. Decide-se com
> o humano, o token passa a existir, e a regra passa a apontar para ele.

## Divisão de responsabilidade

| Vem do Figma | Vem de regra (aqui) |
|---|---|
| Tokens e variáveis | Hover |
| Estado de repouso | Foco |
| Variantes estruturais (tamanho, tipo, densidade) | Active / pressionado |
| Layout e geometria | Disabled |
| Estados que mudam o **layout**: vazio, erro, carregando | Loading (a aparência do spinner/skeleton segue o desenho) |

Estado que muda só **cor ou opacidade** → regra.
Estado que muda **o que aparece na tela** → Figma.

## Parte 1 · O que já existe (e prova que o método funciona)

Extraído das variáveis do Figma — valores reais, não propostos:

| Estado | Token | Valor |
|---|---|---|
| Hover de ação primária | `Primary hover` | `#1266e2` |
| Item de navegação selecionado — fundo | `nav/item/bg-selected` | `#f0f6ff` |
| Item de navegação selecionado — texto | `nav/item/text-selected` | `#1266e2` |
| Item de navegação selecionado — ícone | `nav/item/icon-selected` | `#1266e2` |

O hover do botão primário **já está resolvido** sem nenhum frame desenhado.
É exatamente o padrão que este documento generaliza.

## Parte 2 · O que falta decidir (com candidatos, não invenções)

Cada linha abaixo é uma **decisão sua**. Onde proponho, o candidato é sempre um
token que já existe no arquivo — nunca um valor novo tirado do nada.

| # | Estado | Existe token? | Candidato (a aprovar) |
|---|---|---|---|
| D1 | **Anel de foco** | Não | `Primary 300` (`#80b3ff`) ou `Primary` com transparência. Precisa de contraste suficiente nos dois temas |
| D2 | **Hover em superfície neutra** (botão secundário, item de lista, linha de tabela) | Não | `Gelo` (`#f4f5f6`) no claro. No escuro **não há candidato** — falta token |
| D3 | **Disabled** | Não | Opacidade única aplicada ao componente inteiro, **ou** par de tokens de texto/fundo desabilitado. A opacidade é mais simples; o par é mais controlável |
| D4 | **Active / pressionado** | Não | Um passo além do hover. Para primário, exigiria um `Primary` mais escuro que `#1266e2` — token novo |
| D5 | **Hover de Success e Danger** | Não | Mesmo raciocínio do `Primary hover`, aplicado às duas cores de estado |
| D6 | **Loading** | Não | Definir se é spinner, skeleton ou ambos — e onde cada um se aplica |
| D7 | **Superfícies do tema escuro** | Parcial | Existem `Bg`, `Surface escura`, `Surface elevada`, mas como variáveis soltas, não como modo do mesmo token (problema F3) |

> D2 e D7 apontam para o mesmo buraco: **o tema escuro tem poucos tokens**.
> Enquanto ele não tiver o mesmo conjunto que o claro, todo estado derivado
> funciona num tema só — e o requisito de dois temas fica em promessa.

## Parte 3 · Como a inteligência se acumula

O mecanismo já existe no kit, e é onde o aprendizado fica:

1. **`docs/processo/calibration.md`** — o livro-razão. Toda vez que um estado derivado
   sair errado e for corrigido, a correção vira **regra** ali. Corrigiu duas
   vezes a mesma coisa? Vira regra antes de continuar.
2. **`.claude/skills/datacrazy-frontend/SKILL.md`** — a regra estabilizada sobe
   para a skill do projeto, e passa a valer para todo componente novo sem
   ninguém precisar lembrar.
3. **Este documento** — a tabela da Parte 1 cresce conforme as decisões da
   Parte 2 forem tomadas. O objetivo é a Parte 2 esvaziar.

O efeito composto: o componente nº 1 exige decidir vários estados; o nº 10
herda quase tudo pronto. É assim que velocidade e fidelidade deixam de ser
opostos.

## Parte 4 · O que isso não cobre

- **Não substitui o Figma no que é layout.** Vazio, erro e carregando mudam o
  que aparece na tela — continuam sendo desenho.
- **Não dispensa verificação.** O diff de pixels continua valendo para o estado
  de repouso. Estado derivado é verificado por regra e por revisão sua.
- **Não vale para movimento.** Duração e curva de transição não têm token nem
  desenho ainda — decisão em aberto.

## Estado deste documento

**Rascunho de proposta.** A divisão de responsabilidade (Parte 1) segue a
exceção E-01, já aprovada. As decisões D1–D7 **não foram tomadas** — e nenhum
componente deve ser construído antes delas, sob pena de cada um inventar o seu
próprio hover.
