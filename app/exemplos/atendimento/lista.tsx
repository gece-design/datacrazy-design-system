"use client";

import { Globe } from "@phosphor-icons/react";

import { IconeDeOrigem } from "@/components/ui/icone-de-marca";
import { ListaDeConversas as Lista, type ItemDeConversa } from "@/components/ui/lista-de-conversas";
import type { Canal, Conversa, Situacao } from "./dados";

/* A coluna das conversas: a `ListaDeConversas` do design system, alimentada
   com o que é da tela — o ícone do canal, as abas de situação e a prévia da
   última mensagem. A busca e os filtros ficam no Header da tela. */

/** O que não é marca: o ícone Phosphor de cada canal. A marca o `IconeDeOrigem` resolve sozinho. */
const OUTROS_CANAIS = { Site: Globe };

/** O ícone do canal — a lista, a conversa e o filtro usam o mesmo `IconeDeOrigem` do DS. `rotulo` quando o ícone aparece sem o nome ao lado. */
export function IconeDoCanal({ canal, tamanho = 14, rotulo }: { canal: Canal; tamanho?: 12 | 14 | 16; rotulo?: string }) {
  return <IconeDeOrigem origem={canal} outros={OUTROS_CANAIS} tamanho={tamanho} rotulo={rotulo} />;
}

export const ABAS: { valor: Situacao; rotulo: string }[] = [
  { valor: "aberta", rotulo: "Abertas" },
  { valor: "pendente", rotulo: "Pendentes" },
  { valor: "finalizada", rotulo: "Finalizadas" },
];

/** A última coisa dita, como a lista mostra: quem disse, quando não foi o contato. */
export function previa(c: Conversa) {
  const ultima = [...c.mensagens].reverse().find((m) => m.de !== "sistema") ?? c.mensagens[c.mensagens.length - 1];
  if (!ultima) return { texto: "", hora: "" };
  const quem = ultima.de === "atendente" ? "Você: " : ultima.de === "nota" ? "Nota: " : "";
  return { texto: `${quem}${ultima.texto}`, hora: ultima.dia === "Hoje" ? ultima.hora : ultima.dia };
}

export function ListaDeConversas({
  conversas,
  aba,
  aoMudarAba,
  contagem,
  abertaId,
  aoAbrir,
  className,
}: {
  conversas: Conversa[];
  aba: Situacao;
  aoMudarAba: (aba: Situacao) => void;
  /** Quantas conversas em cada situação, já com busca e filtros aplicados. */
  contagem: Record<Situacao, number>;
  abertaId: string | null;
  aoAbrir: (id: string) => void;
  className?: string;
}) {
  // o componente não sabe o que é uma conversa: cada linha vai pronta
  const itens: ItemDeConversa[] = conversas.map((c) => {
    const { texto, hora } = previa(c);
    return { id: c.id, nome: c.nome, canal: <IconeDoCanal canal={c.canal} rotulo={c.canal} />, previa: texto, hora, naoLidas: c.naoLidas };
  });
  return (
    <Lista
      abas={ABAS.map((a) => ({ ...a, contagem: contagem[a.valor] }))}
      aba={aba}
      aoMudarAba={(v) => aoMudarAba(v as Situacao)}
      itens={itens}
      abertaId={abertaId}
      aoAbrir={aoAbrir}
      rotulos={{ regiao: "Conversas", abas: "Situação das conversas", vazio: "Nenhuma conversa aqui.", naoLidas: (n) => `${n} não lidas` }}
      className={className}
    />
  );
}
