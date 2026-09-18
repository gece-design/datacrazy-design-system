import { notFound } from "next/navigation";
import { Conteudo } from "./conteudo";

/**
 * Rota de desenvolvimento. Fica salva no repositório e NÃO sobe visível para a
 * Vercel: em produção responde 404, e não há link para ela na navegação.
 *
 * É a versão das propostas do cliente refeita com o design system — material
 * interno de argumentação. O que o cliente recebe é /feedback/drawer-lead-2,
 * com os mocks dele como ele mandou.
 */
export default function DrawerLead2DSPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Conteudo />;
}
