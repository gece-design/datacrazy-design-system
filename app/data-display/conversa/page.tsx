"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowsLeftRight, Check, Lightning, Paperclip } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Balao, Compositor, Conversa, ConversaCabecalho, DivisorDeDia, EventoDaConversa, Mensagens, type ModoDoCompositor } from "@/components/ui/conversa";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { Tag } from "@/components/ui/tag";
import { Tooltip } from "@/components/ui/tooltip";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { foco } from "@/lib/estados";
import { cn } from "@/lib/utils";

/* Uma conversa de exemplo. No CRM, as mensagens vêm da API, paginadas; os
   textos, do next-intl. Quem escreve na demonstração é "Ana". */
type Fala = { id: string; de: "contato" | "atendente" | "nota" | "sistema"; texto: string; dia: string; hora: string; autor?: string; lida?: boolean };

const CONTATO = { nome: "Helena Moraes", canal: "WhatsApp", telefone: "+55 (11) 98844-2019" };

const FALAS: Fala[] = [
  { id: "1", de: "contato", texto: "Oi! Vi o anúncio de vocês. O plano atende clínica com três unidades?", dia: "Ontem", hora: "16:42" },
  { id: "2", de: "sistema", texto: "Ana assumiu o atendimento", dia: "Ontem", hora: "16:43" },
  { id: "3", de: "atendente", texto: "Oi, Helena! Atende sim. Cada unidade vira uma pipeline, com atendentes separados.", dia: "Ontem", hora: "16:45", autor: "Ana", lida: true },
  { id: "4", de: "nota", texto: "Veio da campanha de setembro. Já usa planilha e WhatsApp pessoal; a dor é perder lead entre as unidades.", dia: "Ontem", hora: "16:50", autor: "Ana" },
  { id: "5", de: "contato", texto: "Recebi a proposta, obrigada. O valor é por unidade ou pela conta?", dia: "Hoje", hora: "09:12" },
  { id: "6", de: "atendente", texto: "Pela conta: as três unidades entram no mesmo plano.", dia: "Hoje", hora: "09:20", autor: "Ana", lida: false },
];

const agora = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

/** Cada fala vira a peça certa: evento do sistema, ou balão de quem escreveu. */
function Falas({ falas }: { falas: Fala[] }) {
  return (
    <>
      {falas.map((f, i) => {
        const novoDia = i === 0 || falas[i - 1].dia !== f.dia;
        return (
          <React.Fragment key={f.id}>
            {novoDia ? <DivisorDeDia>{f.dia}</DivisorDeDia> : null}
            {f.de === "sistema" ? (
              <EventoDaConversa hora={f.hora}>{f.texto}</EventoDaConversa>
            ) : (
              <Balao de={f.de} hora={f.hora} autor={f.autor} situacao={f.de === "atendente" ? (f.lida ? "lida" : "enviada") : undefined}>
                {f.texto}
              </Balao>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

const codigoConversa = `const [texto, setTexto] = useState("");
const [modo, setModo] = useState<ModoDoCompositor>("mensagem");

<Conversa
  rotulo={\`Conversa com \${conversa.nome}\`}
  cabecalho={
    <ConversaCabecalho
      avatar={{ nome: conversa.nome }}
      titulo={conversa.nome}
      subtitulo={
        <>
          <IconeDeMarca marca="whatsapp" tamanho={12} />
          <span className="truncate">{conversa.canal} · {conversa.telefone}</span>
        </>
      }
      aoVoltar={() => setNaConversa(false)}
      acoes={
        <>
          <Tag foto={conversa.atendente.foto}>{conversa.atendente.nome}</Tag>
          <Button size="sm" onClick={finalizar}>
            <Check size={16} weight="regular" />
            Finalizar
          </Button>
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
      aoEnviar={(t) => enviar(t, modo)}
      finalizado={conversa.situacao === "finalizada" ? "Atendimento finalizado. Reabra para responder." : undefined}
      acoes={
        <Button variant="tertiary" size="icon-lg" aria-label="Anexar arquivo">
          <Paperclip size={16} weight="regular" />
        </Button>
      }
    />
  }
>
  <Mensagens chave={\`\${conversa.id}:\${conversa.mensagens.length}\`}>
    {conversa.mensagens.map((m) =>
      m.de === "sistema" ? (
        <EventoDaConversa key={m.id} hora={m.hora}>{m.texto}</EventoDaConversa>
      ) : (
        <Balao key={m.id} de={m.de} hora={m.hora} autor={m.autor} situacao={m.lida ? "lida" : "enviada"}>
          {m.texto}
        </Balao>
      ),
    )}
  </Mensagens>
</Conversa>`;

const codigoBaloes = `<Mensagens chave={conversa.id}>
  <DivisorDeDia>Ontem</DivisorDeDia>
  <Balao de="contato" hora="16:42">Oi! O plano atende clínica com três unidades?</Balao>
  <EventoDaConversa hora="16:43">Ana assumiu o atendimento</EventoDaConversa>
  <Balao de="atendente" hora="16:45" autor="Ana" situacao="lida">Atende sim. Cada unidade vira uma pipeline.</Balao>
  <Balao de="nota" hora="16:50" autor="Ana">Veio da campanha de setembro. Já usa planilha.</Balao>
  <DivisorDeDia>Hoje</DivisorDeDia>
  <Balao de="atendente" hora="09:20" autor="Ana" situacao="enviada">Pela conta: as três unidades entram no mesmo plano.</Balao>
</Mensagens>`;

const codigoCompositor = `<Compositor
  valor={texto}
  aoMudar={setTexto}
  modo={modo}
  aoMudarModo={setModo}
  aoEnviar={enviar}
  rotulos={{ escreverMensagem: "Responder como Ana" }}
  acoes={
    <Button variant="tertiary" size="icon-lg" aria-label="Respostas rápidas">
      <Lightning size={16} weight="regular" />
    </Button>
  }
/>

{/* a conversa finalizada: a frase no lugar do campo */}
<Compositor valor="" aoMudar={setTexto} modo="mensagem" aoMudarModo={setModo} aoEnviar={enviar} finalizado="Atendimento finalizado. Reabra para responder." />`;

const codigoNaTela = `// A tela guarda o rascunho e o modo, e zera os dois ao trocar de conversa.
const [modo, setModo] = useState<ModoDoCompositor>("mensagem");
const [texto, setTexto] = useState("");
useEffect(() => {
  setTexto("");
  setModo("mensagem");
}, [conversa.id]);

<Conversa rotulo={\`Conversa com \${conversa.nome}\`} cabecalho={cabecalho} rodape={compositor}>
  <Mensagens chave={\`\${conversa.id}:\${conversa.mensagens.length}\`}>{baloes}</Mensagens>
</Conversa>`;

/** A conversa inteira, viva: escreva e envie; troque para nota; finalize e reabra. */
function ExemploConversa() {
  const [falas, setFalas] = React.useState(FALAS);
  const [texto, setTexto] = React.useState("");
  const [modo, setModo] = React.useState<ModoDoCompositor>("mensagem");
  const [finalizada, setFinalizada] = React.useState(false);

  function enviar(t: string) {
    setFalas((f) => [...f, { id: `${f.length + 1}-${Date.now()}`, de: modo === "nota" ? "nota" : "atendente", texto: t, dia: "Hoje", hora: agora(), autor: "Ana", lida: false }]);
  }
  function alternar() {
    setFinalizada((v) => !v);
    setFalas((f) => [...f, { id: `${f.length + 1}-${Date.now()}`, de: "sistema", texto: finalizada ? "Ana reabriu o atendimento" : "Ana finalizou o atendimento", dia: "Hoje", hora: agora() }]);
  }

  return (
    <div className="flex h-[480px] w-full">
      <Conversa
        rotulo={`Conversa com ${CONTATO.nome}`}
        cabecalho={
          <ConversaCabecalho
            avatar={{ nome: CONTATO.nome }}
            titulo={CONTATO.nome}
            subtitulo={
              <>
                <IconeDeMarca marca="whatsapp" tamanho={12} />
                <span className="truncate">
                  {CONTATO.canal} · {CONTATO.telefone}
                </span>
              </>
            }
            aoVoltar={() => undefined}
            acoes={
              <>
                <Tag foto="/ds/atendente.png" className="hidden sm:inline-flex">
                  Ana
                </Tag>
                <Button variant="tertiary" size="sm" className="hidden sm:inline-flex">
                  <ArrowsLeftRight size={16} weight="regular" />
                  Transferir
                </Button>
                <Button variant={finalizada ? "secondary" : "primary"} size="sm" onClick={alternar}>
                  <Check size={16} weight="regular" />
                  {finalizada ? "Reabrir" : "Finalizar"}
                </Button>
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
            aoEnviar={enviar}
            rotulos={{ escreverMensagem: "Responder como Ana" }}
            finalizado={finalizada ? "Atendimento finalizado. Reabra para responder." : undefined}
            acoes={
              <Tooltip content="Anexar arquivo">
                <Button variant="tertiary" size="icon-lg" aria-label="Anexar arquivo">
                  <Paperclip size={16} weight="regular" />
                </Button>
              </Tooltip>
            }
          />
        }
      >
        <Mensagens chave={falas.length}>
          <Falas falas={falas} />
        </Mensagens>
      </Conversa>
    </div>
  );
}

/** Os dois compositores: um vivo, com as respostas rápidas, e um finalizado. */
function ExemploCompositor() {
  const [texto, setTexto] = React.useState("");
  const [modo, setModo] = React.useState<ModoDoCompositor>("mensagem");
  const [enviado, setEnviado] = React.useState<string | null>(null);
  return (
    <div className="flex w-full max-w-[560px] flex-col gap-4">
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <Compositor
          valor={texto}
          aoMudar={setTexto}
          modo={modo}
          aoMudarModo={setModo}
          aoEnviar={(t) => setEnviado(`${modo === "nota" ? "Nota" : "Mensagem"}: ${t}`)}
          rotulos={{ escreverMensagem: "Responder como Ana" }}
          acoes={
            <Tooltip content="Respostas rápidas">
              <Button variant="tertiary" size="icon-lg" aria-label="Respostas rápidas" onClick={() => setTexto("Olá! Aqui é a Ana. Como posso ajudar?")}>
                <Lightning size={16} weight="regular" />
              </Button>
            </Tooltip>
          }
          className="border-t-0"
        />
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <Compositor valor="" aoMudar={setTexto} modo="mensagem" aoMudarModo={setModo} aoEnviar={() => undefined} finalizado="Atendimento finalizado. Reabra para responder." className="border-t-0" />
      </div>
      {/* o que o compositor devolve — na tela, vira a mensagem nova no log */}
      <p aria-live="polite" className="text-body-md text-muted-foreground">
        {enviado ?? "Escreva e dê Enter (ou clique no raio) para ver o que o compositor devolve."}
      </p>
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Conversa"
      novidade="2026-10-07"
      descricao="O chat do atendimento em sete peças: a casca, o cabeçalho de 48px com o contato e as ações, o log que rola e volta para a última mensagem, o balão de até 72% da largura em três vozes (contato, atendente, nota interna), o evento do sistema, o divisor de dia e o compositor com dois modos e um campo que cresce até 6 linhas."
      secoes={["Como funciona", "A conversa inteira", "Balões e eventos", "Compositor", "Na tela"]}
    >
      <ComoFunciona>
        <p>
          Nasceu da tela de Atendimento e virou componente a pedido do cliente (reunião de 02/10): as classes da tela
          são a verdade, pixel a pixel. Nada aqui conhece o domínio — a tela traduz cada mensagem da API para um{" "}
          <Chip>Balao</Chip> (quem escreveu, a hora, o autor, se foi lida), um <Chip>EventoDaConversa</Chip> ou um{" "}
          <Chip>DivisorDeDia</Chip>, e decide o que os botões do cabeçalho e do compositor fazem. Todo texto vem de{" "}
          <Chip>rotulos</Chip>; <Chip>ROTULOS_DA_CONVERSA</Chip> é a fábrica em português.
        </p>
        <p>
          O <Chip>Mensagens</Chip> é um <Chip>role=&quot;log&quot;</Chip>: o leitor de tela anuncia o que chega sem tirar
          o foco do campo. Ele rola a si mesmo até o fim quando a <Chip>chave</Chip> muda — passe o id da conversa e
          quantas mensagens ela tem. Só o log rola, nunca a página: numa tela com dois chats, um{" "}
          <Chip>scrollIntoView</Chip> faria a página pular.
        </p>
        <p>
          A armadilha é o rascunho. O <Chip>Compositor</Chip> é controlado (<Chip>valor</Chip>, <Chip>modo</Chip>): quem
          guarda é a tela, e é a tela que zera os dois ao trocar de conversa — senão o texto de um contato vai parar na
          conversa do outro. Enviar entrega o texto sem os espaços das pontas e esvazia o campo; Enter envia, Shift +
          Enter quebra a linha.
        </p>
      </ComoFunciona>

      <Secao
        titulo="A conversa inteira"
        spec="cabeçalho 48 · balão 72% · campo 1–6 linhas"
        descricao="Escreva e dê Enter; troque para Nota interna e veja o balão mudar de cor; finalize e o compositor dá lugar à frase. A coluna tem 480px de altura aqui — na tela, ocupa o que sobra."
        codigo={codigoConversa}
        nota={
          <>
            O cabeçalho recebe o contato em <Chip>avatar</Chip> e <Chip>titulo</Chip>, a linha de apoio em{" "}
            <Chip>subtitulo</Chip> e os botões em <Chip>acoes</Chip> — Tag do atendente, transferir, finalizar são da
            tela. <Chip>aoVoltar</Chip> só aparece abaixo de 768px, quando a tela mostra a lista OU a conversa.
          </>
        }
      >
        <ExemploConversa />
      </Secao>

      <Secao
        titulo="Balões e eventos"
        spec="contato · atendente · nota · evento"
        descricao="Três vozes e duas linhas de sistema. O contato fica à esquerda em muted; o atendente à direita em button-soft, com um tique (enviada) ou dois em azul (lida); a nota interna à direita, em warning com selo — o contato não vê. O evento e o divisor de dia são linhas, não balões."
        codigo={codigoBaloes}
        nota={
          <>
            O balão não tem hover: não é clicável. Entra subindo 4px (<Chip>animate-surgir</Chip>), nova ou ao abrir
            a conversa. <Chip>autor</Chip> só aparece nas vozes do time; <Chip>situacao</Chip> só no atendente.
          </>
        }
      >
        <div className="flex h-[400px] w-full max-w-[560px] flex-col overflow-hidden rounded-md border border-border bg-card">
          <Mensagens chave="estatico">
            <Falas falas={FALAS} />
          </Mensagens>
        </div>
      </Secao>

      <Secao
        titulo="Compositor"
        spec="2 modos · Enter envia"
        descricao="O grupo troca entre Mensagem e Nota interna, e com ele o rótulo, o placeholder e o nome do botão. O campo nasce com 1 linha e cresce até 6; o enviar só acende com texto. Finalizado, o compositor some e a frase fica no lugar."
        codigo={codigoCompositor}
        nota={
          <>
            <Chip>acoes</Chip> entra entre o campo e o enviar: respostas rápidas (um <Chip>Menu</Chip> na tela) e
            anexar. <Chip>desabilitado</Chip> trava tudo sem esconder; <Chip>finalizado</Chip> esconde e explica.
          </>
        }
      >
        <ExemploCompositor />
      </Secao>

      <Secao
        titulo="Na tela"
        spec="/prototipo?tela=atendimento"
        descricao="A coluna do meio do Atendimento é exatamente esta composição: a tela guarda o rascunho e o modo, zera os dois ao trocar de conversa, e passa as ações do cabeçalho (assumir, transferir, finalizar, mostrar o lead) e do compositor (respostas rápidas, anexar)."
        codigo={codigoNaTela}
        semSeletorDeFundo
      >
        <Legenda>
          Veja no{" "}
          <Link href="/prototipo?tela=atendimento" className={cn("rounded-sm text-foreground underline-offset-2 hover:underline", foco)}>
            protótipo, tela de Atendimento
          </Link>
          : a lista ao lado é a <Chip>ListaDeConversas</Chip>, e o lead abre na terceira coluna.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
