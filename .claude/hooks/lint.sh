#!/usr/bin/env bash
set -euo pipefail

# Claude Code PostToolUse hook: lint changed .ts/.tsx files
# Runs oxlint + oxfmt --check on the edited file

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | node -e "process.stdin.on('data',d=>{const v=JSON.parse(d).tool_input?.file_path;if(v)process.stdout.write(v)})")

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only process .ts and .tsx files
case "$FILE_PATH" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# Skip node_modules, cdk.out, .d.ts
case "$FILE_PATH" in
  */node_modules/*|*/cdk.out/*|*.d.ts) exit 0 ;;
esac

if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

ERRORS=""

LINT_OUTPUT=$(npx oxlint "$FILE_PATH" 2>&1) || {
  ERRORS="${ERRORS}
=== oxlint errors ===
${LINT_OUTPUT}"
}

FMT_OUTPUT=$(npx oxfmt --check "$FILE_PATH" 2>&1) || {
  ERRORS="${ERRORS}
=== oxfmt format errors ===
${FMT_OUTPUT}
Hint: Run 'npx oxfmt \"$FILE_PATH\"' to auto-format."
}

if [ -n "$ERRORS" ]; then
  echo "Lint/format issues in $FILE_PATH:${ERRORS}" >&2
  exit 2
fi

exit 0
