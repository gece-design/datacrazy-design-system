#!/usr/bin/env bash
# Instala o kit do Kill Front-End num produto (ou global com --global)
set -euo pipefail
KIT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [[ "${1:-}" == "--global" ]]; then DEST="$HOME/.claude"; else
  DEST="${1:-.}/.claude"
fi
mkdir -p "$DEST/skills" "$DEST/commands"
cp -r "$KIT_DIR/skills/." "$DEST/skills/"
cp -r "$KIT_DIR/commands/." "$DEST/commands/"
echo "Kit instalado em $DEST"
echo "Templates e scripts ficam no kit — as skills os referenciam por caminho:"
echo "  $KIT_DIR/templates · $KIT_DIR/scripts"
echo "Dica: no produto, rode 'npm i -D pixelmatch pngjs' para o pixel-diff."
