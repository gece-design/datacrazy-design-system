"use client";

import { useEffect, useState } from "react";
import { List } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Qual seção está sendo lida. Não usa IntersectionObserver de propósito: seção
 * de doc é alta demais e frequentemente NENHUMA borda cruza a raiz, o que deixa
 * o observador mudo no meio de um bloco longo. A conta aqui é direta — a última
 * seção cujo topo já passou da linha de leitura — e não tem esse ponto cego.
 */
function useSecaoAtiva(secoes: string[]) {
  const [ativa, setAtiva] = useState<string | null>(null);

  useEffect(() => {
    if (secoes.length === 0) return;
    const ids = secoes.map(slug);
    let agendado = false;

    function medir() {
      agendado = false;
      // fim da página: a última seção nunca chega à linha, então é assumida
      const fim = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (fim) return setAtiva(ids[ids.length - 1]);

      const linha = 140; // altura do header + respiro
      let atual = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= linha) atual = id;
      }
      setAtiva(atual);
    }

    function aoRolar() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(medir);
    }

    medir();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, [secoes]);

  return ativa;
}

/** Trilho da direita (xl+). Acompanha a rolagem e marca a seção em leitura. */
export function Indice({ secoes }: { secoes: string[] }) {
  const ativa = useSecaoAtiva(secoes);
  if (secoes.length === 0) return null;

  return (
    <nav aria-label="Nesta página" className="sticky top-6 hidden max-h-[calc(100vh-48px)] overflow-y-auto xl:block">
      <p className="mb-2.5 chrome-caption uppercase tracking-[0.06em] text-subtle-foreground">Nesta página</p>
      <ul className="border-l border-border">
        {secoes.map((s) => {
          const id = slug(s);
          const atual = ativa === id;
          return (
            <li key={s}>
              <a
                href={`#${id}`}
                aria-current={atual ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l py-1.5 pl-3 chrome-meta transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  atual
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {s}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * O mesmo índice onde o trilho não cabe (< xl). Vira um bloco recolhido no topo
 * do conteúdo: numa página de 8 seções, rolar às cegas no celular é o pior caso.
 */
export function IndiceCompacto({ secoes }: { secoes: string[] }) {
  const [aberto, setAberto] = useState(false);
  if (secoes.length === 0) return null;

  return (
    <details
      open={aberto}
      onToggle={(e) => setAberto((e.currentTarget as HTMLDetailsElement).open)}
      className="mt-6 overflow-hidden rounded-xl border border-border bg-background xl:hidden"
    >
      <summary
        className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 chrome-label text-foreground
                   marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                   [&::-webkit-details-marker]:hidden"
      >
        <List size={16} weight="regular" className="text-muted-foreground" />
        Nesta página
        <span className="ml-auto chrome-caption text-subtle-foreground">{secoes.length}</span>
      </summary>
      <ul className="border-t border-border px-3.5 py-2">
        {secoes.map((s) => (
          <li key={s}>
            <a
              href={`#${slug(s)}`}
              onClick={() => setAberto(false)}
              className="block py-1.5 chrome-meta text-muted-foreground transition-colors hover:text-foreground
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {s}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
