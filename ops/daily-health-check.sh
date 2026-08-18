#!/bin/bash
export PATH="$HOME/.npm-global/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
cd /var/www/omstam || exit 1

claude -p "$(cat /var/www/omstam/ops/daily-health-check-prompt.md)" \
  --dangerously-skip-permissions \
  --add-dir /var/www/omstam
