"use client";

import * as React from "react";
import Link from "next/link";
import { Globe } from "@phosphor-icons/react";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { ListaDeConversas, type ItemDeConversa } from "@/components/ui/lista-de-conversas";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { foco } from "@/lib/estados";
import { cn } from "@/lib/utils";

/* Conversas de exemplo. No CRM vêm da API, já filtradas pela busca e pelos
   filtros do Header; o ícone do canal é o `IconeDeMarca` (marca) ou um
   glifo Phosphor (o que não é marca). */
const ABAS = [
  { valor: "aberta", rotulo: "Abertas" },
  { valor: "pendente", rotulo: "Pendentes" },
  { valor: "finalizada", rotulo: "Finalizadas" },
];

const CANAL = {
  whatsapp: <IconeDeMarca marca="whatsapp" tamanho={14} rotulo="WhatsApp" />,
  instagram: <IconeDeMarca marca="instagram" tamanho={14} rotulo="Instagram" />,
  site: <Globe size={14} weight="regular" role="img" aria-label="Site" className="shrink-0 text-muted-foreground" />,
};

type Linha = ItemDeConversa & { situacao: string };

const CONVERSAS: Linha[] = [
  { id: "c1", nome: "Marina Alvarenga", canal: CANAL.whatsapp, previa: "E dá para migrar os contatos que já tenho na planilha?", hora: "09:13", naoLidas: 2, situacao: "aberta" },
  { id: "c2", nome: "Construtora Horizonte", canal: CANAL.site, previa: "Você: Posso agendar uma demonstração com o time técnico?", hora: "08:46", situacao: "aberta" },
  { id: "c3", nome: "Rafael Pinto", canal: CANAL.whatsapp, previa: "Boa tarde, fui indicado pelo Dr. Henrique. Vocês têm automação de mensagem para prazo processual?", hora: "13:05", naoLidas: 1, situacao: "aberta" },
  { id: "c4", nome: "Camila Ferraz", canal: CANAL.instagram, previa: "E se tem teste grátis", hora: "12:49", naoLidas: 12, situacao: "aberta" },
  { id: "c5", nome: "Júlia Bastos", canal: CANAL.instagram, previa: "Você: Posso te ligar para entender o volume de mensagens?", hora: "Ontem", situacao: "pendente" },
  { id: "c6", nome: "Pedro Nakamura", canal: CANAL.whatsapp, previa: "Você: Pedro, conseguiu ver a proposta que enviei na semana passada?", hora: "20/09", situacao: "pendente" },
];

const codigoLista = `const [aba, setAba] = useState("aberta");
const [abertaId, setAbertaId] = useState<string | null>("c1");

<ListaDeConversas
  abas={[
    { valor: "aberta", rotulo: "Abertas", contagem: contagem.aberta },
    { valor: "pendente", rotulo: "Pendentes", contagem: contagem.pendente },
    { valor: "finalizada", rotulo: "Finalizadas", contagem: contagem.finalizada },
  ]}
  aba={aba}
  aoMudarAba={setAba}
  itens={conversas
    .filter((c) => c.situacao === aba)
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      canal: <IconeDeMarca marca="whatsapp" tamanho={14} rotulo="WhatsApp" />,
      previa: c.ultimaMensagem,
      hora: c.hora,
      naoLidas: c.naoLidas,
    }))}
  abertaId={abertaId}
  aoAbrir={setAbertaId}
  className="w-full md:w-[320px]"
/>`;

const codigoContador = `<ListaDeConversas
  abas={[{ valor: "aberta", rotulo: "Abertas", contagem: 3 }]}
  aba="aberta"
  aoMudarAba={setAba}
  itens={[
    { id: "c1", nome: "Marina Alvarenga", canal: <IconeDeMarca marca="whatsapp" tamanho={14} rotulo="WhatsApp" />, previa: "E dá para migrar os contatos?", hora: "09:13", naoLidas: 2 },
    { id: "c4", nome: "Camila Ferraz", canal: <IconeDeMarca marca="instagram" tamanho={14} rotulo="Instagram" />, previa: "E se tem teste grátis", hora: "12:49", naoLidas: 12 },
    { id: "c2", nome: "Construtora Horizonte", canal: <Globe size={14} weight="regular" role="img" aria-label="Site" />, previa: "Você: Posso agendar uma demonstração?", hora: "08:46" },
  ]}
  abertaId={null}
  aoAbrir={abrir}
  rotulos={{ naoLidas: (n) => \`\${n} não lidas\` }}
/>`;

const codigoNaTela = `// A tela filtra pela busca e pelos filtros do Header, conta por situação e entrega a aba atual.
const contagem = { aberta: 0, pendente: 0, finalizada: 0 };
for (const c of filtradas) contagem[c.situacao]++;

<ListaDeConversas
  abas={ABAS.map((a) => ({ ...a, contagem: contagem[a.valor] }))}
  aba={aba}
  aoMudarAba={setAba}
  itens={filtradas.filter((c) => c.situacao === aba).map(linha)}
  abertaId={abertaId}
  aoAbrir={abrir}
  className={cn("w-full shrink-0 md:w-[320px]", naConversa && "hidden md:flex")}
/>`;

/** A lista viva: troque de aba, abra uma conversa (as não lidas zeram), veja a aba vazia. */
function Exemplo() {
  const [conversas, setConversas] = React.useState(CONVERSAS);
  const [aba, setAba] = React.useState("aberta");
  const [abertaId, setAbertaId] = React.useState<string | null>("c1");
  const contagem: Record<string, number> = {};
  for (const c of conversas) contagem[c.situacao] = (contagem[c.situacao] ?? 0) + 1;
  const aberta = conversas.find((c) => c.id === abertaId);

  function abrir(id: string) {
    setAbertaId(id);
    // abrir lê: o contador some
    setConversas((cs) => cs.map((c) => (c.id === id ? { ...c, naoLidas: 0 } : c)));
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex h-[360px] w-full max-w-[320px]">
        <ListaDeConversas
          abas={ABAS.map((a) => ({ ...a, contagem: contagem[a.valor] }))}
          aba={aba}
          aoMudarAba={setAba}
          itens={conversas.filter((c) => c.situacao === aba)}
          abertaId={abertaId}
          aoAbrir={abrir}
          className="w-full"
        />
      </div>
      {/* o que a lista devolve — na tela, a conversa abre na coluna do meio */}
      <p aria-live="polite" className="text-body-md text-muted-foreground">
        {aberta ? (
          <>
            <span className="text-h4 text-foreground">{aberta.nome}</span> aberta. Na tela, a conversa aparece na coluna do
            meio e o lead, na terceira.
          </>
        ) : (
          "Clique numa conversa para ver o que a lista devolve."
        )}
      </p>
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Lista de conversas"
      novidade="2026-10-07"
      descricao="A coluna de conversas do atendimento: abas de situação com a contagem ao lado e uma linha de 50px por conversa — avatar de 32, nome, hora, o ícone do canal em 14px, a última coisa dita e o contador de não lidas em 16px. Uma superfície só, com traço entre as linhas; a aberta fica em accent."
      secoes={["Como funciona", "Abas e linhas", "Não lidas e canal", "Na tela"]}
    >
      <ComoFunciona>
        <p>
          Nasceu da tela de Atendimento e virou componente a pedido do cliente (reunião de 02/10). Não conhece o
          domínio: recebe <Chip>abas</Chip> (valor, rótulo e a contagem) e <Chip>itens</Chip> já prontos — a prévia como
          a lista mostra (&quot;Você: …&quot;), a hora ou o dia, o ícone do canal — e devolve o id clicado em{" "}
          <Chip>aoAbrir</Chip>. Quem filtra pela busca, pelos filtros do Header e pela aba é a tela; a lista mostra o
          que recebe, na ordem em que recebe.
        </p>
        <p>
          A linha inteira é um botão com o foco por dentro (<Chip>focoInterno</Chip>): as linhas são coladas e o
          contorno de fora pisaria na vizinha. A aberta ganha <Chip>accent</Chip>, o nome em <Chip>primary</Chip> e{" "}
          <Chip>aria-current</Chip>; com não lidas, a prévia escurece e o contador aparece. As abas são o{" "}
          <Chip>Tabs</Chip> do DS: setas trocam, e a contagem entra no rótulo (&quot;Abertas · 5&quot;).
        </p>
        <p>
          A armadilha é a largura: o componente não tem uma. Na tela ele mede 320px de 768 para cima e a tela toda
          abaixo disso (a lista OU a conversa) — passe a largura em <Chip>className</Chip>, senão a coluna estica.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Abas e linhas"
        spec="3 abas · 50px por linha"
        descricao="Troque de aba pelas setas ou pelo clique; abra uma conversa e o contador dela some. Finalizadas está vazia de propósito: é a frase vazio no lugar da lista, sem ilustração."
        codigo={codigoLista}
        nota={
          <>
            <Chip>contagem</Chip> em cada aba é quantas conversas há nela, já com busca e filtros aplicados — zero
            não aparece. A lista rola por dentro com a barra discreta do DS; a altura vem de fora (360px aqui).
          </>
        }
      >
        <Exemplo />
      </Secao>

      <Secao
        titulo="Não lidas e canal"
        spec="contador 16px · canal 14px"
        descricao="Com não lidas, a prévia passa de muted-foreground a foreground e o contador em primary aparece: 16px de altura, cresce com o número. O canal é o ícone já pronto — IconeDeMarca para WhatsApp e Instagram, um glifo Phosphor para o site. Prévia longa trunca com tooltip."
        codigo={codigoContador}
        nota={
          <>
            O contador tem nome para o leitor de tela (<Chip>rotulos.naoLidas</Chip>); o ícone do canal leva o nome
            do canal (<Chip>rotulo</Chip> do IconeDeMarca), porque aparece sem o texto ao lado.
          </>
        }
      >
        <div className="flex w-full max-w-[320px]">
          <ListaDeConversas
            abas={[{ valor: "aberta", rotulo: "Abertas", contagem: 3 }]}
            aba="aberta"
            aoMudarAba={() => undefined}
            itens={[CONVERSAS[0], CONVERSAS[3], CONVERSAS[2], CONVERSAS[1]]}
            abertaId={null}
            aoAbrir={() => undefined}
            className="w-full"
          />
        </div>
      </Secao>

      <Secao
        titulo="Na tela"
        spec="/prototipo?tela=atendimento"
        descricao="A coluna da esquerda do Atendimento: a tela aplica a busca e os filtros do Header, conta por situação e entrega só a aba atual. Abaixo de 768px a lista é a tela inteira e some quando a conversa abre."
        codigo={codigoNaTela}
        semSeletorDeFundo
      >
        <Legenda>
          Veja no{" "}
          <Link href="/prototipo?tela=atendimento" className={cn("rounded-sm text-foreground underline-offset-2 hover:underline", foco)}>
            protótipo, tela de Atendimento
          </Link>
          : a conversa aberta é a <Chip>Conversa</Chip>, na coluna do meio.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
