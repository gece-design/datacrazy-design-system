"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cva } from "class-variance-authority";
import { ChatText, Check, Warning, X, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Toast — confirmação que não bloqueia (node 548:52, canvas `↳ Feedback`).
 *
 * Dois pedaços: `Toast` é só o cartão, com a cara do arquivo; `Toaster` é a
 * fila que decide quando ele aparece e some. `toast()` pode ser chamado de
 * qualquer lugar — a fila mora no módulo, sem provider para montar.
 *
 * Medidas do arquivo: 380 de largura · recuo 16, e 12 à direita · gap 12 ·
 * raio 6 (`radius/md`) · barra de 3 · círculo de 28 com glifo de 16 · fechar
 * de 24 com X de 14 · `elevation/lg`. Os glifos são os do Phosphor regular:
 * o arquivo exporta os mesmos caminhos (Check, Warning, ChatText, X).
 */

export type ToastVariant = "success" | "destructive" | "warning" | "info";

const icones: Record<ToastVariant, Icon> = {
  success: Check,
  destructive: Warning,
  warning: Warning,
  info: ChatText,
};

// Barra, círculo e glifo saem da mesma cor de estado. O círculo é a cor a 12%:
// o arquivo não exporta a opacidade, e o valor foi medido no pixel — as quatro
// variantes do claro fecham em 0,12 nos três canais.
const barraVariants = cva("absolute inset-y-0 left-0 w-[3px]", {
  variants: {
    variant: {
      success: "bg-success",
      destructive: "bg-destructive",
      warning: "bg-warning",
      info: "bg-info",
    },
  },
});

const iconeVariants = cva("flex size-7 shrink-0 items-center justify-center rounded-full", {
  variants: {
    variant: {
      success: "bg-success/[0.12] text-success",
      destructive: "bg-destructive/[0.12] text-destructive",
      warning: "bg-warning/[0.12] text-warning",
      info: "bg-info/[0.12] text-info",
    },
  },
});

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ToastVariant;
  titulo: string;
  descricao?: string;
  /** Sem ele, o botão de fechar não aparece. */
  aoFechar?: () => void;
  /** Nome do botão de fechar para leitor de tela. Vem de fora: a UI é multi-idioma. */
  rotuloFechar?: string;
}

export function Toast({
  variant = "success",
  titulo,
  descricao,
  aoFechar,
  rotuloFechar = "Fechar notificação",
  className,
  ...props
}: ToastProps) {
  const Glifo = icones[variant];
  return (
    <div
      className={cn(
        "relative flex w-[380px] max-w-full items-start gap-3 overflow-hidden rounded-md bg-overlay-bg py-4 pl-4 pr-3 shadow-lg",
        className,
      )}
      {...props}
    >
      {/* Traço por cima, não `border`: no arquivo o traço não ocupa espaço (o
          cartão fecha em 66 com recuo de 16) e a barra cobre o traço na
          esquerda. Com `border` de verdade seriam 68, e a barra ficaria
          recortada 1px para dentro. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border border-overlay-border" />
      <span aria-hidden="true" className={barraVariants({ variant })} />

      <span aria-hidden="true" className={iconeVariants({ variant })}>
        <Glifo size={16} weight="regular" />
      </span>

      {/* Quebra em vez de cortar: es e pt-br são 20–30% mais longos, e cortar
          aqui seria truncamento mudo (E1). */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 break-words">
        <p className="text-label-lg text-foreground">{titulo}</p>
        {descricao ? <p className="text-body-sm text-muted-foreground">{descricao}</p> : null}
      </div>

      {aoFechar ? (
        <button
          type="button"
          onClick={aoFechar}
          aria-label={rotuloFechar}
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors",
            // hover derivado (E-01): o token de "item sob o cursor" do overlay.
            "hover:bg-overlay-item-hover hover:text-foreground",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <X size={14} weight="regular" />
        </button>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Fila. Fica no módulo, e o `Toaster` só assina: assim `toast()` funciona de
   um handler, de um hook ou de fora do React, sem contexto no meio.
--------------------------------------------------------------------------- */

type ItemDaFila = {
  id: number;
  variant: ToastVariant;
  titulo: string;
  descricao?: string;
  duracao: number;
  /** Já foi fechado e está animando a saída. Sai da fila quando ela termina. */
  saindo?: boolean;
};

export type NovoToast = Omit<ItemDaFila, "id" | "duracao" | "variant" | "saindo"> & {
  variant?: ToastVariant;
  /** Milissegundos na tela. Pausa enquanto o cursor ou o foco estão nele. */
  duracao?: number;
};

// Saída em dois tempos: o cartão desliza para a direita e, só depois, o vão
// que ele deixou fecha. Os dois juntos fariam a pilha andar por baixo de um
// cartão que ainda está visível. Motion não tem token (pendência 4 de
// docs/02-design-system.md): os tempos ficam nomeados aqui e batem com as
// classes `duration-200` e `delay-200` do `ItemDoToaster`.
const SAIDA_MS = 200;
const COLAPSO_MS = 200;

let fila: ItemDaFila[] = [];
let proximoId = 0;
const ouvintes = new Set<() => void>();
const filaVazia: ItemDaFila[] = [];

function avisar() {
  ouvintes.forEach((o) => o());
}

function assinar(o: () => void) {
  ouvintes.add(o);
  return () => ouvintes.delete(o);
}

function remover(id: number) {
  fila = fila.filter((t) => t.id !== id);
  avisar();
}

// Quem pediu menos movimento ao sistema não espera animação nenhuma: o toast
// some na hora (regra I12).
function semMovimento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Mostra um toast. Devolve o id, para fechar antes do tempo com `fecharToast`. */
export function toast({ variant = "success", duracao = 8000, ...resto }: NovoToast) {
  const id = ++proximoId;
  fila = [...fila, { id, variant, duracao, ...resto }];
  avisar();
  return id;
}

export function fecharToast(id: number) {
  const item = fila.find((t) => t.id === id);
  if (!item || item.saindo) return;
  if (semMovimento()) return remover(id);
  fila = fila.map((t) => (t.id === id ? { ...t, saindo: true } : t));
  avisar();
  setTimeout(() => remover(id), SAIDA_MS + COLAPSO_MS);
}

export interface ToasterProps {
  /** Quantos ficam visíveis ao mesmo tempo. Os mais antigos saem primeiro. */
  maximo?: number;
  /** Nome da região para leitor de tela. */
  rotulo?: string;
  rotuloFechar?: string;
}

/** Monte uma vez, perto da raiz. É também a região de anúncio para leitor de tela. */
export function Toaster({ maximo = 3, rotulo = "Notificações", rotuloFechar }: ToasterProps) {
  const itens = React.useSyncExternalStore(assinar, () => fila, () => filaVazia);
  const [montado, setMontado] = React.useState(false);
  React.useEffect(() => setMontado(true), []);

  // Passou do máximo, o mais antigo sai da fila de vez — com a mesma animação
  // de quem é fechado. Só esconder não serve: escondido ele não tem relógio, e
  // voltaria à tela quando os outros saíssem. Antes de pintar, para o quarto
  // nunca aparecer por um quadro.
  React.useLayoutEffect(() => {
    itens
      .filter((t) => !t.saindo)
      .slice(0, -maximo)
      .forEach((t) => fecharToast(t.id));
  }, [itens, maximo]);

  // Portal para o body: `fixed` dentro de um ancestral com transform deixa de
  // ser relativo à janela, e a camada `toast` perderia para o contexto do pai.
  if (!montado) return null;
  return createPortal(
    <section aria-label={rotulo}>
      <ol
        aria-live="polite"
        className="fixed bottom-4 right-4 z-toast flex w-[380px] max-w-[calc(100vw-2rem)] flex-col gap-2"
      >
        {itens.map((item) => (
          <ItemDoToaster key={item.id} item={item} rotuloFechar={rotuloFechar} />
        ))}
      </ol>
    </section>,
    document.body,
  );
}

function ItemDoToaster({ item, rotuloFechar }: { item: ItemDaFila; rotuloFechar?: string }) {
  const [pausado, setPausado] = React.useState(false);
  const restante = React.useRef(item.duracao);

  // O relógio só anda sem cursor e sem foco em cima. Quem está lendo ou indo
  // até o X não perde a mensagem no meio do caminho.
  React.useEffect(() => {
    if (pausado || item.saindo) return;
    const inicio = Date.now();
    const t = setTimeout(() => fecharToast(item.id), restante.current);
    return () => {
      clearTimeout(t);
      restante.current -= Date.now() - inicio;
    };
  }, [pausado, item.id, item.saindo]);

  return (
    <li
      onPointerEnter={() => setPausado(true)}
      onPointerLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPausado(false);
      }}
      className={cn(
        // A altura anda por `grid-template-rows` (0fr ↔ 1fr): é o jeito de
        // animar "abrir espaço" sem medir o cartão. A margem negativa leva junto
        // os 8px do gap do container, que senão pulariam no fim.
        "grid grid-rows-[1fr] motion-safe:animate-toast-open",
        "motion-safe:transition-[grid-template-rows,margin-top] motion-safe:delay-200 motion-safe:duration-200 motion-safe:ease-out",
        item.saindo && "pointer-events-none -mt-2 grid-rows-[0fr]",
      )}
    >
      <div className="min-h-0">
        <Toast
          variant={item.variant}
          titulo={item.titulo}
          descricao={item.descricao}
          aoFechar={() => fecharToast(item.id)}
          rotuloFechar={rotuloFechar}
          className={cn(
            "w-full motion-safe:animate-fade-in",
            // Sai pela direita, por onde fica a borda da tela: 100% da largura
            // mais os 16px do recuo do container, para sumir inteiro.
            "motion-safe:transition-[transform,opacity] motion-safe:duration-200 motion-safe:ease-in",
            item.saindo && "translate-x-[calc(100%+1rem)] opacity-0",
          )}
        />
      </div>
    </li>
  );
}
