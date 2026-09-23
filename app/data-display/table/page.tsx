"use client";

import { Fragment, useState } from "react";
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
  BotaoColunas,
  DataTableGrupo,
  SelectAgrupar,
  agruparPor,
  ordenarPor,
  useAjustesDaTabela,
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

/* Dez negócios diferentes entre si, para a ordenação ter o que mostrar. */
const carteira = [
  { id: "n1", nome: "Giovanna Alves", etiquetas: ["Quente", "Indicação"], produto: "Plano Pro", valor: 4800, atividades: "3 atividades", atendente: "Breno Ramos", etapa: "Proposta", percentual: 60, aberto: 12, naEtapa: 3 },
  { id: "n2", nome: "Clínica Vitalis", etiquetas: ["Frio"], produto: "Plano Starter", valor: 1200, atividades: "Sem atividades", atendente: "Millena Aragão", etapa: "Qualificação", percentual: 20, aberto: 2, naEtapa: 2 },
  { id: "n3", nome: "Horizonte Engenharia", etiquetas: ["Morno", "Evento"], produto: "Enterprise", valor: 18400, atividades: "1 atividade", atendente: "Junior Santos", etapa: "Negociação", percentual: 80, aberto: 27, naEtapa: 9 },
  { id: "n4", nome: "Rede Bom Dia", etiquetas: ["Quente"], produto: "Plano Pro", valor: 9600, atividades: "5 atividades", atendente: "Breno Ramos", etapa: "Fechamento", percentual: 95, aberto: 41, naEtapa: 1 },
  { id: "n5", nome: "Instituto Raízes", etiquetas: ["Frio", "Site"], produto: "Sem produto", valor: 0, atividades: "Sem atividades", atendente: "Sem atendente", etapa: "Qualificação", percentual: 20, aberto: 1, naEtapa: 1 },
  { id: "n6", nome: "Marina Alvarenga", etiquetas: ["Morno"], produto: "Plano Starter", valor: 1500, atividades: "2 atividades", atendente: "Millena Aragão", etapa: "Proposta", percentual: 60, aberto: 8, naEtapa: 5 },
  { id: "n7", nome: "Oficina Farol", etiquetas: ["Quente", "WhatsApp"], produto: "Plano Pro", valor: 5200, atividades: "4 atividades", atendente: "Junior Santos", etapa: "Negociação", percentual: 80, aberto: 19, naEtapa: 4 },
  { id: "n8", nome: "Campo Vivo Agro", etiquetas: ["Frio"], produto: "Enterprise", valor: 22000, atividades: "1 atividade", atendente: "Breno Ramos", etapa: "Qualificação", percentual: 20, aberto: 5, naEtapa: 5 },
  { id: "n9", nome: "Helena Moraes", etiquetas: ["Morno", "Indicação"], produto: "Plano Starter", valor: 900, atividades: "Sem atividades", atendente: "Millena Aragão", etapa: "Fechamento", percentual: 95, aberto: 33, naEtapa: 2 },
  { id: "n10", nome: "Tomás Vilela", etiquetas: ["Quente"], produto: "Plano Pro", valor: 6100, atividades: "6 atividades", atendente: "Junior Santos", etapa: "Proposta", percentual: 60, aberto: 15, naEtapa: 6 },
];
type Negocio = (typeof carteira)[number];

const moeda = (v: number) => `R$ ${v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")},00`;

/* O que cada coluna lê do negócio, para ordenar: número compara como número. */
function valorDe(n: Negocio, chave: string): string | number {
  switch (chave) {
    case "lead": return n.nome;
    case "produto": return n.valor;
    case "atividades": return n.atividades;
    case "atendente": return n.atendente;
    case "etapa": return n.percentual;
    case "dados": return n.aberto;
    default: return "";
  }
}

const codigoAjustavel = `const ajustes = useAjustesDaTabela(colunas, { memoria: "negocios" });
const linhas = ordenarPor(negocios, ajustes.ordem, valorDe);
const [selecionado, setSelecionado] = useState<string | null>(null);

<>
  <DataTableToolbar rotulo="Total de resultados" total="10 negócios">
    <BotaoColunas ajustes={ajustes} />
  </DataTableToolbar>
  <DataTable colunas={colunas} ajustes={ajustes}>
    {linhas.map((n) => (
      <DataTableRow key={n.id} selecionada={n.id === selecionado} aoSelecionar={() => setSelecionado(n.id)}>
        <DataTableCell coluna="lead"><CelulaLead nome={n.nome} etiquetas={n.etiquetas} /></DataTableCell>
        <DataTableCell coluna="produto"><CelulaDupla principal={n.produto} apoio={n.valor} /></DataTableCell>
        <DataTableCell coluna="etapa"><CelulaProgresso etapa={n.etapa} percentual={n.percentual} /></DataTableCell>
        <DataTableCell coluna="acoes"><CelulaAcoes /></DataTableCell>
      </DataTableRow>
    ))}
  </DataTable>
</>`;

/** A seção ajustável: os cinco comportamentos numa tabela só, com o detalhe embaixo. */
function TabelaAjustavel() {
  const ajustes = useAjustesDaTabela(colunas, { memoria: "showcase-negocios" });
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const linhas = ordenarPor(carteira, ajustes.ordem, valorDe);
  const escolhido = carteira.find((n) => n.id === selecionado);
  return (
    <div className="w-full overflow-hidden rounded-md bg-card">
      <DataTableToolbar rotulo="Total de resultados" total="10 negócios">
        <BotaoColunas ajustes={ajustes} />
      </DataTableToolbar>
      <DataTable colunas={colunas} ajustes={ajustes} className="rounded-none">
        {linhas.map((n) => (
          <DataTableRow key={n.id} selecionada={n.id === selecionado} aoSelecionar={() => setSelecionado(n.id)}>
            <DataTableCell coluna="lead">
              <CelulaLead nome={n.nome} etiquetas={n.etiquetas} />
            </DataTableCell>
            <DataTableCell coluna="produto">
              <CelulaDupla principal={n.produto} apoio={moeda(n.valor)} />
            </DataTableCell>
            <DataTableCell coluna="atividades">
              <CelulaTexto>{n.atividades}</CelulaTexto>
            </DataTableCell>
            <DataTableCell coluna="atendente">
              <CelulaTexto enfase>{n.atendente}</CelulaTexto>
            </DataTableCell>
            <DataTableCell coluna="etapa">
              <CelulaProgresso etapa={n.etapa} percentual={n.percentual} />
            </DataTableCell>
            <DataTableCell coluna="dados">
              <CelulaEstatisticas
                itens={[
                  { valor: `${n.aberto}d`, rotulo: "Em aberto" },
                  { valor: `${n.naEtapa}d`, rotulo: "Tempo na etapa" },
                ]}
              />
            </DataTableCell>
            <DataTableCell coluna="acoes">
              <CelulaAcoes />
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
      {/* O detalhe da linha escolhida — a referência põe um painel embaixo;
          no CRM esse painel é o Drawer do lead. */}
      <div aria-live="polite" className="border-t border-border px-5 py-4 text-body-md text-muted-foreground">
        {escolhido ? (
          <>
            <span className="text-h4 text-foreground">{escolhido.nome}</span> · {escolhido.produto} · {moeda(escolhido.valor)} ·{" "}
            {escolhido.atendente} · {escolhido.etapa}, {escolhido.aberto} dias em aberto. No CRM, este painel é o Drawer.
          </>
        ) : (
          "Selecione um negócio para ver o detalhe aqui."
        )}
      </div>
    </div>
  );
}

/* Etapa e Atendente podem agrupar; o funil dá a ordem dos grupos de etapa. */
const colunasAgrupaveis: ColunaTabela[] = colunas.map((c) =>
  c.chave === "etapa" || c.chave === "atendente" ? { ...c, agrupavel: true } : c,
);
const FUNIL = ["Qualificação", "Proposta", "Negociação", "Fechamento"];

const codigoAgrupada = `const ajustes = useAjustesDaTabela(colunas, { memoria: "negocios", grupoInicial: "etapa" });
const linhas = ordenarPor(negocios, ajustes.ordem, valorDe);
const grupos = ajustes.grupo
  ? agruparPor(linhas, (n) => ({ id: n[ajustes.grupo], rotulo: n[ajustes.grupo] }), FUNIL)
  : null;

<>
  <DataTableToolbar rotulo="Total de resultados" total="10 negócios">
    <SelectAgrupar ajustes={ajustes} />
    <BotaoColunas ajustes={ajustes} />
  </DataTableToolbar>
  <DataTable colunas={colunas} ajustes={ajustes}>
    {grupos
      ? grupos.map((g) => (
          <Fragment key={g.id}>
            <DataTableGrupo
              rotulo={g.rotulo}
              quantidade={g.itens.length}
              resumo={moeda(g.itens.reduce((t, n) => t + n.valor, 0))}
              aberto={!ajustes.recolhidos.includes(g.id)}
              aoAlternar={() => ajustes.alternarGrupo(g.id)}
            />
            {ajustes.recolhidos.includes(g.id) ? null : g.itens.map(linha)}
          </Fragment>
        ))
      : linhas.map(linha)}
  </DataTable>
</>`;

/** A seção agrupada: os mesmos dez negócios, por etapa (ordem do funil) ou por atendente. */
function TabelaAgrupada() {
  const ajustes = useAjustesDaTabela(colunasAgrupaveis, { memoria: "showcase-grupos", grupoInicial: "etapa" });
  const linhas = ordenarPor(carteira, ajustes.ordem, valorDe);
  const grupo = ajustes.grupo;
  const grupos = grupo
    ? agruparPor(
        linhas,
        (n) => (grupo === "etapa" ? { id: n.etapa, rotulo: n.etapa } : { id: n.atendente, rotulo: n.atendente }),
        grupo === "etapa" ? FUNIL : undefined,
      )
    : null;
  const linha = (n: Negocio) => (
    <DataTableRow key={n.id}>
      <DataTableCell coluna="lead">
        <CelulaLead nome={n.nome} etiquetas={n.etiquetas} />
      </DataTableCell>
      <DataTableCell coluna="produto">
        <CelulaDupla principal={n.produto} apoio={moeda(n.valor)} />
      </DataTableCell>
      <DataTableCell coluna="atividades">
        <CelulaTexto>{n.atividades}</CelulaTexto>
      </DataTableCell>
      <DataTableCell coluna="atendente">
        <CelulaTexto enfase>{n.atendente}</CelulaTexto>
      </DataTableCell>
      <DataTableCell coluna="etapa">
        <CelulaProgresso etapa={n.etapa} percentual={n.percentual} />
      </DataTableCell>
      <DataTableCell coluna="dados">
        <CelulaEstatisticas
          itens={[
            { valor: `${n.aberto}d`, rotulo: "Em aberto" },
            { valor: `${n.naEtapa}d`, rotulo: "Tempo na etapa" },
          ]}
        />
      </DataTableCell>
      <DataTableCell coluna="acoes">
        <CelulaAcoes />
      </DataTableCell>
    </DataTableRow>
  );
  return (
    <div className="w-full overflow-hidden rounded-md bg-card">
      <DataTableToolbar rotulo="Total de resultados" total="10 negócios">
        <SelectAgrupar ajustes={ajustes} />
        <BotaoColunas ajustes={ajustes} />
      </DataTableToolbar>
      <DataTable colunas={colunasAgrupaveis} ajustes={ajustes} className="rounded-none">
        {grupos
          ? grupos.map((g) => (
              <Fragment key={g.id}>
                <DataTableGrupo
                  rotulo={g.rotulo}
                  quantidade={g.itens.length}
                  resumo={moeda(g.itens.reduce((t, n) => t + n.valor, 0))}
                  aberto={!ajustes.recolhidos.includes(g.id)}
                  aoAlternar={() => ajustes.alternarGrupo(g.id)}
                />
                {ajustes.recolhidos.includes(g.id) ? null : g.itens.map(linha)}
              </Fragment>
            ))
          : linhas.map(linha)}
      </DataTable>
    </div>
  );
}

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
      secoes={["Completa", "Ajustável", "Agrupada", "Anatomia", "Como funciona"]}
    >
      <Secao
        titulo="Completa"
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

      <Secao
        titulo="Ajustável"
        spec="ordenar · colunas · redimensionar · reordenar · selecionar"
        descricao="Os cinco comportamentos da referência (grid do ExtJS) numa tabela só. Clique no cabeçalho para ordenar; o ⋮ que aparece nele abre o menu da coluna; a borda do cabeçalho redimensiona; arrastar o cabeçalho reordena; clicar na linha seleciona, e o painel embaixo mostra o registro. O botão Colunas da barra esconde, mostra e restaura."
        codigo={codigoAjustavel}
        nota={
          <>
            Tudo mora em <Chip>useAjustesDaTabela</Chip>: a tela cria os ajustes uma vez e passa para a tabela e para
            o <Chip>BotaoColunas</Chip>. Com <Chip>memoria</Chip>, ordem, larguras e colunas ficam salvas no
            navegador por tela — recarregue e a tabela volta como você deixou. A tabela só{" "}
            <span className="text-foreground">emite</span> a ordenação: as linhas chegam como filhos, então quem
            ordena os dados é a tela (<Chip>ordenarPor</Chip> ajuda). Cada célula diz de que coluna é
            (<Chip>coluna=&quot;lead&quot;</Chip>) para seguir a ordem e a visibilidade. Teclado: setas na alça
            redimensionam, o menu move a coluna, Enter ou Espaço seleciona a linha e as setas andam entre elas.
          </>
        }
      >
        <TabelaAjustavel />
      </Secao>

      <Secao
        titulo="Agrupada"
        spec="por etapa · por atendente"
        descricao="A mesma tabela em grupos. O seletor da barra escolhe a coluna que agrupa (ou o menu da coluna, em Agrupar por); cada grupo tem o caret que recolhe, quantas linhas tem e o total à direita. Ordenar continua valendo dentro de cada grupo."
        codigo={codigoAgrupada}
        nota={
          <>
            Agrupar segue a regra da ordenação: os ajustes guardam só a coluna do grupo e os grupos recolhidos;
            a tela monta os grupos com <Chip>agruparPor</Chip> — que aceita a ordem do funil — e desenha um{" "}
            <Chip>DataTableGrupo</Chip> antes das linhas de cada um. Só as colunas com{" "}
            <Chip>agrupavel</Chip> entram no seletor. Recolher um grupo tira as linhas dele da tabela; as setas
            da seleção pulam a linha do grupo.
          </>
        }
      >
        <TabelaAgrupada />
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
          Card e filtro da tabela — e por isso virou peça única, com dois tamanhos. Hoje é o gatilho do{" "}
          <Chip>Select</Chip> do DS.
        </p>
        <p>
          Os comportamentos (ordenar, colunas, redimensionar, reordenar, selecionar) vieram de um pedido do
          cliente em 2026-09-18, com o grid do ExtJS como referência. Pixel só entra quando a{" "}
          <span className="text-foreground">pessoa</span> redimensiona: a partir daí as larguras são dela e
          ficam salvas. Esconder coluna tem dois caminhos de propósito — o menu do cabeçalho, para quem já
          está com o cursor lá, e o botão <Chip>Colunas</Chip> na barra, porque menu escondido no cabeçalho
          ninguém acha. O menu é o mesmo painel flutuante do Select, com <Chip>role=&quot;menu&quot;</Chip>{" "}
          e o foco andando por <Chip>aria-activedescendant</Chip>.
        </p>
      </ComoFunciona>
    </PaginaDS>
  );
}
