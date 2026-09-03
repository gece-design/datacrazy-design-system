import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Anti-referência nº 3: cor entra em borda e tag — nunca preenchendo o card.
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-1.5 py-0.5 text-label-sm transition-colors",
  {
    variants: {
      variant: {
        neutral: "border-border bg-background text-muted-foreground",
        primary: "border-primary/25 bg-accent text-primary",
        success: "border-success/25 bg-success/10 text-success",
        warning: "border-warning/25 bg-warning/10 text-warning",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
        info: "border-info/25 bg-info/10 text-info",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { badgeVariants };
