"use client";

import * as React from "react";

/** useLayoutEffect avisa no console quando roda no servidor. A medição só
 *  acontece no cliente, então o hook cai para useEffect no SSR. */
const useEfeitoDeLayout = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * Lado em que um painel flutuante abre, MEDIDO: para cima quando não cabe
 * embaixo (e cabe em cima), alinhado à direita quando vaza pela direita.
 * Com zoom acima de 100% o viewport encolhe em CSS px e um painel de 660px
 * deixa de caber (E3) — por isso é medida, não presunção. Remede em resize e
 * em qualquer rolagem.
 *
 * Era uma cópia no TimePicker e outra no DatePicker. Lote B5.
 */
export function usePosicao(aberto: boolean) {
  const gatilho = React.useRef<HTMLButtonElement>(null);
  const painel = React.useRef<HTMLDivElement>(null);
  const [acima, setAcima] = React.useState(false);
  const [aDireita, setADireita] = React.useState(false);

  useEfeitoDeLayout(() => {
    if (!aberto) return;
    function medir() {
      const g = gatilho.current?.getBoundingClientRect();
      const p = painel.current?.getBoundingClientRect();
      if (!g || !p) return;
      setAcima(g.bottom + p.height + 8 > window.innerHeight && g.top - p.height - 8 > 0);
      setADireita(g.left + p.width + 8 > window.innerWidth);
    }
    medir();
    window.addEventListener("resize", medir);
    window.addEventListener("scroll", medir, true);
    return () => {
      window.removeEventListener("resize", medir);
      window.removeEventListener("scroll", medir, true);
    };
  }, [aberto]);

  return { gatilho, painel, acima, aDireita };
}
