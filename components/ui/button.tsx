import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: foco sempre visível (E7) · estados de interação por regra, não por desenho (E-01)
  // Foco por outline, não por ring com offset: o offset do ring é pintado com uma
  // COR sólida, então dentro de um card ou de uma linha de tabela ele vira um halo
  // da cor errada. O vão do outline é transparente e mostra a superfície real.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-button " +
    "outline-none transition-colors " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-button-inner hover:bg-primary-hover",
        secondary: "border border-border bg-card text-foreground hover:bg-accent",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        // Sombra interna conferida no botão "Excluir" do Modal (545:168).
        destructive: "bg-destructive text-primary-foreground shadow-button-inner hover:bg-destructive-hover",
        // Os dois abaixo vêm do redesenho do Button no Figma (269:32), onde se
        // chamam "Secondary" e "Ghost". Entraram com nome próprio para não mudar
        // o que `secondary` e `ghost` já significam nas telas prontas.
        soft: "bg-base-blue-50 text-base-blue-600 shadow-button-inner hover:bg-base-blue-100",
        outline: "border border-background text-surface-inverse hover:bg-background",
        // "Treecondary" no arquivo (563:4287): card sem traço, texto apagado e a
        // sombra interna. É o botão de apoio das barras de ferramenta — Pesquisar
        // e Filtros no Header (601:464). Hover derivado (E-01), o mesmo do
        // gatilho do Date Picker.
        tertiary: "bg-card text-muted-foreground shadow-button-inner hover:bg-accent",
      },
      size: {
        sm: "h-7 px-2.5",
        md: "h-8 px-3",
        lg: "h-9 px-4",
        // quadrado de 32, só ícone — o sino do Header. Exige `aria-label`.
        icon: "size-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = "Button";
export { buttonVariants };
