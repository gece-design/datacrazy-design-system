"use client";

import { Fragment, useRef, useState } from "react";

import {
  CelulaDupla,
  CelulaLead,
  CelulaProgresso,
  CelulaTexto,
  DataTable,
  DataTableCell,
  DataTableRow,
  DataTableToolbar,
  BotaoColunas,
  DataTableGrupo,
  BotaoAgrupar,
  BarraDeSelecao,
  useSelecaoDaTabela,
  agruparPor,
  ordenarPor,
  useAjustesDaTabela,
  type ColunaTabela,
} from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { cn } from "@/lib/utils";
import { GRUPOS_TAGS, etapaPor, moeda, tagsDe, type Etapa, type EtapaId, type Lead } from "./dados";

import { foco } from "@/lib/estados";
/* A mesma carteira do quadro, na Table do design system. É o argumento de que
   a visão não é a tela: o dado é um só, a leitura é que muda. */

const COLUNAS: ColunaTabela[] = [
  { chave: "lead", rotulo: "Lead", peso: 3 },
  { chave: "empresa", rotulo: "Empresa", peso: 2.5 },
  { chave: "etapa", rotulo: "Etapa", peso: 2, agrupavel: true },
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
}: {
  etapas: Etapa[];
  leads: Lead[];
  /** O lead aberto no drawer: é a linha selecionada. */
  aberto?: string | null;
  aoAbrir: (lead: Lead) => void;
  /** Ações em massa da barra: mover as marcadas de etapa e excluir as marcadas. */
  aoMoverEmMassa: (ids: string[], etapa: EtapaId) => void;
  aoExcluirEmMassa: (ids: string[]) => void;
}) {
  const total = leads.reduce((n, l) => n + l.valor, 0);
  // Seleção em massa: a tela guarda os ids; a tabela desenha as caixas (2026-09-24).
  const selecao = useSelecaoDaTabela();
  const [menuEtapa, setMenuEtapa] = useState(false);
  const botaoEtapa = useRef<HTMLButtonElement>(null);
  // Ordem, colunas e larguras ficam salvas por tela (T1, 2026-09-23).
  const ajustes = useAjustesDaTabela(COLUNAS, { memoria: "pipeline-lista" });
  const linhas = ordenarPor(leads, ajustes.ordem, valorDe(etapas));
  // Grupos por etapa seguem o funil; por atendente, a ordem em que aparecem.
  const grupos = ajustes.grupo
    ? agruparPor(
        linhas,
        (l) => (ajustes.grupo === "etapa" ? { id: l.etapa, rotulo: etapaPor(etapas, l.etapa).rotulo } : { id: l.responsavel, rotulo: l.responsavel }),
        ajustes.grupo === "etapa" ? etapas.map((e) => e.id) : undefined,
      )
    : null;
  const linha = (lead: Lead) => {
            const etapa = etapaPor(etapas, lead.etapa);
            const parado = lead.dias >= 7;
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
                    <CelulaLead nome={lead.nome} etiquetas={tagsDe(GRUPOS_TAGS, lead.tags).map((t) => t.rotulo)} />
                  </button>
                </DataTableCell>
                <DataTableCell coluna="empresa">
                  <CelulaDupla principal={lead.empresa} apoio={lead.cidade} />
                </DataTableCell>
                <DataTableCell coluna="etapa">
                  <CelulaProgresso etapa={etapa.rotulo} percentual={etapa.percentual} />
                </DataTableCell>
                <DataTableCell coluna="responsavel">
                  <CelulaTexto enfase>{lead.responsavel}</CelulaTexto>
                </DataTableCell>
                <DataTableCell coluna="valor" className="text-right">
                  <span className="text-label-lg tabular-nums text-foreground">{moeda(lead.valor)}</span>
                </DataTableCell>
                <DataTableCell coluna="dias" className="text-right">
                  <span
                    title={`${lead.dias} dia(s) na etapa ${etapa.rotulo}`}
                    className={cn("text-label-lg tabular-nums", parado ? "text-warning" : "text-muted-foreground")}
                  >
                    {lead.dias}d
                  </span>
                </DataTableCell>
              </DataTableRow>
            );
  };
  return (
    <div className="min-h-0 flex-1 overflow-y-auto pl-4 pr-4 pb-4 lg:pl-1 [scrollbar-width:thin]">
      <div className="w-full overflow-hidden rounded-md bg-card">
        <DataTableToolbar rotulo="Negócios em aberto" total={`${leads.length} leads · ${moeda(total)}`}>
          <BotaoAgrupar ajustes={ajustes} />
          <BotaoColunas ajustes={ajustes} />
        </DataTableToolbar>
        <DataTable colunas={COLUNAS} ajustes={ajustes} selecao={selecao} className="rounded-none">
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
