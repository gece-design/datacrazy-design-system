import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

type Comando = { cmd: string; nota: string };

const comandos: Comando[] = [
  { cmd: "npm install", nota: "o package-lock está versionado" },
  { cmd: "npm run dev", nota: "http://localhost:4321" },
  { cmd: "npm run typecheck", nota: "tsc --noEmit, TypeScript strict" },
  { cmd: "npm run build", nota: "build de produção, antes do PR" },
];

const passos: { titulo: string; corpo: React.ReactNode }[] = [
  {
    titulo: "Copie o arquivo de components/ui/",
    corpo: (
      <>
        Vai inteiro, sem edição. Componente do DS não conhece domínio (regra 8):{" "}
        <Chip>{"<Button>"}</Chip> não sabe o que é lead, então nada dentro dele depende do CRM. Hoje
        são três prontos — <Chip>button.tsx</Chip>, <Chip>badge.tsx</Chip> e <Chip>card.tsx</Chip>.
      </>
    ),
  },
  {
    titulo: "Leve lib/utils.ts junto",
    corpo: (
      <>
        Se o CRM já tem um <Chip>cn()</Chip>, não substitua: acrescente o bloco{" "}
        <Chip>extend.classGroups</Chip> ao que já existe lá. Este é o passo que não é opcional — é a
        armadilha descrita acima, e ela não avisa quando acontece.
      </>
    ),
  },
  {
    titulo: "Confira os tokens de cor",
    corpo: (
      <>
        As 23 variáveis semânticas precisam existir no <Chip>globals.css</Chip> do CRM com o mesmo
        nome. O que faltar, crie lá — nunca troque <Chip>bg-card</Chip> por um valor solto para
        resolver agora. E não copie o arquivo inteiro: o bloco <Chip>.chrome-*</Chip> do fim é a
        moldura deste site, com hex literal, e não é superfície do produto (regra D3).
      </>
    ),
  },
  {
    titulo: "Espelhe a escala tipográfica",
    corpo: (
      <>
        <Chip>text-body-md</Chip> não é classe do Tailwind: é o bloco <Chip>fontSize</Chip> do nosso{" "}
        <Chip>tailwind.config.ts</Chip>. Sem ele a classe nem chega a existir no CSS gerado, e o
        texto herda o tamanho de quem estiver por perto.
      </>
    ),
  },
  {
    titulo: "Meça antes de dar por pronto",
    corpo: (
      <>
        Pronto é diff ≤ 1% contra o Figma (regra 11) e tamanho computado conferido — não “parece
        certo”. A regra D4 existe porque a geometria pode bater enquanto tipografia, peso, raio e cor
        divergem: foi exatamente o caso na auditoria da sidebar.
      </>
    ),
  },
];

const espelho: { arquivo: string; guarda: string }[] = [
  {
    arquivo: "app/globals.css",
    guarda: "32 variáveis CSS em HSL — 23 semânticas, redefinidas inteiras em .dark, e 9 primitivas, iguais nos dois modos.",
  },
  {
    arquivo: "tailwind.config.ts",
    guarda: "As classes: cor, os 15 papéis text-*, a escala de camadas z-* e o raio. É o que transforma variável em utilitário.",
  },
  {
    arquivo: "lib/utils.ts",
    guarda: "Os mesmos 15 nomes declarados como font-size para o tailwind-merge, mais 12 cores de texto. Espelho do config, não decoração.",
  },
];

function Terminal({ linhas }: { linhas: Comando[] }) {
  return (
    <div className="space-y-2.5 font-mono text-body-md">
      {linhas.map((l) => (
        <div key={l.cmd} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
          <p className="w-48 shrink-0 text-foreground">
            <span className="text-subtle-foreground" aria-hidden="true">
              ${" "}
            </span>
            {l.cmd}
          </p>
          <p className="text-muted-foreground">{l.nota}</p>
        </div>
      ))}
    </div>
  );
}

export default function Installation() {
  return (
    <PaginaDS
      titulo="Installation"
      descricao="Não existe pacote a instalar: o componente chega ao CRM como código copiado — o arquivo, mais lib/utils.ts, mais 32 variáveis de cor e 15 papéis tipográficos. Cinco dependências de runtime, quatro delas do padrão shadcn. Este site sobe em duas linhas, na porta 4321."
      secoes={["Como funciona", "Rodar localmente", "Levar um componente para o CRM", "Atualizar os tokens"]}
    >
      <ComoFunciona>
        <p>
          Não existe <Chip>npm i @datacrazy/ui</Chip>. O componente entra no CRM como{" "}
          <span className="text-foreground">arquivo copiado</span>, no padrão shadcn/ui — decisão
          registrada em <Chip>docs/01-arquitetura.md</Chip>. A escolha não foi de gosto: o{" "}
          <Chip>globals.css</Chip> do CRM já declara variáveis em HSL nesse mesmo formato, então a
          adoção é colar, não migrar. E como o código passa a ser do time, a variante que o produto
          precisa não espera release de biblioteca nenhuma.
        </p>
        <p>
          O preço é que{" "}
          <span className="text-foreground">não existe atualização automática</span>: ninguém sobe
          versão e recebe o conserto de graça — quem quer a correção copia de novo. Em troca, nada
          quebra sozinho num deploy alheio, e é o único modelo compatível com a regra 14, que proíbe
          big-bang num produto já rodando em 500+ empresas. O DS é “algumas pinceladas” (A9), não um
          layout novo. Este site é a referência; quando o CRM divergir, o diff é humano.
        </p>
        <p>
          Um componente carrega menos do que parece: <Chip>class-variance-authority</Chip> para as
          variantes, <Chip>clsx</Chip> e <Chip>tailwind-merge</Chip> dentro do <Chip>cn()</Chip>,{" "}
          <Chip>@radix-ui/react-slot</Chip> para o <Chip>asChild</Chip> — quatro, as mesmas do padrão
          shadcn. A quinta é <Chip>@phosphor-icons/react</Chip>, e ela só entra quando o componente
          leva ícone: nenhum dos três de hoje leva. Phosphor está no lugar do Lucide por decisão do
          humano, com um peso só na interface inteira (regra A8). O resto não é dependência, é token
          — as 32 variáveis do <Chip>globals.css</Chip> e as classes do{" "}
          <Chip>tailwind.config.ts</Chip>. Num projeto sem essa camada o componente não fica feio, e
          sim <span className="text-foreground">sem cor</span>: a classe nunca é gerada.
        </p>
        <p>
          E a armadilha que custou uma tarde aqui: <Chip>lib/utils.ts</Chip> não é um{" "}
          <Chip>cn()</Chip> genérico. Ele estende o <Chip>tailwind-merge</Chip> com a escala
          tipográfica inteira. Sem esse arquivo, <Chip>text-body-md</Chip> e{" "}
          <Chip>text-muted-foreground</Chip> caem no mesmo grupo, o merge{" "}
          <span className="text-foreground">descarta o tamanho em silêncio</span> e o componente
          volta aos 16px do navegador. Aconteceu no item da sidebar: renderizava 16/24 no lugar de
          12/17 e não parecia errado a olho — só apareceu lendo o <Chip>getComputedStyle</Chip> com
          Playwright. Está registrado como regra D1 em <Chip>docs/processo/calibration.md</Chip>. Copiar o
          componente sem esse arquivo é copiar o bug junto.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Rodar localmente"
        spec="porta 4321"
        descricao="Next 15 e React 19; Node 18.18+ é o piso do Next. Não há passo de build de token: os arquivos já estão espelhados no repo."
      >
        <p className="mb-5 chrome-meta text-subtle-foreground">
          Node 18.18+ · npm · nenhuma variável de ambiente
        </p>
        <Terminal linhas={comandos} />
        <Legenda>
          Os scripts de medição vivem em <Chip>scripts/</Chip>: <Chip>medir.mjs</Chip> lê o estilo
          computado do elemento e <Chip>shot.mjs</Chip> tira o print nos dois temas, com checagem
          anti-fallback de fonte. Playwright é devDependency — não vai junto para o CRM.
        </Legenda>
      </Secao>

      <Secao
        titulo="Levar um componente para o CRM"
        spec="5 passos"
        descricao="Nesta ordem. Os passos 2 e 4 são os que quebram calados quando pulados."
      >
        <ol className="divide-y divide-border">
          {passos.map((p, i) => (
            <li key={p.titulo} className="flex gap-4 py-5 first:pt-0 last:pb-0">
              <span className="shrink-0 font-mono chrome-label text-subtle-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="chrome-h3 text-foreground">{p.titulo}</p>
                <p className="mt-1.5 chrome-prose text-muted-foreground">{p.corpo}</p>
              </div>
            </li>
          ))}
        </ol>
        <Legenda>
          Pendência conhecida: a versão do Tailwind do CRM ainda não foi confirmada — depende do
          acesso ao repo (bloqueio B1). v3 e v4 declaram token de formas diferentes; se o CRM estiver
          em v4, os passos 3 e 4 mudam de forma, não de conteúdo. Este repo é v3 porque é o formato
          que a auditoria descreveu — variável em HSL mais <Chip>tailwind.config.ts</Chip>, estilo
          shadcn. A versão em si ela não mediu.
        </Legenda>
      </Secao>

      <Secao
        titulo="Atualizar os tokens"
        spec="Figma → 3 arquivos"
        descricao="O Figma é a origem; aqui é espelho. Mudou variável na coleção Cor ou Tipografia, reexporta — nunca o contrário."
      >
        <div className="divide-y divide-border">
          {espelho.map((e) => (
            <div
              key={e.arquivo}
              className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <p className="w-44 shrink-0 font-mono chrome-meta text-foreground">{e.arquivo}</p>
              <p className="chrome-prose text-muted-foreground">{e.guarda}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 chrome-prose text-muted-foreground">
          Duas regras de conversão valem em toda reexportação: entrelinha vem em px e vira px
          literal, nunca o <Chip>leading-*</Chip> nomeado, que arredonda; tracking vem em px e vira{" "}
          <Chip>em</Chip>, dividido pelo tamanho da fonte. E uma checagem obrigatória:{" "}
          <span className="text-foreground">
            nenhuma variável pode repetir valor entre claro e escuro
          </span>{" "}
          sem intenção declarada por escrito (regra E4). É literalmente o bug #80174, onde 13 de ~30
          variáveis do CRM repetiam e o <Chip>--title</Chip> ficava quase invisível no tema escuro.
        </p>

        <Legenda>
          Papel tipográfico novo entra em três lugares — <Chip>tailwind.config.ts</Chip>,{" "}
          <Chip>lib/utils.ts</Chip> e a página Typography. Esquecer o do meio é a armadilha do topo
          outra vez. E aqui a checagem também acusa: nove das 23 semânticas repetem valor entre os
          modos. Oito são os estados — <Chip>success</Chip>, <Chip>warning</Chip>,{" "}
          <Chip>destructive</Chip>, <Chip>info</Chip> e os quatro <Chip>-hover</Chip> deles —,
          pendência registrada em <Chip>docs/02-design-system.md</Chip>. A nona é{" "}
          <Chip>primary-foreground</Chip>: branco nos dois modos, de propósito.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
