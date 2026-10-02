"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { blocoDeCampo, caixaDeCampo, linhaDoCartao, rotuloDoBloco } from "@/lib/campo";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { useSaida } from "@/lib/use-saida";
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

export type OpcaoSelect = {
  valor: string;
  rotulo: string;
  /** Ícone de 16px antes do rótulo: Phosphor ou `IconeDeMarca`. Aparece na lista e no gatilho. */
  icone?: React.ReactNode;
  /** Cabeçalho do grupo. Opções seguidas com o mesmo `grupo` ficam sob ele. Ex.: "Redes sociais". */
  grupo?: string;
  /**
   * A opção como ela aparece na tela depois de escolhida — a `Tag` do
   * atendente com a foto, a tag com a cor. Entra no lugar do ícone e do
   * rótulo, na lista e no gatilho: quem abre a lista vê exatamente como vai
   * ficar (humano, 2026-10-02). O `rotulo` continua obrigatório: é o nome
   * que o leitor de tela lê e o texto que a busca procura.
   */
  conteudo?: React.ReactNode;
};

/** Opções na ordem em que chegam, repartidas em blocos pelo `grupo` — cada
 *  uma com o índice que tem na lista inteira (é o que o teclado percorre). */
export function agruparOpcoes<T extends { grupo?: string }>(opcoes: T[]) {
  const blocos: { grupo?: string; itens: { opcao: T; indice: number }[] }[] = [];
  opcoes.forEach((opcao, indice) => {
    const ultimo = blocos[blocos.length - 1];
    if (ultimo && ultimo.grupo === opcao.grupo) ultimo.itens.push({ opcao, indice });
    else blocos.push({ grupo: opcao.grupo, itens: [{ opcao, indice }] });
  });
  return blocos;
}

/** Um bloco da lista: com `grupo`, ganha o cabeçalho e o `role="group"`. O
 *  cabeçalho não é opção — o teclado passa direto por ele. */
export function GrupoDeOpcoes({ grupo, primeiro, children }: { grupo?: string; primeiro?: boolean; children: React.ReactNode }) {
  if (!grupo) return <>{children}</>;
  return (
    <div role="group" aria-label={grupo} className={cn(!primeiro && "mt-1 border-t border-overlay-border pt-1")}>
      <div aria-hidden="true" className="px-3 pb-1 pt-1.5 text-overline uppercase text-subtle-foreground">
        {grupo}
      </div>
      {children}
    </div>
  );
}

/** Altura máxima da lista (o `max-h-64` de antes), em px: entra na medida de "cabe embaixo?". */
const ALTURA_DA_LISTA = 256;

export interface SelectProps extends VariantProps<typeof triggerVariants> {
  /** As opções da lista. */
  opcoes: OpcaoSelect[];
  /** O valor escolhido. Sem ele, o gatilho mostra `textoVazio`. */
  valor?: string;
  aoEscolher?: (valor: string) => void;
  /** O que o gatilho mostra quando nada foi escolhido. */
  textoVazio?: string;
  /** Nome do controle para leitor de tela. Ex.: "Filtrar por etapa". No `cartao`, é o rótulo visível. */
  rotulo: string;
  /** O cartão do drawer: o cartão inteiro é o gatilho, com o rótulo em bold, o
   *  valor na linha de 24 e o caret — a casca do `CampoEditavel` ao lado
   *  (cliente, 2026-09-28, ADR-041). Ignora `size`. */
  cartao?: boolean;
  className?: string;
}

export function Select({
  opcoes,
  valor,
  aoEscolher,
  textoVazio = "Selecione",
  rotulo,
  size,
  cartao,
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

  /* A lista abre em portal, `fixed`, medida a partir do gatilho: dentro de um
     Modal (corpo que rola), de um CardHeader ou de qualquer caixa com
     `overflow`, a lista absoluta era cortada (bancada, 2026-09-29). Para cima
     só quando não cabe embaixo e cabe em cima; nunca vaza pela direita. */
  const [pos, setPos] = React.useState<{ top?: number; bottom?: number; left: number; minWidth: number } | null>(null);
  const posicionar = React.useCallback(() => {
    const r = gatilho.current?.getBoundingClientRect();
    if (!r) return;
    const abaixo = window.innerHeight - r.bottom;
    const acima = abaixo < ALTURA_DA_LISTA + 8 && r.top > abaixo;
    setPos({
      ...(acima ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
      left: Math.max(8, Math.min(r.left, window.innerWidth - r.width - 8)),
      minWidth: r.width,
    });
  }, []);
  React.useEffect(() => {
    if (!aberto) return;
    window.addEventListener("resize", posicionar);
    window.addEventListener("scroll", posicionar, true);
    return () => {
      window.removeEventListener("resize", posicionar);
      window.removeEventListener("scroll", posicionar, true);
    };
  }, [aberto, posicionar]);

  function abrir() {
    posicionar();
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
  useCliqueFora(aberto, [caixa, lista], () => setAberto(false));
  // fica montado durante o fade-out (lote B7)
  const { saindo, visivel } = useSaida(aberto);

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

  function tecladoDoGatilho(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      abrir();
    }
  }

  return (
    <div ref={caixa} className={cn("relative", cartao ? "block" : "inline-block", className)}>
      {cartao ? (
        // O cartão inteiro é o gatilho. O nome lido é "rótulo + valor", como no
        // CampoEditavel — por isso sem aria-label. Aberto, fica no realce do hover.
        <button
          ref={gatilho}
          type="button"
          data-aberto={aberto ? "true" : undefined}
          aria-haspopup="listbox"
          aria-expanded={aberto}
          aria-controls={aberto ? `lista-${id}` : undefined}
          onClick={() => (aberto ? fechar(false) : abrir())}
          onKeyDown={tecladoDoGatilho}
          className={cn(blocoDeCampo({ realce: true }), "w-full text-left data-[aberto=true]:bg-accent", foco)}
        >
          <span className={rotuloDoBloco}>{rotulo}</span>
          <span className={cn("flex items-center justify-between gap-2", linhaDoCartao)}>
            <span className={cn("flex min-w-0 items-center gap-1.5 text-body-md", escolhido ? "text-input-text" : "text-input-placeholder")}>
              {escolhido?.conteudo ?? (
                <>
                  {escolhido?.icone}
                  <span className="min-w-0 truncate">{escolhido?.rotulo ?? textoVazio}</span>
                </>
              )}
            </span>
            <CaretDown
              size={16}
              weight="regular"
              aria-hidden="true"
              className={cn("shrink-0 text-input-placeholder transition-transform", aberto && "rotate-180")}
            />
          </span>
        </button>
      ) : (
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
          onKeyDown={tecladoDoGatilho}
        >
          {escolhido?.conteudo ? (
            <span className="flex min-w-0 items-center">{escolhido.conteudo}</span>
          ) : escolhido?.icone ? (
            <span className="flex min-w-0 items-center gap-1.5">
              {escolhido.icone}
              <span className="min-w-0 truncate">{escolhido.rotulo}</span>
            </span>
          ) : (
            (escolhido?.rotulo ?? textoVazio)
          )}
        </SelectTrigger>
      )}

      {visivel && pos
        ? createPortal(
        <PainelFlutuante
          ref={lista}
          saindo={saindo}
          id={`lista-${id}`}
          role="listbox"
          aria-label={rotulo}
          aria-activedescendant={`opcao-${id}-${emFoco}`}
          tabIndex={-1}
          onKeyDown={tecladoDaLista}
          fixo
          style={{ top: pos.top, bottom: pos.bottom, left: pos.left, minWidth: pos.minWidth, maxHeight: ALTURA_DA_LISTA }}
          className="overflow-auto p-1 focus:outline-none"
        >
          {agruparOpcoes(opcoes).map((bloco, b) => (
            <GrupoDeOpcoes key={bloco.grupo ?? `sem-grupo-${b}`} grupo={bloco.grupo} primeiro={b === 0}>
              {bloco.itens.map(({ opcao: o, indice: i }) => {
                const selecionado = o.valor === valor;
                return (
                  <div
                    key={o.valor}
                    id={`opcao-${id}-${i}`}
                    role="option"
                    aria-selected={selecionado}
                    aria-label={o.conteudo ? o.rotulo : undefined}
                    onMouseEnter={() => setEmFoco(i)}
                    onClick={() => escolher(o)}
                    className={cn(
                      "cursor-pointer whitespace-nowrap rounded-sm px-3 py-1.5 text-label-lg transition-colors",
                      (o.icone || o.conteudo) && "flex items-center gap-2",
                      selecionado
                        ? "bg-overlay-item-selected text-overlay-item-text-selected"
                        : "text-muted-foreground",
                      /* O realce do teclado e o do mouse são o mesmo: quem navega
                         por seta vê exatamente o que quem passa o cursor vê. */
                      i === emFoco && !selecionado && "bg-overlay-item-hover text-foreground",
                    )}
                  >
                    {o.conteudo ?? (
                      <>
                        {o.icone}
                        {o.rotulo}
                      </>
                    )}
                  </div>
                );
              })}
            </GrupoDeOpcoes>
          ))}
        </PainelFlutuante>,
        document.body,
      )
        : null}
    </div>
  );
}
