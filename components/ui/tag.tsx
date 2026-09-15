"use client";

import * as React from "react";
import { Buildings, Plus, User } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Tag — rótulo em pílula do perfil do lead (node 538:197).
 *
 * O arquivo desenha oito "temas" num eixo só; aqui eles viram três props que
 * se combinam: `status` (bolinha de 6px), `tipo` (pessoa ou empresa, com
 * ícone) e `foto` (atendente). Sem nenhuma, é a tag de texto. O de adicionar é
 * um botão — clicável não é tag — e mora em `TagAdicionar`.
 *
 * Diferente do `Badge`: pílula cheia, caixa alta e fundo `input/bg-disabled`.
 * O Badge é o rótulo de estado da tabela; a Tag é a etiqueta que o usuário põe
 * no lead.
 */

const pontos = {
  destructive: "bg-destructive",
  info: "bg-info",
  success: "bg-success",
} as const;

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Bolinha de 6px antes do texto. O texto continua sendo o sinal: a cor só reforça. */
  status?: keyof typeof pontos;
  /** Tipo do registro: ícone de 12px e texto em `primary`. */
  tipo?: "pessoa" | "empresa";
  /** Foto de 22px encostada à esquerda — a tag do atendente. */
  foto?: string;
}

export function Tag({ status, tipo, foto, className, children, ...props }: TagProps) {
  const Icone = tipo === "pessoa" ? User : tipo === "empresa" ? Buildings : null;
  return (
    <span
      className={cn(
        // 22px = 14 de entrelinha + 4 de respiro em cima e embaixo
        "inline-flex h-[22px] shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full bg-input-bg-disabled px-1.5 text-label-sm uppercase text-foreground",
        foto && "pl-0",
        tipo && "text-primary",
        className,
      )}
      {...props}
    >
      {foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={foto} alt="" className="size-[22px] shrink-0 rounded-full object-cover" />
      ) : null}
      {status ? <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", pontos[status])} /> : null}
      {Icone ? <Icone size={12} weight="regular" aria-hidden="true" className="shrink-0" /> : null}
      {children}
    </span>
  );
}

export interface TagAdicionarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Obrigatório: o botão só tem ícone. Ex.: "Adicionar tag". */
  rotulo: string;
}

/** O "+" do fim da fileira de tags. É botão, então tem foco e rótulo. */
export function TagAdicionar({ rotulo, className, ...props }: TagAdicionarProps) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      className={cn(
        "inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-primary text-background shadow-button-inner transition-colors hover:bg-primary-hover",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      <Plus size={14} weight="regular" aria-hidden="true" />
    </button>
  );
}
