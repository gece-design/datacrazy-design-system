"use client";

import * as React from "react";
import type { Icon } from "@phosphor-icons/react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { alturaCompacta, desabilitado, foco, hoverNoTrilho, opcaoCompacta, superficieDeApoio } from "@/lib/estados";
/**
 * Segmented Control e View Switcher — escolha exclusiva à vista, numa trilha
 * de `card` (nodes 269:68 e 471:2947).
 *
 * São dois sets no arquivo e duas exportações aqui, porque a geometria muda:
 * o Segmented tem recuo 4, opção de 28px e raio 6, com texto; o View Switcher
 * tem recuo 2, opções que dividem 116px e raio 4, só com ícone, e a sombra
 * interna do Button na selecionada. O comportamento é um só — grupo de rádio
 * com setas — e mora em `useGrupoPorSetas`.
 *
 * O arquivo pede de 2 a 4 opções. Acima disso, Select.
 *
 * Entre as opções há 2px de trilho (ADR-075, pedido do cliente em 2026-10-08):
 * a selecionada não encosta nas vizinhas. Vale para todo toggle do DS — o
 * tema da Sidebar segue o mesmo vão.
 */

export type OpcaoSegmentada = { valor: string; rotulo: string; disabled?: boolean };
/** No View Switcher o rótulo não aparece: vira nome acessível e tooltip. */
export type OpcaoDeVisualizacao = OpcaoSegmentada & { icone: Icon };

interface GrupoProps<T extends OpcaoSegmentada> {
  itens: T[];
  /** O `valor` da opção selecionada. */
  atual: string;
  aoEscolher: (valor: string) => void;
  /** Nome do grupo para leitor de tela. Ex.: "Período". */
  rotulo: string;
  className?: string;
}

function useGrupoPorSetas(itens: OpcaoSegmentada[], atual: string, aoEscolher: (valor: string) => void) {
  const grupo = React.useRef<HTMLDivElement>(null);
  const ativos = itens.filter((i) => !i.disabled);
  // Só uma opção entra no Tab. Se `atual` não bate com nenhuma habilitada, é a
  // primeira — senão o grupo inteiro some da ordem de foco.
  const focavel = ativos.some((i) => i.valor === atual) ? atual : ativos[0]?.valor;

  // Setas movem E selecionam, como no Tabs: trocar o período é barato.
  function teclado(e: React.KeyboardEvent) {
    const i = ativos.findIndex((x) => x.valor === atual);
    let alvo: OpcaoSegmentada | undefined;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") alvo = ativos[(i + 1) % ativos.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") alvo = ativos[(i - 1 + ativos.length) % ativos.length];
    else if (e.key === "Home") alvo = ativos[0];
    else if (e.key === "End") alvo = ativos[ativos.length - 1];
    if (!alvo) return;
    e.preventDefault();
    aoEscolher(alvo.valor);
    grupo.current?.querySelector<HTMLElement>(`[data-valor="${CSS.escape(alvo.valor)}"]`)?.focus();
  }

  return { grupo, teclado, focavel };
}

const opcaoBase =
  "flex min-w-0 items-center justify-center whitespace-nowrap transition-colors " +
  `outline-none ${foco} ` +
  `${desabilitado}`;

export function SegmentedControl({ itens, atual, aoEscolher, rotulo, className }: GrupoProps<OpcaoSegmentada>) {
  const { grupo, teclado, focavel } = useGrupoPorSetas(itens, atual, aoEscolher);

  return (
    <div
      ref={grupo}
      role="radiogroup"
      aria-label={rotulo}
      onKeyDown={teclado}
      // 2px entre as opções (ADR-075): o trilho aparece entre a selecionada e as vizinhas
      className={cn("inline-flex h-8 max-w-full items-center gap-0.5 rounded-md p-1", alturaCompacta, superficieDeApoio, className)}
    >
      {itens.map((item) => {
        const selecionada = item.valor === atual;
        return (
          <button
            key={item.valor}
            type="button"
            role="radio"
            aria-checked={selecionada}
            data-valor={item.valor}
            tabIndex={item.valor === focavel ? 0 : -1}
            disabled={item.disabled}
            onClick={() => aoEscolher(item.valor)}
            className={cn(
              opcaoBase,
              // O arquivo escreve "Semana" em label-lg e as outras em body-md.
              // Aqui é body-md em todas: peso que muda por opção faz a trilha
              // mudar de largura quando a seleção troca.
              "h-7 rounded-md px-2.5 text-body-md",
              opcaoCompacta,
              selecionada
                ? "bg-segmented-item-selected text-overlay-item-text-selected"
                // em repouso o texto é `foreground` (era cinza); o hover clareia o fundo meio degrau (humano, 2026-10-02)
                : cn("text-foreground", hoverNoTrilho),
            )}
          >
            <span className="truncate" title={item.rotulo}>
              {item.rotulo}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ViewSwitcher({ itens, atual, aoEscolher, rotulo, className }: GrupoProps<OpcaoDeVisualizacao>) {
  const { grupo, teclado, focavel } = useGrupoPorSetas(itens, atual, aoEscolher);

  return (
    <div
      ref={grupo}
      role="radiogroup"
      aria-label={rotulo}
      onKeyDown={teclado}
      // min-w e não w: com três opções fecha nos 116 do arquivo; com quatro,
      // cresce em vez de espremer o ícone.
      className={cn("inline-flex h-8 min-w-[116px] items-center gap-0.5 rounded-md p-0.5", alturaCompacta, superficieDeApoio, className)}
    >
      {itens.map((item) => {
        const selecionada = item.valor === atual;
        const Icone = item.icone;
        return (
          <Tooltip key={item.valor} content={item.rotulo}>
            <button
              type="button"
              role="radio"
              aria-checked={selecionada}
              aria-label={item.rotulo}
              data-valor={item.valor}
              tabIndex={item.valor === focavel ? 0 : -1}
              disabled={item.disabled}
              onClick={() => aoEscolher(item.valor)}
              className={cn(
                opcaoBase,
                "h-full flex-1 rounded-sm px-2.5",
                selecionada
                  ? "bg-segmented-item-selected text-primary shadow-button-inner"
                  : cn("text-foreground", hoverNoTrilho),
              )}
            >
              {/* a visão ativa: ícone preenchido, em azul */}
              <Icone size={16} weight={selecionada ? "fill" : "regular"} aria-hidden="true" />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
