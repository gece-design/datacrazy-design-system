"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cva } from "class-variance-authority";
import { Warning } from "@phosphor-icons/react";
import { useCamada } from "@/lib/use-camada";
import { useMontado, useSaida } from "@/lib/use-saida";
import { cn } from "@/lib/utils";

import { foco } from "@/lib/estados";
import { BotaoFechar } from "@/components/ui/button";
/**
 * Modal — camada que exige decisão (node 545:168, 12 variantes: Type × Size × theme).
 *
 * Dois pedaços, como no Drawer: `ModalPainel` é a caixa, com a cara do arquivo;
 * `Modal` é a camada — portal, scrim, foco preso, Escape.
 *
 * Medidas do arquivo: largura 400 · 520 · 720 · raio 8 (`radius/lg`) ·
 * `elevation/xl` · cabeçalho com recuo 20 e 12 embaixo · corpo com 20 dos lados
 * e 4 em cima e embaixo · rodapé com traço, 12 em cima e 20 embaixo, botões a 8
 * um do outro · fechar de 28 com X de 16. No destrutivo, círculo de 40 com
 * `Warning` de 20, a cor a 12% — medido no pixel, como no Toast. Os glifos são
 * os do Phosphor regular. Tema não virou prop: é token.
 */

export type ModalVariant = "default" | "destructive";
export type ModalSize = "sm" | "md" | "lg";

const painelVariants = cva(
  "relative flex max-h-full max-w-full flex-col overflow-hidden rounded-lg bg-overlay-bg shadow-xl",
  {
    variants: {
      size: {
        sm: "w-[400px]",
        md: "w-[520px]",
        lg: "w-[720px]",
      },
    },
  },
);

export interface ModalPainelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ModalVariant;
  size?: ModalSize;
  titulo: string;
  descricao?: string;
  /** Botões do rodapé: cancelar primeiro, confirmar por último. Sem eles, não há rodapé. */
  acoes?: React.ReactNode;
  /** Sem ele, o X não aparece. */
  aoFechar?: () => void;
  /** Nome do X para leitor de tela. Vem de fora: a UI é multi-idioma. */
  rotuloFechar?: string;
}

export const ModalPainel = React.forwardRef<HTMLDivElement, ModalPainelProps>(function ModalPainel(
  { variant = "default", size = "sm", titulo, descricao, acoes, aoFechar, rotuloFechar = "Fechar", className, children, ...props },
  ref,
) {
  const id = React.useId();
  return (
    <div
      ref={ref}
      aria-labelledby={`${id}-titulo`}
      aria-describedby={descricao ? `${id}-descricao` : undefined}
      className={cn(painelVariants({ size }), className)}
      {...props}
    >
      <div className="flex shrink-0 items-start gap-3 px-5 pb-3 pt-5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {variant === "destructive" ? (
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/[0.12] text-destructive"
            >
              <Warning size={20} weight="regular" />
            </span>
          ) : null}
          {/* Quebra em vez de cortar: es e pt-br são 20–30% mais longos (E1). */}
          <div className="flex min-w-0 flex-1 flex-col gap-1 break-words">
            <h2 id={`${id}-titulo`} className="text-h3 text-foreground">
              {titulo}
            </h2>
            {descricao ? (
              <p id={`${id}-descricao`} className="text-body-sm text-muted-foreground">
                {descricao}
              </p>
            ) : null}
          </div>
        </div>

        {aoFechar ? <BotaoFechar rotulo={rotuloFechar} onClick={aoFechar} /> : null}
      </div>

      {/* O corpo é o que rola: com zoom alto ou conteúdo longo, cabeçalho e
          rodapé ficam presos e os botões nunca saem da tela. */}
      {children ? <div className="min-h-0 flex-1 overflow-y-auto px-5 py-1">{children}</div> : null}

      {acoes ? (
        <div className="relative flex shrink-0 flex-wrap items-center justify-end gap-2 px-5 pb-5 pt-3">
          {/* Traço por cima, não `border`: no arquivo ele não ocupa espaço (o
              modal fecha em 240 de altura). */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />
          {acoes}
        </div>
      ) : null}

      {/* Mesmo motivo do traço do Toast: o contorno do arquivo é por dentro e não
          empurra o recuo de 20. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border border-overlay-border" />
    </div>
  );
});

export interface ModalProps extends ModalPainelProps {
  aberto: boolean;
  aoFechar: () => void;
  /**
   * Clique no fundo fecha. Padrão: sim, menos no destrutivo — confirmação de
   * algo sem desfazer não some por um clique fora. Escape fecha nos dois.
   */
  fecharNoFundo?: boolean;
}

/**
 * A camada. Portal no body, na camada `z-modal`, com scrim `overlay/scrim` a
 * 40% — a mesma opacidade do Drawer, que o arquivo não define. Para o foco
 * abrir num botão (o Cancelar do destrutivo), ponha `autoFocus` nele.
 */
/**
 * O fundo de toda camada bloqueante: `overlay-scrim` com a opacidade `scrim`
 * da escala (40%, derivação do Drawer, ADR-013). `saindo` troca a entrada
 * pela saída. Modal, Drawer e a tela de senha usam — era uma cópia em cada.
 */
export function Scrim({ saindo, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { saindo?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 bg-overlay-scrim/scrim",
        saindo ? "motion-safe:animate-fade-out" : "motion-safe:animate-fade-in-fast",
        className,
      )}
      {...props}
    />
  );
}

export function Modal({ aberto, aoFechar, fecharNoFundo, variant = "default", className, ...props }: ModalProps) {
  const painel = React.useRef<HTMLDivElement>(null);
  const montado = useMontado();
  // Sai dissolvendo (lote B7): fica montado durante o fade-out, sem clique e
  // escondido do leitor de tela; a camada já devolveu o foco.
  const { saindo, visivel } = useSaida(aberto);
  useCamada(montado && aberto, painel, aoFechar);

  if (!montado || !visivel) return null;
  const fundoFecha = fecharNoFundo ?? variant !== "destructive";
  return createPortal(
    <div className={cn("fixed inset-0 z-modal flex items-center justify-center p-4", saindo && "pointer-events-none")}>
      <Scrim saindo={saindo} onClick={fundoFecha ? aoFechar : undefined} />
      <ModalPainel
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-hidden={saindo || undefined}
        tabIndex={-1}
        variant={variant}
        aoFechar={aoFechar}
        className={cn("focus:outline-none", saindo ? "motion-safe:animate-fade-out" : "motion-safe:animate-fade-in-fast", className)}
        {...props}
      />
    </div>,
    document.body,
  );
}
