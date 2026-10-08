"use client";

import * as React from "react";
import Link from "next/link";
import { Globe } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { ListaDeConversas, ROTULOS_DA_LISTA_DE_CONVERSAS, type ItemDeConversa } from "@/components/ui/lista-de-conversas";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

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
  { nome: "Região", medida: "section · bg-card · rounded-md · border", papel: "Uma superfície só, nomeada por rotulos.regiao. No celular ocupa a tela, sem traço nem raio. A largura vem de fora: 320px na tela de 768 para cima." },
  { nome: "Abas", medida: "Tabs · border-b · px-3", papel: "As situações (Abertas, Pendentes, Finalizadas) com a contagem no rótulo. São o Tabs do DS: setas trocam, a fileira rola se não couber." },
  { nome: "Linha", medida: "50px · px-3 · py-2 · gap-2 · border-b", papel: "Um botão com a linha inteira como alvo e o foco por dentro (focoInterno): as linhas são coladas e o contorno de fora pisaria na vizinha." },
  { nome: "Avatar", medida: "32 · iniciais ou foto", papel: "O Avatar sm com a inicial na cor do nome; com avatar na linha, a foto." },
  { nome: "Nome e hora", medida: "label-lg · caption tabular", papel: "O nome corta com reticências (title com o inteiro); a hora ou o dia à direita, em números tabulares para alinhar." },
  { nome: "Canal e prévia", medida: "ícone 14 · body-sm", papel: "O ícone do canal já pronto, com nome para o leitor de tela, e a última coisa dita — em muted-foreground, ou foreground quando há não lidas. Trunca com tooltip." },
  { nome: "Contador", medida: "h-4 · min-w-4 · rounded-full · primary · label-sm", papel: "Quantas não lidas, nomeado por rotulos.naoLidas. Cresce com o número; some quando é zero." },
  { nome: "Vazio", medida: "p-4 · body-sm · muted-foreground", papel: "A frase rotulos.vazio no lugar da lista, sem ilustração." },
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

const codigoFoto = `// com foto no contato: avatar na linha; sem, a inicial na cor do nome
itens={conversas.map((c) => ({ id: c.id, nome: c.nome, avatar: c.foto, canal: iconeDoCanal(c.canal), previa: c.previa, hora: c.hora }))}`;

const codigoVazia = `// aba sem conversa: a frase de rotulos.vazio no lugar da lista
<ListaDeConversas
  abas={[{ valor: "finalizada", rotulo: "Finalizadas" }]}
  aba="finalizada"
  aoMudarAba={setAba}
  itens={[]}
  abertaId={null}
  aoAbrir={abrir}
  rotulos={{ vazio: "Nenhuma conversa finalizada hoje." }}
/>`;

const codigoRotulos = `<ListaDeConversas
  abas={[
    { valor: "abierta", rotulo: "Abiertas", contagem: 2 },
    { valor: "pendiente", rotulo: "Pendientes", contagem: 1 },
  ]}
  aba="abierta"
  aoMudarAba={setAba}
  itens={itens}
  abertaId={abertaId}
  aoAbrir={abrir}
  rotulos={{
    regiao: "Conversaciones",
    abas: "Estado de las conversaciones",
    vazio: "Ninguna conversación aquí.",
    naoLidas: (n) => \`\${n} sin leer\`,
  }}
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
      secoes={["Abas e linhas", "Não lidas e canal", "Com foto", "Vazia", "Em outro idioma", "Estados", "Anatomia", "Na tela", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="Abas e linhas"
        spec="3 abas · 50px por linha"
        descricao="Troque de aba pelas setas ou pelo clique; abra uma conversa e o contador dela some. Finalizadas está vazia de propósito: é a frase vazio no lugar da lista, sem ilustração."
        codigo={codigoLista}
        novidade="2026-10-07"
        nota={
          <>
            <Chip>contagem</Chip> em cada aba é quantas conversas há nela, já com busca e filtros aplicados — zero
            não aparece. A lista rola por dentro com a barra discreta do DS; a altura vem de fora (360px aqui). A
            ordem é a ordem em que os itens chegam: quem ordena (por hora, por não lida) é a tela.
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
        novidade="2026-10-07"
        nota={
          <>
            O contador tem nome para o leitor de tela (<Chip>rotulos.naoLidas</Chip>); o ícone do canal leva o nome
            do canal (<Chip>rotulo</Chip> do IconeDeMarca), porque aparece sem o texto ao lado. A prévia &quot;Você:
            …&quot; é a tela que monta: a lista mostra o texto que recebe.
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
        titulo="Com foto"
        spec="avatar · 32px"
        descricao="Quando o contato tem foto, ela entra no lugar da inicial — o mesmo Avatar de 32 da Table e do cabeçalho da Conversa. Sem foto, a inicial na cor que o nome sorteia: a mesma pessoa tem a mesma cor em toda tela."
        codigo={codigoFoto}
        novidade="2026-10-08"
      >
        <div className="flex w-full max-w-[320px]">
          <ListaDeConversas
            abas={[{ valor: "aberta", rotulo: "Abertas", contagem: 3 }]}
            aba="aberta"
            aoMudarAba={() => undefined}
            itens={[
              { ...CONVERSAS[0], avatar: "/ds/atendente.png" },
              CONVERSAS[2],
              { ...CONVERSAS[3], avatar: "/ds/atendente.png", naoLidas: 0 },
            ]}
            abertaId="c3"
            aoAbrir={() => undefined}
            className="w-full"
          />
        </div>
        <Legenda>
          A segunda linha está aberta (<Chip>abertaId</Chip>): fundo <Chip>accent</Chip>, nome em <Chip>primary</Chip>{" "}
          e <Chip>aria-current</Chip>. Passe o cursor nas outras para ver o <Chip>muted</Chip> do hover.
        </Legenda>
      </Secao>

      <Secao
        titulo="Vazia"
        spec="rotulos.vazio · p-4 · body-sm"
        descricao="Aba sem conversa: a frase no lugar da lista, em muted-foreground, sem ilustração nem botão. Quem decide a frase é a tela — pode dizer por que está vazia (a busca, o filtro, o dia)."
        codigo={codigoVazia}
        novidade="2026-10-08"
      >
        <div className="flex h-[160px] w-full max-w-[320px]">
          <ListaDeConversas
            abas={[{ valor: "finalizada", rotulo: "Finalizadas" }]}
            aba="finalizada"
            aoMudarAba={() => undefined}
            itens={[]}
            abertaId={null}
            aoAbrir={() => undefined}
            rotulos={{ vazio: "Nenhuma conversa finalizada hoje." }}
            className="w-full"
          />
        </div>
      </Secao>

      <Secao
        titulo="Em outro idioma"
        spec="rotulos · 4 textos · fábrica pt-BR"
        descricao="O nome da região, o nome do grupo de abas, a frase do vazio e o nome do contador vêm de rotulos. As abas e as prévias são conteúdo: a tela as escreve no idioma de quem lê."
        codigo={codigoRotulos}
        novidade="2026-10-08"
        nota={
          <>
            A fábrica <Chip>ROTULOS_DA_LISTA_DE_CONVERSAS</Chip> tem {Object.keys(ROTULOS_DA_LISTA_DE_CONVERSAS).length}{" "}
            textos; <Chip>naoLidas</Chip> é função porque singular e plural mudam de língua para língua.
          </>
        }
      >
        <div className="flex h-[240px] w-full max-w-[320px]">
          <ListaDeConversas
            abas={[
              { valor: "abierta", rotulo: "Abiertas", contagem: 2 },
              { valor: "pendiente", rotulo: "Pendientes", contagem: 1 },
            ]}
            aba="abierta"
            aoMudarAba={() => undefined}
            itens={[
              { id: "e1", nome: "Lucía Fernández", canal: CANAL.whatsapp, previa: "¿El plan incluye las tres sucursales?", hora: "09:13", naoLidas: 1 },
              { id: "e2", nome: "Mateo Rojas", canal: CANAL.instagram, previa: "Tú: Te envío la propuesta hoy.", hora: "Ayer" },
            ]}
            abertaId="e2"
            aoAbrir={() => undefined}
            rotulos={{ regiao: "Conversaciones", abas: "Estado de las conversaciones", vazio: "Ninguna conversación aquí.", naoLidas: (n) => `${n} sin leer` }}
            className="w-full"
          />
        </div>
      </Secao>

      <Secao
        titulo="Estados"
        spec="5 estados · nada simulado"
        descricao="Repouso, sob o cursor, em foco, aberta e com não lidas — e a aba vazia. Tudo está vivo nas seções acima: passe o mouse, dê Tab, clique."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="repouso">linha sobre <Chip>card</Chip>, traço <Chip>border</Chip> embaixo; nome em <Chip>foreground</Chip></Item>
              <Item mono="hover">a linha fica <Chip>muted</Chip></Item>
              <Item mono="focus-visible">o anel de 2px por dentro (<Chip>focoInterno</Chip>): as linhas são coladas e o de fora pisaria na vizinha</Item>
              <Item mono="aberta">fundo <Chip>accent</Chip>, nome em <Chip>primary</Chip>, <Chip>aria-current</Chip></Item>
              <Item mono="não lidas">prévia em <Chip>foreground</Chip> e o contador <Chip>primary</Chip> de 16px</Item>
              <Item mono="vazia">a frase de <Chip>rotulos.vazio</Chip> no lugar da lista</Item>
            </ul>
            <p className="mt-2.5">Não há seleção múltipla nem arrastar: a lista mostra e devolve o id. Ausência é decisão.</p>
          </>
        }
      >
        <div className="flex w-full max-w-[320px]">
          <ListaDeConversas
            abas={[{ valor: "aberta", rotulo: "Abertas", contagem: 3 }]}
            aba="aberta"
            aoMudarAba={() => undefined}
            itens={[CONVERSAS[0], CONVERSAS[1], CONVERSAS[3]]}
            abertaId="c2"
            aoAbrir={() => undefined}
            className="w-full"
          />
        </div>
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
        spec="/prototipo?tela=atendimento"
        descricao="A coluna da esquerda do Atendimento: a tela aplica a busca e os filtros do Header, conta por situação e entrega só a aba atual. Abaixo de 768px a lista é a tela inteira e some quando a conversa abre."
        codigo={codigoNaTela}
        semSeletorDeFundo
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            Na tela, a conversa aberta é a <Chip>Conversa</Chip>, na coluna do meio, e o lead abre na terceira.
          </p>
          <Button asChild variant="secondary">
            <Link href="/prototipo?tela=atendimento">Abrir o Atendimento no protótipo</Link>
          </Button>
        </div>
      </Secao>

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
          A outra é o contador: ele mostra o número que recebe; zerar ao abrir é decisão da tela.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Lista de conversas responde “com quem estou falando”; a Table responde “quais registros”.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> para a coluna de conversas de um chat: a tela filtra e
            ordena, o componente mostra e devolve o id.
          </li>
          <li>
            <span className="text-foreground">Use</span> <Chip>contagem</Chip> em cada aba para dizer quantas conversas
            há nela, já com busca e filtros aplicados.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para a conversa aberta: é a Conversa.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para lista de registros com colunas (leads, negócios): é
            a Table.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para busca e filtros dentro da coluna: ficam no Header da
            tela (HeaderBusca, HeaderFiltros, BarraDeFiltros).
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
