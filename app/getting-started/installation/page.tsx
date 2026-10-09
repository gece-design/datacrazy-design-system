import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { Codigo } from "@/components/ds/codigo";
import { URL_DS } from "@/lib/site";

/* Pedidos que saem certos: dizem o tipo de tela (o Claude acha o bloco de
   referência), citam @datacrazy e pedem o check no fim. */
const pedidos = [
  "Crie a tela de contatos: lista de registros com busca, filtros, agrupar, seleção em massa e paginação, seguindo o bloco @datacrazy/leads. Termine com o ds-check em zero.",
  "Monte o dashboard de vendas (KPIs, receita no período, negócios por origem e os parados) seguindo o bloco @datacrazy/dashboard.",
  "Adicione um modal de confirmar a exclusão de uma campanha, com o Modal destrutivo do @datacrazy.",
  "Quais componentes do @datacrazy servem para formulário? Leia o Quando usar de cada um antes de responder.",
];

/* Pedidos que saem errados — e por quê. */
const pedidosRuins = [
  { pedido: "Faz uma tabela de clientes bonita", porque: "não diz o tipo de tela nem cita o DS: o Claude monta uma <table> com Tailwind solto." },
  { pedido: "Copia essa tela do print", porque: "o print é de outro sistema: sai um clone com hex e px. Peça a tela do CRM com os componentes do DS, e cite o print só como lista do que ela mostra." },
  { pedido: "Cria um componente de card novo para isso", porque: "componente novo é decisão do time de design. Peça para compor com o que existe e listar o que faltou." },
];

/* O que conferir quando a tela sai sem componente ou sem fidelidade. */
const diagnostico = [
  { sinal: "O Claude nem citou a skill nem o contrato", causa: "o CLAUDE.md da raiz não importa .claude/datacrazy-ds/CLAUDE.md, ou o Claude Code não foi reiniciado depois do setup", cura: "node scripts/ds-setup.mjs e recarregar a janela" },
  { sinal: "Sai botão, campo ou tabela crus (button, input, table) ou cor em hex", causa: "o hook do ds-check não está em .claude/settings.json: a violação não volta para o Claude", cura: "node scripts/ds-setup.mjs (liga o hook) ou node scripts/ds-check.mjs à mão" },
  { sinal: "A tela tem Sidebar e Header próprios", causa: "o bloco @datacrazy/tela não foi instalado, ou o pedido não disse que é uma tela do CRM", cura: "npx shadcn@latest add @datacrazy/tela e pedir 'uma tela do CRM'" },
  { sinal: "Tabela alta, filtros em Select, tags coloridas — 'parece o DataCrazy antigo'", causa: "o pedido não apontou o bloco de referência: o Claude inventou o layout", cura: "citar o bloco no pedido (@datacrazy/leads, /pipeline, /dashboard…)" },
  { sinal: "Os componentes estão lá, mas os tokens não (text-sm, text-gray-600, shadow-md)", causa: "o content do Tailwind não inclui ./lib/** ou o setup foi o da versão errada do Tailwind", cura: "node scripts/ds-setup.mjs --corrigir põe o ./lib/**; conferir setup × setup-v3" },
  { sinal: "A fonte está errada", causa: "a variável da Geist está no <body> (onde o create-next-app a deixa) e o DS aplica a fonte no <html>", cura: "node scripts/ds-setup.mjs --corrigir move para o <html>" },
];

// Seção só de comando: o bloco de código já é a caixa, então a caixa do preview sai.
const semMoldura = "border-0 bg-transparent";

export default function Installation() {
  return (
    <PaginaDS
      titulo="SystemCrazy"
      novidade="2026-10-08"
      descricao="O design system entra no seu projeto pelo shadcn CLI e no Claude Code por três camadas: o contrato (lido em toda sessão), a skill (a referência completa) e o check (a cada arquivo escrito). São quatro comandos, e depois é só pedir a tela."
      secoes={["Como funciona", "Registrar o catálogo", "Instalar a base", "Ligar o Claude ao DS", "Conectar o MCP", "Criar uma tela", "Pedir a tela", "Verificar", "Quando a tela sai errada", "Atualizar"]}
    >
      <ComoFunciona>
        <p>
          Este site também é um <span className="text-foreground">catálogo no formato do shadcn</span>: cada componente
          está publicado em <Chip>/r/nome.json</Chip>, com o código inteiro, as dependências e os tokens. O shadcn CLI
          baixa esse arquivo para dentro do seu projeto, e o componente vira código seu, em{" "}
          <Chip>components/ui/</Chip>, como qualquer componente shadcn.
        </p>
        <p>
          O Claude Code é guiado em <span className="text-foreground">três camadas</span>, porque uma só não bastava
          (a skill é lida quando o agente acha que precisa — e a tela saía sem componente antes disso):
        </p>
        <ul className="space-y-2">
          <li>
            <span className="text-foreground">O contrato</span> — <Chip>.claude/datacrazy-ds/CLAUDE.md</Chip>, importado
            pelo <Chip>CLAUDE.md</Chip> da raiz e lido em <strong>toda</strong> sessão: ler a skill e a memória antes de
            qualquer tela, o bloco de referência por tipo de tela, o que nunca entra, como toda tela é montada e o que
            fazer antes de dizer &quot;pronto&quot;. Junto vem a <Chip>MEMORIA.md</Chip>: o que o cliente já decidiu
            (os erros que viraram regra, o que o time gosta, densidade, celular, anti-padrões, as ADRs).
          </li>
          <li>
            <span className="text-foreground">A skill</span> — <Chip>.claude/skills/datacrazy-ds/</Chip>: a referência
            completa, com os tokens que existem, as regras, o catálogo e a doc de cada componente (props, variantes,
            estados, quando usar).
          </li>
          <li>
            <span className="text-foreground">O check</span> — <Chip>scripts/ds-check.mjs</Chip>, como hook: a cada
            arquivo que o Claude escreve, as violações voltam para ele corrigir na hora.
          </li>
        </ul>
        <p>
          Os três são gerados deste repositório — das regras, das ADRs e do código — e entram no seu projeto pelo{" "}
          <Chip>setup</Chip>. Requisito: projeto React com Tailwind e o shadcn iniciado. Se o projeto ainda não tem{" "}
          <Chip>components.json</Chip>, rode <Chip>npx shadcn@latest init</Chip> antes do primeiro passo.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Registrar o catálogo"
        spec="passo 1"
        descricao="Na raiz do projeto. Grava o endereço do catálogo no components.json com o nome @datacrazy — o nome que você usa nos comandos e nos pedidos ao Claude."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`npx shadcn@latest registry add @datacrazy=${URL_DS}/r/{name}.json`} />
        <Legenda>
          Dá no mesmo colar direto no <Chip>components.json</Chip>:
        </Legenda>
        <Codigo
          className="mt-3"
          lang="json"
          codigo={`"registries": {
  "@datacrazy": "${URL_DS}/r/{name}.json"
}`}
        />
      </Secao>

      <Secao
        titulo="Instalar a base"
        spec="passo 2"
        descricao="Traz os tokens de cor, tipografia, raio, sombra e camadas; o cn() estendido; a skill; o contrato e a memória do DS; e os dois scripts (ds-check e ds-setup). Os componentes o Claude instala conforme a tela pede — ou use @datacrazy/all para trazer todos de uma vez."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`npx shadcn@latest add @datacrazy/setup`} />
        <Legenda>
          Duas coisas que o instalador não faz por você (o passo 3 confere e aponta): o <Chip>content</Chip> do Tailwind
          precisa incluir <Chip>./lib/**/*.{"{ts,tsx}"}</Chip> (as classes de foco e rolagem moram lá), e a Geist entra
          pela variável <Chip>--font-geist-sans</Chip> declarada no <Chip>&lt;html&gt;</Chip> do layout, não no{" "}
          <Chip>&lt;body&gt;</Chip>.
        </Legenda>
        <Legenda>
          Projeto em Tailwind v3 (com <Chip>tailwind.config</Chip>)? Use <Chip>@datacrazy/setup-v3</Chip>: o formato
          das variáveis de cor muda entre as versões, e cada setup escreve o da sua.
        </Legenda>
        <Legenda>
          Se o projeto já tem um <Chip>lib/utils.ts</Chip>, aceite a troca: o <Chip>cn()</Chip> do DS ensina o
          tailwind-merge a escala tipográfica, e sem isso <Chip>text-body-md</Chip> some em silêncio quando se junta a
          uma cor de texto.
        </Legenda>
      </Secao>

      <Secao
        titulo="Ligar o Claude ao DS"
        spec="passo 3 · node scripts/ds-setup.mjs"
        descricao="Um comando, na raiz, depois do setup. Ele faz o CLAUDE.md da raiz importar o contrato (cria o arquivo se não existe; se existe, só acrescenta a linha no fim — o que é seu fica), põe o hook do ds-check em .claude/settings.json (mescla com os hooks que já estão lá) e confere o que falta. Pode rodar quantas vezes quiser."
        novidade="2026-10-08"
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`node scripts/ds-setup.mjs --corrigir`} />
        <Legenda>
          <Chip>--corrigir</Chip> também conserta as duas coisas que o instalador não faz: põe <Chip>./lib/**</Chip> no{" "}
          <Chip>content</Chip> do Tailwind e move a variável da Geist do <Chip>&lt;body&gt;</Chip> (onde o create-next-app
          a deixa) para o <Chip>&lt;html&gt;</Chip>, onde o DS aplica a fonte. Sem a flag, ele só aponta.
        </Legenda>
        <Legenda>O que ele deixa no projeto:</Legenda>
        <Codigo
          className="mt-3"
          lang="bash"
          codigo={`CLAUDE.md                          # o seu, com a linha @.claude/datacrazy-ds/CLAUDE.md no fim
.claude/datacrazy-ds/CLAUDE.md     # o contrato: lido em toda sessão
.claude/datacrazy-ds/MEMORIA.md    # o que o cliente já decidiu
.claude/settings.json              # + o hook PostToolUse do ds-check
.claude/skills/datacrazy-ds/       # a referência completa (SKILL.md + componentes/*.md)
scripts/ds-check.mjs               # o check
scripts/ds-setup.mjs               # este comando`}
        />
        <Legenda>
          Depois, <span className="text-foreground">reinicie o Claude Code</span> (no VS Code, recarregue a janela):
          o CLAUDE.md é lido ao abrir a sessão. Para conferir, pergunte &quot;qual é o contrato do DS neste
          projeto?&quot; — a resposta deve citar o bloco de referência por tipo de tela e o ds-check.
        </Legenda>
        <Legenda>
          A memória do Claude Code em si (a de <Chip>~/.claude/</Chip>) é de cada pessoa e de cada máquina — não se
          instala. A <Chip>MEMORIA.md</Chip> faz o papel dela para o time inteiro: entra no repositório, vale para
          todo mundo e muda quando o DS muda.
        </Legenda>
      </Secao>

      <Secao
        titulo="Conectar o MCP"
        spec="passo 4"
        descricao="Cria o .mcp.json do projeto com o servidor do shadcn: por ele o Claude lista, lê e instala os componentes do catálogo sozinho. Depois, reinicie o Claude Code e rode /mcp — o shadcn deve aparecer conectado."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`npx shadcn@latest mcp init --client claude`} />
      </Secao>

      <Secao
        titulo="Criar uma tela"
        spec="passo 5"
        descricao="Toda tela nova começa pela tela base: um comando cria a página com Sidebar, Header e conteúdo já ligados e responsivos. E toda tela do CRM tem um bloco de referência — a tela inteira, feita pelo time do DS — para o Claude copiar o padrão em vez de inventar. O contrato traz a tabela; o Claude instala o bloco sozinho quando o pedido diz o tipo de tela."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`npx shadcn@latest add @datacrazy/tela`} />
        <Codigo
          className="mt-3"
          lang="bash"
          codigo={`npx shadcn@latest add @datacrazy/leads        # lista de registros: contatos, leads, empresas, produtos
npx shadcn@latest add @datacrazy/pipeline     # funil: quadro, lista, calendário, o lead no drawer
npx shadcn@latest add @datacrazy/atendimento  # chat: conversas, mensagens, o lead ao lado
npx shadcn@latest add @datacrazy/automacoes   # fluxo: o canvas, o bloco no painel lateral
npx shadcn@latest add @datacrazy/dashboard    # painel: KPIs, gráfico, parados, ranking
npx shadcn@latest add @datacrazy/agentes      # catálogo em cartões com cadastros ao lado`}
        />
        <Legenda>
          A casca é a <Chip>TelaBase</Chip>: acima de 1280px a sidebar aberta, entre 1024 e 1279 recolhida em ícones,
          abaixo de 1024 vira um menu por cima com o botão no Header. Veja a tela em branco em{" "}
          <Chip>/exemplos/tela-base</Chip> e as de referência no <Chip>/prototipo</Chip>.
        </Legenda>
      </Secao>

      <Secao
        titulo="Pedir a tela"
        spec="passo 6 · tipo de tela + @datacrazy + o check"
        descricao="Peça em linguagem normal, mas diga três coisas: que tipo de tela é (o Claude acha o bloco de referência), que é com o @datacrazy, e que termine com o ds-check em zero. O contrato faz o resto: ler a skill e a memória, instalar o que falta, montar só com tokens."
        novidade="2026-10-08"
      >
        <ul className="space-y-3">
          {pedidos.map((p) => (
            <li key={p} className="flex gap-3 chrome-prose text-foreground">
              <span aria-hidden="true" className="font-mono text-subtle-foreground">
                &gt;
              </span>
              {p}
            </li>
          ))}
        </ul>
        <Legenda>Pedidos que saem errados, e por quê:</Legenda>
        <ul className="mt-3 space-y-3">
          {pedidosRuins.map((p) => (
            <li key={p.pedido} className="flex flex-col gap-1 chrome-prose">
              <span className="text-foreground line-through decoration-muted-foreground">&gt; {p.pedido}</span>
              <span className="text-muted-foreground">{p.porque}</span>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao
        titulo="Verificar"
        spec="passo 7"
        descricao="A base instala scripts/ds-check.mjs: as mesmas regras que guardam o design system, no seu projeto. Ele aponta valor fora dos tokens, paleta e tipografia do Tailwind, <input> e <table> crus, ícone de outra biblioteca e página sem TelaBase. O passo 3 liga o hook: a cada arquivo que o Claude escreve, o check roda e devolve as violações para ele corrigir na hora. Zero violação é o critério de pronto do contrato."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`node scripts/ds-check.mjs`} />
        <Legenda>
          O hook que o <Chip>ds-setup</Chip> põe em <Chip>.claude/settings.json</Chip>, se quiser conferir ou ligar à
          mão:
        </Legenda>
        <Codigo
          className="mt-3"
          lang="json"
          codigo={`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{ "type": "command", "command": "node scripts/ds-check.mjs --hook" }]
      }
    ]
  }
}`}
        />
      </Secao>

      <Secao
        titulo="Quando a tela sai errada"
        spec="o sinal, a causa, a cura"
        descricao="Tela sem componente ou sem fidelidade quase sempre é uma das seis abaixo. Confira na ordem."
        novidade="2026-10-08"
        semCaixa
      >
        <div className="divide-y divide-border rounded-lg border border-border">
          {diagnostico.map((d) => (
            <div key={d.sinal} className="grid gap-1 p-4 sm:grid-cols-[220px_1fr] sm:gap-4">
              <p className="text-h4 text-foreground">{d.sinal}</p>
              <div className="flex flex-col gap-1">
                <p className="text-body-lg text-muted-foreground">
                  <span className="text-foreground">Causa:</span> {d.causa}.
                </p>
                <p className="text-body-lg text-muted-foreground">
                  <span className="text-foreground">Cura:</span> {d.cura}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Atualizar"
        spec="--overwrite"
        descricao="Componente instalado é código seu e não muda sozinho. Quando o DS mudar, rode o add de novo nos itens que quiser trazer e confira o diff antes de commitar. O setup atualiza a skill, o contrato e a memória de uma vez."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`npx shadcn@latest add @datacrazy/setup @datacrazy/button --overwrite`} />
        <Legenda>
          Catálogo completo, sem o código: <Chip>{`${URL_DS}/r/registry.json`}</Chip>. Resumo para IA:{" "}
          <Chip>{`${URL_DS}/llms.txt`}</Chip>.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
