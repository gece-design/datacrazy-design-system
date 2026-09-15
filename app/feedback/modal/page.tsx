"use client";

import { useState } from "react";
import { Trash } from "@phosphor-icons/react";
import { Modal, ModalPainel, type ModalSize } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

/** O retângulo "Conteúdo" do arquivo. Só do showcase: o corpo do modal é livre. */
function Conteudo() {
  return (
    <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border bg-background text-caption text-subtle-foreground">
      Conteúdo
    </div>
  );
}

const nada = () => {};

const codigoVariantes = `<ModalPainel
  titulo="Título do modal"
  descricao="Descrição curta do que esta ação faz."
  aoFechar={fechar}
  acoes={<><Button variant="outline">Cancelar</Button><Button>Aplicar</Button></>}
>
  {conteudo}
</ModalPainel>

<ModalPainel variant="destructive" titulo="…" descricao="…" aoFechar={fechar}
  acoes={<><Button variant="outline">Cancelar</Button><Button variant="destructive"><Trash size={16} />Excluir</Button></>}
/>`;

const codigoCamada = `const [aberto, setAberto] = useState(false);

<Button variant="secondary" onClick={() => setAberto(true)}>Excluir negócio</Button>

<Modal
  aberto={aberto}
  aoFechar={() => setAberto(false)}
  variant="destructive"
  titulo="Excluir negócio?"
  descricao="Ele sai do funil e do histórico. Não dá para desfazer."
  acoes={
    <>
      <Button variant="outline" autoFocus onClick={() => setAberto(false)}>Cancelar</Button>
      <Button variant="destructive" onClick={excluir}><Trash size={16} />Excluir</Button>
    </>
  }
/>`;

export default function ModalPage() {
  const [renomear, setRenomear] = useState(false);
  const [excluir, setExcluir] = useState(false);

  return (
    <PaginaDS
      titulo="Modal"
      descricao="Caixa de 400, 520 ou 720px com raio de 8px e elevation/xl, sobre um fundo escurecido. Cabeçalho com título e descrição, corpo livre e rodapé com os botões separados por um traço. O destrutivo põe um alerta ao lado do título e não fecha com clique fora."
      secoes={["Como funciona", "Variantes", "Tamanhos", "Na tela"]}
    >
      <ComoFunciona>
        <p>
          Duas peças, como no Drawer. <Chip>ModalPainel</Chip> é só a caixa, a cara do arquivo — é ela que aparece
          parada nas seções abaixo. <Chip>Modal</Chip> é a camada: renderiza num portal no <Chip>body</Chip>, na
          camada <Chip>z-modal</Chip>, com o fundo em <Chip>overlay/scrim</Chip> a 40%. O arquivo não desenha o fundo;
          os 40% são os mesmos do Drawer.
        </p>
        <p>
          Aberto, o modal <span className="text-foreground">prende o foco</span>: Tab e Shift+Tab giram entre o que
          está dentro dele, Escape fecha, a página de trás para de rolar e, ao fechar, o foco volta para quem abriu.
          Essa lógica mora em <Chip>useCamada</Chip>, que só a camada do topo escuta — um modal aberto de dentro do
          drawer não fecha os dois com um Escape.
        </p>
        <p>
          O <Chip>destructive</Chip> muda duas coisas além do alerta. Clique no fundo não fecha: confirmação de algo
          sem desfazer não pode sumir por um clique fora (troque com <Chip>fecharNoFundo</Chip>). E o foco deve abrir
          no Cancelar — ponha <Chip>autoFocus</Chip> nele, para um Enter apressado não excluir nada.
        </p>
        <p>
          Com zoom alto ou conteúdo longo, a caixa nunca passa da janela: só o corpo rola, e cabeçalho e rodapé ficam
          presos. Título e descrição quebram linha em vez de cortar. O contorno e o traço do rodapé são desenhados por
          cima, como no Toast — no arquivo não ocupam espaço, e a caixa fecha em 240 de altura.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Variantes"
        spec="2 · variant"
        descricao="Default para decidir e seguir; destructive para confirmar o que não tem volta. O alerta é o Warning de 20px num círculo de 40 com a cor a 12%."
        codigo={codigoVariantes}
        nota={
          <>
            Os botões são o <Chip>Button</Chip>: <Chip>outline</Chip> no cancelar, <Chip>primary</Chip> ou{" "}
            <Chip>destructive</Chip> na confirmação. O X só aparece com <Chip>aoFechar</Chip>, e o nome dele para leitor
            de tela vem de <Chip>rotuloFechar</Chip>.
          </>
        }
      >
        <div className="flex flex-col items-center gap-5">
          <ModalPainel
            titulo="Título do modal"
            descricao="Descrição curta do que esta ação faz."
            aoFechar={nada}
            acoes={
              <>
                <Button variant="outline">Cancelar</Button>
                <Button>Aplicar</Button>
              </>
            }
          >
            <Conteudo />
          </ModalPainel>
          <ModalPainel
            variant="destructive"
            titulo="Título do modal"
            descricao="Descrição curta do que esta ação faz."
            aoFechar={nada}
            acoes={
              <>
                <Button variant="outline">Cancelar</Button>
                <Button variant="destructive">
                  <Trash size={16} />
                  Excluir
                </Button>
              </>
            }
          >
            <Conteudo />
          </ModalPainel>
        </div>
      </Secao>

      <Secao
        titulo="Tamanhos"
        spec="3 · size"
        descricao="Só a largura muda. sm para confirmar, md para um formulário curto, lg quando o corpo tem mais de uma coluna."
        codigo={`<ModalPainel size="sm" … />  // 400px
<ModalPainel size="md" … />  // 520px
<ModalPainel size="lg" … />  // 720px`}
      >
        <div className="flex flex-col items-center gap-5">
          {(["sm", "md", "lg"] as ModalSize[]).map((size) => (
            <ModalPainel
              key={size}
              size={size}
              titulo={`Título do modal · ${size}`}
              descricao="Descrição curta do que esta ação faz."
              aoFechar={nada}
              acoes={
                <>
                  <Button variant="outline">Cancelar</Button>
                  <Button>Aplicar</Button>
                </>
              }
            >
              <Conteudo />
            </ModalPainel>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Na tela"
        spec="camada"
        descricao="Abra os dois. No primeiro, o foco cai no campo e Tab gira dentro da caixa. No segundo, o foco abre no Cancelar e clique fora não fecha."
        codigo={codigoCamada}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="secondary" onClick={() => setRenomear(true)}>
            Renomear etapa
          </Button>
          <Button variant="secondary" onClick={() => setExcluir(true)}>
            Excluir negócio
          </Button>
        </div>

        <Modal
          aberto={renomear}
          aoFechar={() => setRenomear(false)}
          size="md"
          titulo="Renomear etapa"
          descricao="O nome novo vale para todo o time, em todos os funis."
          acoes={
            <>
              <Button variant="outline" onClick={() => setRenomear(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setRenomear(false)}>Salvar</Button>
            </>
          }
        >
          <Input rotulo="Nome da etapa" defaultValue="Proposta enviada" autoFocus />
        </Modal>

        <Modal
          aberto={excluir}
          aoFechar={() => setExcluir(false)}
          variant="destructive"
          titulo="Excluir negócio?"
          descricao="Proposta Rafael Pinto sai do funil e do histórico. Não dá para desfazer."
          acoes={
            <>
              <Button variant="outline" autoFocus onClick={() => setExcluir(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => setExcluir(false)}>
                <Trash size={16} />
                Excluir
              </Button>
            </>
          }
        />
      </Secao>
    </PaginaDS>
  );
}
