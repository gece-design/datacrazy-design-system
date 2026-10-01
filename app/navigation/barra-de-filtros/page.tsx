"use client";

import { useState } from "react";
import { FunnelSimple, Globe, Handshake, Headset, ShareNetwork, Tag as IconeDeTag, WarningCircle } from "@phosphor-icons/react";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { BarraDeFiltros, contarFiltros, type CampoDeFiltro, type FiltrosAtivos } from "@/components/ui/barra-de-filtros";
import { HeaderFiltros } from "@/components/ui/header";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { Tag } from "@/components/ui/tag";

const campos: CampoDeFiltro[] = [
  {
    id: "etapa",
    rotulo: "Etapa",
    icone: FunnelSimple,
    opcoes: ["Novo lead", "Qualificação", "Proposta", "Negociação", "Fechamento"].map((e) => ({ valor: e, rotulo: e })),
  },
  {
    id: "atendente",
    rotulo: "Atendente",
    icone: Headset,
    opcoes: ["Breno Ramos", "Esther Lima", "Junior Santos", "Liam Costa", "Marina Prado", "Millena Aragão"].map((a) => ({
      valor: a,
      rotulo: a,
    })),
  },
  {
    id: "origem",
    rotulo: "Origem",
    icone: ShareNetwork,
    opcoes: [
      { valor: "whatsapp", rotulo: "WhatsApp", grupo: "Redes sociais", icone: <IconeDeMarca marca="whatsapp" /> },
      { valor: "instagram", rotulo: "Instagram", grupo: "Redes sociais", icone: <IconeDeMarca marca="instagram" /> },
      { valor: "google", rotulo: "Google", grupo: "Redes sociais", icone: <IconeDeMarca marca="google" /> },
      { valor: "linkedin", rotulo: "LinkedIn", grupo: "Redes sociais", icone: <IconeDeMarca marca="linkedin" /> },
      { valor: "site", rotulo: "Site", grupo: "Outras", icone: <Globe size={16} weight="regular" aria-hidden="true" /> },
      { valor: "indicacao", rotulo: "Indicação", grupo: "Outras", icone: <Handshake size={16} weight="regular" aria-hidden="true" /> },
    ],
  },
  {
    id: "tags",
    rotulo: "Tags",
    icone: IconeDeTag,
    opcoes: [
      { valor: "quente", rotulo: "Quente", grupo: "Temperatura", conteudo: <Tag status="destructive">Quente</Tag> },
      { valor: "warm", rotulo: "Warm", grupo: "Temperatura", conteudo: <Tag>Warm</Tag> },
      { valor: "frio", rotulo: "Frio", grupo: "Temperatura", conteudo: <Tag>Frio</Tag> },
      { valor: "agendado", rotulo: "Agendado", grupo: "Status", conteudo: <Tag status="success">Agendado</Tag> },
      { valor: "sem-retorno", rotulo: "Sem retorno", grupo: "Status", conteudo: <Tag status="destructive">Sem retorno</Tag> },
      { valor: "saude", rotulo: "Saúde", grupo: "Segmento", conteudo: <Tag>Saúde</Tag> },
      { valor: "educacao", rotulo: "Educação", grupo: "Segmento", conteudo: <Tag>Educação</Tag> },
    ],
  },
  {
    id: "situacao",
    rotulo: "Situação",
    icone: WarningCircle,
    unico: true,
    opcoes: [
      { valor: "parados", rotulo: "Parados há 7 dias ou mais" },
      { valor: "novos", rotulo: "Entraram nesta semana" },
      { valor: "sem-tag", rotulo: "Sem nenhuma tag" },
    ],
  },
];

const rotulos = {
  adicionar: "Filtro",
  limpar: "Limpar",
  busca: "Buscar",
  vazio: "Nada encontrado",
  remover: (campo: string) => `Remover filtro ${campo}`,
};

const codigoBarra = `// cada campo é um CampoDeFiltro: id, rotulo, icone, opcoes e, se aceita um valor só, unico
const campos = [
  { id: "etapa", rotulo: "Etapa", icone: FunnelSimple, opcoes: etapas },
  { id: "atendente", rotulo: "Atendente", icone: Headset, opcoes: atendentes },
  { id: "origem", rotulo: "Origem", icone: ShareNetwork, opcoes: origens },
  { id: "situacao", rotulo: "Situação", icone: WarningCircle, opcoes: situacoes, unico: true },
];
const [filtros, setFiltros] = useState<FiltrosAtivos>({});

<BarraDeFiltros
  aria-label="Filtros"
  campos={campos}
  valor={filtros}
  aoMudar={setFiltros}
  rotulos={{
    adicionar: "Filtro",
    limpar: "Limpar",
    busca: "Buscar",
    vazio: "Nada encontrado",
    remover: (campo) => \`Remover filtro \${campo}\`,
  }}
/>`;

const codigoHeader = `const [barraAberta, setBarraAberta] = useState(false);

<HeaderFiltros
  rotulo="Filtros"
  contagem={contarFiltros(filtros)}
  rotuloComContagem={(n) => \`Filtros: \${n} ativos\`}
  aria-expanded={barraAberta}
  onClick={() => setBarraAberta((v) => !v)}
/>

{barraAberta ? (
  <BarraDeFiltros abrirAoMontar aria-label="Filtros" campos={campos} valor={filtros} aoMudar={setFiltros} rotulos={rotulos} />
) : null}`;

export default function BarraDeFiltrosPage() {
  const [filtros, setFiltros] = useState<FiltrosAtivos>({ etapa: ["Proposta", "Negociação"], origem: ["whatsapp"] });
  const [doHeader, setDoHeader] = useState<FiltrosAtivos>({});
  const [barraAberta, setBarraAberta] = useState(false);

  return (
    <PaginaDS
      titulo="Filtros"
      descricao="A barra de filtros: cada filtro ativo é um chip de 28px com o campo e o que ele filtra, e o “+ Filtro” lista os campos que ainda não entraram. Só o que está ativo ocupa espaço, cada campo abre a própria lista com busca, e tudo vale na hora."
      secoes={["Como funciona", "A barra", "Com o botão do Header"]}
    >
      <ComoFunciona>
        <p>
          A tela declara os campos (<Chip>campos</Chip>) e guarda o que está escolhido (<Chip>valor</Chip>, um objeto
          campo → valores). A barra faz o resto: mostra um chip por campo ativo, abre a lista de cada um — a mesma do{" "}
          <Chip>Combobox</Chip>, com busca, grupos e ícones — e oferece no <Chip>+ Filtro</Chip> os campos que ainda
          não entraram.
        </p>
        <p>
          Campo de vários valores tem caixa de marcar e a lista fica aberta; campo <Chip>unico</Chip> troca e fecha.
          É essa a hierarquia que um modal com caixas empilhadas não dá: dentro do mesmo campo os valores somam
          (Proposta <em>ou</em> Negociação), entre campos cortam (Etapa <em>e</em> Origem).
        </p>
        <p>
          A armadilha: chip sem valor não existe. Quem abre um campo e fecha sem escolher nada não deixa um chip vazio
          para trás — filtro vazio não filtra, então some.
        </p>
      </ComoFunciona>

      <Secao
        titulo="A barra"
        spec="chip 28px · soft"
        descricao="Dois filtros ativos e três campos por adicionar. Clique no chip para mudar os valores, no X para tirar o filtro, e no + Filtro para trazer outro campo."
        codigo={codigoBarra}
        nota={
          <>
            O chip é o Button <Chip>soft</Chip>, o mesmo sinal de &quot;filtro ativo&quot; do botão de filtros do
            Header. Um ou dois valores aparecem por extenso; a partir do terceiro, o primeiro e quantos mais.
          </>
        }
      >
        <div className="rounded-md bg-card p-4">
          <BarraDeFiltros aria-label="Filtros" campos={campos} valor={filtros} aoMudar={setFiltros} rotulos={rotulos} />
        </div>
        <Legenda>
          <Chip>Situação</Chip> é <Chip>unico</Chip>: escolher troca e fecha. Os outros aceitam vários.
        </Legenda>
      </Secao>

      <Secao
        titulo="Com o botão do Header"
        spec="HeaderFiltros · contarFiltros"
        descricao="Na tela, a barra fica sob o Header e o botão de filtros a mostra e esconde. Escondida, o botão continua dizendo quantos filtros estão cortando a lista."
        codigo={codigoHeader}
      >
        <div className="flex flex-col gap-3 rounded-md bg-card p-4">
          <div className="flex justify-end">
            <HeaderFiltros
              rotulo="Filtros"
              contagem={contarFiltros(doHeader)}
              rotuloComContagem={(n) => `Filtros: ${n} ativos`}
              aria-expanded={barraAberta}
              onClick={() => setBarraAberta((v) => !v)}
            />
          </div>
          {barraAberta ? (
            <BarraDeFiltros abrirAoMontar aria-label="Filtros" campos={campos} valor={doHeader} aoMudar={setDoHeader} rotulos={rotulos} />
          ) : null}
        </div>
        <Legenda>
          Com <Chip>abrirAoMontar</Chip>, a barra já aparece na lista de campos: um clique a menos. É assim que a tela
          do Pipeline usa.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
