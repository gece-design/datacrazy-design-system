"use client";

import { useState } from "react";
import { Buildings, CurrencyDollar, EnvelopeSimple, FunnelSimple, Headset, MapPin, Phone } from "@phosphor-icons/react";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { Avatar } from "@/components/ui/avatar";
import { CelulaEditavel, CelulaEscolha, CelulaLead, DataTable, DataTableCell, DataTableRow, type ColunaTabela } from "@/components/ui/data-table";
import { LinhaDeCampo, ListaDeCampos, PainelLateral, PainelLateralCorpo } from "@/components/ui/painel-lateral";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

type Lead = { id: string; nome: string; empresa: string; etapa: string; valor: string; atendente: string; telefone: string; email: string; cidade: string };

const LEADS: Lead[] = [
  { id: "1", nome: "Marina Alvarenga", empresa: "Clínica Vitalis", etapa: "Novo lead", valor: "18400", atendente: "Esther", telefone: "+55 (11) 98844-2019", email: "marina@vitalis.com.br", cidade: "São Paulo · SP" },
  { id: "2", nome: "Rafael Pinto", empresa: "Pinto Advocacia", etapa: "Proposta", valor: "12500", atendente: "Marina", telefone: "+55 (54) 4434-5346", email: "rafael@pintoadv.com.br", cidade: "Caxias do Sul · RS" },
  { id: "3", nome: "Júlia Bastos", empresa: "Bastos Odontologia", etapa: "Qualificação", valor: "9800", atendente: "Esther", telefone: "+55 (21) 97712-4400", email: "julia@bastosodonto.com", cidade: "Rio de Janeiro · RJ" },
  { id: "4", nome: "Henrique Salles", empresa: "Salles Fotografia", etapa: "Novo lead", valor: "7600", atendente: "Liam", telefone: "+55 (27) 99120-8831", email: "henrique@sallesfoto.com", cidade: "Vitória · ES" },
];

const COLUNAS: ColunaTabela[] = [
  { chave: "lead", rotulo: "Lead", peso: 2, minimo: 150 },
  { chave: "valor", rotulo: "Valor", peso: 1, minimo: 96, alinharFim: true },
];

const ETAPAS = ["Novo lead", "Qualificação", "Proposta", "Negociação", "Fechamento"].map((e) => ({ valor: e, rotulo: e }));
const moeda = (v: string) => `R$ ${(Number(v) || 0).toLocaleString("pt-BR")}`;
const rotulos = { fechar: "Fechar o lead", expandir: "Abrir em tela cheia", recolher: "Voltar ao painel" };

const codigoNaTela = `const [abertoId, setAbertoId] = useState<string | null>(null);
const [telaCheia, setTelaCheia] = useState(false);
const aberto = leads.find((l) => l.id === abertoId);

<TelaBase
  navegacao={navegacao}
  cabecalho={cabecalho}
  recuo={false}
  lateral={
    aberto ? (
      <PainelLateral
        titulo={aberto.nome}
        subtitulo={aberto.empresa}
        inicio={<Avatar nome={aberto.nome} size="sm" aria-hidden="true" />}
        telaCheia={telaCheia}
        aoAlternarTelaCheia={() => setTelaCheia((v) => !v)}
        aoFechar={() => { setAbertoId(null); setTelaCheia(false); }}
        rotulos={{ fechar: "Fechar o lead", expandir: "Abrir em tela cheia", recolher: "Voltar ao painel" }}
      >
        <PainelLateralCorpo>
          <ListaDeCampos>
            <LinhaDeCampo icone={Phone} rotulo="Telefone">{aberto.telefone}</LinhaDeCampo>
            <LinhaDeCampo icone={MapPin} rotulo="Cidade">{aberto.cidade}</LinhaDeCampo>
          </ListaDeCampos>
        </PainelLateralCorpo>
      </PainelLateral>
    ) : null
  }
  lateralCheia={Boolean(aberto) && telaCheia}
>
  <DataTable colunas={colunas}>
    {leads.map((l) => (
      <DataTableRow key={l.id} selecionada={l.id === abertoId} aoSelecionar={() => setAbertoId(l.id)}>
        <DataTableCell primeira><CelulaLead nome={l.nome} /></DataTableCell>
      </DataTableRow>
    ))}
  </DataTable>
</TelaBase>`;

const codigoCampos = `<ListaDeCampos>
  <LinhaDeCampo icone={FunnelSimple} rotulo="Etapa">
    <CelulaEscolha
      rotulo="Mudar etapa"
      opcoes={etapas}
      selecionados={[lead.etapa]}
      aoAlternar={(etapa) => editar({ etapa })}
      rotulos={{ busca: "Buscar etapa", vazio: "Nenhuma etapa encontrada" }}
    >
      {lead.etapa}
    </CelulaEscolha>
  </LinhaDeCampo>
  <LinhaDeCampo icone={CurrencyDollar} rotulo="Valor">
    <CelulaEditavel valor={lead.valor} formatar={moeda} inputMode="numeric" rotulo="Editar valor" aoSalvar={(valor) => editar({ valor })} />
  </LinhaDeCampo>
  <LinhaDeCampo icone={Headset} rotulo="Atendente">
    <Tag>{lead.atendente}</Tag>
  </LinhaDeCampo>
</ListaDeCampos>`;

function Campos({ lead, editar }: { lead: Lead; editar: (campos: Partial<Lead>) => void }) {
  return (
    <ListaDeCampos>
      <LinhaDeCampo icone={FunnelSimple} rotulo="Etapa">
        <CelulaEscolha
          rotulo={`Mudar etapa de ${lead.nome}`}
          opcoes={ETAPAS}
          selecionados={[lead.etapa]}
          aoAlternar={(etapa) => editar({ etapa })}
          rotulos={{ busca: "Buscar etapa", vazio: "Nenhuma etapa encontrada" }}
        >
          <span className="truncate">{lead.etapa}</span>
        </CelulaEscolha>
      </LinhaDeCampo>
      <LinhaDeCampo icone={CurrencyDollar} rotulo="Valor">
        <CelulaEditavel valor={lead.valor} formatar={moeda} inputMode="numeric" rotulo={`Editar valor de ${lead.nome}`} aoSalvar={(valor) => editar({ valor })} />
      </LinhaDeCampo>
      <LinhaDeCampo icone={Headset} rotulo="Atendente">
        <Tag>{lead.atendente}</Tag>
      </LinhaDeCampo>
      <LinhaDeCampo icone={Phone} rotulo="Telefone">
        <CelulaEditavel valor={lead.telefone} rotulo={`Editar telefone de ${lead.nome}`} aoSalvar={(telefone) => editar({ telefone })} />
      </LinhaDeCampo>
      <LinhaDeCampo icone={EnvelopeSimple} rotulo="E-mail">
        <CelulaEditavel valor={lead.email} rotulo={`Editar e-mail de ${lead.nome}`} aoSalvar={(email) => editar({ email })} />
      </LinhaDeCampo>
      <LinhaDeCampo icone={Buildings} rotulo="Empresa">
        {lead.empresa}
      </LinhaDeCampo>
      <LinhaDeCampo icone={MapPin} rotulo="Cidade">
        {lead.cidade}
      </LinhaDeCampo>
    </ListaDeCampos>
  );
}

export default function PainelLateralPage() {
  const [leads, setLeads] = useState(LEADS);
  const [abertoId, setAbertoId] = useState<string | null>("1");
  const [telaCheia, setTelaCheia] = useState(false);
  const aberto = leads.find((l) => l.id === abertoId);
  const editar = (id: string, campos: Partial<Lead>) => setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...campos } : l)));

  return (
    <PaginaDS
      titulo="Painel lateral"
      novidade="2026-10-01"
      descricao="O registro aberto ao lado da lista, sem cobri-la: 480px com um traço à esquerda, cabeçalho de 48 e os campos em linha — rótulo à esquerda, valor à direita, 32px por campo. A lista continua à vista, e clicar em outra linha troca o registro."
      secoes={["Como funciona", "Ao lado da lista", "Campos em linha", "Na tela"]}
    >
      <ComoFunciona>
        <p>
          O painel lateral não é uma camada: ele mora <span className="text-foreground">dentro</span> do painel da
          tela, à direita, e empurra a lista em vez de escondê-la. É o mestre-detalhe das ferramentas que o time usa de
          referência — a pessoa percorre a lista com o registro aberto ao lado, e cada clique troca o que o painel
          mostra, sem abrir e fechar nada.
        </p>
        <p>
          Por isso ele não é diálogo. Não escurece a tela, não prende o foco: o foco continua na linha que abriu o
          registro, <Chip>Tab</Chip> entra no painel e <Chip>Escape</Chip>, com o foco dentro, fecha. Quem precisa de
          espaço usa o botão de tela cheia — o painel passa a ocupar a tela e o conteúdo fica numa coluna de leitura.
          Abaixo de 1024px ele já nasce assim: não há lugar para lista e registro lado a lado.
        </p>
        <p>
          A armadilha: o painel não se encaixa sozinho. Quem encolhe a lista e some com ela em tela cheia é a{" "}
          <Chip>TelaBase</Chip>, pelos encaixes <Chip>lateral</Chip> e <Chip>lateralCheia</Chip>. Solto no meio do
          conteúdo, ele é só uma coluna.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Ao lado da lista"
        spec="480px · cabeçalho de 48"
        descricao="Clique num nome para trocar o registro, edite um valor no lugar, e use o botão de expandir para a tela cheia. Aqui o painel tem 360px para caber na coluna da página."
        semCaixa
        semSeletorDeFundo
        nota={
          <>
            O cabeçalho tem a altura do Header da tela: os dois se alinham pelo traço de baixo. O título é o nome do
            registro; <Chip>inicio</Chip> recebe o avatar e <Chip>subtitulo</Chip>, a linha de apoio.
          </>
        }
      >
        <div data-superficie className="flex h-[420px] overflow-hidden rounded-2xl bg-card">
          {/* a lista é a Table do DS: a linha selecionada é o registro aberto */}
          <div className={cn("min-w-0 flex-1 flex-col", aberto ? (telaCheia ? "hidden" : "hidden lg:flex") : "flex")}>
            <DataTable colunas={COLUNAS} className="rounded-none border-0">
              {leads.map((l) => (
                <DataTableRow key={l.id} selecionada={l.id === abertoId} aoSelecionar={() => setAbertoId(l.id)}>
                  <DataTableCell primeira>
                    <CelulaLead nome={l.nome} />
                  </DataTableCell>
                  <DataTableCell ultima className="text-right">
                    <span className="text-label-lg tabular-nums text-foreground">{moeda(l.valor)}</span>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTable>
          </div>
          {aberto ? (
            <PainelLateral
              titulo={aberto.nome}
              subtitulo={
                <>
                  <Buildings size={12} weight="regular" aria-hidden="true" className="shrink-0" />
                  <span className="truncate">{aberto.empresa}</span>
                </>
              }
              inicio={<Avatar nome={aberto.nome} size="sm" aria-hidden="true" className="shrink-0" />}
              largura={360}
              telaCheia={telaCheia}
              aoAlternarTelaCheia={() => setTelaCheia((v) => !v)}
              aoFechar={() => {
                setAbertoId(null);
                setTelaCheia(false);
              }}
              rotulos={rotulos}
            >
              <PainelLateralCorpo>
                <Campos lead={aberto} editar={(campos) => editar(aberto.id, campos)} />
              </PainelLateralCorpo>
            </PainelLateral>
          ) : null}
        </div>
      </Secao>

      <Secao
        titulo="Campos em linha"
        spec="LinhaDeCampo · 32px"
        descricao="Um dado por linha: rótulo com ícone à esquerda, em 144px, e o valor à direita. O valor pode ser texto, uma Tag, ou o controle que edita no lugar — os mesmos da tabela."
        codigo={codigoCampos}
        nota={
          <>
            <Chip>CelulaEditavel</Chip> para texto e número, <Chip>CelulaEscolha</Chip> para o que vem de lista. No
            cartão do drawer cada campo ocupava 68px; em linha são 32 — o dobro de campos na mesma altura.
          </>
        }
      >
        <div className="mx-auto w-full max-w-[420px] rounded-md bg-card p-3">
          <Campos lead={leads[1]} editar={(campos) => editar(leads[1].id, campos)} />
        </div>
      </Secao>

      <Secao
        titulo="Na tela"
        spec="TelaBase · lateral"
        descricao="O painel entra pelo encaixe lateral da TelaBase. A linha selecionada da tabela é o registro aberto; lateralCheia acompanha o botão de tela cheia."
        codigo={codigoNaTela}
        nota={
          <>
            A tela do Pipeline, nas telas de exemplo, usa exatamente este arranjo — no quadro, na lista e no
            calendário.
          </>
        }
      >
        <Legenda>
          Abra a aba Código: é o encaixe inteiro. A tela guarda só duas coisas — qual registro está aberto e se ele
          está em tela cheia.
        </Legenda>
      </Secao>
    </PaginaDS>
  );
}
