"use client";

import { Copy, PencilSimple, Trash } from "@phosphor-icons/react";
import { CartaoDeCatalogo } from "@/components/ui/cartao-de-catalogo";
import { BotaoDeAcoes } from "@/components/ui/menu";
import { Tag } from "@/components/ui/tag";
import type { Agente } from "./dados";

/**
 * O agente como `CartaoDeCatalogo`: quem é (nome e o que ele faz) e, no pé, o
 * que se compara de um para o outro — score, modelo de IA e quantas
 * ferramentas ele usa. O que é do agente mora aqui; o cartão é do DS.
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
    <CartaoDeCatalogo
      nome={agente.nome}
      descricao={agente.descricao}
      acoes={
        <BotaoDeAcoes
          rotulo={`Ações de ${agente.nome}`}
          itens={[
            { id: "editar", rotulo: "Editar", icone: PencilSimple, aoAtivar: aoEditar },
            { id: "duplicar", rotulo: "Duplicar", icone: Copy, aoAtivar: aoDuplicar },
            { id: "excluir", rotulo: "Excluir", icone: Trash, separadorAntes: true, aoAtivar: aoExcluir },
          ]}
        />
      }
      metricas={[
        { rotulo: "Score", valor: agente.score, titulo: agente.score === null ? "Ainda sem score" : undefined },
        { rotulo: "Modelo", valor: <Tag title={agente.modelo}>{agente.modelo}</Tag>, cresce: true },
        { rotulo: "Ferramentas", valor: agente.ferramentas },
      ]}
    />
  );
}
