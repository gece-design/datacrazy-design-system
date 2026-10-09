import type { Metadata } from "next";
import { Prototipo } from "./prototipo";

export const metadata: Metadata = {
  title: "Protótipo SystemCrazy",
  description: "O CRM navegável, montado só com o design system: dashboard, pipeline, leads, atendimento, automações e agentes de IA numa tela só",
};

/**
 * O protótipo: as telas de exemplo juntas, com a navegação ligada. Roda fora
 * da moldura do site e ocupa a janela inteira, como o CRM. `?tela=` abre
 * direto numa delas; `&vazio=1` mostra a variação sem nada (a conta nova),
 * `&carregando=1` segura a tela no modelo de carregamento e `&lead=abas|lado|cheia`
 * abre o lead numa das versões em avaliação (ADR-081).
 */
export default async function PrototipoPage({ searchParams }: { searchParams: Promise<{ tela?: string; vazio?: string; carregando?: string; lead?: string }> }) {
  const { tela, vazio, carregando, lead } = await searchParams;
  const versaoDoLead = lead === "abas" || lead === "lado" || lead === "cheia" ? lead : undefined;
  return <Prototipo telaInicial={tela} variacao={carregando ? "carregando" : vazio ? "vazio" : undefined} versaoDoLead={versaoDoLead} />;
}
