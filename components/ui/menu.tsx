"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, DotsThree, type Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { caixaDeMarcar } from "@/lib/campo";
import { cn } from "@/lib/utils";
import { PainelFlutuante } from "@/components/ui/popover";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { useSaida } from "@/lib/use-saida";

/**
 * Menu — a lista de ações e opções que abre de um gatilho: o menu da coluna
 * e o botão Colunas da Table, o "personalizar cartão" do pipeline, o menu do
 * usuário. Saiu da Table em 2026-09-23 para ser peça (regra D21: o que duas
 * telas usam mora numa peça só).
 *
 * `role="menu"` com o foco no painel e `aria-activedescendant` andando pelos
 * itens, como a lista do Select. Setas andam, Enter e Espaço ativam, Escape
 * fecha e devolve o foco ao gatilho, Tab fecha. Item `check` alterna e
 * mantém o menu aberto; `radio` escolhe um entre vários e fecha; ação fecha. Rolagem da página fecha — o painel é
 * `fixed` num portal (o gatilho pode viver numa caixa que rola) e não
 * acompanharia. Vira para cima quando não cabe embaixo.
 */

export type ItemDoMenu = {
  id: string;
  rotulo: string;
  icone?: Icon;
  /** `check` alterna e mantém o menu aberto; `radio` escolhe um e fecha; ação fecha. */
  tipo?: "acao" | "check" | "radio";
  marcado?: boolean;
  desabilitado?: boolean;
  separadorAntes?: boolean;
  aoAtivar: () => void;
};

export interface MenuProps {
  aberto: boolean;
  /** `devolverFoco` falso quando quem fechou foi um clique fora ou o Tab. */
  aoFechar: (devolverFoco?: boolean) => void;
  /** O botão que abriu: dá a posição e recebe o foco de volta. */
  gatilho: React.RefObject<HTMLElement | null>;
  /** Nome do menu para leitor de tela. */
  rotulo: string;
  itens: ItemDoMenu[];
}

const LARGURA = 240;

function posicaoDoMenu(gatilho: DOMRect, itens: number) {
  const altura = itens * 32 + 12;
  const left = Math.max(8, Math.min(gatilho.left, window.innerWidth - LARGURA - 8));
  const cabeEmbaixo = gatilho.bottom + altura + 8 <= window.innerHeight;
  return cabeEmbaixo ? { top: gatilho.bottom + 4, left } : { top: Math.max(8, gatilho.top - altura - 4), left };
}

export function Menu({ aberto, aoFechar, gatilho, rotulo, itens }: MenuProps) {
  const painel = React.useRef<HTMLDivElement>(null);
  const [emFoco, setEmFoco] = React.useState(0);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const id = React.useId().replace(/:/g, "");
  const { saindo, visivel } = useSaida(aberto);
  const ativos = itens.filter((i) => !i.desabilitado);

  useCliqueFora(aberto, [gatilho, painel], () => aoFechar(false));

  React.useEffect(() => {
    if (!aberto) return;
    const g = gatilho.current?.getBoundingClientRect();
    if (g) setPos(posicaoDoMenu(g, itens.length));
    setEmFoco(0);
    const fechar = () => aoFechar(false);
    window.addEventListener("scroll", fechar, true);
    window.addEventListener("resize", fechar);
    return () => {
      window.removeEventListener("scroll", fechar, true);
      window.removeEventListener("resize", fechar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  // O foco entra no painel depois que ele existe (o portal só monta com `pos`):
  // sem isso as setas não movem nada.
  React.useEffect(() => {
    if (aberto && pos) painel.current?.focus();
  }, [aberto, pos]);

  function ativar(item: ItemDoMenu) {
    if (item.desabilitado) return;
    item.aoAtivar();
    if (item.tipo !== "check") aoFechar();
  }

  function teclado(e: React.KeyboardEvent) {
    const i = ativos.findIndex((x) => x.id === itens[emFoco]?.id);
    const ir = (j: number) => setEmFoco(itens.indexOf(ativos[(j + ativos.length) % ativos.length]));
    if (e.key === "Escape") {
      e.preventDefault();
      aoFechar();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      ir(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      ir(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      ir(0);
    } else if (e.key === "End") {
      e.preventDefault();
      ir(ativos.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (itens[emFoco]) ativar(itens[emFoco]);
    } else if (e.key === "Tab") {
      aoFechar(false);
    }
  }

  if (!visivel || !pos || typeof document === "undefined") return null;
  return createPortal(
    <PainelFlutuante
      ref={painel}
      fixo
      saindo={saindo}
      role="menu"
      aria-label={rotulo}
      aria-activedescendant={`${id}-${emFoco}`}
      tabIndex={-1}
      onKeyDown={teclado}
      style={{ ...pos, width: LARGURA }}
      className="p-1.5 focus:outline-none"
    >
      {itens.map((item, i) => {
        const Icone = item.icone;
        return (
          <React.Fragment key={item.id}>
            {item.separadorAntes ? <div role="separator" aria-hidden="true" className="my-1 h-px bg-overlay-border" /> : null}
            <div
              id={`${id}-${i}`}
              role={item.tipo === "check" ? "menuitemcheckbox" : item.tipo === "radio" ? "menuitemradio" : "menuitem"}
              aria-checked={item.tipo === "check" || item.tipo === "radio" ? Boolean(item.marcado) : undefined}
              aria-disabled={item.desabilitado || undefined}
              onMouseEnter={() => !item.desabilitado && setEmFoco(i)}
              onClick={() => ativar(item)}
              className={cn(
                "flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-label-lg transition-colors",
                item.desabilitado ? "cursor-not-allowed text-subtle-foreground" : "text-foreground",
                // o realce do teclado e o do mouse são o mesmo (Select)
                i === emFoco && !item.desabilitado && "bg-overlay-item-hover",
              )}
            >
              {item.tipo === "check" ? (
                <span aria-hidden="true" className={caixaDeMarcar(Boolean(item.marcado))}>
                  {item.marcado ? <Check size={12} weight="regular" /> : null}
                </span>
              ) : item.tipo === "radio" ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border",
                    item.marcado ? "border-primary bg-primary" : "border-input-border bg-card",
                  )}
                >
                  {item.marcado ? <span className="size-1.5 rounded-full bg-primary-foreground" /> : null}
                </span>
              ) : Icone ? (
                <Icone size={16} weight="regular" aria-hidden="true" className="shrink-0 text-muted-foreground" />
              ) : null}
              <span className="min-w-0 truncate">{item.rotulo}</span>
            </div>
          </React.Fragment>
        );
      })}
    </PainelFlutuante>,
    document.body,
  );
}

/* ---------------------------------------------------------------------------
   Botão de ações — o ⋮ que abre um Menu
--------------------------------------------------------------------------- */

export interface BotaoDeAcoesProps {
  /** Nome do botão e do menu. Ex.: "Ações de Suporte nível 1". */
  rotulo: string;
  itens: ItemDoMenu[];
  /** O tamanho do botão de ícone: `icon-xs` (24, o da célula e do cartão) ou `icon-sm` (28). */
  size?: "icon-xs" | "icon-sm";
  className?: string;
}

/**
 * As ações de um item — o cartão de um catálogo, a linha de um cadastro: o
 * botão de três pontos e o `Menu` que ele abre, com o estado de aberto e o
 * foco de volta já resolvidos. Menu de ações: todo item com ícone. Nasceu na
 * tela de Agentes de IA (2026-10-02) e virou peça em 2026-10-07.
 */
export function BotaoDeAcoes({ rotulo, itens, size = "icon-xs", className }: BotaoDeAcoesProps) {
  const [aberto, setAberto] = React.useState(false);
  const botao = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        ref={botao}
        variant="ghost"
        size={size}
        aria-label={rotulo}
        title={rotulo}
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((a) => !a)}
        className={className}
      >
        <DotsThree size={16} weight="bold" aria-hidden="true" />
      </Button>
      <Menu
        aberto={aberto}
        gatilho={botao}
        rotulo={rotulo}
        itens={itens}
        aoFechar={(devolver = true) => {
          setAberto(false);
          if (devolver) botao.current?.focus();
        }}
      />
    </>
  );
}
