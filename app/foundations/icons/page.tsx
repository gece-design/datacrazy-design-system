"use client";

import {
  ChartLine, Clock, Export, Funnel, House, Lightning, Users,
} from "@phosphor-icons/react";
import type { IconWeight } from "@phosphor-icons/react";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";
import { IconBrowser } from "@/components/ds/icon-browser";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------------- */

/** Os seis do pacote, na ordem em que o Phosphor os declara. */
const PESOS: IconWeight[] = ["thin", "light", "regular", "bold", "fill", "duotone"];

const CODIGO_IMPORT = `import { Funnel, Export, Lightning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

<div className="flex flex-wrap items-center gap-2">
  <Button variant="secondary">
    <Funnel size={16} weight="regular" />
    Filtrar
  </Button>
  <Button variant="secondary">
    <Export size={16} weight="regular" />
    Exportar
  </Button>
  <Button>
    <Lightning size={16} weight="regular" />
    Automação
  </Button>
</div>`;

/* ------------------------------------------------------------------------- */

export default function Icones() {
  return (
    <PaginaDS
      titulo="Icons"
      descricao="Phosphor: 1.512 nomes em 6 pesos, um módulo por ícone. O CRM usa 104 deles, em três tamanhos — 16, 20 e 24 — e num peso só: regular, com fill reservado ao item selecionado."
      secoes={["Como funciona", "Import", "Peso", "Tamanhos", "Biblioteca"]}
    >
      <ComoFunciona>
        <p>
          Cada ícone é um <span className="text-foreground">módulo próprio</span> em{" "}
          <Chip>dist/csr/</Chip>: <Chip>House.es.js</Chip> importa só o seu conjunto de traçados. O
          pacote <Chip>@phosphor-icons/react</Chip> é apenas um barril que reexporta os 1.512, e ele
          declara <Chip>sideEffects: false</Chip> — é essa linha, não o import nominal em si, que
          autoriza o bundler a descartar o que você não citou. Por isso o peso do build é o número de
          ícones que você nomeia, nunca o catálogo: no build deste site esta página, com 104 nomes,
          passa de 69 kB, e a de tipografia, que não cita nenhum, fica em 3,9 kB. <span className="text-foreground">Nunca{" "}
          <Chip>import * as Icons</Chip></span>: o coringa prende os 1.512 no grafo. Em dev é
          diferente — <Chip>@phosphor-icons/react</Chip> não está na lista padrão de{" "}
          <Chip>optimizePackageImports</Chip> do Next 15, onde <Chip>lucide-react</Chip> está, então
          o barril compila inteiro até alguém declarar o pacote no <Chip>next.config.mjs</Chip>.
        </p>
        <p>
          O peso é a decisão que fecha o assunto. O <Chip>IconContext</Chip> já entrega{" "}
          <Chip>weight: &quot;regular&quot;</Chip> e <Chip>color: &quot;currentColor&quot;</Chip> por
          padrão — então não escrever nada dá o resultado certo, e a cor vem sozinha do{" "}
          <Chip>className</Chip> com token. <span className="text-foreground">A prop{" "}
          <Chip>color</Chip> aceita string CSS crua</span> e é justamente por onde um hex entraria
          por baixo do sistema de tokens: use classe, não a prop. Só <Chip>fill</Chip> escapa do
          peso único, e só no item selecionado, casando com <Chip>nav/item/icon-selected</Chip>.
        </p>
        <p>
          Isso existe porque há um <span className="text-foreground">conflito registrado</span>. A
          anti-referência nº 14 do time diz &quot;ícones muito arredondados (respond.io) — manter o
          padrão atual, Lucide&quot;, e a decisão do humano foi Phosphor mesmo, uma família de
          terminações arredondadas. A decisão vale; a mitigação é o peso único, porque seis pesos
          soltos viram a anti-referência nº 2, quebra de padronização. E se ainda ficar arredondado
          demais aos olhos do time, <span className="text-foreground">o ajuste é trocar o peso, não
          trocar ícone a ícone</span> — está em <Chip>docs/01-arquitetura.md</Chip>.
        </p>
        <p>
          Duas armadilhas de runtime. A primeira: o <Chip>size</Chip> padrão do contexto é{" "}
          <Chip>1em</Chip>, não 20px — ícone sem <Chip>size</Chip> herda o <Chip>font-size</Chip> do
          pai, e numa interface cujo corpo é 12px ele nasce com 12px, ou 10px dentro de{" "}
          <Chip>text-caption</Chip>. Ele encolhe junto com a escala,{" "}
          <span className="text-foreground">em silêncio</span>, e só aparece no diff contra o Figma.
          Sempre passe <Chip>size</Chip>. A segunda é do App Router: o build que o barril entrega é o{" "}
          <Chip>csr</Chip>, que chama <Chip>useContext</Chip> — importar um ícone direto num Server
          Component quebra em render. Ou o arquivo leva <Chip>&quot;use client&quot;</Chip> — é o
          caso desta página, por causa da busca —, ou você usa o namespace <Chip>SSR</Chip>, que o
          barril também exporta.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Import"
        spec="@phosphor-icons/react"
        descricao="Nomeie o que usa, passe size e weight, deixe a cor no className. É esse bloco que se copia."
        codigo={CODIGO_IMPORT}
        nota={
          <>
            Nenhum dos três passa <Chip>color</Chip>: o <Chip>currentColor</Chip> herda de{" "}
            <Chip>text-foreground</Chip> e de <Chip>text-primary-foreground</Chip>, então o ícone
            troca de tema junto com o texto, sem ramificação de código. Passe o mouse nos três: o
            fundo é <Chip>transition-colors</Chip> em cima de token, e o ícone não muda — é o texto ao
            lado dele que carrega a cor. Os três são o <Chip>Button</Chip> do DS.
          </>
        }
      >
        {/* o Button do DS — antes eram três <button> à mão, e a aba Código ensinava a copiá-los (AUD-054) */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary">
            <Funnel size={16} weight="regular" />
            Filtrar
          </Button>
          <Button variant="secondary">
            <Export size={16} weight="regular" />
            Exportar
          </Button>
          <Button>
            <Lightning size={16} weight="regular" />
            Automação
          </Button>
        </div>
      </Secao>

      <Secao
        titulo="Peso"
        spec="6 disponíveis · 2 em uso"
        descricao="O mesmo glifo nos seis pesos do pacote, na ordem em que o Phosphor os declara. Regular é o padrão da interface inteira; fill existe só para o item selecionado."
        nota={
          <>
            Da esquerda para a direita: <Chip>thin</Chip>, <Chip>light</Chip>,{" "}
            <Chip>regular</Chip>, <Chip>bold</Chip>, <Chip>fill</Chip> e <Chip>duotone</Chip>. Só o
            terceiro e o quinto entram no CRM; os outros quatro estão fora. O item selecionado da
            navegação muda por preenchimento do glifo e por fundo: é o par{" "}
            <Chip>nav/item/icon-selected</Chip> e <Chip>nav/item/bg-selected</Chip> do Figma, que
            aqui sai como <Chip>text-primary</Chip> sobre <Chip>bg-accent</Chip> — semânticos, então
            viram junto com o tema. <span className="text-foreground">Não troque por{" "}
            <Chip>bg-base-blue-50</Chip></span>: primitivo não muda de tema, e foi assim que a
            pílula da sidebar ficou branca no escuro (correção 5 de <Chip>docs/02-design-system.md</Chip>).
            Distinguir o selecionado por espessura de traço também está fora — peso misto é a
            anti-referência nº 2, e a regra A8 pede um peso só na interface inteira.
          </>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {PESOS.map((peso) => (
            <House key={peso} size={24} weight={peso} className="text-foreground" />
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Tamanhos"
        spec="16 · 20 · 24"
        descricao="Três degraus, e nada entre eles, cada um ao lado do texto que ele foi feito para acompanhar. O ícone existe para ser lido de relance; tamanho intermediário só cria desalinhamento."
        nota={
          <>
            Na ordem em que aparecem: <Chip>16</Chip> acompanha texto — linha corrida, botão e chip,
            pareado com <Chip>text-body-lg</Chip> e <Chip>text-button</Chip>; <Chip>20</Chip> é o
            padrão de interface — sidebar, barra de ferramentas, ação de linha de tabela, o tamanho
            que você usa se não pensar; <Chip>24</Chip> é destaque — cabeçalho de card, topo de
            drawer, estado vazio, e acima disso vira ilustração, não ícone. O 16 alinha com a altura
            de linha de <Chip>text-body-lg</Chip>; o 24 sobe junto com <Chip>text-h3</Chip>. Se o
            par ícone/texto parecer torto, o problema é quase sempre o degrau errado — não é caso de
            inventar um <Chip>size</Chip> quebrado.
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <span className="inline-flex items-center gap-1.5 text-body-lg text-muted-foreground">
            <Clock size={16} weight="regular" />
            Última atividade há 3 dias
          </span>
          <span className="inline-flex items-center gap-2 text-body-lg text-foreground">
            <Users size={20} weight="regular" />
            Leads
          </span>
          <span className="inline-flex items-center gap-2.5 text-h3 text-foreground">
            <ChartLine size={24} weight="regular" />
            Receita do mês
          </span>
        </div>
      </Secao>

      <Secao
        titulo="Biblioteca"
        spec="1.512 · catálogo oficial"
        descricao="Os 1.512 nomes do pacote, nos seis pesos. Busca por nome, tag ou categoria; clique num ícone para copiar o componente, o import, o uso ou o SVG."
        semCaixa
        className="p-6"
        nota={
          <>
            <p>
              A lista não é digitada à mão. Nome, PascalCase, categorias e tags saem de{" "}
              <Chip>@phosphor-icons/core</Chip>, o catálogo oficial do Phosphor — o mesmo que
              alimenta o site deles —, e o traçado sai dos arquivos{" "}
              <Chip>assets/&#123;peso&#125;/*.svg</Chip> do próprio pacote: o SVG que você copia é o
              arquivo de origem, não uma reconstrução.{" "}
              <Chip>scripts/gerar-catalogo-icones.mjs</Chip> lê os dois e gera{" "}
              <Chip>public/phosphor/&#123;peso&#125;.json</Chip>. Atualizou o pacote, roda o script:
              a página acompanha a versão nova sem ninguém editar lista.
            </p>
            <p className="mt-2">
              A versão do catálogo aparece ali em cima, ao lado da contagem — se ela não bate com o{" "}
              <Chip>package.json</Chip>, o script não rodou depois do último update. E o JSON desce
              por <Chip>fetch</Chip> só quando esta página abre, um peso por vez, por isso ele não
              entra no bundle das outras páginas: é a mesma lógica do import nominal — o peso é o
              que você usa, nunca o catálogo inteiro.
            </p>
          </>
        }
      >
        <IconBrowser />
      </Secao>
    </PaginaDS>
  );
}
