"use client";

import * as React from "react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tela as TelaDeHoje } from "../pipeline/tela";
import { Proposta } from "./proposta";

/* O interruptor fica no canto de baixo, à direita: é a área livre nas duas
   cascas (o topo tem as ações; o centro de baixo, a barra de seleção em massa). */
export function Comparacao() {
  const [modo, setModo] = React.useState("proposta");
  return (
    <>
      {modo === "hoje" ? <TelaDeHoje visaoInicial="lista" /> : <Proposta />}
      <div className="fixed bottom-12 right-4 z-popover flex items-center gap-2 rounded-lg border border-overlay-border bg-overlay-bg p-1 pl-3 shadow-lg">
        <span className="text-caption text-muted-foreground">Comparar</span>
        <SegmentedControl
          rotulo="Comparar a tela de hoje com a proposta"
          atual={modo}
          aoEscolher={setModo}
          itens={[
            { valor: "hoje", rotulo: "Hoje" },
            { valor: "proposta", rotulo: "Proposta" },
          ]}
          className="bg-muted"
        />
      </div>
    </>
  );
}
