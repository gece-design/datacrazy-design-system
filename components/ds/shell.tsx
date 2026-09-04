"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretRight, List, SidebarSimple } from "@phosphor-icons/react";
import { Sidebar, SidebarDrawer } from "./sidebar";
import { ThemeToggle, ThemeToggleFlutuante } from "./theme-toggle";
import { Colunas } from "./colunas";
import { tituloDaRota } from "./nav";

// Três larguras, três layouts:
//
//   < lg   sidebar vira drawer por cima do conteúdo; sem trilho.
//   lg–xl  sidebar fixa (painel de 260 ou rail de 64); sem trilho — é a faixa
//          onde antes sobrava uma coluna vazia de 284px.
//   xl +   entra o trilho do índice, de 184px.
//
// Header e conteúdo usam a MESMA grade (`Colunas`), então o breadcrumb cai
// sempre sobre a borda esquerda do título.
export function Shell({ children }: { children: React.ReactNode }) {
  const caminho = usePathname();
  const rota = tituloDaRota(caminho);
  const [rail, setRail] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const recuo = rail ? "lg:pl-8" : "lg:pl-10";

  return (
    <div className="flex min-h-screen bg-card">
      <Sidebar
        rail={rail}
        onExpandir={() => setRail(false)}
        className="sticky top-3 m-3 hidden h-[calc(100vh-24px)] lg:flex"
      />
      <SidebarDrawer aberto={drawer} onFechar={() => setDrawer(false)} />

      <div className="min-w-0 flex-1">
        <header className={`flex h-16 items-center px-4 sm:px-6 lg:h-[76px] lg:pr-10 ${recuo}`}>
          <Colunas>
            <div className="flex items-center justify-between gap-3">
              <nav aria-label="Trilha" className="flex min-w-0 items-center gap-1.5 chrome-item sm:gap-2">
                {/* dois botões e não um: qual gesto o menu faz depende da
                    largura, e ler a largura em JS custaria um salto de
                    hidratação em toda navegação. O CSS já sabe a resposta. */}
                <button
                  onClick={() => setDrawer(true)}
                  aria-label="Abrir menu"
                  className="-ml-1.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md
                             text-muted-foreground transition-colors hover:bg-background hover:text-foreground
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                >
                  <List size={20} weight="regular" />
                </button>
                <button
                  onClick={() => setRail((r) => !r)}
                  aria-label={rail ? "Expandir menu" : "Recolher menu"}
                  aria-expanded={!rail}
                  className="-ml-1.5 hidden h-8 w-8 shrink-0 items-center justify-center rounded-md
                             text-muted-foreground transition-colors hover:bg-background hover:text-foreground
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:inline-flex"
                >
                  <SidebarSimple size={18} weight="regular" />
                </button>

                <Link
                  href="/"
                  className="hidden shrink-0 text-muted-foreground transition-colors hover:text-foreground sm:block"
                >
                  Design System
                </Link>
                {rota && (
                  <>
                    <CaretRight size={12} weight="bold" className="hidden shrink-0 text-subtle-foreground sm:block" />
                    {/* a categoria é o primeiro nível a cair: no celular ela
                        empurraria o nome da página para fora da tela */}
                    <span className="hidden shrink-0 text-muted-foreground md:block">{rota.categoria}</span>
                    <CaretRight size={12} weight="bold" className="hidden shrink-0 text-subtle-foreground md:block" />
                    <span className="truncate text-foreground">{rota.item}</span>
                  </>
                )}
              </nav>
              <ThemeToggle className="shrink-0" />
            </div>
          </Colunas>
        </header>

        <main className={`pb-20 pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pb-24 lg:pr-10 ${recuo}`}>{children}</main>
      </div>

      <ThemeToggleFlutuante />
    </div>
  );
}
