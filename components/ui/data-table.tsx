import * as React from "react";
import { DotsThree } from "@phosphor-icons/react/dist/ssr";
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
 *
 * `layout="compacta"` é o `Layout=Compact` que o drawer usa (node 597:5983):
 * traço `border` em volta e entre linhas, recuo de 12px e sem largura mínima.
 */

export type ColunaTabela = {
  chave: string;
  rotulo: string;
  /** Largura relativa. Os números do arquivo servem direto como peso. */
  peso: number;
  /** Coluna de ações fica à direita e não tem rótulo visível. */
  alinharFim?: boolean;
};

type Layout = "padrao" | "compacta";
const LayoutTabela = React.createContext<Layout>("padrao");

export const DataTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { colunas: ColunaTabela[]; layout?: Layout }
>(({ className, colunas, layout = "padrao", children, ...props }, ref) => {
  const total = colunas.reduce((n, c) => n + c.peso, 0);
  const compacta = layout === "compacta";
  return (
    <LayoutTabela.Provider value={layout}>
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-md bg-card",
          compacta && "border border-border",
          className,
        )}
        {...props}
      >
        {/* O scroll horizontal vive aqui: numa tela estreita a tabela rola,
            em vez de espremer coluna até o texto virar uma letra por linha. */}
        <div className="w-full overflow-x-auto">
          <table className={cn("w-full table-fixed border-collapse", !compacta && "min-w-[1160px]")}>
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
                      i === 0 && (compacta ? "pl-3" : "pl-5"),
                      i === colunas.length - 1 && (compacta ? "pr-3" : "pr-5"),
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
    </LayoutTabela.Provider>
  );
});
DataTable.displayName = "DataTable";

/**
 * Uma linha. No layout padrão o traço superior é do token `card` — ver a
 * divergência na doc. No compacto o arquivo usa `border`, e ele aparece.
 *
 * O hover NÃO está no arquivo: foi decisão do humano (2026-09-04). Numa lista
 * de 37 linhas o realce sob o cursor é o que evita ler o dado da linha errada.
 * O token é `overlay/item-hover`, que existe para exatamente isto e clareia nos
 * dois temas.
 */
export const DataTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => {
  const layout = React.useContext(LayoutTabela);
  return (
    <tr
      ref={ref}
      className={cn(
        "border-t transition-colors hover:bg-overlay-item-hover",
        layout === "compacta" ? "border-border" : "border-card",
        className,
      )}
      {...props}
    />
  );
});
DataTableRow.displayName = "DataTableRow";

export const DataTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { primeira?: boolean; ultima?: boolean }
>(({ className, primeira, ultima, ...props }, ref) => {
  const compacta = React.useContext(LayoutTabela) === "compacta";
  return (
    <td
      ref={ref}
      className={cn(
        "px-2 py-3 align-middle",
        primeira && (compacta ? "pl-3" : "pl-5"),
        ultima && (compacta ? "pr-3" : "pr-5"),
        className,
      )}
      {...props}
    />
  );
});
DataTableCell.displayName = "DataTableCell";

/* ------------------------------------------------------------- Toolbar -- */

export function DataTableToolbar({
  rotulo,
  total,
  layout = "padrao",
  children,
}: {
  /** Linha de cima, pequena. Ex.: "Total de resultados". */
  rotulo: string;
  /** Linha de baixo, em destaque. Ex.: "37 negócios". */
  total: string;
  /** `compacta`: sem recuo próprio, rótulo em caption e total em h4. */
  layout?: Layout;
  /** Os filtros à direita. */
  children?: React.ReactNode;
}) {
  const compacta = layout === "compacta";
  return (
    <div className={cn("flex w-full flex-wrap items-center justify-between gap-4", !compacta && "px-5 py-4")}>
      <div className={cn("flex flex-col", compacta ? "gap-0.5" : "gap-[3px]")}>
        <p className={cn("text-muted-foreground", compacta ? "text-caption" : "text-body-sm")}>{rotulo}</p>
        <p className={cn("text-foreground", compacta ? "text-h4" : "text-h3")}>{total}</p>
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

/** O botão de ações da linha. `DotsThree` do Phosphor, como pede a regra de
 *  ícone do DS — o arquivo desenha "•••" no layout padrão e o glifo no compacto. */
export function CelulaAcoes({ rotulo = "Ações da linha" }: { rotulo?: string }) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        aria-label={rotulo}
        title={rotulo}
        className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <DotsThree size={16} weight="regular" aria-hidden="true" />
      </button>
    </div>
  );
}
