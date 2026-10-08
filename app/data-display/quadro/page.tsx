"use client";

import { useState } from "react";
import Link from "next/link";
import { Buildings, CalendarBlank, Clock, EnvelopeSimple, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { Quadro, QuadroCartao, ROTULOS_DO_QUADRO, type ColunaDoQuadro } from "@/components/ui/quadro";
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

const TODOS = COLUNAS.flatMap((c) => c.itens);

/* Uma coluna por cor: a neutra e seis dos catorze tons. Um cartão em cada,
   para a cor do painel aparecer. */
const CORES: ColunaDoQuadro<Negocio>[] = (
  [
    ["neutro", "Neutro", "Sem cor: o painel é background"],
    ["azul", "Azul", "Em proposta"],
    ["roxo", "Roxo", "Em negociação"],
    ["laranja", "Laranja", "Precisa de atenção"],
    ["verde", "Verde", "Ganho"],
    ["vermelho", "Vermelho", "Perdido"],
    ["ciano", "Ciano", "Qualificação"],
  ] as const
).map(([cor, rotulo, descricao], i) => ({
  id: cor,
  rotulo,
  descricao,
  cor,
  resumo: `${i + 1} cartão`,
  itens: [{ ...TODOS[i], id: `c-${cor}`, tags: [] }],
}));

/* Oito colunas estreitas: mais que a caixa comporta, para o trilho rolar e as setas aparecerem. */
const TRILHO: ColunaDoQuadro<Negocio>[] = ["Novo", "Contato", "Qualificação", "Reunião", "Proposta", "Negociação", "Contrato", "Ganho"].map((rotulo, i) => ({
  id: `t-${i}`,
  rotulo,
  cor: (["neutro", "ciano", "ciano", "azul", "azul", "roxo", "laranja", "verde"] as const)[i],
  resumo: `${(i + 1) * 3}`,
  itens: TODOS.slice(i, i + 1).map((n) => ({ ...n, id: `t-${i}-${n.id}` })),
}));

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

/** Um item de lista com a chave à esquerda, como nas páginas do Button e do Input. */
function Item({ mono, children }: { mono: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <code className="w-44 shrink-0 font-mono chrome-meta text-foreground">{mono}</code>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  { nome: "Trilho", medida: "gap-2 · p-3 · rola na horizontal", papel: "A faixa que segura as colunas. Rola com a roda, com as setas nas bordas (uma coluna por clique) e arrastando o fundo. As setas só aparecem quando há coluna fora da tela." },
  { nome: "Coluna", medida: "220–300 · flex-1 · rounded-lg · p-1.5", papel: "Piso de 220, cresce até 300 quando sobra tela; cinco cabem em 1440 sem rolar. O painel é tom-anel (o degrau mais claro da cor) ou background na neutra; vira accent enquanto é o alvo de um arrasto." },
  { nome: "Cabeçalho da coluna", medida: "h-6 · gap-1.5 · px-1", papel: "Bolinha de 8 e título em heading-4, os dois em tom-texto; a contagem em label-md ao lado; o resumo à direita, com tooltip. Com aoEditarColuna o título é botão e fica primary sob o cursor." },
  { nome: "Cartão", medida: "rounded-md · border · p-2 · gap-1.5", papel: "O article que arrasta: traço no lugar da sombra, foco por fora, cursor de pegar. Sob o cursor o traço escurece e ganha shadow-sm; entra com animate-surgir." },
  { nome: "Linha de destino", medida: "h-1 · rounded-full · primary", papel: "Onde o cartão vai cair, para o mouse e para o teclado — é o mesmo alvo. Aparece entre dois cartões ou no fim da coluna." },
  { nome: "Coluna vazia", medida: "border-dashed · py-4 · body-sm", papel: "O texto vazio em subtle-foreground, numa caixa tracejada. Some enquanto a coluna é o alvo de um arrasto." },
  { nome: "Novo cartão", medida: "Button ghost sm · justify-start", papel: "No pé da lista de cada coluna, com rótulo — o cabeçalho de 220 não tem lugar para mais um botão. Só existe com aoAdicionar." },
  { nome: "Nova coluna", medida: "Button ghost icon-sm · border-dashed", papel: "Um botão estreito no fim do trilho, não uma coluna inteira de espaço vazio. Só existe com aoCriarColuna." },
];

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

const codigoDasCores = `// cor: um dos catorze tons de lib/tons.ts, ou "neutro"
const colunas = [
  { id: "novo", rotulo: "Novo", cor: "neutro", itens: novos },
  { id: "proposta", rotulo: "Proposta", cor: "azul", resumo: "R$ 16.100", itens: emProposta },
  { id: "ganho", rotulo: "Ganho", cor: "verde", resumo: "R$ 28.000", itens: ganhos },
];`;

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

const codigoDosRotulos = `<Quadro
  colunas={colunas}
  chaveDe={(n: { id: string; nome: string }) => n.id}
  nomeDe={(n) => n.nome}
  renderizar={(n) => <QuadroCartao titulo={n.nome} />}
  aoMover={mover}
  aoAbrir={abrir}
  aoAdicionar={agregar}
  aoCriarColuna={nuevaColumna}
  rotulos={{
    cartao: "Tarjeta del tablero",
    adicionar: "Nueva tarjeta",
    adicionarEm: (coluna) => \`en \${coluna}\`,
    criarColuna: "Nueva columna",
    vazio: "Ninguna tarjeta en esta columna. Arrastra una aquí.",
    anteriores: "Ver columnas anteriores",
    proximas: "Ver columnas siguientes",
    instrucoes: "Tarjeta del tablero. Enter abre. Espacio toma la tarjeta; las flechas eligen columna y posición, Enter suelta, Esc cancela.",
    pego: (nome) => \`\${nome} tomada. Flechas para mover, Enter suelta, Esc cancela.\`,
    colunaEscolhida: (coluna, posicao, total) => \`\${coluna}, posición \${posicao} de \${total}.\`,
    posicao: (posicao, total) => \`Posición \${posicao} de \${total}.\`,
    movido: (nome, coluna, posicao) => \`\${nome} en \${coluna}, posición \${posicao}.\`,
    cancelado: (nome, coluna) => \`Movimiento cancelado. \${nome} sigue en \${coluna}.\`,
  }}
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

/** O quadro vivo, com os gestos devolvidos embaixo. */
function Exemplo({ inicial = COLUNAS, altura = "h-[520px]", comColunas = true }: { inicial?: ColunaDoQuadro<Negocio>[]; altura?: string; comColunas?: boolean }) {
  const [colunas, setColunas] = useState(inicial);
  const [ultimo, setUltimo] = useState<string | null>(null);
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      {/* o quadro vive sobre `muted`, o fundo do conteúdo da TelaBase (ADR-066) */}
      <div className={cn("flex w-full min-w-0 flex-col rounded-md bg-muted", altura)}>
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
          aoEditarColuna={comColunas ? (coluna) => setUltimo(`${coluna.rotulo} — no CRM, abre o modal que renomeia e recolore a etapa.`) : undefined}
          aoCriarColuna={comColunas ? () => setUltimo("Nova coluna — no CRM, abre o modal de nova etapa.") : undefined}
        />
      </div>
      {/* O que cada gesto devolve — a tela é quem decide o que fazer com ele. */}
      <p aria-live="polite" className="text-body-md text-muted-foreground">
        {ultimo ?? "Arraste um cartão, ou foque um e aperte Espaço. Clique no título da coluna, no Novo cartão do pé ou no + do fim do trilho para ver o que o quadro devolve."}
      </p>
    </div>
  );
}

/** Em espanhol: só `rotulos` muda. */
function ExemploEmEspanhol() {
  const [colunas, setColunas] = useState<ColunaDoQuadro<Negocio>[]>([
    { id: "nuevo", rotulo: "Nuevo", cor: "neutro", resumo: "2", itens: COLUNAS[0].itens },
    { id: "propuesta", rotulo: "Propuesta", cor: "azul", resumo: "1", itens: COLUNAS[2].itens.slice(0, 1) },
    { id: "ganado", rotulo: "Ganado", cor: "verde", resumo: "0", itens: [] },
  ]);
  return (
    <div className="flex h-[360px] w-full min-w-0 flex-col rounded-md bg-muted">
      <Quadro
        colunas={colunas}
        chaveDe={(n) => n.id}
        nomeDe={(n) => n.nome}
        renderizar={(n) => <QuadroCartao titulo={n.nome} avatar={{ nome: n.nome }} valor={n.valor} />}
        aoMover={(id, colunaId, indice) => setColunas((atual) => mover(atual, id, colunaId, indice))}
        aoAbrir={() => undefined}
        aoAdicionar={() => undefined}
        aoCriarColuna={() => undefined}
        rotulos={{
          cartao: "Tarjeta del tablero",
          adicionar: "Nueva tarjeta",
          adicionarEm: (coluna) => `en ${coluna}`,
          criarColuna: "Nueva columna",
          vazio: "Ninguna tarjeta en esta columna. Arrastra una aquí.",
          anteriores: "Ver columnas anteriores",
          proximas: "Ver columnas siguientes",
          resumo: (resumo, coluna) => `${resumo} en ${coluna}`,
          instrucoes: "Tarjeta del tablero. Enter abre. Espacio toma la tarjeta; las flechas eligen columna y posición, Enter suelta, Esc cancela.",
          pego: (nome) => `${nome} tomada. Flechas para mover, Enter suelta, Esc cancela.`,
          colunaEscolhida: (coluna, posicao, total) => `${coluna}, posición ${posicao} de ${total}.`,
          posicao: (posicao, total) => `Posición ${posicao} de ${total}.`,
          movido: (nome, coluna, posicao) => `${nome} en ${coluna}, posición ${posicao}.`,
          cancelado: (nome, coluna) => `Movimiento cancelado. ${nome} sigue en ${coluna}.`,
        }}
      />
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Quadro"
      descricao="O kanban do produto: colunas de 220 a 300 num trilho que rola, vão de 8, e cartões com traço, recuo 8 e 6 entre os blocos. Arrastar é HTML5 puro; o mesmo movimento existe pelo teclado — Espaço, setas, Enter, Esc — e cada passo é anunciado. A cor da coluna é um dos catorze tons, ou neutra."
      novidade="2026-10-07"
      secoes={["O quadro", "Colunas e cores", "O cartão", "Pelo teclado", "Trilho que rola", "Em outro idioma", "Estados", "Anatomia", "Na tela", "Como funciona", "Quando usar"]}
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
            o item; a tela grava. Com <Chip>aoEditarColuna</Chip>, o título vira botão; com <Chip>aoAdicionar</Chip>,
            o pé ganha o botão; com <Chip>aoCriarColuna</Chip>, o fim do trilho ganha o +.
          </>
        }
      >
        <Exemplo />
      </Secao>

      <Secao
        titulo="Colunas e cores"
        spec="neutro + 14 tons · cabeçalho de 24"
        descricao="Sete colunas, uma por cor: a neutra e seis dos catorze tons do DS. A cor pinta três coisas da mesma variável — o painel no degrau mais claro (tom-anel), a bolinha e o título no degrau que se lê (tom-texto). O cabeçalho é uma linha de 24: bolinha, título, contagem e o resumo à direita."
        codigo={codigoDasCores}
        novidade="2026-10-08"
        nota={
          <>
            <Chip>cor</Chip> aceita os catorze tons de <Chip>lib/tons.ts</Chip> — os mesmos da Tag e do perfil do
            Drawer — ou <Chip>neutro</Chip>, que é <Chip>background</Chip>, um degrau mais escuro que o{" "}
            <Chip>muted</Chip> do fundo da tela. <Chip>resumo</Chip> chega formatado (a soma em moeda, uma contagem):
            o quadro não conhece moeda. <Chip>descricao</Chip> vai no tooltip do título, antes do convite para
            editar.
          </>
        }
      >
        <Exemplo inicial={CORES} altura="h-[300px]" comColunas={false} />
      </Secao>

      <Secao
        titulo="O cartão"
        spec="4 blocos · recuo 8 · vão 6"
        descricao="Quem é (avatar de 20 e título em h4), quanto vale e os sinais do canto, as linhas de detalhe com o ícone do campo, e o pé com as tags. Cada bloco só aparece quando tem o que mostrar: o terceiro cartão é só título e valor; o quarto tem foto no lugar das iniciais."
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
              { icone: UserCircle, rotulo: "Contato", valor: "Paulo Horizonte · Diretor" },
              { icone: EnvelopeSimple, rotulo: "E-mail", valor: "paulo@horizonte.eng.br" },
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
          <QuadroCartao
            className="w-64"
            titulo="Esther Lima"
            avatar={{ nome: "Esther Lima", src: "/ds/atendente.png" }}
            valor="R$ 2.300"
            detalhes={[{ icone: Buildings, rotulo: "Empresa", valor: "Lima Estética · Joinville" }]}
          />
        </div>
        <Legenda>
          O título corta com reticências e guarda o nome inteiro no <Chip>title</Chip>; o detalhe também. O avatar é
          o <Chip>Avatar</Chip> de 20 com duas iniciais na cor que o nome sorteia — a mesma pessoa tem sempre a
          mesma cor, aqui e na lista; com <Chip>src</Chip>, a foto.
        </Legenda>
      </Secao>

      <Secao
        titulo="Pelo teclado"
        spec="Tab · Espaço · setas · Enter · Esc · aria-live"
        descricao="Dê Tab até um cartão e aperte Espaço: ele fica pego (sombra e contorno azul) e cada passo é anunciado. As setas para os lados trocam de coluna, para cima e para baixo mudam a posição, Enter solta, Esc devolve. Enter num cartão solto abre; o foco volta ao cartão depois de soltar."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="Tab">anda cartão a cartão; o cartão é um botão com papel próprio (<Chip>rotulos.cartao</Chip>)</Item>
              <Item mono="Enter">abre o cartão (<Chip>aoAbrir</Chip>)</Item>
              <Item mono="Espaço">pega o cartão: anuncia <Chip>rotulos.pego</Chip></Item>
              <Item mono="← →">trocam de coluna; a coluna escolhida rola até ficar à vista; anuncia <Chip>colunaEscolhida</Chip></Item>
              <Item mono="↑ ↓">mudam a posição na coluna; anuncia <Chip>posicao</Chip></Item>
              <Item mono="Enter · Espaço">soltam: <Chip>aoMover</Chip> e o anúncio <Chip>movido</Chip>; o foco volta ao cartão</Item>
              <Item mono="Esc">cancela: <Chip>cancelado</Chip></Item>
            </ul>
            <p className="mt-2.5">
              Arrastar com o mouse não é acessível sozinho (WCAG 2.5.7): o teclado faz o mesmo movimento, e o alvo —
              a linha azul — é o mesmo para os dois. As instruções estão em <Chip>aria-describedby</Chip> do cartão;
              os anúncios caem numa região <Chip>aria-live=&quot;polite&quot;</Chip>.
            </p>
          </>
        }
      >
        <Exemplo inicial={[COLUNAS[1], COLUNAS[2]]} altura="h-[420px]" comColunas={false} />
      </Secao>

      <Secao
        titulo="Trilho que rola"
        spec="8 colunas · setas de 36 · uma coluna por clique"
        descricao="Oito colunas não cabem: o trilho rola e as setas nas bordas aparecem — cada clique anda exatamente uma coluna (a largura dela, hoje, mais o vão). Role com a roda, ou arraste o fundo como no Trello. A seta some na ponta, para não prometer coluna que não há."
        novidade="2026-10-08"
        nota={
          <>
            As setas são botões de 36px com <Chip>shadow-float</Chip>, fora do fluxo, e saem do Tab quando estão
            escondidas. O cálculo de qual seta mostrar roda num <Chip>ResizeObserver</Chip> e na rolagem: mover um
            cartão pode encurtar o trilho. Ao mover pelo teclado, a coluna escolhida entra à vista sozinha (
            <Chip>scrollIntoView</Chip>), senão o cartão &quot;sumiria&quot; ao soltar.
          </>
        }
      >
        <Exemplo inicial={TRILHO} altura="h-[300px]" comColunas={false} />
      </Secao>

      <Secao
        titulo="Em outro idioma"
        spec="rotulos · 15 textos · fábrica pt-BR"
        descricao="Nada está escrito dentro do componente: o botão do pé, o + do trilho, a coluna vazia, as setas e todos os anúncios do teclado vêm de rotulos. Aqui em espanhol; no CRM, do next-intl. O que a tela não passar sai da fábrica ROTULOS_DO_QUADRO, em português."
        codigo={codigoDosRotulos}
        novidade="2026-10-08"
        nota={
          <>
            Os textos de função (<Chip>pego</Chip>, <Chip>movido</Chip>, <Chip>resumo</Chip>…) recebem o nome do
            cartão, a coluna e a posição e montam a frase no idioma — a ordem das palavras muda de língua para
            língua, por isso não são moldes com buracos. A fábrica tem {Object.keys(ROTULOS_DO_QUADRO).length} textos.
          </>
        }
      >
        <ExemploEmEspanhol />
      </Secao>

      <Secao
        titulo="Estados"
        spec="8 estados · nada simulado"
        descricao="Repouso, sob o cursor, em foco, em arrasto, pego pelo teclado, a linha de destino, a coluna vazia e a chegada. Tudo aqui está vivo: passe o mouse, dê Tab, arraste um cartão da esquerda para a coluna vazia."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="repouso">cartão com traço <Chip>border</Chip> sobre <Chip>card</Chip>; sem sombra</Item>
              <Item mono="hover">o traço escurece (<Chip>input-border-hover</Chip>) e o cartão levanta com <Chip>shadow-sm</Chip>; o título da coluna fica <Chip>primary</Chip></Item>
              <Item mono="focus-visible">o anel de 2px com respiro (D6) no cartão, no título da coluna, nos botões e nas setas</Item>
              <Item mono="em arrasto">o cartão de origem fica a 40% enquanto o mouse o leva; a coluna sob ele fica <Chip>accent</Chip></Item>
              <Item mono="pego pelo teclado">
                <Chip>shadow-lg</Chip> e contorno de 2px <Chip>primary</Chip>, até soltar ou cancelar
              </Item>
              <Item mono="linha de destino">4px em <Chip>primary</Chip>, entre dois cartões ou no fim da coluna</Item>
              <Item mono="coluna vazia">caixa tracejada com o texto <Chip>rotulos.vazio</Chip>; some enquanto a coluna é alvo</Item>
              <Item mono="chegando">o cartão entra subindo 4px (<Chip>animate-surgir</Chip>, ADR-068); com redução de movimento, não</Item>
            </ul>
            <p className="mt-2.5">
              Não há seleção nem cartão &quot;ativo&quot;: o quadro mostra e devolve; o registro aberto é o Drawer da
              tela. Ausência é decisão, não buraco a preencher.
            </p>
          </>
        }
      >
        <Exemplo
          inicial={[
            { ...COLUNAS[2], itens: COLUNAS[2].itens.slice(0, 2) },
            { id: "vazia", rotulo: "Negociação", descricao: "Sem cartão", cor: "roxo", resumo: "R$ 0", itens: [] },
          ]}
          altura="h-[360px]"
          comColunas={false}
        />
      </Secao>

      <Secao titulo="Anatomia" spec="8 partes" semCaixa novidade="2026-10-08">
        <div className="divide-y divide-border rounded-lg border border-border">
          {anatomia.map((p) => (
            <div key={p.nome} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4">
              <div>
                <p className="text-h4 text-foreground">{p.nome}</p>
                <p className="mt-1 font-mono text-label-md text-subtle-foreground">{p.medida}</p>
              </div>
              <p className="text-body-lg text-muted-foreground">{p.papel}</p>
            </div>
          ))}
        </div>
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

      <Secao titulo="Quando usar" descricao="Quadro responde “em que etapa está”; a lista responde “quais”; o Calendário responde “quando”.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> para mover registros entre estágios de um fluxo — o funil de
            vendas, uma fila de atendimento, uma seleção de candidatos — quando a pergunta é &quot;em que etapa
            está&quot;.
          </li>
          <li>
            <span className="text-foreground">Use</span> com <Chip>QuadroCartao</Chip> dentro de{" "}
            <Chip>renderizar</Chip>: é a única casca de cartão do quadro; a tela só escolhe o que vai em cada bloco.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para ver muitos registros com várias colunas de dados: é
            a Table densa, com ícone por coluna.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para um catálogo em cartões que não se arrastam
            (agentes, modelos): é o Cartão de catálogo numa grade.
          </li>
          <li>
            <span className="text-foreground">Não use</span> com mais de ~8 colunas ou ~30 cartões por coluna: a
            resposta é a lista, filtrada pela etapa.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
