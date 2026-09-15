"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import { RadioGroup, Radio } from "@/components/ui/radio-group";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

/* Na doc os textos são literais porque a doc é escrita em português. No CRM
   cada rótulo vem do next-intl — o componente não tem nenhum embutido. */

const codigoPadrao = `<RadioGroup rotulo={t("tipoDePessoa")} valor={tipo} onValorChange={setTipo}>
  <Radio value="fisica">{t("pessoaFisica")}</Radio>
  <Radio value="juridica">{t("pessoaJuridica")}</Radio>
</RadioGroup>`;

const codigoEmLinha = `<RadioGroup
  rotulo={t("quandoDisparar")}
  valorPadrao="entrada"
  className="flex-row flex-wrap gap-x-6 gap-y-3"
>
  <Radio value="entrada">{t("naEntrada")}</Radio>
  <Radio value="etapa">{t("aoMudarDeEtapa")}</Radio>
  <Radio value="agendado">{t("agendado")}</Radio>
</RadioGroup>`;

const codigoDesabilitado = `<RadioGroup rotulo={t("canal")} valorPadrao="whatsapp" disabled>
  <Radio value="whatsapp">WhatsApp</Radio>
  <Radio value="email">E-mail</Radio>
</RadioGroup>`;

const regras: React.ReactNode[] = [
  <>
    <span className="text-foreground">Não use Radio para duas opções que são sim e não.</span> &ldquo;Receber
    notificações: sim / não&rdquo; é um <Chip>Switch</Chip> ou um <Chip>Checkbox</Chip>. Radio é para escolhas com
    nome próprio.
  </>,
  <>
    <span className="text-foreground">Não use Select para duas ou três opções.</span> Radio mostra tudo sem um clique a
    mais. Acima de seis, ou quando as opções vêm do back, aí é <Chip>Select</Chip>.
  </>,
  <>
    <span className="text-foreground">Não coloque <Chip>Radio</Chip> fora de <Chip>RadioGroup</Chip>.</span> O grupo é
    quem dá o mesmo <Chip>name</Chip> aos itens — e sem o mesmo <Chip>name</Chip> as setas param de funcionar e dois
    podem ficar marcados.
  </>,
  <>
    <span className="text-foreground">Não esqueça o nome do grupo.</span> <Chip>rotulo</Chip> ou{" "}
    <Chip>aria-labelledby</Chip>: o leitor de tela anuncia &ldquo;Pessoa física, 1 de 2&rdquo;, mas sem o nome não diz
    de quê.
  </>,
  <>
    <span className="text-foreground">Não comece sem nenhum marcado se a escolha é obrigatória.</span> Pré-marque a
    opção mais comum. Grupo vazio obrigatório é erro de formulário esperando para acontecer.
  </>,
];

export default function RadioGroupPage() {
  const [tipo, setTipo] = React.useState("fisica");

  return (
    <PaginaDS
      titulo="Radio Group"
      descricao="Escolha exclusiva entre opções com nome próprio. Círculo de 18px com traço de 1.5px, que sobe para 5px quando marcado e deixa um miolo de 8px. Quatro estados desenhados, teclado por setas."
      secoes={["Como funciona", "Estados", "Padrão", "Em linha", "Grupo desabilitado", "Regras"]}
    >
      <ComoFunciona>
        <p>
          Cada item é um <Chip>{'<input type="radio">'}</Chip> nativo, escondido só da vista, e o{" "}
          <Chip>RadioGroup</Chip> dá o mesmo <Chip>name</Chip> a todos. Esse detalhe entrega de graça a regra de
          teclado que implementação caseira quase sempre erra — e que tem quatro tickets de acessibilidade abertos no
          CRM: <span className="text-foreground">setas movem e selecionam ao mesmo tempo</span>, e Tab entra no grupo
          pelo item marcado e sai dele de uma vez, em vez de parar em cada opção.
        </p>
        <p>
          O marcado não tem ponto desenhado dentro. É o <span className="text-foreground">traço que engorda</span> de
          1.5px para 5px, em <Chip>primary</Chip>, e o miolo de 8px que sobra é o próprio fundo{" "}
          <Chip>input/bg</Chip> aparecendo. Um elemento só, sem filho, e o miolo acompanha o tema sem regra nenhuma.
        </p>
        <p>
          O grupo aceita <Chip>valor</Chip> controlado ou <Chip>valorPadrao</Chip> solto. Hover e foco seguem a regra dos
          três controles de formulário: <Chip>input/border</Chip> → <Chip>input/border-hover</Chip>,{" "}
          <Chip>primary</Chip> → <Chip>primary-hover</Chip>, outline D6.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Estados"
        spec="18px · traço 1.5 → 5"
        descricao="Os quatro do arquivo. O par de cima responde ao clique; o de baixo está desabilitado."
        nota={
          <p>
            Desabilitado troca o fundo para <Chip>input/bg-disabled</Chip>, e o marcado desabilitado pinta o traço em{" "}
            <Chip>subtle-foreground</Chip> — não é opacidade sobre o normal.
          </p>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <RadioGroup rotulo="Estados habilitados" valorPadrao="marcado">
            <Radio value="desmarcado">Desmarcado</Radio>
            <Radio value="marcado">Marcado</Radio>
          </RadioGroup>
          <RadioGroup rotulo="Estados desabilitados" valorPadrao="marcado" disabled>
            <Radio value="desmarcado">Desmarcado desabilitado</Radio>
            <Radio value="marcado">Marcado desabilitado</Radio>
          </RadioGroup>
        </div>
      </Secao>

      <Secao
        titulo="Padrão"
        spec="vertical · gap 20"
        descricao="Pilha vertical, uma opção por linha. Clique em uma e use as setas: a seleção anda junto com o foco."
        codigo={codigoPadrao}
        nota={
          <p>
            O espaço de 20px entre os itens é o do component set no arquivo. Para listas mais densas, passe{" "}
            <Chip>className</Chip> com outro <Chip>gap</Chip>.
          </p>
        }
      >
        <RadioGroup rotulo="Tipo de pessoa" valor={tipo} onValorChange={setTipo}>
          <Radio value="fisica">Pessoa física</Radio>
          <Radio value="juridica">Pessoa jurídica</Radio>
        </RadioGroup>
      </Secao>

      <Secao
        titulo="Em linha"
        spec="flex-row"
        descricao="Opções curtas lado a lado — quando disparar uma automação. Abaixo da largura, elas descem para a linha de baixo."
        codigo={codigoEmLinha}
      >
        <RadioGroup rotulo="Quando disparar" valorPadrao="entrada" className="flex-row flex-wrap gap-x-6 gap-y-3">
          <Radio value="entrada">Na entrada do lead</Radio>
          <Radio value="etapa">Ao mudar de etapa</Radio>
          <Radio value="agendado">Agendado</Radio>
        </RadioGroup>
      </Secao>

      <Secao
        titulo="Grupo desabilitado"
        spec="disabled"
        descricao="`disabled` no grupo desliga todos os itens. O valor escolhido continua visível."
        codigo={codigoDesabilitado}
        nota={
          <p>
            Input desabilitado sai da ordem de tabulação e não vai no envio do <Chip>{"<form>"}</Chip>. Se o valor
            precisa ir, desabilitar é a ferramenta errada.
          </p>
        }
      >
        <RadioGroup rotulo="Canal" valorPadrao="whatsapp" disabled>
          <Radio value="whatsapp">WhatsApp</Radio>
          <Radio value="email">E-mail</Radio>
        </RadioGroup>
      </Secao>

      <Secao titulo="Regras" descricao="Cinco maneiras conhecidas de usar mal uma escolha exclusiva.">
        <ul className="space-y-3">
          {regras.map((r, i) => (
            <li key={i} className="flex gap-2.5">
              <X size={14} weight="regular" className="mt-1 shrink-0 text-destructive" />
              <p className="chrome-prose text-muted-foreground">{r}</p>
            </li>
          ))}
        </ul>
      </Secao>
    </PaginaDS>
  );
}
