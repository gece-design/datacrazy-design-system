"use client";

import * as React from "react";
import { File as IconeDeArquivo, UploadSimple, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ajudaDeCampo, asteriscoDeCampo, erroDeCampo, rotuloDeCampo } from "@/lib/campo";
import { focoPeer } from "@/lib/estados";
import { cn } from "@/lib/utils";

/**
 * Upload — a zona de soltar arquivos e a lista do que entrou.
 *
 * Um campo de formulário como o Input: rótulo visível, `ajuda`, `obrigatorio`
 * e `erro` no mesmo lugar. A zona é um `<label>` em volta de um `<input
 * type="file">` escondido só da vista — clicar, Enter e Espaço abrem o
 * seletor do sistema; arrastar por cima acende a zona; soltar entrega os
 * arquivos em `aoAdicionar`. O componente não envia nada: quem sobe o arquivo
 * é a tela, que devolve cada um em `arquivos` com o `progresso` e o `erro`
 * que tiver. Pedido do cliente na reunião de 2026-10-02 ("falta um
 * componente de upload de arquivo") — ADR-074.
 */

export type ArquivoDoUpload = {
  id: string;
  nome: string;
  /** Em bytes. Sem ele, a linha não mostra tamanho. */
  tamanho?: number;
  /** 0 a 99 enquanto sobe (a barra aparece); 100 ou ausente = pronto. */
  progresso?: number;
  /** Com ele, a linha fica em erro e mostra a mensagem. */
  erro?: string;
};

export type RotulosDoUpload = {
  /** A frase da zona. Ex.: "Arraste arquivos ou clique para escolher". */
  chamada: string;
  /** A linha de apoio da zona: o que entra. Ex.: "PDF, DOCX ou TXT até 10 MB". */
  apoio?: string;
  /** O nome do botão de remover, com o nome do arquivo. */
  remover: (nome: string) => string;
  /** O que o leitor de tela ouve na barra de progresso. */
  enviando: (progresso: number) => string;
};

/** Os textos em pt-BR. No CRM, a tela passa os do next-intl por `rotulos`. */
export const ROTULOS_DO_UPLOAD: RotulosDoUpload = {
  chamada: "Arraste arquivos ou clique para escolher",
  remover: (nome) => `Remover ${nome}`,
  enviando: (p) => `${p}% enviado`,
};

/** "1,2 MB", "340 KB": o tamanho como a pessoa lê, no idioma dela. */
export function tamanhoLegivel(bytes: number, locale = "pt-BR") {
  const formato = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  if (bytes < 1024) return `${formato.format(bytes)} B`;
  if (bytes < 1024 * 1024) return `${formato.format(bytes / 1024)} KB`;
  return `${formato.format(bytes / (1024 * 1024))} MB`;
}

export interface UploadProps {
  /** Texto do rótulo, visível. */
  rotulo: string;
  /** Tira o rótulo da tela e o mantém para o leitor de tela. */
  rotuloOculto?: boolean;
  /** Texto de apoio sob o campo. Some enquanto há `erro`. */
  ajuda?: string;
  /** Campo obrigatório: asterisco e `aria-required`. */
  obrigatorio?: boolean;
  /** Mensagem de erro do campo (não de um arquivo): sob a lista, com a zona em traço de erro. */
  erro?: string;
  /** O que já entrou, na ordem. Quem guarda e quem envia é a tela. */
  arquivos: ArquivoDoUpload[];
  /** Os arquivos escolhidos ou soltos. A tela filtra, envia e põe em `arquivos`. */
  aoAdicionar: (arquivos: File[]) => void;
  /** Sem ela, a linha não tem o botão de remover. */
  aoRemover?: (id: string) => void;
  /** O `accept` do seletor do sistema. Ex.: ".pdf,.docx,.txt". */
  aceita?: string;
  /** Vários de uma vez. Padrão: um. */
  multiplo?: boolean;
  /** Tamanhos no idioma de quem lê. Padrão pt-BR. */
  locale?: string;
  disabled?: boolean;
  rotulos?: Partial<RotulosDoUpload>;
  className?: string;
}

export function Upload({
  rotulo,
  rotuloOculto,
  ajuda,
  obrigatorio,
  erro,
  arquivos,
  aoAdicionar,
  aoRemover,
  aceita,
  multiplo = false,
  locale = "pt-BR",
  disabled,
  rotulos: rotulosDeFora,
  className,
}: UploadProps) {
  const rotulos = { ...ROTULOS_DO_UPLOAD, ...rotulosDeFora };
  const id = React.useId().replace(/:/g, "");
  const [arrastando, setArrastando] = React.useState(false);
  const entrada = React.useRef<HTMLInputElement>(null);

  function receber(lista: FileList | null) {
    if (!lista || disabled) return;
    const escolhidos = Array.from(lista);
    aoAdicionar(multiplo ? escolhidos : escolhidos.slice(0, 1));
    // o mesmo arquivo escolhido de novo precisa disparar o change
    if (entrada.current) entrada.current.value = "";
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <label htmlFor={id} className={cn(rotuloDeCampo(), rotuloOculto && "sr-only")}>
        {rotulo}
        {obrigatorio ? (
          <span aria-hidden="true" className={asteriscoDeCampo}>
            {" *"}
          </span>
        ) : null}
      </label>

      {/* a zona é o rótulo do input escondido: clique, Enter e Espaço abrem o seletor; arrastar e soltar entrega aqui */}
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          receber(e.dataTransfer.files);
        }}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-input-border bg-input-bg px-4 py-5 text-center transition-colors",
          "hover:border-input-border-hover",
          arrastando && "border-primary bg-accent",
          erro && "border-input-border-error",
          disabled && "cursor-not-allowed bg-input-bg-disabled hover:border-input-border",
        )}
      >
        <input
          ref={entrada}
          id={id}
          type="file"
          accept={aceita}
          multiple={multiplo}
          disabled={disabled}
          aria-required={obrigatorio || undefined}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `erro-${id}` : ajuda ? `ajuda-${id}` : undefined}
          onChange={(e) => receber(e.target.files)}
          className="peer sr-only"
        />
        {/* o anel do foco vai na zona, lendo o foco do input irmão */}
        <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 rounded-md", focoPeer)} />
        <UploadSimple size={20} weight="regular" aria-hidden="true" className={cn("shrink-0", arrastando ? "text-primary" : "text-muted-foreground")} />
        <span className={cn("text-body-md", disabled ? "text-input-text-disabled" : "text-foreground")}>{rotulos.chamada}</span>
        {rotulos.apoio ? <span className="text-caption text-muted-foreground">{rotulos.apoio}</span> : null}
      </label>

      {arquivos.length > 0 ? (
        <ul className="flex flex-col gap-1 pt-1">
          {arquivos.map((a) => {
            const subindo = typeof a.progresso === "number" && a.progresso < 100;
            return (
              <li
                key={a.id}
                className={cn(
                  "flex items-center gap-2 rounded-md border bg-card px-2 py-1.5",
                  a.erro ? "border-input-border-error" : "border-border",
                )}
              >
                <IconeDeArquivo size={16} weight="regular" aria-hidden="true" className={cn("shrink-0", a.erro ? "text-destructive" : "text-muted-foreground")} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span title={a.nome} className="min-w-0 flex-1 truncate text-label-lg text-foreground">
                      {a.nome}
                    </span>
                    {typeof a.tamanho === "number" ? (
                      <span className="shrink-0 text-caption tabular-nums text-muted-foreground">{tamanhoLegivel(a.tamanho, locale)}</span>
                    ) : null}
                  </span>
                  {subindo ? (
                    <span
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={a.progresso}
                      aria-label={rotulos.enviando(a.progresso!)}
                      className="block h-1 w-full overflow-hidden rounded-full bg-muted"
                    >
                      <span className="block h-full rounded-full bg-primary transition-[width] duration-base ease-enter" style={{ width: `${a.progresso}%` }} />
                    </span>
                  ) : null}
                  {a.erro ? <span className={erroDeCampo}>{a.erro}</span> : null}
                </span>
                {aoRemover ? (
                  <Button variant="ghost" size="icon-xs" aria-label={rotulos.remover(a.nome)} title={rotulos.remover(a.nome)} onClick={() => aoRemover(a.id)} className="shrink-0">
                    <X size={14} weight="regular" aria-hidden="true" />
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      {erro ? (
        <p id={`erro-${id}`} className={erroDeCampo}>
          {erro}
        </p>
      ) : ajuda ? (
        <p id={`ajuda-${id}`} className={ajudaDeCampo}>
          {ajuda}
        </p>
      ) : null}
    </div>
  );
}
