"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MagnifyingGlass, CaretDown, CaretRight, Palette, TextAa, Shapes,
  Lock, RocketLaunch, DownloadSimple,
} from "@phosphor-icons/react";
import { navegacao } from "./nav";
import { Logo } from "./logo";
import { Tree } from "./tree";
import { cn } from "@/lib/utils";

// Medidas do Figma (node 255:6493): sidebar 260 · padding 13 · conteúdo 234
// busca h36 p8 · categoria h28 px10 · item h32 passo 34 · ícone x32 · texto x56
const icones: Record<string, React.ComponentType<{ size?: number; weight?: "regular"; className?: string }>> = {
  palette: Palette,
  texto: TextAa,
  formas: Shapes,
  foguete: RocketLaunch,
  download: DownloadSimple,
};

export function Sidebar() {
  const caminho = usePathname();
  const [busca, setBusca] = useState("");
  const [fechadas, setFechadas] = useState<string[]>([]);

  const filtrada = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return navegacao;
    return navegacao
      .map((c) => ({ ...c, itens: c.itens.filter((i) => i.titulo.toLowerCase().includes(q)) }))
      .filter((c) => c.itens.length > 0);
  }, [busca]);

  return (
    <aside className="sticky top-3 m-3 hidden h-[calc(100vh-24px)] w-[260px] shrink-0 flex-col gap-3 overflow-hidden rounded-[16px] border border-card bg-background p-[13px] lg:flex">
      <Link
        href="/"
        className="flex h-[26px] items-center justify-center text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        <Logo className="h-[21px] w-auto" />
      </Link>

      <div className="relative h-9">
        <MagnifyingGlass
          size={20}
          weight="regular"
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar"
          aria-label="Buscar componente"
          className="chrome-item h-9 w-full chrome-busca rounded-full border-0 pl-[36px] pr-[44px] text-foreground
                     placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-ring"
        />
        <kbd className="chrome-kbd pointer-events-none absolute right-2 top-1/2 flex h-5 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-subtle-foreground/25 text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <nav className="-mr-1.5 flex-1 space-y-2 overflow-y-auto pr-1.5">
        {filtrada.map((cat) => {
          const fechada = fechadas.includes(cat.titulo);
          const Chevron = fechada ? CaretRight : CaretDown;
          return (
            <div key={cat.titulo}>
              <button
                onClick={() =>
                  setFechadas((f) =>
                    f.includes(cat.titulo) ? f.filter((x) => x !== cat.titulo) : [...f, cat.titulo]
                  )
                }
                className="chrome-categoria flex h-7 w-full items-start justify-between rounded-md px-2.5 pb-1 pt-2
                           text-muted-foreground transition-colors hover:text-foreground
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="truncate">{cat.titulo}</span>
                <Chevron size={16} weight="regular" className="shrink-0" />
              </button>

              {!fechada && (
                <ul className="relative mt-0.5 space-y-0.5">
                  <Tree itens={cat.itens.length} />
                  {cat.itens.map((item) => {
                    const ativo = caminho === item.href;
                    const Icone = item.icone ? icones[item.icone] : null;
                    const base = "chrome-item relative flex h-8 items-center gap-2 rounded-md pl-8 pr-2.5 transition-colors";

                    if (!item.pronto) {
                      return (
                        <li key={item.href}>
                          <span
                            aria-disabled="true"
                            title="Ainda não implementado"
                            className={cn(base, "cursor-not-allowed text-subtle-foreground")}
                          >
                            {Icone && <Icone size={16} weight="regular" className="shrink-0" />}
                            <span className="flex-1 truncate">{item.titulo}</span>
                            <Lock size={13} weight="regular" className="shrink-0 opacity-60" />
                          </span>
                        </li>
                      );
                    }

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            base,
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            ativo ? "bg-card text-foreground" : "text-foreground hover:bg-card"
                          )}
                        >
                          {Icone && <Icone size={16} weight="regular" className="shrink-0" />}
                          <span className="flex-1 truncate">{item.titulo}</span>
                          <span className="chrome-selo flex h-[18px] items-center rounded-[4px] bg-accent px-1 text-primary">
                            new
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
        {filtrada.length === 0 && (
          <p className="px-2.5 py-6 text-center text-body-md text-subtle-foreground">Nada encontrado.</p>
        )}
      </nav>
    </aside>
  );
}
