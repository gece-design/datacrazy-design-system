import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { Codigo } from "@/components/ds/codigo";
import { URL_DS } from "@/lib/site";

const pedidos = [
  "Crie a página de contatos com tabela, filtros e paginação usando os componentes do @datacrazy.",
  "Monte um modal para confirmar a exclusão de uma campanha, seguindo o design system.",
  "Quais componentes do @datacrazy servem para formulário?",
];

// Seção só de comando: o bloco de código já é a caixa, então a caixa do preview sai.
const semMoldura = "border-0 bg-transparent";

export default function Installation() {
  return (
    <PaginaDS
      titulo="SystemCrazy"
      descricao="O design system entra no seu projeto pelo shadcn CLI e no Claude Code por MCP. São três comandos — registrar o catálogo, instalar a base e conectar o Claude — e depois é só pedir a tela."
      secoes={["Como funciona", "Registrar o catálogo", "Instalar a base", "Conectar o Claude Code", "Criar uma tela", "Pedir a tela", "Verificar", "Atualizar"]}
    >
      <ComoFunciona>
        <p>
          Este site também é um <span className="text-foreground">catálogo no formato do shadcn</span>: cada componente
          está publicado em <Chip>/r/nome.json</Chip>, com o código inteiro, as dependências e os tokens. O shadcn CLI
          baixa esse arquivo para dentro do seu projeto, e o componente vira código seu, em{" "}
          <Chip>components/ui/</Chip>, como qualquer componente shadcn.
        </p>
        <p>
          O mesmo catálogo alimenta o <span className="text-foreground">MCP do shadcn</span> — a ponte entre o Claude e
          o catálogo. Com ele, o Claude Code lista, lê e instala os componentes do DataCrazy sozinho. E a base instala
          a skill <Chip>datacrazy-ds</Chip> em <Chip>.claude/skills/</Chip>, com os tokens que existem, a referência de
          cada componente e o que é proibido. É ela que faz o Claude compor com o DS em vez de inventar estilo.
        </p>
        <p>
          Requisito: projeto React com Tailwind e o shadcn iniciado. Se o projeto ainda não tem{" "}
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
        descricao="Traz os tokens de cor, tipografia, raio, sombra e camadas; o cn() estendido; e a skill com as regras para o Claude. Os componentes o Claude instala conforme a tela pede — ou use @datacrazy/all para trazer todos de uma vez."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`npx shadcn@latest add @datacrazy/setup`} />
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
        titulo="Conectar o Claude Code"
        spec="passo 3"
        descricao="Cria o .mcp.json do projeto com o servidor do shadcn. Depois, reinicie o Claude Code — no VS Code, recarregue a janela — e rode /mcp: o shadcn deve aparecer conectado."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`npx shadcn@latest mcp init --client claude`} />
      </Secao>

      <Secao
        titulo="Criar uma tela"
        spec="passo 4"
        descricao="Toda tela nova começa pela tela base: um comando cria a página com Sidebar, Header e conteúdo já ligados e responsivos. Renomeie a pasta app/nova-tela e preencha os encaixes. O Claude sabe disso pela skill — não precisa pedir."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`npx shadcn@latest add @datacrazy/tela`} />
        <Legenda>
          Tela de lista, quadro ou registro aberto? <Chip>@datacrazy/pipeline</Chip> traz o funil inteiro (quadro, lista,
          calendário e o lead no drawer) em <Chip>app/pipeline</Chip>: é a tela de referência para copiar o padrão, com os
          dados de exemplo em <Chip>dados.ts</Chip>.
        </Legenda>
        <Codigo className="mt-3" lang="bash" codigo={`npx shadcn@latest add @datacrazy/pipeline`} />
        <Legenda>
          A casca é a <Chip>TelaBase</Chip>: acima de 1280px a sidebar aberta, entre 1024 e 1279 recolhida em ícones,
          abaixo de 1024 vira um menu por cima com o botão no Header. Veja a tela em branco em{" "}
          <Chip>/exemplos/tela-base</Chip>.
        </Legenda>
      </Secao>

      <Secao
        titulo="Pedir a tela"
        spec="passo 5"
        descricao="Peça em linguagem normal e cite @datacrazy. O Claude procura no catálogo, lê a referência do componente na skill, instala o que falta e monta a tela só com tokens do DS."
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
      </Secao>

      <Secao
        titulo="Verificar"
        spec="passo 6"
        descricao="A base instala scripts/ds-check.mjs: as mesmas regras que guardam o design system, no seu projeto. Ele aponta valor fora dos tokens, paleta e tipografia do Tailwind, <input> e <table> crus, ícone de outra biblioteca e página sem TelaBase. A skill manda o Claude rodar antes de dar a tela por pronta."
        semCaixa
        semSeletorDeFundo
        className={semMoldura}
      >
        <Codigo lang="bash" codigo={`node scripts/ds-check.mjs`} />
        <Legenda>
          Para o Claude corrigir sozinho a cada arquivo que escreve, ligue o hook em <Chip>.claude/settings.json</Chip> do
          projeto: a cada Write ou Edit o check roda no arquivo e devolve as violações ao Claude.
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
        titulo="Atualizar"
        spec="--overwrite"
        descricao="Componente instalado é código seu e não muda sozinho. Quando o DS mudar, rode o add de novo nos itens que quiser trazer e confira o diff antes de commitar."
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
