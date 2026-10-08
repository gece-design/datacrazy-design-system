"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, ROTULOS_DO_UPLOAD, tamanhoLegivel, type ArquivoDoUpload } from "@/components/ui/upload";
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

const codigoUm = `// um arquivo só: sem multiplo, o seletor escolhe um e a tela troca o anterior
<Upload
  rotulo="Planilha de leads"
  ajuda="A primeira linha precisa ser o cabeçalho."
  aceita=".csv,.xlsx"
  rotulos={{ chamada: "Arraste a planilha ou clique para escolher", apoio: "CSV ou XLSX até 10 MB" }}
  arquivos={planilha ? [planilha] : []}
  aoAdicionar={([f]) => setPlanilha({ id: f.name, nome: f.name, tamanho: f.size, progresso: 0 })}
  aoRemover={() => setPlanilha(null)}
/>`;

const codigoErroDoCampo = `// erro do campo: nada escolhido num obrigatório — a zona fica em traço de erro e a mensagem vai sob a lista
<Upload rotulo="Arquivos da base" obrigatorio erro="Escolha pelo menos um arquivo." arquivos={[]} aoAdicionar={adicionar} />

// desabilitado: a zona apagada, sem seletor nem soltar; a lista continua legível, sem o remover
<Upload rotulo="Arquivos da base" disabled arquivos={arquivos} aoAdicionar={adicionar} />`;

const codigoRotulos = `<Upload
  rotulo="Archivos de la base"
  ajuda="El agente lee estos archivos para responder."
  aceita=".pdf,.docx,.txt"
  multiplo
  locale="es"
  rotulos={{
    chamada: "Arrastra archivos o haz clic para elegir",
    apoio: "PDF, DOCX o TXT hasta 10 MB",
    remover: (nome) => \`Quitar \${nome}\`,
    enviando: (p) => \`\${p}% enviado\`,
  }}
  arquivos={arquivos}
  aoAdicionar={adicionar}
  aoRemover={remover}
/>`;

const codigoNaTela = `// Agentes de IA › base de conhecimento: o modal de cadastro recebe os arquivos
<Upload
  rotulo="Arquivos"
  ajuda="O agente lê estes arquivos para responder."
  aceita=".pdf,.docx,.txt,.md"
  multiplo
  rotulos={{ apoio: "PDF, DOCX, TXT ou MD até 10 MB" }}
  arquivos={form.arquivos}
  aoAdicionar={(novos) => novos.forEach(subir)}
  aoRemover={(id) => setForm((f) => ({ ...f, arquivos: f.arquivos.filter((a) => a.id !== id) }))}
/>`;

const LIMITE = 10 * 1024 * 1024;

/** Um item de lista com a chave à esquerda, como nas páginas do Button e do Input. */
function Item({ mono, children }: { mono: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <code className="w-44 shrink-0 font-mono chrome-meta text-foreground">{mono}</code>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

type Parte = { nome: string; medida: string; papel: string };

const anatomia: Parte[] = [
  { nome: "Rótulo", medida: "rotuloDeCampo · label-lg · asterisco", papel: "O mesmo rótulo do Input, ligado ao input escondido por htmlFor. Com obrigatorio, o asterisco em destructive e aria-required. rotuloOculto tira da tela e deixa para o leitor." },
  { nome: "Zona", medida: "label · border-dashed · rounded-md · px-4 py-5", papel: "Um label em volta do input de arquivo: clicar, Enter e Espaço abrem o seletor; arrastar por cima acende em accent com traço primary; soltar entrega os arquivos. Erro do campo: traço input-border-error." },
  { nome: "Chamada e apoio", medida: "body-md · caption", papel: "A frase da zona (rotulos.chamada) e, embaixo, o que entra (rotulos.apoio): tipos e limite. O ícone UploadSimple de 20 em cima, em primary ao arrastar." },
  { nome: "Anel de foco", medida: "focoPeer · inset-0", papel: "O input é sr-only; o anel vai na zona, lendo o foco do irmão (peer). Tab chega na zona como num Checkbox." },
  { nome: "Linha", medida: "36px · border · rounded-md · bg-card · px-2 py-1.5", papel: "Um arquivo: ícone de 16, nome em label-lg que corta com o inteiro no title, tamanho em caption tabular, e o X de 24. Em erro, o traço vira input-border-error e o ícone destructive." },
  { nome: "Barra", medida: "h-1 · rounded-full · primary · role=progressbar", papel: "Aparece de 0 a 99 e anda com transition-[width] base; anunciada pelo leitor (rotulos.enviando). Em 100 ou sem progresso, some." },
  { nome: "Ajuda e erro", medida: "ajudaDeCampo · erroDeCampo", papel: "Sob a lista, como no Input: a ajuda some enquanto há erro. O erro do campo é do campo; o de um arquivo fica na linha dele." },
];

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

/** Um arquivo só: escolher outro troca o anterior. */
function ExemploUm() {
  const [planilha, setPlanilha] = React.useState<ArquivoDoUpload | null>(null);

  function adicionar([f]: File[]) {
    if (!f) return;
    const id = `${f.name}-${Date.now()}`;
    setPlanilha({ id, nome: f.name, tamanho: f.size, progresso: 0 });
    let p = 0;
    const passo = window.setInterval(() => {
      p = Math.min(100, p + 25);
      setPlanilha((a) => (a && a.id === id ? { ...a, progresso: p } : a));
      if (p >= 100) window.clearInterval(passo);
    }, 300);
  }

  return (
    <div className="flex max-w-xl flex-col gap-3">
      <Upload
        rotulo="Planilha de leads"
        ajuda="A primeira linha precisa ser o cabeçalho."
        aceita=".csv,.xlsx"
        rotulos={{ chamada: "Arraste a planilha ou clique para escolher", apoio: "CSV ou XLSX até 10 MB" }}
        arquivos={planilha ? [planilha] : []}
        aoAdicionar={adicionar}
        aoRemover={() => setPlanilha(null)}
      />
    </div>
  );
}

/** O erro do campo some quando entra o primeiro arquivo. */
function ExemploErroDoCampo() {
  const [arquivos, setArquivos] = React.useState<ArquivoDoUpload[]>([]);
  const erro = arquivos.length === 0 ? "Escolha pelo menos um arquivo." : undefined;
  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      <Upload
        rotulo="Arquivos da base"
        ajuda="O agente lê estes arquivos para responder."
        obrigatorio
        multiplo
        erro={erro}
        rotulos={{ apoio: "PDF, DOCX ou TXT até 10 MB" }}
        arquivos={arquivos}
        aoAdicionar={(novos) => setArquivos((lista) => [...lista, ...novos.map((f) => ({ id: `${f.name}-${Date.now()}`, nome: f.name, tamanho: f.size }))])}
        aoRemover={(id) => setArquivos((lista) => lista.filter((a) => a.id !== id))}
      />
      <Upload
        rotulo="Arquivos da base"
        ajuda="Só quem edita o agente pode trocar os arquivos."
        disabled
        multiplo
        rotulos={{ apoio: "PDF, DOCX ou TXT até 10 MB" }}
        arquivos={[
          { id: "1", nome: "perguntas-frequentes.pdf", tamanho: 348_160 },
          { id: "2", nome: "politica-de-trocas.docx", tamanho: 61_440 },
        ]}
        aoAdicionar={() => undefined}
      />
    </div>
  );
}

function ExemploEmEspanhol() {
  const [arquivos, setArquivos] = React.useState<ArquivoDoUpload[]>([
    { id: "1", nome: "preguntas-frecuentes.pdf", tamanho: 348_160 },
    { id: "2", nome: "catalogo-2026.pdf", tamanho: 2_411_724, progresso: 60 },
  ]);
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <Upload
        rotulo="Archivos de la base"
        ajuda="El agente lee estos archivos para responder."
        aceita=".pdf,.docx,.txt"
        multiplo
        locale="es"
        rotulos={{ chamada: "Arrastra archivos o haz clic para elegir", apoio: "PDF, DOCX o TXT hasta 10 MB", remover: (nome) => `Quitar ${nome}`, enviando: (p) => `${p}% enviado` }}
        arquivos={arquivos}
        aoAdicionar={(novos) => setArquivos((lista) => [...lista, ...novos.map((f) => ({ id: `${f.name}-${Date.now()}`, nome: f.name, tamanho: f.size }))])}
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
      secoes={["Zona e lista", "Um arquivo só", "Erro por arquivo", "Erro do campo e desabilitado", "Em outro idioma", "Estados", "Anatomia", "Na tela", "Como funciona", "Quando usar"]}
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
        titulo="Um arquivo só"
        spec="sem multiplo · a tela troca"
        descricao="Sem multiplo, o seletor do sistema escolhe um e aoAdicionar recebe um. Quem decide se o novo substitui o anterior é a tela — aqui, substitui. A chamada e o apoio mudam para dizer o que se espera: a planilha, não arquivos."
        codigo={codigoUm}
        novidade="2026-10-08"
        nota={
          <>
            Soltar vários na zona de um arquivo só entrega o primeiro: o componente corta, para a tela não ter de
            tratar. Sem <Chip>aoRemover</Chip>, a linha não tem o X — útil quando trocar é o único caminho.
          </>
        }
      >
        <ExemploUm />
      </Secao>

      <Secao
        titulo="Erro por arquivo"
        spec="linha em traço de erro · mensagem embaixo"
        descricao="O segundo arquivo passou do limite: a linha fica com o traço de erro e a mensagem embaixo do nome; os outros seguem normais. Solte um arquivo acima de 10 MB para ver outro entrar assim."
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

      <Secao
        titulo="Erro do campo e desabilitado"
        spec="erro · disabled"
        descricao="À esquerda, o erro do campo inteiro: nada escolhido num obrigatório — a zona ganha o traço de erro e a mensagem vai sob a lista, no lugar da ajuda; some quando o primeiro arquivo entra. À direita, desabilitado: a zona apagada não abre o seletor nem recebe soltar; a lista continua legível, sem o X."
        codigo={codigoErroDoCampo}
        novidade="2026-10-08"
        nota={
          <>
            Quem valida é a tela: <Chip>erro</Chip> é uma string, como no Input. O <Chip>aria-invalid</Chip> e o{" "}
            <Chip>aria-describedby</Chip> ligam o input escondido à mensagem, e o leitor de tela lê o erro ao chegar na
            zona. Desabilitado segue a regra I5: cursor <Chip>not-allowed</Chip>, fundo{" "}
            <Chip>input-bg-disabled</Chip>, texto <Chip>input-text-disabled</Chip>.
          </>
        }
      >
        <ExemploErroDoCampo />
      </Secao>

      <Secao
        titulo="Em outro idioma"
        spec="rotulos · 4 textos · locale"
        descricao="A chamada, o apoio, o nome do botão de remover e o que o leitor ouve na barra vêm de rotulos; o tamanho segue locale (vírgula ou ponto decimal). Rótulo, ajuda e erro são conteúdo: a tela os escreve."
        codigo={codigoRotulos}
        novidade="2026-10-08"
        nota={
          <>
            A fábrica <Chip>ROTULOS_DO_UPLOAD</Chip> tem {Object.keys(ROTULOS_DO_UPLOAD).length} textos em pt-BR;{" "}
            <Chip>remover</Chip> e <Chip>enviando</Chip> são funções porque levam o nome do arquivo e o número.{" "}
            <Chip>tamanhoLegivel</Chip> usa o <Chip>Intl.NumberFormat</Chip> do <Chip>locale</Chip>: 2,3 MB em pt-BR e
            es, 2.3 MB em en.
          </>
        }
      >
        <ExemploEmEspanhol />
      </Secao>

      <Secao
        titulo="Estados"
        spec="7 estados · nada simulado"
        descricao="Repouso, sob o cursor, em foco, arrastando por cima, enviando, erro (do arquivo e do campo) e desabilitado. Tudo está vivo nas seções acima."
        novidade="2026-10-08"
        nota={
          <>
            <ul className="space-y-1.5">
              <Item mono="repouso">zona tracejada em <Chip>input-border</Chip> sobre <Chip>input-bg</Chip>; ícone e apoio em <Chip>muted-foreground</Chip></Item>
              <Item mono="hover">o traço escurece para <Chip>input-border-hover</Chip>, como no Input</Item>
              <Item mono="focus-visible">o anel de 2px na zona, lido do input escondido (<Chip>focoPeer</Chip>)</Item>
              <Item mono="arrastando">traço <Chip>primary</Chip>, fundo <Chip>accent</Chip>, ícone em <Chip>primary</Chip></Item>
              <Item mono="enviando">a linha com a barra de 4px em <Chip>primary</Chip>, de 0 a 99</Item>
              <Item mono="erro do arquivo">a linha em <Chip>input-border-error</Chip>, ícone <Chip>destructive</Chip>, mensagem embaixo do nome</Item>
              <Item mono="erro do campo">a zona em traço de erro e a mensagem sob a lista, no lugar da ajuda</Item>
              <Item mono="disabled">zona apagada e <Chip>not-allowed</Chip>; a lista fica, sem o X</Item>
            </ul>
            <p className="mt-2.5">
              Não há miniatura de imagem nem reordenar: a lista é de documentos, na ordem em que entraram. Ausência
              é decisão.
            </p>
          </>
        }
      >
        <Exemplo comErro />
      </Secao>

      <Secao titulo="Anatomia" spec="7 partes" semCaixa novidade="2026-10-08">
        <div className="divide-y divide-border rounded-lg border border-border">
          {anatomia.map((p) => (
            <div key={p.nome} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4">
              <div>
                <p className="text-h4 text-foreground">{p.nome}</p>
                <p className="mt-1 font-mono text-label-md text-subtle-foreground">{p.medida}</p>
              </div>
              <p className="text-body-lg text-muted-foreground">{p.papel}</p>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Na tela"
        spec="/prototipo?tela=agentes · base de conhecimento"
        descricao="Na tela de Agentes de IA, a aba de bases de conhecimento abre um modal para cadastrar a base; o Upload é o último campo, com o formulário do modal (rótulo visível, ajuda, obrigatório). A tela simula o envio e guarda os arquivos no estado do formulário."
        codigo={codigoNaTela}
        semSeletorDeFundo
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="chrome-prose text-muted-foreground">
            Dentro do Modal, o campo segue o <Chip>formulario</Chip> de lib/campo: a mesma coluna e o mesmo vão dos
            outros campos.
          </p>
          <Button asChild variant="secondary">
            <Link href="/prototipo?tela=agentes">Abrir os Agentes de IA no protótipo</Link>
          </Button>
        </div>
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
        <p>
          A armadilha é o mesmo arquivo duas vezes: o <Chip>change</Chip> do input não dispara se o valor não mudou,
          então o componente zera o input depois de cada escolha. A outra é o progresso: 100 ou ausente é
          &quot;pronto&quot; — a tela que esquece de mandar 100 deixa a barra cheia na tela para sempre.
        </p>
      </ComoFunciona>

      <Secao titulo="Quando usar" descricao="Arquivo que entra num cadastro; não para foto de perfil nem para anexar numa conversa.">
        <ul className="space-y-3 chrome-prose text-muted-foreground">
          <li>
            <span className="text-foreground">Use</span> quando o registro guarda arquivos: a base de conhecimento do
            agente, os documentos de um negócio, a importação de uma planilha.
          </li>
          <li>
            <span className="text-foreground">Use</span> <Chip>rotulos.apoio</Chip> sempre: tipos e limite antes de a
            pessoa escolher evitam o erro depois.
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
