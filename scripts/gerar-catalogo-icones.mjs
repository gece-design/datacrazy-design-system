// Gera o catálogo de ícones a partir dos ASSETS OFICIAIS do @phosphor-icons/core.
// Nada é digitado à mão: nomes, categorias e tags vêm do catálogo do pacote, e o
// traçado vem do arquivo .svg dele. Atualizar o pacote e rodar isto de novo
// mantém a página sincronizada com a versão oficial.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { icons } = require("@phosphor-icons/core");
const versao = JSON.parse(readFileSync(new URL("../node_modules/@phosphor-icons/core/package.json", import.meta.url), "utf8")).version;

const RAIZ = new URL("../", import.meta.url).pathname;
const ASSETS = RAIZ + "node_modules/@phosphor-icons/core/assets/";
const SAIDA = RAIZ + "public/phosphor/";
if (!existsSync(SAIDA)) mkdirSync(SAIDA, { recursive: true });

const PESOS = ["thin", "light", "regular", "bold", "fill", "duotone"];

for (const peso of PESOS) {
  const lista = [];
  for (const ico of icons) {
    // o arquivo do peso "regular" não leva sufixo; os demais levam
    const arq = peso === "regular" ? `${ico.name}.svg` : `${ico.name}-${peso}.svg`;
    const caminho = ASSETS + peso + "/" + arq;
    if (!existsSync(caminho)) continue;
    const svg = readFileSync(caminho, "utf8");
    const corpo = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
    lista.push({
      n: ico.name,
      p: ico.pascal_name,
      c: ico.categories ?? [],
      t: (ico.tags ?? []).filter((x) => !x.startsWith("*")),
      d: corpo,
    });
  }
  const json = JSON.stringify({ versao, peso, total: lista.length, icones: lista });
  writeFileSync(SAIDA + peso + ".json", json);
  console.log(`${peso.padEnd(9)} ${String(lista.length).padStart(5)} ícones · ${(json.length / 1024).toFixed(0)} kB`);
}
console.log(`\ncatálogo @phosphor-icons/core v${versao}`);
