"use client";

import { useState } from "react";
import Link from "next/link";
import { Buildings, CalendarBlank, Clock, WarningCircle } from "@phosphor-icons/react";
import { Quadro, QuadroCartao, type ColunaDoQuadro } from "@/components/ui/quadro";
import { Button } from "@/components/ui/button";
import { Tag, type Tom } from "@/components/ui/tag";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { cn } from "@/lib/utils";

/* Dez negócios — os mesmos da Table e do Calendário — em quatro colunas. O
   quadro não sabe o que é um negócio: a página é quem monta cada cartão. */
type Negocio = {
  id: string;
  nome: string;
  empresa: string;
  valor: string;
  /** Dias parado na coluna. Acima de 7 o sinal acende. */
  dias: number;
  proximaAcao?: string;
  tags: { rotulo: string; tom?: Tom }[];
};

const COLUNAS: ColunaDoQuadro<Negocio>[] = [
  {
    id: "novo",
    rotulo: "Novo",
    descricao: "Entrou e ainda não foi contatado",
    cor: "neutro",
    resumo: "R$ 1.900",
    itens: [
      { id: "n5", nome: "Instituto Raízes", empresa: "Instituto Raízes · Recife", valor: "R$ 1.000", dias: 1, tags: [{ rotulo: "Frio", tom: "ciano" }] },
      { id: "n9", nome: "Helena Moraes", empresa: "Moraes Advocacia · Curitiba", valor: "R$ 900", dias: 2, proximaAcao: "17/09", tags: [{ rotulo: "Warm", tom: "laranja" }, { rotulo: "Indicação" }] },
    ],
  },
  {
    id: "qualificacao",
    rotulo: "Qualificação",
    descricao: "Em conversa, entendendo a necessidade",
    cor: "ciano",
    resumo: "R$ 24.700",
    itens: [
      { id: "n2", nome: "Clínica Vitalis", empresa: "Clínica Vitalis · Campinas", valor: "R$ 1.200", dias: 2, proximaAcao: "04/09", tags: [{ rotulo: "Frio", tom: "ciano" }] },
      { id: "n8", nome: "Campo Vivo Agro", empresa: "Campo Vivo · Rio Verde", valor: "R$ 22.000", dias: 5, tags: [{ rotulo: "Enterprise" }] },
      { id: "n6", nome: "Marina Alvarenga", empresa: "Alvarenga Design · Belo Horizonte", valor: "R$ 1.500", dias: 5, proximaAcao: "17/09", tags: [{ rotulo: "Warm", tom: "laranja" }] },
    ],
  },
  {
    id: "proposta",
    rotulo: "Proposta",
    descricao: "Proposta enviada, aguardando retorno",
    cor: "azul",
    resumo: "R$ 16.100",
    itens: [
      { id: "n1", nome: "Giovanna Alves", empresa: "Alves Confeitaria · São Paulo", valor: "R$ 4.800", dias: 3, proximaAcao: "02/09", tags: [{ rotulo: "Quente", tom: "vermelho" }, { rotulo: "Indicação" }] },
      { id: "n10", nome: "Tomás Vilela", empresa: "Vilela Imóveis · Porto Alegre", valor: "R$ 6.100", dias: 6, tags: [{ rotulo: "Quente", tom: "vermelho" }] },
      { id: "n7", nome: "Oficina Farol", empresa: "Oficina Farol · Florianópolis", valor: "R$ 5.200", dias: 9, proximaAcao: "17/09", tags: [{ rotulo: "Quente", tom: "vermelho" }, { rotulo: "Varejo" }] },
    ],
  },
  {
    id: "fechamento",
    rotulo: "Fechamento",
    descricao: "Contrato em assinatura",
    cor: "verde",
    resumo: "R$ 28.000",
    itens: [
      { id: "n4", nome: "Rede Bom Dia", empresa: "Rede Bom Dia · Salvador", valor: "R$ 9.600", dias: 1, proximaAcao: "09/09", tags: [{ rotulo: "Quente", tom: "vermelho" }] },
      { id: "n3", nome: "Horizonte Engenharia", empresa: "Horizonte · Belo Horizonte", valor: "R$ 18.400", dias: 9, proximaAcao: "09/09", tags: [{ rotulo: "Enterprise" }] },
    ],
  },
];

/** Tira o item de onde está e o põe em `colunaId`, na posição `indice` da lista sem ele. */
function mover(colunas: ColunaDoQuadro<Negocio>[], id: string, colunaId: string, indice: number) {
  const item = colunas.flatMap((c) => c.itens).find((n) => n.id === id);
  if (!item) return colunas;
  return colunas.map((c) => {
    const itens = c.itens.filter((n) => n.id !== id);
    if (c.id !== colunaId) return { ...c, itens };
    itens.splice(indice, 0, { ...item, dias: c.itens.includes(item) ? item.dias : 0 });
    return { ...c, itens };
  });
}

/** Dias parado: o relógio, ou o aviso em `warning` a partir de 7. */
function Dias({ dias }: { dias: number }) {
  const parado = dias >= 7;
  return (
    <span
      title={parado ? `Parado há ${dias} dias nesta coluna` : `${dias} dia(s) nesta coluna`}
      className={cn("flex items-center gap-1 text-caption tabular-nums", parado && "text-warning")}
    >
      {parado ? <WarningCircle size={14} weight="regular" aria-hidden="true" /> : <Clock size={14} weight="regular" aria-hidden="true" />}
      {dias}d
    </span>
  );
}

function CartaoDoNegocio({ negocio }: { negocio: Negocio }) {
  return (
    <QuadroCartao
      titulo={negocio.nome}
      avatar={{ nome: negocio.nome }}
      valor={negocio.valor}
      sinais={<Dias dias={negocio.dias} />}
      detalhes={[
        { icone: Buildings, rotulo: "Empresa", valor: negocio.empresa },
        ...(negocio.proximaAcao ? [{ icone: CalendarBlank, rotulo: "Próxima ação", valor: negocio.proximaAcao }] : []),
      ]}
      rodape={negocio.tags.map((t) => (
        <Tag key={t.rotulo} tom={t.tom}>
          {t.rotulo}
        </Tag>
      ))}
    />
  );
}

const codigoDoQuadro = `type Negocio = { id: string; nome: string; empresa: string; valor: string; dias: number; tags: { rotulo: string; tom?: "ciano" | "laranja" | "vermelho" }[] };
const [colunas, setColunas] = useState(COLUNAS);

<Quadro
  colunas={colunas}
  chaveDe={(n: Negocio) => n.id}
  nomeDe={(n) => n.nome}
  descricaoDe={(n) => \`\${n.empresa}, \${n.valor}\`}
  renderizar={(n) => (
    <QuadroCartao
      titulo={n.nome}
      avatar={{ nome: n.nome }}
      valor={n.valor}
      sinais={<span className="flex items-center gap-1 text-caption tabular-nums"><Clock size={14} weight="regular" aria-hidden="true" />{n.dias}d</span>}
      detalhes={[{ icone: Buildings, rotulo: "Empresa", valor: n.empresa }]}
      rodape={n.tags.map((t) => <Tag key={t.rotulo} tom={t.tom}>{t.rotulo}</Tag>)}
    />
  )}
  aoMover={(id, colunaId, indice) => setColunas((atual) => mover(atual, id, colunaId, indice))}
  aoAbrir={(n) => abrir(n)}
  aoAdicionar={(colunaId) => novoNegocio(colunaId)}
  aoEditarColuna={(coluna) => editarColuna(coluna)}
  aoCriarColuna={() => criarColuna()}
/>`;

const codigoDoCartao = `<QuadroCartao
  titulo="Horizonte Engenharia"
  avatar={{ nome: "Horizonte Engenharia" }}
  valor="R$ 18.400"
  sinais={<span className="flex items-center gap-1 text-caption tabular-nums"><Clock size={14} weight="regular" aria-hidden="true" />9d</span>}
  detalhes={[
    { icone: Buildings, rotulo: "Empresa", valor: "Horizonte · Belo Horizonte" },
    { icone: CalendarBlank, rotulo: "Próxima ação", valor: "09/09" },
  ]}
  rodape={
    <>
      <Tag tom="vermelho">Quente</Tag>
      <Tag>Enterprise</Tag>
    </>
  }
/>`;

const codigoNaTela = `// Na tela do Pipeline: etapa vira coluna, lead vira cartão. O quadro não conhece nenhum dos dois.
type Lead = { id: string; nome: string; empresa: string; valor: number; etapa: string };
const colunas = etapas.map((e) => ({
  id: e.id,
  rotulo: e.rotulo,
  descricao: e.descricao,
  cor: e.cor,
  itens: leads.filter((l) => l.etapa === e.id),
  resumo: moeda(leads.filter((l) => l.etapa === e.id).reduce((n, l) => n + l.valor, 0)),
}));

<Quadro
  colunas={colunas}
  chaveDe={(l: Lead) => l.id}
  nomeDe={(l) => l.nome}
  descricaoDe={(l) => \`\${l.empresa}, \${moeda(l.valor)}\`}
  renderizar={(l) => <QuadroCartao titulo={l.nome} avatar={{ nome: l.nome }} valor={moeda(l.valor)} />}
  aoMover={mover}
  aoAbrir={(l) => abrirLead(l.id)}
  aoAdicionar={(etapa) => novoLead(etapa)}
  aoEditarColuna={(c) => editarEtapa(c.id)}
  aoCriarColuna={criarEtapa}
  rotulos={{
    cartao: "Cartão do funil",
    adicionar: "Novo lead",
    criarColuna: "Nova etapa",
    vazio: "Nenhum lead nesta etapa. Arraste um cartão para cá.",
    resumo: (total) => \`\${total} em aberto nesta etapa\`,
  }}
/>`;

function Exemplo() {
  const [colunas, setColunas] = useState(COLUNAS);
  const [ultimo, setUltimo] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      {/* o quadro vive sobre `muted`, o fundo do conteúdo da TelaBase (ADR-066) */}
      <div className="flex h-[520px] flex-col rounded-md bg-muted">
        <Quadro
          colunas={colunas}
          chaveDe={(n) => n.id}
          nomeDe={(n) => n.nome}
          descricaoDe={(n) => `${n.empresa}, ${n.valor}`}
          renderizar={(n) => <CartaoDoNegocio negocio={n} />}
          aoMover={(id, colunaId, indice) => {
            setColunas((atual) => mover(atual, id, colunaId, indice));
            setUltimo(null);
          }}
          aoAbrir={(n) => setUltimo(`${n.nome} — no CRM, o cartão abre o Drawer do lead.`)}
          aoAdicionar={(colunaId) =>
            setUltimo(`Novo cartão em ${colunas.find((c) => c.id === colunaId)?.rotulo} — no CRM, abre o modal de novo lead já na etapa.`)
          }
          aoEditarColuna={(coluna) => setUltimo(`${coluna.rotulo} — no CRM, abre o modal que renomeia e recolore a etapa.`)}
          aoCriarColuna={() => setUltimo("Nova coluna — no CRM, abre o modal de nova etapa.")}
        />
      </div>
      {/* O que cada gesto devolve — a tela é quem decide o que fazer com ele. */}
      <p aria-live="polite" className="text-body-md text-muted-foreground">
        {ultimo ?? "Arraste um cartão, ou foque um e aperte Espaço. Clique no título da coluna, no Novo cartão do pé ou no + do fim do trilho para ver o que o quadro devolve."}
      </p>
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Quadro"
      descricao="O kanban do produto: colunas de 220 a 300 num trilho que rola, vão de 8, e cartões com traço, recuo 8 e 6 entre os blocos. Arrastar é HTML5 puro; o mesmo movimento existe pelo teclado — Espaço, setas, Enter, Esc — e cada passo é anunciado. A cor da coluna é um dos catorze tons, ou neutra."
      novidade="2026-10-07"
      secoes={["O quadro", "O cartão", "Na tela", "Como funciona"]}
    >
      <Secao
        titulo="O quadro"
        spec="4 colunas · 220–300 · vão 8"
        descricao="Dez negócios em quatro colunas. Arraste um cartão para outra coluna: a linha azul diz onde ele cai. Pelo teclado, Espaço pega, setas para os lados trocam de coluna, para cima e para baixo mudam a posição, Enter solta, Esc cancela. A roda rola o trilho; as setas nas bordas andam uma coluna por clique; arrastar o fundo também rola."
        codigo={codigoDoQuadro}
        novidade="2026-10-07"
        nota={
          <>
            O quadro não sabe o que é um negócio: recebe <Chip>colunas</Chip> com <Chip>itens</Chip> de qualquer tipo,{" "}
            <Chip>chaveDe</Chip> e <Chip>nomeDe</Chip> para identificar e anunciar cada um, e <Chip>renderizar</Chip>{" "}
            devolve o conteúdo do cartão — um <Chip>QuadroCartao</Chip>. A casca do cartão (traço, foco, arrasto) é
            do quadro. <Chip>aoMover</Chip> entrega <Chip>id</Chip>, <Chip>colunaId</Chip> e a posição na lista sem
            o item; a tela grava. A cor da coluna é <Chip>cor</Chip>: um dos catorze tons pinta o painel em{" "}
            <Chip>tom-anel</Chip> e a bolinha e o título em <Chip>tom-texto</Chip>; <Chip>neutro</Chip> é{" "}
            <Chip>background</Chip>. Com <Chip>aoEditarColuna</Chip>, o título vira botão; com <Chip>aoAdicionar</Chip>,
            o pé ganha o botão; com <Chip>aoCriarColuna</Chip>, o fim do trilho ganha o +.
          </>
        }
      >
        <Exemplo />
      </Secao>

      <Secao
        titulo="O cartão"
        spec="4 blocos · recuo 8 · vão 6"
        descricao="Quem é (avatar de 20 e título em h4), quanto vale e os sinais do canto, as linhas de detalhe com o ícone do campo, e o pé com as tags. Cada bloco só aparece quando tem o que mostrar: o terceiro cartão é só título e valor."
        codigo={codigoDoCartao}
        novidade="2026-10-07"
        nota={
          <>
            Solto, o <Chip>QuadroCartao</Chip> desenha a própria casca; dentro do <Chip>Quadro</Chip> a casca é do{" "}
            <Chip>article</Chip> que arrasta, e o cartão só põe o conteúdo. <Chip>valor</Chip> chega formatado — o
            componente não conhece moeda. Cada <Chip>detalhe</Chip> é ícone e valor numa linha de 16; o nome do campo
            vai no <Chip>title</Chip> e no leitor de tela. <Chip>sinais</Chip> e <Chip>rodape</Chip> são livres: a
            origem, os dias parado e as tags são da tela.
          </>
        }
      >
        <div className="flex flex-wrap items-start gap-3">
          <QuadroCartao
            className="w-64"
            titulo="Horizonte Engenharia"
            avatar={{ nome: "Horizonte Engenharia" }}
            valor="R$ 18.400"
            sinais={<Dias dias={9} />}
            detalhes={[
              { icone: Buildings, rotulo: "Empresa", valor: "Horizonte · Belo Horizonte" },
              { icone: CalendarBlank, rotulo: "Próxima ação", valor: "09/09" },
            ]}
            rodape={
              <>
                <Tag tom="vermelho">Quente</Tag>
                <Tag>Enterprise</Tag>
              </>
            }
          />
          <QuadroCartao
            className="w-64"
            titulo="Giovanna Alves"
            avatar={{ nome: "Giovanna Alves" }}
            valor="R$ 4.800"
            sinais={<Dias dias={3} />}
            detalhes={[{ icone: Buildings, rotulo: "Empresa", valor: "Alves Confeitaria · São Paulo" }]}
          />
          <QuadroCartao className="w-64" titulo="Clínica Vitalis" avatar={{ nome: "Clínica Vitalis" }} valor="R$ 1.200" />
        </div>
        <Legenda>
          O título corta com reticências e guarda o nome inteiro no <Chip>title</Chip>; o detalhe também. O avatar é
          o <Chip>Avatar</Chip> de 20 com duas iniciais na cor que o nome sorteia — a mesma pessoa tem sempre a
          mesma cor, aqui e na lista.
        </Legenda>
      </Secao>

      <Secao
        titulo="Na tela"
        spec="Pipeline · etapa → coluna · lead → cartão"
        descricao="A tela do Pipeline monta o quadro do funil com este componente: as 5 etapas viram colunas com a soma em aberto no cabeçalho, cada lead vira um cartão com os campos que a pessoa ligou, e as palavras do funil — Novo lead, Nova etapa — entram por rotulos."
        codigo={codigoNaTela}
        novidade="2026-10-07"
        nota={
          <>
            Abra a aba Código: é o encaixe inteiro. Tudo o que diz &quot;lead&quot; ou &quot;etapa&quot; está do lado
            da tela — em <Chip>rotulos</Chip>, no <Chip>resumo</Chip> da coluna e no que <Chip>renderizar</Chip>{" "}
            devolve. Os anúncios de posição e o tooltip do título já saem certos da fábrica{" "}
            <Chip>ROTULOS_DO_QUADRO</Chip>; no CRM os textos vêm do next-intl.
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            O protótipo abre na tela do Pipeline, com o quadro do funil, a lista e o calendário ligados ao mesmo
            Drawer do lead.
          </p>
          <Button asChild variant="secondary">
            <Link href="/prototipo?tela=pipeline">Abrir o Pipeline no protótipo</Link>
          </Button>
        </div>
      </Secao>

      <ComoFunciona>
        <p>
          Não há desenho no arquivo: o Quadro nasceu como o quadro do funil da tela do Pipeline (cliente, 2026-09-28:
          &quot;colunas de 220px, cartões mais enxutos&quot;) e virou peça em 2026-10-07, a pedido do cliente na
          reunião de 02/10 — tudo o que o protótipo mostra é componente do design system. A casca é a mesma que a
          tela tinha; o que saiu foi o domínio: lead, etapa, moeda e as palavras do funil agora chegam de fora.
        </p>
        <p>
          Arrastar é <Chip>draggable</Chip> + os eventos de drag do HTML5, sem biblioteca — a lista negativa do
          projeto não deixa entrar uma por causa de um quadro. Arrastar com o mouse não é acessível sozinho
          (WCAG 2.5.7): o mesmo movimento existe pelo teclado, e cada passo cai numa região <Chip>aria-live</Chip>.
          O alvo é um só para os dois gestos: a <Chip>Linha</Chip> azul de 4px é onde o cartão vai cair, e o índice
          que <Chip>aoMover</Chip> entrega é a posição na lista <strong>sem</strong> o cartão em movimento — quem
          insere já o removeu.
        </p>
        <p>
          A armadilha é o filtro: o índice chega na contagem do que está <strong>à vista</strong>. Com busca ou filtro
          ativo a lista real é maior, e a tela precisa traduzir a posição pelo cartão que estava ali — é o que a
          tela do Pipeline faz em <Chip>mover</Chip>. A outra: a função do <Chip>setState</Chip> que reordena tem
          que ser pura; um <Chip>toast()</Chip> lá dentro vira setState no meio do desenho de outro componente.
        </p>
        <p>
          O trilho rola de três jeitos — roda, setas nas bordas (uma coluna por clique: a largura dela, hoje, mais o
          vão) e arrastando o fundo, como no Trello. As setas somem na ponta, para não prometer coluna que não há; o
          cálculo roda num <Chip>ResizeObserver</Chip>, porque mover um cartão pode encurtar o trilho. A cor da
          coluna é <Chip>data-tom</Chip>: o painel usa <Chip>tom-anel</Chip>, o degrau mais claro, e a bolinha e o
          título saem do mesmo <Chip>tom-texto</Chip> — <Chip>tom-tag</Chip>, o cheio, é fraco demais aos 13px.
        </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
