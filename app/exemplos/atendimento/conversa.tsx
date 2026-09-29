"use client";

import * as React from "react";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowsLeftRight,
  Check,
  Checks,
  Lightning,
  NotePencil,
  PaperPlaneRight,
  Paperclip,
  SidebarSimple,
  UserPlus,
} from "@phosphor-icons/react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { rolagemDiscreta } from "@/lib/estados";
import { cn } from "@/lib/utils";
import { ATENDENTES, EU, RESPOSTAS_RAPIDAS, type Conversa, type Mensagem } from "./dados";
import { ICONES_DOS_CANAIS } from "./lista";

/* A coluna do meio: cabeçalho da conversa, mensagens e o compositor. Mensagem
   recebida à esquerda, enviada à direita; a nota interna é do time (o contato
   não vê) e tem cor própria; o evento do sistema é uma linha, não um balão. */

type Modo = "mensagem" | "nota";

function Balao({ m }: { m: Mensagem }) {
  if (m.de === "sistema") {
    return <p className="self-center py-1 text-center text-caption text-muted-foreground">{m.texto} · {m.hora}</p>;
  }
  const minha = m.de === "atendente";
  const nota = m.de === "nota";
  return (
    <div className={cn("flex max-w-[72%] flex-col gap-0.5", minha || nota ? "self-end items-end" : "self-start items-start")}>
      <div
        className={cn(
          "whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-body-lg text-foreground",
          nota ? "border border-warning/25 bg-warning/10" : minha ? "bg-button-soft" : "bg-muted",
        )}
      >
        {nota ? (
          <span className="mb-1 flex items-center gap-1 text-label-sm uppercase text-warning">
            <NotePencil size={12} weight="regular" aria-hidden="true" />
            Nota interna
          </span>
        ) : null}
        {m.texto}
      </div>
      <span className="flex items-center gap-1 text-caption tabular-nums text-muted-foreground">
        {m.autor && (minha || nota) ? `${m.autor} · ` : ""}
        {m.hora}
        {minha ? (
          m.lida ? (
            <Checks size={14} weight="regular" aria-label="Lida" className="text-primary" />
          ) : (
            <Check size={14} weight="regular" aria-label="Enviada" />
          )
        ) : null}
      </span>
    </div>
  );
}

export function ConversaAberta({
  conversa,
  aoEnviar,
  aoFinalizar,
  aoReabrir,
  aoAssumir,
  aoTransferir,
  painelAberto,
  aoAlternarPainel,
  aoVoltar,
  className,
}: {
  conversa: Conversa;
  aoEnviar: (texto: string, modo: Modo) => void;
  aoFinalizar: () => void;
  aoReabrir: () => void;
  aoAssumir: () => void;
  aoTransferir: (atendente: string) => void;
  painelAberto: boolean;
  aoAlternarPainel: () => void;
  /** Só no celular: volta para a lista. */
  aoVoltar: () => void;
  className?: string;
}) {
  const [modo, setModo] = React.useState<Modo>("mensagem");
  const [texto, setTexto] = React.useState("");
  const [menuTransferir, setMenuTransferir] = React.useState(false);
  const [menuRespostas, setMenuRespostas] = React.useState(false);
  const botaoTransferir = React.useRef<HTMLButtonElement>(null);
  const botaoRespostas = React.useRef<HTMLButtonElement>(null);
  const fim = React.useRef<HTMLDivElement>(null);
  const Canal = ICONES_DOS_CANAIS[conversa.canal];
  const finalizada = conversa.situacao === "finalizada";

  // conversa nova ou mensagem nova: a última fica à vista
  React.useEffect(() => {
    fim.current?.scrollIntoView({ block: "end" });
  }, [conversa.id, conversa.mensagens.length]);
  // trocar de conversa não leva o rascunho junto
  React.useEffect(() => {
    setTexto("");
    setModo("mensagem");
  }, [conversa.id]);

  function enviar() {
    const limpo = texto.trim();
    if (!limpo) return;
    aoEnviar(limpo, modo);
    setTexto("");
  }

  return (
    <section aria-label={`Conversa com ${conversa.nome}`} className={cn("flex min-h-0 min-w-0 flex-1 flex-col", className)}>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <Button variant="ghost" size="icon-sm" aria-label="Voltar para as conversas" onClick={aoVoltar} className="md:hidden">
          <ArrowLeft size={16} weight="regular" />
        </Button>
        <Avatar nome={conversa.nome} size="sm" className="shrink-0" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="truncate text-label-lg text-foreground">{conversa.nome}</h2>
          <p className="flex min-w-0 items-center gap-1 text-caption text-muted-foreground">
            <Canal size={12} weight="regular" aria-hidden="true" className="shrink-0" />
            <span className="truncate">
              {conversa.canal} · {conversa.telefone}
            </span>
          </p>
        </div>
        {conversa.atendente ? (
          <Tag foto="/ds/atendente.png" className="hidden sm:inline-flex">
            {conversa.atendente}
          </Tag>
        ) : (
          <Button variant="soft" size="sm" onClick={aoAssumir}>
            <UserPlus size={16} weight="regular" />
            Assumir
          </Button>
        )}
        <Button
          ref={botaoTransferir}
          variant="tertiary"
          size="sm"
          aria-haspopup="menu"
          aria-expanded={menuTransferir}
          onClick={() => setMenuTransferir((a) => !a)}
          className="hidden sm:inline-flex"
        >
          <ArrowsLeftRight size={16} weight="regular" />
          Transferir
        </Button>
        <Menu
          aberto={menuTransferir}
          gatilho={botaoTransferir}
          rotulo="Transferir para"
          itens={ATENDENTES.filter((a) => a !== conversa.atendente).map((a) => ({ id: a, rotulo: a, aoAtivar: () => aoTransferir(a) }))}
          aoFechar={(devolver = true) => {
            setMenuTransferir(false);
            if (devolver) botaoTransferir.current?.focus();
          }}
        />
        {finalizada ? (
          <Button variant="secondary" size="sm" onClick={aoReabrir}>
            <ArrowCounterClockwise size={16} weight="regular" />
            Reabrir
          </Button>
        ) : (
          <Button size="sm" onClick={aoFinalizar}>
            <Check size={16} weight="regular" />
            Finalizar
          </Button>
        )}
        <Tooltip content={painelAberto ? "Esconder o lead" : "Mostrar o lead"}>
          <Button variant="ghost" size="icon-sm" aria-label={painelAberto ? "Esconder o lead" : "Mostrar o lead"} aria-pressed={painelAberto} onClick={aoAlternarPainel}>
            <SidebarSimple size={16} weight="regular" className="-scale-x-100" />
          </Button>
        </Tooltip>
      </header>

      <div role="log" aria-label="Mensagens" className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-3", rolagemDiscreta)}>
        {conversa.mensagens.map((m, i) => {
          const novoDia = i === 0 || conversa.mensagens[i - 1].dia !== m.dia;
          return (
            <React.Fragment key={m.id}>
              {novoDia ? (
                <p className="flex items-center gap-3 py-1 text-caption text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                  {m.dia}
                </p>
              ) : null}
              <Balao m={m} />
            </React.Fragment>
          );
        })}
        <div ref={fim} />
      </div>

      <footer className="flex shrink-0 flex-col gap-2 border-t border-border p-3">
        {finalizada ? (
          <p className="text-body-sm text-muted-foreground">Atendimento finalizado. Reabra para responder.</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <SegmentedControl
                rotulo="O que você vai escrever"
                atual={modo}
                aoEscolher={(v) => setModo(v as Modo)}
                itens={[
                  { valor: "mensagem", rotulo: "Mensagem" },
                  { valor: "nota", rotulo: "Nota interna" },
                ]}
                className="bg-muted"
              />
              <p className="hidden text-caption text-muted-foreground sm:block">Enter envia · Shift + Enter quebra a linha</p>
            </div>
            <div className="flex items-end gap-2">
              <Textarea
                rotulo={modo === "nota" ? "Nota interna" : "Mensagem"}
                rotuloOculto
                linhas={1}
                maximoDeLinhas={6}
                placeholder={modo === "nota" ? "Só o time vê esta nota" : `Responder como ${EU}`}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    enviar();
                  }
                }}
              />
              <Tooltip content="Respostas rápidas">
                <Button
                  ref={botaoRespostas}
                  variant="tertiary"
                  size="icon-lg"
                  aria-label="Respostas rápidas"
                  aria-haspopup="menu"
                  aria-expanded={menuRespostas}
                  onClick={() => setMenuRespostas((a) => !a)}
                >
                  <Lightning size={16} weight="regular" />
                </Button>
              </Tooltip>
              <Menu
                aberto={menuRespostas}
                gatilho={botaoRespostas}
                rotulo="Respostas rápidas"
                itens={RESPOSTAS_RAPIDAS.map((r) => ({ id: r.id, rotulo: r.rotulo, aoAtivar: () => setTexto(r.texto) }))}
                aoFechar={(devolver = true) => {
                  setMenuRespostas(false);
                  if (devolver) botaoRespostas.current?.focus();
                }}
              />
              <Tooltip content="Anexar arquivo">
                <Button variant="tertiary" size="icon-lg" aria-label="Anexar arquivo">
                  <Paperclip size={16} weight="regular" />
                </Button>
              </Tooltip>
              <Button size="icon-lg" aria-label={modo === "nota" ? "Salvar nota" : "Enviar mensagem"} disabled={!texto.trim()} onClick={enviar}>
                <PaperPlaneRight size={16} weight="regular" />
              </Button>
            </div>
          </>
        )}
      </footer>
    </section>
  );
}
