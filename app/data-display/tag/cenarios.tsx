"use client";

import * as React from "react";
import {
  CalendarBlank,
  Globe,
  Handshake,
  InstagramLogo,
  Package,
  PuzzlePiece,
  User,
  WhatsappLogo,
  Wrench,
} from "@phosphor-icons/react";
import { SeletorTags, Tag, tomDe, type GrupoTags, type OpcaoTag, type SeletorTagsProps } from "@/components/ui/tag";

/**
 * O seletor não sabe o que é "tag": `grupos` é conteúdo. Estes três cenários
 * (pedido do cliente, 2026-09-21) mostram o mesmo componente com outra carga —
 * produtos de uma proposta, responsáveis por um negócio, origem de um lead.
 * Cada um decide sozinho o que faz sentido: onde a cor é regra, onde é
 * escolha (`corLivre`), e onde não existe criar (gente não nasce num campo).
 */

/* --------------------------------------------------- 1 · Produtos -- */

export const PRODUTOS: GrupoTags[] = [
  {
    id: "planos",
    rotulo: "Planos",
    tags: [
      // Um plano por proposta seria Select. Vários, com add-ons, é lista — e o
      // tom acompanha o degrau, do mais simples ao mais completo.
      { id: "starter", rotulo: "Starter", tom: "ciano", icone: Package },
      { id: "pro", rotulo: "Pro", tom: "azul", icone: Package },
      { id: "enterprise", rotulo: "Enterprise", tom: "roxo", icone: Package },
    ],
  },
  {
    id: "servicos",
    rotulo: "Serviços",
    corLivre: true,
    tags: [
      { id: "onboarding", rotulo: "Onboarding", tom: tomDe("onboarding"), icone: Wrench },
      { id: "consultoria", rotulo: "Consultoria", tom: tomDe("consultoria"), icone: Wrench },
      { id: "treinamento", rotulo: "Treinamento", tom: tomDe("treinamento"), icone: Wrench },
    ],
  },
  {
    id: "addons",
    rotulo: "Add-ons",
    corLivre: true,
    tags: [
      { id: "api-whatsapp", rotulo: "API WhatsApp", tom: "verde", icone: PuzzlePiece },
      { id: "usuarios-extras", rotulo: "Usuários extras", tom: tomDe("usuarios-extras"), icone: PuzzlePiece },
      { id: "armazenamento", rotulo: "Armazenamento", tom: tomDe("armazenamento"), icone: PuzzlePiece },
    ],
  },
];

export const ROTULOS_PRODUTOS: SeletorTagsProps["rotulos"] = {
  gatilho: "Adicionar produto",
  busca: "Buscar ou criar produto",
  vazio: "Nenhum produto nesta aba",
  criar: (texto, grupo) => `Criar "${texto}" em ${grupo}`,
  cor: "Cor", icone: "Ícone"
};

/* ----------------------------------------------- 2 · Responsáveis -- */

export const RESPONSAVEIS: GrupoTags[] = [
  {
    id: "vendas",
    rotulo: "Vendas",
    tags: [
      // Pessoa não leva tom: a foto distingue; sem foto, o ícone segura o lugar.
      { id: "esther", rotulo: "Esther", foto: "/ds/atendente.png" },
      { id: "liam", rotulo: "Liam", foto: "/ds/atendente-2.svg" },
      { id: "camila", rotulo: "Camila", foto: "/ds/atendente-3.svg" },
    ],
  },
  {
    id: "suporte",
    rotulo: "Suporte",
    tags: [
      { id: "diego", rotulo: "Diego", foto: "/ds/atendente-4.svg" },
      { id: "marina", rotulo: "Marina", icone: User },
    ],
  },
  {
    id: "gestao",
    rotulo: "Gestão",
    tags: [{ id: "rafael", rotulo: "Rafael", icone: User }],
  },
];

export const ROTULOS_RESPONSAVEIS: SeletorTagsProps["rotulos"] = {
  gatilho: "Adicionar responsável",
  busca: "Buscar pessoa",
  vazio: "Ninguém neste time",
  // nunca aparece: responsável não se cria aqui (sem `aoCriar`)
  criar: (texto) => `Convidar "${texto}"`,
  cor: "Cor", icone: "Ícone"
};

/* ----------------------------------------------------- 3 · Origem -- */

export const ORIGEM: GrupoTags[] = [
  {
    id: "canal",
    rotulo: "Canal",
    tags: [
      // Canal é catálogo fechado: cor e ícone são regra, como o status do lead.
      { id: "instagram", rotulo: "Instagram", tom: "rosa", icone: InstagramLogo },
      { id: "whatsapp", rotulo: "WhatsApp", tom: "verde", icone: WhatsappLogo },
      { id: "site", rotulo: "Site", tom: "azul", icone: Globe },
      { id: "indicacao", rotulo: "Indicação", tom: "ambar", icone: Handshake },
      { id: "evento", rotulo: "Evento", tom: "roxo", icone: CalendarBlank },
    ],
  },
  {
    id: "campanha",
    rotulo: "Campanha",
    corLivre: true,
    tags: [
      { id: "black-friday-2026", rotulo: "Black Friday 2026", tom: tomDe("black-friday-2026") },
      { id: "webinar-setembro", rotulo: "Webinar setembro", tom: tomDe("webinar-setembro") },
      { id: "lancamento-pro", rotulo: "Lançamento Pro", tom: tomDe("lancamento-pro") },
    ],
  },
];

export const ROTULOS_ORIGEM: SeletorTagsProps["rotulos"] = {
  gatilho: "Adicionar origem",
  busca: "Buscar ou criar campanha",
  vazio: "Nada nesta aba",
  criar: (texto, grupo) => `Criar "${texto}" em ${grupo}`,
  cor: "Cor", icone: "Ícone"
};

/* ------------------------------------------------------- Fileira -- */

function escolhidas(grupos: GrupoTags[], ids: string[]): OpcaoTag[] {
  const todas = grupos.flatMap((g) => g.tags);
  return ids.map((id) => todas.find((t) => t.id === id)).filter((t): t is OpcaoTag => Boolean(t));
}

/**
 * A fileira de um cenário: as escolhidas como `Tag` e o seletor no fim. O
 * mesmo par do perfil do lead (`TagsDoLead`), com o conteúdo vindo de fora.
 * `criar` desligado = a busca só filtra.
 */
export function FileiraDeTags({
  grupos: iniciaisGrupos,
  iniciais,
  rotulos,
  criar = true,
}: {
  grupos: GrupoTags[];
  iniciais: string[];
  rotulos: SeletorTagsProps["rotulos"];
  criar?: boolean;
}) {
  const [grupos, setGrupos] = React.useState(iniciaisGrupos);
  const [ids, setIds] = React.useState(iniciais);

  return (
    <>
      {escolhidas(grupos, ids).map((t) => (
        <Tag key={t.id} status={t.status} foto={t.foto} tom={t.tom} icone={t.icone}>
          {t.rotulo}
        </Tag>
      ))}
      <SeletorTags
        grupos={grupos}
        selecionadas={ids}
        aoAlternar={(t) => setIds((atuais) => (atuais.includes(t.id) ? atuais.filter((x) => x !== t.id) : [...atuais, t.id]))}
        aoCriar={
          criar
            ? (rotulo, grupoId, tom) => {
                const id = `${grupoId}-${Date.now()}`;
                setGrupos((gs) => gs.map((g) => (g.id === grupoId ? { ...g, tags: [...g.tags, { id, rotulo, tom }] } : g)));
                setIds((atuais) => [...atuais, id]);
              }
            : undefined
        }
        rotulos={rotulos}
      />
    </>
  );
}
