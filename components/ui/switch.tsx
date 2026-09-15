"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, children, ...props }, ref) => (
    <label
      className={cn(
        "group relative inline-flex max-w-full cursor-pointer items-center gap-2 text-body-md text-foreground",
        "has-[:disabled]:pointer-events-none has-[:disabled]:text-input-text-disabled",
        className
      )}
    >
      <input ref={ref} type="checkbox" role="switch" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-9 shrink-0 items-center rounded-full bg-input-border px-0.5 transition-colors",
          "group-hover:bg-input-border-hover",
          "peer-checked:bg-primary peer-checked:group-hover:bg-primary-hover",
          "peer-disabled:bg-input-bg-disabled peer-disabled:peer-checked:bg-subtle-foreground",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
        )}
      >
        {/* 36 − 2×2 de recuo − 16 do botão = 16 de curso: `translate-x-4`. */}
        <span className="size-4 rounded-full bg-card transition-transform group-has-[:checked]:translate-x-4 motion-reduce:transition-none" />
      </span>
      {children != null && <span className="min-w-0">{children}</span>}
    </label>
  )
);
Switch.displayName = "Switch";
