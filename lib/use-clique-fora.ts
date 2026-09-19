"use client";

import * as React from "react";

/**
 * Clique (ou toque) fora de um conjunto de caixas fecha o que está aberto —
 * o que a pessoa espera de todo painel flutuante. `pointerdown` em captura:
 * dispara antes de qualquer `mousedown`/`click` de dentro, e serve ao toque.
 *
 * Era uma cópia por painel (Select, TimePicker, DatePicker, seletor de tags),
 * cada uma com um evento diferente. Lote B5 da auditoria de consistência.
 */
export function useCliqueFora(
  ativo: boolean,
  dentro: React.RefObject<HTMLElement | null>[],
  aoClicarFora: () => void,
) {
  const alvos = React.useRef(dentro);
  alvos.current = dentro;
  const acao = React.useRef(aoClicarFora);
  acao.current = aoClicarFora;
  React.useEffect(() => {
    if (!ativo) return;
    const fora = (e: PointerEvent) => {
      const alvo = e.target as Node;
      if (alvos.current.some((r) => r.current?.contains(alvo))) return;
      acao.current();
    };
    document.addEventListener("pointerdown", fora, true);
    return () => document.removeEventListener("pointerdown", fora, true);
  }, [ativo]);
}
