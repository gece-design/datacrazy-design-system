"use client";

import { Toast, Toaster, toast, type ToastVariant } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { PaginaDS, Secao, ComoFunciona, Chip } from "@/components/ds/preview";

type Amostra = { variant: ToastVariant; titulo: string; descricao: string; glifo: string };

const amostras: Amostra[] = [
  { variant: "success", titulo: "Negócio salvo", descricao: "As alterações já aparecem no funil.", glifo: "Check" },
  {
    variant: "destructive",
    titulo: "Não foi possível salvar",
    descricao: "A conexão caiu. Tente de novo em instantes.",
    glifo: "Warning",
  },
  {
    variant: "warning",
    titulo: "Importação parcial",
    descricao: "12 contatos ficaram de fora por e-mail repetido.",
    glifo: "Warning",
  },
  { variant: "info", titulo: "Nova mensagem", descricao: "Marina Albuquerque respondeu no WhatsApp.", glifo: "ChatText" },
];

const codigoVariantes = `<Toast variant="success" titulo="Negócio salvo" descricao="As alterações já aparecem no funil." aoFechar={fechar} />
<Toast variant="destructive" titulo="Não foi possível salvar" descricao="…" aoFechar={fechar} />
<Toast variant="warning" titulo="Importação parcial" descricao="…" aoFechar={fechar} />
<Toast variant="info" titulo="Nova mensagem" descricao="…" aoFechar={fechar} />`;

const codigoFila = `// uma vez, perto da raiz
<Toaster />

// de qualquer lugar
toast({ variant: "success", titulo: "Negócio salvo", descricao: "As alterações já aparecem no funil." });`;

export default function ToastPage() {
  return (
    <PaginaDS
      titulo="Toast"
      descricao="Cartão de 380px com recuo de 16, raio de 6px e elevation/lg. Quatro estados, e cada um põe a cor em três lugares: a barra de 3px, o glifo de 16 e o círculo de 28 atrás dele, a 12%. Entra dissolvendo, sai deslizando para a direita e some sozinho em 8 segundos — o relógio para enquanto o cursor ou o foco estão em cima."
      secoes={["Como funciona", "Variantes", "Na fila"]}
    >
      <Toaster />

      <ComoFunciona>
        <p>
          Duas peças. <Chip>Toast</Chip> é só o cartão, a cara do arquivo. <Chip>Toaster</Chip> é a fila: monte uma
          vez, e <Chip>toast()</Chip> passa a funcionar de qualquer handler, sem provider no meio. A fila mora no
          módulo e o <Chip>Toaster</Chip> só assina. Ele renderiza num portal no <Chip>body</Chip>, no canto inferior
          direito, na camada <Chip>z-toast</Chip> — o topo da escala, acima de modal e popover.
        </p>
        <p>
          O cartão é superfície de overlay: <Chip>overlay/bg</Chip> e <Chip>overlay/border</Chip>, que no claro são{" "}
          <Chip>card</Chip> e <Chip>border</Chip> e no escuro acompanham. A cor de estado{" "}
          <span className="text-foreground">nunca preenche o cartão</span> — entra na barra, no glifo e num círculo
          de 12%, a mesma regra do Badge. Os 12% não estão no arquivo como variável: foram medidos no pixel, e as
          quatro variantes do claro fecham no mesmo valor.
        </p>
        <p>
          O movimento tem dois tempos em cada ponta. Na entrada, o espaço abre em 200ms e o cartão dissolve em 250ms.
          Na saída, o cartão desliza para a direita em 200ms e <span className="text-foreground">só depois</span> o vão
          fecha, em mais 200ms — junto, a pilha andaria por baixo de um cartão ainda visível. A altura anima por{" "}
          <Chip>grid-template-rows</Chip>, sem medir o cartão. Com <Chip>prefers-reduced-motion</Chip> ligado no
          sistema, nada anima: o toast aparece e some na hora.
        </p>
        <p>
          O traço do cartão é desenhado por cima, não com <Chip>border</Chip>. No arquivo ele não ocupa espaço — o
          cartão fecha em 66 de altura com recuo de 16 — e a barra de estado cobre o traço na esquerda. Com uma borda
          de verdade seriam 68, e a barra ficaria 1px para dentro.
        </p>
        <p>
          Para leitor de tela, a lista do <Chip>Toaster</Chip> é uma região <Chip>aria-live=&quot;polite&quot;</Chip>{" "}
          que existe desde o primeiro render. É ela que faz o anúncio: uma região criada junto com a mensagem
          costuma não ser lida. O texto quebra linha em vez de cortar — <Chip>es</Chip> e <Chip>pt-br</Chip> são
          20–30% mais longos, e cortar seria truncamento mudo.
        </p>
      </ComoFunciona>

      <Secao
        titulo="Variantes"
        spec="4 · variant"
        className="bg-background"
        descricao="Sucesso, erro, atenção e informação. Erro e atenção usam o mesmo glifo; o que separa os dois é a cor — por isso o título precisa dizer o que aconteceu."
        codigo={codigoVariantes}
        nota={
          <>
            Na ordem: {amostras.map((a) => `${a.variant} (${a.glifo})`).join(" · ")}. O X só aparece com{" "}
            <Chip>aoFechar</Chip>, e o nome dele para leitor de tela vem de <Chip>rotuloFechar</Chip> — a UI é
            multi-idioma.
          </>
        }
      >
        <div className="flex flex-col items-center gap-5">
          {amostras.map((a) => (
            <Toast key={a.variant} variant={a.variant} titulo={a.titulo} descricao={a.descricao} aoFechar={() => {}} />
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Na fila"
        spec="máx. 3"
        descricao="Dispare alguns. Três ficam visíveis; o quarto empurra o mais antigo. Passe o cursor num deles e ele não some."
        codigo={codigoFila}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          {amostras.map((a) => (
            <Button
              key={a.variant}
              variant="secondary"
              onClick={() => toast({ variant: a.variant, titulo: a.titulo, descricao: a.descricao })}
            >
              {a.variant}
            </Button>
          ))}
        </div>
      </Secao>
    </PaginaDS>
  );
}
