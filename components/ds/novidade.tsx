// O selo "new" da vitrine (moldura do site, não é peça do design system).
//
// Regra (humano, 2026-10-02): o selo aponta SÓ para o que mudou nesta semana —
// no menu, ao lado do item; dentro da página, ao lado do título da seção que
// mudou. Quem diz quando mudou é a data escrita na fonte (`atualizado` no
// nav.ts, `novidade` na <Secao> ou na <PaginaDS>): sete dias depois o selo
// some sozinho, sem ninguém precisar apagar.

/** O dia do build (AAAA-MM-DD), gravado pelo next.config: servidor e navegador comparam com a mesma data. */
const HOJE = process.env.NEXT_PUBLIC_DATA_DO_BUILD ?? new Date().toISOString().slice(0, 10);
const DIAS = 7;

/** A data (AAAA-MM-DD) caiu nos últimos sete dias? */
export function ehNovidade(data?: string) {
  if (!data) return false;
  const dias = (Date.parse(HOJE) - Date.parse(data)) / 86_400_000;
  return dias >= 0 && dias < DIAS;
}

/** O selo. Só aparece enquanto a data for desta semana. */
export function SeloNovo({ data, className }: { data?: string; className?: string }) {
  if (!ehNovidade(data)) return null;
  return (
    <span title={`Atualizado em ${data!.split("-").reverse().join("/")}`} className={`chrome-selo flex h-[18px] shrink-0 items-center rounded-[4px] bg-accent px-1 text-primary ${className ?? ""}`}>
      new
    </span>
  );
}
