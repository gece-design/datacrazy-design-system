import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * KPI Card — espelho do component set "KPI Card" do Figma (node 269:53).
 *
 * Eixos do arquivo: Trend (Neutral · Up · Down) × Style (Fill · Outline).
 * O terceiro eixo do Figma, `theme` (Light/Dark), NÃO vira prop: os dois temas
 * saem dos mesmos tokens sob `.dark`. Variante de tema em código seria o bug
 * #80174 de volta.
 *
 * Medidas extraídas do Figma, não estimadas: padding 18, gap 14, slot 28,
 * glifo 16, raio do card 6 (`radius/md`) e do chip 4.
 */

/* Glifos exportados do Figma (269:53), não redesenhados. O `#3385FF` fixo do
 * arquivo virou `currentColor` para quem manda na cor ser o token — é o mesmo
 * tratamento dado ao logo. Decisão do humano (2026-09-03): os três glifos são
 * `primary`, como estão pintados no arquivo. A descrição do componente no
 * Figma promete success/destructive; ver a divergência aberta na doc. */
const glifos = {
  /* Barras do Neutral: no Figma são 3 retângulos soltos no slot de 28px, em
   * (8,15) (12,75,11) e (17,5,7). Aqui vão para o mesmo viewBox de 16 dos
   * outros dois, deslocados de 6 — a origem do glifo dentro do slot. */
  neutral: (
    <>
      <rect x="2" y="9" width="2.5" height="5" rx="1" fill="currentColor" />
      <rect x="6.75" y="5" width="2.5" height="9" rx="1" fill="currentColor" />
      <rect x="11.5" y="1" width="2.5" height="13" rx="1" fill="currentColor" />
    </>
  ),
  up: (
    <path
      fill="currentColor"
      d="M15 3.5V7.5C15 7.63261 14.9473 7.75979 14.8536 7.85355C14.7598 7.94732 14.6326 8 14.5 8C14.3674 8 14.2402 7.94732 14.1464 7.85355C14.0527 7.75979 14 7.63261 14 7.5V4.70687L8.85375 9.85375C8.80731 9.90024 8.75217 9.93712 8.69147 9.96228C8.63077 9.98744 8.56571 10.0004 8.5 10.0004C8.43429 10.0004 8.36923 9.98744 8.30853 9.96228C8.24783 9.93712 8.19269 9.90024 8.14625 9.85375L6 7.70687L1.85375 11.8538C1.75993 11.9476 1.63268 12.0003 1.5 12.0003C1.36732 12.0003 1.24007 11.9476 1.14625 11.8538C1.05243 11.7599 0.999722 11.6327 0.999722 11.5C0.999722 11.3673 1.05243 11.2401 1.14625 11.1462L5.64625 6.64625C5.69269 6.59976 5.74783 6.56288 5.80853 6.53772C5.86923 6.51256 5.93429 6.49961 6 6.49961C6.06571 6.49961 6.13077 6.51256 6.19147 6.53772C6.25217 6.56288 6.30731 6.59976 6.35375 6.64625L8.5 8.79313L13.2931 4H10.5C10.3674 4 10.2402 3.94732 10.1464 3.85355C10.0527 3.75979 10 3.63261 10 3.5C10 3.36739 10.0527 3.24021 10.1464 3.14645C10.2402 3.05268 10.3674 3 10.5 3H14.5C14.6326 3 14.7598 3.05268 14.8536 3.14645C14.9473 3.24021 15 3.36739 15 3.5Z"
    />
  ),
  down: (
    <path
      fill="currentColor"
      d="M15 8V12C15 12.1326 14.9473 12.2598 14.8536 12.3536C14.7598 12.4473 14.6326 12.5 14.5 12.5H10.5C10.3674 12.5 10.2402 12.4473 10.1464 12.3536C10.0527 12.2598 10 12.1326 10 12C10 11.8674 10.0527 11.7402 10.1464 11.6464C10.2402 11.5527 10.3674 11.5 10.5 11.5H13.2931L8.5 6.70687L6.35375 8.85375C6.30731 8.90024 6.25217 8.93712 6.19147 8.96228C6.13077 8.98744 6.06571 9.00039 6 9.00039C5.93429 9.00039 5.86923 8.98744 5.80853 8.96228C5.74783 8.93712 5.69269 8.90024 5.64625 8.85375L1.14625 4.35375C1.05243 4.25993 0.999722 4.13268 0.999722 4C0.999722 3.86732 1.05243 3.74007 1.14625 3.64625C1.24007 3.55243 1.36732 3.49972 1.5 3.49972C1.63268 3.49972 1.75993 3.55243 1.85375 3.64625L6 7.79313L8.14625 5.64625C8.19269 5.59976 8.24783 5.56288 8.30853 5.53772C8.36923 5.51256 8.43429 5.49961 8.5 5.49961C8.56571 5.49961 8.63077 5.51256 8.69147 5.53772C8.75217 5.56288 8.80731 5.59976 8.85375 5.64625L14 10.7931V8C14 7.86739 14.0527 7.74021 14.1464 7.64645C14.2402 7.55268 14.3674 7.5 14.5 7.5C14.6326 7.5 14.7598 7.55268 14.8536 7.64645C14.9473 7.74021 15 7.86739 15 8Z"
    />
  ),
} as const;

export type Tendencia = keyof typeof glifos;

/* Style=Outline no Figma não é "mais claro": é a MESMA cor saindo do fundo e
 * entrando na borda, nas três superfícies (card, slot e chip). A borda existe
 * nas duas variantes — no Fill ela é da cor do fundo, o que mantém a altura
 * idêntica entre as duas. */
/* p-[17px] e não 18: o Figma desenha o traço POR DENTRO da caixa, o CSS soma
 * por fora. Traço de 1 + padding de 17 dá os 18px de recuo do arquivo e devolve
 * a altura de 148 — com p-18 o card fecha em 152. */
const cardVariants = cva(
  "flex w-full min-w-0 flex-col items-start gap-[14px] overflow-hidden rounded-md border p-[17px]",
  {
    variants: {
      variant: {
        fill: "border-card bg-card",
        outline: "border-card bg-transparent",
      },
    },
    defaultVariants: { variant: "fill" },
  },
);

const slotVariants = cva(
  "flex size-7 shrink-0 items-center justify-center rounded-md border text-primary",
  {
    variants: {
      variant: {
        fill: "border-accent bg-accent",
        outline: "border-accent bg-transparent",
      },
    },
    defaultVariants: { variant: "fill" },
  },
);

const chipVariants = cva(
  // Mesma conta do card: 1 de traço + 7/3 de padding = os 8/4 do Figma. No Fill
  // o traço é da cor do fundo, então some — e as duas variantes ficam do mesmo
  // tamanho, que é o que mantém o card em 148 nas duas.
  "flex max-w-full shrink-0 items-start overflow-hidden truncate rounded-sm border px-[7px] py-[3px] text-label-lg",
  {
    variants: {
      variant: {
        fill: "border-background bg-background text-muted-foreground",
        outline: "border-background bg-transparent text-subtle-foreground",
      },
    },
    defaultVariants: { variant: "fill" },
  },
);

export interface KpiCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof cardVariants> {
  /** Rótulo da métrica. Ex.: "Total ganhos". */
  title: string;
  /** O número em destaque, já formatado. Ex.: "R$ 0,00". */
  value: string;
  /** Legenda de apoio. Ex.: "0 negócios". Sem ela, o chip não é renderizado. */
  caption?: string;
  /** Qual glifo ocupa o slot. Não muda cor — ver a nota dos glifos. */
  trend?: Tendencia;
  /** Substitui o glifo do slot. O Figma chama esse nó de "Icon slot". */
  icon?: React.ReactNode;
}

export const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ className, variant, title, value, caption, trend = "neutral", icon, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props}>
      <div className="flex w-full items-center justify-between gap-2 overflow-hidden">
        {/* title nativo: a regra do DS proíbe truncar mudo, e es/pt-br são
            20–30% mais longos que en. */}
        <p className="min-w-0 truncate text-h4 text-muted-foreground" title={title}>
          {title}
        </p>
        <span className={cn(slotVariants({ variant }))} aria-hidden="true">
          {icon ?? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="block">
              {glifos[trend]}
            </svg>
          )}
        </span>
      </div>

      {/* tabular-nums, não font-mono: `text/metric` declara Geist no Figma, e
          trocar a família seria o código decidindo o que o arquivo não decidiu
          (regra D7 da calibração). */}
      {/* `truncate` é rede de segurança, não layout: o valor precisa de ~124px
          livres ("R$ 480,00" em 26/600 mede 123), e abaixo disso o número
          sangrava para fora do card. Com o `title` nativo, o corte não é mudo —
          é a mesma regra do rótulo. Quem não quer o corte dá largura ao card:
          ver a nota da fileira na doc. */}
      <p className="w-full truncate text-display tabular-nums text-foreground" title={value}>
        {value}
      </p>

      {caption ? <div className={cn(chipVariants({ variant }))}>{caption}</div> : null}
    </div>
  ),
);
KpiCard.displayName = "KpiCard";
