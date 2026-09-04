import { cn } from "@/lib/utils";

// Grade usada pelo header E pelo conteúdo, para que o breadcrumb caia sobre a
// borda esquerda da coluna do meio em qualquer largura.
//
// O trilho é a coluna que mais causou problema: ele reservava 220px + 64px de
// gap em TODA largura, mas só mostrava conteúdo a partir de xl. Entre lg e xl
// isso era um buraco de 284px, e no celular espremia a leitura a uma palavra
// por linha. Agora a coluna só existe onde o conteúdo dela existe (xl+), e o
// `hidden` zera o gap junto — flex não desenha gap para item em display:none.
export function Colunas({
  children, trilho, className,
}: { children: React.ReactNode; trilho?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex w-full gap-10 2xl:gap-14", className)}>
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[820px]">{children}</div>
      </div>
      <div className="hidden w-[184px] shrink-0 xl:block">{trilho}</div>
    </div>
  );
}
