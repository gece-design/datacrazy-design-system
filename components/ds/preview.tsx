"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Eye, Code as CodeIcon, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Colunas } from "./colunas";
import { Codigo } from "./codigo";
import { Paginacao } from "./paginacao";
import { Indice, IndiceCompacto, slug } from "./indice";
import {
  SeletorDeFundo,
  classeDoFundo,
  lerFundoSalvo,
  primeiroFundoLimpo,
  salvarFundo,
  somemNoFundo,
  type Fundo,
} from "./fundo-preview";

import { foco } from "@/lib/estados";
import guia from "@/lib/quando-usar.json";
export { FUNDOS, type Fundo } from "./fundo-preview";

/* "Quando usar" sai da doc do componente (docs/componentes/*.md), a mesma que
 * o Claude lê pela skill — `gerar-registry.mjs` escreve o JSON. A página só
 * mostra; quem quer mudar o texto muda a doc. */
type GuiaDeUso = { componente: string; usar: string[]; naoUsar: string[] };
const TITULO_DO_GUIA = "Quando usar";

// slug e o índice moram em ./indice — quem monta o link e quem lê a âncora
// precisam da mesma função, e duplicá-la é como as duas se soltam.
export { slug };

/** Trecho de código no meio do texto. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    // Fora da caixa o chip é `background` sobre a página branca; dentro da
    // caixa de preview, que já é `background`, ele inverte para `card`.
    <code className="rounded bg-background px-1.5 py-0.5 font-mono chrome-chip text-foreground [[data-caixa]_&]:bg-card">
      {children}
    </code>
  );
}

export function PaginaDS({
  titulo, descricao, secoes: declaradas = [], children,
}: { titulo: string; descricao: string; secoes?: string[]; children: React.ReactNode }) {
  const rota = usePathname();
  const grupos = (guia as Record<string, GuiaDeUso[]>)[rota] ?? [];
  // página que já escreveu o seu "Quando usar" (com exemplo vivo) fica com ele
  const comGuia = grupos.length > 0 && !declaradas.some((s) => s.startsWith(TITULO_DO_GUIA));
  const secoes = useMemo(
    () => (comGuia ? [...declaradas, TITULO_DO_GUIA] : declaradas),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comGuia, declaradas.join("|")],
  );
  return (
    <Colunas trilho={<Indice secoes={secoes} />}>
      <h1 className="chrome-h1 text-foreground">{titulo}</h1>
      <p className="mt-3 chrome-lead text-muted-foreground">{descricao}</p>
      <IndiceCompacto secoes={secoes} />
      <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
        {children}
        {comGuia && <QuandoUsar grupos={grupos} />}
      </div>
      <Paginacao />
    </Colunas>
  );
}

/** Texto da doc: o que vem entre crases vira Chip. */
function comChips(texto: string) {
  return texto.split("`").map((parte, i) => (i % 2 ? <Chip key={i}>{parte}</Chip> : parte));
}

function ListaDeUso({ titulo, itens, sim }: { titulo: string; itens: string[]; sim?: boolean }) {
  const Icone = sim ? Check : X;
  return (
    <div className="min-w-0">
      <p className="chrome-label text-foreground">{titulo}</p>
      <ul className="mt-3 space-y-3 chrome-prose text-muted-foreground">
        {itens.map((item) => (
          <li key={item} className="flex gap-2">
            <Icone
              size={14}
              weight="bold"
              aria-hidden="true"
              className={cn("mt-1 shrink-0", sim ? "text-success" : "text-destructive")}
            />
            <span className="min-w-0">{comChips(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuandoUsar({ grupos }: { grupos: GuiaDeUso[] }) {
  return (
    <Secao
      titulo={TITULO_DO_GUIA}
      descricao="O que este componente resolve — e, quando o caso é de outro, qual."
      semSeletorDeFundo
    >
      <div className="space-y-8">
        {grupos.map((g) => (
          <div key={g.componente}>
            {grupos.length > 1 && <h3 className="mb-4 chrome-h3 text-foreground">{g.componente}</h3>}
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <ListaDeUso titulo="Use" itens={g.usar} sim />
              <ListaDeUso titulo="Não use" itens={g.naoUsar} />
            </div>
          </div>
        ))}
      </div>
    </Secao>
  );
}

/** Bloco de abertura: explica o mecanismo antes de mostrar o resultado. */
export function ComoFunciona({ children }: { children: React.ReactNode }) {
  return (
    <section id={slug("Como funciona")} className="scroll-mt-6">
      <h2 className="chrome-h2 text-foreground">Como funciona</h2>
      <div className="mt-3 space-y-4 chrome-prose text-muted-foreground">{children}</div>
    </section>
  );
}

export function Secao({
  titulo, spec, descricao, codigo, lang = "tsx", nota, children, className, semCaixa, fundo, semSeletorDeFundo,
}: {
  titulo: string;
  spec?: string;
  descricao?: string;
  /** Só passe quando houver código de verdade a copiar. Sem isto, a seção não
   *  ganha abas — bloco de referência ou explicação é preview e ponto. */
  codigo?: string;
  lang?: "tsx" | "bash" | "css" | "json";
  /** Anotação da seção. Fica FORA da caixa, por baixo dela — a caixa é só o
   *  componente, como na referência. Nunca coloque explicação dentro do preview. */
  nota?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  semCaixa?: boolean;
  /** Fixa o fundo inicial da caixa. Passar isto DESLIGA a regra de contraste:
   *  quem declarou já decidiu. O humano ainda pode trocar pelas amostras. */
  fundo?: Fundo;
  /** Esconde as amostras. Só para preview que traz o próprio palco — um mock
   *  externo, por exemplo, onde a cor da caixa não encosta em nada. */
  semSeletorDeFundo?: boolean;
}) {
  const [aba, setAba] = useState<"preview" | "codigo">("preview");
  const temCodigo = Boolean(codigo);

  const caixaRef = useRef<HTMLDivElement>(null);
  const [fundoAtual, setFundoAtual] = useState<Fundo>(fundo ?? "background");
  // `true` só enquanto ninguém tocou nas amostras: é o que autoriza a regra a
  // decidir e o que acende a etiqueta "contraste".
  const [trocadoAuto, setTrocadoAuto] = useState(false);
  const humanoEscolheu = useRef(false);

  // A caixa não tem id próprio: rota + título da seção é o par estável.
  const rota = usePathname();
  const chaveDoFundo = `${rota}#${slug(titulo)}`;

  // A escolha salva. Só depois de montar — no servidor não existe storage, e
  // ler no primeiro render trocaria o HTML por baixo da hidratação.
  useEffect(() => {
    const salvo = lerFundoSalvo(chaveDoFundo);
    if (!salvo) return;
    humanoEscolheu.current = true;
    setTrocadoAuto(false);
    setFundoAtual(salvo);
  }, [chaveDoFundo]);

  // A regra de contraste. Roda uma vez, depois da primeira pintura do preview:
  // se no fundo padrão algum elemento some, cai no primeiro neutro em que não
  // some. Ver `somemNoFundo` em ./fundo-preview.
  useEffect(() => {
    if (fundo || semSeletorDeFundo || humanoEscolheu.current) return;
    if (temCodigo && aba !== "preview") return;
    const caixa = caixaRef.current;
    if (!caixa) return;
    const id = requestAnimationFrame(() => {
      if (!somemNoFundo(caixa)) return;
      const limpo = primeiroFundoLimpo(caixa);
      if (!limpo || limpo === "background") return;
      setFundoAtual(limpo);
      setTrocadoAuto(true);
    });
    return () => cancelAnimationFrame(id);
  }, [fundo, semSeletorDeFundo, temCodigo, aba]);

  const mostrarControles = (temCodigo || !semSeletorDeFundo) && !(temCodigo && aba === "codigo" && semSeletorDeFundo);

  return (
    <section id={slug(titulo)} className="scroll-mt-6">
      <div className="flex items-baseline gap-3">
        <h2 className="chrome-h2 text-foreground">{titulo}</h2>
        {spec && <span className="font-mono chrome-meta text-subtle-foreground">{spec}</span>}
      </div>
      {descricao && <p className="mt-2 chrome-prose text-muted-foreground">{descricao}</p>}

      {mostrarControles && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {temCodigo ? (
            <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
              {([["preview", "Preview", Eye], ["codigo", "Código", CodeIcon]] as const).map(([id, rot, Icone]) => (
                <button
                  key={id}
                  onClick={() => setAba(id)}
                  aria-pressed={aba === id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 chrome-label transition-colors",
                    `${foco}`,
                    aba === id ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icone size={15} weight="regular" />
                  {rot}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          {!semSeletorDeFundo && aba === "preview" && (
            <SeletorDeFundo
              valor={fundoAtual}
              trocadoAuto={trocadoAuto}
              aoEscolher={(f) => {
                humanoEscolheu.current = true;
                setTrocadoAuto(false);
                setFundoAtual(f);
                salvarFundo(chaveDoFundo, f);
              }}
            />
          )}
        </div>
      )}

      {temCodigo && aba === "codigo" ? (
        <Codigo codigo={codigo!} lang={lang} className="mt-4" />
      ) : (
        <>
          {/* a caixa é só o componente — anotação vai em `nota`, por baixo.
              O fundo padrão é `background`: é a superfície sobre a qual o
              componente vive no produto. As amostras ao lado do título trocam
              esse palco por outro neutro, e a regra de contraste troca sozinha
              quando o padrão faz alguma peça sumir. */}
          <div
            ref={caixaRef}
            data-caixa
            data-fundo={fundoAtual}
            className={cn(
              "mt-4 rounded-2xl border border-border",
              classeDoFundo(fundoAtual),
              !semCaixa && "p-4 sm:p-6 lg:p-8",
              className,
            )}
          >
            {children}
          </div>
          {nota && <div className="mt-3 chrome-meta text-subtle-foreground">{nota}</div>}
        </>
      )}
    </section>
  );
}

export function Legenda({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 chrome-meta text-subtle-foreground">{children}</p>;
}

export function CardComponente({
  titulo, descricao, href, pronto, children,
}: { titulo: string; descricao: string; href: string; pronto?: boolean; children: React.ReactNode }) {
  const conteudo = (
    <>
      {/* inert: o card inteiro já é o link. Botão, campo ou trilha dentro do
          preview não recebem foco nem clique, e o clique cai no card. */}
      <div inert className="grid h-44 place-items-center overflow-hidden border-b border-border bg-background px-6">
        {children}
      </div>
      <div className="p-4">
        <p className="chrome-h3 text-foreground">{titulo}</p>
        <p className="mt-1 chrome-meta text-muted-foreground">{descricao}</p>
      </div>
    </>
  );

  if (!pronto) {
    return (
      <div
        aria-disabled="true"
        title="Ainda não implementado"
        className="cursor-not-allowed overflow-hidden rounded-2xl border border-border bg-card opacity-disabled"
      >
        {conteudo}
      </div>
    );
  }

  return (
    <a
      href={href}
      className={`block overflow-hidden rounded-2xl border border-border bg-card transition-colors
                 hover:border-primary ${foco}`}
    >
      {conteudo}
    </a>
  );
}
