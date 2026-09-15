// Portão por senha do site de documentação (middleware.ts + app/entrar).
//
// Não protege o código: o catálogo em /r/ e o llms.txt ficam públicos de
// propósito, porque o shadcn CLI de quem instala baixa sem login. A senha só
// guarda as páginas.
//
// Aqui fica o hash, nunca a senha. Para trocar, gere o novo e cole abaixo:
//   node -e 'console.log(require("crypto").createHash("sha256").update("NOVA-SENHA").digest("hex"))'
export const COOKIE_ACESSO = "dc-acesso";
export const HASH_DA_SENHA = "8d6d4bf3a078bb9bd89767b596bdce8646765af2184858d5aaa05111743a9b2f";
