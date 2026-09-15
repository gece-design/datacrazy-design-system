"use client";

import * as React from "react";
import { Bell, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Header — o topo de uma página do CRM (set 601:464).
 *
 * O arquivo tem seis combinações de ações, e o produto terá outras: trilha de
 * um a N níveis, título de qualquer tamanho, qualquer conjunto de botões. Por
 * isso não existe prop `actions="default"`. O Header é a moldura — três
 * encaixes e a geometria — e o conteúdo entra por composição:
 *
 *   trilha       → em cima, à esquerda (Breadcrumb)
 *   utilitarios  → em cima, à direita (notificações)
 *   acoes        → embaixo, à direita, alinhadas pela base do título
 *
 * Medidas do arquivo: recuo 32×16, traço de baixo em `border`, linha de cima
 * com a altura do botão (32), título `h1` + subtítulo `body-sm` com vão 2,
 * ações com vão 8. Fecha em 111px.
 *
 * Quando não cabe, as ações descem para uma linha própria, à direita, e
 * quebram entre si; título e subtítulo truncam com `title` (D12).
 */

export interface HeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  titulo: string;
  subtitulo?: string;
  /** Em cima, à esquerda. Normalmente um `Breadcrumb`. */
  trilha?: React.ReactNode;
  /** Em cima, à direita. Normalmente `HeaderNotificacoes`. */
  utilitarios?: React.ReactNode;
  /** Embaixo, à direita: botões, `SegmentedControl`, `ViewSwitcher`, `HeaderDivisor`… */
  acoes?: React.ReactNode;
}

export function Header({ titulo, subtitulo, trilha, utilitarios, acoes, className, ...props }: HeaderProps) {
  return (
    <header className={cn("flex flex-col border-b border-border bg-background px-8 py-4", className)} {...props}>
      {trilha || utilitarios ? (
        <div className="flex min-h-8 items-center justify-between gap-4">
          <div className="min-w-0 flex-1">{trilha}</div>
          {utilitarios ? <div className="flex shrink-0 items-center gap-2">{utilitarios}</div> : null}
        </div>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 title={titulo} className="truncate text-h1 text-foreground">
            {titulo}
          </h1>
          {subtitulo ? (
            <p title={subtitulo} className="truncate text-body-sm text-muted-foreground">
              {subtitulo}
            </p>
          ) : null}
        </div>
        {/* ml-auto: quando a fileira desce de linha, continua à direita */}
        {acoes ? <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2">{acoes}</div> : null}
      </div>
    </header>
  );
}

/** Traço vertical entre grupos de ação (node 601:55): 1×20 em `divider`. */
export function HeaderDivisor({ className }: { className?: string }) {
  return <div role="separator" aria-orientation="vertical" className={cn("h-5 w-px shrink-0 bg-divider", className)} />;
}

export interface HeaderNotificacoesProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Nome do botão, já com a contagem. Ex.: "Notificações: 5 não lidas". */
  rotulo: string;
  /** Não lidas. Zero ou ausente: sem selo. Acima de 99 vira "99+". */
  contagem?: number;
}

/**
 * Sino com selo (607:12957): Button `tertiary` de 32px e selo `destructive`
 * de 16px de altura, 4px para fora do canto, com anel de 1,5 em `card`.
 *
 * O número do selo é `primary-foreground`, não o `destructive-foreground` do
 * arquivo: aquele é branco nos dois modos (reprova a D8) e, no escuro, branco
 * sobre o `destructive` claro dá 2,6:1. É a mesma escolha do Button destructive.
 */
export function HeaderNotificacoes({ rotulo, contagem = 0, className, ...props }: HeaderNotificacoesProps) {
  return (
    <Tooltip content={rotulo} position="bottom">
      <Button variant="tertiary" size="icon" aria-label={rotulo} className={cn("relative", className)} {...props}>
        <Bell size={16} weight="regular" aria-hidden="true" />
        {contagem > 0 ? (
          <span
            aria-hidden="true"
            // D18: traço de 1,5 é ring, não border — o Chrome arredonda border para 1px em tela 1×
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-label-sm tabular-nums text-primary-foreground ring-[1.5px] ring-inset ring-card"
          >
            {contagem > 99 ? "99+" : contagem}
          </span>
        ) : null}
      </Button>
    </Tooltip>
  );
}

export interface HeaderBuscaProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Nome do campo para leitor de tela. Ex.: "Pesquisar leads". */
  rotulo: string;
}

/**
 * Busca inline (variante Search, 610:14049): a caixa do Button `tertiary` com
 * 184px, virada campo. Sem rótulo visível — o placeholder é a pista e
 * `rotulo` é o nome acessível.
 */
export const HeaderBusca = React.forwardRef<HTMLInputElement, HeaderBuscaProps>(({ rotulo, className, ...props }, ref) => (
  <label
    className={cn(
      "flex h-8 w-[184px] max-w-full cursor-text items-center gap-0.5 rounded-md bg-card p-2 text-muted-foreground shadow-button-inner",
      "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
      className,
    )}
  >
    <MagnifyingGlass size={16} weight="regular" aria-hidden="true" className="shrink-0" />
    <input
      ref={ref}
      type="search"
      aria-label={rotulo}
      className="h-full min-w-0 flex-1 bg-transparent px-1 text-label-lg text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
      {...props}
    />
  </label>
));
HeaderBusca.displayName = "HeaderBusca";
