import type { Metadata } from "next";
import { Comparacao } from "./comparacao";

export const metadata: Metadata = {
  title: "Proposta visual · DataCrazy",
  description: "A mesma tela hoje e na proposta: superfície única, topo de uma linha, navegação estreita e registro em painel lateral",
};

/**
 * Página de proposta, fora do catálogo: a lista do pipeline como está hoje e
 * como ficaria mais perto do Twenty e do Attio, com um interruptor entre as
 * duas. Serve para decidir — nada aqui mudou o design system.
 */
export default function PropostaVisualPage() {
  return <Comparacao />;
}
