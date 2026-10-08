"use client";

import * as React from "react";
import { Plus, Trash, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { IconeDoBloco } from "@/components/ui/canvas";
import { ComboboxPainel } from "@/components/ui/combobox";
import { CelulaEscolha } from "@/components/ui/data-table";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { Input } from "@/components/ui/input";
import { LinhaDeCampo, ListaDeCampos, PainelLateral, PainelLateralCorpo } from "@/components/ui/painel-lateral";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ICONES_DOS_BLOCOS } from "./canvas";
import { TIPOS, ramificacoes, type Bloco, type Canal, type Unidade } from "./dados";

const SEM_DESTINO = "nenhum";
const ROTULOS_DA_LISTA = { busca: "Buscar", vazio: "Nada encontrado" };

/**
 * O bloco aberto: `PainelLateral` do design system, no encaixe `lateral` da
 * TelaBase — o canvas continua à vista e clicar em outro bloco troca o painel.
 * Três partes: o que o bloco é (nome), o que ele faz (muda por tipo) e para
 * onde o fluxo vai depois (uma linha por saída, com o destino numa lista).
 */
export function PainelDoBloco({
  bloco,
  blocos,
  aoEditar,
  aoRemover,
  aoFechar,
}: {
  bloco: Bloco;
  /** Todos os blocos: são os destinos possíveis de cada saída. */
  blocos: Bloco[];
  aoEditar: (campos: Partial<Bloco>) => void;
  aoRemover: () => void;
  aoFechar: () => void;
}) {
  const tipo = TIPOS[bloco.tipo];
  const [adicionando, setAdicionando] = React.useState(false);
  const botaoAdicionar = React.useRef<HTMLButtonElement>(null);
  const destinos = [
    { valor: SEM_DESTINO, rotulo: "Sem destino" },
    // o gatilho não recebe ninguém; um bloco não aponta para si mesmo
    ...blocos.filter((b) => b.id !== bloco.id && b.tipo !== "gatilho").map((b) => ({ valor: b.id, rotulo: b.titulo, grupo: TIPOS[b.tipo].rotulo })),
  ];

  /** Trocar os itens: no randomizador, cada ramificação é uma saída. */
  function trocarItens(itens: string[]) {
    aoEditar(bloco.tipo === "randomizador" ? { itens, saidas: ramificacoes(itens, bloco.saidas) } : { itens });
  }

  return (
    <PainelLateral
      titulo={bloco.titulo}
      subtitulo={tipo.rotulo}
      inicio={<IconeDoBloco icone={ICONES_DOS_BLOCOS[bloco.tipo]} />}
      aoFechar={aoFechar}
      rotulos={{ fechar: "Fechar o bloco", expandir: "Abrir em tela cheia", recolher: "Voltar ao painel" }}
    >
      <PainelLateralCorpo>
        <p className="text-body-md text-muted-foreground">{tipo.descricao}</p>

        <Input rotulo="Nome do bloco" value={bloco.titulo} onChange={(e) => aoEditar({ titulo: e.target.value })} />

        {bloco.tipo === "mensagem" ? (
          <>
            <Select
              size="field"
              rotulo="Canal"
              valor={bloco.canal}
              aoEscolher={(v) => aoEditar({ canal: v as Canal })}
              opcoes={[
                { valor: "WhatsApp", rotulo: "WhatsApp", icone: <IconeDeMarca marca="whatsapp" /> },
                { valor: "Instagram", rotulo: "Instagram", icone: <IconeDeMarca marca="instagram" /> },
              ]}
            />
            <Textarea
              rotulo="Mensagem"
              linhas={4}
              value={bloco.texto ?? ""}
              onChange={(e) => aoEditar({ texto: e.target.value })}
              placeholder="O que o contato vai receber"
            />
          </>
        ) : null}

        {bloco.tipo === "espera" && bloco.espera ? (
          <div className="grid grid-cols-2 gap-3">
            <Input
              rotulo="Esperar"
              inputMode="numeric"
              value={String(bloco.espera.valor)}
              onChange={(e) => aoEditar({ espera: { ...bloco.espera!, valor: Number(e.target.value.replace(/\D/g, "")) || 0 } })}
            />
            <Select
              size="field"
              rotulo="Unidade"
              valor={bloco.espera.unidade}
              aoEscolher={(v) => aoEditar({ espera: { ...bloco.espera!, unidade: v as Unidade } })}
              opcoes={[
                { valor: "minutos", rotulo: "Minutos" },
                { valor: "horas", rotulo: "Horas" },
                { valor: "dias", rotulo: "Dias" },
              ]}
            />
          </div>
        ) : null}

        {tipo.catalogo ? (
          <section aria-labelledby="bloco-itens" className="flex flex-col gap-1.5">
            <h3 id="bloco-itens" className="text-label-md uppercase text-muted-foreground">
              {bloco.tipo === "gatilho" ? "Gatilhos" : bloco.tipo === "condicao" ? "Condições" : bloco.tipo === "acao" ? "Ações" : "Ramificações"}
            </h3>
            <ul className="flex flex-col gap-1">
              {bloco.itens.map((item) => (
                <li key={item} className="flex min-h-8 items-center gap-2 rounded-md bg-background pl-2 pr-1">
                  <span className="min-w-0 flex-1 truncate text-body-md text-foreground" title={item}>
                    {item}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remover ${item}`}
                    title={`Remover ${item}`}
                    onClick={() => trocarItens(bloco.itens.filter((i) => i !== item))}
                  >
                    <X size={14} weight="regular" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
            <div>
              <Button
                ref={botaoAdicionar}
                variant="ghost"
                size="sm"
                aria-haspopup="dialog"
                aria-expanded={adicionando}
                onClick={() => setAdicionando((a) => !a)}
              >
                <Plus size={14} weight="regular" aria-hidden="true" />
                {tipo.adicionar}
              </Button>
              <ComboboxPainel
                aberto={adicionando}
                aoFechar={(devolver = true) => {
                  setAdicionando(false);
                  if (devolver) botaoAdicionar.current?.focus();
                }}
                gatilho={botaoAdicionar}
                rotulo={tipo.adicionar ?? ""}
                // só o que ainda não entrou
                opcoes={tipo.catalogo.filter((c) => !bloco.itens.includes(c)).map((c) => ({ valor: c, rotulo: c }))}
                selecionados={[]}
                aoAlternar={(item) => trocarItens([...bloco.itens, item])}
                rotulos={ROTULOS_DA_LISTA}
              />
            </div>
            {bloco.itens.includes("Deletar lead") ? (
              <p role="note" className="rounded-md bg-background px-2 py-1.5 text-body-md text-foreground">
                <span className="font-semibold text-destructive">Atenção.</span> Deletar o lead apaga também o histórico e os negócios dele.
              </p>
            ) : null}
          </section>
        ) : null}

        <section aria-labelledby="bloco-saidas" className="flex flex-col gap-1">
          <h3 id="bloco-saidas" className="text-label-md uppercase text-muted-foreground">
            Depois deste bloco
          </h3>
          <ListaDeCampos>
            {bloco.saidas.map((s) => (
              <LinhaDeCampo key={s.id} rotulo={s.rotulo}>
                <CelulaEscolha
                  rotulo={`Destino de "${s.rotulo}"`}
                  opcoes={destinos}
                  selecionados={[s.para ?? SEM_DESTINO]}
                  aoAlternar={(v) =>
                    aoEditar({ saidas: bloco.saidas.map((x) => (x.id === s.id ? { ...x, para: v === SEM_DESTINO ? undefined : v } : x)) })
                  }
                  rotulos={ROTULOS_DA_LISTA}
                >
                  <span className={s.para ? "truncate" : "truncate text-subtle-foreground"}>
                    {blocos.find((b) => b.id === s.para)?.titulo ?? "Sem destino"}
                  </span>
                </CelulaEscolha>
              </LinhaDeCampo>
            ))}
          </ListaDeCampos>
        </section>

        {/* o gatilho é o começo do fluxo: não se remove */}
        {bloco.tipo === "gatilho" ? null : (
          <div>
            <Button variant="destructive" size="sm" onClick={aoRemover}>
              <Trash size={14} weight="regular" aria-hidden="true" />
              Remover bloco
            </Button>
          </div>
        )}
      </PainelLateralCorpo>
    </PainelLateral>
  );
}
