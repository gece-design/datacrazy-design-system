"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { Tabs } from "@/components/ui/tabs";
import { focoInterno, rolagemDiscreta } from "@/lib/estados";
import { cn } from "@/lib/utils";

/**
 * ListaDeConversas — a coluna das conversas do atendimento: abas de situação
 * em cima e, embaixo, uma linha por conversa com avatar, nome, hora, o ícone
 * do canal, a última coisa dita e quantas não lidas. Uma superfície só, com
 * traço entre as linhas — sem cartão dentro de cartão (referência: Twenty e
 * Attio). Busca e filtros ficam no Header da tela.
 *
 * Nasceu da tela de Atendimento (2026-09-29) e virou componente em 2026-10-07,
 * a pedido do cliente na reunião de 02/10. Sem par no arquivo. Não conhece o
 * domínio: recebe os itens já prontos (a prévia, a hora, o ícone do canal) e
 * devolve o id clicado. Todo texto vem de `rotulos`.
 */

export type AbaDeConversas = {
  valor: string;
  rotulo: string;
  /** Quantas conversas nela, já com busca e filtros aplicados: vai ao lado do rótulo. Zero não aparece. */
  contagem?: number;
};

export type ItemDeConversa = {
  id: string;
  nome: string;
  /** Foto. Sem ela, a inicial do nome. */
  avatar?: string;
  /** O ícone do canal, já pronto: `IconeDeMarca` ou um glifo Phosphor de 14. */
  canal?: React.ReactNode;
  /** A última coisa dita, como a lista mostra. Ex.: "Você: Mandei a proposta". */
  previa: string;
  /** Quando foi. Ex.: "09:13" ou "Ontem". */
  hora: string;
  /** Com valor, a prévia escurece e o contador aparece. */
  naoLidas?: number;
};

export type RotulosDaListaDeConversas = {
  /** Nome da região. */
  regiao: string;
  /** Nome do grupo de abas. */
  abas: string;
  /** O que aparece quando a aba está sem conversa. */
  vazio: string;
  /** Nome do contador. Ex.: (n) => `${n} não lidas`. */
  naoLidas: (n: number) => string;
};

export const ROTULOS_DA_LISTA_DE_CONVERSAS: RotulosDaListaDeConversas = {
  regiao: "Conversas",
  abas: "Situação das conversas",
  vazio: "Nenhuma conversa aqui.",
  naoLidas: (n) => `${n} ${n === 1 ? "não lida" : "não lidas"}`,
};

export interface ListaDeConversasProps {
  abas: AbaDeConversas[];
  /** O `valor` da aba atual. Estado da tela. */
  aba: string;
  aoMudarAba: (aba: string) => void;
  /** As conversas da aba atual, na ordem em que aparecem. A tela filtra. */
  itens: ItemDeConversa[];
  /** A conversa aberta ao lado: a linha fica em `accent`. */
  abertaId: string | null;
  aoAbrir: (id: string) => void;
  rotulos?: Partial<RotulosDaListaDeConversas>;
  className?: string;
}

export function ListaDeConversas({ abas, aba, aoMudarAba, itens, abertaId, aoAbrir, rotulos, className }: ListaDeConversasProps) {
  const r = { ...ROTULOS_DA_LISTA_DE_CONVERSAS, ...rotulos };
  const id = React.useId().replace(/:/g, "");
  return (
    <section aria-label={r.regiao} className={cn("flex min-h-0 flex-col bg-card md:overflow-hidden md:rounded-md md:border md:border-border", className)}>
      <Tabs
        id={`conversas-${id}`}
        rotulo={r.abas}
        atual={aba}
        aoEscolher={aoMudarAba}
        itens={abas.map((a) => ({ valor: a.valor, rotulo: a.contagem ? `${a.rotulo} · ${a.contagem}` : a.rotulo }))}
        className="shrink-0 border-b border-border px-3"
      />
      {itens.length === 0 ? (
        <EstadoVazio tamanho="sm" titulo={r.vazio} />
      ) : (
        <ul className={cn("min-h-0 flex-1 overflow-y-auto", rolagemDiscreta)}>
          {itens.map((item) => {
            const aberta = item.id === abertaId;
            return (
              <li key={item.id} className="border-b border-border">
                {/* check-tokens:ignore botao-cru — a linha inteira é o alvo: duas linhas de conteúdo não cabem no Button */}
                <button
                  type="button"
                  aria-current={aberta ? "true" : undefined}
                  onClick={() => aoAbrir(item.id)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left transition-colors",
                    aberta ? "bg-accent" : "hover:bg-muted",
                    focoInterno,
                  )}
                >
                  <Avatar nome={item.nome} src={item.avatar} size="sm" className="shrink-0" aria-hidden="true" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-baseline gap-2">
                      <span title={item.nome} className={cn("min-w-0 flex-1 truncate text-label-lg", aberta ? "text-primary" : "text-foreground")}>
                        {item.nome}
                      </span>
                      <span className="shrink-0 text-caption tabular-nums text-muted-foreground">{item.hora}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {item.canal}
                      <span title={item.previa} className={cn("min-w-0 flex-1 truncate text-body-sm", item.naoLidas ? "text-foreground" : "text-muted-foreground")}>
                        {item.previa}
                      </span>
                      {item.naoLidas ? (
                        <span
                          aria-label={r.naoLidas(item.naoLidas)}
                          className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-label-sm tabular-nums text-primary-foreground"
                        >
                          {item.naoLidas}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
