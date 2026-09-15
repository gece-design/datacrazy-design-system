"use client";

import * as React from "react";
import { Star } from "@phosphor-icons/react";
import { caixaDeCampo } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Rating — avaliação de 0 a 5 estrelas (node 590:3000).
 *
 * A caixa é a do Input. Estrela cheia em `primary` e vazia em `base/blue/300`,
 * que é o que o arquivo PINTA. A descrição do componente no Figma promete
 * `foreground` e `subtle-foreground` — divergência aberta em Input.md.
 *
 * Com `aoMudar` é um grupo de rádio: setas mudam a nota. Sem ele, é leitura.
 */

const MAX = 5;

export interface RatingProps {
  rotulo: string;
  /** De 0 a 5. */
  valor: number;
  /** Sem esta prop, o Rating é só leitura. */
  aoMudar?: (valor: number) => void;
  className?: string;
}

export function Rating({ rotulo, valor, aoMudar, className }: RatingProps) {
  const id = React.useId().replace(/:/g, "");
  const botoes = React.useRef<(HTMLButtonElement | null)[]>([]);
  const editavel = Boolean(aoMudar);

  function mover(para: number) {
    const v = Math.min(MAX, Math.max(1, para));
    aoMudar?.(v);
    botoes.current[v - 1]?.focus();
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span id={`rotulo-${id}`} className="text-label-md text-input-label">
        {rotulo}
      </span>
      <div
        role={editavel ? "radiogroup" : "img"}
        aria-labelledby={editavel ? `rotulo-${id}` : undefined}
        aria-label={editavel ? undefined : `${rotulo}: ${valor} de ${MAX}`}
        // o foco aparece na estrela, então a caixa não ganha o anel do Input
        className={cn(caixaDeCampo(), "px-[5px] focus-within:border-input-border focus-within:ring-0")}
      >
        {Array.from({ length: MAX }, (_, i) => {
          const n = i + 1;
          const cheia = n <= valor;
          const estrela = (
            <Star
              size={20}
              weight={cheia ? "fill" : "regular"}
              aria-hidden="true"
              className={cheia ? "text-primary" : "text-base-blue-300"}
            />
          );
          if (!editavel) return <span key={n} className="inline-flex">{estrela}</span>;
          return (
            <button
              key={n}
              ref={(el) => {
                botoes.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={n === valor}
              aria-label={`${n} de ${MAX}`}
              tabIndex={n === (valor || 1) ? 0 : -1}
              onClick={() => aoMudar?.(n)}
              onKeyDown={(e) => {
                const passos: Record<string, number> = { ArrowRight: n + 1, ArrowUp: n + 1, ArrowLeft: n - 1, ArrowDown: n - 1, Home: 1, End: MAX };
                if (e.key in passos) {
                  e.preventDefault();
                  mover(passos[e.key]);
                }
              }}
              className="inline-flex rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
            >
              {estrela}
            </button>
          );
        })}
      </div>
    </div>
  );
}
