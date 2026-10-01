"use client";

import { useRef, useState } from "react";
import { Globe, Handshake } from "@phosphor-icons/react";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { Combobox, ComboboxMultiplo, ComboboxPainel } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { IconeDeMarca } from "@/components/ui/icone-de-marca";
import { CartaoDeCampo } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";

const cidades = [
  "Belo Horizonte", "Brasília", "Campinas", "Caxias do Sul", "Cuiabá", "Curitiba", "Florianópolis", "Fortaleza",
  "Goiânia", "Joinville", "Manaus", "Porto Alegre", "Recife", "Rio de Janeiro", "Salvador", "Santo André",
  "São Paulo", "Vitória",
].map((c) => ({ valor: c, rotulo: c }));

const origens = [
  { valor: "whatsapp", rotulo: "WhatsApp", grupo: "Redes sociais", icone: <IconeDeMarca marca="whatsapp" /> },
  { valor: "instagram", rotulo: "Instagram", grupo: "Redes sociais", icone: <IconeDeMarca marca="instagram" /> },
  { valor: "google", rotulo: "Google", grupo: "Redes sociais", icone: <IconeDeMarca marca="google" /> },
  { valor: "meta", rotulo: "Meta", grupo: "Redes sociais", icone: <IconeDeMarca marca="meta" /> },
  { valor: "linkedin", rotulo: "LinkedIn", grupo: "Redes sociais", icone: <IconeDeMarca marca="linkedin" /> },
  { valor: "site", rotulo: "Site", grupo: "Outras", icone: <Globe size={16} weight="regular" aria-hidden="true" /> },
  { valor: "indicacao", rotulo: "Indicação", grupo: "Outras", icone: <Handshake size={16} weight="regular" aria-hidden="true" /> },
];

const tags = [
  { id: "frio", rotulo: "Frio", grupo: "Temperatura" },
  { id: "warm", rotulo: "Warm", grupo: "Temperatura" },
  { id: "quente", rotulo: "Quente", grupo: "Temperatura", status: "destructive" as const },
  { id: "em-aberto", rotulo: "Em aberto", grupo: "Status", status: "info" as const },
  { id: "agendado", rotulo: "Agendado", grupo: "Status", status: "success" as const },
  { id: "sem-retorno", rotulo: "Sem retorno", grupo: "Status", status: "destructive" as const },
  { id: "saude", rotulo: "Saúde", grupo: "Segmento" },
  { id: "educacao", rotulo: "Educação", grupo: "Segmento" },
  { id: "enterprise", rotulo: "Enterprise", grupo: "Segmento" },
  { id: "varejo", rotulo: "Varejo", grupo: "Segmento" },
];
const opcoesDeTag = tags.map((t) => ({
  valor: t.id,
  rotulo: t.rotulo,
  grupo: t.grupo,
  conteudo: <Tag status={t.status}>{t.rotulo}</Tag>,
}));

const rotulos = { busca: "Buscar", vazio: "Nada encontrado" };

const codigoUma = `<Combobox
  size="field"
  rotulo="Cidade"
  textoVazio="Selecione a cidade"
  opcoes={cidades}
  valor={cidade}
  aoEscolher={setCidade}
  rotulos={{ busca: "Buscar cidade", vazio: "Nenhuma cidade encontrada" }}
/>`;

const codigoGrupos = `const origens = [
  { valor: "whatsapp", rotulo: "WhatsApp", grupo: "Redes sociais", icone: <IconeDeMarca marca="whatsapp" /> },
  { valor: "instagram", rotulo: "Instagram", grupo: "Redes sociais", icone: <IconeDeMarca marca="instagram" /> },
  { valor: "site", rotulo: "Site", grupo: "Outras", icone: <Globe size={16} weight="regular" aria-hidden="true" /> },
];

<Combobox
  size="field"
  rotulo="Origem do lead"
  textoVazio="Selecione a origem"
  opcoes={origens}
  valor={origem}
  aoEscolher={setOrigem}
  rotulos={{ busca: "Buscar origem", vazio: "Nada encontrado" }}
/>`;

const codigoVarias = `<ComboboxMultiplo
  size="field"
  rotulo="Tags"
  textoVazio="Nenhuma tag"
  opcoes={tags.map((t) => ({
    valor: t.id,
    rotulo: t.rotulo,
    grupo: t.grupo,
    conteudo: <Tag status={t.status}>{t.rotulo}</Tag>,
  }))}
  valores={escolhidas}
  aoMudar={setEscolhidas}
  rotulos={{ busca: "Buscar tag", vazio: "Nenhuma tag encontrada" }}
/>`;

const codigoPainel = `const botao = useRef(null as HTMLButtonElement | null);
const [aberto, setAberto] = useState(false);

<>
  <Button ref={botao} variant="tertiary" aria-haspopup="dialog" aria-expanded={aberto} onClick={() => setAberto((a) => !a)}>
    Atribuir atendente
  </Button>
  <ComboboxPainel
    aberto={aberto}
    aoFechar={(devolver = true) => {
      setAberto(false);
      if (devolver) botao.current?.focus();
    }}
    gatilho={botao}
    rotulo="Atribuir atendente"
    opcoes={atendentes}
    selecionados={[atendente]}
    aoAlternar={setAtendente}
    rotulos={{ busca: "Buscar atendente", vazio: "Ninguém encontrado" }}
  />
</>`;

const atendentes = ["Breno Ramos", "Esther Lima", "Junior Santos", "Liam Costa", "Marina Prado", "Millena Aragão"].map((a) => ({
  valor: a,
  rotulo: a,
}));

export default function ComboboxPage() {
  const [cidade, setCidade] = useState("");
  const [origem, setOrigem] = useState("whatsapp");
  const [escolhidas, setEscolhidas] = useState(["quente", "saude"]);
  const [atendente, setAtendente] = useState("Esther Lima");
  const [painel, setPainel] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);

  return (
    <PaginaDS
      titulo="Combobox"
      descricao="A lista com busca: o Select para quando as opções passam de dez, têm grupos ou aceitam várias escolhas. Mesmo gatilho do Select, painel de 256px com busca que ignora acento, e teclado completo sem tirar o foco do campo."
      secoes={["Como funciona", "Uma escolha", "Grupos e ícones", "Várias escolhas", "Só o painel", "Teclado"]}
    >
      <ComoFunciona>
        <p>
          São três peças. <Chip>Combobox</Chip> é uma escolha: as props são as do <Chip>Select</Chip>, mais{" "}
          <Chip>rotulos</Chip> para os textos da busca. <Chip>ComboboxMultiplo</Chip> troca <Chip>valor</Chip> por{" "}
          <Chip>valores</Chip>, põe uma caixa de marcar em cada opção e deixa a lista aberta.{" "}
          <Chip>ComboboxPainel</Chip> é só o painel, para quando o gatilho já existe — o chip da barra de filtros, a
          célula da tabela.
        </p>
        <p>
          O gatilho é o <Chip>SelectTrigger</Chip> e o painel é a casca de todo painel flutuante do DS: nada aqui tem
          cara nova. O que muda é o comportamento — o foco fica na busca o tempo todo, as setas andam pela lista sem
          tirar o cursor do campo, e <Chip>Escape</Chip> fecha só o painel, sem levar junto o modal ou o drawer de
          trás.
        </p>
        <p>
          A armadilha: a busca procura no <Chip>rotulo</Chip>, sempre. Com <Chip>conteudo</Chip> a opção pode mostrar
          uma Tag ou outra peça no lugar do texto, mas o <Chip>rotulo</Chip> continua obrigatório — é ele que a busca
          lê e que o gatilho mostra.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Uma escolha"
        spec="Combobox · 18 opções"
        descricao="Lista longa demais para rolar no olho: a pessoa digita e a lista encolhe. Escolher fecha o painel e devolve o foco ao gatilho."
        codigo={codigoUma}
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="rounded-md bg-card p-5">
            <CartaoDeCampo rotulo="Cidade">
              <Combobox
                size="field"
                rotulo="Cidade"
                textoVazio="Selecione a cidade"
                opcoes={cidades}
                valor={cidade}
                aoEscolher={setCidade}
                rotulos={{ busca: "Buscar cidade", vazio: "Nenhuma cidade encontrada" }}
                className="block w-full"
              />
            </CartaoDeCampo>
          </div>
        </div>
        <Legenda>
          Digite <Chip>sao</Chip>: a busca acha &quot;São Paulo&quot; sem o acento. A opção escolhida fica marcada com
          o check à direita.
        </Legenda>
      </Secao>

      <Secao
        titulo="Grupos e ícones"
        spec="grupo · icone"
        descricao="As opções chegam com o grupo e o ícone; a lista monta os cabeçalhos. A busca atravessa os grupos e esconde o que ficou vazio."
        codigo={codigoGrupos}
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="rounded-md bg-card p-5">
            <CartaoDeCampo rotulo="Origem do lead">
              <Combobox
                size="field"
                rotulo="Origem do lead"
                textoVazio="Selecione a origem"
                opcoes={origens}
                valor={origem}
                aoEscolher={setOrigem}
                rotulos={{ busca: "Buscar origem", vazio: "Nada encontrado" }}
                className="block w-full"
              />
            </CartaoDeCampo>
          </div>
        </div>
        <Legenda>
          Marca é <Chip>IconeDeMarca</Chip>; o resto é Phosphor de 16px. O ícone da opção escolhida vai junto para o
          gatilho.
        </Legenda>
      </Secao>

      <Secao
        titulo="Várias escolhas"
        spec="ComboboxMultiplo"
        descricao="Caixa de marcar em cada opção e a lista fica aberta: a pessoa marca três e só então sai. O gatilho resume — a primeira e quantas mais."
        codigo={codigoVarias}
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="rounded-md bg-card p-5">
            <CartaoDeCampo rotulo="Tags">
              <ComboboxMultiplo
                size="field"
                rotulo="Tags"
                textoVazio="Nenhuma tag"
                opcoes={opcoesDeTag}
                valores={escolhidas}
                aoMudar={setEscolhidas}
                rotulos={{ busca: "Buscar tag", vazio: "Nenhuma tag encontrada" }}
                className="block w-full"
              />
            </CartaoDeCampo>
          </div>
          <div className="flex flex-wrap content-start items-start gap-1.5">
            {tags
              .filter((t) => escolhidas.includes(t.id))
              .map((t) => (
                <Tag key={t.id} status={t.status}>
                  {t.rotulo}
                </Tag>
              ))}
          </div>
        </div>
        <Legenda>
          Cada opção aparece como a <Chip>Tag</Chip> que vai para a tela (<Chip>conteudo</Chip>). Ao lado, o que está
          marcado — muda enquanto a lista está aberta, sem botão de confirmar.
        </Legenda>
      </Secao>

      <Secao
        titulo="Só o painel"
        spec="ComboboxPainel"
        descricao="Para quando o gatilho já existe: um botão da barra de ações, o chip de um filtro, a célula da tabela. É controlado, como o Menu — quem abre e fecha é a tela."
        codigo={codigoPainel}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            ref={botao}
            variant="tertiary"
            aria-haspopup="dialog"
            aria-expanded={painel}
            onClick={() => setPainel((a) => !a)}
          >
            Atribuir atendente
          </Button>
          <span className="text-label-lg text-muted-foreground">{atendente}</span>
          <ComboboxPainel
            aberto={painel}
            aoFechar={(devolver = true) => {
              setPainel(false);
              if (devolver) botao.current?.focus();
            }}
            gatilho={botao}
            rotulo="Atribuir atendente"
            opcoes={atendentes}
            selecionados={[atendente]}
            aoAlternar={setAtendente}
            rotulos={{ busca: "Buscar atendente", vazio: "Ninguém encontrado" }}
          />
        </div>
        <Legenda>
          É o mesmo painel que a <Chip>BarraDeFiltros</Chip> abre em cada chip e que a <Chip>CelulaEscolha</Chip> abre
          na célula da tabela.
        </Legenda>
      </Secao>

      <Secao
        titulo="Teclado"
        spec="WAI-ARIA combobox"
        descricao="O foco entra na busca ao abrir e não sai de lá. Setas andam pela lista, Enter escolhe, Escape fecha só o painel, Tab fecha e segue."
      >
        <div className="flex justify-center">
          <Combobox rotulo="Origem do lead" opcoes={origens} valor={origem} aoEscolher={setOrigem} rotulos={rotulos} />
        </div>
        <Legenda>
          <Chip>role=&quot;combobox&quot;</Chip> na busca, com <Chip>aria-activedescendant</Chip> na opção sob o
          teclado; a lista é <Chip>listbox</Chip> e cada grupo é um <Chip>group</Chip> com nome. A opção ativa rola
          para ficar à vista.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
