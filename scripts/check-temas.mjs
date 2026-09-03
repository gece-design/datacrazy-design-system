// Regra E4: nenhuma variável de tema pode repetir valor entre Claro e Escuro
// sem intenção declarada. É literalmente o bug #80174, que tinha 13 das ~30
// variáveis iguais nos dois modos e deixava o título invisível no escuro.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function bloco(seletor) {
  const i = css.indexOf(seletor);
  if (i < 0) return {};
  const abre = css.indexOf("{", i);
  let nivel = 0, fim = abre;
  for (let j = abre; j < css.length; j++) {
    if (css[j] === "{") nivel++;
    else if (css[j] === "}") { nivel--; if (nivel === 0) { fim = j; break; } }
  }
  const corpo = css.slice(abre + 1, fim);
  const vars = {};
  for (const m of corpo.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}

const claro = bloco(":root");
const escuro = bloco(".dark");

// Intenção declarada: primitivos não mudam com tema, por definição.
const INTENCIONAL = new Set([
  ...Object.keys(claro).filter((k) => k.startsWith("blue-") || k.startsWith("neutral-")),
  "radius",
  "primary-foreground", // branco sobre o azul nos dois temas — decisão registrada
]);

const semantico = Object.keys(escuro);
const iguais = semantico.filter((k) => claro[k] === escuro[k] && !INTENCIONAL.has(k));
const semPar = semantico.filter((k) => !(k in claro));

console.log(`Variáveis semânticas com valor nos dois modos: ${semantico.length}`);
if (semPar.length) console.log(`✗ ${semPar.length} só existem no escuro: ${semPar.join(", ")}`);

if (iguais.length === 0) {
  console.log("✓ nenhuma repete valor entre Claro e Escuro sem intenção declarada");
  process.exit(0);
}
console.log(`\n✗ ${iguais.length} repetem valor nos dois modos (regra E4 · bug #80174):`);
for (const k of iguais) console.log(`   --${k}: ${claro[k]}`);
console.log("\nCada uma precisa de valor próprio no escuro ou de intenção declarada em INTENCIONAL.");
process.exit(1);
