"use client";

import * as React from "react";
import { gradeDeCartoes } from "@/lib/campo";
import { blocoDaTela } from "@/lib/estados";
import { cn } from "@/lib/utils";

/**
 * Skeleton — o modelo de carregamento de página: a forma do que vai chegar,
 * em blocos cinza que brilham. O brilho é um degradê que vai de uma ponta à
 * outra e volta (`animate-brilho`, ciclo de 1,4 s), e para quando a pessoa
 * pediu menos movimento ao sistema. Pedido do cliente em 2026-10-08
 * ("modelo de carregamento de página"; o humano: "skeleton loading com
 * animação de gradient indo e voltando") — ADR-078.
 *
 * `Skeleton` é o bloco. Os outros montam, com ele, o que cada tela tem:
 * linhas de texto, a tabela, a grade de cartões, o quadro, a conversa, o
 * painel. `SkeletonDaTela` é a tela inteira carregando, no padrão de fundo
 * (o bloco branco sobre o cinza), pronta para o lugar do conteúdo.
 */

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      // o bloco é o cinza da página (`background`: `muted` some sobre o branco do cartão); por cima,
      // uma banda clara de `card` com o dobro da largura do bloco — a animação desliza a posição dela
      className={cn("animate-brilho rounded-md bg-background bg-gradient-to-r from-transparent via-card/60 to-transparent bg-[length:200%_100%]", className)}
      {...props}
    />
  );
}

const LARGURAS = ["w-full", "w-11/12", "w-4/5", "w-full", "w-3/4"];

/** Linhas de texto de 12px, a última mais curta, como um parágrafo. */
export function SkeletonDeTexto({ linhas = 3, className }: { linhas?: number; className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {Array.from({ length: linhas }, (_, i) => (
        <Skeleton key={i} className={cn("h-3", i === linhas - 1 ? "w-3/5" : LARGURAS[i % LARGURAS.length])} />
      ))}
    </div>
  );
}

/** A tabela densa: cabeçalho e linhas de 36px, a primeira coluna com as iniciais. */
export function SkeletonDaTabela({ linhas = 8, colunas = 5, className }: { linhas?: number; colunas?: number; className?: string }) {
  const cols = Array.from({ length: colunas }, (_, i) => i);
  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="flex h-9 items-center gap-4 border-b border-border px-3">
        {cols.map((c) => (
          <Skeleton key={c} className={cn("h-2.5", c === 0 ? "flex-[2]" : "flex-1")} />
        ))}
      </div>
      {Array.from({ length: linhas }, (_, r) => (
        <div key={r} className="flex h-9 items-center gap-4 border-b border-border px-3 last:border-b-0">
          {cols.map((c) =>
            c === 0 ? (
              <div key={c} className="flex flex-[2] items-center gap-2">
                <Skeleton className="size-6 shrink-0 rounded-full" />
                <Skeleton className={cn("h-3", r % 3 === 0 ? "w-4/5" : r % 3 === 1 ? "w-3/5" : "w-2/3")} />
              </div>
            ) : (
              <Skeleton key={c} className={cn("h-3 flex-1", (r + c) % 4 === 0 && "max-w-[60%]")} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

/** Um cartão de catálogo: iniciais, nome, duas linhas e as três métricas no pé. */
export function SkeletonDoCartao({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-3", className)}>
      <div className="flex items-start gap-2">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
          <Skeleton className="h-3.5 w-3/5" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
      <div className="mt-auto flex items-start gap-4 border-t border-border pt-3">
        {[0, 1, 2].map((m) => (
          <div key={m} className={cn("flex flex-col gap-1.5", m === 1 ? "flex-1" : "w-12")}>
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** A grade de cartões de catálogo. */
export function SkeletonDeCartoes({ quantidade = 6, className }: { quantidade?: number; className?: string }) {
  return (
    <ul className={cn(gradeDeCartoes, "gap-3", className)}>
      {Array.from({ length: quantidade }, (_, i) => (
        <li key={i} className="min-w-0">
          <SkeletonDoCartao />
        </li>
      ))}
    </ul>
  );
}

/** O quadro: colunas com dois ou três cartões cada. */
export function SkeletonDoQuadro({ colunas = 4, className }: { colunas?: number; className?: string }) {
  return (
    <div className={cn("flex w-full gap-2 overflow-hidden p-3", className)}>
      {Array.from({ length: colunas }, (_, c) => (
        <div key={c} className="flex w-[240px] shrink-0 flex-col gap-1.5 rounded-lg border border-border bg-card p-1.5">
          <div className="flex h-6 items-center gap-2 px-1">
            <Skeleton className="size-2.5 rounded-full" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="ml-auto h-3 w-8" />
          </div>
          {Array.from({ length: 3 - (c % 2) }, (_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-md border border-border p-2">
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3 w-2/5" />
              <div className="flex items-center justify-between gap-2 pt-1">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="size-5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** O atendimento: a lista de conversas, a conversa e o lead ao lado. */
export function SkeletonDaConversa({ className }: { className?: string }) {
  const baloes = ["w-3/5", "w-2/5", "w-1/2", "w-2/3", "w-1/3"];
  return (
    <div className={cn("flex min-h-0 w-full flex-1", className)}>
      <div className="hidden w-[320px] shrink-0 flex-col border-r border-border md:flex">
        <div className="flex h-10 items-center gap-3 border-b border-border px-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className={cn("h-3", i % 2 ? "w-2/5" : "w-3/5")} />
              <Skeleton className="h-2.5 w-4/5" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-2.5 w-24" />
          </div>
          <Skeleton className="ml-auto h-7 w-20" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          {baloes.map((w, i) => (
            <Skeleton key={i} className={cn("h-9", w, i % 2 ? "self-end rounded-br-sm" : "rounded-bl-sm")} />
          ))}
        </div>
        <div className="border-t border-border p-3">
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
      <div className="hidden w-[300px] shrink-0 flex-col gap-3 border-l border-border p-4 xl:flex">
        <div className="flex items-center gap-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
        <SkeletonDeTexto linhas={4} />
        <SkeletonDeTexto linhas={3} className="pt-2" />
      </div>
    </div>
  );
}

/** O painel: a fileira de KPIs e os cartões de gráfico. */
export function SkeletonDoPainel({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 xl:col-span-2">
          <Skeleton className="h-3.5 w-40" />
          <div className="flex h-40 items-end gap-3 px-2">
            {[40, 70, 55, 90, 65, 80, 50, 75].map((h, i) => (
              <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
          <Skeleton className="h-3.5 w-32" />
          <SkeletonDeTexto linhas={5} />
        </div>
      </div>
    </div>
  );
}

/** O fluxo: três blocos ligados numa folha. */
export function SkeletonDoCanvas({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex min-h-[320px] w-full flex-1 items-start gap-16 overflow-hidden p-8", className)}>
      {[0, 1, 2].map((i) => (
        <div key={i} className={cn("flex w-[264px] shrink-0 flex-col gap-2 rounded-lg border border-border bg-card p-3", i === 1 && "mt-16")}>
          <div className="flex items-center gap-2">
            <Skeleton className="size-7" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
          <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="size-2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export type ModeloDeCarregamento = "tabela" | "cartoes" | "quadro" | "conversa" | "painel" | "canvas";

export interface SkeletonDaTelaProps {
  /** A forma do que vai chegar: a lista, a grade, o quadro, o chat, o painel ou o fluxo. */
  modelo: ModeloDeCarregamento;
  /** O que o leitor de tela ouve. Padrão "Carregando…". */
  rotulo?: string;
  className?: string;
}

/**
 * A tela inteira carregando: o conteúdo no padrão de fundo (o bloco branco
 * sobre o cinza, recuo 12), com a forma da tela que vem. Anuncia "Carregando…"
 * uma vez e marca a região como ocupada.
 */
export function SkeletonDaTela({ modelo, rotulo = "Carregando…", className }: SkeletonDaTelaProps) {
  const conteudo = {
    tabela: (
      <div className={cn(blocoDaTela, "flex min-h-0 flex-col")}>
        <div className="flex h-11 items-center gap-3 border-b border-border px-3">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
        <SkeletonDaTabela linhas={12} colunas={6} />
      </div>
    ),
    cartoes: <SkeletonDeCartoes quantidade={6} />,
    quadro: <SkeletonDoQuadro colunas={5} />,
    conversa: <div className={cn(blocoDaTela, "flex min-h-[480px] flex-1")}>{<SkeletonDaConversa />}</div>,
    painel: <SkeletonDoPainel />,
    canvas: <div className={cn(blocoDaTela, "flex flex-1 bg-muted")}>{<SkeletonDoCanvas />}</div>,
  }[modelo];

  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cn("flex min-h-0 flex-1 flex-col", modelo === "quadro" ? "" : "p-3", className)}>
      <span className="sr-only">{rotulo}</span>
      {conteudo}
    </div>
  );
}
