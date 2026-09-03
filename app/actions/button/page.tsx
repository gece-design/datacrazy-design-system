"use client";

import { Plus, CaretDown, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

type Parte = { parte: string; classe: string; valor: string };

const anatomia: Parte[] = [
  { parte: "Altura",              classe: "h-8",           valor: "32px · o tamanho md, padrão" },
  { parte: "Padding lateral",     classe: "px-3",          valor: "12px · cresce com o tamanho" },
  { parte: "Raio",                classe: "rounded-md",    valor: "6px · calc(--radius − 2px)" },
  { parte: "Gap ícone ↔ texto",   classe: "gap-2",         valor: "8px · no container, nunca margin" },
  { parte: "Tipografia",          classe: "text-button",   valor: "13 / 18 · Medium 500" },
  { parte: "Superfície e texto",  classe: "bg-primary",    valor: "par com text-primary-foreground" },
  { parte: "Anel de foco",        classe: "outline-2",     valor: "outline-ring + offset 2 (transparente)" },
];

type Uso = { nome: string; regra: string; texto: string };

const usos: Uso[] = [
  {
    nome: "primary",
    regra: "1 por região",
    texto:
      "A ação que faz a tela avançar: criar negócio, salvar, iniciar campanha. É a única superfície azul cheia da tela, então dois primários competindo entre si anulam os dois. Se a região já tem um, o próximo vira secondary.",
  },
  {
    nome: "secondary",
    regra: "padrão",
    texto:
      "O caso comum, e o que mais aparece no CRM: os filtros do topo da tabela — \"Valor\", \"Colunas\", \"Todas as etapas\", \"Todos os atendentes\" — são todos secondary. Tem borda e fundo de card, então não some, mas também não disputa atenção com o primário.",
  },
  {
    nome: "ghost",
    regra: "dentro de linha",
    texto:
      "Ação de baixo peso que precisa existir sem ocupar espaço visual: cancelar num modal, ação repetida em cada linha da tabela. Sem fundo em repouso — a borda apareceria 40 vezes na mesma lista, e densidade é decisão, não acúmulo (regra E5).",
  },
  {
    nome: "destructive",
    regra: "só irreversível",
    texto:
      "Reservado ao que não tem desfazer: excluir negócio, remover integração. Nunca é o botão que abre o fluxo — é o que confirma dentro dele, na área de botões separada do modal (padrão G10). Usar vermelho em ação reversível gasta o único sinal de perigo que existe.",
  },
];

/** Item de nota: o que se copia em mono, o detalhe em seguida. */
function Item({ mono, children }: { mono: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <code className="w-40 shrink-0 font-mono chrome-meta text-foreground">{mono}</code>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export default function Botao() {
  return (
    <PaginaDS
      titulo="Button"
      descricao="Quatro variantes por três tamanhos: 12 combinações saídas de uma base cva única, com 28, 32 e 36px de altura e raio de 6px. Hover, foco e desabilitado não são desenhados — vêm de regra ancorada em token."
      secoes={["Como funciona", "Variantes", "Tamanhos", "Com ícone", "Estados", "Anatomia", "Quando usar cada variante"]}
    >
      <ComoFunciona>
        <p>
          O componente é uma função de duas entradas. O <Chip>cva</Chip> guarda uma string base — a parte que vale
          sempre: <Chip>inline-flex</Chip>, <Chip>rounded-md</Chip>, <Chip>text-button</Chip>, a transição e o foco — e
          dois eixos de variante, <Chip>variant</Chip> e <Chip>size</Chip>. Não há terceiro eixo:{" "}
          <Chip>defaultVariants</Chip> entrega <Chip>primary</Chip> + <Chip>md</Chip> quando nada é dito, e o{" "}
          <Chip>className</Chip> passado por fora entra por último via <Chip>cn</Chip>. Esse é o único escape, e é
          estreito de propósito — <span className="text-foreground">variante nova só existe se existe no Figma</span>{" "}
          (regra 6). Para virar link sem duplicar componente, use <Chip>asChild</Chip>: o <Chip>Slot</Chip> do Radix
          empresta as classes ao filho.
        </p>
        <p>
          Foco visível é critério de pronto, não acabamento: quatro tickets de acessibilidade (#62306, #61699, #85316,
          #79729) viraram a regra E7. Por isso a base zera o outline padrão e devolve o dela na mesma linha —{" "}
          <Chip>focus-visible:outline-2 outline-offset-2 outline-ring</Chip>. Zerar sem devolver é exatamente o bug que
          os tickets descrevem. E o anel não é cor fixa: <Chip>ring</Chip> foi criado como alias de{" "}
          <Chip>primary</Chip>, então ele clareia sozinho no tema escuro, onde <Chip>primary</Chip> deixa de apontar
          para <Chip>base/blue/500</Chip> e passa a apontar para <Chip>base/blue/400</Chip>.
        </p>
        <p>
          Só o repouso vem do Figma. Hover, foco e desabilitado, não — e isso é decisão registrada, a{" "}
          <span className="text-foreground">exceção E-01</span>, aprovada em 2026-09-01: o time não gasta tempo
          desenhando frame por frame o que uma regra resolve uma vez. O que torna a exceção segura é a âncora: toda
          regra derivada aponta para um token que já existe. O hover do primário usa <Chip>primary-hover</Chip>, que
          estava no arquivo do Figma com o nome <Chip>Primary hover</Chip> antes de qualquer botão ser escrito; o
          destrutivo faz o mesmo com <Chip>destructive-hover</Chip>, e secundário e ghost caem em <Chip>accent</Chip>.
          Onde não existe token, não se inventa valor — decide-se com o humano, o token passa a existir, e só então a
          regra aponta para ele. O contrato completo está em <Chip>docs/processo/interactions.md</Chip>.
        </p>
        <p>
          A armadilha estava no anel, não no botão — e foi corrigida. O <Chip>ring</Chip> do Tailwind desenha o
          respiro com uma <span className="text-foreground">cor sólida</span>: com{" "}
          <Chip>ring-offset-background</Chip>, os dois pixels entre a borda e o anel eram pintados da cor do fundo da
          página. Isso some quando o botão está sobre a página, mas dentro de um <Chip>card</Chip>, de um modal ou de
          uma linha de tabela vira um <span className="text-foreground">halo cinza em volta do botão focado</span> —
          mais visível no tema claro, justamente onde <Chip>background</Chip> e <Chip>card</Chip> são cores diferentes.
          Uma solução seria trocar o offset por superfície a cada contexto, mas isso obriga quem usa o botão a saber
          sobre o que ele está. O foco passou a ser <Chip>outline</Chip>, cujo{" "}
          <Chip>outline-offset</Chip> é transparente e mostra a superfície real, qualquer que seja ela. A regra que
          fica: <span className="text-foreground">respiro de foco não se pinta, se deixa passar</span>.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Variantes"
        spec="4 · variant"
        descricao="Cor não preenche superfície: das quatro, só duas carregam cor na superfície. É o que mantém cor como sinal e não como decoração — anti-referência nº 3."
        codigo={`<Button variant="primary">Nova campanha</Button>
<Button variant="secondary">Filtros</Button>
<Button variant="ghost">Cancelar</Button>
<Button variant="destructive">Excluir negócio</Button>`}
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono='variant="primary"'>
                <Chip>bg-primary</Chip> · hover <Chip>primary-hover</Chip>
              </Item>
              <Item mono='variant="secondary"'>
                <Chip>border-border</Chip> + <Chip>bg-card</Chip> · hover <Chip>accent</Chip>
              </Item>
              <Item mono='variant="ghost"'>
                sem superfície em repouso · hover <Chip>accent</Chip>
              </Item>
              <Item mono='variant="destructive"'>
                <Chip>bg-destructive</Chip> · hover <Chip>destructive-hover</Chip>
              </Item>
            </ul>
            <p className="mt-2.5">
              Os quatro botões acima são os de verdade: passe o mouse para ver cada hover no token que lhe cabe.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Nova campanha</Button>
          <Button variant="secondary">Filtros</Button>
          <Button variant="ghost">Cancelar</Button>
          <Button variant="destructive">Excluir negócio</Button>
        </div>
      </Secao>

      <Secao
        titulo="Tamanhos"
        spec="28 · 32 · 36px"
        descricao="Três alturas, mesma tipografia: o que muda é altura e padding, nunca o corpo do texto. Num CRM a densidade é estrutural, então sm existe para barra de filtro e ação de linha, não para casos apertados."
        codigo={`<Button size="sm">Nova campanha</Button>
<Button size="md">Nova campanha</Button>  {/* md é o padrão: pode omitir */}
<Button size="lg">Nova campanha</Button>`}
        nota={
          <ul className="space-y-1.5">
            <Item mono='size="sm"'>
              <Chip>h-7</Chip> · 28px · <Chip>px-2.5</Chip>
            </Item>
            <Item mono='size="md"'>
              <Chip>h-8</Chip> · 32px · <Chip>px-3</Chip> · o padrão, sai quando <Chip>size</Chip> é omitido
            </Item>
            <Item mono='size="lg"'>
              <Chip>h-9</Chip> · 36px · <Chip>px-4</Chip>
            </Item>
          </ul>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Nova campanha</Button>
          <Button size="md">Nova campanha</Button>
          <Button size="lg">Nova campanha</Button>
        </div>
      </Secao>

      <Secao
        titulo="Com ícone"
        spec="16px · gap-2"
        descricao="Phosphor a 16px, peso regular, um só peso em toda a interface. O ícone é filho direto do botão — o gap de 8px já está no container."
        codigo={`<Button variant="primary">
  <Plus size={16} weight="regular" />
  Nova campanha
</Button>

<Button variant="secondary">
  Todas as etapas
  <CaretDown size={16} weight="regular" />
</Button>

<Button variant="destructive">
  <Trash size={16} weight="regular" />
  Excluir negócio
</Button>`}
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="Plus · antes">ícone à esquerda descreve a ação</Item>
              <Item mono="CaretDown · depois">ícone à direita revela opções</Item>
              <Item mono="Trash · antes">mesmo peso regular do resto da interface</Item>
            </ul>
            <p className="mt-2.5">
              <Chip>[&amp;_svg]:shrink-0</Chip> está na base porque a string traduzida cresce: <Chip>pt-br</Chip> e{" "}
              <Chip>es</Chip> costumam ficar 20–30% mais longos que <Chip>en</Chip>, e sem isso quem amassa é o ícone.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">
            <Plus size={16} weight="regular" />
            Nova campanha
          </Button>
          <Button variant="secondary">
            Todas as etapas
            <CaretDown size={16} weight="regular" />
          </Button>
          <Button variant="destructive">
            <Trash size={16} weight="regular" />
            Excluir negócio
          </Button>
        </div>
      </Secao>

      <Secao
        titulo="Estados"
        spec="E-01"
        descricao="Repouso vem do desenho; os outros três saem de regra. Nada aqui está simulado: os botões de cima estão vivos e os de baixo estão desabilitados de verdade."
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="repouso">o único estado que vem do Figma</Item>
              <Item mono="hover:bg-…">
                passe o mouse na fileira de cima: <Chip>primary-hover</Chip>, <Chip>accent</Chip> nas duas do meio e{" "}
                <Chip>destructive-hover</Chip> — todos tokens que já existiam
              </Item>
              <Item mono="focus-visible">
                dê <Chip>Tab</Chip> a partir daqui: o anel é <Chip>outline-2 outline-offset-2 outline-ring</Chip>,{" "}
                <Chip>ring</Chip> é alias de <Chip>primary</Chip> · regra E7
              </Item>
              <Item mono="disabled">
                a fileira de baixo tem a prop <Chip>disabled</Chip> de verdade: <Chip>opacity-50</Chip>, opacidade
                única no componente inteiro, mais <Chip>pointer-events-none</Chip>
              </Item>
            </ul>
            <p className="mt-2.5">
              Falta um quinto estado — <Chip>active</Chip> é a decisão <Chip>D4</Chip> de{" "}
              <Chip>docs/processo/interactions.md</Chip>, ainda em aberto porque exigiria um azul mais escuro que{" "}
              <Chip>primary-hover</Chip>, e token novo não se inventa.
            </p>
            <p className="mt-2.5">
              Cuidado com o desabilitado: <Chip>disabled:pointer-events-none</Chip> resolve o cursor, mas junto some o{" "}
              <Chip>mouseenter</Chip> — botão desabilitado não dispara tooltip. Quando a spec precisar explicar{" "}
              <span className="text-foreground">por que</span> a ação está bloqueada (regra E1), o gatilho vai no
              elemento em volta, nunca no botão.
            </p>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Nova campanha</Button>
            <Button variant="secondary">Filtros</Button>
            <Button variant="ghost">Cancelar</Button>
            <Button variant="destructive">Excluir negócio</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" disabled>
              Nova campanha
            </Button>
            <Button variant="secondary" disabled>
              Filtros
            </Button>
            <Button variant="ghost" disabled>
              Cancelar
            </Button>
            <Button variant="destructive" disabled>
              Excluir negócio
            </Button>
          </div>
        </div>
      </Secao>

      <Secao
        titulo="Anatomia"
        spec="h-8 · px-3 · rounded-md"
        descricao="Sete decisões compõem o botão. O raio é o item político da lista: 6px é contido de propósito — arredondamento forte é a anti-referência nº 1, e o mesmo valor vale para card e input."
        nota={
          <>
            <ul className="space-y-1.5">
              {anatomia.map((a) => (
                <Item key={a.classe} mono={a.classe}>
                  {a.parte} — {a.valor}
                </Item>
              ))}
            </ul>
            <p className="mt-2.5">
              Altura e padding mudam com <Chip>size</Chip>; raio, gap e tipografia não mudam nunca. Forma diferente
              entre componentes exige motivo — é a regra A1.
            </p>
          </>
        }
      >
        <div className="flex items-center justify-center py-12">
          <Button variant="primary">
            <Plus size={16} weight="regular" />
            Nova campanha
          </Button>
        </div>
      </Secao>

      <Secao
        titulo="Quando usar cada variante"
        descricao="A escolha não é estética. Como cor não preenche superfície neste DS, existem só dois botões com fundo cheio — e gastá-los errado é o que faz a tela perder hierarquia. Abaixo, as duas regiões do CRM onde a escolha aparece inteira: a barra da tabela e a área de botões de um modal destrutivo."
        nota={
          <>
            <ul className="space-y-3">
              {usos.map((u) => (
                <li key={u.nome}>
                  <span className="font-mono chrome-label text-foreground">{u.nome}</span>{" "}
                  <span className="chrome-meta text-subtle-foreground">· {u.regra}</span>
                  <p className="mt-1 chrome-prose text-muted-foreground">{u.texto}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Na barra acima há um primário só, e três secundários ao lado dele; no rodapé do modal, o{" "}
              <Chip>ghost</Chip> é a saída e o <Chip>destructive</Chip> é a confirmação — nunca o que abre o fluxo.
            </p>
          </>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary">
              <Plus size={16} weight="regular" />
              Novo negócio
            </Button>
            <Button variant="secondary">
              Valor
              <CaretDown size={16} weight="regular" />
            </Button>
            <Button variant="secondary">
              Todas as etapas
              <CaretDown size={16} weight="regular" />
            </Button>
            <Button variant="secondary">
              Todos os atendentes
              <CaretDown size={16} weight="regular" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-6">
            <Button variant="ghost">Cancelar</Button>
            <Button variant="destructive">
              <Trash size={16} weight="regular" />
              Excluir negócio
            </Button>
          </div>
        </div>
      </Secao>
    </PaginaDS>
  );
}
