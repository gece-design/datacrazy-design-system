"use client";

import { useState } from "react";
import {
  DataTable,
  DataTableRow,
  DataTableCell,
  DataTableToolbar,
  CelulaLead,
  CelulaDupla,
  CelulaTexto,
  CelulaProgresso,
  CelulaEstatisticas,
  CelulaAcoes,
  type ColunaTabela,
} from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { Select, type OpcaoSelect } from "@/components/ui/select";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

/* Larguras do arquivo (node 261:805) usadas como peso. */
const colunas: ColunaTabela[] = [
  { chave: "lead", rotulo: "Lead", peso: 230 },
  { chave: "produto", rotulo: "Produto", peso: 170 },
  { chave: "atividades", rotulo: "Atividades", peso: 160 },
  { chave: "atendente", rotulo: "Atendente", peso: 150 },
  { chave: "etapa", rotulo: "Etapa", peso: 200 },
  { chave: "dados", rotulo: "Dados", peso: 180 },
  { chave: "acoes", rotulo: "", peso: 42, alinharFim: true },
];

/* Opções simuladas dos filtros — o arquivo desenha só o estado fechado. */
const etapas: OpcaoSelect[] = [
  { valor: "todas", rotulo: "Todas as etapas" },
  { valor: "qualificacao", rotulo: "Qualificação" },
  { valor: "proposta", rotulo: "Proposta" },
  { valor: "negociacao", rotulo: "Negociação" },
  { valor: "fechamento", rotulo: "Fechamento" },
];

const atendentes: OpcaoSelect[] = [
  { valor: "todos", rotulo: "Todos os atendentes" },
  { valor: "breno", rotulo: "Breno Ramos" },
  { valor: "millena", rotulo: "Millena Aragão" },
  { valor: "junior", rotulo: "Junior Santos" },
];

const visoes: OpcaoSelect[] = [
  { valor: "colunas", rotulo: "Colunas" },
  { valor: "compacta", rotulo: "Visão compacta" },
  { valor: "completa", rotulo: "Visão completa" },
];

/* A barra do arquivo mede 88 de 200 — 44%. */
const negocios = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  nome: "Giovanna",
  etiquetas: ["Frio", "sinal", "+1"],
  produto: "Sem produto",
  valor: "R$ 0,00",
  atividades: "Sem atividades",
  atendente: "Sem atendente",
  etapa: "quiro",
  percentual: 44,
}));

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  {
    nome: "Barra de filtros",
    medida: "px-5 py-4",
    papel:
      "Total de resultados à esquerda, recortes à direita. Os três filtros usam o mesmo SelectTrigger do Card — é o mesmo controle, então é o mesmo componente.",
  },
  {
    nome: "Cabeçalho",
    medida: "bg-background · label-md",
    papel:
      "Única faixa da tabela que muda de superfície. A coluna de ações tem rótulo vazio no desenho e um nome só para leitor de tela.",
  },
  {
    nome: "Linha",
    medida: "px-5 py-3 · border-t",
    papel:
      "Sete células com larguras proporcionais. O traço superior usa o token card, a mesma cor do fundo — o que separa de fato é o respiro.",
  },
  {
    nome: "Célula de lead",
    medida: "gap-1 · badge sm",
    papel:
      "Nome e etiquetas. A primeira etiqueta classifica e sai em primary; as outras são contexto e saem em neutral. Reusa o Badge do DS.",
  },
  {
    nome: "Progresso",
    medida: "h-[5px] · rounded-sm",
    papel:
      "Etapa em cima, barra embaixo. É role=progressbar com valor e rótulo — a barra sozinha não diria nada a quem não vê.",
  },
  {
    nome: "Paginação",
    medida: "h-7 · gap-1.5",
    papel:
      "Resumo à esquerda, controles à direita. A página atual é marcada com aria-current, e Anterior e Próxima desabilitam nas pontas.",
  },
];

export default function Pagina() {
  const [pagina, setPagina] = useState(1);
  const [etapa, setEtapa] = useState("todas");
  const [atendente, setAtendente] = useState("todos");
  const [visao, setVisao] = useState("colunas");

  return (
    <PaginaDS
      titulo="Table"
      descricao="A tabela de negócios do CRM: barra de filtros, sete colunas, dez linhas e paginação. É o componente mais denso do sistema, e o único onde a estrutura importa tanto quanto a aparência."
      secoes={["Completa", "Anatomia", "Como funciona"]}
    >
      <Secao
        titulo="Completa"
        className="bg-background"
        spec="7 colunas"
        descricao="Barra de filtros, cabeçalho, linhas e paginação — a unidade inteira, como o arquivo desenha."
        codigo={`<DataTable colunas={colunas}>
  {negocios.map((n) => (
    <DataTableRow key={n.id}>
      <DataTableCell primeira>
        <CelulaLead nome={n.nome} etiquetas={n.etiquetas} />
      </DataTableCell>
      <DataTableCell>
        <CelulaDupla principal={n.produto} apoio={n.valor} />
      </DataTableCell>
      <DataTableCell><CelulaTexto>{n.atividades}</CelulaTexto></DataTableCell>
      <DataTableCell><CelulaTexto enfase>{n.atendente}</CelulaTexto></DataTableCell>
      <DataTableCell>
        <CelulaProgresso etapa={n.etapa} percentual={n.percentual} />
      </DataTableCell>
      <DataTableCell>
        <CelulaEstatisticas itens={[
          { valor: "0d", rotulo: "Em aberto" },
          { valor: "0d", rotulo: "Tempo na etapa" },
        ]} />
      </DataTableCell>
      <DataTableCell ultima><CelulaAcoes /></DataTableCell>
    </DataTableRow>
  ))}
</DataTable>`}
        nota={
          <>
            As larguras do arquivo viram <strong>proporção</strong>, não pixel. Coluna fixa em px é o
            bug <Chip>#83285</Chip> esperando acontecer — o que quebra fora de zoom 100%. Abaixo de
            1160px a tabela rola na horizontal em vez de espremer coluna.
          </>
        }
      >
        <div className="w-full overflow-hidden rounded-md bg-card">
          <DataTableToolbar rotulo="Total de resultados" total="37 negócios">
            <Select
              size="sm"
              rotulo="Filtrar por etapa"
              opcoes={etapas}
              valor={etapa}
              aoEscolher={setEtapa}
            />
            <Select
              size="sm"
              rotulo="Filtrar por atendente"
              opcoes={atendentes}
              valor={atendente}
              aoEscolher={setAtendente}
            />
            <Select
              size="sm"
              rotulo="Escolher visão das colunas"
              opcoes={visoes}
              valor={visao}
              aoEscolher={setVisao}
            />
          </DataTableToolbar>

          <DataTable colunas={colunas} className="rounded-none">
            {negocios.map((n) => (
              <DataTableRow key={n.id}>
                <DataTableCell primeira>
                  <CelulaLead nome={n.nome} etiquetas={n.etiquetas} />
                </DataTableCell>
                <DataTableCell>
                  <CelulaDupla principal={n.produto} apoio={n.valor} />
                </DataTableCell>
                <DataTableCell>
                  <CelulaTexto>{n.atividades}</CelulaTexto>
                </DataTableCell>
                <DataTableCell>
                  <CelulaTexto enfase>{n.atendente}</CelulaTexto>
                </DataTableCell>
                <DataTableCell>
                  <CelulaProgresso etapa={n.etapa} percentual={n.percentual} />
                </DataTableCell>
                <DataTableCell>
                  <CelulaEstatisticas
                    itens={[
                      { valor: "0d", rotulo: "Em aberto" },
                      { valor: "0d", rotulo: "Tempo na etapa" },
                    ]}
                  />
                </DataTableCell>
                <DataTableCell ultima>
                  <CelulaAcoes />
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTable>

          <Pagination
            className="px-5 py-3.5"
            resumo="Mostrando 10 de 37 negócios"
            paginas={4}
            atual={pagina}
            onIr={setPagina}
          />
        </div>
        <Legenda>
          <strong>Role a tabela para o lado</strong> para ver Etapa, Dados e ações: a coluna de
          leitura desta página tem 820px e a tabela pede 1160. Não é defeito do preview — é o mesmo
          que acontece numa tela estreita, e é o comportamento que o componente escolhe em vez de
          espremer sete colunas. A paginação também funciona: clique nos números e repare que{" "}
          <Chip>Anterior</Chip> e <Chip>Próxima</Chip> desabilitam nas pontas.
        </Legenda>
      </Secao>

      <Secao titulo="Anatomia" spec="6 partes" semCaixa>
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

      <ComoFunciona>
        <p>
          O arquivo desenha a tabela com caixas empilhadas. Aqui é <Chip>&lt;table&gt;</Chip> de
          verdade, com <Chip>thead</Chip>, <Chip>th scope=&quot;col&quot;</Chip> e{" "}
          <Chip>tbody</Chip>. A aparência é a mesma; o que muda é o que a máquina entende — num CRM o
          leitor de tela precisa anunciar em que linha e em que coluna a pessoa está, e ordenação,
          seleção e navegação por teclado se apoiam nessa estrutura depois.
        </p>
        <p>
          As sete larguras do arquivo — 230, 170, 160, 150, 200, 180 e 42 — entram como{" "}
          <strong>peso</strong>, não como pixel. A tabela do CRM vive em telas de largura variável e
          em zoom acima de 100%; coluna fixa em px é exatamente o tipo de medida que só fecha numa
          resolução, que é a família de bugs #83285, #80170 e #79852. Abaixo de 1160px ela rola na
          horizontal em vez de espremer.
        </p>
        <p>
          A barra de progresso não é um retângulo decorativo: é{" "}
          <Chip>role=&quot;progressbar&quot;</Chip> com valor e rótulo. Uma barra sem isso não diz
          nada a quem não enxerga, e a etapa do funil é justamente o dado que a linha existe para
          mostrar.
        </p>
        <p>
          Três controles desta página são o mesmo componente do Card: o{" "}
          <Chip>SelectTrigger</Chip>. Ele apareceu duas vezes no Figma com a mesma cara — recorte do
          Card e filtro da tabela — e por isso virou peça única, com dois tamanhos. Continua sem
          abrir menu: o Select do DS não existe, e o arquivo desenha só o estado fechado.
        </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
