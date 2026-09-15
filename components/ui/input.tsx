"use client";

import * as React from "react";
import { Check, Copy, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Input — campo de uma linha com rótulo (node 535:48, "Field").
 *
 * O arquivo desenha cinco estados: Default, Filled, Focus, Error e Disabled.
 * Filled não é estado de código — é o campo com valor. Os outros saem de
 * pseudo-classe e de prop, nunca de uma prop `state`.
 *
 * O foco do arquivo é um traço de 2px. Aqui é o traço de 1px mais um anel
 * interno de 1px: soma os mesmos 2px sem empurrar o conteúdo.
 */

/** A caixa de 36px. Exportada porque o Rating usa a mesma. */
export function caixaDeCampo({ erro, disabled }: { erro?: boolean; disabled?: boolean } = {}) {
  return cn(
    // D14: o arquivo dá 12px de recuo com o traço por dentro — 1 + 11 aqui.
    "flex h-9 w-full items-center gap-2 overflow-hidden rounded-md border border-input-border bg-input-bg px-[11px] transition-colors",
    // hover não troca a borda de quem está em foco
    "[&:hover:not(:focus-within)]:border-input-border-hover",
    "focus-within:border-input-border-focus focus-within:ring-1 focus-within:ring-inset focus-within:ring-input-border-focus",
    erro &&
      "border-input-border-error [&:hover:not(:focus-within)]:border-input-border-error focus-within:border-input-border-error focus-within:ring-input-border-error",
    disabled && "bg-input-bg-disabled [&:hover:not(:focus-within)]:border-input-border",
  );
}

/** O `<input>` do campo, para as ações que agem sobre o valor (copiar). */
const CampoAtual = React.createContext<React.RefObject<HTMLInputElement | null> | null>(null);

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Texto do rótulo, sempre visível. */
  rotulo: string;
  /** Mensagem de erro. Presente = estado de erro. */
  erro?: string;
  /** Ícone de 16px antes do texto. Ex.: `CalendarBlank`. */
  iconeInicio?: Icon;
  /** Ações de 16px depois do texto. Use `AcaoCampo` ou `AcaoCopiar`. */
  acoes?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ rotulo, erro, iconeInicio: IconeInicio, acoes, className, id, disabled, ...props }, ref) => {
    const gerado = React.useId().replace(/:/g, "");
    const campoId = id ?? `campo-${gerado}`;
    const erroId = `${campoId}-erro`;
    const campo = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => campo.current!);

    return (
      <div className={cn("flex min-w-0 flex-col gap-1", className)}>
        <label htmlFor={campoId} className="text-label-md text-input-label">
          {rotulo}
        </label>
        <div className={caixaDeCampo({ erro: Boolean(erro), disabled })}>
          {IconeInicio ? (
            <IconeInicio size={16} weight="regular" aria-hidden="true" className="shrink-0 text-input-placeholder" />
          ) : null}
          <input
            ref={campo}
            id={campoId}
            disabled={disabled}
            aria-invalid={erro ? true : undefined}
            aria-describedby={erro ? erroId : undefined}
            className="h-full min-w-0 flex-1 truncate bg-transparent text-body-md text-input-text outline-none placeholder:text-input-placeholder disabled:cursor-not-allowed disabled:text-input-text-disabled"
            {...props}
          />
          {acoes ? (
            <CampoAtual.Provider value={campo}>
              <div className="flex shrink-0 items-center gap-1.5">{acoes}</div>
            </CampoAtual.Provider>
          ) : null}
        </div>
        {erro ? (
          <p id={erroId} className="text-caption text-destructive">
            {erro}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export interface AcaoCampoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icone: Icon;
  /** Obrigatório: a ação só tem ícone. Ex.: "Abrir site". */
  rotulo: string;
}

/** Ação de 16px dentro do campo: abrir link, ligar, editar. */
export function AcaoCampo({ icone: Icone, rotulo, className, ...props }: AcaoCampoProps) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      className={cn(
        "inline-flex shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-foreground",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <Icone size={16} weight="regular" aria-hidden="true" />
    </button>
  );
}

/**
 * Copia o valor do próprio campo — o ícone de dois quadrados do arquivo.
 *
 * Lê o `<input>` pelo contexto do Input, então funciona igual com `value` ou
 * `defaultValue`, e copia o que a pessoa acabou de digitar. O retorno é o
 * ícone virar um check em `success` por 1,5s, anunciado ao leitor de tela.
 * Campo vazio não copia nada: o foco vai para o campo.
 */
export function AcaoCopiar({
  rotulo,
  rotuloCopiado,
  className,
}: {
  /** Ex.: "Copiar CNPJ". */
  rotulo: string;
  /** Ex.: "CNPJ copiado". */
  rotuloCopiado: string;
  className?: string;
}) {
  const campo = React.useContext(CampoAtual);
  const [copiado, setCopiado] = React.useState(false);

  React.useEffect(() => {
    if (!copiado) return;
    const t = window.setTimeout(() => setCopiado(false), 1500);
    return () => window.clearTimeout(t);
  }, [copiado]);

  async function copiar() {
    const input = campo?.current;
    const valor = input?.value ?? "";
    if (!input || !valor) {
      input?.focus();
      return;
    }
    try {
      await navigator.clipboard.writeText(valor);
    } catch {
      // sem permissão de área de transferência (iframe, http): cópia pelo DOM
      input.select();
      document.execCommand("copy");
    }
    setCopiado(true);
  }

  return (
    <>
      <AcaoCampo
        icone={copiado ? Check : Copy}
        rotulo={copiado ? rotuloCopiado : rotulo}
        onClick={copiar}
        className={cn(copiado && "text-success hover:text-success", className)}
      />
      <span role="status" aria-live="polite" className="sr-only">
        {copiado ? rotuloCopiado : ""}
      </span>
    </>
  );
}
