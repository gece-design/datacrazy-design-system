import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

// As amostras usam classe de token literal (`bg-primary`), nunca classe montada
// em runtime nem `style` com `hsl(var(--x))`: o Tailwind varre o código como
// texto, então classe concatenada não é gerada e a amostra sai transparente.

type Semantico = {
  token: string;
  amostra: string;
  claro: string;
  escuro: string;
};

const semanticos: Semantico[] = [
  { token: "background",         amostra: "bg-background",         claro: "#F4F5F6",       escuro: "#1C1C25" },
  { token: "foreground",         amostra: "bg-foreground",         claro: "#1C1C25",       escuro: "#F4F5F6" },
  { token: "card",               amostra: "bg-card",               claro: "#FFFFFF",       escuro: "#1E1E24" },
  { token: "muted-foreground",   amostra: "bg-muted-foreground",   claro: "#6A7581",       escuro: "#A0A8B1" },
  { token: "subtle-foreground",  amostra: "bg-subtle-foreground",  claro: "#A0A8B1",       escuro: "#6A7581" },
  { token: "border",             amostra: "bg-border",             claro: "#E1E7EF",       escuro: "#2E2E38" },
  { token: "accent",             amostra: "bg-accent",             claro: "#E8F1FF",       escuro: "#232C3D" },
  { token: "surface-inverse",    amostra: "bg-surface-inverse",    claro: "#232C3D",       escuro: "#F4F5F6" },
  { token: "primary",            amostra: "bg-primary",            claro: "base/blue/500", escuro: "base/blue/400" },
  { token: "primary-hover",      amostra: "bg-primary-hover",      claro: "base/blue/600", escuro: "base/blue/300" },
  { token: "primary-foreground", amostra: "bg-primary-foreground", claro: "#FFFFFF",       escuro: "#FFFFFF" },
  { token: "ring",               amostra: "bg-ring",               claro: "→ primary",     escuro: "→ primary" },
];

type Estado = {
  token: string;
  padrao: string;
  hover: string;
  amostra: string;
  amostraHover: string;
};

const estados: Estado[] = [
  { token: "success",     padrao: "#267952", hover: "#294F3D", amostra: "bg-success",     amostraHover: "bg-success-hover" },
  { token: "warning",     padrao: "#975E1D", hover: "#5E4221", amostra: "bg-warning",     amostraHover: "bg-warning-hover" },
  { token: "destructive", padrao: "#C6323C", hover: "#753237", amostra: "bg-destructive", amostraHover: "bg-destructive-hover" },
  { token: "info",        padrao: "#25719D", hover: "#274B60", amostra: "bg-info",        amostraHover: "bg-info-hover" },
];

const rampa = [
  { grau: "50",  hex: "#F0F6FF", amostra: "bg-base-blue-50" },
  { grau: "100", hex: "#E0EDFF", amostra: "bg-base-blue-100" },
  { grau: "200", hex: "#ADCEFF", amostra: "bg-base-blue-200" },
  { grau: "300", hex: "#80B3FF", amostra: "bg-base-blue-300" },
  { grau: "400", hex: "#599CFF", amostra: "bg-base-blue-400" },
  { grau: "500", hex: "#3385FF", amostra: "bg-base-blue-500" },
  { grau: "600", hex: "#1266E2", amostra: "bg-base-blue-600" },
  { grau: "700", hex: "#114797", amostra: "bg-base-blue-700" },
];

type Pendencia = { titulo: string; porque: string };

const pendencias: Pendencia[] = [
  {
    titulo: "Estados sem versão escura",
    porque:
      "success, warning, destructive e info repetem o mesmo valor nos dois modos — contraste ruim no Escuro. E os -hover deles são escuros e dessaturados: leem como variante de tema, não como hover.",
  },
  {
    titulo: "Rampa neutra incompleta",
    porque:
      "Só existe base/neutral/900. Falta a escala intermediária para superfícies e traços, que hoje só existem como semântico solto.",
  },
  {
    titulo: "Valores soltos no design",
    porque:
      "#09090B aparece 1.764 vezes e #71717A outras 1.538, nenhum ligado a variável. Não acompanham o tema, e religar muda a cor levemente — precisa de decisão, não de conserto silencioso.",
  },
  {
    titulo: "Gráficos com gradiente solto",
    porque:
      "Barras e rosca clareiam até quase branco. No tema Escuro isso some. É o único item da lista que não tem token candidato ainda.",
  },
];

function Valor({ modo, valor }: { modo: string; valor: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-subtle-foreground">{modo}</span>
      <span className="truncate text-muted-foreground" title={valor}>
        {valor}
      </span>
    </div>
  );
}

export default function Cor() {
  return (
    <PaginaDS
      titulo="Color"
      descricao="Doze tokens semânticos em dois modos, oito de estado que ainda repetem valor entre Claro e Escuro e nove primitivos. Nenhum nome foi escolhido por convenção: todos saíram de uma varredura de 84.775 nós do Figma, contando binding por tipo de nó."
      secoes={["Como funciona", "Semânticos", "Estados", "Primitivos", "Em aberto"]}
    >
      <ComoFunciona>
        <p>
          Até a reestruturação de 2026-09-01, a coleção <Chip>Cor</Chip> do Figma tinha um modo só, chamado{" "}
          <Chip>Mode 1</Chip>. Dois temas não eram uma tarefa pendente de design:{" "}
          <span className="text-foreground">eram impossíveis por construção</span> — não havia onde guardar o segundo
          valor. O primeiro passo foi renomear <Chip>Mode 1</Chip> para <Chip>Claro</Chip> e criar <Chip>Escuro</Chip>.
          Todo o resto depende dessa coluna existir.
        </p>
        <p>
          O segundo problema eram os nomes, que descreviam o valor em vez do papel. A variável mais usada do arquivo se
          chamava <Chip>Surface escura</Chip> e, contando binding por tipo de nó nos 84.775 nós, aparecia em 1.285
          preenchimentos de texto e 1.064 de ícone: era a{" "}
          <span className="text-foreground">cor de texto</span>, não uma superfície. Hoje ela é <Chip>foreground</Chip>.
          Nome que descreve o valor morre no segundo tema — <Chip>Surface escura</Chip> com valor claro no modo Escuro é
          uma linha que ninguém consegue ler.
        </p>
        <p>
          O tema escuro inteiro saiu de valores que <span className="text-foreground">já existiam no arquivo</span>,
          presos em variáveis com o nome errado. O <Chip>background</Chip> do Escuro é o valor que estava em{" "}
          <Chip>Surface escura</Chip>; o <Chip>foreground</Chip> do Escuro é o que estava em <Chip>Gelo</Chip>; o{" "}
          <Chip>accent</Chip> do Escuro estava em <Chip>Surface elevada</Chip>. Um único valor foi inventado —{" "}
          <Chip>border</Chip> no Escuro, derivado um passo acima do <Chip>card</Chip>. Os nomes eram o problema, não a
          paleta.
        </p>
        <p>
          A armadilha está na <span className="text-foreground">direção do alias</span>. <Chip>Primary 500</Chip> era
          alias de <Chip>Primary</Chip>: o primitivo apontava para o semântico, invertido. Enquanto foi assim, dar valor
          escuro ao <Chip>primary</Chip> arrastava a escala azul inteira junto, e a mudança reaparecia em telas que
          ninguém tinha tocado. Hoje <Chip>base/blue/500</Chip> guarda o literal e <Chip>primary</Chip> referencia ele. O
          corolário vale no consumo: primitivo não muda com o tema, então componente ligado a{" "}
          <Chip>base/blue/100</Chip> fica congelado — foi o que deixou a pílula do item selecionado da sidebar branca no
          Escuro, e o conserto teve de ser no componente-mãe, não na instância.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Semânticos"
        spec="12 tokens · 2 modos"
        descricao="É o que o componente usa. A amostra segue o tema em que você está lendo; os dois valores estão abaixo dela."
        nota={
          <div className="space-y-2">
            <p>
              O papel de cada um: <Chip>background</Chip> é o fundo da página e <Chip>card</Chip> a superfície de card e
              painel; <Chip>foreground</Chip> pinta texto e ícone principal, <Chip>muted-foreground</Chip> o texto
              secundário e <Chip>subtle-foreground</Chip> o terciário e o placeholder; <Chip>border</Chip> é o traço
              padrão; <Chip>accent</Chip> a superfície sutil da marca e <Chip>surface-inverse</Chip> o bloco escuro sobre
              fundo claro; <Chip>primary</Chip> é a ação e a marca aplicada, <Chip>primary-hover</Chip> a ação em hover,{" "}
              <Chip>primary-foreground</Chip> o texto sobre ela e <Chip>ring</Chip> o anel de foco.
            </p>
            <p>
              Nove vieram de nomes que descreviam o valor: Gelo, Surface escura, Branco, Color 2, Color, Neve, Surface
              elevada, Primary e Primary hover viraram, na ordem, <Chip>background</Chip>, <Chip>foreground</Chip>,{" "}
              <Chip>card</Chip>, <Chip>muted-foreground</Chip>, <Chip>subtle-foreground</Chip>, <Chip>accent</Chip>,{" "}
              <Chip>surface-inverse</Chip>, <Chip>primary</Chip> e <Chip>primary-hover</Chip>. <Chip>border</Chip>,{" "}
              <Chip>primary-foreground</Chip> e <Chip>ring</Chip> foram criados agora.
            </p>
            <p>
              O CSS ainda expõe <Chip>card-foreground</Chip>, <Chip>accent-foreground</Chip> e{" "}
              <Chip>surface-inverse-foreground</Chip>, que espelham o par de cada superfície. Nenhum token carrega nome
              de cor: é o que permite os dois temas sem ramificar componente.
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {semanticos.map((t) => (
            <div key={t.token} className="rounded-md border border-border p-3">
              <div className={`h-12 rounded-sm border border-border ${t.amostra}`} />
              <p className="mt-3 truncate font-mono text-body-md text-foreground" title={t.token}>
                {t.token}
              </p>
              <div className="mt-2.5 space-y-1 border-t border-border pt-2.5 font-mono text-caption">
                <Valor modo="Claro" valor={t.claro} />
                <Valor modo="Escuro" valor={t.escuro} />
              </div>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Estados"
        spec="4 pares · default e hover"
        descricao="Semântica de resultado, não de marca. Entram em borda, ícone e tag — nunca preenchendo o corpo do card."
        nota={
          <div className="space-y-2">
            <p>
              <Chip>success</Chip> confirma e marca o negócio ganho; <Chip>warning</Chip> alerta sem bloquear a ação;{" "}
              <Chip>destructive</Chip> cobre a ação irreversível e o negócio perdido; <Chip>info</Chip> é o aviso neutro,
              sem carga de resultado.
            </p>
            <p>
              Estes oito repetem valor entre Claro e Escuro, e isso viola a regra E4 — que existe porque o ticket #80174
              encontrou 13 de ~30 variáveis repetidas. São o resto do bug, e estão na lista de pendências abaixo.
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {estados.map((e) => (
            <div key={e.token} className="space-y-2 rounded-md border border-border p-3">
              {[
                { nome: e.token, hex: e.padrao, amostra: e.amostra },
                { nome: `${e.token}-hover`, hex: e.hover, amostra: e.amostraHover },
              ].map((linha) => (
                <div key={linha.nome} className="flex items-center gap-2.5">
                  <div className={`h-8 w-8 shrink-0 rounded-sm border border-border ${linha.amostra}`} />
                  <p className="min-w-0 flex-1 truncate font-mono text-body-md text-foreground" title={linha.nome}>
                    {linha.nome}
                  </p>
                  <p className="shrink-0 font-mono text-caption text-subtle-foreground">{linha.hex}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Primitivos"
        spec="base/blue/50 → 700"
        descricao="Mesmo valor nos dois modos. Não use direto em componente: primitivo não acompanha o tema."
        nota={
          <div className="space-y-2">
            <p>
              Quem referencia quem: <Chip>primary</Chip> é <Chip>base/blue/500</Chip> no Claro e{" "}
              <Chip>base/blue/400</Chip> no Escuro; <Chip>primary-hover</Chip> é <Chip>base/blue/600</Chip> no Claro e{" "}
              <Chip>base/blue/300</Chip> no Escuro. O par anda para baixo na rampa no Claro e para cima no Escuro.
            </p>
            <p>
              <Chip>base/neutral/900</Chip> é o único neutro da coleção, e é exatamente o valor do <Chip>card</Chip> no
              Escuro — a rampa neutra que faltaria em volta dele é a pendência 2.
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-4 overflow-hidden rounded-md border border-border sm:flex">
          {rampa.map((c) => (
            <div key={c.grau} className="min-w-0 flex-1">
              <div className={`h-16 ${c.amostra}`} />
              <div className="border-t border-border py-2 text-center">
                <p className="font-mono text-body-sm text-foreground">{c.grau}</p>
                <p className="font-mono text-caption text-subtle-foreground">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2.5 rounded-md border border-border p-3">
          <div className="h-8 w-8 shrink-0 rounded-sm border border-border bg-base-neutral-900" />
          <p className="min-w-0 flex-1 truncate font-mono text-body-md text-foreground">base/neutral/900</p>
          <p className="shrink-0 font-mono text-caption text-subtle-foreground">#1E1E24</p>
        </div>
      </Secao>

      <Secao
        titulo="Em aberto"
        spec="4 pendências"
        descricao="O que a reestruturação não fechou. Está aqui porque token com pendência escondida vira decisão de quem for usar."
        // não há componente a demonstrar aqui: são quatro decisões em aberto.
        // Texto dentro de caixa de preview viraria anotação — a caixa sai.
        semCaixa
        className="border-0 bg-transparent"
      >
        <div className="divide-y divide-border">
          {pendencias.map((p, i) => (
            <div key={p.titulo} className="flex gap-5 py-5 first:pt-0 last:pb-0">
              <span className="shrink-0 font-mono text-body-md text-subtle-foreground">{i + 1}</span>
              <div className="min-w-0">
                <p className="text-h4 text-foreground">{p.titulo}</p>
                <p className="mt-1 text-body-lg text-muted-foreground">{p.porque}</p>
              </div>
            </div>
          ))}
        </div>
      </Secao>
    </PaginaDS>
  );
}
