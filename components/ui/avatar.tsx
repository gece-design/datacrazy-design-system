import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Avatar — inicial num disco com anel (node 538:200).
 *
 * Três tamanhos, cada um com anel próprio: 4, 6 e 10px. O anel é `border` e o
 * `size-*` já o inclui (box-sizing), igual ao traço por dentro do Figma — por
 * isso aqui a regra D14 não entra.
 *
 * O `md` troca os papéis entre os temas (disco `accent` no Claro, `card` no
 * Escuro). Isso mora nos tokens `--avatar-md-*`, não numa prop de tema.
 */
const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full text-nav-item-selected-foreground",
  {
    variants: {
      size: {
        // 20px, sem anel: o avatar do nível da trilha (Breadcrumb). Cor por className.
        xs: "size-5 bg-card text-label-sm text-muted-foreground",
        sm: "size-8 border-4 border-card bg-accent text-label-md",
        md: "size-12 border-[6px] border-avatar-md-anel bg-avatar-md-fundo text-h3",
        // 29,25/36 não é degrau da escala tipográfica: é o valor do arquivo.
        lg: "size-[90px] border-[10px] border-accent bg-card text-[29.25px] font-semibold leading-9 tracking-[-0.675px]",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

/** Primeira letra do nome, ignorando o que não é letra ("[ENV] Ana" → "A"). */
export function inicialDe(nome: string) {
  return (nome.match(/\p{L}/u)?.[0] ?? "?").toUpperCase();
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  /** Nome da pessoa ou empresa. Dá a inicial e o rótulo do leitor de tela. */
  nome: string;
  /** Foto. Sem ela, a inicial. */
  src?: string;
}

export function Avatar({ nome, src, size, className, ...props }: AvatarProps) {
  return (
    <span role="img" aria-label={nome} className={cn(avatarVariants({ size }), className)} {...props}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full rounded-full object-cover" />
      ) : (
        <span aria-hidden="true">{inicialDe(nome)}</span>
      )}
    </span>
  );
}

export { avatarVariants };
