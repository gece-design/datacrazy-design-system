"use client";

import { Fragment, useRef, useState } from "react";
import { Clock, FunnelSimple, Headset, ListChecks, Package, User } from "@phosphor-icons/react";
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
  BotaoAgrupar,
  BarraDeSelecao,
  CelulaEditavel,
  useSelecaoDaTabela,
  agruparPor,
  ordenarPor,
  useAjustesDaTabela,
  type ColunaTabela,
} from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Tag, type Tom } from "@/components/ui/tag";
import { Menu } from "@/components/ui/menu";
import { Toaster, toast } from "@/components/ui/toast";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

/* Larguras do arquivo (node 261:805) usadas como peso; `minimo` é o piso de
   cada coluna na grade densa — abaixo da soma deles a tabela rola. */
const colunas: ColunaTabela[] = [
  { chave: "lead", rotulo: "Lead", peso: 230, minimo: 220, icone: User },
  { chave: "produto", rotulo: "Produto", peso: 170, minimo: 200, icone: Package },
  { chave: "atividades", rotulo: "Atividades", peso: 160, minimo: 130, icone: ListChecks },
  { chave: "atendente", rotulo: "Atendente", peso: 150, minimo: 170, icone: Headset },
  { chave: "etapa", rotulo: "Etapa", peso: 200, minimo: 180, icone: FunnelSimple },
  { chave: "dados", rotulo: "Dados", peso: 180, minimo: 150, icone: Clock },
  { chave: "acoes", rotulo: "", peso: 42, minimo: 44, alinharFim: true },
];

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

/* As células contam o que o cartão do pipeline conta, do mesmo jeito (humano,
   2026-09-24: "por que não atualizou as tabelas aqui?"): a etiqueta com a
   bolinha de status, a etapa na cor da coluna, o atendente na Tag com foto. */
const STATUS_DA_ETIQUETA: Record<string, "destructive" | "info" | "success"> = {
  Quente: "destructive",
  Morno: "info",
  Indicação: "success",
};
const comStatus = (rotulo: string) => ({ rotulo, status: STATUS_DA_ETIQUETA[rotulo] });
const TOM_DA_ETAPA: Record<string, Tom | "neutro"> = {
  Qualificação: "ciano",
  Proposta: "azul",
  Negociação: "ambar",
  Fechamento: "verde",
};
const tomDaEtapa = (etapa: string) => TOM_DA_ETAPA[etapa] ?? "neutro";
function Atendente({ nome }: { nome: string }) {
  return nome === "Sem atendente" ? <CelulaTexto>{nome}</CelulaTexto> : <Tag foto="/ds/atendente.png">{nome}</Tag>;
}

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
        <DataTableCell coluna="lead"><CelulaLead nome={n.nome} etiquetas={n.etiquetas.map(comStatus)} /></DataTableCell>
        <DataTableCell coluna="produto"><CelulaDupla principal={n.produto} apoio={n.valor} /></DataTableCell>
        <DataTableCell coluna="etapa"><CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom={tomDaEtapa(n.etapa)} /></DataTableCell>
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
              <CelulaLead nome={n.nome} etiquetas={n.etiquetas.map(comStatus)} />
            </DataTableCell>
            <DataTableCell coluna="produto">
              <CelulaDupla principal={n.produto} apoio={moeda(n.valor)} />
            </DataTableCell>
            <DataTableCell coluna="atividades">
              <CelulaTexto>{n.atividades}</CelulaTexto>
            </DataTableCell>
            <DataTableCell coluna="atendente">
              <Atendente nome={n.atendente} />
            </DataTableCell>
            <DataTableCell coluna="etapa">
              <CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom={tomDaEtapa(n.etapa)} />
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
    <BotaoAgrupar ajustes={ajustes} />
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
        <CelulaLead nome={n.nome} etiquetas={n.etiquetas.map(comStatus)} />
      </DataTableCell>
      <DataTableCell coluna="produto">
        <CelulaDupla principal={n.produto} apoio={moeda(n.valor)} />
      </DataTableCell>
      <DataTableCell coluna="atividades">
        <CelulaTexto>{n.atividades}</CelulaTexto>
      </DataTableCell>
      <DataTableCell coluna="atendente">
        <Atendente nome={n.atendente} />
      </DataTableCell>
      <DataTableCell coluna="etapa">
        <CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom={tomDaEtapa(n.etapa)} />
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
        <BotaoAgrupar ajustes={ajustes} />
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

const codigoSelecao = `const ajustes = useAjustesDaTabela(colunas, { memoria: "negocios" });
const selecao = useSelecaoDaTabela();
const linhas = ordenarPor(negocios, ajustes.ordem, valorDe);

<>
  <DataTableToolbar rotulo="Total de resultados" total="10 negócios">
    <BotaoColunas ajustes={ajustes} />
  </DataTableToolbar>
  <DataTable colunas={colunas} ajustes={ajustes} selecao={selecao}>
    {linhas.map((n) => (
      <DataTableRow key={n.id} chave={n.id} nome={n.nome}>
        <DataTableCell coluna="lead"><CelulaLead nome={n.nome} etiquetas={n.etiquetas.map(comStatus)} /></DataTableCell>
        <DataTableCell coluna="produto"><CelulaDupla principal={n.produto} apoio={n.valor} /></DataTableCell>
        <DataTableCell coluna="etapa"><CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom={tomDaEtapa(n.etapa)} /></DataTableCell>
      </DataTableRow>
    ))}
  </DataTable>
  {/* as ações são da tela: no CRM, mover, atribuir, exportar, excluir */}
  <BarraDeSelecao selecao={selecao}>
    <Button variant="tertiary" size="sm" onClick={() => moverDeEtapa(selecao.selecionados)}>Mover de etapa</Button>
    <Button variant="tertiary" size="sm" onClick={() => atribuir(selecao.selecionados)}>Atribuir atendente</Button>
    <Button variant="destructive" size="sm" onClick={() => excluir(selecao.selecionados)}>Excluir</Button>
  </BarraDeSelecao>
</>`;

/** A seção de seleção em massa: caixa no cabeçalho e nas linhas, Shift+clique e a barra com as ações. */
function TabelaComSelecao() {
  const ajustes = useAjustesDaTabela(colunas, { memoria: "showcase-selecao" });
  const selecao = useSelecaoDaTabela();
  const linhas = ordenarPor(carteira, ajustes.ordem, valorDe);
  const [menuEtapa, setMenuEtapa] = useState(false);
  const botaoEtapa = useRef<HTMLButtonElement>(null);
  const quantos = selecao.selecionados.length;
  // Na página a ação vira um Toast; no CRM, é a chamada de verdade.
  const feito = (titulo: string, descricao: string) => {
    toast({ variant: "success", titulo, descricao });
    selecao.limpar();
  };
  return (
    <div className="w-full overflow-hidden rounded-md bg-card">
      <DataTableToolbar rotulo="Total de resultados" total="10 negócios">
        <BotaoColunas ajustes={ajustes} />
      </DataTableToolbar>
      <DataTable colunas={colunas} ajustes={ajustes} selecao={selecao} className="rounded-none">
        {linhas.map((n) => (
          <DataTableRow key={n.id} chave={n.id} nome={n.nome}>
            <DataTableCell coluna="lead">
              <CelulaLead nome={n.nome} etiquetas={n.etiquetas.map(comStatus)} />
            </DataTableCell>
            <DataTableCell coluna="produto">
              <CelulaDupla principal={n.produto} apoio={moeda(n.valor)} />
            </DataTableCell>
            <DataTableCell coluna="atividades">
              <CelulaTexto>{n.atividades}</CelulaTexto>
            </DataTableCell>
            <DataTableCell coluna="atendente">
              <Atendente nome={n.atendente} />
            </DataTableCell>
            <DataTableCell coluna="etapa">
              <CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom={tomDaEtapa(n.etapa)} />
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
      <BarraDeSelecao selecao={selecao}>
        <Button
          ref={botaoEtapa}
          variant="tertiary"
          size="sm"
          aria-haspopup="menu"
          aria-expanded={menuEtapa}
          onClick={() => setMenuEtapa((a) => !a)}
        >
          Mover de etapa
        </Button>
        <Menu
          aberto={menuEtapa}
          gatilho={botaoEtapa}
          rotulo="Mover de etapa"
          itens={FUNIL.map((e) => ({ id: e, rotulo: e, aoAtivar: () => feito("Etapa alterada", `${quantos} negócio(s) agora em ${e}.`) }))}
          aoFechar={(devolver = true) => {
            setMenuEtapa(false);
            if (devolver) botaoEtapa.current?.focus();
          }}
        />
        <Button variant="tertiary" size="sm" onClick={() => feito("Atendente atribuído", `${quantos} negócio(s) passaram para Breno Ramos.`)}>
          Atribuir atendente
        </Button>
        <Button variant="tertiary" size="sm" onClick={() => feito("Exportado", `${quantos} negócio(s) foram para o CSV.`)}>
          Exportar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => feito("Excluídos", `${quantos} negócio(s) saíram da lista.`)}>
          Excluir
        </Button>
      </BarraDeSelecao>
    </div>
  );
}

const codigoEdicao = `const [linhas, setLinhas] = useState(negocios);
const editar = (id, campos) => setLinhas((l) => l.map((n) => (n.id === id ? { ...n, ...campos } : n)));

<DataTableCell coluna="produto">
  <CelulaEditavel
    valor={String(n.valor)}
    formatar={(v) => moeda(Number(v) || 0)}
    inputMode="numeric"
    rotulo={\`Editar valor de \${n.nome}\`}
    aoSalvar={(v) => editar(n.id, { valor: Number(v.replace(/\\D/g, "")) || 0 })}
  />
</DataTableCell>
<DataTableCell coluna="atividades">
  <CelulaEditavel valor={n.atividades} rotulo={\`Editar atividades de \${n.nome}\`} aoSalvar={(v) => editar(n.id, { atividades: v })} />
</DataTableCell>`;

/** A seção de edição na célula: valor e atividades editam no lugar. */
function TabelaEditavel() {
  const [linhas, setLinhas] = useState(carteira);
  const editar = (id: string, campos: Partial<Negocio>) =>
    setLinhas((l) => l.map((n) => (n.id === id ? { ...n, ...campos } : n)));
  return (
    <div className="w-full overflow-hidden rounded-md bg-card">
      <DataTableToolbar rotulo="Total de resultados" total="10 negócios" />
      <DataTable colunas={colunas} className="rounded-none">
        {linhas.map((n) => (
          <DataTableRow key={n.id}>
            <DataTableCell coluna="lead">
              <CelulaLead nome={n.nome} etiquetas={n.etiquetas.map(comStatus)} />
            </DataTableCell>
            <DataTableCell coluna="produto">
              <div className="flex min-w-0 flex-col items-start gap-0.5">
                <p className="w-full truncate text-h4 text-foreground">{n.produto}</p>
                <CelulaEditavel
                  valor={String(n.valor)}
                  formatar={(v) => moeda(Number(v) || 0)}
                  inputMode="numeric"
                  rotulo={`Editar valor de ${n.nome}`}
                  aoSalvar={(v) => editar(n.id, { valor: Number(v.replace(/\D/g, "")) || 0 })}
                />
              </div>
            </DataTableCell>
            <DataTableCell coluna="atividades">
              <CelulaEditavel valor={n.atividades} rotulo={`Editar atividades de ${n.nome}`} aoSalvar={(v) => editar(n.id, { atividades: v })} />
            </DataTableCell>
            <DataTableCell coluna="atendente">
              <Atendente nome={n.atendente} />
            </DataTableCell>
            <DataTableCell coluna="etapa">
              <CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom={tomDaEtapa(n.etapa)} />
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
    </div>
  );
}

const codigoConfortavel = `<DataTableToolbar layout="confortavel" rotulo="Total de resultados" total="10 negócios">
  <BotaoColunas ajustes={ajustes} />
</DataTableToolbar>
<DataTable layout="confortavel" colunas={colunas} ajustes={ajustes} selecao={selecao}>
  {linhas.map((n) => (
    <DataTableRow key={n.id} chave={n.id} nome={n.nome}>
      <DataTableCell coluna="lead"><CelulaLead nome={n.nome} etiquetas={n.etiquetas} /></DataTableCell>
      <DataTableCell coluna="produto"><CelulaDupla principal={n.produto} apoio={n.valor} /></DataTableCell>
      <DataTableCell coluna="etapa"><CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom="azul" /></DataTableCell>
    </DataTableRow>
  ))}
</DataTable>`;

/** A seção confortável: o desenho do arquivo — linha alta, recuo 20, sem traço entre colunas. */
function TabelaConfortavel() {
  const ajustes = useAjustesDaTabela(colunas, { memoria: "showcase-confortavel" });
  const selecao = useSelecaoDaTabela();
  const linhas = ordenarPor(carteira, ajustes.ordem, valorDe);
  return (
    <div className="w-full overflow-hidden rounded-md border border-border bg-card">
      <DataTableToolbar layout="confortavel" rotulo="Total de resultados" total="10 negócios">
        <BotaoColunas ajustes={ajustes} />
      </DataTableToolbar>
      <DataTable layout="confortavel" colunas={colunas} ajustes={ajustes} selecao={selecao} className="rounded-none border-0 border-t">
        {linhas.map((n) => (
          <DataTableRow key={n.id} chave={n.id} nome={n.nome}>
            <DataTableCell coluna="lead">
              <CelulaLead nome={n.nome} etiquetas={n.etiquetas.map(comStatus)} />
            </DataTableCell>
            <DataTableCell coluna="produto">
              <CelulaDupla principal={n.produto} apoio={moeda(n.valor)} />
            </DataTableCell>
            <DataTableCell coluna="atividades">
              <CelulaTexto>{n.atividades}</CelulaTexto>
            </DataTableCell>
            <DataTableCell coluna="atendente">
              <Atendente nome={n.atendente} />
            </DataTableCell>
            <DataTableCell coluna="etapa">
              <CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom={tomDaEtapa(n.etapa)} />
            </DataTableCell>
            <DataTableCell coluna="dados">
              <CelulaEstatisticas
                itens={[
                  { valor: `${n.aberto}d`, rotulo: "em aberto" },
                  { valor: `${n.naEtapa}d`, rotulo: "na etapa" },
                ]}
              />
            </DataTableCell>
            <DataTableCell coluna="acoes">
              <CelulaAcoes />
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
      <BarraDeSelecao selecao={selecao}>
        <Button variant="tertiary" size="sm" onClick={() => selecao.limpar()}>
          Exportar
        </Button>
      </BarraDeSelecao>
    </div>
  );
}

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  {
    nome: "Barra da tabela",
    medida: "px-3 py-2",
    papel:
      "Total de resultados à esquerda; à direita, só os botões que mexem na própria tabela (Colunas, Agrupar). Busca e filtros ficam no Header da tela.",
  },
  {
    nome: "Cabeçalho",
    medida: "32px · label-md · ícone de 14",
    papel:
      "Única faixa da tabela que muda de superfície. Cada coluna pode ter um ícone antes do rótulo. A coluna de ações tem rótulo vazio no desenho e um nome só para leitor de tela.",
  },
  {
    nome: "Linha",
    medida: "36px · px-2 py-1 · traço border",
    papel:
      "Sete células com larguras proporcionais, cada uma numa linha só. Traço entre linhas e entre colunas, como numa planilha. Na confortável a linha cresce e o traço some: quem separa é o respiro.",
  },
  {
    nome: "Célula de lead",
    medida: "nome + Tag de 22px",
    papel:
      "Nome e etiquetas na mesma linha. O nome tem prioridade: etiqueta que não cabe inteira some, em vez de cortar o nome. As etiquetas são a Tag do DS, neutras, com a bolinha de status quando há.",
  },
  {
    nome: "Progresso",
    medida: "h-[5px] · rounded-sm",
    papel:
      "Etapa e barra lado a lado, na cor da etapa. É role=progressbar com valor e rótulo — a barra sozinha não diria nada a quem não vê.",
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

  return (
    <PaginaDS
      titulo="Table"
      descricao="A tabela de negócios do CRM: barra com o total, sete colunas, dez linhas de 36px e paginação. É o componente mais denso do sistema, e o único onde a estrutura importa tanto quanto a aparência."
      secoes={["Completa", "Ajustável", "Agrupada", "Seleção em massa", "Edição na célula", "Confortável", "Anatomia", "Como funciona"]}
    >
      <Secao
        titulo="Completa"
        spec="7 colunas · linha de 36px"
        descricao="Barra com o total, cabeçalho com ícone por coluna, linhas de uma linha só e paginação — a unidade inteira. Busca e filtros não moram na barra da tabela: ficam no Header da tela."
        codigo={`const colunas = [
  { chave: "lead", rotulo: "Lead", peso: 230, minimo: 220, icone: User },
  { chave: "produto", rotulo: "Produto", peso: 170, minimo: 200, icone: Package },
  { chave: "etapa", rotulo: "Etapa", peso: 200, minimo: 180, icone: FunnelSimple },
  { chave: "acoes", rotulo: "", peso: 42, minimo: 44, alinharFim: true },
];

<>
  <DataTableToolbar rotulo="Total de resultados" total="37 negócios" />
  <DataTable colunas={colunas}>
    {negocios.map((n) => (
      <DataTableRow key={n.id}>
        <DataTableCell primeira>
          <CelulaLead nome={n.nome} etiquetas={n.etiquetas.map(comStatus)} />
        </DataTableCell>
        <DataTableCell>
          <CelulaDupla principal={n.produto} apoio={moeda(n.valor)} />
        </DataTableCell>
        <DataTableCell>
          <CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom={tomDaEtapa(n.etapa)} />
        </DataTableCell>
        <DataTableCell ultima><CelulaAcoes /></DataTableCell>
      </DataTableRow>
    ))}
  </DataTable>
  <Pagination resumo="Mostrando 10 de 37 negócios" paginas={4} atual={pagina} onIr={setPagina} />
</>`}
        nota={
          <>
            As larguras entram como <strong>proporção</strong> (<Chip>peso</Chip>), não como pixel: a
            tabela reparte o espaço que tem e aguenta zoom. O <Chip>minimo</Chip> de cada coluna é o
            piso — quando a soma deles não cabe, a tabela rola na horizontal em vez de espremer.
          </>
        }
      >
        <div className="w-full overflow-hidden rounded-md bg-card">
          <DataTableToolbar rotulo="Total de resultados" total="37 negócios" />

          <DataTable colunas={colunas} className="rounded-none">
            {carteira.map((n) => (
              <DataTableRow key={n.id}>
                <DataTableCell primeira>
                  <CelulaLead nome={n.nome} etiquetas={n.etiquetas.map(comStatus)} />
                </DataTableCell>
                <DataTableCell>
                  <CelulaDupla principal={n.produto} apoio={moeda(n.valor)} />
                </DataTableCell>
                <DataTableCell>
                  <CelulaTexto>{n.atividades}</CelulaTexto>
                </DataTableCell>
                <DataTableCell>
                  <Atendente nome={n.atendente} />
                </DataTableCell>
                <DataTableCell>
                  <CelulaProgresso etapa={n.etapa} percentual={n.percentual} tom={tomDaEtapa(n.etapa)} />
                </DataTableCell>
                <DataTableCell>
                  <CelulaEstatisticas
                    itens={[
                      { valor: `${n.aberto}d`, rotulo: "Em aberto" },
                      { valor: `${n.naEtapa}d`, rotulo: "Tempo na etapa" },
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
            className="px-3 py-2.5"
            resumo="Mostrando 10 de 37 negócios"
            paginas={4}
            atual={pagina}
            onIr={setPagina}
          />
        </div>
        <Legenda>
          <strong>Role a tabela para o lado</strong> para ver Dados e ações: a coluna de leitura
          desta página é mais estreita que a soma dos pisos das colunas. Não é defeito do preview — é
          o mesmo que acontece numa tela estreita, e é o comportamento que o componente escolhe em
          vez de espremer sete colunas. A paginação também funciona: clique nos números e repare que{" "}
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
            (<Chip>coluna=&quot;lead&quot;</Chip>) para seguir a ordem e a visibilidade. Dois cliques na alça ajustam a coluna ao conteúdo. Teclado: setas na alça
            redimensionam, Enter ajusta ao conteúdo, o menu move a coluna, Enter ou Espaço seleciona a linha e as setas andam entre elas.
          </>
        }
      >
        <TabelaAjustavel />
      </Secao>

      <Secao
        titulo="Agrupada"
        spec="por etapa · por atendente"
        descricao="A mesma tabela em grupos. O botão Agrupar da barra escolhe a coluna que agrupa (ou o menu da coluna, em Agrupar por); cada grupo tem o caret que recolhe, quantas linhas tem e o total à direita. Ordenar continua valendo dentro de cada grupo."
        codigo={codigoAgrupada}
        nota={
          <>
            Agrupar segue a regra da ordenação: os ajustes guardam só a coluna do grupo e os grupos recolhidos;
            a tela monta os grupos com <Chip>agruparPor</Chip> — que aceita a ordem do funil — e desenha um{" "}
            <Chip>DataTableGrupo</Chip> antes das linhas de cada um. Só as colunas com{" "}
            <Chip>agrupavel</Chip> entram no menu do botão — que é o mesmo botão do Colunas, e fica{" "}
            <Chip>soft</Chip> com o grupo ativo, como o Filtros do Header. Recolher um grupo tira as linhas dele da
            tabela; as setas da seleção pulam a linha do grupo.
          </>
        }
      >
        <TabelaAgrupada />
      </Secao>

      <Secao
        titulo="Seleção em massa"
        spec="caixa · Shift+clique · barra de ações"
        descricao="Marque linhas pela caixa; a do cabeçalho marca todas as que estão na tela e fica parte marcada no meio do caminho. Shift+clique marca a faixa entre a última caixa e esta. Com algo marcado, a barra sobe embaixo com as ações em massa; Escape ou o X limpam."
        codigo={codigoSelecao}
        nota={
          <>
            A tabela só sabe quais linhas estão na tela; quem guarda os ids escolhidos é a tela (
            <Chip>useSelecaoDaTabela</Chip>), como na ordenação. A caixa entra sozinha nas linhas com{" "}
            <Chip>chave</Chip>; <Chip>nome</Chip> dá o nome acessível. As ações da barra são da tela — aqui viram um
            Toast; no CRM, mover de etapa, atribuir, exportar, excluir. A tela atual do CRM tem a caixa na linha e as
            ações no ⋯ de cada uma; a barra é o que falta lá para agir em muitas de uma vez.
          </>
        }
      >
        <TabelaComSelecao />
      </Secao>

      <Secao
        titulo="Edição na célula"
        spec="clique · Enter salva · Escape desfaz"
        descricao="Valor e atividades editam no lugar: em repouso é o texto com o lápis no hover; clicar vira um campo na própria célula, sem trocar de tela nem de linha. Enter e sair do campo salvam; Escape desfaz."
        codigo={codigoEdicao}
        nota={
          <>
            <Chip>CelulaEditavel</Chip> guarda o texto cru e mostra o formatado (<Chip>formatar</Chip>: a moeda,
            aqui). Só chama <Chip>aoSalvar</Chip> quando o texto mudou; quem grava é a tela. É o pedido do cliente
            (2026-09-26): editar os dados na tabela, nas células. Para campo com regra (data, seleção), abra o Drawer.
          </>
        }
      >
        <TabelaEditavel />
      </Secao>

      <Secao
        titulo="Confortável"
        spec="layout=confortavel · linha alta · o desenho do arquivo"
        descricao="A tabela nasce densa: linha de 36px, recuo 8, traço entre colunas e entre linhas — a grade de lista que o time pediu (referência: Twenty). Esta é a outra leitura, a do arquivo, com respiro: para relatório ou para poucas linhas com muito conteúdo por célula."
        codigo={codigoConfortavel}
        nota={
          <>
            É a mesma tabela com <Chip>layout=&quot;confortavel&quot;</Chip>: as células sabem o layout e voltam a duas
            linhas (nome com as etiquetas embaixo, valor com a linha de apoio). Sem a prop, vale a{" "}
            <Chip>densa</Chip>. <Chip>padrao</Chip> é o nome antigo de <Chip>confortavel</Chip> e continua aceito.
          </>
        }
      >
        <TabelaConfortavel />
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
          resolução, que é a família de bugs #83285, #80170 e #79852. Cada coluna tem um piso
          (<Chip>minimo</Chip>); quando a soma deles não cabe, a tabela rola na horizontal em vez de
          espremer.
        </p>
        <p>
          A barra de progresso não é um retângulo decorativo: é{" "}
          <Chip>role=&quot;progressbar&quot;</Chip> com valor e rótulo. Uma barra sem isso não diz
          nada a quem não enxerga, e a etapa do funil é justamente o dado que a linha existe para
          mostrar.
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
      <Toaster />
    </PaginaDS>
  );
}
