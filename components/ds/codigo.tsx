"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// Realce com Shiki, que usa as MESMAS gramáticas TextMate e os mesmos temas do
// VS Code — light-plus e dark-plus são os temas padrão dele. O carregamento é
// tardio: a gramática só desce quando alguém abre a aba de código.
let cachePromise: Promise<typeof import("shiki")> | null = null;
function carregarShiki() {
  if (!cachePromise) cachePromise = import("shiki");
  return cachePromise;
}

export function Codigo({
  codigo, lang = "tsx", className,
}: { codigo: string; lang?: "tsx" | "bash" | "css" | "json"; className?: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const vivo = useRef(true);

  useEffect(() => {
    vivo.current = true;
    carregarShiki()
      .then(({ codeToHtml }) =>
        codeToHtml(codigo.trim(), {
          lang,
          themes: { light: "light-plus", dark: "dark-plus" },
          defaultColor: false,
        })
      )
      .then((h) => { if (vivo.current) setHtml(h); })
      .catch(() => { if (vivo.current) setHtml(null); });
    return () => { vivo.current = false; };
  }, [codigo, lang]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo.trim());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {}
  }

  return (
    <div className={cn("group relative overflow-hidden rounded-2xl border border-border bg-background", className)}>
      <button
        onClick={copiar}
        aria-label={copiado ? "Copiado" : "Copiar código"}
        className="absolute right-3 top-3 z-dropdown inline-flex h-7 w-7 items-center justify-center rounded-md
                   border border-border bg-card text-muted-foreground opacity-0 transition-all
                   hover:text-foreground focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-ring group-hover:opacity-100"
      >
        {copiado ? <Check size={14} weight="bold" className="text-success" /> : <Copy size={14} weight="regular" />}
      </button>

      {html ? (
        <div className="dc-shiki overflow-x-auto p-5" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[21px] text-foreground">
          <code>{codigo.trim()}</code>
        </pre>
      )}
    </div>
  );
}
