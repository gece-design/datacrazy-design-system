// As classes que todo campo do DS compartilha (regra D21: helper de classe
// mora em lib/, nunca exportado de um componente — senão o registry faz o
// Rating instalar o Input só para pegar uma string).
//
// Nasceram no Input e saíram daqui para InputTelefone, TimePicker, Rating e
// o Select de formulário desenharem a mesma caixa, o mesmo cartão e o mesmo
// rótulo (lote B6 da auditoria de consistência). O Input re-exporta por
// compatibilidade.

import { cn } from "@/lib/utils";

/**
 * A caixa de 36px. O foco do arquivo é um traço de 2px; aqui é o traço de
 * 1px mais um anel interno de 1px: soma os mesmos 2px sem empurrar o
 * conteúdo. Estados por pseudo-classe e por prop, nunca por uma prop `state`.
 */
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

/**
 * O cartão do drawer: superfície própria em repouso, realce sob o cursor só
 * em quem vira campo no clique (`CampoEditavel`, `Rating`). `background/50`
 * é derivação — quando a coleção ganhar um token de superfície sutil, é esta
 * linha que muda.
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

/** O rótulo do cartão. Bold por decisão do humano (2026-09-18): no cartão ele
 *  é título do bloco, não etiqueta de campo. */
export const rotuloDoBloco = "text-label-md font-semibold text-input-label";

/** O rótulo certo para cada casca: no cartão, título em bold; solto, etiqueta. */
export function rotuloDeCampo(cartao?: boolean) {
  return cartao ? rotuloDoBloco : "text-label-md text-input-label";
}

/** No cartão, a caixa do campo sangra 8px para os lados. O rótulo fica nos
 *  12px de respiro do cartão — é ele que alinha a grade — e a caixa recupera a
 *  largura que o cartão tirou, senão um telefone com máscara trunca. */
export const caixaNoCartao = "-mx-2 w-auto";

/** A mensagem de erro sob o campo (E6: erro inline é o padrão do DS). */
export const erroDeCampo = "text-caption text-destructive";
