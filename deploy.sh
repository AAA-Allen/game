#!/usr/bin/env bash
set -euo pipefail

echo "=== 1. Pull latest code ==="
cd /var/www/webquest
git pull origin main

echo "=== 2. Build server ==="
cd /var/www/webquest/server
npm install --production
npm run build

echo "=== 3. Build client ==="
cd /var/www/webquest/web
npm install
npm run build

echo "=== 4. Reload server ==="
pm2 reload webquest-server || pm2 start /var/www/webquest/server/dist/index.js --name webquest-server

echo "=== 5. Reload nginx ==="
sudo nginx -t && sudo systemctl reload nginx

echo "=== Done! ==="
