#!/bin/bash
# scripts/install-hooks.sh
# Installs git hooks for the game repo.

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"

mkdir -p "$HOOKS_DIR"

POST_COMMIT_HOOK="$HOOKS_DIR/post-commit"

cat > "$POST_COMMIT_HOOK" << 'EOF'
#!/bin/bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
if [ -x "$REPO_ROOT/scripts/game-repo-post-commit.sh" ]; then
  exec "$REPO_ROOT/scripts/game-repo-post-commit.sh"
fi
EOF

chmod +x "$POST_COMMIT_HOOK"
chmod +x "$REPO_ROOT/scripts/game-repo-post-commit.sh"
chmod +x "$REPO_ROOT/scripts/wait-and-push-game-repo.sh"

echo "Installed post-commit hook successfully."
