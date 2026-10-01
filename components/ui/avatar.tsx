import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { tomDe, type Tom } from "@/lib/tons";

/**
 * Avatar — inicial num disco com anel (node 538:200).
 *
 * Três tamanhos, cada um com anel próprio: 4, 6 e 10px. O anel é `border` e o
 * `size-*` já o inclui (box-sizing), igual ao traço por dentro do Figma — por
 * isso aqui a regra D14 não entra.
 *
 * O `md` troca os papéis entre os temas (disco `accent` no Claro, `card` no
 * Escuro). Isso mora nos tokens `--avatar-md-*`, não numa prop de tema.
 *
 * `tom` colore o disco sem foto com um dos catorze tons da Tag — pastel no
 * fundo, a cor escura na letra. `"auto"` tira o tom do nome: a mesma pessoa
 * tem sempre a mesma cor, e uma lista de nomes deixa de ser uma coluna de
 * discos iguais (crítica de 2026-09-28: "avatares com iniciais coloridas").
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

export type Iniciais = "uma" | "duas";

/**
 * "uma": a primeira letra. "duas": primeira do primeiro nome + primeira do
 * último ("Joel Jota" → "JJ", "Maria da Silva" → "MS"). Nome de uma palavra
 * só tem uma. Pedido do cliente (2026-09-21): as duas versões, à escolha.
 */
export function iniciaisDe(nome: string, iniciais: Iniciais = "uma") {
  if (iniciais === "uma") return inicialDe(nome);
  const letras = nome
    .split(/\s+/)
    .map((palavra) => palavra.match(/\p{L}/u)?.[0])
    .filter((l): l is string => Boolean(l));
  if (letras.length === 0) return "?";
  if (letras.length === 1) return letras[0].toUpperCase();
  return (letras[0] + letras[letras.length - 1]).toUpperCase();
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  /** Nome da pessoa ou empresa. Dá a inicial e o rótulo do leitor de tela. */
  nome: string;
  /** Foto. Sem ela, a inicial. */
  src?: string;
  /** Quantas letras sem foto: só a do primeiro nome, ou primeiro + último ("Joel Jota" → "JJ"). */
  iniciais?: Iniciais;
  /** Cor do disco sem foto: um dos catorze tons, ou `"auto"` (o tom sai do nome). Sem ela, o azul do arquivo. */
  tom?: Tom | "auto";
}

export function Avatar({ nome, src, size, iniciais = "uma", tom, className, ...props }: AvatarProps) {
  // com foto não há disco para colorir
  const cor = src ? undefined : tom === "auto" ? tomDe(nome) : tom;
  return (
    <span
      role="img"
      aria-label={nome}
      // `data-tom` liga os --tom-* daquele tom neste span (globals.css)
      data-tom={cor}
      className={cn(
        avatarVariants({ size }),
        cor && "bg-tom-brilho text-tom-texto",
        // o anel do `md` e do `lg` acompanha o tom; o do `sm` é da superfície
        cor && (size === "md" || size === "lg") && "border-tom-anel",
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full rounded-full object-cover" />
      ) : (
        <span aria-hidden="true">{iniciaisDe(nome, iniciais)}</span>
      )}
    </span>
  );
}

export { avatarVariants };
