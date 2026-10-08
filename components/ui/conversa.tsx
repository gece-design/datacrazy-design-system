"use client";

import * as React from "react";
import { ArrowLeft, Check, Checks, NotePencil, PaperPlaneRight } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Textarea } from "@/components/ui/textarea";
import { rolagemDiscreta } from "@/lib/estados";
import { cn } from "@/lib/utils";

/**
 * Conversa — o chat do atendimento em peças: a casca (`Conversa`), o cabeçalho
 * com o contato (`ConversaCabecalho`), o log que rola (`Mensagens`), cada
 * balão (`Balao`), a linha do sistema (`EventoDaConversa`), o divisor de dia
 * (`DivisorDeDia`) e o compositor com mensagem e nota interna (`Compositor`).
 *
 * Nasceu da tela de Atendimento (2026-09-29) e virou componente em 2026-10-07,
 * a pedido do cliente na reunião de 02/10. Sem par no arquivo: as classes da
 * tela são a verdade. Nada aqui conhece o domínio — a tela diz quem fala, o
 * que diz e o que os botões do cabeçalho e do compositor fazem; as peças só
 * desenham e devolvem. Todo texto vem de `rotulos` (`ROTULOS_DA_CONVERSA` é a
 * fábrica em pt-BR; no CRM, next-intl).
 */

export type RotulosDaConversa = {
  /** Nome do botão que volta para a lista, no celular. */
  voltar: string;
  /** Nome da região das mensagens (o log). */
  mensagens: string;
  /** O selo em cima do texto da nota. */
  notaInterna: string;
  /** Nome do tique simples: a mensagem saiu. */
  enviada: string;
  /** Nome do tique duplo: o contato leu. */
  lida: string;
  /** Nome do grupo mensagem/nota do compositor. */
  modo: string;
  /** A opção e o rótulo do campo no modo mensagem. */
  mensagem: string;
  /** A opção e o rótulo do campo no modo nota. */
  nota: string;
  /** Placeholder do campo no modo mensagem. */
  escreverMensagem: string;
  /** Placeholder do campo no modo nota. */
  escreverNota: string;
  /** Nome do botão de enviar no modo mensagem. */
  enviar: string;
  /** Nome do botão de enviar no modo nota. */
  salvarNota: string;
  /** A dica ao lado do grupo, de 640px para cima. */
  dica: string;
};

export const ROTULOS_DA_CONVERSA: RotulosDaConversa = {
  voltar: "Voltar para as conversas",
  mensagens: "Mensagens",
  notaInterna: "Nota interna",
  enviada: "Enviada",
  lida: "Lida",
  modo: "O que você vai escrever",
  mensagem: "Mensagem",
  nota: "Nota interna",
  escreverMensagem: "Escreva uma mensagem",
  escreverNota: "Só o time vê esta nota",
  enviar: "Enviar mensagem",
  salvarNota: "Salvar nota",
  dica: "Enter envia · Shift + Enter quebra a linha",
};

/* ------------------------------------------------------------ a casca --- */

export interface ConversaProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Nome da região. Ex.: "Conversa com Marina Alvarenga". */
  rotulo: string;
  /** O `ConversaCabecalho`. */
  cabecalho?: React.ReactNode;
  /** As mensagens: o `Mensagens` com os balões dentro. */
  children: React.ReactNode;
  /** O `Compositor`. */
  rodape?: React.ReactNode;
}

/** A coluna da conversa: bloco branco com traço, cabeçalho em cima, mensagens no meio e o compositor embaixo. No celular ocupa a tela, sem traço. */
export function Conversa({ rotulo, cabecalho, rodape, className, children, ...props }: ConversaProps) {
  return (
    <section
      aria-label={rotulo}
      className={cn("flex min-h-0 min-w-0 flex-1 flex-col bg-card md:overflow-hidden md:rounded-md md:border md:border-border", className)}
      {...props}
    >
      {cabecalho}
      {children}
      {rodape}
    </section>
  );
}

/* -------------------------------------------------------- o cabeçalho --- */

export interface ConversaCabecalhoProps {
  /** Quem está do outro lado: o nome dá a inicial e, com `src`, a foto. */
  avatar: { nome: string; src?: string };
  /** O nome do contato. */
  titulo: string;
  /** A linha de apoio: o ícone do canal, o canal e o telefone. */
  subtitulo?: React.ReactNode;
  /** Os botões à direita: assumir, transferir, finalizar, mostrar o lead. */
  acoes?: React.ReactNode;
  /** Com ela, o botão de voltar aparece abaixo de 768px — a tela mostra a lista OU a conversa. */
  aoVoltar?: () => void;
  rotulos?: Partial<RotulosDaConversa>;
  className?: string;
}

/** 48px, como o Header da tela: os dois se alinham pelo traço de baixo. */
export function ConversaCabecalho({ avatar, titulo, subtitulo, acoes, aoVoltar, rotulos, className }: ConversaCabecalhoProps) {
  const r = { ...ROTULOS_DA_CONVERSA, ...rotulos };
  return (
    <header className={cn("flex h-12 shrink-0 items-center gap-2 border-b border-border px-3", className)}>
      {aoVoltar ? (
        <Button variant="ghost" size="icon-sm" aria-label={r.voltar} onClick={aoVoltar} className="md:hidden">
          <ArrowLeft size={16} weight="regular" aria-hidden="true" />
        </Button>
      ) : null}
      <Avatar nome={avatar.nome} src={avatar.src} size="sm" className="shrink-0" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 title={titulo} className="truncate text-label-lg text-foreground">
          {titulo}
        </h2>
        {subtitulo ? <p className="flex min-w-0 items-center gap-1 text-caption text-muted-foreground">{subtitulo}</p> : null}
      </div>
      {acoes}
    </header>
  );
}

/* ------------------------------------------------------- as mensagens --- */

export interface MensagensProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Muda quando chega mensagem ou a conversa troca: o log rola até o fim. Ex.: `${conversa.id}:${mensagens.length}`. */
  chave: string | number;
  rotulos?: Partial<RotulosDaConversa>;
  children: React.ReactNode;
}

/** O log que rola, com a barra discreta do DS. Só ele rola — nunca a página. */
export function Mensagens({ chave, rotulos, className, children, ...props }: MensagensProps) {
  const r = { ...ROTULOS_DA_CONVERSA, ...rotulos };
  const log = React.useRef<HTMLDivElement>(null);
  // conversa nova ou mensagem nova: a última fica à vista. Rola o próprio log,
  // não `scrollIntoView` — numa página com vários chats, a página pularia.
  React.useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chave]);
  return (
    <div
      ref={log}
      role="log"
      aria-label={r.mensagens}
      // 20 embaixo: a última mensagem respira antes do compositor
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 pb-5 pt-3", rolagemDiscreta, className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ o balão --- */

export interface BalaoProps {
  /** Quem escreveu. `contato` fica à esquerda; `atendente` e `nota` à direita. A nota é do time: o contato não vê. */
  de: "contato" | "atendente" | "nota";
  /** O texto. Quebras de linha ficam. */
  children: React.ReactNode;
  hora: string;
  /** Quem escreveu, antes da hora. Só aparece em `atendente` e `nota`. */
  autor?: string;
  /** Só em `atendente`: um tique (saiu) ou dois em azul (o contato leu). */
  situacao?: "enviada" | "lida";
  rotulos?: Partial<RotulosDaConversa>;
  className?: string;
}

/** Recebida à esquerda em `muted`; enviada à direita em `button-soft`; a nota interna à direita, em `warning` com selo. */
export function Balao({ de, children, hora, autor, situacao, rotulos, className }: BalaoProps) {
  const r = { ...ROTULOS_DA_CONVERSA, ...rotulos };
  const minha = de === "atendente";
  const nota = de === "nota";
  return (
    // a mensagem chega subindo 4px: nova ou ao abrir a conversa
    <div
      className={cn(
        "flex max-w-[72%] flex-col gap-0.5 motion-safe:animate-surgir",
        minha || nota ? "self-end items-end" : "self-start items-start",
        className,
      )}
    >
      <div
        className={cn(
          "whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-body-lg text-foreground",
          nota ? "border border-warning/25 bg-warning/10" : minha ? "bg-button-soft" : "bg-muted",
        )}
      >
        {nota ? (
          <span className="mb-1 flex items-center gap-1 text-label-sm uppercase text-warning">
            <NotePencil size={12} weight="regular" aria-hidden="true" />
            {r.notaInterna}
          </span>
        ) : null}
        {children}
      </div>
      <span className="flex items-center gap-1 text-caption tabular-nums text-muted-foreground">
        {autor && (minha || nota) ? `${autor} · ` : ""}
        {hora}
        {minha && situacao ? (
          situacao === "lida" ? (
            <Checks size={14} weight="regular" aria-label={r.lida} className="text-primary" />
          ) : (
            <Check size={14} weight="regular" aria-label={r.enviada} />
          )
        ) : null}
      </span>
    </div>
  );
}

/* ---------------------------------------------- o evento e o divisor --- */

export interface EventoDaConversaProps {
  /** O que aconteceu. Ex.: "Esther assumiu o atendimento". */
  children: React.ReactNode;
  hora: string;
  className?: string;
}

/** O que o sistema registrou (assumiu, transferiu, finalizou): uma linha ao centro, não um balão. */
export function EventoDaConversa({ children, hora, className }: EventoDaConversaProps) {
  return (
    <p className={cn("self-center py-1 text-center text-caption text-muted-foreground", className)}>
      {children} · {hora}
    </p>
  );
}

export interface DivisorDeDiaProps {
  /** O dia, já em texto. Ex.: "Hoje", "Ontem", "20/09". */
  children: React.ReactNode;
  className?: string;
}

/** O dia entre dois traços, quando as mensagens trocam de dia. */
export function DivisorDeDia({ children, className }: DivisorDeDiaProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 py-1 text-caption text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------- o compositor --- */

export type ModoDoCompositor = "mensagem" | "nota";

export interface CompositorProps {
  /** O rascunho. Estado da tela: trocar de conversa zera. */
  valor: string;
  aoMudar: (valor: string) => void;
  /** Mensagem para o contato ou nota interna para o time. Estado da tela. */
  modo: ModoDoCompositor;
  aoMudarModo: (modo: ModoDoCompositor) => void;
  /** Enter ou o botão, com texto: recebe o texto sem os espaços das pontas e o campo esvazia. */
  aoEnviar: (texto: string) => void;
  /** Botões entre o campo e o de enviar: respostas rápidas, anexar. */
  acoes?: React.ReactNode;
  rotulos?: Partial<RotulosDaConversa>;
  /** Trava o grupo, o campo e o botão. */
  desabilitado?: boolean;
  /** Com ele, o compositor some e esta frase fica no lugar: a conversa finalizada. */
  finalizado?: React.ReactNode;
  className?: string;
}

/** O rodapé da conversa: o grupo mensagem/nota com a dica ao lado, o campo que cresce até 6 linhas, as ações e o enviar. */
export function Compositor({ valor, aoMudar, modo, aoMudarModo, aoEnviar, acoes, rotulos, desabilitado, finalizado, className }: CompositorProps) {
  const r = { ...ROTULOS_DA_CONVERSA, ...rotulos };
  const nota = modo === "nota";

  function enviar() {
    const limpo = valor.trim();
    if (!limpo || desabilitado) return;
    aoEnviar(limpo);
    aoMudar("");
  }

  return (
    <footer className={cn("flex shrink-0 flex-col gap-2 border-t border-border p-3", className)}>
      {finalizado ? (
        <p className="text-body-sm text-muted-foreground">{finalizado}</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <SegmentedControl
              rotulo={r.modo}
              atual={modo}
              aoEscolher={(v) => aoMudarModo(v as ModoDoCompositor)}
              itens={[
                { valor: "mensagem", rotulo: r.mensagem, disabled: desabilitado },
                { valor: "nota", rotulo: r.nota, disabled: desabilitado },
              ]}
              className="bg-muted"
            />
            <p className="hidden text-caption text-muted-foreground sm:block">{r.dica}</p>
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              rotulo={nota ? r.nota : r.mensagem}
              rotuloOculto
              linhas={1}
              maximoDeLinhas={6}
              placeholder={nota ? r.escreverNota : r.escreverMensagem}
              value={valor}
              disabled={desabilitado}
              onChange={(e) => aoMudar(e.target.value)}
              onKeyDown={(e) => {
                // Enter envia; Shift + Enter quebra a linha. Enter no meio de
                // uma composição (teclado com acentos por composição) não envia.
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  enviar();
                }
              }}
            />
            {acoes}
            <Button size="icon-lg" aria-label={nota ? r.salvarNota : r.enviar} disabled={desabilitado || !valor.trim()} onClick={enviar}>
              <PaperPlaneRight size={16} weight="regular" aria-hidden="true" />
            </Button>
          </div>
        </>
      )}
    </footer>
  );
}
