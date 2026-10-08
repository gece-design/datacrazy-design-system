"use client";

import * as React from "react";
import { Avatar, type AvatarProps } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Cartão de catálogo — um registro num catálogo em cartões: quem é (iniciais
 * na cor que o nome sorteia, nome e uma descrição de até duas linhas), as
 * ações dele no canto e, embaixo do traço, o que se compara de um para o
 * outro — as métricas. Nasceu como o cartão do agente de IA (2026-10-02) e
 * virou peça em 2026-10-07, a pedido do cliente: tudo que a tela mostra é
 * componente do design system.
 *
 * O cartão não sabe o que é um agente: recebe `nome`, `descricao`, `acoes`
 * (um `BotaoDeAcoes`) e `metricas` (`rotulo` + `valor`, que pode ser um
 * número, uma `Tag` ou um traço apagado). Numa grade (`gradeDeCartoes`) os
 * cartões da mesma fileira têm a mesma altura e as métricas alinham no pé.
 */

export type MetricaDoCartao = {
  rotulo: string;
  /** Um número, uma `Tag`, um texto — ou `null` para o traço apagado. */
  valor: React.ReactNode;
  /** Quando há mais de uma, a que cresce para ocupar o que sobra (as outras ficam no tamanho do conteúdo). */
  cresce?: boolean;
  /** O `title` da célula: o valor inteiro quando o visível corta, ou o porquê do traço. */
  titulo?: string;
};

export interface CartaoDeCatalogoProps extends React.HTMLAttributes<HTMLDivElement> {
  nome: string;
  /** Até duas linhas; o texto inteiro fica no `title`. */
  descricao?: string;
  /** A foto, ou a cor do disco de iniciais. Sem nada: iniciais na cor que o nome sorteia. */
  avatar?: Pick<AvatarProps, "src" | "tom" | "iniciais">;
  /** O `BotaoDeAcoes` do item, no canto. */
  acoes?: React.ReactNode;
  /** O pé, embaixo do traço. Sem métricas, não há pé. */
  metricas?: MetricaDoCartao[];
  /** O que vai no lugar do valor vazio. Padrão: "—". */
  vazio?: string;
}

export const CartaoDeCatalogo = React.forwardRef<HTMLDivElement, CartaoDeCatalogoProps>(
  ({ nome, descricao, avatar, acoes, metricas, vazio = "—", className, ...props }, ref) => (
    // recuo 12 e vão 12: cartão de lista, mais enxuto que o Card do dashboard
    <Card ref={ref} className={cn("h-full gap-3 p-3", className)} {...props}>
      <div className="flex w-full min-w-0 items-start gap-2">
        <Avatar nome={nome} size="md" iniciais={avatar?.iniciais ?? "duas"} tom={avatar?.tom ?? "auto"} src={avatar?.src} aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="truncate text-h4 text-foreground" title={nome}>
            {nome}
          </h2>
          {descricao ? (
            // duas linhas e corta: o texto inteiro fica no `title`
            <p className="line-clamp-2 text-body-sm text-muted-foreground" title={descricao}>
              {descricao}
            </p>
          ) : null}
        </div>
        {acoes}
      </div>

      {metricas && metricas.length > 0 ? (
        // `mt-auto`: na mesma fileira os cartões têm a mesma altura, e os números ficam alinhados no pé
        <dl className="mt-auto flex w-full min-w-0 items-start gap-4 border-t border-border pt-3">
          {metricas.map((m) => (
            <div key={m.rotulo} className={cn("flex flex-col gap-1", m.cresce ? "min-w-0 flex-1" : "shrink-0")}>
              <dt className="text-caption text-muted-foreground">{m.rotulo}</dt>
              <dd title={m.titulo} className={cn("flex items-center", m.cresce ? "min-w-0" : "h-[22px] text-h4 tabular-nums text-foreground")}>
                {m.valor ?? <span className="text-subtle-foreground">{vazio}</span>}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Card>
  ),
);
CartaoDeCatalogo.displayName = "CartaoDeCatalogo";
