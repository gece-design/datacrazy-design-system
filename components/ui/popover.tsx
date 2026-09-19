import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A casca de todo painel flutuante do DS: a lista do Select, o calendário, a
 * hora, o seletor de tags, a lista de notificações. Camada `z-popover`,
 * superfície `overlay-bg` com traço `overlay-border` e o degrau `shadow-lg`
 * da escala de elevação — regra D22: nunca `card`/`border`/`shadow-float`,
 * mesmo sendo alias hoje, para o tema poder mudar a superfície flutuante sem
 * mudar o card.
 *
 * Só a casca: o papel (`listbox`, `dialog`), o foco e o teclado são de quem
 * usa. Lado e alinhamento vêm de `usePosicao` (lib/use-posicao.ts); clique
 * fora, de `useCliqueFora`. Antes eram cinco painéis com quatro
 * posicionamentos e três click-fora (auditoria de consistência, AUD-042).
 */
export interface PainelFlutuanteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Abre para cima do gatilho (medido por `usePosicao`). */
  acima?: boolean;
  /** Alinha pela borda direita do gatilho. */
  aDireita?: boolean;
  /** `fixed` em portal, com as coordenadas em `style` — o seletor de tags,
   *  que vive dentro de uma coluna que rola. Sem `acima`/`aDireita`. */
  fixo?: boolean;
  /** Fechando: fica montado durante o `fade-out` (`useSaida`), sem clique e
   *  escondido do leitor de tela. Sem isto o painel entra dissolvendo e sai
   *  seco. Precedente: Modal e Tooltip (lote B7). */
  saindo?: boolean;
}

export const PainelFlutuante = React.forwardRef<HTMLDivElement, PainelFlutuanteProps>(
  ({ acima, aDireita, fixo, saindo, className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden={saindo || undefined}
      className={cn(
        "z-popover rounded-lg border border-overlay-border bg-overlay-bg shadow-lg",
        fixo ? "fixed" : "absolute",
        !fixo && (acima ? "bottom-full mb-1" : "top-full mt-1"),
        !fixo && (aDireita ? "right-0" : "left-0"),
        saindo ? "pointer-events-none motion-safe:animate-fade-out" : "motion-safe:animate-fade-in-fast",
        className,
      )}
      {...props}
    />
  ),
);
PainelFlutuante.displayName = "PainelFlutuante";
