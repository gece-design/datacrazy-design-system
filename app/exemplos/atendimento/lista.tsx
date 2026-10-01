"use client";

import { Globe } from "@phosphor-icons/react";

import { Avatar } from "@/components/ui/avatar";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { Tabs } from "@/components/ui/tabs";
import { focoInterno, rolagemDiscreta } from "@/lib/estados";
import { cn } from "@/lib/utils";
import type { Canal, Conversa, Situacao } from "./dados";

/* A coluna das conversas. Uma superfície só, com traço entre as linhas — sem
   cartão dentro de cartão (referência: Twenty e Attio). A busca e os filtros
   ficam no Header da tela; aqui, só as abas de situação e a lista. */

/** O ícone do canal — a lista, a conversa e o filtro usam o mesmo. Marca é
 *  `IconeDeMarca`; o que não é marca é Phosphor. `rotulo` quando o ícone aparece sem o nome ao lado. */
export function IconeDoCanal({ canal, tamanho = 14, rotulo }: { canal: Canal; tamanho?: 12 | 14 | 16; rotulo?: string }) {
  if (canal === "WhatsApp") return <IconeDeMarca marca="whatsapp" tamanho={tamanho} rotulo={rotulo} />;
  if (canal === "Instagram") return <IconeDeMarca marca="instagram" tamanho={tamanho} rotulo={rotulo} />;
  return <Globe size={tamanho} weight="regular" role={rotulo ? "img" : undefined} aria-label={rotulo} aria-hidden={rotulo ? undefined : true} className="shrink-0 text-muted-foreground" />;
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
  return (
    <section aria-label="Conversas" className={cn("flex min-h-0 flex-col border-border md:border-r", className)}>
      <Tabs
        id="atendimento-situacao"
        rotulo="Situação das conversas"
        atual={aba}
        aoEscolher={(v) => aoMudarAba(v as Situacao)}
        itens={ABAS.map((a) => ({ valor: a.valor, rotulo: contagem[a.valor] ? `${a.rotulo} · ${contagem[a.valor]}` : a.rotulo }))}
        className="shrink-0 border-b border-border px-3"
      />
      {conversas.length === 0 ? (
        <p className="p-4 text-body-sm text-muted-foreground">Nenhuma conversa aqui.</p>
      ) : (
        <ul className={cn("min-h-0 flex-1 overflow-y-auto", rolagemDiscreta)}>
          {conversas.map((c) => {
            const { texto, hora } = previa(c);
            const aberta = c.id === abertaId;
            return (
              <li key={c.id} className="border-b border-border">
                {/* check-tokens:ignore botao-cru — a linha inteira é o alvo: duas linhas de conteúdo não cabem no Button */}
                <button
                  type="button"
                  aria-current={aberta ? "true" : undefined}
                  onClick={() => aoAbrir(c.id)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left transition-colors",
                    aberta ? "bg-accent" : "hover:bg-muted",
                    focoInterno,
                  )}
                >
                  <Avatar nome={c.nome} size="sm" className="shrink-0" aria-hidden="true" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-baseline gap-2">
                      <span className={cn("min-w-0 flex-1 truncate text-label-lg", aberta ? "text-primary" : "text-foreground")}>{c.nome}</span>
                      <span className="shrink-0 text-caption tabular-nums text-muted-foreground">{hora}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <IconeDoCanal canal={c.canal} rotulo={c.canal} />
                      <span className={cn("min-w-0 flex-1 truncate text-body-sm", c.naoLidas ? "text-foreground" : "text-muted-foreground")}>{texto}</span>
                      {c.naoLidas ? (
                        <span
                          aria-label={`${c.naoLidas} não lidas`}
                          className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-label-sm tabular-nums text-primary-foreground"
                        >
                          {c.naoLidas}
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
