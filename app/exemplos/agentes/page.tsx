import type { Metadata } from "next";
import { Tela } from "./tela";

export const metadata: Metadata = {
  title: "Agentes de IA · DataCrazy",
  description: "Os agentes de IA do CRM em cartões, com score, modelo e ferramentas, e as bases de conhecimento e os servidores MCP ao lado",
};

/**
 * Tela de exemplo, não componente. Roda fora da moldura do site: ocupa a
 * janela inteira, como uma tela do CRM.
 */
export default function AgentesPage() {
  return <Tela />;
}
