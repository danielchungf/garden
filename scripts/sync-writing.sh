#!/bin/bash
# Syncs writing content from Obsidian vault into the repo before each commit.
# If the vault exists locally, copies fresh files and stages them.

VAULT_DIR="$HOME/Documents/_notes/writing"
CONTENT_DIR="content/writing"

if [ -d "$VAULT_DIR" ]; then
  rm -rf "$CONTENT_DIR"
  mkdir -p "$CONTENT_DIR"
  cp -r "$VAULT_DIR"/* "$CONTENT_DIR"/ 2>/dev/null
  git add "$CONTENT_DIR"
fi
