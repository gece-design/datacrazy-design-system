"use client";

import { Copy, PencilSimple, Trash } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { AcoesDoItem } from "./acoes";
import type { Agente } from "./dados";

/**
 * O cartão de um agente: quem é (iniciais na cor que o nome sorteia, nome e o
 * que ele faz) e, embaixo do traço, o que se compara de um para o outro —
 * score, modelo de IA e quantas ferramentas ele usa.
 */
export function CartaoAgente({
  agente,
  aoEditar,
  aoDuplicar,
  aoExcluir,
}: {
  agente: Agente;
  aoEditar: () => void;
  aoDuplicar: () => void;
  aoExcluir: () => void;
}) {
  return (
    // recuo 12 e vão 12: cartão de lista, mais enxuto que o Card do dashboard
    <Card className="h-full gap-3 p-3">
      <div className="flex w-full min-w-0 items-start gap-2">
        <Avatar nome={agente.nome} size="md" iniciais="duas" tom="auto" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="truncate text-h4 text-foreground" title={agente.nome}>
            {agente.nome}
          </h2>
          {/* duas linhas e corta: o texto inteiro fica no `title` */}
          <p className="line-clamp-2 text-body-sm text-muted-foreground" title={agente.descricao}>
            {agente.descricao}
          </p>
        </div>
        <AcoesDoItem
          rotulo={`Ações de ${agente.nome}`}
          itens={[
            { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: aoEditar },
            { id: "duplicar", rotulo: "Duplicar", icone: Copy, aoAtivar: aoDuplicar },
            { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: aoExcluir },
          ]}
        />
      </div>

      {/* `mt-auto`: na mesma fileira os cartões têm a mesma altura, e os números ficam alinhados no pé */}
      <dl className="mt-auto flex w-full min-w-0 items-start gap-4 border-t border-border pt-3">
        <div className="flex shrink-0 flex-col gap-1">
          <dt className="text-caption text-muted-foreground">Score</dt>
          <dd className="flex h-[22px] items-center text-h4 tabular-nums text-foreground">
            {agente.score === null ? (
              <span className="text-subtle-foreground" title="Ainda sem score">
                —
              </span>
            ) : (
              agente.score
            )}
          </dd>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <dt className="text-caption text-muted-foreground">Modelo</dt>
          <dd className="flex min-w-0">
            <Tag title={agente.modelo}>{agente.modelo}</Tag>
          </dd>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <dt className="text-caption text-muted-foreground">Ferramentas</dt>
          <dd className="flex h-[22px] items-center text-h4 tabular-nums text-foreground">{agente.ferramentas}</dd>
        </div>
      </dl>
    </Card>
  );
}
