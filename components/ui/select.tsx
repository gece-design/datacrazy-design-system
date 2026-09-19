"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { caixaDeCampo } from "@/lib/campo";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { PainelFlutuante } from "@/components/ui/popover";

import { foco } from "@/lib/estados";
/**
 * Select — gatilho e lista de opções.
 *
 * O mesmo controle aparece em dois lugares do Figma: o recorte do Card
 * (node 261:333) e os filtros da Data Table (node 261:463). O arquivo desenha
 * só o estado fechado; a lista aberta é derivada dos tokens `overlay/*`, que
 * existem exatamente para o que flutua sobre a página.
 *
 * Feito à mão, sem Radix: a base do projeto só tem `react-slot`, e trazer um
 * pacote novo é decisão de stack, não de componente. O que Radix daria — foco
 * preso, teclado, clique fora, aria — está implementado aqui e é o que a
 * definição de pronto cobra.
 */

const triggerVariants = cva(
  `inline-flex shrink-0 items-center justify-center gap-1 rounded-md border border-card bg-background text-label-lg text-muted-foreground transition-colors hover:text-foreground ${foco} data-[aberto=true]:text-foreground`,
  {
    variants: {
      size: {
        /** Card: 32px de altura, com o realce interno que o arquivo aplica. */
        md: "px-3 py-2 shadow-select-inner",
        /** Tabela: 29px, sem realce. */
        sm: "h-[29px] px-3 py-1.5",
        /** Formulário (node 544:129): a caixa de 36px do Input, com o caret à
         *  direita. D14: traço de 1 + recuo de 11 = os 12 do arquivo. */
        // A própria caixa do Input (lib/campo.ts), com o que o gatilho acrescenta:
        // caret à direita e, no foco, o traço + anel interno do campo em vez do
        // outline do botão — é campo de formulário, e é assim que os vizinhos ficam.
        field: cn(
          caixaDeCampo(),
          "gap-1 justify-between text-body-md text-input-text hover:text-input-text focus-visible:outline-none data-[aberto=true]:border-input-border-focus data-[aberto=true]:text-input-text data-[vazio=true]:text-input-placeholder",
        ),
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof triggerVariants> {
  /** Gira o caret e marca o gatilho como ativo. */
  aberto?: boolean;
  /** Nada escolhido: no `field`, o texto sai na cor de placeholder. */
  vazio?: boolean;
}

/** Só o gatilho. Use quando a abertura for controlada por outro componente. */
export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, size, children, aberto, vazio, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-aberto={aberto ? "true" : undefined}
      data-vazio={vazio ? "true" : undefined}
      className={cn(triggerVariants({ size }), className)}
      {...props}
    >
      {children}
      {/* Caret da biblioteca de ícones, não desenhado à mão. O arquivo usa um
          triângulo cheio; a decisão do humano (2026-09-04) foi padronizar no
          Phosphor, que é a fonte de ícone do DS. No `field` o arquivo já usa o
          CaretDown de 16px, em peso regular. */}
      <CaretDown
        size={size === "field" ? 16 : 12}
        weight={size === "field" ? "regular" : "bold"}
        aria-hidden="true"
        className={cn(
          "shrink-0 transition-transform",
          size === "field" && "text-input-placeholder",
          aberto && "rotate-180",
        )}
      />
    </button>
  ),
);
SelectTrigger.displayName = "SelectTrigger";

export type OpcaoSelect = { valor: string; rotulo: string };

export interface SelectProps extends VariantProps<typeof triggerVariants> {
  /** As opções da lista. */
  opcoes: OpcaoSelect[];
  /** O valor escolhido. Sem ele, o gatilho mostra `textoVazio`. */
  valor?: string;
  aoEscolher?: (valor: string) => void;
  /** O que o gatilho mostra quando nada foi escolhido. */
  textoVazio?: string;
  /** Nome do controle para leitor de tela. Ex.: "Filtrar por etapa". */
  rotulo: string;
  className?: string;
}

export function Select({
  opcoes,
  valor,
  aoEscolher,
  textoVazio = "Selecione",
  rotulo,
  size,
  className,
}: SelectProps) {
  const [aberto, setAberto] = React.useState(false);
  const [emFoco, setEmFoco] = React.useState(0);
  const caixa = React.useRef<HTMLDivElement>(null);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const lista = React.useRef<HTMLDivElement>(null);
  const id = React.useId().replace(/:/g, "");

  const escolhido = opcoes.find((o) => o.valor === valor);
  const indiceAtual = Math.max(0, opcoes.findIndex((o) => o.valor === valor));

  function abrir() {
    setEmFoco(indiceAtual);
    setAberto(true);
  }

  function fechar(devolverFoco = true) {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }

  function escolher(o: OpcaoSelect) {
    aoEscolher?.(o.valor);
    fechar();
  }

  /* Clique fora fecha — é o que a pessoa espera de um menu (lib/use-clique-fora.ts). */
  useCliqueFora(aberto, [caixa], () => setAberto(false));

  /* O foco entra na lista assim que ela abre: sem isso o teclado continua no
     gatilho e as setas não movem nada. */
  React.useEffect(() => {
    if (aberto) lista.current?.focus();
  }, [aberto]);

  function tecladoDaLista(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      fechar();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setEmFoco((i) => (i + 1) % opcoes.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setEmFoco((i) => (i - 1 + opcoes.length) % opcoes.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setEmFoco(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setEmFoco(opcoes.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      escolher(opcoes[emFoco]);
    } else if (e.key === "Tab") {
      fechar(false);
    }
  }

  return (
    <div ref={caixa} className={cn("relative inline-block", className)}>
      <SelectTrigger
        ref={gatilho}
        size={size}
        aberto={aberto}
        vazio={!escolhido}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={aberto ? `lista-${id}` : undefined}
        aria-label={rotulo}
        onClick={() => (aberto ? fechar(false) : abrir())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            abrir();
          }
        }}
      >
        {escolhido?.rotulo ?? textoVazio}
      </SelectTrigger>

      {aberto ? (
        <PainelFlutuante
          ref={lista}
          id={`lista-${id}`}
          role="listbox"
          aria-label={rotulo}
          aria-activedescendant={`opcao-${id}-${emFoco}`}
          tabIndex={-1}
          onKeyDown={tecladoDaLista}
          aDireita
          className="max-h-64 min-w-full overflow-auto p-1 focus:outline-none"
        >
          {opcoes.map((o, i) => {
            const selecionado = o.valor === valor;
            return (
              <div
                key={o.valor}
                id={`opcao-${id}-${i}`}
                role="option"
                aria-selected={selecionado}
                onMouseEnter={() => setEmFoco(i)}
                onClick={() => escolher(o)}
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-sm px-3 py-1.5 text-label-lg transition-colors",
                  selecionado
                    ? "bg-overlay-item-selected text-overlay-item-text-selected"
                    : "text-muted-foreground",
                  /* O realce do teclado e o do mouse são o mesmo: quem navega
                     por seta vê exatamente o que quem passa o cursor vê. */
                  i === emFoco && !selecionado && "bg-overlay-item-hover text-foreground",
                )}
              >
                {o.rotulo}
              </div>
            );
          })}
        </PainelFlutuante>
      ) : null}
    </div>
  );
}
