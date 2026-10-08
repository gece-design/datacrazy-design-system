"use client";

import { Copy, PencilSimple, Trash } from "@phosphor-icons/react";
import { CartaoDeCatalogo } from "@/components/ui/cartao-de-catalogo";
import { BotaoDeAcoes } from "@/components/ui/menu";
import { Tag } from "@/components/ui/tag";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { gradeDeCartoes } from "@/lib/campo";

/* Quatro agentes, como na tela de Agentes de IA: nome, o que fazem e as três
   métricas que se comparam. Um deles ainda sem score. */
const AGENTES = [
  { id: "a1", nome: "Qualificador de leads", descricao: "Faz as três perguntas de qualificação e marca o lead como quente, morno ou frio antes de passar para o time.", score: 92, modelo: "GPT-4o", ferramentas: 6 },
  { id: "a2", nome: "Agendador de reuniões", descricao: "Oferece os horários livres do vendedor e confirma a reunião no calendário.", score: 88, modelo: "GPT-4o mini", ferramentas: 4 },
  { id: "a3", nome: "Suporte nível 1", descricao: "Responde dúvidas comuns com a central de ajuda e abre um chamado quando não sabe.", score: 79, modelo: "Gemini Flash", ferramentas: 2 },
  { id: "a4", nome: "Resumo de conversas", descricao: "Ao fim do atendimento, grava o resumo no lead.", score: null, modelo: "Claude Haiku", ferramentas: 1 },
];

const codigo = `<ul className={gradeDeCartoes}>
  {agentes.map((a) => (
    <li key={a.id} className="min-w-0">
      <CartaoDeCatalogo
        nome={a.nome}
        descricao={a.descricao}
        acoes={
          <BotaoDeAcoes
            rotulo={\`Ações de \${a.nome}\`}
            itens={[
              { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: () => editar(a) },
              { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: () => excluir(a) },
            ]}
          />
        }
        metricas={[
          { rotulo: "Score", valor: a.score, titulo: a.score === null ? "Ainda sem score" : undefined },
          { rotulo: "Modelo", valor: <Tag>{a.modelo}</Tag>, cresce: true },
          { rotulo: "Ferramentas", valor: a.ferramentas },
        ]}
      />
    </li>
  ))}
</ul>`;

function Acoes({ nome }: { nome: string }) {
  return (
    <BotaoDeAcoes
      rotulo={`Ações de ${nome}`}
      itens={[
        { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: () => {} },
        { id: "duplicar", rotulo: "Duplicar", icone: Copy, aoAtivar: () => {} },
        { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: () => {} },
      ]}
    />
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Cartão de catálogo"
      descricao="Um registro num catálogo em cartões: iniciais na cor do nome, nome, descrição de até 2 linhas, o menu de ações no canto e, embaixo do traço, 2 a 3 métricas que se comparam de um cartão para o outro. Recuo 12, vão 12."
      novidade="2026-10-07"
      secoes={["Na grade", "Sem métricas", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="Na grade"
        spec="gradeDeCartoes · 3 métricas · pé alinhado"
        descricao="Quatro agentes em cartões: a fileira tem a mesma altura e as métricas alinham no pé. O quarto ainda não tem score — o traço apagado diz por quê no title. O ⋮ abre o menu de ações, com ícone em todo item."
        codigo={codigo}
        novidade="2026-10-07"
        nota={
          <>
            O cartão não sabe o que é um agente: recebe <Chip>nome</Chip>, <Chip>descricao</Chip>, <Chip>acoes</Chip>{" "}
            (um <Chip>BotaoDeAcoes</Chip>) e <Chip>metricas</Chip> — <Chip>rotulo</Chip> e <Chip>valor</Chip>, que pode
            ser número, <Chip>Tag</Chip> ou <Chip>null</Chip>. A métrica com <Chip>cresce</Chip> ocupa o que sobra;
            as outras ficam no tamanho do conteúdo. O <Chip>mt-auto</Chip> do pé é o que alinha os números entre
            cartões de alturas diferentes.
          </>
        }
      >
        <ul className={gradeDeCartoes}>
          {AGENTES.map((a) => (
            <li key={a.id} className="min-w-0">
              <CartaoDeCatalogo
                nome={a.nome}
                descricao={a.descricao}
                acoes={<Acoes nome={a.nome} />}
                metricas={[
                  { rotulo: "Score", valor: a.score, titulo: a.score === null ? "Ainda sem score" : undefined },
                  { rotulo: "Modelo", valor: <Tag title={a.modelo}>{a.modelo}</Tag>, cresce: true },
                  { rotulo: "Ferramentas", valor: a.ferramentas },
                ]}
              />
            </li>
          ))}
        </ul>
      </Secao>

      <Secao
        titulo="Sem métricas"
        spec="nome + descrição · sem pé"
        descricao="Quando só o nome e a descrição importam, o cartão fecha logo abaixo do texto. A descrição corta em 2 linhas e guarda o texto inteiro no title."
        codigo={`<CartaoDeCatalogo
  nome="Boas-vindas pelo WhatsApp"
  descricao="Responde o primeiro contato em até um minuto e pergunta o que a pessoa precisa."
  acoes={<BotaoDeAcoes rotulo="Ações de Boas-vindas" itens={itens} />}
/>`}
      >
        <ul className={gradeDeCartoes}>
          <li className="min-w-0">
            <CartaoDeCatalogo
              nome="Boas-vindas pelo WhatsApp"
              descricao="Responde o primeiro contato em até um minuto e pergunta o que a pessoa precisa, antes de qualquer atendente entrar."
              acoes={<Acoes nome="Boas-vindas pelo WhatsApp" />}
            />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo nome="Lembrete de proposta" descricao="Três dias depois da proposta sem resposta, manda um lembrete curto." acoes={<Acoes nome="Lembrete de proposta" />} />
          </li>
          <li className="min-w-0">
            <CartaoDeCatalogo nome="Reativação" avatar={{ tom: "roxo" }} acoes={<Acoes nome="Reativação" />} />
          </li>
        </ul>
        <Legenda>
          O terceiro cartão não tem descrição e fixa a cor do disco em <Chip>avatar.tom</Chip>; sem ela, a cor sai do
          nome (<Chip>tom=&quot;auto&quot;</Chip>), a mesma que o Avatar usa na lista e no quadro.
        </Legenda>
      </Secao>

      <ComoFunciona>
        <p>
          Não há desenho no arquivo: o cartão nasceu na tela de Agentes de IA (2026-10-02) e virou peça em 2026-10-07,
          quando o cliente pediu que tudo o que o protótipo mostra fosse componente do design system — para a
          geração de telas novas reusar a peça em vez de montar outra. É o <Chip>Card</Chip> com recuo 12 e vão 12
          (mais enxuto que o do dashboard), o <Chip>Avatar</Chip> md com <Chip>tom=&quot;auto&quot;</Chip> e um{" "}
          <Chip>&lt;dl&gt;</Chip> no pé.
        </p>
        <p>
          O cartão não é clicável: as ações ficam no <Chip>BotaoDeAcoes</Chip> (o ⋮ que abre um <Chip>Menu</Chip>, com o
          foco de volta resolvido), e o hover é do botão. O nome é <Chip>&lt;h2&gt;</Chip> e cada métrica um par{" "}
          <Chip>dt</Chip>/<Chip>dd</Chip>: o leitor de tela lê &quot;Score, 88&quot;.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Catálogo comparável em cartões; a lista densa é a Table, o número em destaque é o KpiCard.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> para um catálogo em que cada item tem nome, descrição e 2 a 3
            números que se comparam: agentes de IA, modelos de mensagem, produtos.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para muitos registros com várias colunas: é a Table
            densa, com ícone por coluna.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para o cartão do funil, que se arrasta: é o cartão do
            Quadro.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
