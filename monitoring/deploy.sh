#!/bin/bash

# Завантаження змінних із .env
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "⚠️  .env файл не знайдено!"
  exit 1
fi

# Білд
echo "🔨 Ребілд проєкту..."
sam.cmd build || { echo "❌ SAM build помилка"; exit 1; }

# Деплой
echo "🔨 Деплой проєкту..."
sam.cmd deploy \
  --region eu-central-1 \
  --parameter-overrides AuthClientID="$AUTH_CLIENT_ID" \
    AuthIssuerURL="$AUTH_ISSUER_URL" \
    AllowOrigin="$ALLOW_ORIGIN"