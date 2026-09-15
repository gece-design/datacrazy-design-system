import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_ACESSO, HASH_DA_SENHA } from "@/lib/acesso";

// Portão por senha das PÁGINAS do site. Sem o cookie, qualquer rota mostra o
// modal de /entrar no lugar do conteúdo (rewrite: a URL não muda, então depois
// de entrar basta recarregar).
//
// Só em produção: em `next dev` os scripts de medição abrem as páginas direto.
export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const liberado = req.cookies.get(COOKIE_ACESSO)?.value === HASH_DA_SENHA;
  if (req.nextUrl.pathname === "/entrar") {
    return liberado ? NextResponse.redirect(new URL("/", req.url)) : NextResponse.next();
  }
  if (liberado) return NextResponse.next();
  return NextResponse.rewrite(new URL("/entrar", req.url));
}

export const config = {
  // Fora do portão: arquivos do Next, a rota que confere a senha e tudo o que
  // tem extensão — o catálogo em /r/*.json e o llms.txt precisam abrir sem
  // login, porque quem baixa é o shadcn CLI do cliente, não um navegador.
  matcher: ["/((?!_next/|api/acesso|.*\\.[a-zA-Z0-9]+$).*)"],
};
