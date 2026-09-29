"use client";

import { useEffect, useState } from "react";
import { useTema } from "@/lib/tema";
import { Sun, Moon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

import { foco } from "@/lib/estados";
/** O hook mora em lib/tema.ts (a mesma memória `dc-tema` das telas e dos
 *  blocos instaláveis); fica exportado daqui porque a página do Sidebar e o
 *  chrome do site já importam deste arquivo. */
export { useTema } from "@/lib/tema";

export function ThemeToggle({ className }: { className?: string }) {
  const { escuro, alternar } = useTema();
  return (
    <button
      onClick={alternar}
      aria-label={escuro ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground",
        "transition-colors hover:bg-background hover:text-foreground",
        `${foco}`,
        className
      )}
    >
      {escuro ? <Moon size={16} weight="regular" /> : <Sun size={16} weight="regular" />}
    </button>
  );
}

/** Aparece só depois que a página rola — quando o botão do topo saiu de vista. */
export function ThemeToggleFlutuante() {
  const { escuro, alternar } = useTema();
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > 120);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <button
      onClick={alternar}
      aria-label={escuro ? "Mudar para tema claro" : "Mudar para tema escuro"}
      aria-hidden={!visivel}
      tabIndex={visivel ? 0 : -1}
      className={cn(
        "fixed bottom-6 right-6 z-toast inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border border-border bg-card text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]",
        "transition-[color,transform,opacity] duration-base hover:text-foreground",
        `${foco}`,
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      {escuro ? <Moon size={18} weight="regular" /> : <Sun size={18} weight="regular" />}
    </button>
  );
}
