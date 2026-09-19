// Catraca: uma verificação nova nasce sobre um repo que ainda a viola. Em vez
// de ficar vermelha até o último lote (e o `check` deixar de dizer algo), ela
// guarda a contagem de hoje por chave e só reprova o que PIORA. Cada lote
// abaixa a base com `--atualizar-base`; `--estrito` ignora a base e reprova
// tudo — é o modo que a auditoria (consistencia.mjs verificar) usa.
import fs from "node:fs";
import path from "node:path";
import { RAIZ } from "./fonte.mjs";

const PASTA = path.join(RAIZ, "scripts/baseline");

export const flags = () => {
  const a = process.argv.slice(2);
  return {
    estrito: a.includes("--estrito"),
    atualizar: a.includes("--atualizar-base"),
    json: a.includes("--json"),
    tudo: a.includes("--tudo"),
    resto: a.filter((x) => !x.startsWith("--")),
  };
};

/**
 * @param nome  nome da verificação (arquivo da base)
 * @param achados  [{ chave, ...detalhe }] — a chave agrupa (ex.: `regra|arquivo`)
 * @returns código de saída
 */
export function catraca(nome, achados, { estrito, atualizar, json }) {
  const arquivo = path.join(PASTA, `${nome}.json`);
  const agora = {};
  for (const a of achados) agora[a.chave] = (agora[a.chave] ?? 0) + 1;

  if (json) {
    console.log(JSON.stringify(achados, null, 2));
    return achados.length ? 1 : 0;
  }
  if (atualizar) {
    fs.mkdirSync(PASTA, { recursive: true });
    const ordenado = Object.fromEntries(Object.entries(agora).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(arquivo, JSON.stringify(ordenado, null, 2) + "\n");
    console.log(`base atualizada: ${path.relative(RAIZ, arquivo)} (${achados.length} ocorrência(s) em ${Object.keys(agora).length} chave(s))`);
    return 0;
  }
  if (estrito) {
    console.log(achados.length ? `\n✗ ${achados.length} ocorrência(s) (modo estrito)` : "\n✓ nada a apontar");
    return achados.length ? 1 : 0;
  }

  const base = fs.existsSync(arquivo) ? JSON.parse(fs.readFileSync(arquivo, "utf8")) : null;
  if (!base) {
    console.log(`\nsem base em ${path.relative(RAIZ, arquivo)} — rode com --atualizar-base para fixar a contagem de hoje (${achados.length})`);
    return achados.length ? 1 : 0;
  }
  const piorou = Object.entries(agora).filter(([k, n]) => n > (base[k] ?? 0));
  const melhorou = Object.entries(base).filter(([k, n]) => (agora[k] ?? 0) < n);
  for (const [k, n] of piorou) console.log(`✗ piorou  ${k}: ${base[k] ?? 0} → ${n}`);
  for (const [k, n] of melhorou) console.log(`✓ melhorou ${k}: ${n} → ${agora[k] ?? 0}`);
  const total = Object.values(base).reduce((s, n) => s + n, 0);
  console.log(`\n${achados.length} ocorrência(s) hoje · ${total} na base` + (melhorou.length ? " — abaixe a base com --atualizar-base" : ""));
  if (piorou.length) {
    console.log(`✗ ${piorou.length} chave(s) pioraram em relação à base`);
    return 1;
  }
  console.log("✓ nada piorou em relação à base");
  return 0;
}
