"use client";

import * as React from "react";

/**
 * O que toda camada bloqueante precisa para ser usável por teclado: foco preso
 * no painel, Escape fecha, rolagem da página travada e foco devolvido a quem
 * abriu. Nasceu dentro do Drawer e saiu para cá quando o Modal precisou do
 * mesmo — duas cópias são como as duas se soltam.
 *
 * Camadas empilham (um modal aberto de dentro do drawer): só a do topo
 * responde ao teclado.
 */

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const pilha: object[] = [];

export function useCamada(ativa: boolean, painel: React.RefObject<HTMLElement | null>, aoFechar: () => void) {
  const fechar = React.useRef(aoFechar);
  React.useEffect(() => {
    fechar.current = aoFechar;
  });

  // Quem abriu é lido no render que abre, não no efeito: um `autoFocus` lá
  // dentro já moveu o foco antes de qualquer efeito rodar, e o foco voltaria
  // para um botão que deixou de existir.
  const estavaAtiva = React.useRef(false);
  const anterior = React.useRef<HTMLElement | null>(null);
  if (ativa && !estavaAtiva.current) anterior.current = document.activeElement as HTMLElement | null;
  estavaAtiva.current = ativa;

  React.useEffect(() => {
    const el = painel.current;
    if (!ativa || !el) return;
    const eu = {};
    pilha.push(eu);

    // Trava a rolagem compensando a barra: sem isso a página pula para o lado
    // a cada abertura.
    const { overflow, paddingRight } = document.body.style;
    const barra = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (barra > 0) document.body.style.paddingRight = `${barra}px`;

    // Um filho com `autoFocus` já pôs o foco lá dentro: respeita. Senão, o painel.
    if (!el.contains(document.activeElement)) el.focus();

    const tecla = (e: KeyboardEvent) => {
      if (pilha[pilha.length - 1] !== eu) return;
      if (e.key === "Escape") {
        // Quem está dentro (a lista aberta de um Select) fecha a si mesmo primeiro.
        if (e.defaultPrevented) return;
        e.preventDefault();
        fechar.current();
        return;
      }
      if (e.key !== "Tab") return;
      const focaveis = el.querySelectorAll<HTMLElement>(FOCAVEIS);
      if (focaveis.length === 0) {
        e.preventDefault();
        return;
      }
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      const atual = document.activeElement;
      // Foco fora do painel (clique no fundo leva o foco para o body): o Tab
      // traz de volta em vez de sair andando pela página de trás.
      if (!el.contains(atual)) {
        e.preventDefault();
        (e.shiftKey ? ultimo : primeiro).focus();
      } else if (e.shiftKey && (atual === primeiro || atual === el)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && atual === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("keydown", tecla);
      pilha.splice(pilha.indexOf(eu), 1);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      // Só devolve o foco se a camada saiu mesmo da tela. No dev, o StrictMode
      // desmonta e remonta o efeito com o painel ainda no DOM — devolver ali
      // tiraria o foco do `autoFocus`.
      if (!el.isConnected) anterior.current?.focus();
    };
  }, [ativa, painel]);
}
