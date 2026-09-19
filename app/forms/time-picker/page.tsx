"use client";

import { useState } from "react";
import { TimePicker, DateTimePicker, type RotulosDeHora } from "@/components/ui/time-picker";
import { formatarNoFuso } from "@/lib/fusos";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

const rotulos: RotulosDeHora = {
  vazio: "Escolher",
  horas: "Hora",
  minutos: "Min",
  segundos: "Seg",
  agora: "Agora",
  limpar: "Limpar",
  fuso: "Fuso horário",
};

const rotulosCalendario = {
  mes: "Mês",
  ano: "Ano",
  mesAnterior: "Mês anterior",
  proximoMes: "Próximo mês",
};

/** Os fusos onde o CRM tem cliente hoje. A lista completa do sistema sai de
 *  `fusosDisponiveis()` e tem mais de 400 entradas — demais para um seletor. */
const FUSOS = ["America/Sao_Paulo", "America/Manaus", "America/New_York", "Europe/Lisbon", "UTC"];

export default function TimePickerPage() {
  const [hora, setHora] = useState<string | null>("09:30");
  const [horaComSegundos, setHoraComSegundos] = useState<string | null>("09:30:20");
  const [quando, setQuando] = useState<Date | null>(new Date(2026, 8, 17, 14, 30));
  const [fuso, setFuso] = useState("America/Sao_Paulo");

  return (
    <PaginaDS
      titulo="Time Picker"
      descricao="Hora sozinha e data com hora, as duas cientes de fuso. A caixa é a do Input, a lista usa os tokens de overlay e o calendário é a mesma grade do Date Picker — nada aqui foi redesenhado."
      secoes={["Como funciona", "Hora", "Data e hora", "Fuso horário", "Quando usar"]}
    >
      <ComoFunciona>
        <p>
          São dois componentes com contratos diferentes, e a diferença não é
          visual. O <Chip>TimePicker</Chip> guarda <span className="text-foreground">texto</span> —{" "}
          <Chip>&quot;09:30&quot;</Chip> — porque hora sem data é hora de parede: o horário de
          funcionamento da loja é 09:30 em qualquer dia do ano, com ou sem horário de verão. O{" "}
          <Chip>DateTimePicker</Chip> guarda <Chip>Date</Chip>, que é{" "}
          <span className="text-foreground">instante</span>: a reunião marcada acontece num ponto único do
          tempo, e cada pessoa lê esse ponto no relógio dela.
        </p>
        <p>
          Por isso o fuso aparece nos dois, mas fazendo coisas diferentes. Na hora sozinha ele só diz de qual
          relógio se está falando e é quem o botão <Chip>Agora</Chip> consulta. Na data com hora ele é a vista:
          trocar de fuso não muda o instante guardado, muda o que se lê na tela — o mesmo valor aparece
          14:30 em São Paulo e 18:30 em Lisboa.
        </p>
        <p>
          Nada disso usa biblioteca de data. As partes do relógio saem do{" "}
          <Chip>Intl.DateTimeFormat</Chip> com <Chip>timeZone</Chip>, que já traz o banco de fusos do sistema,
          e a volta — das partes para o instante — é a conta de <Chip>lib/fusos.ts</Chip>, feita duas vezes
          para acertar a hora que cai em cima da virada do horário de verão.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Hora"
        spec="HH:MM · HH:MM:SS"
        descricao="Colunas de hora e minuto, com a de segundos ligada por prop. O passo dos minutos é seu: 5 em 5 por padrão, 1 em 1 quando a operação precisa."
        codigo={`<TimePicker
  rotulo="Abre às"
  valor={hora}
  aoMudar={setHora}
  locale="pt-BR"
  rotulos={{ vazio: "Escolher", horas: "Hora", minutos: "Min", segundos: "Seg",
             agora: "Agora", limpar: "Limpar", fuso: "Fuso horário" }}
/>

{/* com segundos e minuto a minuto */}
<TimePicker
  rotulo="Disparo da automação"
  valor={horaComSegundos}
  aoMudar={setHoraComSegundos}
  segundos
  passoMinutos={1}
  locale="pt-BR"
  rotulos={rotulos}
/>`}
        nota={
          <>
            O valor é texto no formato 24h. Quem lê e escreve no back não precisa saber de fuso — e o
            componente não inventa um. O botão <Chip>Agora</Chip> usa o fuso da prop; sem ela, o do navegador.
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <TimePicker rotulo="Abre às" valor={hora} aoMudar={setHora} locale="pt-BR" rotulos={rotulos} />
          <TimePicker
            rotulo="Disparo da automação"
            valor={horaComSegundos}
            aoMudar={setHoraComSegundos}
            segundos
            passoMinutos={1}
            locale="pt-BR"
            rotulos={rotulos}
          />
        </div>
      </Secao>

      <Secao
        titulo="Data e hora"
        spec="Date · instante"
        descricao="Calendário de um mês à esquerda, colunas de hora à direita. Clicar no dia mantém a hora; clicar na hora mantém o dia."
        codigo={`<DateTimePicker
  rotulo="Início do atendimento"
  valor={quando}
  aoMudar={setQuando}
  fuso={fuso}
  aoMudarFuso={setFuso}
  fusos={["America/Sao_Paulo", "Europe/Lisbon", "UTC"]}
  locale="pt-BR"
  rotulos={{ ...rotulosDeHora, mes: "Mês", ano: "Ano",
             mesAnterior: "Mês anterior", proximoMes: "Próximo mês" }}
/>`}
        nota={
          <>
            O calendário é o <Chip>CalendarioDeDia</Chip>, exportado do Date Picker: mesma grade, mesmo foco
            itinerante, mesmas teclas (setas, Home, End, PageUp e PageDown). Sem valor, o painel abre no mês de
            hoje com a hora zerada.
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <DateTimePicker
            rotulo="Início do atendimento"
            valor={quando}
            aoMudar={setQuando}
            fuso={fuso}
            aoMudarFuso={setFuso}
            fusos={FUSOS}
            locale="pt-BR"
            rotulos={{ ...rotulos, ...rotulosCalendario }}
          />
          <DateTimePicker
            rotulo="Com segundos"
            valor={quando}
            aoMudar={setQuando}
            segundos
            fuso={fuso}
            locale="pt-BR"
            rotulos={{ ...rotulos, ...rotulosCalendario }}
          />
        </div>
      </Secao>

      <Secao
        titulo="Fuso horário"
        spec="Intl · sem biblioteca"
        descricao="O mesmo instante, lido em cinco relógios. Troque o fuso no painel acima e veja a lista inteira mudar — o valor guardado é um só."
        nota={
          <>
            <Chip>lib/fusos.ts</Chip> tem o que os dois componentes usam:{" "}
            <Chip>partesNoFuso</Chip>, <Chip>instanteNoFuso</Chip>, <Chip>rotuloDoFuso</Chip> e{" "}
            <Chip>fusosDisponiveis</Chip>. O horário de verão entra de graça: quem sabe dele é o banco de fusos
            do sistema, não a nossa conta.
          </>
        }
      >
        <ul className="mx-auto max-w-[420px] divide-y divide-border">
          {FUSOS.map((f) => (
            <li key={f} className="flex items-center justify-between gap-4 py-2">
              <span className="truncate text-body-md text-muted-foreground">{f}</span>
              <span className="shrink-0 text-h4 tabular-nums text-foreground" suppressHydrationWarning>
                {quando ? formatarNoFuso(quando, f, "pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—"}
              </span>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao titulo="Quando usar" descricao="A pergunta é sempre a mesma: isso é hora de parede ou instante?">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Hora de parede é TimePicker.</span> Horário de funcionamento,
            janela de disparo, hora do lembrete diário. Guardar isso como instante faz o horário andar sozinho
            na virada do horário de verão.
          </li>
          <li>
            <span className="text-foreground">Compromisso é DateTimePicker.</span> Reunião, atendimento,
            vencimento. Guarde o <Chip>Date</Chip> e mostre no fuso de quem está olhando.
          </li>
          <li>
            <span className="text-foreground">Mostre o fuso sempre que houver dois.</span> Se o time atende de
            outro estado ou país, a hora sem fuso é a hora errada de alguém.
          </li>
          <li>
            <span className="text-foreground">Passo do minuto conta.</span> 5 em 5 cobre agenda; disparo de
            automação costuma precisar de 1 em 1, e aí a lista fica com 60 itens — é escolha da tela.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
