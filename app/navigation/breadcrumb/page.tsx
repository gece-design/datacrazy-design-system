"use client";

import { BellSimple, Handshake, Kanban } from "@phosphor-icons/react";
import { Breadcrumb, type ItemBreadcrumb } from "@/components/ui/breadcrumb";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

/* Na doc os textos são literais porque a doc é escrita em português. No CRM
   cada um vem do next-intl — o componente não tem nenhum embutido. */
const rotulos = { rotulo: "Trilha de navegação", rotuloRecolhidos: (n: number) => `Mostrar ${n} níveis ocultos` };

const doArquivo: ItemBreadcrumb[] = [
  { rotulo: "Board team", href: "#", avatar: { destaque: true } },
  { rotulo: "Mertcan", href: "#", avatar: {} },
  { rotulo: "Marketing", icone: BellSimple },
];

const longa: ItemBreadcrumb[] = [
  { rotulo: "DataCrazy", href: "#", avatar: { destaque: true } },
  { rotulo: "Comercial", href: "#" },
  { rotulo: "Pipelines", href: "#", icone: Kanban },
  { rotulo: "Vendas B2B", href: "#" },
  { rotulo: "Proposta", href: "#" },
  { rotulo: "Construtora Horizonte Ltda.", href: "#", avatar: {} },
  { rotulo: "Negócio #4821", icone: Handshake },
];

const semAdorno: ItemBreadcrumb[] = [
  { rotulo: "Configurações", href: "#" },
  { rotulo: "Integrações", href: "#" },
  { rotulo: "WhatsApp Business" },
];

const textoLongo: ItemBreadcrumb[] = [
  { rotulo: "Equipo comercial Latinoamérica", href: "#", avatar: { destaque: true } },
  { rotulo: "María Fernanda Castañeda Rodríguez", href: "#", avatar: {} },
  { rotulo: "Campañas de reactivación de clientes", icone: BellSimple },
];

const codigoArquivo = `<Breadcrumb
  rotulo="Trilha de navegação"
  rotuloRecolhidos={(n) => \`Mostrar \${n} níveis ocultos\`}
  itens={[
    { rotulo: "Board team", href: "/times/board", avatar: { destaque: true } },
    { rotulo: "Mertcan", href: "/pessoas/mertcan", avatar: {} },
    { rotulo: "Marketing", icone: BellSimple },
  ]}
  link={Link}
/>`;

const codigoRecolhida = `<Breadcrumb {...rotulos} itens={setesNiveis} />             // padrão: 3 à vista
<Breadcrumb {...rotulos} itens={setesNiveis} maximo={2} />  // entidade › registro`;

export default function BreadcrumbPage() {
  return (
    <PaginaDS
      titulo="Breadcrumb"
      descricao="Trilha de label-md a 4px de vão, separador de 12px com traço de 1,5 e disco de 20px por nível. Qualquer número de níveis; passando de três, os do meio recolhem num botão de reticências."
      secoes={["Como funciona", "Do arquivo", "Recolhida", "Sem avatar", "Texto longo"]}
    >
      <ComoFunciona>
        <p>
          Cada item de <Chip>itens</Chip> é um nível: <Chip>rotulo</Chip>, <Chip>href</Chip> opcional e um adorno — o{" "}
          <Chip>avatar</Chip> de 20px com a inicial do rótulo, ou um <Chip>icone</Chip> de 14px. O último é sempre a
          página atual: não navega, sai em <Chip>muted-foreground</Chip> e leva <Chip>aria-current=&quot;page&quot;</Chip>.
          Os anteriores ficam em <Chip>subtle-foreground</Chip> e sobem um degrau no hover.
        </p>
        <p>
          O arquivo anota que a trilha mostra no máximo dois níveis e recolhe os do meio, mas desenha três. O código
          segue o desenho no padrão — <Chip>maximo</Chip> é 3 — e deixa a nota a uma prop de distância:{" "}
          <Chip>maximo={"{2}"}</Chip>. Recolhida, ficam o primeiro e os últimos; as reticências são botão e abrem a
          trilha inteira no lugar, com o foco passando para o primeiro nível que apareceu.
        </p>
        <p>
          O componente não importa o <Chip>Link</Chip> do Next: recebe o elemento pela prop <Chip>link</Chip>, com{" "}
          <Chip>a</Chip> como padrão. Assim o DS continua sem saber em que roteador mora.
        </p>
        <p>
          A armadilha é o contraste. <Chip>subtle-foreground</Chip> sobre <Chip>background</Chip> dá 2,2:1, abaixo dos
          4,5:1 que texto de 11px pede. Está como o arquivo desenha e fica registrado como divergência aberta: subir os
          ancestrais para <Chip>muted-foreground</Chip> apaga a diferença entre eles e a página atual.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Do arquivo"
        spec="261:269 · 3 níveis"
        descricao="Os três níveis desenhados: time com disco em destaque, pessoa com disco neutro, página atual com ícone. Os dois primeiros são links — passe o cursor ou entre pelo Tab."
        codigo={codigoArquivo}
      >
        <Breadcrumb {...rotulos} itens={doArquivo} />
      </Secao>

      <Secao
        titulo="Recolhida"
        spec="7 níveis · maximo 3 e 2"
        descricao="A mesma trilha de sete níveis, com três e com dois à vista. Clique nas reticências: a trilha abre no lugar."
        codigo={codigoRecolhida}
      >
        <div className="space-y-4">
          <Breadcrumb {...rotulos} itens={longa} />
          <Breadcrumb {...rotulos} itens={longa} maximo={2} />
        </div>
        <Legenda>Aberta, a trilha não volta a recolher sozinha — só quando a página muda.</Legenda>
      </Secao>

      <Secao
        titulo="Sem avatar"
        spec="só rótulo"
        descricao="Nível sem adorno é só texto. Útil onde o caminho não é de pessoa nem de time, como nas configurações."
      >
        <Breadcrumb {...rotulos} itens={semAdorno} />
      </Secao>

      <Secao
        titulo="Texto longo"
        spec="320px · es"
        descricao="Nomes em espanhol numa coluna estreita. Todos os níveis encolhem juntos e truncam; o texto inteiro fica no title de cada um."
      >
        <div className="mx-auto w-full max-w-[320px]">
          <Breadcrumb {...rotulos} itens={textoLongo} />
        </div>
      </Secao>
    </PaginaDS>
  );
}
