"use client";

import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlass, Check, Copy, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Ico = { n: string; p: string; c: string[]; t: string[]; d: string };
type Catalogo = { versao: string; peso: string; total: number; icones: Ico[] };

const PESOS = ["thin", "light", "regular", "bold", "fill", "duotone"] as const;
type Peso = (typeof PESOS)[number];

const LOTE = 180;

function svgDe(ico: Ico, tamanho = 24) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tamanho}" height="${tamanho}" viewBox="0 0 256 256" fill="currentColor">${ico.d}</svg>`;
}

function BotaoCopiar({ rotulo, valor }: { rotulo: string; valor: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(valor);
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        } catch {}
      }}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2
                 text-left transition-colors hover:border-primary
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="min-w-0">
        <span className="block text-caption text-subtle-foreground">{rotulo}</span>
        <span className="block truncate font-mono text-body-md text-foreground">{valor}</span>
      </span>
      {ok ? (
        <Check size={15} weight="bold" className="shrink-0 text-success" />
      ) : (
        <Copy size={15} weight="regular" className="shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}

export function IconBrowser() {
  const [peso, setPeso] = useState<Peso>("regular");
  const [cat, setCat] = useState<Catalogo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("todas");
  const [quantos, setQuantos] = useState(LOTE);
  const [aberto, setAberto] = useState<Ico | null>(null);

  useEffect(() => {
    let vivo = true;
    setCarregando(true);
    fetch(`/phosphor/${peso}.json`)
      .then((r) => r.json())
      .then((d: Catalogo) => { if (vivo) { setCat(d); setCarregando(false); } })
      .catch(() => { if (vivo) setCarregando(false); });
    return () => { vivo = false; };
  }, [peso]);

  const categorias = useMemo(() => {
    if (!cat) return [];
    return [...new Set(cat.icones.flatMap((i) => i.c))].sort();
  }, [cat]);

  const filtrados = useMemo(() => {
    if (!cat) return [];
    const q = busca.trim().toLowerCase();
    return cat.icones.filter((i) => {
      if (categoria !== "todas" && !i.c.includes(categoria)) return false;
      if (!q) return true;
      return i.n.includes(q) || i.p.toLowerCase().includes(q) || i.t.some((t) => t.includes(q));
    });
  }, [cat, busca, categoria]);

  useEffect(() => setQuantos(LOTE), [busca, categoria, peso]);

  const visiveis = filtrados.slice(0, quantos);
  const selecionado = aberto && cat ? cat.icones.find((i) => i.n === aberto.n) ?? aberto : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <MagnifyingGlass size={16} weight="regular" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle-foreground" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou tag"
            aria-label="Buscar ícone"
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-body-lg text-foreground
                       placeholder:text-subtle-foreground focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </div>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label="Filtrar por categoria"
          className="h-9 rounded-lg border border-border bg-card px-2.5 text-body-lg text-foreground
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <option value="todas">Todas as categorias</option>
          {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
          {PESOS.map((w) => (
            <button
              key={w}
              onClick={() => setPeso(w)}
              aria-pressed={peso === w}
              className={cn(
                "rounded-md px-2 py-1 text-label-md transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                peso === w ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-body-md text-subtle-foreground">
        {carregando ? "Carregando o catálogo…" : `${filtrados.length} de ${cat?.total ?? 0} ícones`}
        {cat && <> · catálogo oficial <span className="font-mono">@phosphor-icons/core v{cat.versao}</span></>}
      </p>

      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-1.5">
        {visiveis.map((i) => (
          <button
            key={i.n}
            onClick={() => setAberto(i)}
            title={i.p}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-transparent",
              "text-foreground transition-colors hover:border-border hover:bg-background",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              aberto?.n === i.n && "border-primary bg-accent"
            )}
          >
            <span className="h-6 w-6" aria-hidden dangerouslySetInnerHTML={{ __html: svgDe(i, 24) }} />
            <span className="w-full truncate px-1 text-center text-caption text-subtle-foreground">{i.n}</span>
          </button>
        ))}
      </div>

      {!carregando && filtrados.length === 0 && (
        <p className="py-10 text-center text-body-lg text-subtle-foreground">Nenhum ícone com esse termo.</p>
      )}

      {quantos < filtrados.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setQuantos((q) => q + LOTE * 3)}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-label-lg text-foreground transition-colors
                       hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-ring"
          >
            Mostrar mais ({filtrados.length - quantos} restantes)
          </button>
        </div>
      )}

      {selecionado && (
        <div className="mt-5 rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground">
              <span className="h-8 w-8" aria-hidden dangerouslySetInnerHTML={{ __html: svgDe(selecionado, 32) }} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-h3 text-foreground">{selecionado.p}</p>
              <p className="mt-0.5 text-body-md text-muted-foreground">
                {selecionado.c.join(" · ")} · peso <span className="font-mono">{peso}</span>
              </p>
              {selecionado.t.length > 0 && (
                <p className="mt-1 text-caption text-subtle-foreground">{selecionado.t.slice(0, 10).join(", ")}</p>
              )}
            </div>
            <button
              onClick={() => setAberto(null)}
              aria-label="Fechar"
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <X size={16} weight="regular" />
            </button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <BotaoCopiar rotulo="Nome do componente" valor={selecionado.p} />
            <BotaoCopiar rotulo="Import" valor={`import { ${selecionado.p} } from "@phosphor-icons/react";`} />
            <BotaoCopiar
              rotulo="Uso"
              valor={`<${selecionado.p} size={20} weight="${peso}" />`}
            />
            <BotaoCopiar rotulo="SVG" valor={svgDe(selecionado, 24)} />
          </div>
        </div>
      )}
    </div>
  );
}
