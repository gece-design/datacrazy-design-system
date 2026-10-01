"use client";

import * as React from "react";
import type { Icon } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { foco } from "@/lib/estados";
/**
 * Breadcrumb — a trilha até a página atual (node 261:269).
 *
 * O arquivo desenha três níveis: dois com disco de 20px e inicial (o primeiro
 * em `accent` + `primary`, o segundo em `card` + `muted-foreground`) e o atual
 * com ícone de 14px. Ancestrais em `subtle-foreground`, atual em
 * `muted-foreground`, `label-md`; separador de 12px com traço de 1,5.
 *
 * Quantos níveis entram é do produto, não do componente: `itens` aceita
 * qualquer número. Passou de `maximo`, os do meio recolhem em reticências —
 * é a nota do arquivo — e ficam à vista o primeiro e os últimos. As
 * reticências são um botão: abrem a trilha inteira no lugar.
 */

export type ItemBreadcrumb = {
  rotulo: string;
  /** Sem `href` o nível não navega. O último nunca navega: é a página atual. */
  href?: string;
  /** Disco de 20px com a inicial do rótulo, ou a foto em `src`. `destaque`
   *  pinta em `accent` + `primary` (o primeiro nível do arquivo). */
  avatar?: { src?: string; destaque?: boolean };
  /** Ícone de 14px. Ignorado quando há `avatar`. */
  icone?: Icon;
};

export interface BreadcrumbProps {
  itens: ItemBreadcrumb[];
  /** Nome da trilha para leitor de tela. Ex.: "Trilha de navegação". */
  rotulo: string;
  /** Nome do botão de reticências. Ex.: (n) => `Mostrar ${n} níveis ocultos`. */
  rotuloRecolhidos: (quantidade: number) => string;
  /** Níveis à vista antes de recolher. Padrão 3, o que o arquivo desenha; mínimo 2. */
  maximo?: number;
  /** A trilha traz só os ancestrais: a página atual é o título que vem depois
   *  dela, no Header. Sem isto, o último nível é a página atual. */
  ancestrais?: boolean;
  /** Elemento de link. No CRM, o `Link` do Next. */
  link?: React.ElementType;
  className?: string;
}

/** Vetor exportado do arquivo (node 261:256), em currentColor. Não é o
 *  CaretRight do Phosphor: aqui o traço é de 1,5px com ponta arredondada.
 *  Exportado para o Header, que o põe entre a trilha e o título. */
export function SeparadorDaTrilha() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0 text-subtle-foreground">
      <path
        d="M4.5 3L7.14645 5.64645C7.34171 5.84171 7.34171 6.15829 7.14645 6.35355L4.5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Nivel({ item, atual, Link }: { item: ItemBreadcrumb; atual: boolean; Link: React.ElementType }) {
  const Icone = item.icone;
  const conteudo = (
    <>
      {item.avatar ? (
        <Avatar
          size="xs"
          nome={item.rotulo}
          src={item.avatar.src}
          aria-hidden="true"
          className={cn("shrink-0", item.avatar.destaque && "bg-accent text-primary")}
        />
      ) : Icone ? (
        <Icone size={14} weight="regular" aria-hidden="true" className="shrink-0" />
      ) : null}
      {/* D12: trunca com o texto inteiro no `title` */}
      <span className="truncate" title={item.rotulo}>
        {item.rotulo}
      </span>
    </>
  );

  const base = "flex min-w-0 items-center gap-0.5 rounded-md text-label-md";

  if (atual || !item.href) {
    return (
      <span
        data-nivel
        // -1: não entra no Tab, mas recebe o foco quando as reticências abrem
        tabIndex={-1}
        aria-current={atual ? "page" : undefined}
        className={cn(base, "outline-none", atual ? "text-muted-foreground" : "text-subtle-foreground")}
      >
        {conteudo}
      </span>
    );
  }

  return (
    <Link
      data-nivel
      href={item.href}
      // hover derivado (E-01): sobe um degrau, para o tom do nível atual
      className={cn(base, foco, "text-subtle-foreground transition-colors hover:text-muted-foreground")}
    >
      {conteudo}
    </Link>
  );
}

export function Breadcrumb({ itens, rotulo, rotuloRecolhidos, maximo = 3, ancestrais = false, link = "a", className }: BreadcrumbProps) {
  const [aberta, setAberta] = React.useState(false);
  const lista = React.useRef<HTMLOListElement>(null);

  const limite = Math.max(2, maximo);
  const recolhe = !aberta && itens.length > limite;
  const ocultos = itens.length - limite;
  // null marca o lugar das reticências
  const visiveis: (ItemBreadcrumb | null)[] = recolhe
    ? [itens[0], null, ...itens.slice(itens.length - (limite - 1))]
    : itens;

  function abrir() {
    setAberta(true);
    // O botão some ao abrir e levaria o foco junto: passa para o primeiro
    // nível que apareceu no lugar dele.
    requestAnimationFrame(() => lista.current?.querySelectorAll<HTMLElement>("[data-nivel]")[1]?.focus());
  }

  return (
    <nav aria-label={rotulo} className={cn("min-w-0", className)}>
      <ol ref={lista} className="flex min-w-0 items-center gap-1">
        {visiveis.map((item, i) => (
          <li key={item ? `${i}-${item.href ?? item.rotulo}` : "recolhidos"} className="flex min-w-0 items-center gap-1">
            {i > 0 ? <SeparadorDaTrilha /> : null}
            {item ? (
              <Nivel item={item} atual={!ancestrais && i === visiveis.length - 1} Link={link} />
            ) : (
              <button
                type="button"
                onClick={abrir}
                aria-label={rotuloRecolhidos(ocultos)}
                title={rotuloRecolhidos(ocultos)}
                className={cn(
                  foco,
                  "grid h-5 shrink-0 place-items-center rounded-md px-1 text-label-md text-subtle-foreground transition-colors hover:text-muted-foreground",
                )}
              >
                …
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
