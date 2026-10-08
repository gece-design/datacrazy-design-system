// Os sinais de status que pintam a bolinha de uma Tag — e, na opção de uma
// lista, o mesmo ponto sem a pílula (ADR-069). Moram em lib/ pela regra D21:
// o Select e o Combobox pintam o mesmo sinal sem instalar a Tag.

/** Os três status do arquivo: a cor da bolinha. */
export type StatusDaTag = "destructive" | "info" | "success";

/** A bolinha de 6px por status. */
export const PONTO_DO_STATUS: Record<StatusDaTag, string> = {
  destructive: "bg-destructive",
  info: "bg-info",
  success: "bg-success",
};

/** O ícone no lugar da bolinha, na mesma cor. */
export const TEXTO_DO_STATUS: Record<StatusDaTag, string> = {
  destructive: "text-destructive",
  info: "text-info",
  success: "text-success",
};
