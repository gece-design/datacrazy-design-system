"use client";

import * as React from "react";
import { Upload, tamanhoLegivel, type ArquivoDoUpload } from "@/components/ui/upload";
import { PaginaDS, Secao, ComoFunciona, Chip, Legenda } from "@/components/ds/preview";

/* Na doc os textos são literais porque a doc é escrita em português. No CRM
   cada rótulo vem do next-intl — o componente não tem nenhum embutido. */

const codigo = `const [arquivos, setArquivos] = useState<ArquivoDoUpload[]>([]);

<Upload
  rotulo="Arquivos da base"
  ajuda="O agente lê estes arquivos para responder."
  aceita=".pdf,.docx,.txt"
  multiplo
  rotulos={{ apoio: "PDF, DOCX ou TXT até 10 MB" }}
  arquivos={arquivos}
  aoAdicionar={(novos) => novos.forEach((f) => enviar(f))}
  aoRemover={(id) => setArquivos((lista) => lista.filter((a) => a.id !== id))}
/>`;

const LIMITE = 10 * 1024 * 1024;

/** Simula o envio: a barra anda até 100 em dois segundos. No CRM, é a API que devolve o progresso. */
function Exemplo({ comErro = false }: { comErro?: boolean }) {
  const [arquivos, setArquivos] = React.useState<ArquivoDoUpload[]>(
    comErro
      ? [
          { id: "1", nome: "perguntas-frequentes.pdf", tamanho: 348_160 },
          { id: "2", nome: "video-institucional.mp4", tamanho: 48_234_496, erro: "Passa de 10 MB." },
        ]
      : [{ id: "1", nome: "tabela-de-precos-2026.xlsx", tamanho: 92_160 }],
  );
  const [erro, setErro] = React.useState<string | undefined>();

  function adicionar(novos: File[]) {
    setErro(undefined);
    for (const f of novos) {
      const id = `${f.name}-${Date.now()}`;
      if (f.size > LIMITE) {
        setArquivos((lista) => [...lista, { id, nome: f.name, tamanho: f.size, erro: `Passa de ${tamanhoLegivel(LIMITE)}.` }]);
        continue;
      }
      setArquivos((lista) => [...lista, { id, nome: f.name, tamanho: f.size, progresso: 0 }]);
      let p = 0;
      const passo = window.setInterval(() => {
        p = Math.min(100, p + 20);
        setArquivos((lista) => lista.map((a) => (a.id === id ? { ...a, progresso: p } : a)));
        if (p >= 100) window.clearInterval(passo);
      }, 400);
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-3">
      <Upload
        rotulo="Arquivos da base"
        ajuda="O agente lê estes arquivos para responder."
        obrigatorio
        aceita=".pdf,.docx,.txt,.xlsx"
        multiplo
        erro={erro}
        rotulos={{ apoio: "PDF, DOCX, TXT ou XLSX até 10 MB" }}
        arquivos={arquivos}
        aoAdicionar={adicionar}
        aoRemover={(id) => setArquivos((lista) => lista.filter((a) => a.id !== id))}
      />
    </div>
  );
}

export default function Pagina() {
  return (
    <PaginaDS
      titulo="Upload"
      descricao="A zona de soltar arquivos e a lista do que entrou. Um campo como o Input: rótulo, ajuda, obrigatório e erro no mesmo lugar; zona tracejada de 1px que acende ao arrastar por cima; cada arquivo numa linha de 36px com nome, tamanho, barra de progresso e remover."
      novidade="2026-10-08"
      secoes={["Zona e lista", "Erro por arquivo", "Como funciona", "Quando usar"]}
    >
      <Secao
        titulo="Zona e lista"
        spec="traço tracejado · linha de 36 · barra de 4"
        descricao="Clique na zona (ou Enter e Espaço com o foco nela) para abrir o seletor; arraste arquivos por cima para soltar. Cada um entra na lista com progresso simulado; o X remove."
        codigo={codigo}
        novidade="2026-10-08"
        nota={
          <>
            O componente não envia nada: devolve os <Chip>File</Chip> em <Chip>aoAdicionar</Chip> e a tela decide o que
            fazer — validar, subir para a API e pôr cada um em <Chip>arquivos</Chip> com o <Chip>progresso</Chip> (0 a 99
            mostra a barra) e o <Chip>erro</Chip> que tiver. <Chip>aceita</Chip> é o <Chip>accept</Chip> do seletor;{" "}
            <Chip>multiplo</Chip> deixa escolher vários. O tamanho sai de <Chip>tamanhoLegivel</Chip>, no idioma de quem
            lê.
          </>
        }
      >
        <Exemplo />
      </Secao>

      <Secao
        titulo="Erro por arquivo"
        spec="linha em traço de erro · mensagem embaixo"
        descricao="O segundo arquivo passou do limite: a linha fica com o traço de erro e a mensagem embaixo do nome; os outros seguem normais. O erro do campo inteiro (nada escolhido num obrigatório) vai em erro, sob a lista."
        codigo={`<Upload
  rotulo="Arquivos da base"
  arquivos={[
    { id: "1", nome: "perguntas-frequentes.pdf", tamanho: 348160 },
    { id: "2", nome: "video-institucional.mp4", tamanho: 48234496, erro: "Passa de 10 MB." },
  ]}
  aoAdicionar={adicionar}
  aoRemover={remover}
/>`}
      >
        <Exemplo comErro />
        <Legenda>
          Erro de um arquivo é dele; erro do campo é do campo. Os dois usam a mesma cor e o mesmo texto de erro do
          Input (<Chip>input/border-error</Chip>, <Chip>destructive</Chip>).
        </Legenda>
      </Secao>

      <ComoFunciona>
        <p>
          Não há desenho no arquivo: o cliente apontou a falta na reunião de 2026-10-02 (&quot;falta um componente de
          upload de arquivo&quot;), quando a base de conhecimento dos agentes pediu arquivos. A zona é um{" "}
          <Chip>&lt;label&gt;</Chip> em volta de um <Chip>&lt;input type=&quot;file&quot;&gt;</Chip> escondido só da
          vista — o mesmo truque do Checkbox: clique, Enter e Espaço abrem o seletor do sistema, e o anel de foco vai na
          zona pelo <Chip>peer</Chip>. Arrastar por cima acende a zona em <Chip>accent</Chip> com traço{" "}
          <Chip>primary</Chip>; soltar entrega os arquivos.
        </p>
        <p>
          A lista é a do padrão do DS para itens: linha de 36 com traço, ícone do arquivo, nome que corta com o
          inteiro no <Chip>title</Chip>, tamanho em <Chip>caption</Chip>, barra de 4px em <Chip>primary</Chip> enquanto
          sobe (<Chip>role=&quot;progressbar&quot;</Chip>, anunciada) e o remover como Button de ícone de 24.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Arquivo que entra num cadastro; não para foto de perfil nem para anexar numa conversa.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> quando o registro guarda arquivos: a base de conhecimento do
            agente, os documentos de um negócio, a importação de uma planilha.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para a foto de uma pessoa: é o Avatar com um botão de
            trocar.
          </li>
          <li>
            <span className="text-foreground">Não use</span> para anexar numa mensagem: é o clipe do compositor da
            Conversa, que abre o seletor direto.
          </li>
        </ul>
      </Secao>
    </PaginaDS>
  );
}
