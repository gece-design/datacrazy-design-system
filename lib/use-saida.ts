"use client";

import * as React from "react";
import { DURACAO, reduzido } from "@/lib/movimento";

/** `true` só depois de montar no cliente: portal precisa do `document`, e
 *  no servidor a camada não existe. */
export function useMontado() {
  const [montado, setMontado] = React.useState(false);
  React.useEffect(() => setMontado(true), []);
  return montado;
}

/**
 * Fechar tem que ser visto: a camada fica montada enquanto a animação de saída
 * roda, e só então some. `saindo` é o intervalo entre `aberto` virar false e o
 * fim da animação — é o que liga a classe `animate-*-sai`. Quem pediu menos
 * movimento ao sistema não espera nada: sai na hora (I12, interactions L9).
 *
 * `saindo` é derivado DURANTE o render, não num efeito: com efeito, o render
 * em que `aberto` vira false ainda vê `saindo` false, desmonta o painel por
 * um quadro e remonta com a animação — um piscar. Estado derivado no render
 * refaz o render antes de commitar, e o painel nunca sai do DOM.
 *
 * Nasceu no Drawer; Modal, Tooltip e os painéis passam a usar (lote B7). O
 * tempo padrão é o `base` da escala — o mesmo de `fade-out` e `drawer-sai`.
 */
export function useSaida(aberto: boolean, duracao: number = DURACAO.base) {
  const [saindo, setSaindo] = React.useState(false);
  const anterior = React.useRef(aberto);
  if (anterior.current !== aberto) {
    anterior.current = aberto;
    if (!aberto && !reduzido()) setSaindo(true);
    if (aberto) setSaindo(false);
  }
  React.useEffect(() => {
    if (!saindo) return;
    const fim = setTimeout(() => setSaindo(false), duracao);
    return () => clearTimeout(fim);
  }, [saindo, duracao]);
  return { saindo, visivel: aberto || saindo };
}
