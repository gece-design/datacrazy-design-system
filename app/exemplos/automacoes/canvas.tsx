"use client";

import * as React from "react";
import { ChatCircleDots, GitBranch, HourglassMedium, Lightning, Play, Shuffle, type Icon } from "@phosphor-icons/react";
import { Canvas, type CanvasProps, type CanvasRef, type TipoDoCanvas } from "@/components/ui/canvas";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { TIPOS, type Bloco, type TipoDeBloco } from "./dados";

/* O canvas desta tela: o `Canvas` do design system com o que é da automação —
   o ícone de cada tipo, qual é o início (o gatilho), o que dá para adicionar e
   o corpo dos blocos que resumem mais que uma lista (a mensagem com o canal, a
   espera com o tempo). Mover, zoom, ligar, marcar, desfazer, organizar e mapa
   são do componente; quem guarda o fluxo e o histórico continua sendo a tela. */

export const ICONES_DOS_BLOCOS: Record<TipoDeBloco, Icon> = {
  gatilho: Play,
  mensagem: ChatCircleDots,
  espera: HourglassMedium,
  condicao: GitBranch,
  acao: Lightning,
  randomizador: Shuffle,
};

/** O rótulo e o ícone de cada tipo, para o canvas; o gatilho é o início do fluxo. */
const TIPOS_DO_CANVAS = Object.fromEntries(
  (Object.keys(TIPOS) as TipoDeBloco[]).map((t) => [t, { rotulo: TIPOS[t].rotulo, icone: ICONES_DOS_BLOCOS[t], inicio: t === "gatilho" }]),
) as Record<TipoDeBloco, TipoDoCanvas>;

/** Os blocos que dá para adicionar: o gatilho já existe e é um só. O ícone vem do tipo. */
const PARA_ADICIONAR = (Object.keys(TIPOS) as TipoDeBloco[]).filter((t) => t !== "gatilho").map((t) => ({ valor: t, rotulo: TIPOS[t].rotulo }));

/** O corpo do bloco quando o resumo é mais que a lista de itens: a mensagem e a espera. */
function corpoDe(bloco: Bloco): React.ReactNode {
  if (bloco.tipo === "mensagem") {
    return (
      <div className="flex flex-col gap-1.5 px-3 pb-2.5">
        {bloco.canal ? (
          <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <IconeDeMarca marca={bloco.canal === "WhatsApp" ? "whatsapp" : "instagram"} tamanho={12} />
            {bloco.canal}
          </p>
        ) : null}
        <p className="line-clamp-3 rounded-md bg-background px-2 py-1.5 text-body-md text-foreground" title={bloco.texto}>
          {bloco.texto}
        </p>
      </div>
    );
  }
  if (bloco.tipo === "espera" && bloco.espera) {
    return (
      <p className="px-3 pb-2.5 text-body-md text-foreground">
        {bloco.espera.valor} {bloco.espera.unidade}
      </p>
    );
  }
  return undefined;
}

export type CanvasDaAutomacaoProps = Omit<CanvasProps<Bloco>, "tipos" | "opcoesParaAdicionar">;

export const CanvasDaAutomacao = React.forwardRef<CanvasRef, CanvasDaAutomacaoProps>(function CanvasDaAutomacao({ blocos, ...props }, ref) {
  // o corpo é montado aqui, bloco a bloco; memorizado, senão o canvas remediria os conectores a cada render
  const comCorpo = React.useMemo(() => blocos.map((b) => ({ ...b, corpo: corpoDe(b) })), [blocos]);
  return <Canvas ref={ref} blocos={comCorpo} tipos={TIPOS_DO_CANVAS} opcoesParaAdicionar={PARA_ADICIONAR} {...props} />;
});
