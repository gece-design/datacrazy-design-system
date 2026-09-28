"use client";

import { Fragment, useRef, useState } from "react";
import { Buildings, Clock, User, WarningCircle } from "@phosphor-icons/react";

import {
  CelulaEditavel,
  CelulaLead,
  CelulaProgresso,
  DataTable,
  DataTableCell,
  DataTableRow,
  DataTableToolbar,
  DataTableGrupo,
  BarraDeSelecao,
  useSelecaoDaTabela,
  agruparPor,
  ordenarPor,
  type AjustesDaTabela,
  type ColunaTabela,
} from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import { GRUPOS_TAGS, etapaPor, moeda, tagsDe, type Etapa, type EtapaId, type Lead } from "./dados";
import { ICONES_DOS_CANAIS } from "./quadro";

import { foco } from "@/lib/estados";
/* A mesma carteira do quadro, na Table do design system. É o argumento de que
   a visão não é a tela: o dado é um só, a leitura é que muda — e por isso a
   linha mostra o que o cartão mostra, do mesmo jeito: as tags com a bolinha
   de status, a etapa na cor da coluna, o atendente com foto, a origem com o
   ícone, os dias com o relógio ou o aviso (humano, 2026-09-24: "a tabela está
   super diferente do kanban"). */

/** As colunas da lista. Ficam aqui, exportadas, porque os botões Agrupar e
 *  Colunas moram na fileira do Header da tela, não na barra da tabela. */
export const COLUNAS_DA_LISTA: ColunaTabela[] = [
  { chave: "lead", rotulo: "Lead", peso: 3 },
  { chave: "empresa", rotulo: "Empresa", peso: 2.5 },
  { chave: "etapa", rotulo: "Etapa", peso: 2, agrupavel: true },
  { chave: "origem", rotulo: "Origem", peso: 1.3, agrupavel: true },
  { chave: "responsavel", rotulo: "Atendente", peso: 1.5, agrupavel: true },
  { chave: "valor", rotulo: "Valor", peso: 1.5, alinharFim: true },
  { chave: "dias", rotulo: "Parado", peso: 1, alinharFim: true },
];

/* O que cada coluna lê do lead, para ordenar. Etapa ordena pela posição no funil. */
function valorDe(etapas: Etapa[]) {
  return (lead: Lead, chave: string): string | number => {
    switch (chave) {
      case "lead": return lead.nome;
      case "empresa": return lead.empresa;
      case "etapa": return etapaPor(etapas, lead.etapa).percentual;
      case "origem": return lead.canal;
      case "responsavel": return lead.responsavel;
      case "valor": return lead.valor;
      case "dias": return lead.dias;
      default: return "";
    }
  };
}

export function Lista({
  etapas,
  leads,
  aberto,
  aoAbrir,
  aoMoverEmMassa,
  aoExcluirEmMassa,
  aoEditar,
  ajustes,
}: {
  etapas: Etapa[];
  leads: Lead[];
  /** Os ajustes vivem na tela: os botões Agrupar e Colunas ficam no Header. */
  ajustes: AjustesDaTabela;
  /** O lead aberto no drawer: é a linha selecionada. */
  aberto?: string | null;
  aoAbrir: (lead: Lead) => void;
  /** Ações em massa da barra: mover as marcadas de etapa e excluir as marcadas. */
  aoMoverEmMassa: (ids: string[], etapa: EtapaId) => void;
  aoExcluirEmMassa: (ids: string[]) => void;
  /** Edita um campo do lead na célula (o valor, por enquanto). */
  aoEditar: (id: string, campos: Partial<Lead>) => void;
}) {
  const total = leads.reduce((n, l) => n + l.valor, 0);
  // Seleção em massa: a tela guarda os ids; a tabela desenha as caixas (2026-09-24).
  const selecao = useSelecaoDaTabela();
  const [menuEtapa, setMenuEtapa] = useState(false);
  const botaoEtapa = useRef<HTMLButtonElement>(null);
  const linhas = ordenarPor(leads, ajustes.ordem, valorDe(etapas));
  // Grupos por etapa seguem o funil; por atendente, a ordem em que aparecem.
  const grupos = ajustes.grupo
    ? agruparPor(
        linhas,
        (l) =>
          ajustes.grupo === "etapa"
            ? { id: l.etapa, rotulo: etapaPor(etapas, l.etapa).rotulo }
            : ajustes.grupo === "origem"
              ? { id: l.canal, rotulo: l.canal }
              : { id: l.responsavel, rotulo: l.responsavel },
        ajustes.grupo === "etapa" ? etapas.map((e) => e.id) : undefined,
      )
    : null;
  const linha = (lead: Lead) => {
            const etapa = etapaPor(etapas, lead.etapa);
            const parado = lead.dias >= 7;
            const Tipo = lead.tipo === "empresa" ? Buildings : User;
            const Canal = ICONES_DOS_CANAIS[lead.canal];
            return (
              // Selecionar a linha abre o lead: o Drawer é o detalhe (mestre-detalhe da referência).
              <DataTableRow key={lead.id} chave={lead.id} nome={lead.nome} selecionada={lead.id === aberto} aoSelecionar={() => aoAbrir(lead)}>
                <DataTableCell coluna="lead">
                  {/* O nome é o que abre o lead: linha inteira clicável seria um
                      `tr` fingindo de botão, sem foco e sem nome acessível. */}
                  <button
                    type="button"
                    onClick={() => aoAbrir(lead)}
                    className={`w-full rounded-sm text-left ${foco}`}
                  >
                    <CelulaLead nome={lead.nome} etiquetas={tagsDe(GRUPOS_TAGS, lead.tags).map((t) => ({ rotulo: t.rotulo, status: t.status }))} />
                  </button>
                </DataTableCell>
                <DataTableCell coluna="empresa">
                  {/* o mesmo par do cartão, numa linha: ícone do tipo + empresa · cidade */}
                  <p title={`${lead.empresa} · ${lead.cidade}`} className="flex min-w-0 items-center gap-1 text-label-lg text-foreground">
                    <Tipo size={14} weight="regular" aria-hidden="true" className="shrink-0 text-muted-foreground" />
                    <span className="min-w-0 truncate">{lead.empresa}</span>
                    <span className="shrink-0 truncate text-caption text-muted-foreground">· {lead.cidade}</span>
                  </p>
                </DataTableCell>
                <DataTableCell coluna="etapa">
                  <CelulaProgresso etapa={etapa.rotulo} percentual={etapa.percentual} tom={etapa.cor} />
                </DataTableCell>
                <DataTableCell coluna="origem">
                  <p className="flex min-w-0 items-center gap-1.5 text-label-lg text-foreground" title={`Origem: ${lead.canal}`}>
                    <Canal size={14} weight="regular" aria-hidden="true" className="shrink-0 text-muted-foreground" />
                    <span className="min-w-0 truncate">{lead.canal}</span>
                  </p>
                </DataTableCell>
                <DataTableCell coluna="responsavel">
                  <Tag foto="/ds/atendente.png">{lead.responsavel}</Tag>
                </DataTableCell>
                <DataTableCell coluna="valor" className="text-right">
                  {/* edita no lugar: clique, digite, Enter (cliente, 2026-09-26) */}
                  <CelulaEditavel
                    alinharFim
                    valor={String(lead.valor)}
                    formatar={(v) => moeda(Number(v) || 0)}
                    inputMode="numeric"
                    rotulo={`Editar valor de ${lead.nome}`}
                    aoSalvar={(v) => aoEditar(lead.id, { valor: Number(v.replace(/\D/g, "")) || 0 })}
                  />
                </DataTableCell>
                <DataTableCell coluna="dias" className="text-right">
                  <span
                    title={parado ? `Parado há ${lead.dias} dias em ${etapa.rotulo}` : `${lead.dias} dia(s) em ${etapa.rotulo}`}
                    className={cn("inline-flex items-center gap-1 text-label-lg tabular-nums", parado ? "text-warning" : "text-muted-foreground")}
                  >
                    {parado ? <WarningCircle size={14} weight="regular" aria-hidden="true" /> : <Clock size={14} weight="regular" aria-hidden="true" />}
                    {lead.dias}d
                  </span>
                </DataTableCell>
              </DataTableRow>
            );
  };
  return (
    <div className="min-h-0 flex-1 overflow-y-auto pl-4 pr-4 pb-4 lg:pl-1 [scrollbar-width:thin]">
      <div className="w-full overflow-hidden rounded-md bg-card">
        {/* Só o resumo: Agrupar e Colunas estão na fileira do Header (humano, 2026-09-24). */}
        <DataTableToolbar layout="densa" rotulo="Negócios em aberto" total={`${leads.length} leads · ${moeda(total)}`} />
        {/* densa: a grade de lista à la Twenty (cliente, 2026-09-27) */}
        <DataTable layout="densa" colunas={COLUNAS_DA_LISTA} ajustes={ajustes} selecao={selecao} className="rounded-none border-0">
          {grupos
            ? grupos.map((g) => (
                <Fragment key={g.id}>
                  <DataTableGrupo
                    rotulo={g.rotulo}
                    quantidade={g.itens.length}
                    resumo={moeda(g.itens.reduce((t, l) => t + l.valor, 0))}
                    aberto={!ajustes.recolhidos.includes(g.id)}
                    aoAlternar={() => ajustes.alternarGrupo(g.id)}
                  />
                  {ajustes.recolhidos.includes(g.id) ? null : g.itens.map(linha)}
                </Fragment>
              ))
            : linhas.map(linha)}
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
            Mover para etapa
          </Button>
          <Menu
            aberto={menuEtapa}
            gatilho={botaoEtapa}
            rotulo="Mover para etapa"
            itens={etapas.map((e) => ({
              id: e.id,
              rotulo: e.rotulo,
              aoAtivar: () => {
                aoMoverEmMassa(selecao.selecionados, e.id);
                selecao.limpar();
              },
            }))}
            aoFechar={(devolver = true) => {
              setMenuEtapa(false);
              if (devolver) botaoEtapa.current?.focus();
            }}
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              aoExcluirEmMassa(selecao.selecionados);
              selecao.limpar();
            }}
          >
            Excluir
          </Button>
        </BarraDeSelecao>
      </div>
    </div>
  );
}
