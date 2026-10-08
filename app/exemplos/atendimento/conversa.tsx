"use client";

import * as React from "react";
import { ArrowCounterClockwise, ArrowsLeftRight, Check, Lightning, Paperclip, SidebarSimple, UserPlus } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { ComboboxPainel } from "@/components/ui/combobox";
import { Balao, Compositor, Conversa, ConversaCabecalho, DivisorDeDia, EventoDaConversa, Mensagens, type ModoDoCompositor } from "@/components/ui/conversa";
import { Menu } from "@/components/ui/menu";
import { Tag } from "@/components/ui/tag";
import { Tooltip } from "@/components/ui/tooltip";
import { EU, RESPOSTAS_RAPIDAS, type Conversa as DadosDaConversa } from "./dados";
import { IconeDoCanal } from "./lista";
import { OPCOES_DE_ATENDENTE } from "./painel";

/* A coluna do meio, montada com as peças da `Conversa` do design system. O que
   é da tela fica aqui: as ações do cabeçalho (assumir, transferir, finalizar,
   mostrar o lead), as respostas rápidas e o anexar do compositor, e a
   tradução de cada `Mensagem` dos dados para o balão, o evento ou o divisor. */

export function ConversaAberta({
  conversa,
  aoEnviar,
  aoFinalizar,
  aoReabrir,
  aoAssumir,
  aoTransferir,
  painelAberto,
  aoAlternarPainel,
  aoVoltar,
  className,
}: {
  conversa: DadosDaConversa;
  aoEnviar: (texto: string, modo: ModoDoCompositor) => void;
  aoFinalizar: () => void;
  aoReabrir: () => void;
  aoAssumir: () => void;
  aoTransferir: (atendente: string) => void;
  painelAberto: boolean;
  aoAlternarPainel: () => void;
  /** Só no celular: volta para a lista. */
  aoVoltar: () => void;
  className?: string;
}) {
  const [modo, setModo] = React.useState<ModoDoCompositor>("mensagem");
  const [texto, setTexto] = React.useState("");
  const [menuTransferir, setMenuTransferir] = React.useState(false);
  const [menuRespostas, setMenuRespostas] = React.useState(false);
  const botaoTransferir = React.useRef<HTMLButtonElement>(null);
  const botaoRespostas = React.useRef<HTMLButtonElement>(null);
  const finalizada = conversa.situacao === "finalizada";

  // trocar de conversa não leva o rascunho junto
  React.useEffect(() => {
    setTexto("");
    setModo("mensagem");
  }, [conversa.id]);

  return (
    <Conversa
      rotulo={`Conversa com ${conversa.nome}`}
      className={className}
      cabecalho={
        <ConversaCabecalho
          avatar={{ nome: conversa.nome }}
          titulo={conversa.nome}
          subtitulo={
            <>
              <IconeDoCanal canal={conversa.canal} tamanho={12} />
              <span className="truncate">
                {conversa.canal} · {conversa.telefone}
              </span>
            </>
          }
          aoVoltar={aoVoltar}
          acoes={
            <>
              {conversa.atendente ? (
                <Tag foto="/ds/atendente.png" className="hidden sm:inline-flex">
                  {conversa.atendente}
                </Tag>
              ) : (
                <Button variant="soft" size="sm" onClick={aoAssumir}>
                  <UserPlus size={16} weight="regular" />
                  Assumir
                </Button>
              )}
              <Button
                ref={botaoTransferir}
                variant="tertiary"
                size="sm"
                aria-haspopup="dialog"
                aria-expanded={menuTransferir}
                onClick={() => setMenuTransferir((a) => !a)}
                className="hidden sm:inline-flex"
              >
                <ArrowsLeftRight size={16} weight="regular" />
                Transferir
              </Button>
              {/* quem recebe a conversa: lista de atendentes, cada um como a Tag que aparece no topo — não é menu de ações */}
              <ComboboxPainel
                aberto={menuTransferir}
                gatilho={botaoTransferir}
                rotulo="Transferir para"
                opcoes={OPCOES_DE_ATENDENTE.filter((a) => a.valor !== conversa.atendente)}
                selecionados={[]}
                aoAlternar={(a) => aoTransferir(a)}
                rotulos={{ busca: "Buscar atendente", vazio: "Ninguém encontrado" }}
                aoFechar={(devolver = true) => {
                  setMenuTransferir(false);
                  if (devolver) botaoTransferir.current?.focus();
                }}
              />
              {finalizada ? (
                <Button variant="secondary" size="sm" onClick={aoReabrir}>
                  <ArrowCounterClockwise size={16} weight="regular" />
                  Reabrir
                </Button>
              ) : (
                <Button size="sm" onClick={aoFinalizar}>
                  <Check size={16} weight="regular" />
                  Finalizar
                </Button>
              )}
              <Tooltip content={painelAberto ? "Esconder o lead" : "Mostrar o lead"}>
                <Button variant="ghost" size="icon-sm" aria-label={painelAberto ? "Esconder o lead" : "Mostrar o lead"} aria-pressed={painelAberto} onClick={aoAlternarPainel}>
                  <SidebarSimple size={16} weight="regular" className="-scale-x-100" />
                </Button>
              </Tooltip>
            </>
          }
        />
      }
      rodape={
        <Compositor
          valor={texto}
          aoMudar={setTexto}
          modo={modo}
          aoMudarModo={setModo}
          aoEnviar={(t) => aoEnviar(t, modo)}
          rotulos={{ escreverMensagem: `Responder como ${EU}` }}
          finalizado={finalizada ? "Atendimento finalizado. Reabra para responder." : undefined}
          acoes={
            <>
              <Tooltip content="Respostas rápidas">
                <Button
                  ref={botaoRespostas}
                  variant="tertiary"
                  size="icon-lg"
                  aria-label="Respostas rápidas"
                  aria-haspopup="menu"
                  aria-expanded={menuRespostas}
                  onClick={() => setMenuRespostas((a) => !a)}
                >
                  <Lightning size={16} weight="regular" />
                </Button>
              </Tooltip>
              <Menu
                aberto={menuRespostas}
                gatilho={botaoRespostas}
                rotulo="Respostas rápidas"
                itens={RESPOSTAS_RAPIDAS.map((r) => ({ id: r.id, rotulo: r.rotulo, aoAtivar: () => setTexto(r.texto) }))}
                aoFechar={(devolver = true) => {
                  setMenuRespostas(false);
                  if (devolver) botaoRespostas.current?.focus();
                }}
              />
              <Tooltip content="Anexar arquivo">
                <Button variant="tertiary" size="icon-lg" aria-label="Anexar arquivo">
                  <Paperclip size={16} weight="regular" />
                </Button>
              </Tooltip>
            </>
          }
        />
      }
    >
      {/* conversa nova ou mensagem nova: a chave muda e o log rola até o fim */}
      <Mensagens chave={`${conversa.id}:${conversa.mensagens.length}`}>
        {conversa.mensagens.map((m, i) => {
          const novoDia = i === 0 || conversa.mensagens[i - 1].dia !== m.dia;
          return (
            <React.Fragment key={m.id}>
              {novoDia ? <DivisorDeDia>{m.dia}</DivisorDeDia> : null}
              {m.de === "sistema" ? (
                <EventoDaConversa hora={m.hora}>{m.texto}</EventoDaConversa>
              ) : (
                <Balao de={m.de} hora={m.hora} autor={m.autor} situacao={m.de === "atendente" ? (m.lida ? "lida" : "enviada") : undefined}>
                  {m.texto}
                </Balao>
              )}
            </React.Fragment>
          );
        })}
      </Mensagens>
    </Conversa>
  );
}
