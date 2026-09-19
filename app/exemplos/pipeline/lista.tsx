"use client";

import {
  CelulaDupla,
  CelulaLead,
  CelulaProgresso,
  CelulaTexto,
  DataTable,
  DataTableCell,
  DataTableRow,
  DataTableToolbar,
  type ColunaTabela,
} from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { GRUPOS_TAGS, etapaPor, moeda, tagsDe, type Etapa, type Lead } from "./dados";

import { foco } from "@/lib/estados";
/* A mesma carteira do quadro, na Table do design system. É o argumento de que
   a visão não é a tela: o dado é um só, a leitura é que muda. */

const COLUNAS: ColunaTabela[] = [
  { chave: "lead", rotulo: "Lead", peso: 3 },
  { chave: "empresa", rotulo: "Empresa", peso: 2.5 },
  { chave: "etapa", rotulo: "Etapa", peso: 2 },
  { chave: "responsavel", rotulo: "Atendente", peso: 1.5 },
  { chave: "valor", rotulo: "Valor", peso: 1.5, alinharFim: true },
  { chave: "dias", rotulo: "Parado", peso: 1, alinharFim: true },
];

export function Lista({
  etapas,
  leads,
  aoAbrir,
}: {
  etapas: Etapa[];
  leads: Lead[];
  aoAbrir: (lead: Lead) => void;
}) {
  const total = leads.reduce((n, l) => n + l.valor, 0);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 [scrollbar-width:thin]">
      <div className="w-full overflow-hidden rounded-md bg-card">
        <DataTableToolbar rotulo="Negócios em aberto" total={`${leads.length} leads · ${moeda(total)}`} />

        <DataTable colunas={COLUNAS} className="rounded-none">
          {leads.map((lead) => {
            const etapa = etapaPor(etapas, lead.etapa);
            const parado = lead.dias >= 7;
            return (
              <DataTableRow key={lead.id}>
                <DataTableCell primeira>
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
                <DataTableCell>
                  <CelulaDupla principal={lead.empresa} apoio={lead.cidade} />
                </DataTableCell>
                <DataTableCell>
                  <CelulaProgresso etapa={etapa.rotulo} percentual={etapa.percentual} />
                </DataTableCell>
                <DataTableCell>
                  <CelulaTexto enfase>{lead.responsavel}</CelulaTexto>
                </DataTableCell>
                <DataTableCell className="text-right">
                  <span className="text-label-lg tabular-nums text-foreground">{moeda(lead.valor)}</span>
                </DataTableCell>
                <DataTableCell ultima className="text-right">
                  <span
                    title={`${lead.dias} dia(s) na etapa ${etapa.rotulo}`}
                    className={cn("text-label-lg tabular-nums", parado ? "text-warning" : "text-muted-foreground")}
                  >
                    {lead.dias}d
                  </span>
                </DataTableCell>
              </DataTableRow>
            );
          })}
        </DataTable>
      </div>
    </div>
  );
}
