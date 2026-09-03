"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { vizinhos, type ItemNav } from "./nav";
import { cn } from "@/lib/utils";

function Cartao({ item, lado }: { item: ItemNav; lado: "anterior" | "proxima" }) {
  const paraFrente = lado === "proxima";
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex flex-1 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors",
        "hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        paraFrente ? "flex-row-reverse text-right" : "text-left"
      )}
    >
      {paraFrente ? (
        <ArrowRight size={16} weight="regular" className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      ) : (
        <ArrowLeft size={16} weight="regular" className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      )}
      <span className="min-w-0">
        <span className="block truncate text-label-lg text-foreground">{item.titulo}</span>
        {item.descricao && (
          <span className="block truncate text-body-md text-subtle-foreground">{item.descricao}</span>
        )}
      </span>
    </Link>
  );
}

export function Paginacao() {
  const caminho = usePathname();
  const router = useRouter();
  const { anterior, proxima } = vizinhos(caminho);

  // Atalho: [ volta, ] avança. Escolhidos por não competirem com rolagem
  // (setas) nem com atalho de navegador. Ignora quando se está digitando.
  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const alvo = e.target as HTMLElement | null;
      if (alvo && (alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName))) return;
      if (e.key === "[" && anterior) router.push(anterior.href);
      if (e.key === "]" && proxima) router.push(proxima.href);
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [anterior, proxima, router]);

  if (!anterior && !proxima) return null;

  return (
    <nav aria-label="Navegação entre páginas" className="mt-16 border-t border-border pt-6">
      <div className="flex items-stretch gap-3">
        {anterior ? <Cartao item={anterior} lado="anterior" /> : <div className="flex-1" />}
        {proxima ? <Cartao item={proxima} lado="proxima" /> : <div className="flex-1" />}
      </div>
      <p className="mt-3 text-center text-caption text-subtle-foreground">
        Atalho:{" "}
        <kbd className="rounded border border-border bg-background px-1 py-px font-mono">[</kbd> anterior ·{" "}
        <kbd className="rounded border border-border bg-background px-1 py-px font-mono">]</kbd> próxima
      </p>
    </nav>
  );
}
