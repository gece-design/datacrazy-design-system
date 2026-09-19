import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

import { foco, desabilitado } from "@/lib/estados";
const buttonVariants = cva(
  // Base: foco sempre visível (E7) · estados de interação por regra, não por desenho (E-01)
  // Foco por outline, não por ring com offset: o offset do ring é pintado com uma
  // COR sólida, então dentro de um card ou de uma linha de tabela ele vira um halo
  // da cor errada. O vão do outline é transparente e mostra a superfície real.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-button " +
    "outline-none transition-colors " +
    `${foco} ` +
    `${desabilitado} [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-button-inner-primary enabled:hover:bg-primary-hover",
        secondary: "border border-border bg-card text-foreground enabled:hover:bg-accent",
        ghost: "text-muted-foreground enabled:hover:bg-accent enabled:hover:text-foreground",
        // Sombra interna conferida no botão "Excluir" do Modal (545:168).
        destructive: "bg-destructive text-primary-foreground shadow-button-inner enabled:hover:bg-destructive-hover",
        // Os dois abaixo vêm do redesenho do Button no Figma (269:32), onde se
        // chamam "Secondary" e "Ghost". Entraram com nome próprio para não mudar
        // o que `secondary` e `ghost` já significam nas telas prontas.
        soft: "bg-button-soft text-button-soft-foreground shadow-button-inner enabled:hover:bg-button-soft-hover",
        outline: "border border-background text-surface-inverse enabled:hover:bg-background",
        // "Treecondary" no arquivo (563:4287): card sem traço, texto apagado e a
        // sombra interna. É o botão de apoio das barras de ferramenta — Pesquisar
        // e Filtros no Header (601:464). Hover derivado (E-01), o mesmo do
        // gatilho do Date Picker.
        tertiary: "bg-card text-muted-foreground shadow-button-inner enabled:hover:bg-accent",
      },
      size: {
        sm: "h-7 px-2.5",
        md: "h-8 px-3",
        lg: "h-9 px-4",
        // Quadrados só de ícone — exigem `aria-label`. 32 é o sino do Header;
        // 28 e 24 são os X de fechar (Modal, Toast); 36 é o degrau `lg`.
        // Lote B4 da auditoria: antes cada um era um <button> à mão.
        "icon-xs": "size-6",
        "icon-sm": "size-7",
        icon: "size-8",
        "icon-lg": "size-9",
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

export interface BotaoFecharProps extends Omit<ButtonProps, "variant" | "size" | "children"> {
  /** Nome do botão para leitor de tela e tooltip nativo. Ex.: "Fechar". Obrigatório: só tem ícone. */
  rotulo: string;
  /** 24 (Toast), 28 (Modal, painéis) ou 32. Padrão 28. */
  size?: "icon-xs" | "icon-sm" | "icon";
}

/**
 * O X de fechar: Button `ghost` quadrado com o glifo do Phosphor. Vive em
 * superfície flutuante (Modal, Toast, menu), por isso o hover é o token de
 * "item sob o cursor" do overlay (D22), não o `accent` do ghost comum.
 * Antes eram quatro cópias com três tamanhos de glifo e dois tokens de hover
 * (auditoria de consistência, AUD-036).
 */
export const BotaoFechar = React.forwardRef<HTMLButtonElement, BotaoFecharProps>(
  ({ rotulo, size = "icon-sm", className, ...props }, ref) => (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size={size}
      aria-label={rotulo}
      title={rotulo}
      className={cn("shrink-0 enabled:hover:bg-overlay-item-hover", className)}
      {...props}
    >
      <X size={size === "icon-xs" ? 14 : 16} weight="regular" aria-hidden="true" />
    </Button>
  ),
);
BotaoFechar.displayName = "BotaoFechar";
