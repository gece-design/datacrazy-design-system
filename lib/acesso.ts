// Portão por senha do site de documentação (middleware.ts + app/entrar).
//
// Não protege o código: o catálogo em /r/ e o llms.txt ficam públicos de
// propósito, porque o shadcn CLI de quem instala baixa sem login. A senha só
// guarda as páginas.
//
// Aqui fica o hash, nunca a senha. Para trocar, gere o novo e cole abaixo:
//   node -e 'console.log(require("crypto").createHash("sha256").update("NOVA-SENHA").digest("hex"))'
export const COOKIE_ACESSO = "dc-acesso";
export const HASH_DA_SENHA = "1259c76f4ab0e2a5534066b815ae5702c8c34bfbac8742d33f0befbe71d4d8b5";
