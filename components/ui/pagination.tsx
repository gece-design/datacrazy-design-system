"use client";

import * as React from "react";
import { CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { cn } from "@/lib/utils";

import { foco, desabilitado } from "@/lib/estados";
/**
 * Pagination — os controles de página, com o resumo do que está sendo mostrado.
 *
 * Espelho do nó `261:790` do Figma (rodapé da Data Table). Nasceu dentro da
 * tabela e saiu de lá porque não é dela: qualquer lista longa pagina, e o
 * roadmap já reservava um slot próprio.
 *
 * As regras de quando aparece e como se comporta estão em docs/regras.md
 * § Paginação (ADR-079). As que moram aqui: com uma página só a barra não
 * existe; com mais de 7 páginas, a primeira, a última, a atual com as
 * vizinhas e "…" onde pulou; no celular, só Anterior · "3 de 5" · Próxima;
 * o resumo é `aria-live`, para o leitor de tela ouvir a troca.
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

/** Quantas posições a fileira de números tem, no máximo: 1 … 4 5 6 … 12. */
const POSICOES = 7;

/**
 * Os números que aparecem: todos até 7 páginas; acima disso, a primeira, a
 * última, a atual com uma vizinha de cada lado e "…" onde pulou. Perto das
 * pontas a janela estica para manter as 7 posições (1 2 3 4 5 … 12).
 */
export function janelaDePaginas(total: number, atual: number): (number | "…")[] {
  if (total <= POSICOES) return Array.from({ length: total }, (_, i) => i + 1);
  let inicio = Math.max(2, atual - 1);
  let fim = Math.min(total - 1, atual + 1);
  if (atual <= 4) {
    inicio = 2;
    fim = 5;
  }
  if (atual >= total - 3) {
    inicio = total - 4;
    fim = total - 1;
  }
  const itens: (number | "…")[] = [1];
  if (inicio > 2) itens.push("…");
  for (let n = inicio; n <= fim; n++) itens.push(n);
  if (fim < total - 1) itens.push("…");
  itens.push(total);
  return itens;
}

export type RotulosDaPaginacao = {
  /** O nome da região. */
  navegacao: string;
  anterior: string;
  proxima: string;
  /** O nome de cada número. */
  pagina: (n: number) => string;
  /** O que aparece no celular no lugar dos números. */
  posicao: (atual: number, total: number) => string;
  /** O botão do tamanho e cada opção do menu. */
  porPagina: (n: number) => string;
  /** O nome do menu de tamanho. */
  tamanho: string;
};

/** Os textos em pt-BR. No CRM, a tela passa os do next-intl por `rotulos`. */
export const ROTULOS_DA_PAGINACAO: RotulosDaPaginacao = {
  navegacao: "Paginação",
  anterior: "Anterior",
  proxima: "Próxima",
  pagina: (n) => `Página ${n}`,
  posicao: (atual, total) => `${atual} de ${total}`,
  porPagina: (n) => `${n} por página`,
  tamanho: "Itens por página",
};

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Texto à esquerda. Ex.: "Mostrando 21–40 de 84 leads". Anunciado ao mudar. */
  resumo?: string;
  /** Quantas páginas existem. Com uma só, a barra não desenha nada (regra P2). */
  paginas: number;
  /** Página atual, começando em 1. */
  atual: number;
  onIr?: (pagina: number) => void;
  /** As opções de tamanho (20, 50, 100). Sem elas, não há o menu. */
  tamanhos?: number[];
  porPagina?: number;
  aoMudarTamanho?: (porPagina: number) => void;
  rotulos?: Partial<RotulosDaPaginacao>;
  /** A versão de celular em qualquer largura (Anterior · "3 de 5" · Próxima, sem o tamanho): para um rodapé estreito, como o de um painel lateral. */
  compacta?: boolean;
  /** @deprecated Use `rotulos.anterior`. */
  textoAnterior?: string;
  /** @deprecated Use `rotulos.proxima`. */
  textoProxima?: string;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, resumo, paginas, atual, onIr, tamanhos, porPagina, aoMudarTamanho, rotulos: rotulosDeFora, compacta = false, textoAnterior, textoProxima, ...props }, ref) => {
    const r = { ...ROTULOS_DA_PAGINACAO, ...rotulosDeFora };
    if (textoAnterior) r.anterior = textoAnterior;
    if (textoProxima) r.proxima = textoProxima;
    const [menuAberto, setMenuAberto] = React.useState(false);
    const botaoTamanho = React.useRef<HTMLButtonElement>(null);
    const comTamanho = Boolean(tamanhos?.length && porPagina && aoMudarTamanho) && !compacta;

    // uma página só: a barra inteira some (P2) — o total já está na toolbar, e a lista acaba onde acaba;
    // o tamanho também some: só faz sentido quando há mais de uma página
    if (paginas <= 1) return null;

    return (
      <nav ref={ref} aria-label={r.navegacao} className={cn("flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2", className)} {...props}>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {comTamanho ? (
            <>
              {/* o tamanho só na largura de mesa: no celular a página é 20 e pronto */}
              <Button
                ref={botaoTamanho}
                variant="tertiary"
                size="sm"
                aria-haspopup="menu"
                aria-expanded={menuAberto}
                aria-label={`${r.tamanho}: ${r.porPagina(porPagina!)}`}
                onClick={() => setMenuAberto((a) => !a)}
                className="hidden sm:inline-flex"
              >
                {r.porPagina(porPagina!)}
                <CaretDown size={12} weight="bold" aria-hidden="true" />
              </Button>
              <Menu
                aberto={menuAberto}
                gatilho={botaoTamanho}
                rotulo={r.tamanho}
                itens={tamanhos!.map((n) => ({ id: String(n), rotulo: r.porPagina(n), tipo: "radio" as const, marcado: n === porPagina, aoAtivar: () => aoMudarTamanho!(n) }))}
                aoFechar={(devolver = true) => {
                  setMenuAberto(false);
                  if (devolver) botaoTamanho.current?.focus();
                }}
              />
            </>
          ) : null}
          {/* `aria-live`: ao trocar de página, o leitor de tela ouve "Mostrando 21–40 de 84 leads" */}
          {resumo ? (
            <p aria-live="polite" className="text-body-md text-muted-foreground">
              {resumo}
            </p>
          ) : null}
        </div>

        {paginas > 1 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" className={cn(botao, inativo, "gap-1")} disabled={atual <= 1} onClick={() => onIr?.(atual - 1)}>
              <CaretLeft size={12} weight="bold" aria-hidden="true" className="shrink-0" />
              {r.anterior}
            </button>

            {/* no celular os números não cabem: "3 de 5" no lugar deles */}
            <span className={cn("px-1 text-label-lg tabular-nums text-muted-foreground", !compacta && "sm:hidden")}>{r.posicao(atual, paginas)}</span>

            <div className={cn("hidden items-center gap-1.5", !compacta && "sm:flex")}>
              {janelaDePaginas(paginas, atual).map((n, i) =>
                n === "…" ? (
                  <span key={`salto-${i}`} aria-hidden="true" className="w-7 text-center text-label-lg text-muted-foreground">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    /* `aria-current` é o que diz "você está aqui" para quem não vê a
                       cor. Sem isso o leitor de tela anuncia seis botões iguais. */
                    aria-current={n === atual ? "page" : undefined}
                    aria-label={r.pagina(n)}
                    className={cn(botao, "w-7 px-0 tabular-nums", n === atual ? ativo : inativo)}
                    onClick={() => onIr?.(n)}
                  >
                    {n}
                  </button>
                ),
              )}
            </div>

            <button type="button" className={cn(botao, inativo, "gap-1")} disabled={atual >= paginas} onClick={() => onIr?.(atual + 1)}>
              {r.proxima}
              <CaretRight size={12} weight="bold" aria-hidden="true" className="shrink-0" />
            </button>
          </div>
        ) : null}
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";
