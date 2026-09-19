"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Radio Group — escolha exclusiva.
 *
 * Figma: component set "Radio" (node 547:45, canvas `↳ Form controls`).
 * Círculo 18px · traço 1.5 desmarcado, 5 marcado (sobra um miolo de 8px em
 * `input/bg`) · gap 8 · rótulo `text/body-md`.
 *
 * Os itens são `<input type="radio">` nativos com o mesmo `name`. É isso que
 * entrega a regra de teclado que implementação caseira erra: setas movem E
 * selecionam, Tab entra no marcado e sai do grupo. O grupo só distribui `name`,
 * valor e `disabled` por contexto.
 *
 * Hover e foco por regra (E-01), iguais aos do Checkbox: `input/border` →
 * `input/border-hover`, `primary` → `primary-hover`, outline D6.
 */

type Contexto = {
  name: string;
  valor: string | undefined;
  escolher: (valor: string) => void;
  disabled?: boolean;
};

const GrupoContexto = React.createContext<Contexto | null>(null);

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Valor escolhido (controlado). */
  valor?: string;
  /** Valor inicial quando não controlado. */
  valorPadrao?: string;
  onValorChange?: (valor: string) => void;
  /** Nome do campo no `<form>`. Sem ele, o grupo gera um. */
  name?: string;
  disabled?: boolean;
  /** Nome do grupo para leitor de tela. Sem ele, use `aria-labelledby`. */
  rotulo?: string;
}

export function RadioGroup({
  valor, valorPadrao, onValorChange, name, disabled, rotulo, className, children, ...props
}: RadioGroupProps) {
  const [interno, setInterno] = React.useState(valorPadrao);
  const gerado = React.useId();
  const controlado = valor !== undefined;

  const contexto: Contexto = {
    name: name ?? gerado,
    valor: controlado ? valor : interno,
    escolher: (v) => {
      if (!controlado) setInterno(v);
      onValorChange?.(v);
    },
    disabled,
  };

  return (
    <div
      role="radiogroup"
      aria-label={rotulo}
      aria-disabled={disabled || undefined}
      className={cn("flex flex-col gap-5", className)}
      {...props}
    >
      <GrupoContexto.Provider value={contexto}>{children}</GrupoContexto.Provider>
    </div>
  );
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "children" | "value" | "name"> {
  value: string;
  children?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, children, value, disabled, onChange, ...props }, ref) => {
    const grupo = React.useContext(GrupoContexto);
    if (!grupo) throw new Error("<Radio> precisa estar dentro de <RadioGroup>.");

    return (
      <label
        className={cn(
          "group relative inline-flex max-w-full cursor-pointer items-center gap-2 text-body-md text-foreground",
          "has-[:disabled]:pointer-events-none has-[:disabled]:text-input-text-disabled",
          className
        )}
      >
        <input
          ref={ref}
          type="radio"
          name={grupo.name}
          value={value}
          checked={grupo.valor === value}
          disabled={grupo.disabled || disabled}
          onChange={(e) => {
            onChange?.(e);
            if (e.target.checked) grupo.escolher(value);
          }}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            // Traço em `ring-inset`, não `border` — mesma razão do Checkbox
            // (regra D18). De quebra, a espessura 1.5 → 5 anima como sombra.
            "size-[18px] shrink-0 rounded-full bg-input-bg ring-1.5 ring-inset ring-input-border transition-[background-color,box-shadow]",
            "group-hover:ring-input-border-hover",
            "peer-checked:ring-[5px] peer-checked:ring-primary",
            "peer-checked:group-hover:ring-primary-hover",
            "peer-disabled:bg-input-bg-disabled",
            "peer-disabled:peer-checked:ring-subtle-foreground",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
          )}
        />
        {children != null && <span className="min-w-0">{children}</span>}
      </label>
    );
  }
);
Radio.displayName = "Radio";
