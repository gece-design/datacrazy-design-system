"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { foco, focoPeer } from "@/lib/estados";
/**
 * Switch — liga e desliga com efeito imediato.
 *
 * Figma: component set "Switch" (node 547:66, canvas `↳ Form controls`), com
 * os quatro estados desenhados. Também aparece instanciado no drawer
 * (595:10896), só desligado.
 * Trilho 36×20 · recuo 2 · raio cheio · botão 16 em `card` · gap 8 · rótulo
 * `text/body-md`.
 *
 * Por baixo é um checkbox nativo com `role="switch"`: Espaço alterna, o leitor
 * de tela anuncia "ligado/desligado" e o valor entra no `<form>`. A diferença
 * para o Checkbox não é visual, é de contrato — Switch aplica na hora, sem
 * botão de salvar, e por isso quem usa precisa dar retorno do efeito.
 *
 * O estado não depende só de cor (E7): o botão muda de lado. Hover e foco por
 * regra (E-01), a mesma do Checkbox e do Radio — `input/border` →
 * `input/border-hover`, `primary` → `primary-hover`, outline D6.
 */

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "children"> {
  /** Rótulo. Sem ele, passe `aria-label`. */
  children?: React.ReactNode;
  /**
   * A linha inteira é o alvo do clique: texto à esquerda, o Switch à direita,
   * ocupando toda a largura. É o Switch de lista — "aumentar o clique pra
   * row inteira e não só no componente" (humano, 2026-09-24).
   */
  linha?: boolean;
  /** Segunda linha do rótulo, em `muted-foreground`. Só com `linha`. */
  descricao?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, children, linha = false, descricao, ...props }, ref) => {
    const trilho = (
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-9 shrink-0 items-center rounded-full bg-input-border px-0.5 transition-colors",
          "group-hover:bg-input-border-hover",
          "peer-checked:bg-primary peer-checked:group-hover:bg-primary-hover",
          "peer-disabled:bg-input-bg-disabled peer-disabled:peer-checked:bg-subtle-foreground",
          `${focoPeer}`
        )}
      >
        {/* 36 − 2×2 de recuo − 16 do botão = 16 de curso: `translate-x-4`. */}
        <span className="size-4 rounded-full bg-card transition-transform group-has-[:checked]:translate-x-4 motion-reduce:transition-none" />
      </span>
    );
    const texto =
      children != null ? (
        linha ? (
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span>{children}</span>
            {descricao != null ? <span className="text-body-sm text-muted-foreground">{descricao}</span> : null}
          </span>
        ) : (
          <span className="min-w-0">{children}</span>
        )
      ) : null;
    return (
      <label
        className={cn(
          "group relative cursor-pointer text-body-md text-foreground",
          linha ? "flex w-full items-center justify-between gap-4 py-2" : "inline-flex max-w-full items-center gap-2",
          "has-[:disabled]:pointer-events-none has-[:disabled]:text-input-text-disabled",
          className
        )}
      >
        {/* o input vem primeiro nos dois arranjos: o trilho lê o `peer` dele */}
        <input ref={ref} type="checkbox" role="switch" className="peer sr-only" {...props} />
        {linha ? (
          <>
            {texto}
            {trilho}
          </>
        ) : (
          <>
            {trilho}
            {texto}
          </>
        )}
      </label>
    );
  }
);
Switch.displayName = "Switch";
