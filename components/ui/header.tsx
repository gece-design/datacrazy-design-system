"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Bell, MagnifyingGlass, type Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PainelFlutuante } from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCliqueFora } from "@/lib/use-clique-fora";
import { useSaida } from "@/lib/use-saida";

import { focoDentro, focoInterno } from "@/lib/estados";
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
 * com a altura do botão (32), título `h1` e, quando houver, subtítulo `body-sm`
 * a 2px; ações com vão 8. Fecha em 111px, com ou sem subtítulo.
 *
 * O subtítulo fica FORA por padrão (decisão do humano, 2026-09-18): título e
 * descrição decorativos em toda tela são anti-referência, e a trilha acima já
 * diz onde a pessoa está.
 *
 * Quando não cabe, as ações descem para uma linha própria, à direita, e
 * quebram entre si; título e subtítulo truncam com `title` (D12).
 */

export interface HeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  titulo: string;
  /** Fora por padrão. Passe só quando a frase disser o que o título não diz. */
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
      {/* min-h 46: é a altura que o título + subtítulo tinham no arquivo, e é o
          que mantém as ações 14px abaixo do sino. Sem ela, um Header sem
          subtítulo encolhe a linha para os 28 do h1 e a fileira de ações sobe
          e encosta no sino — o header fecha em 111px com ou sem subtítulo. */}
      <div className="flex min-h-[46px] flex-wrap items-end justify-between gap-x-6 gap-y-3">
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
export const HeaderNotificacoes = React.forwardRef<HTMLButtonElement, HeaderNotificacoesProps>(
  ({ rotulo, contagem = 0, className, ...props }, ref) => (
    <Tooltip content={rotulo} position="bottom">
      <Button ref={ref} variant="tertiary" size="icon" aria-label={rotulo} className={cn("relative", className)} {...props}>
        <Bell size={16} weight="regular" aria-hidden="true" />
        {contagem > 0 ? (
          <span
            aria-hidden="true"
            // D18: traço de 1,5 é ring, não border — o Chrome arredonda border para 1px em tela 1×
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-label-sm tabular-nums text-primary-foreground ring-1.5 ring-inset ring-card"
          >
            {contagem > 99 ? "99+" : contagem}
          </span>
        ) : null}
      </Button>
    </Tooltip>
  ),
);
HeaderNotificacoes.displayName = "HeaderNotificacoes";

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
      `${focoDentro}`,
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

/* --------------------------------------------------------- Notificações -- */

export type Notificacao = {
  id: string;
  icone: Icon;
  titulo: string;
  detalhe: string;
  /** Quando aconteceu, já em texto. Ex.: "há 20 min". */
  quando: string;
  lida: boolean;
};

export type RotulosDasNotificacoes = {
  titulo: string;
  /** Nome do sino. Ex.: (n) => `Notificações: ${n} não lidas`. */
  naoLidas: (n: number) => string;
  marcarTodas: string;
  verTodas: string;
};

export const ROTULOS_DAS_NOTIFICACOES: RotulosDasNotificacoes = {
  titulo: "Notificações",
  naoLidas: (n) => (n ? `Notificações: ${n} não lida${n === 1 ? "" : "s"}` : "Notificações: nenhuma não lida"),
  marcarTodas: "Marcar todas como lidas",
  verTodas: "Ver todas",
};

export interface NotificacoesProps {
  itens: Notificacao[];
  /** Clique num item. A tela marca como lida e abre o que for. */
  aoMarcarLida: (id: string) => void;
  aoMarcarTodas: () => void;
  /** Sem ele, o rodapé "Ver todas" não aparece. */
  aoVerTodas?: () => void;
  rotulos?: Partial<RotulosDasNotificacoes>;
  className?: string;
}

/**
 * O sino com o painel: a lista de notificações, não lidas em destaque,
 * "marcar todas" no topo e "ver todas" no pé. Era o cenário da página do
 * Header; virou peça porque toda tela do CRM tem o sino e ele precisa abrir
 * alguma coisa (humano, 2026-09-23). O arquivo desenha só o sino e o selo; o
 * painel é derivado dos tokens `overlay/*`, o mesmo caminho da lista do
 * Select. O que é uma notificação continua sendo da tela: ela manda os
 * itens e recebe os cliques.
 *
 * Abre em portal fixo abaixo do sino, alinhado pela direita; acompanha a
 * rolagem e a janela; clique fora e Escape fecham; o foco volta ao sino.
 */
export function Notificacoes({ itens, aoMarcarLida, aoMarcarTodas, aoVerTodas, rotulos, className }: NotificacoesProps) {
  const r = { ...ROTULOS_DAS_NOTIFICACOES, ...rotulos };
  const [aberto, setAberto] = React.useState(false);
  const { saindo, visivel } = useSaida(aberto);
  const [pos, setPos] = React.useState<{ top: number; right: number } | null>(null);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const painel = React.useRef<HTMLDivElement>(null);
  const naoLidas = itens.filter((n) => !n.lida).length;

  const posicionar = React.useCallback(() => {
    const g = gatilho.current?.getBoundingClientRect();
    if (!g) return;
    setPos({ top: g.bottom + 8, right: Math.max(16, window.innerWidth - g.right) });
  }, []);

  useCliqueFora(aberto, [painel, gatilho], () => setAberto(false));

  function fechar(devolverFoco = true) {
    setAberto(false);
    if (devolverFoco) gatilho.current?.focus();
  }

  React.useEffect(() => {
    if (!aberto) return;
    posicionar();
    // Escape fecha de onde o foco estiver — inclusive depois que "marcar todas"
    // desabilita o próprio botão e o foco cai no body.
    const teclado = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setAberto(false);
      gatilho.current?.focus();
    };
    document.addEventListener("keydown", teclado);
    window.addEventListener("resize", posicionar);
    // `true`: a página rola atrás do painel, e o painel acompanha o sino
    window.addEventListener("scroll", posicionar, true);
    return () => {
      document.removeEventListener("keydown", teclado);
      window.removeEventListener("resize", posicionar);
      window.removeEventListener("scroll", posicionar, true);
    };
  }, [aberto, posicionar]);

  // O foco entra no painel depois que ele existe (o portal só monta com `pos`).
  React.useEffect(() => {
    if (aberto && pos) painel.current?.focus();
  }, [aberto, pos]);

  return (
    <>
      <HeaderNotificacoes
        ref={gatilho}
        rotulo={r.naoLidas(naoLidas)}
        contagem={naoLidas}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        onClick={() => (aberto ? fechar() : setAberto(true))}
        className={className}
      />
      {visivel && pos && typeof document !== "undefined"
        ? createPortal(
            <PainelFlutuante
              ref={painel}
              fixo
              saindo={saindo}
              role="dialog"
              aria-label={r.titulo}
              tabIndex={-1}
              style={{ top: pos.top, right: pos.right }}
              className="flex w-[360px] max-w-[calc(100vw-32px)] flex-col overflow-hidden outline-none"
            >
              <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                <p className="text-h4 text-foreground">{r.titulo}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!naoLidas}
                  onClick={() => {
                    aoMarcarTodas();
                    // o botão vai desabilitar: o foco fica no painel, não cai no body
                    painel.current?.focus();
                  }}
                >
                  {r.marcarTodas}
                </Button>
              </div>

              <ul className="flex max-h-[320px] flex-col overflow-y-auto overscroll-contain [scrollbar-width:thin]">
                {itens.map((n) => {
                  const Icone = n.icone;
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => aoMarcarLida(n.id)}
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-overlay-item-hover",
                          focoInterno,
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-full",
                            n.lida ? "bg-background text-subtle-foreground" : "bg-accent text-primary",
                          )}
                        >
                          <Icone size={16} weight="regular" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-2">
                            <span className={cn("truncate text-label-lg", n.lida ? "text-muted-foreground" : "text-foreground")}>{n.titulo}</span>
                            <span className="ml-auto shrink-0 text-caption text-subtle-foreground">{n.quando}</span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-body-sm text-muted-foreground">{n.detalhe}</span>
                        </span>
                        {n.lida ? null : <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {aoVerTodas ? (
                <div className="border-t border-border p-1.5">
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => { fechar(); aoVerTodas(); }}>
                    {r.verTodas}
                  </Button>
                </div>
              ) : null}
            </PainelFlutuante>,
            document.body,
          )
        : null}
    </>
  );
}
