"use client";

import * as React from "react";
import { Star } from "@phosphor-icons/react";
import { blocoDeCampo } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Rating — avaliação por estrelas (node 590:3000).
 *
 * NÃO é campo de texto em momento nenhum: o bloco é o mesmo cartão do
 * `CampoEditavel` — superfície própria em repouso, realce azul sob o cursor,
 * rótulo em bold e estrelas na mesma margem. A caixa do Input saiu daqui: ela
 * tinha `overflow-hidden`, e numa coluna estreita (o drawer dentro do preview,
 * por exemplo) a última estrela era cortada. Agora a fileira quebra de linha em
 * vez de cortar.
 *
 * Estrela cheia em `primary` e vazia em `base/blue/300`, que é o que o arquivo
 * PINTA. A descrição do componente no Figma promete `foreground` e
 * `subtle-foreground` — divergência aberta em Input.md.
 *
 * Com `aoMudar` é um grupo de rádio: setas mudam a nota. Sem ele, é leitura.
 */

export interface RatingProps {
  rotulo: string;
  /** De 0 até `max`. */
  valor: number;
  /** Quantas estrelas. Padrão 10, por decisão do humano (2026-09-17). */
  max?: number;
  /** Sem esta prop, o Rating é só leitura. */
  aoMudar?: (valor: number) => void;
  className?: string;
}

export function Rating({ rotulo, valor, max: MAX = 10, aoMudar, className }: RatingProps) {
  // 20px é o tamanho do arquivo; acima de seis estrelas a fileira não fecha na
  // coluna de 232px do drawer (10 × 20 + 9 × 4 = 236), então cai para 16.
  const tamanho = MAX > 6 ? 16 : 20;
  const id = React.useId().replace(/:/g, "");
  const botoes = React.useRef<(HTMLButtonElement | null)[]>([]);
  const editavel = Boolean(aoMudar);

  /** Estrela sob o cursor: a fileira mostra a nota que o clique daria. */
  const [previa, setPrevia] = React.useState<number | null>(null);
  /** Conta os cliques. Muda a `key` das estrelas, e é isso que reinicia a
   *  animação a cada nota — sem contador, o segundo clique não anima. */
  const [pulso, setPulso] = React.useState(0);
  /** A estrela que recebeu o clique: só ela solta o brilho. */
  const [estourou, setEstourou] = React.useState<number | null>(null);

  const mostrado = previa ?? valor;

  function escolher(n: number) {
    aoMudar?.(n);
    setPulso((p) => p + 1);
    setEstourou(n);
  }

  function mover(para: number) {
    const v = Math.min(MAX, Math.max(1, para));
    escolher(v);
    botoes.current[v - 1]?.focus();
  }

  return (
    <div
      className={cn(blocoDeCampo({ realce: editavel }), className)}
      onPointerLeave={() => setPrevia(null)}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span id={`rotulo-${id}`} className="text-label-md font-semibold text-input-label">
          {rotulo}
        </span>
        {/* a nota em número: o cartão diz o valor sem obrigar a contar estrelas */}
        <span aria-hidden="true" className="shrink-0 text-label-md tabular-nums text-muted-foreground">
          {mostrado}/{MAX}
        </span>
      </div>
      <div
        role={editavel ? "radiogroup" : "img"}
        aria-labelledby={editavel ? `rotulo-${id}` : undefined}
        aria-label={editavel ? undefined : `${rotulo}: ${valor} de ${MAX}`}
        // `flex-wrap`: coluna estreita quebra a fileira, nunca corta a estrela.
        // 36px de altura é a mesma linha do valor do CampoEditavel — os dois
        // cartões ficam do mesmo tamanho lado a lado na grade.
        className="flex min-h-9 flex-wrap items-center gap-1"
      >
        {Array.from({ length: MAX }, (_, i) => {
          const n = i + 1;
          const cheia = n <= mostrado;
          const estrela = (
            <span
              // a `key` com o pulso remonta a estrela e dispara o pop de novo
              key={`${n}-${pulso}`}
              className={cn(
                "inline-flex",
                cheia && pulso > 0 && "motion-safe:animate-estrela-pop",
              )}
              // cascata da esquerda para a direita: as cheias sobem em fila
              style={pulso > 0 ? { animationDelay: `${i * 35}ms` } : undefined}
            >
              <Star
                size={tamanho}
                weight={cheia ? "fill" : "regular"}
                aria-hidden="true"
                className={cn(
                  "transition-colors",
                  cheia ? (previa === null ? "text-primary" : "text-primary/70") : "text-base-blue-300",
                )}
              />
            </span>
          );

          if (!editavel) return <span key={n} className="inline-flex">{estrela}</span>;

          return (
            <button // check-tokens:ignore botao-cru — anel com respiro de 1px: estrelas a 4px uma da outra; respiro de 2 pisaria na vizinha (registro: focus D6, offset 1)
              key={n}
              ref={(el) => {
                botoes.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={n === valor}
              aria-label={`${n} de ${MAX}`}
              tabIndex={n === (valor || 1) ? 0 : -1}
              onClick={() => escolher(n)}
              onPointerEnter={() => setPrevia(n)}
              onFocus={() => setPrevia(n)}
              onBlur={() => setPrevia(null)}
              onKeyDown={(e) => {
                const passos: Record<string, number> = { ArrowRight: n + 1, ArrowUp: n + 1, ArrowLeft: n - 1, ArrowDown: n - 1, Home: 1, End: MAX };
                if (e.key in passos) {
                  e.preventDefault();
                  mover(passos[e.key]);
                }
              }}
              className={cn(
                "relative inline-flex rounded-sm transition-transform duration-fast ease-enter",
                "motion-safe:hover:-translate-y-px motion-safe:hover:scale-125 motion-safe:active:scale-90",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
              )}
            >
              {/* o brilho: nasce embaixo da estrela e some crescendo. Vem ANTES
                  no DOM, então a estrela pinta por cima sem z-index cru. */}
              {estourou === n ? (
                <span
                  key={pulso}
                  aria-hidden="true"
                  onAnimationEnd={() => setEstourou(null)}
                  className="pointer-events-none absolute -inset-2 rounded-full bg-primary/25 motion-safe:animate-estrela-brilho motion-reduce:hidden"
                />
              ) : null}
              {estrela}
            </button>
          );
        })}
      </div>
    </div>
  );
}
