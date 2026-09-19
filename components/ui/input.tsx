"use client";

import * as React from "react";
import { Check, Copy, PencilSimple, type Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { PERMANENCIA } from "@/lib/movimento";

import { foco, desabilitado } from "@/lib/estados";
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
  /** Põe o campo dentro do cartão do drawer — rótulo em bold, superfície
   *  própria. Em formulário aberto não use: lá o campo é o campo. */
  cartao?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ rotulo, erro, iconeInicio: IconeInicio, acoes, cartao, className, id, disabled, ...props }, ref) => {
    const gerado = React.useId().replace(/:/g, "");
    const campoId = id ?? `campo-${gerado}`;
    const erroId = `${campoId}-erro`;
    const campo = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => campo.current!);

    return (
      <div className={cn(cartao ? blocoDeCampo() : "flex min-w-0 flex-col gap-1", className)}>
        <label htmlFor={campoId} className={rotuloDeCampo(cartao)}>
          {rotulo}
        </label>
        <div className={cn(caixaDeCampo({ erro: Boolean(erro), disabled }), cartao && caixaNoCartao)}>
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
        `${foco}`,
        `${desabilitado}`,
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
  valor,
  className,
}: {
  /** Ex.: "Copiar CNPJ". */
  rotulo: string;
  /** Ex.: "CNPJ copiado". */
  rotuloCopiado: string;
  /** Fora de um Input (modo leitura do CampoEditavel), o texto a copiar. */
  valor?: string;
  className?: string;
}) {
  const campo = React.useContext(CampoAtual);
  const [copiado, setCopiado] = React.useState(false);

  React.useEffect(() => {
    if (!copiado) return;
    const t = window.setTimeout(() => setCopiado(false), PERMANENCIA.copiado);
    return () => window.clearTimeout(t);
  }, [copiado]);

  async function copiar() {
    const input = campo?.current;
    const texto = input?.value ?? valor ?? "";
    if (!texto) {
      input?.focus();
      return;
    }
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // sem permissão de área de transferência (iframe, http): cópia pelo DOM
      if (!input) return;
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

/**
 * O bloco do "clicar para editar" — cartão, não campo.
 *
 * Em tela de leitura o campo não pode ter cara de formulário. Em repouso o
 * bloco é um cartão: superfície própria, raio lg e 12px de respiro por dentro,
 * com rótulo e valor na MESMA margem — o recuo de 11px do Input é o que
 * desalinhava os dois. O cursor troca a superfície pelo realce azul, e o
 * clique é que traz a caixa do campo de volta, por dentro do cartão.
 *
 * A superfície é `background` a 50%: sobre o branco do drawer ela vira um
 * cinza mais claro que o cinza da página, que é o que o humano pediu
 * (2026-09-18). É alpha de token que existe (G5) e não nome novo — quando a
 * coleção ganhar um token de superfície sutil, é esta linha que muda.
 *
 * Exportado porque o Rating usa o mesmo bloco: os dois vivem lado a lado na
 * mesma grade e não podem contar histórias diferentes.
 */
export function blocoDeCampo({ realce }: { realce?: boolean } = {}) {
  return cn(
    // gap-0.5: no cartão o rótulo é título do bloco, não etiqueta solta — os
    // dois textos andam juntos (decisão do humano, 2026-09-18)
    "group relative flex min-w-0 flex-col gap-0.5 rounded-lg bg-background/50 p-3 transition-colors",
    // só quem vira campo no clique acende: um campo que já está aberto
    // responde pela própria caixa, e dois realces na mesma peça brigam
    realce && "hover:bg-accent",
  );
}

/** Campo que já é campo (Select, Telefone, contador) dentro do mesmo cartão.
 *  O rótulo vem daqui, em bold; o filho é só a caixa. */
export function CartaoDeCampo({
  rotulo,
  para,
  children,
  className,
}: {
  rotulo: string;
  /** `id` do controle, quando o rótulo puder ser `<label htmlFor>`. */
  para?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const caixa = <div className={caixaNoCartao}>{children}</div>;
  if (para) {
    return (
      <div className={cn(blocoDeCampo(), className)}>
        <label htmlFor={para} className={rotuloDoBloco}>
          {rotulo}
        </label>
        {caixa}
      </div>
    );
  }
  return (
    <div className={cn(blocoDeCampo(), className)}>
      <span className={rotuloDoBloco}>{rotulo}</span>
      {caixa}
    </div>
  );
}

/** O rótulo do cartão. Bold por decisão do humano (2026-09-18): no cartão ele
 *  é título do bloco, não etiqueta de campo. */
const rotuloDoBloco = "text-label-md font-semibold text-input-label";

/** No cartão, a caixa do campo sangra 8px para os lados. O rótulo fica nos
 *  12px de respiro do cartão — é ele que alinha a grade — e a caixa recupera a
 *  largura que o cartão tirou, senão um telefone com máscara trunca. */
export const caixaNoCartao = "-mx-2 w-auto";

/** O rótulo certo para cada casca. Exportado para quem monta a própria caixa
 *  (Telefone, Select de formulário) não repetir a regra. */
export function rotuloDeCampo(cartao?: boolean) {
  return cartao ? rotuloDoBloco : "text-label-md text-input-label";
}

export interface CampoEditavelProps {
  rotulo: string;
  valor: string;
  aoSalvar: (valor: string) => void;
  /** Ex.: "Editar razão social" — o que o botão de leitura anuncia. */
  rotuloEditar: string;
  /** O que aparece no lugar do valor quando ele está vazio. Ex.: "Adicionar". */
  textoVazio: string;
  /** Ações à direita, no modo leitura. Ex.: `AcaoCopiar` com `valor`. */
  acoes?: React.ReactNode;
  iconeInicio?: Icon;
  placeholder?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
}

/**
 * Campo que só vira campo quando alguém clica — o "clicar para editar".
 *
 * Em repouso é texto alinhado com o rótulo: nada de caixa branca em tela de
 * leitura. Ao passar o cursor ou receber o foco, o bloco inteiro ganha a
 * superfície do cartão e o lápis, para dizer que dá para mexer. Clicar não
 * troca o bloco por um Input: o mesmo cartão recebe o cursor e o traço de
 * foco, então o texto não pula um pixel entre ler e editar.
 *
 * Enter e sair do campo salvam; Escape desfaz e devolve o foco ao texto. O
 * Escape para aqui: dentro do drawer ele fecharia a camada inteira.
 */
export function CampoEditavel({
  rotulo,
  valor,
  aoSalvar,
  rotuloEditar,
  textoVazio,
  acoes,
  iconeInicio: IconeInicio,
  placeholder,
  inputMode,
  className,
}: CampoEditavelProps) {
  const [editando, setEditando] = React.useState(false);
  const [rascunho, setRascunho] = React.useState(valor);
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const id = React.useId().replace(/:/g, "");
  const campoId = `campo-${id}`;

  React.useEffect(() => {
    if (!editando) setRascunho(valor);
  }, [valor, editando]);

  function salvar() {
    setEditando(false);
    if (rascunho !== valor) aoSalvar(rascunho);
  }

  function cancelar() {
    setRascunho(valor);
    setEditando(false);
    // o foco volta para o texto depois que ele existe de novo no DOM
    requestAnimationFrame(() => gatilho.current?.focus());
  }

  return (
    <div className={cn(blocoDeCampo({ realce: !editando }), className)}>
      {editando ? (
        <label htmlFor={campoId} className={rotuloDoBloco}>
          {rotulo}
        </label>
      ) : (
        <span id={`rotulo-${id}`} className={rotuloDoBloco}>
          {rotulo}
        </span>
      )}

      {/* editando, a linha é a caixa do Input — 36px, traço e foco. Em repouso
          é só a linha de 36px, sem caixa e sem recuo: o valor começa onde o
          rótulo começa. */}
      <div className={editando ? caixaDeCampo() : "flex h-9 items-center gap-2"}>
        {IconeInicio ? (
          <IconeInicio size={16} weight="regular" aria-hidden="true" className="shrink-0 text-input-placeholder" />
        ) : null}

        {editando ? (
          <input
            id={campoId}
            autoFocus
            value={rascunho}
            inputMode={inputMode}
            placeholder={placeholder}
            onChange={(e) => setRascunho(e.target.value)}
            onBlur={salvar}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                salvar();
              } else if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                cancelar();
              }
            }}
            className="h-full min-w-0 flex-1 bg-transparent text-body-md text-input-text outline-none placeholder:text-input-placeholder"
          />
        ) : (
          <>
            <button
              ref={gatilho}
              type="button"
              // o nome lido é "rótulo + valor"; a ação fica no title e no hint
              aria-labelledby={`rotulo-${id} valor-${id}`}
              aria-description={rotuloEditar}
              title={rotuloEditar}
              onClick={() => setEditando(true)}
              className={`min-w-0 flex-1 truncate rounded-sm text-left text-body-md text-input-text ${foco}`}
            >
              <span id={`valor-${id}`} className={cn(!valor && "text-input-placeholder")}>
                {valor || textoVazio}
              </span>
            </button>
            <PencilSimple
              size={16}
              weight="regular"
              aria-hidden="true"
              className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            />
            {acoes ? <div className="flex shrink-0 items-center gap-1.5">{acoes}</div> : null}
          </>
        )}
      </div>
    </div>
  );
}
