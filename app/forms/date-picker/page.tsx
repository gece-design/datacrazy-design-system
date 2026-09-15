"use client";

import * as React from "react";
import { X } from "@phosphor-icons/react";
import {
  DateRangePicker,
  type AtalhoDeIntervalo,
  type IntervaloDeDatas,
  type RotulosDoDatePicker,
} from "@/components/ui/date-picker";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

/* Na doc os textos são literais porque a doc é escrita em português. No CRM
   cada um destes vem do next-intl — o componente não tem nenhum embutido. */
const rotulos: RotulosDoDatePicker = {
  vazio: "Selecione um período",
  atalhos: "Selecione",
  mes: "Mês",
  ano: "Ano",
  mesAnterior: "Mês anterior",
  proximoMes: "Próximo mês",
  aplicar: "Aplicar",
  cancelar: "Cancelar",
};

function menosDias(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - n);
}

const atalhos: AtalhoDeIntervalo[] = [
  { id: "hoje", rotulo: "Hoje", intervalo: (h) => ({ inicio: h, fim: h }) },
  { id: "7d", rotulo: "Últimos 7 dias", intervalo: (h) => ({ inicio: menosDias(h, 6), fim: h }) },
  { id: "15d", rotulo: "Últimos 15 dias", intervalo: (h) => ({ inicio: menosDias(h, 14), fim: h }) },
  {
    id: "3m",
    rotulo: "Últimos 3 meses",
    intervalo: (h) => ({ inicio: new Date(h.getFullYear(), h.getMonth() - 3, h.getDate()), fim: h }),
  },
  {
    id: "1a",
    rotulo: "Último ano",
    intervalo: (h) => ({ inicio: new Date(h.getFullYear() - 1, h.getMonth(), h.getDate()), fim: h }),
  },
];

type Parte = { nome: string; papel: string };

const anatomia: Parte[] = [
  {
    nome: "Gatilho",
    papel:
      "Controle próprio do arquivo (node 471:2809), não o Button secundário: 29px, sem traço, `text-body-md`. Dois estados de repouso — Default em `card` + `muted-foreground`, Active em `accent` + `primary` — e Active é o painel aberto. O rótulo é o próprio período formatado.",
  },
  {
    nome: "Coluna de atalhos",
    papel:
      "Opcional e vinda de fora por props. Sem a prop `atalhos`, a coluna some e o painel encolhe: não existe atalho embutido.",
  },
  {
    nome: "Cabeçalho",
    papel:
      "Seta, mês, ano, seta. Mês e ano são seletores nativos — pular 14 meses com a seta é o que faz o usuário desistir do filtro.",
  },
  {
    nome: "Grade dupla",
    papel:
      "Dois meses lado a lado, porque período quase sempre atravessa a virada do mês. Abaixo de 640px a segunda grade sai.",
  },
  {
    nome: "Rodapé",
    papel:
      "Cancelar e Aplicar. O que se clica na grade é rascunho; o valor só sobe para quem usa o componente no Aplicar.",
  },
];

const regras: React.ReactNode[] = [
  <>
    <span className="text-foreground">Não formate data à mão.</span> <Chip>{"`${dia}/${mes}`"}</Chip> ou{" "}
    <Chip>toLocaleDateString(&quot;pt-BR&quot;)</Chip> com locale literal é o mesmo bug em duas roupas: quebra em{" "}
    <Chip>en</Chip> e <Chip>es</Chip>. Quem formata é o <Chip>Intl</Chip> do componente, a partir do{" "}
    <Chip>locale</Chip> que você passa.
  </>,
  <>
    <span className="text-foreground">Não presuma que a semana começa no domingo.</span> Começa em{" "}
    <Chip>pt-br</Chip> e <Chip>en</Chip>, e começa na segunda em <Chip>es</Chip>. O componente pergunta ao CLDR pelo{" "}
    <Chip>Intl.Locale</Chip>; fixar a ordem em código desalinha a grade inteira num dos três idiomas.
  </>,
  <>
    <span className="text-foreground">Não escreva rótulo dentro do componente.</span> <Chip>rotulos</Chip> é
    obrigatório de propósito — inclusive os <Chip>aria-label</Chip> das setas e dos seletores. Texto de interface é
    regra 4 de i18n, e leitor de tela não é exceção.
  </>,
  <>
    <span className="text-foreground">Não compare datas com <Chip>===</Chip> nem por <Chip>getTime()</Chip>.</span>{" "}
    Data que vem do back tem hora, e 3 de setembro às 14h não é 3 de setembro à meia-noite. A comparação aqui é por
    chave <Chip>AAAAMMDD</Chip>, que ignora hora e fuso.
  </>,
  <>
    <span className="text-foreground">Não use <Chip>z-[9999]</Chip> no painel.</span> A camada é{" "}
    <Chip>z-popover</Chip>, que vale 50 na escala do <Chip>tailwind.config.ts</Chip>. <Chip>z-index</Chip> cru é a
    causa dos tickets #86338 e #86178.
  </>,
  <>
    <span className="text-foreground">Não trave a largura do gatilho.</span> Em <Chip>es</Chip> e <Chip>pt-br</Chip> o
    período formatado é 20–30% mais longo que em <Chip>en</Chip>. O gatilho cresce até o limite do pai e só então
    trunca — e é aí que ele passa a precisar de tooltip, pela regra E1.
  </>,
];

const codigoPadrao = `const [periodo, setPeriodo] = useState<IntervaloDeDatas>({ inicio: null, fim: null });
const t = useTranslations("filtros.periodo");
const locale = useLocale();

<DateRangePicker
  valor={periodo}
  onValorChange={setPeriodo}
  locale={locale}
  rotulos={{
    vazio: t("vazio"),
    atalhos: t("atalhos"),
    mes: t("mes"),
    ano: t("ano"),
    mesAnterior: t("mesAnterior"),
    proximoMes: t("proximoMes"),
    aplicar: t("aplicar"),
    cancelar: t("cancelar"),
  }}
  atalhos={[
    { id: "hoje", rotulo: t("hoje"), intervalo: (h) => ({ inicio: h, fim: h }) },
    { id: "7d", rotulo: t("ultimos7"), intervalo: (h) => ({ inicio: menosDias(h, 6), fim: h }) },
    { id: "15d", rotulo: t("ultimos15"), intervalo: (h) => ({ inicio: menosDias(h, 14), fim: h }) },
  ]}
/>`;

const codigoSimples = `<DateRangePicker
  valor={periodo}
  onValorChange={setPeriodo}
  locale={locale}
  rotulos={rotulos}
/>`;

const codigoLimite = `<DateRangePicker
  valor={periodo}
  onValorChange={setPeriodo}
  locale={locale}
  rotulos={rotulos}
  atalhos={atalhos}
  dataMaxima={hoje}
/>`;

const idiomas = [
  { locale: "pt-BR", nome: "pt-br", nota: "semana começa no domingo" },
  { locale: "en-US", nome: "en", nota: "semana começa no domingo" },
  { locale: "es-ES", nome: "es", nota: "semana começa na segunda" },
];

export default function DatePickerPage() {
  const hoje = React.useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const periodoInicial = React.useMemo<IntervaloDeDatas>(
    () => ({ inicio: menosDias(hoje, 6), fim: hoje }),
    [hoje]
  );

  const [padrao, setPadrao] = React.useState<IntervaloDeDatas>(periodoInicial);
  const [simples, setSimples] = React.useState<IntervaloDeDatas>({ inicio: null, fim: null });
  const [limitado, setLimitado] = React.useState<IntervaloDeDatas>({ inicio: null, fim: null });
  const [porIdioma, setPorIdioma] = React.useState<IntervaloDeDatas>(periodoInicial);

  return (
    <PaginaDS
      titulo="Date Picker"
      descricao="Seleção de período em dois meses, com coluna de atalhos e confirmação explícita. É o componente mais exposto à regra de idioma do design system: nome de mês, nome de dia, ordem dd/mm e primeiro dia da semana são os quatro pontos onde en, es e pt-br discordam."
      secoes={["Como funciona", "Anatomia", "Padrão", "Sem atalhos", "Com limite de data", "Nos três idiomas", "Regras"]}
    >
      <ComoFunciona>
        <p>
          O componente tem duas metades e elas não se misturam. A primeira é{" "}
          <span className="text-foreground">aritmética de calendário</span> — quantos dias tem o mês, em que coluna cai
          o dia 1, qual dia está entre o início e o fim. Essa metade é a mesma no mundo inteiro e vive em código. A
          segunda é <span className="text-foreground">tudo que é palavra ou ordem</span> — o nome do mês, a abreviação
          do dia, se a data se escreve 03/09 ou 09/03, e em que coluna a semana começa. Essa metade{" "}
          <span className="text-foreground">não</span> vive em código: sai do <Chip>Intl</Chip>, a partir do{" "}
          <Chip>locale</Chip> que o componente recebe.
        </p>
        <p>
          A separação existe porque o CRM fala três línguas e as três discordam. <Chip>es</Chip> começa a semana na
          segunda-feira; <Chip>pt-br</Chip> e <Chip>en</Chip> começam no domingo. Uma constante{" "}
          <Chip>[&quot;dom&quot;, &quot;seg&quot;, …]</Chip> escrita à mão não erra só os rótulos — ela desloca a grade
          inteira em uma coluna, e o usuário espanhol clica em terça achando que clicou em segunda. Quem responde isso
          é <Chip>Intl.Locale</Chip>, pelo CLDR, e não o desenvolvedor.
        </p>
        <p>
          O mesmo vale para o rótulo do gatilho. O intervalo é escrito por{" "}
          <Chip>Intl.DateTimeFormat.formatRange</Chip>, que sabe encurtar o par — em pt-br sai{" "}
          <span className="text-foreground">27 de ago. – 3 de set. de 2026</span>, com o ano dito uma vez só.
          Concatenar duas datas formatadas com um travessão no meio produz a string errada em pelo menos um dos três
          idiomas, e é exatamente o que a referência de onde este componente veio faz hoje.
        </p>
        <p>
          A terceira decisão é o <span className="text-foreground">rascunho</span>. Enquanto o painel está aberto, o
          que se clica na grade não sai do componente: fica num estado interno, e só o <Chip>Aplicar</Chip> chama{" "}
          <Chip>onValorChange</Chip>. Sem isso, o primeiro dos dois cliques já dispararia uma consulta com um intervalo
          pela metade — e num CRM que refaz gráfico e tabela a cada mudança de filtro, isso é uma requisição jogada
          fora por seleção, sempre.
        </p>
        <p>
          Comparação de dia é por chave <Chip>AAAAMMDD</Chip>, nunca por <Chip>getTime()</Chip>. Data que chega do back
          traz hora, e comparar milissegundos faz &ldquo;3 de setembro às 14h&rdquo; deixar de ser &ldquo;3 de
          setembro&rdquo;. O intervalo é fechado nos dois extremos: o dia do início e o dia do fim entram na seleção.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Anatomia"
        spec="5 partes"
        descricao="Abra o gatilho para ver as cinco. Só a grade e o rodapé são obrigatórios — o resto entra conforme a tela precisa."
        nota={
          <div className="space-y-3">
            <ul className="divide-y divide-border">
              {anatomia.map((p) => (
                <li key={p.nome} className="py-2.5 first:pt-0 last:pb-0">
                  <p className="font-mono chrome-label text-foreground">{p.nome}</p>
                  <p className="mt-1 chrome-prose text-muted-foreground">{p.papel}</p>
                </li>
              ))}
            </ul>
            <p>
              O painel abre em <Chip>z-popover</Chip> e mede o espaço antes de escolher o lado: sem espaço embaixo ele
              vira para cima, e encostado na direita ele alinha pela borda direita. A medição acontece na abertura e
              de novo a cada <Chip>resize</Chip> — com zoom acima de 100% o viewport encolhe em px de CSS e um painel
              de ~660px deixa de caber onde cabia.
            </p>
          </div>
        }
      >
        <div className="flex min-h-[420px] items-start justify-center">
          <DateRangePicker
            valor={padrao}
            onValorChange={setPadrao}
            locale="pt-BR"
            rotulos={rotulos}
            atalhos={atalhos}
          />
        </div>
      </Secao>

      <Secao
        titulo="Padrão"
        spec="atalhos + 2 meses"
        descricao="A forma completa: cinco atalhos à esquerda, dois meses à direita, confirmação no rodapé. É a que o filtro de período do CRM usa."
        codigo={codigoPadrao}
        nota={
          <p>
            Os atalhos são <span className="text-foreground">dados, não configuração</span>: cada um é um{" "}
            <Chip>id</Chip>, um <Chip>rotulo</Chip> já traduzido e uma função que recebe <Chip>hoje</Chip> e devolve o
            intervalo. Por isso &ldquo;últimos 7 dias&rdquo; pode ser <Chip>hoje - 6</Chip> até <Chip>hoje</Chip> — sete
            dias contando o de hoje — e a decisão fica visível na tela que usa, em vez de escondida no componente. O
            atalho que bate com a seleção atual fica marcado sozinho, comparando as duas pontas; não há estado
            duplicado de &ldquo;qual atalho está ativo&rdquo;.
          </p>
        }
      >
        <div className="flex min-h-[120px] items-start justify-center">
          <DateRangePicker
            valor={padrao}
            onValorChange={setPadrao}
            locale="pt-BR"
            rotulos={rotulos}
            atalhos={atalhos}
          />
        </div>
      </Secao>

      <Secao
        titulo="Sem atalhos"
        spec="omitir `atalhos`"
        descricao="Sem a prop, a coluna da esquerda não existe e o painel encolhe para a largura das duas grades."
        codigo={codigoSimples}
        nota={
          <p>
            Não há atalho padrão embutido, e isso é proposital: &ldquo;últimos 7 dias&rdquo; é um texto, e texto dentro
            do componente é o que a regra 4 de i18n proíbe. Um componente do design system que traz atalho pronto traz
            junto uma string em português — e ela reaparece intacta na versão em espanhol.
          </p>
        }
      >
        <div className="flex min-h-[120px] items-start justify-center">
          <DateRangePicker valor={simples} onValorChange={setSimples} locale="pt-BR" rotulos={rotulos} />
        </div>
      </Secao>

      <Secao
        titulo="Com limite de data"
        spec="dataMaxima"
        descricao="Filtro de histórico não escolhe amanhã. Com dataMinima e dataMaxima os dias fora da janela ficam apagados e não recebem clique nem foco."
        codigo={codigoLimite}
        nota={
          <p>
            O dia desabilitado usa <Chip>disabled</Chip> de verdade, não só opacidade: o navegador o tira da ordem de
            tabulação e o leitor de tela o anuncia como indisponível. Os anos do seletor também se ajustam ao limite —
            não adianta esconder o dia e deixar o ano navegável.
          </p>
        }
      >
        <div className="flex min-h-[120px] items-start justify-center">
          <DateRangePicker
            valor={limitado}
            onValorChange={setLimitado}
            locale="pt-BR"
            rotulos={rotulos}
            atalhos={atalhos}
            dataMaxima={hoje}
          />
        </div>
      </Secao>

      <Secao
        titulo="Nos três idiomas"
        spec="pt-br · en · es"
        descricao="O mesmo intervalo, o mesmo componente, três locales. Abra os três: muda o nome do mês, muda a ordem da data e, no espanhol, muda a coluna em que a semana começa."
        nota={
          <p>
            Nenhum destes três recebe uma string de data. Todos recebem o mesmo <Chip>valor</Chip> — dois objetos{" "}
            <Chip>Date</Chip> — e um <Chip>locale</Chip> diferente. No CRM esse locale é o do{" "}
            <Chip>next-intl</Chip>, nunca um literal: <Chip>locale=&quot;pt-BR&quot;</Chip> escrito à mão é a mesma
            falha que formatar a data à mão, só que mais discreta.
          </p>
        }
      >
        <div className="flex min-h-[120px] flex-wrap items-start gap-6">
          {idiomas.map((i) => (
            <div key={i.locale}>
              <p className="mb-2 font-mono chrome-caption text-subtle-foreground">
                {i.nome} — {i.nota}
              </p>
              <DateRangePicker
                valor={porIdioma}
                onValorChange={setPorIdioma}
                locale={i.locale}
                rotulos={rotulos}
                atalhos={atalhos}
              />
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Regras"
        descricao="Seis maneiras conhecidas de quebrar um seletor de data. As duas primeiras só aparecem depois que alguém troca o idioma do produto."
        nota={
          <p>
            Falta uma peça: o painel flutuante ainda é deste arquivo, e não do <Chip>Popover</Chip> do design system —
            que o roadmap coloca como base comum de Select, Combobox, Dropdown e deste componente. Enquanto o{" "}
            <Chip>Popover</Chip> não existe, o posicionamento e o clique-fora vivem aqui; quando existir, saem daqui
            sem mudar a API.
          </p>
        }
      >
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
