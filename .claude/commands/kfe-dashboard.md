Abra o painel visual do Kill Front-End.

Na raiz do produto, execute em segundo plano:
`node <caminho-do-kit>/scripts/kfe-dashboard.mjs` e informe ao usuário
a URL (http://localhost:4242). O painel lê docs/processo/kfe-state.md e
docs/processo/metrics.md e se atualiza sozinho a cada 3s — nenhuma manutenção manual.
Se o estado não existir ainda, oriente a rodar um comando /kfe-* antes.
