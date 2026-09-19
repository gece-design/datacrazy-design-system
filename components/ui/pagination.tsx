import * as React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

import { foco, desabilitado } from "@/lib/estados";
/**
 * Pagination — os controles de página, com o resumo do que está sendo mostrado.
 *
 * Espelho do nó `261:790` do Figma (rodapé da Data Table). Nasceu dentro da
 * tabela e saiu de lá porque não é dela: qualquer lista longa pagina, e o
 * roadmap já reservava um slot próprio.
 */

/* Base dos botões. Foco e desabilitado vêm de lib/estados (D21): opacidade por
 * token e cursor de "não dá", com os eventos mantidos (I5, gate B0). A base
 * não é o Button: a fonte aqui é `text-label-lg` (12px), não `text-button`. */
const botao =
  `inline-flex h-7 min-w-7 items-center justify-center rounded-md border px-2.5 text-label-lg transition-colors ${foco} ${desabilitado}`;

/* Inativo e ativo se distinguem por DOIS sinais, não um: o ativo tem fundo
 * `accent` e texto `primary`; o hover do inativo tem o mesmo fundo mas texto
 * `foreground`. Só a borda não bastava — no escuro ela quase some. */
const inativo =
  "border-card bg-background text-muted-foreground enabled:hover:bg-overlay-item-hover enabled:hover:text-foreground";
const ativo = "border-accent bg-accent text-primary";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Texto à esquerda. Ex.: "Mostrando 10 de 37 negócios". */
  resumo?: string;
  /** Quantas páginas existem. */
  paginas: number;
  /** Página atual, começando em 1. */
  atual: number;
  onIr?: (pagina: number) => void;
  /** Rótulos dos extremos. Trocáveis porque a UI é multi-idioma. */
  textoAnterior?: string;
  textoProxima?: string;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      resumo,
      paginas,
      atual,
      onIr,
      textoAnterior = "Anterior",
      textoProxima = "Próxima",
      ...props
    },
    ref,
  ) => (
    <nav
      ref={ref}
      aria-label="Paginação"
      className={cn("flex w-full flex-wrap items-center justify-between gap-4", className)}
      {...props}
    >
      {resumo ? <p className="text-body-md text-muted-foreground">{resumo}</p> : <span />}

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className={cn(botao, inativo, "gap-1")}
          disabled={atual <= 1}
          onClick={() => onIr?.(atual - 1)}
        >
          <CaretLeft size={12} weight="bold" aria-hidden="true" className="shrink-0" />
          {textoAnterior}
        </button>

        {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            /* `aria-current` é o que diz "você está aqui" para quem não vê a
               cor. Sem isso o leitor de tela anuncia seis botões iguais. */
            aria-current={n === atual ? "page" : undefined}
            aria-label={`Página ${n}`}
            className={cn(botao, "w-7 px-0 tabular-nums", n === atual ? ativo : inativo)}
            onClick={() => onIr?.(n)}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          className={cn(botao, inativo, "gap-1")}
          disabled={atual >= paginas}
          onClick={() => onIr?.(atual + 1)}
        >
          {textoProxima}
          <CaretRight size={12} weight="bold" aria-hidden="true" className="shrink-0" />
        </button>
      </div>
    </nav>
  ),
);
Pagination.displayName = "Pagination";
