import { Conteudo } from "./conteudo";

/**
 * Os mocks do cliente como ele mandou. Esta rota é pública — é o que vai no
 * link da reunião.
 *
 * O conteúdo quebra as regras do design system de propósito: ver o comentário
 * no topo de ./mocks-cliente.tsx. A versão refeita com o DS, que é material
 * interno, fica em ./ds e só existe em desenvolvimento.
 */
export default function DrawerLead2Page() {
  return <Conteudo />;
}
