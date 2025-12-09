#!/bin/bash
# Setup Script Permissions
# Makes all shell scripts executable (for Linux/macOS)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Making scripts executable..."

chmod +x "$SCRIPT_DIR"/*.sh
chmod +x "$SCRIPT_DIR"/utils/*.js 2>/dev/null || true

echo "✅ All scripts are now executable"

# List executable scripts
echo ""
echo "Executable scripts:"
ls -lh "$SCRIPT_DIR"/*.sh | awk '{print $9, "(" $1 ")"}'