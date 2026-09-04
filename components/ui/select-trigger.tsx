import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Gatilho de seleção — a caixinha com rótulo e caret.
 *
 * Aparece em dois lugares do Figma com a mesma cara: o recorte do Card
 * (node 261:333) e os filtros da Data Table (node 261:463). São o mesmo
 * controle, então são um componente só.
 *
 * **Não abre menu.** O Select do DS ainda não existe e o arquivo desenha só o
 * estado fechado. Até lá isto é um botão de verdade — focável, com anel
 * visível — e não uma caixa decorativa que finge ser controle. Quando o Select
 * existir, este vira o `trigger` dele.
 */
const triggerVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-md border border-card bg-background text-label-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  {
    variants: {
      size: {
        /** Card: 32px de altura, com o realce interno que o arquivo aplica. */
        md: "px-3 py-2 shadow-[inset_0_4px_5px_0_rgb(106_117_129_/_0.06)]",
        /** Tabela: 29px, sem realce. */
        sm: "h-[29px] px-3 py-1.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof triggerVariants> {}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, size, children, ...props }, ref) => (
    <button ref={ref} type="button" className={cn(triggerVariants({ size }), className)} {...props}>
      {children}
      {/* Caret do arquivo: triângulo de 8×5 apontando para baixo. */}
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden="true" className="shrink-0">
        <path d="M4 5L0 0h8L4 5Z" fill="currentColor" />
      </svg>
    </button>
  ),
);
SelectTrigger.displayName = "SelectTrigger";
