"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Tooltip — dica ancorada, só texto (node 548:73, canvas `↳ Feedback`).
 *
 * `TooltipContent` é o balão com a seta, a cara do arquivo. `Tooltip` embrulha
 * um gatilho e cuida do resto: abrir por cursor e por teclado, posicionar,
 * virar de lado quando não cabe, fechar no Escape.
 *
 * Medidas do arquivo: recuo 10 × 6 · raio 6 (`radius/md`) · `text/caption` ·
 * `elevation/md` · seta de 10 × 6 que entra 2px por baixo do balão.
 *
 * `position` é o lado do gatilho onde o balão aparece, e a seta aponta para o
 * gatilho. É como Top e Bottom estão no arquivo; Left e Right estão desenhados
 * com a seta trocada entre claro e escuro, e aqui seguem a mesma regra dos
 * outros dois.
 */

export type TooltipPosition = "top" | "bottom" | "left" | "right";

const direcao: Record<TooltipPosition, string> = {
  top: "flex-col",
  bottom: "flex-col-reverse",
  left: "flex-row",
  right: "flex-row-reverse",
};

// A seta entra 2px por baixo do balão — é a margem negativa do arquivo.
const encaixe: Record<TooltipPosition, string> = {
  top: "-mb-0.5",
  bottom: "-mt-0.5",
  left: "-mr-0.5",
  right: "-ml-0.5",
};

const giro: Record<TooltipPosition, string> = {
  top: "rotate-180",
  bottom: "",
  left: "rotate-90",
  right: "-rotate-90",
};

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: TooltipPosition;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ position = "top", className, children, ...props }, ref) => {
    const deitada = position === "left" || position === "right";
    return (
      <div ref={ref} className={cn("flex w-max items-center", direcao[position], className)} {...props}>
        {/* Até 320px numa linha, como no arquivo; acima disso quebra, em vez de
            atravessar a janela. Tooltip existe para mostrar o texto inteiro (E1). */}
        <div
          className={cn(
            "max-w-xs break-words rounded-md bg-surface-inverse px-2.5 py-1.5 text-caption text-primary-foreground shadow-md",
            encaixe[position],
          )}
        >
          {children}
        </div>
        {/* Caixa de 10 × 6 (6 × 10 deitada) e triângulo de 8,66 × 4,5 no topo
            dela — o vetor exportado do arquivo, em currentColor para seguir o
            tema. Não é ícone: é a ponta do balão, por isso não vem do Phosphor. */}
        <span
          aria-hidden="true"
          className={cn("relative flex items-center justify-center", deitada ? "h-2.5 w-1.5" : "h-1.5 w-2.5")}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" className={cn("shrink-0 text-surface-inverse", giro[position])}>
            <path d="M5 0L9.33 4.5H0.67Z" fill="currentColor" />
          </svg>
        </span>
      </div>
    );
  },
);
TooltipContent.displayName = "TooltipContent";

// Distância entre a ponta da seta e o gatilho, e a margem mínima até a borda
// da janela. O arquivo desenha o balão solto, sem gatilho, então não diz.
const DISTANCIA = 4;
const MARGEM = 8;

const oposto: Record<TooltipPosition, TooltipPosition> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function cabe(lado: TooltipPosition, g: DOMRect, b: DOMRect) {
  if (lado === "top") return g.top - b.height - DISTANCIA >= MARGEM;
  if (lado === "bottom") return g.bottom + b.height + DISTANCIA <= window.innerHeight - MARGEM;
  if (lado === "left") return g.left - b.width - DISTANCIA >= MARGEM;
  return g.right + b.width + DISTANCIA <= window.innerWidth - MARGEM;
}

function coordenadas(lado: TooltipPosition, g: DOMRect, b: DOMRect) {
  const limitar = (v: number, max: number) => Math.min(Math.max(v, MARGEM), max - MARGEM);
  if (lado === "top" || lado === "bottom") {
    return {
      left: limitar(g.left + g.width / 2 - b.width / 2, window.innerWidth - b.width),
      top: lado === "top" ? g.top - b.height - DISTANCIA : g.bottom + DISTANCIA,
    };
  }
  return {
    left: lado === "left" ? g.left - b.width - DISTANCIA : g.right + DISTANCIA,
    top: limitar(g.top + g.height / 2 - b.height / 2, window.innerHeight - b.height),
  };
}

type PropsDoGatilho = {
  onPointerEnter?: React.PointerEventHandler;
  onPointerLeave?: React.PointerEventHandler;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
  "aria-describedby"?: string;
};

export interface TooltipProps {
  /** O texto do balão. */
  content: React.ReactNode;
  /** Lado preferido. Vira para o oposto quando não cabe na janela. */
  position?: TooltipPosition;
  /** Espera antes de abrir pelo cursor, em ms. Pelo teclado abre na hora. */
  delay?: number;
  /** Um elemento só, que aceite foco e repasse os eventos. */
  children: React.ReactElement<PropsDoGatilho>;
}

export function Tooltip({ content, position = "top", delay = 400, children }: TooltipProps) {
  const id = React.useId();
  const [ancora, setAncora] = React.useState<HTMLElement | null>(null);
  const [lado, setLado] = React.useState(position);
  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(null);
  const [montado, setMontado] = React.useState(false);
  const balao = React.useRef<HTMLDivElement>(null);
  const espera = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => setMontado(true), []);
  React.useEffect(() => () => clearTimeout(espera.current), []);

  const abrir = (el: HTMLElement, imediato: boolean) => {
    clearTimeout(espera.current);
    if (imediato) setAncora(el);
    else espera.current = setTimeout(() => setAncora(el), delay);
  };
  const fechar = React.useCallback(() => {
    clearTimeout(espera.current);
    setAncora(null);
    setPos(null);
  }, []);

  // Medido depois de montar e antes de pintar: o balão nasce invisível, mede,
  // escolhe o lado e só então aparece. Com zoom acima de 100% a janela encolhe
  // em px de CSS e o lado preferido deixa de caber (E3).
  React.useLayoutEffect(() => {
    if (!ancora) return;
    function medir() {
      const b = balao.current?.getBoundingClientRect();
      if (!ancora || !b) return;
      const g = ancora.getBoundingClientRect();
      const escolhido = cabe(position, g, b) || !cabe(oposto[position], g, b) ? position : oposto[position];
      setLado(escolhido);
      setPos(coordenadas(escolhido, g, b));
    }
    medir();
    window.addEventListener("resize", medir);
    window.addEventListener("scroll", medir, true);
    return () => {
      window.removeEventListener("resize", medir);
      window.removeEventListener("scroll", medir, true);
    };
  }, [ancora, position, lado]);

  React.useEffect(() => {
    if (!ancora) return;
    const naTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    document.addEventListener("keydown", naTecla);
    return () => document.removeEventListener("keydown", naTecla);
  }, [ancora, fechar]);

  const p = children.props;
  const gatilho = React.cloneElement(children, {
    "aria-describedby": [p["aria-describedby"], id].filter(Boolean).join(" "),
    onPointerEnter: (e: React.PointerEvent) => {
      p.onPointerEnter?.(e);
      // Toque não tem "passar por cima": sem este filtro o balão abriria no
      // toque e ficaria preso, porque não há pointerleave.
      if (e.pointerType !== "touch") abrir(e.currentTarget as HTMLElement, false);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      p.onPointerLeave?.(e);
      fechar();
    },
    onFocus: (e: React.FocusEvent) => {
      p.onFocus?.(e);
      // Só foco de teclado. Foco que vem de clique não abre — o cursor já abriu.
      const el = e.currentTarget as HTMLElement;
      if (el.matches(":focus-visible")) abrir(el, true);
    },
    onBlur: (e: React.FocusEvent) => {
      p.onBlur?.(e);
      fechar();
    },
  });

  return (
    <>
      {gatilho}
      {montado
        ? createPortal(
            ancora ? (
              <TooltipContent
                ref={balao}
                id={id}
                role="tooltip"
                position={lado}
                style={pos ? { left: pos.left, top: pos.top } : undefined}
                className={cn("pointer-events-none fixed left-0 top-0 z-popover", !pos && "invisible")}
              >
                {content}
              </TooltipContent>
            ) : (
              // Fechado, o texto continua no DOM escondido: `aria-describedby`
              // aponta para ele desde o primeiro foco, antes de o balão abrir.
              <span id={id} hidden>
                {content}
              </span>
            ),
            document.body,
          )
        : null}
    </>
  );
}
