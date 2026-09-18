"use client";

import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";
import { PropostaBarraDeIcones, PropostaGrade, PropostaTrilhoDeIcones } from "./propostas";

export function Conteudo() {
  return (
    <PaginaDS
      titulo="Drawer Lead 2 · com o DS"
      descricao="As mesmas três propostas do cliente, refeitas com os componentes e os tokens do design system. É o melhor acabamento possível de cada ideia — e serve de controle: o que continua ruim aqui é problema de estrutura, não de acabamento."
      secoes={["Como funciona", "Barra de ícones", "Trilho de ícones", "Grade de duas colunas", "O veredito"]}
    >
      <ComoFunciona>
        <p>
          Esta é a versão vestida. Os mesmos mocks 1A, 2C e 2B de{" "}
          <a href="/feedback/drawer-lead-2" className="text-primary underline underline-offset-2">
            Drawer Lead 2
          </a>
          , montados com <Chip>DrawerPainel</Chip>, <Chip>DrawerPerfil</Chip>, <Chip>DrawerConteudo</Chip>,{" "}
          <Chip>Avatar</Chip>, <Chip>Tag</Chip> e <Chip>Button</Chip>, com os dados de verdade e{" "}
          <span className="text-foreground">nenhum hex solto</span>.
        </p>
        <p>
          Serve para uma coisa só: separar acabamento de estrutura. Se a proposta melhorasse ao ser vestida, o problema
          era de acabamento e bastava desenhar melhor. Ela não melhora — nas três o usuário continua perdendo a leitura
          direta de para onde ir. Isso é o argumento.
        </p>
        <p>
          A rota é <span className="text-foreground">só de desenvolvimento</span>: em produção responde 404 e não
          aparece na navegação. Ela é material interno de argumentação — quem recebe o link é a versão crua, que mostra
          a proposta como ela é.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Barra de ícones"
        spec="mock 1A · 4 ações sem rótulo"
        descricao="As quatro ações do perfil — tags, lista, automação e atendente — viram botões quadrados só com glifo, e uma linha de legenda embaixo diz o que cada um faz."
        nota={
          <>
            Mesmo com o traço, o raio e o ícone certos, a legenda continua sendo a confissão do desenho: se os ícones
            precisam de uma lista de nomes logo abaixo, eles não estão comunicando. E o quarto botão é o avatar do
            atendente, que num cartão de contato lê como uma segunda pessoa, não como um seletor.
          </>
        }
      >
        <div className="overflow-x-auto">
          <PropostaBarraDeIcones className="h-[720px] max-w-none" />
        </div>
      </Secao>

      <Secao
        titulo="Trilho de ícones"
        spec="mock 2C · 12 seções sem rótulo"
        descricao="A navegação do lead vira uma coluna de 52px só com glifos, ao lado do conteúdo do contato. O rótulo aparece no hover."
        nota={
          <>
            Os glifos aqui são os do Phosphor, no peso do DS — e ainda assim doze destinos sem texto não se distinguem.
            Passe o mouse pelo trilho e tente adivinhar qual é Campos adicionais, qual é Hierarquia e qual é Históricos
            antes de ler a dica. Em toque, a dica <span className="text-foreground">nunca</span> aparece.
          </>
        }
      >
        <div className="overflow-x-auto">
          <PropostaTrilhoDeIcones className="h-[720px] max-w-none" />
        </div>
      </Secao>

      <Secao
        titulo="Grade de duas colunas"
        spec="mock 2B · 12 itens em 6 linhas"
        descricao="O menu deixa de ser lista e vira grade de duas colunas, com o ícone acima do rótulo, para caber sem rolagem."
        nota={
          <>
            A grade resolve a rolagem e cobra a leitura: o olho varre menu de cima para baixo, não em zigue-zague, e
            aqui ele precisa fazer os dois. Some a isso o rótulo que quebra em duas linhas — Campos adicionais,
            Atendimentos — e as células deixam de ter a mesma altura. Nenhum token conserta isso.
          </>
        }
      >
        <div className="overflow-x-auto">
          <PropostaGrade className="h-[720px] max-w-none" />
        </div>
      </Secao>

      <Secao titulo="O veredito" descricao="O que recomendar na reunião." semCaixa semSeletorDeFundo>
        <div className="space-y-4 p-4 chrome-prose text-muted-foreground sm:p-6 lg:p-8">
          <p>
            <span className="text-foreground">Ficar com a lista do Drawer atual.</span> Ela resolve o problema que o
            cliente levantou — menu comprido demais — sem cobrar nada do usuário: cabeçalho fixo com o nome do lead,
            rolagem só dentro da lista, rótulo sempre visível ao lado do ícone. É a proposta 2A do arquivo dele, a
            única que não troca legibilidade por espaço.
          </p>
          <p>
            Se doze seções ainda forem muitas, o caminho é{" "}
            <span className="text-foreground">agrupar, não esconder</span>: Relacionamento, Cadastro e Documentos, com
            um grupo aberto por vez. Isso é o acordeão dos mocks 2D e 2F, e continua sendo lista com texto — só que
            mais curta. Vale prototipar essa se o cliente insistir depois de ver as três acima.
          </p>
          <p>
            Nada desta página vira componente nem entra no Figma. Os arquivos moram em{" "}
            <Chip>app/feedback/drawer-lead-2/ds/</Chip> e não exportam nada para o DS — apagar a pasta não quebra
            nenhuma tela.
          </p>
        </div>
      </Secao>
    </PaginaDS>
  );
}
