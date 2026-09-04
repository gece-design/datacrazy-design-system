import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Data Table — espelho do component set "Data Table" do Figma (node 331:1354).
 *
 * O arquivo desenha com caixas empilhadas. Aqui é `<table>` de verdade: numa
 * tabela de CRM o leitor de tela precisa anunciar linha e coluna, e ordenação,
 * seleção e navegação por teclado se apoiam nessa estrutura depois. A aparência
 * é a mesma; o que muda é o que a máquina entende.
 *
 * As larguras do arquivo (230 · 170 · 160 · 150 · 200 · 180 · 42) viram
 * proporção, não pixel: a tabela do CRM vive em telas de largura variável, e
 * coluna fixa em px é o bug #83285 esperando acontecer.
 */

export type ColunaTabela = {
  chave: string;
  rotulo: string;
  /** Largura relativa. Os números do arquivo servem direto como peso. */
  peso: number;
  /** Coluna de ações fica à direita e não tem rótulo visível. */
  alinharFim?: boolean;
};

export const DataTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { colunas: ColunaTabela[] }
>(({ className, colunas, children, ...props }, ref) => {
  const total = colunas.reduce((n, c) => n + c.peso, 0);
  return (
    <div
      ref={ref}
      className={cn("w-full overflow-hidden rounded-md bg-card", className)}
      {...props}
    >
      {/* O scroll horizontal vive aqui: numa tela estreita a tabela rola,
          em vez de espremer coluna até o texto virar uma letra por linha. */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1160px] table-fixed border-collapse">
          <colgroup>
            {colunas.map((c) => (
              <col key={c.chave} style={{ width: `${(c.peso / total) * 100}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-background">
              {colunas.map((c, i) => (
                <th
                  key={c.chave}
                  scope="col"
                  className={cn(
                    "px-2 py-2.5 text-left align-middle text-label-md font-medium text-muted-foreground",
                    c.alinharFim && "text-right",
                    i === 0 && "pl-5",
                    i === colunas.length - 1 && "pr-5",
                  )}
                >
                  {/* A coluna de ações tem rótulo vazio no arquivo. Vazio para
                      quem vê, nomeado para quem ouve. */}
                  {c.rotulo || <span className="sr-only">Ações</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
});
DataTable.displayName = "DataTable";

/**
 * Uma linha. O traço superior é do token `card` — ver a divergência na doc.
 *
 * O hover NÃO está no arquivo: foi decisão do humano (2026-09-04). Numa lista
 * de 37 linhas o realce sob o cursor é o que evita ler o dado da linha errada.
 * O token é `overlay/item-hover`, que existe para exatamente isto e clareia nos
 * dois temas.
 */
export const DataTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("border-t border-card transition-colors hover:bg-overlay-item-hover", className)}
    {...props}
  />
));
DataTableRow.displayName = "DataTableRow";

export const DataTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { primeira?: boolean; ultima?: boolean }
>(({ className, primeira, ultima, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-2 py-3 align-middle",
      primeira && "pl-5",
      ultima && "pr-5",
      className,
    )}
    {...props}
  />
));
DataTableCell.displayName = "DataTableCell";

/* ------------------------------------------------------------- Toolbar -- */

export function DataTableToolbar({
  rotulo,
  total,
  children,
}: {
  /** Linha de cima, pequena. Ex.: "Total de resultados". */
  rotulo: string;
  /** Linha de baixo, em destaque. Ex.: "37 negócios". */
  total: string;
  /** Os filtros à direita. */
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 px-5 py-4">
      <div className="flex flex-col gap-[3px]">
        <p className="text-body-sm text-muted-foreground">{rotulo}</p>
        <p className="text-h3 text-foreground">{total}</p>
      </div>
      {children ? <div className="flex flex-wrap items-start gap-2">{children}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------- Células -- */

/** Nome com as etiquetas embaixo — a primeira coluna do arquivo. */
export function CelulaLead({ nome, etiquetas = [] }: { nome: string; etiquetas?: string[] }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <p className="w-full truncate text-h4 text-foreground" title={nome}>
        {nome}
      </p>
      {etiquetas.length > 0 ? (
        <div className="flex min-w-0 items-start gap-1">
          {etiquetas.map((e, i) => (
            /* A primeira etiqueta é a que classifica; as outras são contexto.
               O arquivo desenha raio 3, que não está na escala — aqui vai o
               degrau mais próximo (sm, 4px). Divergência registrada na doc. */
            <Badge
              key={e}
              variant={i === 0 ? "primary" : "neutral"}
              className="max-w-full truncate rounded-sm border-transparent px-1.5 py-0.5"
              title={e}
            >
              {e}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Valor em cima, complemento embaixo. Ex.: produto e preço. */
export function CelulaDupla({ principal, apoio }: { principal: string; apoio?: string }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5">
      <p className="w-full truncate text-h4 text-foreground" title={principal}>
        {principal}
      </p>
      {apoio ? (
        <p className="w-full truncate text-body-sm text-muted-foreground" title={apoio}>
          {apoio}
        </p>
      ) : null}
    </div>
  );
}

/** Texto simples de uma linha. `enfase` pinta com `primary`, como o arquivo faz
 *  na coluna de atendente. */
export function CelulaTexto({ children, enfase }: { children: string; enfase?: boolean }) {
  return (
    <p
      className={cn(
        "w-full truncate",
        enfase ? "text-label-lg text-primary" : "text-body-lg text-muted-foreground",
      )}
      title={children}
    >
      {children}
    </p>
  );
}

/** Etapa com a barra de progresso embaixo. */
export function CelulaProgresso({ etapa, percentual }: { etapa: string; percentual: number }) {
  const preenchido = Math.min(100, Math.max(0, percentual));
  return (
    <div className="flex min-w-0 flex-col items-start gap-[7px]">
      <p className="w-full truncate text-label-lg text-foreground" title={etapa}>
        {etapa}
      </p>
      <div
        className="h-[5px] w-full overflow-hidden rounded-sm bg-background"
        role="progressbar"
        aria-valuenow={preenchido}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${etapa}: ${preenchido}%`}
      >
        <div className="h-full rounded-sm bg-primary" style={{ width: `${preenchido}%` }} />
      </div>
    </div>
  );
}

/** Duas estatísticas lado a lado, cada uma com número e rótulo. */
export function CelulaEstatisticas({
  itens,
}: {
  itens: { valor: string; rotulo: string }[];
}) {
  return (
    <div className="flex min-w-0 items-start gap-[18px]">
      {itens.map((i) => (
        <div key={i.rotulo} className="flex min-w-0 shrink-0 flex-col items-start gap-0.5">
          <p className="text-h4 tabular-nums text-foreground">{i.valor}</p>
          <p className="w-full truncate text-caption text-muted-foreground" title={i.rotulo}>
            {i.rotulo}
          </p>
        </div>
      ))}
    </div>
  );
}

/** O botão de ações da linha. No arquivo é só "•••". */
export function CelulaAcoes({ rotulo = "Ações da linha" }: { rotulo?: string }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        aria-label={rotulo}
        className="rounded-sm px-1 text-h4 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span aria-hidden="true">•••</span>
      </button>
    </div>
  );
}
