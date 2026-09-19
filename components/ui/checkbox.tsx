"use client";

import * as React from "react";
import { Check, Minus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

import { foco, focoPeer, desabilitado } from "@/lib/estados";
/**
 * Checkbox — caixa de marcação, com estado indeterminado.
 *
 * Figma: component set "Checkbox" (node 547:28, canvas `↳ Form controls`).
 * Caixa 18px · raio 2 (`radius/xs`) · traço 1.5 · gap 8 · rótulo `text/body-md`.
 *
 * Por baixo é um `<input type="checkbox">` de verdade, escondido só da vista.
 * É ele que dá Espaço para marcar, participação em `<form>`, `name`/`value` e o
 * anúncio certo no leitor de tela — inclusive o "misto" do indeterminado, que o
 * navegador expõe sozinho a partir da propriedade `indeterminate`. A caixa
 * desenhada lê o estado do input por CSS (`peer-*`), então funciona igual
 * controlada (`checked`) ou não (`defaultChecked`).
 *
 * O arquivo desenha repouso e desabilitado. Hover e foco saem por regra (E-01):
 * hover troca cada token pelo `-hover` do mesmo papel — `input/border` →
 * `input/border-hover`, `primary` → `primary-hover` — e foco é o outline D6.
 */

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "children"> {
  /** Rótulo. Sem ele, passe `aria-label` — a seleção de linha da tabela é o caso. */
  children?: React.ReactNode;
  /** "Parte marcada": selecionar tudo com só algumas linhas escolhidas. Só existe
   *  como propriedade de DOM, não como atributo — por isso é prop, não CSS. */
  indeterminado?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, children, indeterminado = false, ...props }, ref) => {
    const input = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => input.current!);

    // Sem lista de dependências de propósito: o clique do usuário limpa o
    // `indeterminate` do DOM por conta própria, e quem manda nele é a prop.
    React.useEffect(() => {
      if (input.current) input.current.indeterminate = indeterminado;
    });

    const Glifo = indeterminado ? Minus : Check;

    return (
      <label
        className={cn(
          "group relative inline-flex max-w-full cursor-pointer items-center gap-2 text-body-md text-foreground",
          "has-[:disabled]:pointer-events-none has-[:disabled]:text-input-text-disabled",
          className
        )}
      >
        <input ref={input} type="checkbox" className="peer sr-only" {...props} />
        <span
          aria-hidden="true"
          className={cn(
            // O glifo pinta em currentColor: transparente desmarcado, token
            // quando marcado. Um glifo só, e nenhuma ramificação por estado.
            // Traço é `ring-inset`, não `border` (regra D18): o Chrome arredonda
            // `border-width` para pixel inteiro de tela, e 1.5px vira 1px em
            // monitor sem retina. Sombra não é arredondada — e, por dentro, é o
            // mesmo traço interno do Figma, sem somar na caixa (D14).
            "grid size-[18px] shrink-0 place-items-center rounded-xs bg-input-bg text-transparent ring-1.5 ring-inset ring-input-border transition-[color,background-color,box-shadow]",
            "group-hover:ring-input-border-hover",
            "peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:ring-0",
            "peer-indeterminate:bg-primary peer-indeterminate:text-primary-foreground peer-indeterminate:ring-0",
            "peer-checked:group-hover:bg-primary-hover peer-indeterminate:group-hover:bg-primary-hover",
            "peer-disabled:bg-input-bg-disabled",
            "peer-disabled:peer-checked:bg-subtle-foreground peer-disabled:peer-indeterminate:bg-subtle-foreground",
            `${focoPeer}`
          )}
        >
          <Glifo size={12} weight="regular" />
        </span>
        {children != null && <span className="min-w-0">{children}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
