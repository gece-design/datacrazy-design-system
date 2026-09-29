"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { caixaDeCampo, erroDeCampo, rotuloDeCampo } from "@/lib/campo";
import { rolagemDiscreta } from "@/lib/estados";

/**
 * Textarea — texto de várias linhas: observação, nota interna, a mensagem do
 * chat. É a caixa do Input (mesmo traço, mesmo foco, mesmo erro) que cresce
 * com o texto até `maximoDeLinhas` e depois rola por dentro. Não tem par no
 * arquivo: nasceu da tela de Atendimento (ADR-042).
 */
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> {
  /** Texto do rótulo. Visível, salvo com `rotuloOculto`. */
  rotulo: string;
  /** Tira o rótulo da tela (continua para o leitor de tela): o compositor do chat, onde o lugar já diz o que é. */
  rotuloOculto?: boolean;
  /** Mensagem de erro. Presente = estado de erro. */
  erro?: string;
  /** Linhas em repouso. Padrão 3. */
  linhas?: number;
  /** Cresce com o texto até este número de linhas; depois rola. Padrão 8. */
  maximoDeLinhas?: number;
}

/** A entrelinha do `text-body-md`, em px: é a altura de uma linha do campo. */
const ENTRELINHA = 17;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ rotulo, rotuloOculto, erro, linhas = 3, maximoDeLinhas = 8, className, id, disabled, value, onInput, ...props }, ref) => {
    const gerado = React.useId().replace(/:/g, "");
    const campoId = id ?? `texto-${gerado}`;
    const erroId = `${campoId}-erro`;
    const campo = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => campo.current!);

    // cresce com o texto: mede o conteúdo e para no máximo de linhas
    const ajustar = React.useCallback(() => {
      const el = campo.current;
      if (!el) return;
      el.style.height = "auto";
      // escondido (pai com display:none) não tem o que medir: fica na altura das
      // `linhas` e mede de novo quando aparecer — senão nascia com 0 de altura
      if (el.offsetParent === null || el.scrollHeight === 0) return;
      el.style.height = `${Math.min(el.scrollHeight, maximoDeLinhas * ENTRELINHA)}px`;
    }, [maximoDeLinhas]);
    React.useEffect(ajustar, [ajustar, value]);
    // largura que muda (a coluna aparece, a janela encolhe) quebra o texto de outro jeito
    React.useEffect(() => {
      const el = campo.current;
      if (!el || typeof ResizeObserver === "undefined") return;
      let largura = el.clientWidth;
      const observador = new ResizeObserver(() => {
        if (el.clientWidth === largura) return;
        largura = el.clientWidth;
        ajustar();
      });
      observador.observe(el);
      return () => observador.disconnect();
    }, [ajustar]);

    return (
      <div className={cn("flex w-full flex-col gap-1", className)}>
        <label htmlFor={campoId} className={cn(rotuloDeCampo(), rotuloOculto && "sr-only")}>
          {rotulo}
        </label>
        {/* a caixa do Input, com altura livre: o texto começa no topo */}
        <div className={cn(caixaDeCampo({ erro: Boolean(erro), disabled }), "h-auto items-start py-2")}>
          <textarea
            ref={campo}
            id={campoId}
            rows={linhas}
            disabled={disabled}
            value={value}
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? erroId : undefined}
            onInput={(e) => {
              ajustar();
              onInput?.(e);
            }}
            className={cn(
              "min-h-0 w-full flex-1 resize-none bg-transparent text-body-md text-input-text outline-none placeholder:text-input-placeholder disabled:text-input-text-disabled",
              rolagemDiscreta,
            )}
            {...props}
          />
        </div>
        {erro ? (
          <p id={erroId} className={erroDeCampo}>
            {erro}
          </p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
