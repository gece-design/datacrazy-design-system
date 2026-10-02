import type { Metadata } from "next";
import { Prototipo } from "./prototipo";

export const metadata: Metadata = {
  title: "Protótipo SystemCrazy",
  description: "O CRM navegável, montado só com o design system: dashboard, pipeline, leads, atendimento, automações e agentes de IA numa tela só",
};

/**
 * O protótipo: as telas de exemplo juntas, com a navegação ligada. Roda fora
 * da moldura do site e ocupa a janela inteira, como o CRM. `?tela=` abre
 * direto numa delas.
 */
export default async function PrototipoPage({ searchParams }: { searchParams: Promise<{ tela?: string }> }) {
  const { tela } = await searchParams;
  return <Prototipo telaInicial={tela} />;
}
