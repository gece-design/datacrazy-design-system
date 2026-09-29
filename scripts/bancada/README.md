# Bancada — o Claude gerando tela com o DS

Mede o que o cliente vive: um projeto Next limpo, os quatro passos da página de
instalação, e um pedido de tela ao Claude Code em linguagem normal. O resultado
é pontuado pelas regras do DS (as mesmas do `check-tokens`) mais regras de tela,
compila, constrói e sai capturado nos dois temas.

```bash
# 1 · o DS servindo e o catálogo apontando para ele mesmo
npm run build && npm run start &
DS_URL=http://localhost:4321 node scripts/gerar-registry.mjs

# 2 · a base (uma vez; refaça quando a instalação mudar)
node scripts/bancada/preparar.mjs

# 3 · uma rodada (3 casos, ~5 min cada)
node scripts/bancada/rodar.mjs todos --rotulo v1

# 4 · re-pontuar uma rodada sem chamar o Claude
node scripts/bancada/pontuar.mjs ~/datacrazy-bancada/rodadas/v1/contatos
```

Casos em `casos.json`. Rodadas em `~/datacrazy-bancada/rodadas/<rotulo>/<caso>`:
`prompt.txt`, `claude.json` (custo, turnos, duração), `resposta.md`,
`pontuacao.json`, `capturas/`. O `claude` usado é o do PATH ou o da extensão do
VS Code (`CLAUDE_BIN` troca).
