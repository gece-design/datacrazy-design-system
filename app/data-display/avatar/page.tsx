"use client";

import { Avatar } from "@/components/ui/avatar";
import { Tag } from "@/components/ui/tag";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

const tamanhos = [
  { size: "sm" as const, medida: "32px", anel: "4px", texto: "label-md", fundo: "accent · anel card" },
  { size: "md" as const, medida: "48px", anel: "6px", texto: "heading-3", fundo: "--avatar-md-fundo · --avatar-md-anel" },
  { size: "lg" as const, medida: "90px", anel: "10px", texto: "29,25/36 semibold", fundo: "card · anel accent" },
];

export default function AvatarPage() {
  return (
    <PaginaDS
      titulo="Avatar"
      descricao="A inicial num disco com anel, em três tamanhos: 32, 48 e 90px. Com foto, a foto ocupa o disco. A cor da letra é a do item selecionado da navegação."
      secoes={["Como funciona", "Tamanhos", "Com foto", "Em contexto", "Quando usar"]}
    >
      <ComoFunciona>
        <p>
          O componente recebe o <Chip>nome</Chip>, não a letra. A inicial sai dele — a primeira letra, ignorando o que
          não é letra, então <Chip>[ENV] Ana</Chip> vira <Chip>A</Chip> — e o nome inteiro vira o rótulo do leitor de
          tela. Quando o nome já está escrito ao lado, passe <Chip>aria-hidden</Chip> para não ser lido duas vezes.
        </p>
        <p>
          O anel é <Chip>border</Chip>. Como o <Chip>size-*</Chip> já inclui a borda, o disco fecha no tamanho do
          arquivo sem a conta da regra D14. A letra usa <Chip>nav/item/text-selected</Chip>, que é azul escuro no
          claro e azul claro no escuro.
        </p>
        <p>
          O tamanho <Chip>md</Chip> é o único que troca os papéis entre os temas: no claro o disco é{" "}
          <Chip>accent</Chip> com anel <Chip>card</Chip>; no escuro, o contrário. Em vez de uma prop de tema, isso
          mora em dois tokens de componente, <Chip>--avatar-md-fundo</Chip> e <Chip>--avatar-md-anel</Chip> — mesmo
          caso do <Chip>--sidebar-avatar</Chip>.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Tamanhos"
        spec="32 · 48 · 90px"
        descricao="Pequeno para lista e tag, médio para empresa e nó da hierarquia, grande só no topo do perfil."
        codigo={`<Avatar nome="Rafael Pinto Pinheiro" size="sm" />
<Avatar nome="Rafael Pinto Pinheiro" size="md" />
<Avatar nome="Rafael Pinto Pinheiro" size="lg" />`}
        nota={
          <ul className="space-y-1.5">
            {tamanhos.map((t) => (
              <li key={t.size}>
                <span className="font-mono text-foreground">size=&quot;{t.size}&quot;</span> — {t.medida} · anel {t.anel}{" "}
                · {t.texto} · {t.fundo}
              </li>
            ))}
          </ul>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-6 py-4">
          {tamanhos.map((t) => (
            <Avatar key={t.size} nome="Rafael Pinto Pinheiro" size={t.size} />
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Com foto"
        spec="src"
        descricao="A foto preenche o disco e o anel continua. Sem foto, volta a inicial."
        codigo={`<Avatar nome="Esther Lima" src="/fotos/esther.png" size="md" />`}
      >
        <div className="flex flex-wrap items-center justify-center gap-6 py-4">
          <Avatar nome="Esther Lima" src="/ds/atendente.png" size="sm" />
          <Avatar nome="Esther Lima" src="/ds/atendente.png" size="md" />
          <Avatar nome="Esther Lima" size="md" />
        </div>
      </Secao>

      <Secao
        titulo="Em contexto"
        descricao="Os três lugares onde o arquivo usa o avatar: empresa com nome ao lado, o topo do perfil do drawer e a tag do atendente."
        codigo={`<div className="flex items-center gap-2">
  <Avatar nome="Jojota Podcast LTDA." size="md" aria-hidden="true" />
  <p className="text-label-lg text-foreground">Jojota Podcast LTDA.</p>
</div>`}
        nota={
          <>
            A tag do atendente não usa o Avatar: a foto ali tem 22px e não tem anel. Ela mora na{" "}
            <Chip>Tag</Chip>, pela prop <Chip>foto</Chip>.
          </>
        }
      >
        {/* Os três contextos são superfície `card` no produto — o anel do
            avatar e a pílula da tag só existem contra ela. */}
        <div className="flex flex-wrap items-center justify-around gap-8 rounded-md bg-card p-5">
          <div className="flex items-center gap-2">
            <Avatar nome="Jojota Podcast LTDA." size="md" aria-hidden="true" />
            <p className="text-label-lg text-foreground">Jojota Podcast LTDA.</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Avatar nome="Joel Jota" size="lg" aria-hidden="true" />
            <p className="text-h1 text-foreground">Joel Jota</p>
          </div>
          <Tag foto="/ds/atendente.png">Esther</Tag>
        </div>
      </Secao>

      <Secao titulo="Quando usar" descricao="Avatar identifica; não decora.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Sempre com o nome por perto.</span> Uma letra sozinha não diz quem é —
            em lista, o nome fica ao lado; em espaço apertado, vai no <Chip>title</Chip>.
          </li>
          <li>
            <span className="text-foreground">Um tamanho por lugar.</span> O lg existe para o topo do perfil. Usar lg
            numa lista faz a linha dobrar de altura.
          </li>
          <li>
            <span className="text-foreground">Não é botão.</span> Se clicar abre o perfil, o clique vai no elemento em
            volta, que tem foco e rótulo.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
