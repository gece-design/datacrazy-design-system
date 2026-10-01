"use client";

import * as React from "react";
import { SeletorDeTom, Tag, TagAdicionar, TONS, type Tom } from "@/components/ui/tag";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";
import { TagsDoLead } from "@/app/feedback/drawer/drawer-lead";
import { FileiraDeTags, PRODUTOS, ROTULOS_PRODUTOS, RESPONSAVEIS, ROTULOS_RESPONSAVEIS, ORIGEM, ROTULOS_ORIGEM } from "./cenarios";

/** Como cada tom se chama na tela. No CRM, o nome vem do next-intl. */
const NOME_DO_TOM: Record<Tom, string> = {
  azul: "Azul",
  indigo: "Índigo",
  roxo: "Roxo",
  fucsia: "Fúcsia",
  rosa: "Rosa",
  vermelho: "Vermelho",
  laranja: "Laranja",
  ambar: "Âmbar",
  amarelo: "Amarelo",
  lima: "Lima",
  verde: "Verde",
  turquesa: "Turquesa",
  ciano: "Ciano",
  marrom: "Marrom",
};

/** O seletor de cor num formulário: a amostra escolhida pinta a prévia ao lado. */
function DemoSeletorDeTom() {
  const [tom, setTom] = React.useState<Tom | null>("azul");
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-3 rounded-md bg-card p-4">
      <SeletorDeTom tamanho="md" comNeutro rotulo="Cor da tag" nomes={{ ...NOME_DO_TOM, neutro: "Cinza" }} valor={tom} aoEscolher={setTom} />
      <div className="flex items-center gap-2 text-caption text-muted-foreground">
        Como fica:
        <Tag tom={tom ?? undefined} status={tom ? "info" : undefined}>
          Cliente VIP
        </Tag>
      </div>
    </div>
  );
}

export default function TagPage() {
  return (
    <PaginaDS
      titulo="Tag"
      descricao="A etiqueta que o usuário põe no lead: pílula de 22px em caixa alta, com bolinha de status, ícone de tipo ou foto do atendente. O + no fim da fileira abre o seletor, com uma aba por tipo de tag e busca que também cria."
      secoes={["Como funciona", "Variantes", "Cores", "Seletor de cor", "No perfil", "Seletor de tags", "Outros cenários", "Quando usar"]}
    >
      <ComoFunciona>
        <p>
          A <Chip>Tag</Chip> saiu do drawer do lead (node 538:197). O arquivo desenha oito &ldquo;temas&rdquo; num
          eixo só; em código eles viram três props que se combinam — <Chip>status</Chip> põe a bolinha de 6px,{" "}
          <Chip>tipo</Chip> põe o ícone de pessoa ou empresa e <Chip>foto</Chip> encosta a foto do atendente. O fundo é{" "}
          <Chip>input/bg-disabled</Chip> e a caixa alta é CSS: a string chega como veio, e o leitor de tela lê a
          original.
        </p>
        <p>
          O <Chip>+</Chip> é outra coisa. Clicável não é tag, então ele é <Chip>TagAdicionar</Chip>, um botão com
          rótulo — e, com a lista de tags para escolher, <Chip>SeletorTags</Chip>. O painel parte do Select Menu do
          Figma (544:122): superfície <Chip>overlay/bg</Chip>, traço <Chip>overlay/border</Chip>,{" "}
          <Chip>elevation/lg</Chip> e item com check quando escolhido. Por cima dele entram as abas — o{" "}
          <Chip>Tabs</Chip> do DS, uma por tipo de tag, com quantas o lead já tem em cada — e uma busca que filtra a
          aba e, quando o texto não existe em nenhuma, oferece criar.
        </p>
        <p>
          O painel abre num portal com posição fixa. Dentro do drawer o perfil rola, e um painel absoluto seria cortado
          pela coluna. Ele abre para baixo e vira para cima quando não cabe. O foco vai para a busca; setas andam na
          lista; Enter põe ou tira a tag, ou cria; Escape fecha <span className="text-foreground">só o painel</span> —
          o drawer por trás continua aberto — e devolve o foco ao +.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Variantes"
        spec="22px · pílula"
        descricao="Texto, três status, dois tipos, atendente e o botão de adicionar. Todas com 22px de altura."
        codigo={`<Tag>Lista de leads</Tag>
<Tag status="destructive">Abandonou</Tag>
<Tag status="info">Passou</Tag>
<Tag status="success">Agendado</Tag>
<Tag tipo="pessoa">Pessoa</Tag>
<Tag tipo="empresa">Empresa</Tag>
<Tag foto="/fotos/esther.png">Esther</Tag>
<TagAdicionar rotulo="Adicionar tag" />`}
        nota={
          <>
            A bolinha usa <Chip>destructive</Chip>, <Chip>info</Chip> e <Chip>success</Chip> — os valores exatos do
            arquivo. Ela reforça; quem carrega o sentido é o texto.
          </>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Tag>Lista de leads</Tag>
          <Tag status="destructive">Abandonou</Tag>
          <Tag status="info">Passou</Tag>
          <Tag status="success">Agendado</Tag>
          <Tag tipo="pessoa">Pessoa</Tag>
          <Tag tipo="empresa">Empresa</Tag>
          <Tag foto="/ds/atendente.png">Esther</Tag>
          <TagAdicionar rotulo="Adicionar tag" />
        </div>
      </Secao>

      <Secao
        titulo="Cores"
        spec="14 tons + neutro"
        descricao="Quinze cores para quem cria a tag: catorze tons, na ordem do círculo de cores, e a tag sem tom, que é o cinza. Cada tom tem o fundo, a letra e a bolinha medidos para o claro e para o escuro."
        codigo={`<Tag tom="turquesa">Turquesa</Tag>
<Tag tom="fucsia" status="info">Fúcsia</Tag>
<Tag>Neutro</Tag>`}
        nota={
          <>
            A cor é escolha de quem cria a tag, não sorteio da tela: lista inteira colorida ao acaso vira ruído.{" "}
            <Chip>tomDe</Chip>, que dá uma cor estável a um texto, continua sorteando só entre seis tons — abrir a
            paleta não troca a cor de uma lista que já existe.
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {TONS.map((t) => (
              <Tag key={t} tom={t}>
                {NOME_DO_TOM[t]}
              </Tag>
            ))}
            <Tag>Neutro</Tag>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {TONS.map((t) => (
              <Tag key={t} tom={t} status="info">
                {NOME_DO_TOM[t]}
              </Tag>
            ))}
          </div>
        </div>
      </Secao>

      <Secao
        titulo="Seletor de cor"
        spec="15 amostras · 16 ou 24px"
        descricao="As amostras de quem cria uma tag, uma etapa ou uma lista: as quinze cores, e nenhuma outra. Cada amostra mostra as duas cores que a tag vai ter — o pastel do fundo e a letra, no anel. A marcada ganha contorno e, no tamanho de formulário, o check."
        codigo={`<SeletorDeTom
  tamanho="md"
  comNeutro
  rotulo="Cor da tag"
  nomes={nomesDasCores}
  valor={tom}
  aoEscolher={setTom}
/>`}
        nota={
          <>
            Não existe seletor de cor livre nem campo de hexadecimal: quem cria escolhe uma das quinze, e a tag sai
            legível no claro e no escuro. <Chip>nomes</Chip> dá o nome de cada cor ao leitor de tela e ao tooltip.
            Dentro do <Chip>SeletorTags</Chip> a mesma peça aparece com 16px.
          </>
        }
      >
        <DemoSeletorDeTom />
      </Secao>

      <Secao
        titulo="No perfil"
        spec="gap 4 · centralizado"
        descricao="A fileira do topo do perfil no drawer: atendente primeiro, depois listas, status e temperatura, e o + no fim. Quebra em quantas linhas precisar, sempre centralizada. Clique no + para abrir o seletor."
        codigo={`<div className="flex flex-wrap justify-center gap-1">
  {escolhidas.map((t) => <Tag key={t.id} status={t.status} foto={t.foto}>{t.rotulo}</Tag>)}
  <SeletorTags grupos={catalogo} selecionadas={ids} aoAlternar={alternar} aoCriar={criar} rotulos={rotulos} />
</div>`}
      >
        <div className="mx-auto flex w-[280px] flex-wrap items-center justify-center gap-1">
          <TagsDoLead iniciais={["esther", "lista-de-leads", "isaias-123", "abandonou", "agendado", "frio"]} />
        </div>
      </Secao>

      <Secao
        titulo="Seletor de tags"
        spec="360px · abas + busca"
        descricao="Escolha a aba do tipo, digite para filtrar e aperte Enter para pôr a tag no lead. Um texto que não existe em nenhuma aba vira a opção de criar, na aba aberta."
        codigo={`<SeletorTags
  grupos={[
    { id: "status", rotulo: "Status", tags: [{ id: "agendado", rotulo: "Agendado", status: "success" }] },
    { id: "listas", rotulo: "Listas", tags: [{ id: "premium", rotulo: "Premium" }] },
    { id: "atendentes", rotulo: "Atendentes", tags: [{ id: "esther", rotulo: "Esther", foto }] },
  ]}
  selecionadas={ids}
  aoAlternar={(tag) => alternar(tag.id)}
  aoCriar={(rotulo, grupoId) => criar(rotulo, grupoId)}
  rotulos={{
    gatilho: "Adicionar tag",
    busca: "Buscar ou criar tag",
    vazio: "Nenhuma tag nesta aba",
    criar: (texto, grupo) => \`Criar "\${texto}" em \${grupo}\`,
    cor: "Cor da tag",
  }}
/>`}
        nota={
          <>
            A tag escolhida fica com fundo <Chip>overlay/item-selected</Chip> e check em{" "}
            <Chip>overlay/item-text-selected</Chip>; sob o cursor ou o teclado, <Chip>overlay/item-hover</Chip>. As
            abas e a busca <span className="text-foreground">não estão no arquivo</span>: foram pedido do humano, montadas
            com a Tab (535:21) e a caixa do Input. Sem <Chip>aoCriar</Chip>, a busca só filtra.
          </>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-1 py-6">
          <span className="mr-2 chrome-caption text-subtle-foreground">Tags do lead:</span>
          <TagsDoLead iniciais={["liam", "premium", "passou"]} />
        </div>
      </Secao>

      <Secao
        titulo="Outros cenários"
        spec="3 conteúdos"
        descricao="O seletor não sabe o que é tag: as abas, as opções e os rótulos são conteúdo. O mesmo componente escolhe os produtos de uma proposta, os responsáveis por um negócio e a origem de um lead."
        codigo={`{/* Produtos da proposta: cor por degrau nos planos; serviços e add-ons com cor livre e criar */}
<SeletorTags
  grupos={[
    { id: "planos", rotulo: "Planos", tags: [{ id: "pro", rotulo: "Pro", tom: "azul", icone: Package }] },
    { id: "servicos", rotulo: "Serviços", corLivre: true, tags: [{ id: "onboarding", rotulo: "Onboarding", tom: "verde" }] },
  ]}
  selecionadas={ids}
  aoAlternar={(tag) => alternar(tag.id)}
  aoCriar={(rotulo, grupoId, tom) => criar(rotulo, grupoId, tom)}
  rotulos={{ gatilho: "Adicionar produto", busca: "Buscar ou criar produto", vazio: "Nenhum produto nesta aba", criar: (t, g) => \`Criar "\${t}" em \${g}\`, cor: "Cor" }}
/>

{/* Responsáveis: foto no lugar da cor, e sem aoCriar — a busca só filtra */}
<SeletorTags
  grupos={[{ id: "vendas", rotulo: "Vendas", tags: [{ id: "esther", rotulo: "Esther", foto: "/fotos/esther.png" }] }]}
  selecionadas={ids}
  aoAlternar={(tag) => alternar(tag.id)}
  rotulos={{ gatilho: "Adicionar responsável", busca: "Buscar pessoa", vazio: "Ninguém neste time", criar: (t) => \`Convidar "\${t}"\`, cor: "Cor" }}
/>`}
        nota={
          <>
            Três decisões por conteúdo, não por componente: onde a cor é <span className="text-foreground">regra</span>{" "}
            (plano, canal), onde é <span className="text-foreground">escolha</span> (<Chip>corLivre</Chip>: serviço,
            add-on, campanha) e onde <span className="text-foreground">não existe criar</span> (pessoa não nasce num
            campo de busca: sem <Chip>aoCriar</Chip>, a busca só filtra). O ícone entra quando a cor sozinha não
            distingue — os canais têm o logo, os produtos a caixa.
          </>
        }
      >
        <div className="flex flex-col gap-5 py-2">
          {[
            { rotulo: "Produtos da proposta:", grupos: PRODUTOS, iniciais: ["pro", "onboarding"], rotulos: ROTULOS_PRODUTOS, criar: true },
            { rotulo: "Responsáveis:", grupos: RESPONSAVEIS, iniciais: ["esther", "diego"], rotulos: ROTULOS_RESPONSAVEIS, criar: false },
            { rotulo: "Origem do lead:", grupos: ORIGEM, iniciais: ["instagram", "black-friday-2026"], rotulos: ROTULOS_ORIGEM, criar: true },
          ].map((c) => (
            <div key={c.rotulo} className="flex flex-wrap items-center justify-center gap-1">
              <span className="mr-2 chrome-caption text-subtle-foreground">{c.rotulo}</span>
              <FileiraDeTags grupos={c.grupos} iniciais={c.iniciais} rotulos={c.rotulos} criar={c.criar} />
            </div>
          ))}
        </div>
      </Secao>

      <Secao titulo="Quando usar" descricao="Tag é etiqueta que alguém pôs. Estado que o sistema calcula é outra coisa.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Uma aba por tipo, sempre na mesma ordem.</span> Status, listas,
            atendentes, temperatura. Tipo novo é aba nova, não cor nova.
          </li>
          <li>
            <span className="text-foreground">Criar não pede confirmação, mas mostra o que vai criar.</span> A opção
            diz o texto e a aba de destino antes do Enter.
          </li>
          <li>
            <span className="text-foreground">A cor da bolinha não é o recado.</span> &ldquo;Abandonou&rdquo; em
            vermelho tem que continuar sendo &ldquo;Abandonou&rdquo; para quem não distingue cor.
          </li>
          <li>
            <span className="text-foreground">Texto vem de fora.</span> Os rótulos do seletor são props: o componente
            não escreve português.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
