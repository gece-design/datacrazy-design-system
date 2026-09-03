import { cn } from "@/lib/utils";

// Grade de 3 colunas usada pelo header E pelo conteúdo, para que o breadcrumb
// caia exatamente sobre a borda esquerda da coluna do meio em qualquer largura.
// Sidebar (esquerda) · conteúdo centralizado no que sobra · trilho de 220 à direita.
export function Colunas({
  children, trilho, className,
}: { children: React.ReactNode; trilho?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex w-full gap-16", className)}>
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[808px]">{children}</div>
      </div>
      {/* o trilho reserva a largura mesmo quando o conteúdo dele está oculto,
          senão a coluna do meio se centraliza num espaço diferente do header */}
      <div className="w-[220px] shrink-0">{trilho}</div>
    </div>
  );
}
