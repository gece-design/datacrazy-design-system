"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretRight, SidebarSimple } from "@phosphor-icons/react";
import { Sidebar } from "./sidebar";
import { ThemeToggle, ThemeToggleFlutuante } from "./theme-toggle";
import { Colunas } from "./colunas";
import { tituloDaRota } from "./nav";

// Três colunas: sidebar · conteúdo centralizado no que sobra · trilho à direita.
// Header e conteúdo usam a MESMA grade — o botão de menu, o breadcrumb e o
// seletor de tema ficam todos dentro da coluna do meio, alinhados com o título.
export function Shell({ children }: { children: React.ReactNode }) {
  const caminho = usePathname();
  const rota = tituloDaRota(caminho);
  const [aberta, setAberta] = useState(true);

  return (
    <div className="flex min-h-screen bg-card">
      {aberta && <Sidebar />}
      <div className="min-w-0 flex-1">
        <header className={`flex h-[76px] items-center pr-10 ${aberta ? "pl-10" : "pl-6"}`}>
          <Colunas>
            <div className="flex items-center justify-between gap-4">
              <nav aria-label="Trilha" className="flex min-w-0 items-center gap-2 text-body-lg">
                <button
                  onClick={() => setAberta((a) => !a)}
                  aria-label={aberta ? "Fechar menu" : "Abrir menu"}
                  aria-expanded={aberta}
                  className="-ml-1.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md
                             text-muted-foreground transition-colors hover:bg-background hover:text-foreground
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <SidebarSimple size={18} weight="regular" />
                </button>
                <Link href="/" className="shrink-0 text-muted-foreground transition-colors hover:text-foreground">
                  Design System
                </Link>
                {rota && (
                  <>
                    <CaretRight size={12} weight="bold" className="shrink-0 text-subtle-foreground" />
                    <span className="shrink-0 text-muted-foreground">{rota.categoria}</span>
                    <CaretRight size={12} weight="bold" className="shrink-0 text-subtle-foreground" />
                    <span className="truncate text-foreground">{rota.item}</span>
                  </>
                )}
              </nav>
              <ThemeToggle className="shrink-0" />
            </div>
          </Colunas>
        </header>

        <main className={`pb-24 pr-10 ${aberta ? "pl-10" : "pl-6"}`}>{children}</main>
      </div>

      <ThemeToggleFlutuante />
    </div>
  );
}
