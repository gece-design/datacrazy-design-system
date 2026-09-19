// Leitores do código-fonte compartilhados pelos scripts — o gerador do registry
// e as verificações (check-*.mjs) leem os mesmos arquivos e precisam enxergar
// a mesma coisa. Uma cópia por script é como as duas se soltam.
//
// Só leitura e regex sobre texto: zero dependências, zero efeito colateral.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const ler = (rel) => fs.readFileSync(path.join(RAIZ, rel), "utf8");
export const existe = (rel) => fs.existsSync(path.join(RAIZ, rel));
export const pascal = (nome) => nome.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
export const umaLinha = (t) => t.replace(/\s+/g, " ").trim();

/** Arquivos `.tsx` de components/ui, sem a extensão (o `name` do item do registry). */
export const componentesUi = () =>
  fs.readdirSync(path.join(RAIZ, "components/ui")).filter((f) => f.endsWith(".tsx")).map((f) => f.replace(/\.tsx$/, "")).sort();

/** Toda `page.tsx` dentro de app/, como rota (`/forms/input`). */
export function rotasDoApp() {
  const rotas = [];
  const andar = (dir) => {
    for (const e of fs.readdirSync(path.join(RAIZ, dir), { withFileTypes: true })) {
      if (e.isDirectory()) andar(`${dir}/${e.name}`);
      else if (e.name === "page.tsx") rotas.push(dir.replace(/^app/, "") || "/");
    }
  };
  andar("app");
  return rotas.sort();
}

/** Itens da navegação do site, lidos do texto de `components/ds/nav.ts`.
 *  Categoria: `titulo` seguido de `descricao`. Item: `titulo` seguido de `href`. */
export function lerNavegacao() {
  const fonte = ler("components/ds/nav.ts");
  const paginas = [];
  let categoria = null;
  for (const m of fonte.matchAll(/titulo:\s*"([^"]+)",\s*(href:\s*"([^"]+)"[^}]*)?/g)) {
    if (!m[2]) {
      categoria = m[1];
      continue;
    }
    paginas.push({
      titulo: m[1],
      href: m[3],
      categoria,
      pronto: /pronto:\s*true/.test(m[2]),
      descricao: m[2].match(/descricao:\s*"([^"]+)"/)?.[1],
    });
  }
  return paginas;
}

export function importsDe(fonte) {
  return [...fonte.matchAll(/(?:from|import)\s+"([^"]+)"/g)].map((m) => m[1]);
}

/** Separa o que vira item do catálogo do que vira pacote do npm. */
export function dependenciasDe(fonte, arquivo) {
  const itens = new Set();
  const pacotes = new Set();
  for (const spec of importsDe(fonte)) {
    if (spec.startsWith("@/components/ui/") || spec.startsWith("@/lib/") || spec.startsWith("./")) {
      itens.add(path.basename(spec));
    } else if (spec.startsWith("@/") || spec.startsWith(".")) {
      // Import de fora de ui/ e lib/ (ex.: components/ds) não existe no projeto
      // de quem instala. Melhor quebrar a geração do que publicar componente quebrado.
      throw new Error(`${arquivo}: import "${spec}" não pode ir para o catálogo`);
    } else {
      const pacote = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
      if (!["react", "react-dom", "next"].includes(pacote)) pacotes.add(pacote);
    }
  }
  return { itens: [...itens], pacotes: [...pacotes] };
}

export function exportsDe(fonte) {
  const nomes = new Set();
  for (const m of fonte.matchAll(/export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class|type|interface|enum)\s+([A-Za-z_]\w*)/g)) {
    nomes.add(m[1]);
  }
  for (const m of fonte.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
    for (const parte of m[1].split(",")) {
      const nome = parte.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop();
      if (nome) nomes.add(nome);
    }
  }
  return [...nomes];
}

/** Seções `## ` de um `.md` → { titulo: corpo }. `limpar` transforma o corpo
 *  antes do trim (o registry tira link relativo e marcador kfe). */
export function secoesDoMd(rel, limpar = (t) => t) {
  if (!existe(rel)) return null;
  const secoes = {};
  for (const parte of ler(rel).split(/^## /m).slice(1)) {
    const [titulo, ...resto] = parte.split("\n");
    secoes[titulo.trim()] = limpar(resto.join("\n")).trim();
  }
  return secoes;
}

/** Os trechos da aba "Código" da página do componente no site: toda string
 *  `codigo* = \`...\`` sem interpolação. */
export function exemplosDaPagina(rel) {
  if (!rel || !existe(rel)) return [];
  const exemplos = new Set();
  for (const m of ler(rel).matchAll(/codigo\w*\s*=\s*\{?\s*`((?:\\[\s\S]|[^`\\])*)`/g)) {
    // interpolação de verdade: o texto final só existe em runtime
    if (/(^|[^\\])\$\{/.test(m[1])) continue;
    exemplos.add(m[1].replace(/\\([`$\\])/g, "$1").trim());
  }
  return [...exemplos];
}

/** Blocos ```tsx de uma seção de doc. */
export function blocosDeCodigo(texto) {
  return [...(texto ?? "").matchAll(/```(?:tsx|jsx|ts)?\n([\s\S]*?)```/g)].map((m) => m[1].trim());
}
