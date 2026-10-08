"use client";

import * as React from "react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Estado vazio — a tela (ou a área) quando não há nada para mostrar. Duas
 * variações, pedidas pelo cliente em 2026-10-08 ("variações de telas sem
 * nada — ícone e nada"):
 *
 * - **com ícone**: a área inteira está vazia — nenhum lead, nenhum agente,
 *   a busca não achou nada. O ícone num disco `muted`, o título, uma frase
 *   que diz o porquê e a ação que tira do vazio (criar, limpar a busca).
 * - **sem ícone** ("nada"): dentro de uma lista, coluna ou cartão, onde a
 *   ilustração seria ruído. Só o título e, se precisar, a frase.
 *
 * O componente não decide o texto: a tela diz por que está vazio ("Nenhum
 * lead com essa busca", "Nenhuma conversa finalizada hoje") — ADR-077.
 */

export interface EstadoVazioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Com ícone, a área inteira está vazia. Sem ele, é o "nada" dentro de uma lista, coluna ou cartão. */
  icone?: Icon;
  titulo: string;
  /** Por que está vazio, ou o que fazer. Até duas linhas. */
  descricao?: string;
  /** O que tira do vazio: um `Button` (criar, importar, limpar a busca). */
  acao?: React.ReactNode;
  /** `md` para a área da tela; `sm` dentro de coluna, lista ou cartão. */
  tamanho?: "md" | "sm";
}

export function EstadoVazio({ icone: Icone, titulo, descricao, acao, tamanho = "md", className, ...props }: EstadoVazioProps) {
  const sm = tamanho === "sm";
  return (
    // `status`: quando a busca passa a não achar nada, o leitor de tela ouve o porquê
    <div
      role="status"
      className={cn("flex w-full flex-col items-center justify-center text-center", sm ? "gap-0.5 px-3 py-4" : "gap-1 px-6 py-10", className)}
      {...props}
    >
      {Icone ? (
        <span aria-hidden="true" className={cn("mb-2 grid shrink-0 place-items-center rounded-full bg-muted text-muted-foreground", sm ? "size-8" : "size-12")}>
          <Icone size={sm ? 16 : 20} weight="regular" />
        </span>
      ) : null}
      <p className={cn("text-foreground", sm ? "text-label-lg" : "text-h4")}>{titulo}</p>
      {descricao ? <p className={cn("max-w-[40ch] text-muted-foreground", sm ? "text-body-sm" : "text-body-md")}>{descricao}</p> : null}
      {acao ? <div className={cn("flex flex-wrap items-center justify-center gap-2", sm ? "mt-2" : "mt-3")}>{acao}</div> : null}
    </div>
  );
}
