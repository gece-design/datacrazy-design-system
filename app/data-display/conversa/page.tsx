"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowCounterClockwise, ArrowsLeftRight, Check, Lightning, Paperclip, SidebarSimple, UserPlus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Balao, Compositor, Conversa, ConversaCabecalho, DivisorDeDia, EventoDaConversa, Mensagens, ROTULOS_DA_CONVERSA, type ModoDoCompositor } from "@/components/ui/conversa";
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

/** Um item de lista com a chave à esquerda, como nas páginas do Button e do Input. */
function Item({ mono, children }: { mono: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <code className="w-44 shrink-0 font-mono chrome-meta text-foreground">{mono}</code>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  { nome: "Conversa", medida: "section · bg-card · rounded-md · border", papel: "A casca: bloco branco com traço, cabeçalho em cima, mensagens no meio e o compositor embaixo. No celular ocupa a tela, sem traço nem raio. É nomeada pelo contato (rotulo)." },
  { nome: "ConversaCabecalho", medida: "h-12 · gap-2 · px-3 · border-b", papel: "48px, como o Header da tela — os dois se alinham pelo traço de baixo. Avatar de 32, nome em label-lg, linha de apoio em caption, e as ações à direita. O voltar só existe abaixo de 768px." },
  { nome: "Mensagens", medida: "role=log · gap-2 · px-4 · pt-3 · pb-5", papel: "O log que rola, com a barra discreta do DS. Rola a si mesmo até o fim quando a chave muda; nunca a página. 20px embaixo para a última mensagem respirar antes do compositor." },
  { nome: "Balao", medida: "max-w 72% · rounded-lg · px-3 · py-2 · body-lg", papel: "Contato à esquerda em muted; atendente à direita em button-soft; nota interna à direita, em warning/10 com traço warning/25 e selo. Hora em caption embaixo, com autor nas vozes do time e o tique no atendente." },
  { nome: "EventoDaConversa", medida: "caption · centro · py-1", papel: "O que o sistema registrou (assumiu, transferiu, finalizou): uma linha ao centro, não um balão." },
  { nome: "DivisorDeDia", medida: "caption · traço dos dois lados", papel: "O dia entre dois traços de 1px, quando as mensagens trocam de dia. A tela decide o texto: Hoje, Ontem, a data." },
  { nome: "Compositor", medida: "border-t · p-3 · gap-2 · campo 1–6 linhas", papel: "O grupo mensagem/nota com a dica ao lado, o Textarea que cresce até 6 linhas, as ações entre o campo e o enviar (icon-lg). Finalizado, dá lugar a uma frase." },
];

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

const codigoCabecalho = `{/* sem atendente: o botão de assumir no lugar da Tag */}
<ConversaCabecalho
  avatar={{ nome: "Rafael Pinto" }}
  titulo="Rafael Pinto"
  subtitulo={<><IconeDeMarca marca="whatsapp" tamanho={12} /><span className="truncate">WhatsApp · +55 (54) 44346-5346</span></>}
  acoes={
    <>
      <Button variant="soft" size="sm" onClick={assumir}><UserPlus size={16} weight="regular" />Assumir</Button>
      <Button size="sm" onClick={finalizar}><Check size={16} weight="regular" />Finalizar</Button>
    </>
  }
/>

{/* finalizada: reabrir no lugar de finalizar */}
<ConversaCabecalho
  avatar={{ nome: "Camila Ferraz", src: "/ds/atendente.png" }}
  titulo="Camila Ferraz"
  subtitulo={<><IconeDeMarca marca="instagram" tamanho={12} /><span className="truncate">Instagram · @camila.ferraz</span></>}
  acoes={<Button variant="secondary" size="sm" onClick={reabrir}><ArrowCounterClockwise size={16} weight="regular" />Reabrir</Button>}
/>`;

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
/>`;

const codigoModos = `{/* em nota: o campo, o placeholder e o botão mudam com o modo */}
<Compositor valor={texto} aoMudar={setTexto} modo="nota" aoMudarModo={setModo} aoEnviar={salvarNota} />

{/* desabilitado: trava o grupo, o campo e o botão sem esconder — enquanto a API responde */}
<Compositor valor={texto} aoMudar={setTexto} modo={modo} aoMudarModo={setModo} aoEnviar={enviar} desabilitado />

{/* finalizado: some e a frase fica no lugar */}
<Compositor valor="" aoMudar={setTexto} modo="mensagem" aoMudarModo={setModo} aoEnviar={enviar} finalizado="Atendimento finalizado. Reabra para responder." />`;

const codigoRotulos = `const rotulos = {
  voltar: "Volver a las conversaciones",
  mensagens: "Mensajes",
  notaInterna: "Nota interna",
  enviada: "Enviada",
  lida: "Leída",
  modo: "Qué vas a escribir",
  mensagem: "Mensaje",
  nota: "Nota interna",
  escreverMensagem: "Escribe un mensaje",
  escreverNota: "Solo el equipo ve esta nota",
  enviar: "Enviar mensaje",
  salvarNota: "Guardar nota",
  dica: "Enter envía · Shift + Enter salta de línea",
};

<Conversa rotulo="Conversación con Helena Moraes" cabecalho={<ConversaCabecalho avatar={{ nome: "Helena Moraes" }} titulo="Helena Moraes" rotulos={rotulos} />} rodape={<Compositor valor={texto} aoMudar={setTexto} modo={modo} aoMudarModo={setModo} aoEnviar={enviar} rotulos={rotulos} />}>
  <Mensagens chave={conversa.id} rotulos={rotulos}>
    <Balao de="atendente" hora="09:20" autor="Ana" situacao="lida" rotulos={rotulos}>Por la cuenta: las tres unidades entran en el mismo plan.</Balao>
  </Mensagens>
</Conversa>`;

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
  const [painel, setPainel] = React.useState(true);

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
                  {finalizada ? <ArrowCounterClockwise size={16} weight="regular" /> : <Check size={16} weight="regular" />}
                  {finalizada ? "Reabrir" : "Finalizar"}
                </Button>
                <Tooltip content={painel ? "Esconder o lead" : "Mostrar o lead"}>
                  <Button variant="ghost" size="icon-sm" aria-label={painel ? "Esconder o lead" : "Mostrar o lead"} aria-pressed={painel} onClick={() => setPainel((v) => !v)}>
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

/** Os três cabeçalhos: sem atendente, com atendente e finalizada. */
function ExemploCabecalhos() {
  return (
    <div className="flex w-full flex-col gap-3">
      {[
        {
          nome: "Rafael Pinto",
          sub: (
            <>
              <IconeDeMarca marca="whatsapp" tamanho={12} />
              <span className="truncate">WhatsApp · +55 (54) 44346-5346</span>
            </>
          ),
          acoes: (
            <>
              <Button variant="soft" size="sm">
                <UserPlus size={16} weight="regular" />
                Assumir
              </Button>
              <Button size="sm">
                <Check size={16} weight="regular" />
                Finalizar
              </Button>
            </>
          ),
        },
        {
          nome: "Helena Moraes",
          sub: (
            <>
              <IconeDeMarca marca="whatsapp" tamanho={12} />
              <span className="truncate">WhatsApp · +55 (11) 98844-2019</span>
            </>
          ),
          acoes: (
            <>
              <Tag foto="/ds/atendente.png">Ana</Tag>
              <Button variant="tertiary" size="sm">
                <ArrowsLeftRight size={16} weight="regular" />
                Transferir
              </Button>
              <Button size="sm">
                <Check size={16} weight="regular" />
                Finalizar
              </Button>
            </>
          ),
        },
        {
          nome: "Camila Ferraz",
          src: "/ds/atendente.png",
          sub: (
            <>
              <IconeDeMarca marca="instagram" tamanho={12} />
              <span className="truncate">Instagram · @camila.ferraz</span>
            </>
          ),
          acoes: (
            <Button variant="secondary" size="sm">
              <ArrowCounterClockwise size={16} weight="regular" />
              Reabrir
            </Button>
          ),
        },
      ].map((c) => (
        <div key={c.nome} className="overflow-hidden rounded-md border border-border bg-card">
          <ConversaCabecalho avatar={{ nome: c.nome, src: c.src }} titulo={c.nome} subtitulo={c.sub} acoes={c.acoes} className="border-b-0" />
        </div>
      ))}
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
      {/* o que o compositor devolve — na tela, vira a mensagem nova no log */}
      <p aria-live="polite" className="text-body-md text-muted-foreground">
        {enviado ?? "Escreva e dê Enter (ou clique no raio) para ver o que o compositor devolve."}
      </p>
    </div>
  );
}

/** Nota, desabilitado e finalizado, lado a lado. */
function ExemploModos() {
  const [nota, setNota] = React.useState("Lembrar de mandar a tabela de preços.");
  const [modo, setModo] = React.useState<ModoDoCompositor>("nota");
  const [texto, setTexto] = React.useState("Enviando…");
  return (
    <div className="flex w-full max-w-[560px] flex-col gap-4">
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <Compositor valor={nota} aoMudar={setNota} modo={modo} aoMudarModo={setModo} aoEnviar={() => setNota("")} className="border-t-0" />
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <Compositor valor={texto} aoMudar={setTexto} modo="mensagem" aoMudarModo={() => undefined} aoEnviar={() => undefined} desabilitado className="border-t-0" />
      </div>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <Compositor valor="" aoMudar={() => undefined} modo="mensagem" aoMudarModo={() => undefined} aoEnviar={() => undefined} finalizado="Atendimento finalizado. Reabra para responder." className="border-t-0" />
      </div>
    </div>
  );
}

/** Em espanhol: só `rotulos` muda. */
function ExemploEmEspanhol() {
  const [texto, setTexto] = React.useState("");
  const [modo, setModo] = React.useState<ModoDoCompositor>("mensagem");
  const rotulos = {
    voltar: "Volver a las conversaciones",
    mensagens: "Mensajes",
    notaInterna: "Nota interna",
    enviada: "Enviada",
    lida: "Leída",
    modo: "Qué vas a escribir",
    mensagem: "Mensaje",
    nota: "Nota interna",
    escreverMensagem: "Escribe un mensaje",
    escreverNota: "Solo el equipo ve esta nota",
    enviar: "Enviar mensaje",
    salvarNota: "Guardar nota",
    dica: "Enter envía · Shift + Enter salta de línea",
  };
  return (
    <div className="flex h-[360px] w-full max-w-[560px]">
      <Conversa
        rotulo="Conversación con Helena Moraes"
        cabecalho={
          <ConversaCabecalho
            avatar={{ nome: "Helena Moraes" }}
            titulo="Helena Moraes"
            subtitulo={
              <>
                <IconeDeMarca marca="whatsapp" tamanho={12} />
                <span className="truncate">WhatsApp · +55 (11) 98844-2019</span>
              </>
            }
            rotulos={rotulos}
          />
        }
        rodape={<Compositor valor={texto} aoMudar={setTexto} modo={modo} aoMudarModo={setModo} aoEnviar={() => setTexto("")} rotulos={rotulos} />}
      >
        <Mensagens chave="es" rotulos={rotulos}>
          <DivisorDeDia>Hoy</DivisorDeDia>
          <Balao de="contato" hora="09:12" rotulos={rotulos}>
            Recibí la propuesta, gracias. ¿El valor es por unidad o por cuenta?
          </Balao>
          <Balao de="atendente" hora="09:20" autor="Ana" situacao="lida" rotulos={rotulos}>
            Por la cuenta: las tres unidades entran en el mismo plan.
          </Balao>
          <Balao de="nota" hora="09:21" autor="Ana" rotulos={rotulos}>
            Enviar la tabla de precios por correo.
          </Balao>
        </Mensagens>
      </Conversa>
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Conversa"
      novidade="2026-10-07"
      descricao="O chat do atendimento em sete peças: a casca, o cabeçalho de 48px com o contato e as ações, o log que rola e volta para a última mensagem, o balão de até 72% da largura em três vozes (contato, atendente, nota interna), o evento do sistema, o divisor de dia e o compositor com dois modos e um campo que cresce até 6 linhas."
      secoes={["A conversa inteira", "Cabeçalho e ações", "Balões e eventos", "Compositor", "Nota, desabilitado e finalizado", "Em outro idioma", "Estados", "Anatomia", "Na tela", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="A conversa inteira"
        spec="cabeçalho 48 · balão 72% · campo 1–6 linhas"
        descricao="Escreva e dê Enter; troque para Nota interna e veja o balão mudar de cor; finalize e o compositor dá lugar à frase; reabra e ele volta. A coluna tem 480px de altura aqui — na tela, ocupa o que sobra."
        codigo={codigoConversa}
        novidade="2026-10-07"
        nota={
          <>
            O cabeçalho recebe o contato em <Chip>avatar</Chip> e <Chip>titulo</Chip>, a linha de apoio em{" "}
            <Chip>subtitulo</Chip> e os botões em <Chip>acoes</Chip> — Tag do atendente, transferir, finalizar,
            mostrar o lead são da tela. <Chip>aoVoltar</Chip> só aparece abaixo de 768px, quando a tela mostra a
            lista OU a conversa. O <Chip>Mensagens</Chip> rola até o fim quando a <Chip>chave</Chip> muda: passe o id
            da conversa e quantas mensagens ela tem.
          </>
        }
      >
        <ExemploConversa />
      </Secao>

      <Secao
        titulo="Cabeçalho e ações"
        spec="48px · avatar 32 · ações da tela"
        descricao="Três momentos do mesmo cabeçalho: sem atendente (Assumir em soft no lugar da Tag), com atendente (a Tag com foto, Transferir e Finalizar) e finalizada (só Reabrir, em secondary). O cabeçalho não decide nada disso: a tela passa os botões em acoes."
        codigo={codigoCabecalho}
        novidade="2026-10-08"
        nota={
          <>
            O avatar é o <Chip>Avatar</Chip> de 32 — iniciais na cor do nome, ou a foto com <Chip>src</Chip>. O nome
            corta com reticências e guarda o inteiro no <Chip>title</Chip>; a linha de apoio leva o ícone do canal
            (<Chip>IconeDeMarca</Chip> de 12) e o que a tela quiser. Transferir abre um <Chip>ComboboxPainel</Chip>{" "}
            com os atendentes — foto antes do nome, sem a pílula (ADR-069); não é <Chip>Menu</Chip>.
          </>
        }
      >
        <ExemploCabecalhos />
      </Secao>

      <Secao
        titulo="Balões e eventos"
        spec="contato · atendente · nota · evento · divisor"
        descricao="Três vozes e duas linhas de sistema. O contato fica à esquerda em muted; o atendente à direita em button-soft, com um tique (enviada) ou dois em azul (lida); a nota interna à direita, em warning com selo — o contato não vê. O evento e o divisor de dia são linhas, não balões."
        codigo={codigoBaloes}
        novidade="2026-10-07"
        nota={
          <>
            O balão não tem hover: não é clicável. Entra subindo 4px (<Chip>animate-surgir</Chip>), nova ou ao abrir
            a conversa. <Chip>autor</Chip> só aparece nas vozes do time; <Chip>situacao</Chip> só no atendente. O
            texto respeita as quebras de linha (<Chip>whitespace-pre-wrap</Chip>) e quebra palavra longa (um link,
            um código) para não vazar do balão.
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
        spec="2 modos · Enter envia · Shift + Enter quebra"
        descricao="O grupo troca entre Mensagem e Nota interna, e com ele o rótulo, o placeholder e o nome do botão. O campo nasce com 1 linha e cresce até 6; o enviar só acende com texto. Clique no raio para uma resposta rápida entrar no campo."
        codigo={codigoCompositor}
        novidade="2026-10-07"
        nota={
          <>
            <Chip>acoes</Chip> entra entre o campo e o enviar: respostas rápidas (um <Chip>Menu</Chip> na tela) e
            anexar. Enviar entrega o texto sem os espaços das pontas e esvazia o campo; Enter no meio de uma
            composição de teclado (acentos por composição) não envia. A dica &quot;Enter envia&quot; some abaixo de
            640px.
          </>
        }
      >
        <ExemploCompositor />
      </Secao>

      <Secao
        titulo="Nota, desabilitado e finalizado"
        spec="modo=nota · desabilitado · finalizado"
        descricao="Em nota, o placeholder avisa que só o time vê e o botão passa a salvar. Desabilitado trava o grupo, o campo e o botão sem esconder — enquanto a API responde. Finalizado esconde tudo e deixa a frase, que a tela escreve."
        codigo={codigoModos}
        novidade="2026-10-08"
        nota={
          <>
            Os três são props, não estados internos: a tela sabe se a conversa está finalizada e se há um envio em
            curso. <Chip>desabilitado</Chip> segue a regra I5 do DS — opacidade por token e cursor de &quot;não
            dá&quot;, sem tirar os eventos.
          </>
        }
      >
        <ExemploModos />
      </Secao>

      <Secao
        titulo="Em outro idioma"
        spec="rotulos · 13 textos · fábrica pt-BR"
        descricao="Nada está escrito dentro das peças: o nome do log, o selo da nota, os tiques, o grupo do compositor, os placeholders, o enviar e a dica vêm de rotulos. Aqui em espanhol, passado às quatro peças que têm texto; o que a tela não passar sai da fábrica ROTULOS_DA_CONVERSA."
        codigo={codigoRotulos}
        novidade="2026-10-08"
        nota={
          <>
            Os textos do conteúdo — o dia do divisor, o evento, as mensagens — são da tela, não do componente: ela
            os escreve no idioma de quem lê. A fábrica tem {Object.keys(ROTULOS_DA_CONVERSA).length} textos.
          </>
        }
      >
        <ExemploEmEspanhol />
      </Secao>

      <Secao
        titulo="Estados"
        spec="6 estados · nada simulado"
        descricao="O balão não tem estado: não é clicável. Os estados moram no compositor e no cabeçalho — e todos aqui estão vivos nas seções acima."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="balão chegando">entra subindo 4px (<Chip>animate-surgir</Chip>, ADR-068); com redução de movimento, não</Item>
              <Item mono="enviada · lida">um tique em <Chip>muted-foreground</Chip>; dois em <Chip>primary</Chip>, nomeados para o leitor de tela</Item>
              <Item mono="nota interna">traço <Chip>warning/25</Chip>, fundo <Chip>warning/10</Chip> e o selo em <Chip>warning</Chip></Item>
              <Item mono="enviar desabilitado">o botão primary fica apagado enquanto o texto está vazio (I5)</Item>
              <Item mono="finalizada">o compositor some; a frase de <Chip>finalizado</Chip> fica no lugar, em <Chip>body-sm</Chip></Item>
              <Item mono="focus-visible">o anel de 2px com respiro nos botões; o campo mostra o traço e o anel interno do Input</Item>
            </ul>
          </>
        }
      >
        <ExemploModos />
      </Secao>

      <Secao titulo="Anatomia" spec="7 peças" semCaixa novidade="2026-10-08">
        <div className="divide-y divide-border rounded-lg border border-border">
          {anatomia.map((p) => (
            <div key={p.nome} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4">
              <div>
                <p className="text-h4 text-foreground">{p.nome}</p>
                <p className="mt-1 font-mono text-label-md text-subtle-foreground">{p.medida}</p>
              </div>
              <p className="text-body-lg text-muted-foreground">{p.papel}</p>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Na tela"
        spec="/prototipo?tela=atendimento"
        descricao="A coluna do meio do Atendimento é exatamente esta composição: a tela guarda o rascunho e o modo, zera os dois ao trocar de conversa, e passa as ações do cabeçalho (assumir, transferir, finalizar, mostrar o lead) e do compositor (respostas rápidas, anexar)."
        codigo={codigoNaTela}
        semSeletorDeFundo
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            Na tela, a lista ao lado é a <Chip>ListaDeConversas</Chip>, e o lead abre na terceira coluna. Abaixo de
            768px a tela mostra a lista OU a conversa, com o voltar no cabeçalho.
          </p>
          <Button asChild variant="secondary">
            <Link href="/prototipo?tela=atendimento">Abrir o Atendimento no protótipo</Link>
          </Button>
        </div>
      </Secao>

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
        <p>
          As peças são sete porque a tela precisa das partes, não só do todo: o <Chip>Compositor</Chip> sozinho serve
          para a nota de um lead no Drawer; o <Chip>Balao</Chip> sozinho, para uma prévia. Cada uma tem a própria
          casca e nenhuma depende da outra — a <Chip>Conversa</Chip> só as empilha.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Conversa responde “o que foi dito”; a linha do tempo do Drawer responde “o que aconteceu”.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> para o chat de um atendimento, com o contato de um lado e o
            time do outro: WhatsApp, Instagram, chat do site.
          </li>
          <li>
            <span className="text-foreground">Use</span> o <Chip>Compositor</Chip> sozinho onde se responde em linha
            — a nota de um lead, um comentário.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para o histórico de um lead (ligações, e-mails, etapas):
            é a linha do tempo do Drawer, não um chat.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para a lista de conversas ao lado: é a Lista de
            conversas.
          </li>
          <li>
            <span className="text-foreground">Não use</span> <Chip>&lt;textarea&gt;</Chip> nem <Chip>&lt;button&gt;</Chip>{" "}
            crus no rodapé: o Compositor já traz Textarea, SegmentedControl e Button.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
