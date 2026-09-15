"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Tabs — alterna entre seções do mesmo registro (node 535:21, set "Tab").
 *
 * O arquivo desenha um item só, em dois estados: Default (`muted-foreground`,
 * sem indicador) e Selected (`primary`, com traço de 2px embaixo). Medidas:
 * recuo 8 em cima e 4 dos lados · gap 8 (`space/component/gap-sm`) entre o
 * rótulo e o traço · `text/label-lg` · largura abraça o rótulo.
 *
 * A fileira não está no arquivo. O roadmap deixava abas fora por um motivo —
 * "crescem e viram duas linhas" (anti-referência nº 11) — e é isso que esta
 * fileira não faz: nunca quebra linha; quando não cabe, rola na horizontal.
 */

export type ItemTab = { valor: string; rotulo: string; disabled?: boolean };

export interface TabsProps {
  itens: ItemTab[];
  /** O `valor` da aba selecionada. */
  atual: string;
  aoEscolher: (valor: string) => void;
  /** Nome da fileira para leitor de tela. Ex.: "Seções do lead". */
  rotulo: string;
  /** Base dos ids que ligam aba e painel. Passe o mesmo para o `TabPanel`. */
  id: string;
  className?: string;
}

const idDaAba = (id: string, valor: string) => `${id}-aba-${valor}`;
const idDoPainel = (id: string, valor: string) => `${id}-painel-${valor}`;

export function Tabs({ itens, atual, aoEscolher, rotulo, id, className }: TabsProps) {
  const fileira = React.useRef<HTMLDivElement>(null);

  // Setas movem E selecionam (ativação automática): trocar de seção aqui é
  // barato, então não faz sentido obrigar um Enter a cada passo.
  function teclado(e: React.KeyboardEvent) {
    const ativos = itens.filter((i) => !i.disabled);
    const i = ativos.findIndex((x) => x.valor === atual);
    let alvo: ItemTab | undefined;
    if (e.key === "ArrowRight") alvo = ativos[(i + 1) % ativos.length];
    else if (e.key === "ArrowLeft") alvo = ativos[(i - 1 + ativos.length) % ativos.length];
    else if (e.key === "Home") alvo = ativos[0];
    else if (e.key === "End") alvo = ativos[ativos.length - 1];
    if (!alvo) return;
    e.preventDefault();
    aoEscolher(alvo.valor);
    // `focus()` também rola a fileira até a aba, quando ela está fora da vista.
    fileira.current?.querySelector<HTMLElement>(`#${CSS.escape(idDaAba(id, alvo.valor))}`)?.focus();
  }

  return (
    <div
      ref={fileira}
      role="tablist"
      aria-label={rotulo}
      aria-orientation="horizontal"
      onKeyDown={teclado}
      // gap-3: o arquivo desenha a aba solta, sem fileira. É o `gap-md` da escala.
      className={cn("flex gap-3 overflow-x-auto [scrollbar-width:none]", className)}
    >
      {itens.map((item) => {
        const selecionada = item.valor === atual;
        return (
          <button
            key={item.valor}
            type="button"
            role="tab"
            id={idDaAba(id, item.valor)}
            aria-selected={selecionada}
            aria-controls={idDoPainel(id, item.valor)}
            // Só a selecionada entra no Tab; entre as abas, quem anda são as setas.
            tabIndex={selecionada ? 0 : -1}
            disabled={item.disabled}
            onClick={() => aoEscolher(item.valor)}
            className={cn(
              "flex w-fit shrink-0 flex-col items-center gap-2 whitespace-nowrap rounded-sm px-1 pt-2 text-label-lg transition-colors",
              // Anel por dentro, não `outline` com offset (D6): a fileira rola, e
              // quem rola corta o que passa da borda — o contorno sumiria.
              "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:opacity-50",
              selecionada
                ? "text-primary"
                // hover derivado (E-01): o rótulo sobe para `foreground`, sem traço —
                // o traço continua sendo só de quem está selecionada.
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.rotulo}
            <span
              aria-hidden="true"
              className={cn("h-0.5 w-full transition-colors", selecionada ? "bg-primary" : "bg-transparent")}
            />
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** O mesmo `id` passado para `Tabs`. */
  id: string;
  valor: string;
  atual: string;
}

/** O conteúdo de uma aba. Só renderiza quando ela é a atual. */
export function TabPanel({ id, valor, atual, className, children, ...props }: TabPanelProps) {
  if (valor !== atual) return null;
  return (
    <div
      role="tabpanel"
      id={idDoPainel(id, valor)}
      aria-labelledby={idDaAba(id, valor)}
      // Painel focável: é o próximo Tab depois da fileira, e leva o leitor de
      // tela direto ao conteúdo que acabou de trocar.
      tabIndex={0}
      className={cn(
        "rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
