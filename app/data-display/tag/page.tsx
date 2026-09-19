"use client";

import { Tag, TagAdicionar } from "@/components/ui/tag";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";
import { TagsDoLead } from "@/app/feedback/drawer/drawer-lead";

export default function TagPage() {
  return (
    <PaginaDS
      titulo="Tag"
      descricao="A etiqueta que o usuário põe no lead: pílula de 22px em caixa alta, com bolinha de status, ícone de tipo ou foto do atendente. O + no fim da fileira abre o seletor, com uma aba por tipo de tag e busca que também cria."
      secoes={["Como funciona", "Variantes", "No perfil", "Seletor de tags", "Quando usar"]}
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
