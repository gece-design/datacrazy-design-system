"use client";

import { Buildings, CurrencyDollar, EnvelopeSimple, FunnelSimple, Headset, MapPin, Phone, User } from "@phosphor-icons/react";

import { Avatar } from "@/components/ui/avatar";
import { BotaoFechar } from "@/components/ui/button";
import { CelulaEditavel, CelulaEscolha } from "@/components/ui/data-table";
import { AcaoCopiar } from "@/components/ui/input";
import { LinhaDeCampo, ListaDeCampos } from "@/components/ui/painel-lateral";
import { SeletorTags, Tag } from "@/components/ui/tag";
import { rolagemDiscreta } from "@/lib/estados";
import { cn } from "@/lib/utils";
import { ATENDENTES, ETAPAS, GRUPOS_TAGS, moeda, tagsDe, type Conversa, type EtapaId } from "./dados";

/* A coluna do lead: quem é, em que etapa está, quanto vale — ao lado da
   conversa, sem abrir outra tela. Os campos vêm em linha, como no
   `PainelLateral` (rótulo à esquerda, valor à direita), e editam no lugar:
   texto com `CelulaEditavel`, valor de lista com `CelulaEscolha`. */

const ROTULOS_DA_LISTA = { busca: "Buscar", vazio: "Nada encontrado" };
/** A coluna tem 320: o rótulo fica com 96 em vez dos 144 do painel de 480. */
const linha = "[&>dt]:w-24";

export function PainelDoLead({
  conversa,
  aoEditar,
  aoFechar,
  className,
}: {
  conversa: Conversa;
  aoEditar: (campos: Partial<Conversa>) => void;
  /** Abaixo de 1280 o painel abre por cima da conversa e cobre o botão que o abriu: o X fecha. */
  aoFechar: () => void;
  className?: string;
}) {
  const Tipo = conversa.tipo === "empresa" ? Buildings : User;
  return (
    <aside aria-label={`Lead ${conversa.nome}`} className={cn("flex min-h-0 flex-col border-l border-border bg-card", className)}>
      <div className={cn("flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4", rolagemDiscreta)}>
        <div className="flex items-center gap-3">
          <Avatar nome={conversa.nome} size="md" iniciais="duas" className="shrink-0" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 className="truncate text-h4 text-foreground">{conversa.nome}</h2>
            <p className="flex min-w-0 items-center gap-1 text-caption text-muted-foreground">
              <Tipo size={12} weight="regular" aria-hidden="true" className="shrink-0" />
              <span className="truncate">{conversa.empresa}</span>
            </p>
          </div>
          <BotaoFechar rotulo="Fechar o lead" onClick={aoFechar} className="shrink-0 self-start xl:hidden" />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {tagsDe(conversa.tags).map((t) => (
            <Tag key={t.id} status={t.status}>
              {t.rotulo}
            </Tag>
          ))}
          <SeletorTags
            grupos={GRUPOS_TAGS}
            selecionadas={conversa.tags}
            aoAlternar={(t) => aoEditar({ tags: conversa.tags.includes(t.id) ? conversa.tags.filter((x) => x !== t.id) : [...conversa.tags, t.id] })}
            rotulos={{
              gatilho: "Adicionar tag",
              busca: "Buscar tag",
              vazio: "Nenhuma tag nesta aba",
              criar: (t, g) => `Criar "${t}" em ${g}`,
              cor: "Cor da tag",
            }}
          />
        </div>

        <section aria-labelledby="atendimento-negocio" className="flex flex-col gap-1">
          <h3 id="atendimento-negocio" className="text-label-md uppercase text-muted-foreground">
            Negócio
          </h3>
          <ListaDeCampos>
            <LinhaDeCampo icone={FunnelSimple} rotulo="Etapa" className={linha}>
              <CelulaEscolha
                rotulo={`Mudar etapa de ${conversa.nome}`}
                opcoes={ETAPAS.map((e) => ({ valor: e.id, rotulo: e.rotulo }))}
                selecionados={[conversa.etapa]}
                aoAlternar={(v) => aoEditar({ etapa: v as EtapaId })}
                rotulos={ROTULOS_DA_LISTA}
              >
                {ETAPAS.find((e) => e.id === conversa.etapa)?.rotulo}
              </CelulaEscolha>
            </LinhaDeCampo>
            <LinhaDeCampo icone={CurrencyDollar} rotulo="Valor" className={linha}>
              <CelulaEditavel
                valor={String(conversa.valor)}
                formatar={(v) => moeda(Number(v) || 0)}
                inputMode="numeric"
                rotulo={`Editar valor do negócio de ${conversa.nome}`}
                aoSalvar={(v) => aoEditar({ valor: Number(v.replace(/\D/g, "")) || 0 })}
              />
            </LinhaDeCampo>
            <LinhaDeCampo icone={Headset} rotulo="Atendente" className={linha}>
              <CelulaEscolha
                rotulo={`Mudar atendente de ${conversa.nome}`}
                opcoes={ATENDENTES.map((a) => ({ valor: a, rotulo: a }))}
                selecionados={conversa.atendente ? [conversa.atendente] : []}
                aoAlternar={(v) => aoEditar({ atendente: v })}
                rotulos={ROTULOS_DA_LISTA}
              >
                {conversa.atendente ?? <span className="text-subtle-foreground">Sem atendente</span>}
              </CelulaEscolha>
            </LinhaDeCampo>
          </ListaDeCampos>
        </section>

        <section aria-labelledby="atendimento-contato" className="flex flex-col gap-1">
          <h3 id="atendimento-contato" className="text-label-md uppercase text-muted-foreground">
            Contato
          </h3>
          <ListaDeCampos>
            <LinhaDeCampo icone={Phone} rotulo="Telefone" className={linha}>
              <span className="flex items-center gap-1">
                <CelulaEditavel valor={conversa.telefone} rotulo={`Editar telefone de ${conversa.nome}`} aoSalvar={(v) => aoEditar({ telefone: v })} />
                <AcaoCopiar rotulo="Copiar telefone" rotuloCopiado="Telefone copiado" valor={conversa.telefone} />
              </span>
            </LinhaDeCampo>
            <LinhaDeCampo icone={EnvelopeSimple} rotulo="E-mail" className={linha}>
              <span className="flex items-center gap-1">
                <CelulaEditavel valor={conversa.email} rotulo={`Editar e-mail de ${conversa.nome}`} aoSalvar={(v) => aoEditar({ email: v })} />
                <AcaoCopiar rotulo="Copiar e-mail" rotuloCopiado="E-mail copiado" valor={conversa.email} />
              </span>
            </LinhaDeCampo>
            <LinhaDeCampo icone={MapPin} rotulo="Cidade" className={linha}>
              <CelulaEditavel valor={conversa.cidade} rotulo={`Editar cidade de ${conversa.nome}`} aoSalvar={(v) => aoEditar({ cidade: v })} />
            </LinhaDeCampo>
          </ListaDeCampos>
        </section>
      </div>
    </aside>
  );
}
