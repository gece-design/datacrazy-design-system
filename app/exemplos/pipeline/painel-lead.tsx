"use client";

import * as React from "react";
import {
  ArrowsClockwise,
  CalendarCheck,
  ChatCircleDots,
  CurrencyCircleDollar,
  EnvelopeSimple,
  FileText,
  MapPin,
  Note,
  Phone,
  Play,
  Plus,
  SidebarSimple,
  User,
  Wallet,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { AcaoCopiar, CampoEditavel } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SeletorTags, Tag } from "@/components/ui/tag";
import {
  DrawerBloco,
  DrawerBotaoCanto,
  DrawerConteudo,
  DrawerContato,
  DrawerMenu,
  DrawerMetricas,
  DrawerPainel,
  DrawerPerfil,
  DrawerSecao,
  LinhaDoTempo,
} from "@/components/ui/drawer";
// O MESMO menu e os MESMOS conteúdos da página do Drawer no design system.
// Nada aqui é uma segunda versão deles: é a importação da primeira.
import { MENU_LEAD, cabecalhos } from "@/app/feedback/drawer/drawer-lead";
import {
  GRUPOS_TAGS,
  moeda,
  tagsDe,
  type Etapa,
  type EtapaId,
  type Lead,
  type TipoEvento,
} from "./dados";

const glifos: Record<TipoEvento, Icon> = {
  mensagem: ChatCircleDots,
  ligacao: Phone,
  proposta: FileText,
  reuniao: CalendarCheck,
  nota: Note,
};

/**
 * O lead aberto. É o Drawer do design system montado como no showcase —
 * mesmo perfil, mesmas quatro métricas (com os tons do arquivo), mesmo menu de
 * doze seções — alimentado com o lead que o cliente clicou no quadro.
 *
 * Duas seções mostram o dado DESTE lead em vez do dado do arquivo, porque um
 * cartão não pode abrir o histórico nem o cadastro de outra pessoa: Históricos
 * e Perfil. Ambas usam os mesmos componentes do showcase. O resto do menu é o
 * conteúdo do arquivo, sem alteração.
 */
export function PainelLead({
  etapas,
  lead,
  aoFechar,
  aoMudarEtapa,
  aoEditar,
  aoTrocarTags,
}: {
  etapas: Etapa[];
  lead: Lead;
  aoFechar: () => void;
  aoMudarEtapa: (etapa: EtapaId) => void;
  aoEditar: (campos: Partial<Lead>) => void;
  aoTrocarTags: (ids: string[]) => void;
}) {
  const [secao, setSecao] = React.useState("historicos");
  const [fixados, setFixados] = React.useState<string[]>([]);
  const [perfilAberto, setPerfilAberto] = React.useState(true);
  // Tag criada no seletor entra no catálogo da conta e já sai marcada.
  const [grupos, setGrupos] = React.useState(GRUPOS_TAGS);

  const desenhado = cabecalhos[secao];
  const item = MENU_LEAD.find((m) => m.id === secao) ?? MENU_LEAD[0];
  const Corpo = desenhado?.Corpo;

  /** Valor em reais escrito à mão ("18.400", "R$ 18400") vira número. */
  function salvarValor(texto: string) {
    const n = Number(texto.replace(/[^\d]/g, ""));
    if (Number.isFinite(n) && n > 0) aoEditar({ valor: n });
  }

  return (
    <DrawerPainel className="rounded-none">
      {perfilAberto ? (
        <DrawerPerfil
          nome={lead.nome}
          tipo={lead.tipo}
          tom={lead.tom}
          rotuloTipo={lead.tipo === "empresa" ? "Empresa" : "Pessoa"}
          telefone={lead.telefone}
          email={lead.email}
          aoFechar={aoFechar}
          aoRecolher={() => setPerfilAberto(false)}
          tags={
            <>
              <Tag foto="/ds/atendente.png">{lead.responsavel}</Tag>
              {tagsDe(grupos, lead.tags).map((t) => (
                <Tag key={t.id} status={t.status}>
                  {t.rotulo}
                </Tag>
              ))}
              <SeletorTags
                grupos={grupos}
                selecionadas={lead.tags}
                aoAlternar={(t) =>
                  aoTrocarTags(lead.tags.includes(t.id) ? lead.tags.filter((x) => x !== t.id) : [...lead.tags, t.id])
                }
                aoCriar={(rotulo, grupoId, tom) => {
                  const id = `${grupoId}-${Date.now()}`;
                  setGrupos((gs) => gs.map((g) => (g.id === grupoId ? { ...g, tags: [...g.tags, { id, rotulo, tom }] } : g)));
                  aoTrocarTags([...lead.tags, id]);
                }}
                rotulos={{
                  gatilho: "Adicionar tag",
                  busca: "Buscar ou criar tag",
                  vazio: "Nenhuma tag nesta aba",
                  criar: (texto, grupo) => `Criar "${texto}" em ${grupo}`,
                  cor: "Cor",
                }}
              />
            </>
          }
          acoes={
            <>
              <Button>
                <Play size={16} weight="regular" />
                Automação
              </Button>
              <Button variant="soft">
                <Plus size={16} weight="regular" />
                Atendimento
              </Button>
            </>
          }
        >
          {/* As quatro do arquivo, com os tons do arquivo (565:5959). */}
          <DrawerBloco titulo="Métricas">
            <DrawerMetricas
              itens={[
                { rotulo: "Ticket médio", valor: moeda(lead.valor), icone: CurrencyCircleDollar, tom: "azul" },
                { rotulo: "Total", valor: moeda(lead.totalCompras), icone: Wallet, tom: "roxo" },
                { rotulo: "Ciclo de compra", valor: `${lead.cicloDias}d`, icone: ArrowsClockwise, tom: "rosa" },
                { rotulo: "Última compra", valor: `${lead.dias}d`, icone: CalendarCheck, tom: "laranja" },
              ]}
            />
          </DrawerBloco>

          <DrawerBloco titulo="Contato principal">
            <DrawerContato
              linhas={[
                { texto: lead.empresa, icone: User, rotulo: "Empresa" },
                { texto: lead.telefone, icone: Phone, rotulo: "Telefone" },
                { texto: lead.email, icone: EnvelopeSimple, rotulo: "E-mail" },
              ].filter((l) => l.texto.trim() !== "")}
            />
          </DrawerBloco>

          <DrawerBloco titulo="Menu">
            <DrawerMenu
              rotulo="Seções do lead"
              itens={MENU_LEAD}
              atual={secao}
              aoEscolher={setSecao}
              fixacao={{
                fixados,
                aoAlternar: (id) =>
                  setFixados((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])),
                rotuloFixar: (i) => `Fixar ${i.rotulo} no topo`,
                rotuloDesafixar: (i) => `Desafixar ${i.rotulo}`,
              }}
            />
          </DrawerBloco>
        </DrawerPerfil>
      ) : null}

      <DrawerConteudo
        titulo={desenhado?.titulo ?? item.rotulo}
        descricao={desenhado?.descricao}
        antesDoTitulo={
          perfilAberto ? null : (
            <DrawerBotaoCanto rotulo="Mostrar perfil" onClick={() => setPerfilAberto(true)} className="bg-background">
              <SidebarSimple size={12} weight="regular" aria-hidden="true" />
            </DrawerBotaoCanto>
          )
        }
        acoes={
          <Button variant="soft">
            <ChatCircleDots size={16} weight="regular" />
            Comentário
          </Button>
        }
      >
        {secao === "historicos" ? (
          // Mesma LinhaDoTempo do showcase, com os eventos DESTE lead.
          <LinhaDoTempo eventos={lead.historico.map((h) => ({ ...h, icone: glifos[h.tipo] }))} />
        ) : secao === "perfil" ? (
          // Mesmo grid de CampoEditavel do showcase, com os campos DESTE lead:
          // clicar abre, Enter salva e o cartão do quadro muda junto.
          <>
            <DrawerSecao titulo="Dados cadastrais">
              <div className="grid grid-cols-3 gap-3">
                <CampoEditavel
                  rotulo="Nome"
                  valor={lead.nome}
                  aoSalvar={(v) => aoEditar({ nome: v })}
                  rotuloEditar="Editar nome do lead"
                  textoVazio="Adicionar"
                />
                <CampoEditavel
                  rotulo="Empresa"
                  valor={lead.empresa}
                  aoSalvar={(v) => aoEditar({ empresa: v })}
                  rotuloEditar="Editar empresa"
                  textoVazio="Adicionar"
                />
                <CampoEditavel
                  rotulo="Cidade"
                  valor={lead.cidade}
                  aoSalvar={(v) => aoEditar({ cidade: v })}
                  rotuloEditar="Editar cidade"
                  textoVazio="Adicionar"
                  iconeInicio={MapPin}
                />
                <CampoEditavel
                  rotulo="Valor do negócio"
                  valor={moeda(lead.valor)}
                  aoSalvar={salvarValor}
                  rotuloEditar="Editar valor do negócio"
                  textoVazio="R$ 0"
                  inputMode="numeric"
                />
                <CampoEditavel
                  rotulo="Atendente"
                  valor={lead.responsavel}
                  aoSalvar={(v) => aoEditar({ responsavel: v })}
                  rotuloEditar="Editar atendente"
                  textoVazio="Adicionar"
                />
                <CampoEditavel
                  rotulo="Origem"
                  valor={lead.canal}
                  aoSalvar={(v) => aoEditar({ canal: v as Lead["canal"] })}
                  rotuloEditar="Editar origem"
                  textoVazio="Adicionar"
                />
              </div>
            </DrawerSecao>

            <DrawerSecao titulo="Contato">
              <div className="grid grid-cols-3 gap-3">
                <CampoEditavel
                  rotulo="Telefone"
                  valor={lead.telefone}
                  aoSalvar={(v) => aoEditar({ telefone: v })}
                  rotuloEditar="Editar telefone"
                  textoVazio="Adicionar"
                  acoes={<AcaoCopiar rotulo="Copiar telefone" rotuloCopiado="Telefone copiado" valor={lead.telefone} />}
                />
                <CampoEditavel
                  rotulo="E-mail"
                  valor={lead.email}
                  aoSalvar={(v) => aoEditar({ email: v })}
                  rotuloEditar="Editar e-mail"
                  textoVazio="Adicionar"
                  acoes={<AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={lead.email} />}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-label-md text-input-label">Etapa do funil</span>
                  <Select
                    rotulo="Etapa do funil"
                    opcoes={etapas.map((e) => ({ valor: e.id, rotulo: e.rotulo }))}
                    valor={lead.etapa}
                    aoEscolher={(v) => aoMudarEtapa(v as EtapaId)}
                    className="w-full"
                  />
                </div>
              </div>
            </DrawerSecao>
          </>
        ) : Corpo ? (
          <Corpo />
        ) : (
          <p className="text-body-md text-muted-foreground">
            O arquivo ainda não desenha o conteúdo de {item.rotulo}.
          </p>
        )}
      </DrawerConteudo>
    </DrawerPainel>
  );
}
