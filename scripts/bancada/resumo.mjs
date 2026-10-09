// Resume as rodadas da bancada em docs/processo/bancada.json — o que a página
// /entrega mostra (via gerar-entrega). Rótulo → skill: v1 é a skill antiga
// (só regras), v2 é a skill com receitas, densidade e ds-check, v3 é o
// contrato + memória instalados pelo setup e o hook do ds-check ligado (ADR-080).
//
//   node scripts/bancada/resumo.mjs            (todas as rodadas em ~/datacrazy-bancada/rodadas)
import fs from "node:fs";
import path from "node:path";
import { RODADAS, CASOS, listar } from "./lib.mjs";

const SKILL = { v1: "regras (antiga)", v2: "receitas + densidade + ds-check", v3: "contrato + memória + hook (ADR-080)" };
const rodadas = [];
for (const rotulo of fs.existsSync(RODADAS) ? fs.readdirSync(RODADAS).sort() : []) {
  const casos = [];
  for (const caso of CASOS) {
    const dir = path.join(RODADAS, rotulo, caso.id);
    const pj = path.join(dir, "pontuacao.json");
    if (!fs.existsSync(pj)) continue;
    const p = JSON.parse(fs.readFileSync(pj, "utf8"));
    // o que a tela escrita usa, fora do DS e do bloco de referência
    const fontes = p.escritos.filter((r) => /\.tsx?$/.test(r) && !r.startsWith("app/pipeline/") && !r.startsWith("lib/")).map((r) => fs.existsSync(path.join(dir, r)) ? fs.readFileSync(path.join(dir, r), "utf8") : "");
    const tem = (re) => fontes.some((f) => re.test(f));
    casos.push({
      id: caso.id,
      erro: p.claude?.erro ? "limite da sessão" : null,
      violacoes: p.achados.length,
      componentes: p.componentesDoDS.length,
      paginas: p.paginas.map((x) => x.rota),
      telaBase: p.paginas.every((x) => x.telaBase),
      // só faz sentido onde há lista (null = não se aplica). A Table nasce densa (ADR-043):
      // o que reprova é pedir `confortavel` numa lista de registros
      densa: tem(/<DataTable\b/) ? !tem(/layout="confortavel"/) : null,
      headerFiltros: tem(/<DataTable\b/) ? tem(/HeaderFiltros/) : null,
      // tag colorida SORTEADA: `tom` literal ou `tomDe(…)` numa Tag. A cor que vem do catálogo
      // (`t.tom`) ou da etapa (`etapa.tom`) é a regra, não o desvio (ADR-059, ADR-069)
      tagsNeutras: tem(/<Tag\b/) || tem(/etiquetas=/) ? !(tem(/<Tag\b[^>]*\btom="[a-z]+"/) || tem(/<Tag\b[^>]*\btom=\{tomDe\(/)) : null,
      dsCheck: tem(/ds-check/) || /ds-check/.test(fs.existsSync(path.join(dir, "resposta.md")) ? fs.readFileSync(path.join(dir, "resposta.md"), "utf8") : ""),
      tsc: p.tsc === "ok",
      build: p.build === "ok",
      turnos: p.claude?.turnos ?? null,
      minutos: p.claude ? Math.round((p.claude.duracao_s ?? 0) / 60) : null,
      custo: p.claude?.custo_usd ?? null,
    });
  }
  if (casos.length) rodadas.push({ rotulo, skill: SKILL[rotulo] ?? rotulo, casos });
}
const saida = { geradoEm: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), casos: CASOS, rodadas };
fs.writeFileSync(new URL("../../docs/processo/bancada.json", import.meta.url), JSON.stringify(saida, null, 2) + "\n");
for (const r of rodadas) for (const c of r.casos) console.log(`${r.rotulo}/${c.id}: ${c.erro ?? `${c.violacoes} violação(ões) · ${c.componentes} comp. · densa ${c.densa ? "sim" : "não"} · filtros no Header ${c.headerFiltros ? "sim" : "não"} · tags neutras ${c.tagsNeutras ? "sim" : "não"} · ${c.minutos} min · US$ ${c.custo}`}`);
