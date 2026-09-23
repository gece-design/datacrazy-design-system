"use client";

import { useState } from "react";
import { Calendario, type EventoCalendario, type VisaoCalendario } from "@/components/ui/calendario";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

/* Os mesmos dez negócios da Table, marcados pela próxima ação. Setembro de
   2026 fixo: o showcase não anda com o relógio. */
const EVENTOS: EventoCalendario[] = [
  { id: "n1", data: "2026-09-02", rotulo: "Giovanna Alves", detalhe: "Plano Pro", tom: "azul" },
  { id: "n2", data: "2026-09-04", rotulo: "Clínica Vitalis", detalhe: "Plano Starter", tom: "roxo" },
  { id: "n3", data: "2026-09-09", rotulo: "Horizonte Engenharia", detalhe: "Enterprise", tom: "verde" },
  { id: "n4", data: "2026-09-09", rotulo: "Rede Bom Dia", detalhe: "Plano Pro", tom: "ciano" },
  { id: "n5", data: "2026-09-15", rotulo: "Instituto Raízes", detalhe: "Sem produto" },
  { id: "n6", data: "2026-09-17", rotulo: "Marina Alvarenga", detalhe: "Plano Starter", tom: "rosa" },
  { id: "n7", data: "2026-09-17", rotulo: "Oficina Farol", detalhe: "Plano Pro", tom: "ambar" },
  { id: "n8", data: "2026-09-17", rotulo: "Campo Vivo Agro", detalhe: "Enterprise", tom: "verde" },
  { id: "n9", data: "2026-09-17", rotulo: "Helena Moraes", detalhe: "Plano Starter", tom: "azul" },
  { id: "n10", data: "2026-09-17", rotulo: "Tomás Vilela", detalhe: "Plano Pro", tom: "vermelho" },
  { id: "n11", data: "2026-09-23", rotulo: "Follow-up Serra Azul", detalhe: "Logística", tom: "laranja" },
  { id: "n12", data: "2026-09-29", rotulo: "Proposta Nexa", detalhe: "Enterprise", tom: "roxo" },
  { id: "n13", data: "2026-10-01", rotulo: "Renovação Vitalis", detalhe: "Plano Starter", tom: "roxo" },
];

const HOJE = new Date(2026, 8, 19);

const codigo = `const [referencia, setReferencia] = useState(new Date());
const [visao, setVisao] = useState<VisaoCalendario>("mes");

<Calendario
  locale={locale}
  eventos={leads.map((l) => ({ id: l.id, data: l.proximaAcao, rotulo: l.nome, detalhe: l.empresa }))}
  referencia={referencia}
  aoMudarReferencia={setReferencia}
  visao={visao}
  aoMudarVisao={setVisao}
  aoAbrir={(evento) => abrirLead(evento.id)}
  aoEscolherDia={(dia) => novoLead({ proximaAcao: dia })}
/>`;

function Exemplo({ visaoInicial = "mes", locale = "pt-BR" }: { visaoInicial?: VisaoCalendario; locale?: string }) {
  const [referencia, setReferencia] = useState(new Date(2026, 8, 1));
  const [visao, setVisao] = useState<VisaoCalendario>(visaoInicial);
  const [aberto, setAberto] = useState<EventoCalendario | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <Calendario
        locale={locale}
        eventos={EVENTOS}
        referencia={referencia}
        aoMudarReferencia={setReferencia}
        visao={visao}
        aoMudarVisao={setVisao}
        hoje={HOJE}
        aoAbrir={setAberto}
      />
      {/* O que o clique devolve — no CRM, o lead abre no Drawer. */}
      <p aria-live="polite" className="text-body-md text-muted-foreground">
        {aberto ? (
          <>
            <span className="text-h4 text-foreground">{aberto.rotulo}</span> · {aberto.detalhe} · {aberto.data}. No CRM,
            este evento abre o Drawer do lead.
          </>
        ) : (
          "Clique num evento para ver o que o calendário devolve."
        )}
      </p>
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Calendário"
      descricao="A visão por data do pipeline: os negócios no mês ou na semana, pela próxima ação. Grade de sete colunas com o dia, até três eventos e o +N que abre o resto; setas andam pelos dias, e o mês entra dissolvendo."
      secoes={["Mês e semana", "Dia cheio", "Nos três idiomas", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="Mês e semana"
        spec="7 colunas · 3 por dia"
        descricao="Setas e Hoje andam pelo tempo; o grupo à direita troca mês e semana. Clique num evento; clique no número do dia para criar naquela data. Com o foco na grade, as setas do teclado andam pelos dias, Home e End vão às pontas da semana, PageUp e PageDown trocam o mês."
        codigo={codigo}
        nota={
          <>
            O componente não sabe o que é um evento: recebe <Chip>id</Chip>, <Chip>data</Chip> (AAAA-MM-DD) e{" "}
            <Chip>rotulo</Chip>, e devolve o clicado em <Chip>aoAbrir</Chip>. O dia de hoje ganha o disco{" "}
            <Chip>primary</Chip>; os dias vizinhos que fecham a grade ficam em <Chip>subtle-foreground</Chip>. O{" "}
            <Chip>tom</Chip> pinta só a bolinha — o texto é o sinal, como na Tag. Mês e semana, e a data de
            referência, são estado da tela.
          </>
        }
      >
        <Exemplo />
      </Secao>

      <Secao
        titulo="Dia cheio"
        spec="+N mais · painel do dia"
        descricao="Dia 17 tem cinco negócios: a célula mostra três e o +2 mais abre o painel com a lista inteira, com a linha de apoio de cada um. Escape fecha e devolve o foco."
        codigo={`{/* padrão: 3 eventos por dia no mês, 8 na semana; o resto vai para o painel do dia */}
<Calendario
  locale="pt-BR"
  eventos={eventos}
  referencia={referencia}
  aoMudarReferencia={setReferencia}
  visao="semana"
  maximoPorDia={3}
  aoAbrir={abrir}
/>`}
        nota={
          <>
            O painel é o <Chip>PainelFlutuante</Chip> do Select, em portal fixo — a grade pode viver numa caixa
            que rola. Dentro dele cada evento é um botão; o foco entra no primeiro e volta ao{" "}
            <Chip>+N mais</Chip> ao fechar. Na semana o teto sobe para oito, porque a célula é mais alta.
          </>
        }
      >
        <Exemplo visaoInicial="semana" />
      </Secao>

      <Secao
        titulo="Nos três idiomas"
        spec="Intl · pt-BR · en-US · es"
        descricao="Nome do mês, dos dias e o primeiro dia da semana saem de Intl a partir do locale: es começa na segunda, pt-BR e en no domingo. Os rótulos dos botões vêm de fora, em rotulos."
        codigo={`<Calendario
  locale="es"
  rotulos={{ hoje: "Hoy", mes: "Mes", semana: "Semana", anterior: "Anterior", proximo: "Siguiente", mais: (n) => \`+\${n} más\` }}
  eventos={eventos}
  referencia={referencia}
  aoMudarReferencia={setReferencia}
  aoAbrir={abrir}
/>`}
      >
        <div className="flex flex-col gap-6">
          <Exemplo locale="en-US" visaoInicial="semana" />
          <Exemplo locale="es" visaoInicial="semana" />
        </div>
        <Legenda>
          Em espanhol a semana começa na segunda — a grade reorganiza as colunas sozinha. Os botões continuam em
          português porque este exemplo não passou <Chip>rotulos</Chip>; no CRM eles vêm do next-intl.
        </Legenda>
      </Secao>

      <ComoFunciona>
        <p>
          Não há desenho no arquivo: o Calendário nasceu do pedido do cliente (2026-09-18, uma visão de calendário
          ao lado do Kanban e da lista) e das peças que já existiam. A grade e as contas de data são as do Date
          Picker, que saíram dele para <Chip>lib/datas.ts</Chip> — regra D21: helper comum mora em lib, senão o
          registry faria o calendário instalar o date picker. Mês/semana é o <Chip>SegmentedControl</Chip>, as
          setas são o <Chip>Button</Chip> tertiary, o dia cheio abre o <Chip>PainelFlutuante</Chip>.
        </p>
        <p>
          A grade é <Chip>role=&quot;grid&quot;</Chip> numa <Chip>&lt;table&gt;</Chip> de verdade, com um dia por vez
          no Tab: as setas andam, e sair do mês pela seta leva o mês junto. Os eventos do dia focado entram no Tab
          logo depois do número; nos outros dias ficam fora dele, senão uma grade cheia viraria cem paradas de
          Tab. O nome do dia diz quantos eventos ele tem, para quem não vê a célula.
        </p>
        <p>
          &quot;Hoje&quot; é medido depois de montar. No servidor a data é a do build, e o navegador discordaria na
          hidratação — o mesmo problema que o Date Picker mostrou na regressão visual. O showcase fixa{" "}
          <Chip>hoje</Chip> e a referência em setembro de 2026 para a captura não andar com o relógio.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Calendário responde “quando”; Kanban responde “em que etapa”; a lista responde “quais”.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> quando a pergunta é de data: follow-ups da semana, propostas
            que vencem, reuniões marcadas.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para volume: trinta negócios no mesmo dia viram um
            +27 mais. Aí a resposta é a lista, filtrada pela data.
          </li>
          <li>
            <span className="text-foreground">Semana</span> quando o dia importa mais que o mês — a agenda de um
            atendente; <span className="text-foreground">mês</span> para planejar.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
