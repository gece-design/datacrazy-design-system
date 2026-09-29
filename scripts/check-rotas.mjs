// Rota é um fato com quatro donos que precisam concordar: `components/ds/nav.ts`
// (a verdade), `app/**/page.tsx` (o que existe), `public/r/*.json` (o que o
// registry publica como `docs:`) e a URL do site (que só pode ter um dono).
//
//   node scripts/check-rotas.mjs [--estrito|--atualizar-base|--json]
import fs from "node:fs";
import path from "node:path";
import { RAIZ, existe, lerNavegacao, rotasDoApp } from "./lib/fonte.mjs";
import { catraca, flags } from "./lib/ratchet.mjs";

// Rotas fora da navegação de propósito.
const FORA_DO_NAV = {
  "/entrar": "portão de senha, não é página do catálogo",
  "/entrega": "relatório de entrega — link direto para o cliente, fora do catálogo",
  "/exemplos/proposta-visual": "proposta de casca (Twenty/Attio) para o humano aprovar — link direto, não é catálogo",
};

const nav = lerNavegacao();
const paginas = new Set(rotasDoApp());
const achados = [];
const marca = (regra, onde, detalhe) => achados.push({ chave: `${regra}|${onde}`, regra, arquivo: onde, linha: 0, trecho: detalhe });

for (const rota of paginas) {
  const item = nav.find((i) => i.href === rota);
  if (!item && !FORA_DO_NAV[rota]) marca("pagina-fora-do-nav", `app${rota}/page.tsx`, `existe e não está em components/ds/nav.ts`);
  if (item && !item.pronto) marca("pagina-sem-pronto", `app${rota}/page.tsx`, `existe, mas o item "${item.titulo}" não tem pronto: true`);
}
for (const item of nav) {
  if (item.pronto && !paginas.has(item.href)) marca("pronto-sem-pagina", "components/ds/nav.ts", `"${item.titulo}" (${item.href}) marcado pronto e app${item.href}/page.tsx não existe`);
}

// `docs:` do registry — só se o catálogo estiver gerado
const pastaR = path.join(RAIZ, "public/r");
if (fs.existsSync(pastaR)) {
  for (const f of fs.readdirSync(pastaR).filter((f) => f.endsWith(".json") && f !== "registry.json")) {
    const item = JSON.parse(fs.readFileSync(path.join(pastaR, f), "utf8"));
    const m = typeof item.docs === "string" && item.docs.match(/https?:\/\/[^/\s]+(\/[^\s]*)$/);
    if (!m) continue;
    // `docs:` pode apontar para a seção de uma página (#ancora): a rota é o que vem antes
    const rota = m[1].replace(/#.*$/, "").replace(/\/$/, "") || "/";
    if (!paginas.has(rota)) marca("docs-para-rota-inexistente", `public/r/${f}`, `docs: ${rota} → 404 (gerado por scripts/gerar-registry.mjs)`);
  }
} else if (!flags().json) {
  console.log("aviso: public/r não existe — rode `npm run registry` para conferir os links `docs:`");
}

// URL do site: um dono só
// montado em partes para este arquivo não se apontar como dono
const dominio = ["datacrazy-design-system", "vercel", "app"].join(".");
const donos = [];
const andar = (dir) => {
  for (const e of fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) andar(rel);
    else if (/\.(tsx?|mjs|js)$/.test(e.name) && fs.readFileSync(path.join(RAIZ, rel), "utf8").includes(dominio)) donos.push(rel);
  }
};
for (const d of ["app", "components", "lib", "scripts"]) if (existe(d)) andar(d);
if (donos.length > 1) for (const d of donos) marca("url-com-mais-de-um-dono", d, `"${dominio}" também em: ${donos.filter((x) => x !== d).join(", ")}`);

if (!flags().json) {
  for (const a of achados) console.log(`✗ ${a.regra}  ${a.arquivo}  ${a.trecho}`);
  console.log(`\n${nav.length} itens no nav · ${paginas.size} páginas em app/ · ${nav.filter((i) => i.pronto).length} prontas`);
}
process.exit(catraca("rotas", achados, flags()));
