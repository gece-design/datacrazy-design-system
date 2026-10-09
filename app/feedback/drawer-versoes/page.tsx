"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLineLeft, Buildings, EnvelopeSimple, Phone, Tag as IconeDeTag, User, UserPlus } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerSecao, LinhaDoTempo } from "@/components/ui/drawer";
import { DrawerLead, LEADS, PaginaDoLead, TagsDoLead } from "@/components/ui/drawer-do-lead";
import { LinhaDeCampo, ListaDeCampos, PainelLateral, PainelLateralCorpo } from "@/components/ui/painel-lateral";
import { Tag } from "@/components/ui/tag";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";
import { cn } from "@/lib/utils";

const codigoMenu = `<Drawer aberto={aberto} aoFechar={fechar} rotulo="Lead Rafael Pinto Pinheiro">
  <DrawerLead dados={dados} secoes={secoes} tags={tags} aoFechar={fechar} memoria="leads-lead" />
</Drawer>`;

const codigoAbas = `<Drawer aberto={aberto} aoFechar={fechar} rotulo="Lead Rafael Pinto Pinheiro">
  <DrawerLead layout="abas" dados={dados} secoes={secoes} tags={tags} aoFechar={fechar} memoria="leads-lead-abas" />
</Drawer>`;

const codigoLado = `<TelaBase
  navegacao={navegacao}
  cabecalho={{ titulo: "Leads" }}
  lateral={
    aberto ? (
      <PainelLateral titulo={aberto.nome} inicio={<Avatar nome={aberto.nome} size="sm" tom="auto" />} telaCheia={cheio} aoAlternarTelaCheia={alternar} aoFechar={fechar} rotulos={rotulos}>
        <PainelLateralCorpo>
          <ListaDeCampos>
            <LinhaDeCampo icone={Phone} rotulo="Telefone">{aberto.telefone}</LinhaDeCampo>
          </ListaDeCampos>
        </PainelLateralCorpo>
      </PainelLateral>
    ) : undefined
  }
  lateralCheia={cheio}
>
  <DataTable colunas={colunas}>{linhas}</DataTable>
</TelaBase>`;

const codigoPagina = `// no lugar da lista; o Header passa a mostrar o nome do lead e "Voltar aos leads"
{aberto ? <PaginaDoLead dados={dados} secoes={secoes} tags={tags} aoFechar={fechar} /> : <DataTable colunas={colunas}>{linhas}</DataTable>}`;

type Linha = { versao: string; abre: string; largura: string; lista: string; secoes: string; favorece: string };

const comparacao: Linha[] = [
  { versao: "Com menu (atual)", abre: "Por cima da tela, pela direita", largura: "840, arrasta até 1080", lista: "Fica atrás do scrim", secoes: "12 no menu, uma à vista", favorece: "Quem trabalha o lead por um tempo: perfil, métricas e menu sempre à vista" },
  { versao: "Com abas", abre: "Por cima da tela, pela direita", largura: "720", lista: "Fica atrás do scrim", secoes: "4 abas, várias à vista", favorece: "Quem quer ver mais de uma coisa junto, com menos largura" },
  { versao: "Ao lado da lista", abre: "Dentro da tela, empurra a lista", largura: "480; tela cheia por botão", lista: "Continua à vista e clicável", secoes: "Campos em linha e histórico", favorece: "Triagem rápida: passar lead a lead sem fechar nada" },
  { versao: "Em página", abre: "No lugar da lista", largura: "A tela inteira", lista: "Some; volta pelo botão", secoes: "4 abas ao lado do perfil", favorece: "Trabalho longo num lead, com tudo aberto e espaço" },
];

/** A versão ao lado, ao vivo: uma lista curta e o painel do lead do arquivo. */
function ExemploLado() {
  const nomes = ["Rafael Pinto Pinheiro", "Joel Jota", "Marina Alvarenga", "Construtora Horizonte", "Camila Ferraz"];
  const [aberto, setAberto] = React.useState<string | null>(nomes[0]);
  const [cheio, setCheio] = React.useState(false);
  const lead = LEADS.rafael;
  return (
    <div data-superficie className="flex h-[520px] w-full overflow-hidden rounded-2xl bg-card">
      <div className={cn("min-w-0 flex-1 flex-col", aberto ? (cheio ? "hidden" : "hidden lg:flex") : "flex")}>
        <ul className="divide-y divide-border">
          {nomes.map((n) => (
            <li key={n}>
              <Button
                variant="ghost"
                aria-current={aberto === n ? "true" : undefined}
                onClick={() => setAberto(n)}
                className={cn("h-9 w-full justify-start gap-2 rounded-none px-3 text-label-lg", aberto === n && "bg-accent text-primary")}
              >
                <Avatar nome={n} size="xs" aria-hidden="true" />
                {n}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {aberto ? (
        <PainelLateral
          titulo={aberto}
          subtitulo={
            <>
              <Buildings size={12} weight="regular" aria-hidden="true" className="shrink-0" />
              <span className="truncate">Pinheiro Advocacia</span>
            </>
          }
          inicio={<Avatar nome={aberto} size="sm" tom="auto" iniciais="duas" aria-hidden="true" className="shrink-0" />}
          largura={400}
          telaCheia={cheio}
          aoAlternarTelaCheia={() => setCheio((v) => !v)}
          aoFechar={() => {
            setAberto(null);
            setCheio(false);
          }}
          rotulos={{ fechar: `Fechar ${aberto}`, expandir: "Abrir em tela cheia", recolher: "Voltar ao painel" }}
        >
          <PainelLateralCorpo>
            <ListaDeCampos>
              <LinhaDeCampo icone={User} rotulo="Tipo">
                <Tag tipo="pessoa">Pessoa</Tag>
              </LinhaDeCampo>
              <LinhaDeCampo icone={Phone} rotulo="Telefone">
                {lead.telefone}
              </LinhaDeCampo>
              <LinhaDeCampo icone={EnvelopeSimple} rotulo="E-mail">
                {lead.email}
              </LinhaDeCampo>
              <LinhaDeCampo icone={IconeDeTag} rotulo="Tags">
                <div className="flex flex-wrap items-center gap-1">
                  <TagsDoLead iniciais={lead.tags} />
                </div>
              </LinhaDeCampo>
            </ListaDeCampos>
            <DrawerSecao titulo="Histórico">
              <LinhaDoTempo eventos={[{ id: "criado", titulo: "Lead criado", detalhes: ["Origem: WhatsApp", "16 jan 2026"], icone: UserPlus }]} />
            </DrawerSecao>
          </PainelLateralCorpo>
        </PainelLateral>
      ) : null}
    </div>
  );
}

export default function Pagina() {
  const [menu, setMenu] = React.useState(false);
  const [abas, setAbas] = React.useState(false);
  return (
    <PaginaDS
      titulo="Versões do lead"
      novidade="2026-10-09"
      descricao="Quatro jeitos de abrir o mesmo lead, com as mesmas peças e o mesmo conteúdo: no drawer com o menu de seções (o atual), no drawer com abas, ao lado da lista e como página. Estão no protótipo para o time comparar e escolher."
      secoes={["As quatro versões", "Com menu", "Com abas", "Ao lado da lista", "Em página", "Na tela", "Como funciona", "Quando usar"]}
    >
      <Secao titulo="As quatro versões" spec="o mesmo lead · as mesmas peças · quatro cascas" semCaixa novidade="2026-10-09">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-body-md">
            <thead className="bg-muted text-label-lg text-foreground">
              <tr>
                <th className="px-4 py-3">Versão</th>
                <th className="px-4 py-3">Onde abre</th>
                <th className="px-4 py-3">Largura</th>
                <th className="px-4 py-3">A lista</th>
                <th className="px-4 py-3">As seções</th>
                <th className="px-4 py-3">Favorece</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              {comparacao.map((l) => (
                <tr key={l.versao}>
                  <td className="px-4 py-3 text-foreground">{l.versao}</td>
                  <td className="px-4 py-3">{l.abre}</td>
                  <td className="px-4 py-3">{l.largura}</td>
                  <td className="px-4 py-3">{l.lista}</td>
                  <td className="px-4 py-3">{l.secoes}</td>
                  <td className="px-4 py-3">{l.favorece}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Secao>

      <Secao
        titulo="Com menu"
        spec="o atual · 840 · perfil + menu de 12 seções"
        descricao="O drawer de hoje: a coluna do perfil com avatar, contato, tags, métricas e o menu de doze seções; o conteúdo da seção escolhida à direita. Abre por cima da tela, pela direita, e a pessoa arrasta a largura."
        codigo={codigoMenu}
      >
        <div className="flex justify-center py-6">
          <Button onClick={() => setMenu(true)}>
            <ArrowLineLeft size={16} weight="regular" />
            Abrir com menu
          </Button>
        </div>
        <Drawer aberto={menu} aoFechar={() => setMenu(false)} rotulo="Lead Rafael Pinto Pinheiro">
          <DrawerLead lead="rafael" aoFechar={() => setMenu(false)} className="rounded-none" />
        </Drawer>
      </Secao>

      <Secao
        titulo="Com abas"
        spec="720 · perfil compacto · 4 abas"
        descricao="Sem a coluna do perfil: avatar, nome, contato, tags e as quatro métricas num cabeçalho compacto, e as doze seções em quatro abas — Perfil, Relacionamento, Vínculos e Documentos. Cada aba empilha as seções do grupo, então mais de uma fica à vista."
        codigo={codigoAbas}
        novidade="2026-10-09"
        nota={
          <>
            As abas são as <Chip>Tabs</Chip> do DS e os grupos estão em <Chip>GRUPOS_DO_LEAD</Chip>. A seção que a tela
            passa em <Chip>secoes</Chip> entra no grupo dela, como no menu. É 120px mais estreito que o atual.
          </>
        }
      >
        <div className="flex justify-center py-6">
          <Button onClick={() => setAbas(true)}>
            <ArrowLineLeft size={16} weight="regular" />
            Abrir com abas
          </Button>
        </div>
        <Drawer aberto={abas} aoFechar={() => setAbas(false)} rotulo="Lead Rafael Pinto Pinheiro">
          <DrawerLead lead="rafael" layout="abas" aoFechar={() => setAbas(false)} className="rounded-none" />
        </Drawer>
      </Secao>

      <Secao
        titulo="Ao lado da lista"
        spec="PainelLateral · 480 · empurra a lista"
        descricao="A versão que a reunião de 2 de outubro lembrou: o lead abre dentro da tela, ao lado da lista, que continua à vista e clicável — clicar em outro nome troca o lead sem fechar nada. Campos em linha, as tags e o histórico; o botão do cabeçalho abre em tela cheia."
        codigo={codigoLado}
        novidade="2026-10-09"
        semSeletorDeFundo
        nota={
          <>
            É o <Chip>PainelLateral</Chip> que já existe no DS, encaixado em <Chip>lateral</Chip> da <Chip>TelaBase</Chip>.
            Não é diálogo: não prende o foco nem escurece a tela. Abaixo de 1024px ocupa a janela.
          </>
        }
      >
        <ExemploLado />
      </Secao>

      <Secao
        titulo="Em página"
        spec="no lugar da lista · perfil 360 + abas"
        descricao="O lead como uma página da tela: o perfil do drawer numa coluna à esquerda, com métricas, e as seções em abas à direita, com todo o espaço. O Header passa a mostrar o nome do lead; o X do perfil e o botão do Header voltam à lista."
        codigo={codigoPagina}
        novidade="2026-10-09"
        semSeletorDeFundo
      >
        <div data-superficie className="flex h-[720px] w-full overflow-hidden rounded-2xl bg-muted">
          <PaginaDoLead lead="joel" />
        </div>
        <Legenda>
          As mesmas peças do drawer (<Chip>DrawerPerfil</Chip>, <Chip>DrawerMetricas</Chip>, <Chip>AbasDoLead</Chip>) em dois
          blocos brancos sobre o cinza da tela, como qualquer conteúdo do CRM.
        </Legenda>
      </Secao>

      <Secao
        titulo="Na tela"
        spec="/prototipo?tela=leads&lead=abas · lado · cheia"
        descricao="As quatro versões estão na tela de Leads do protótipo, com os leads de verdade: clique num nome. Sem o parâmetro, abre a atual."
        semSeletorDeFundo
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            A escolha fica na URL: dá para mandar o link de cada versão para quem vai opinar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/prototipo?tela=leads">Com menu (atual)</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=leads&lead=abas">Com abas</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=leads&lead=lado">Ao lado da lista</Link>
            </Button>
            <Button asChild variant="tertiary">
              <Link href="/prototipo?tela=leads&lead=cheia">Em página</Link>
            </Button>
          </div>
        </div>
      </Secao>

      <ComoFunciona>
        <p>
          Na reunião de 2 de outubro, o drawer do lead não convenceu (&quot;não gostei, não sei dizer por quê&quot;), e
          veio a lembrança do lead abrindo ao lado da lista. Em vez de discutir no abstrato, as versões estão prontas
          para comparar na tela, com os leads de verdade (ADR-081). Nenhuma troca o padrão: o lead continua abrindo
          no drawer com menu em toda tela até a decisão.
        </p>
        <p>
          As quatro usam as mesmas peças e o mesmo conteúdo. O perfil é o <Chip>DrawerPerfil</Chip>; as métricas, o{" "}
          <Chip>DrawerMetricas</Chip>; as seções são as mesmas doze, e a tela entrega as suas (Histórico e Perfil com o
          dado do lead) uma vez só, em <Chip>secoes</Chip>. O que muda é a casca: a coluna com menu, o cabeçalho com
          abas, o painel que empurra a lista ou a página.
        </p>
        <p>
          A armadilha é ter dois padrões: cada versão parece boa num caso. Ao lado da lista é melhor para triagem
          (passar lead a lead); a página, para trabalho longo; o drawer, para o meio. O CRM escolhe uma como
          padrão, e a outra, se ficar, entra por um botão (&quot;tela cheia&quot;, &quot;abrir ao lado&quot;), não por
          tela.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Para a decisão: o que cada versão favorece e o que cobra.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Com menu</span> favorece o trabalho demorado num lead: tudo à vista, uma
            seção por vez. Cobra 840px e esconde a lista.
          </li>
          <li>
            <span className="text-foreground">Com abas</span> favorece ver seções juntas em menos largura. Cobra um
            clique de aba para achar a seção, sem o menu inteiro à vista.
          </li>
          <li>
            <span className="text-foreground">Ao lado da lista</span> favorece triagem: lead a lead sem fechar. Cobra
            espaço da lista e cabe menos por linha.
          </li>
          <li>
            <span className="text-foreground">Em página</span> favorece espaço e foco. Cobra sair da lista e voltar.
          </li>
          <li>
            <span className="text-foreground">Não use</span> duas versões como padrão em telas diferentes: o lead é um
            só, e abre do mesmo jeito em toda tela.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
