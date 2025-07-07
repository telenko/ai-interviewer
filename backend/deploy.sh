#!/bin/bash

# Завантаження змінних із .env
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "⚠️  .env файл не знайдено!"
  exit 1
fi

# Перевірка чи змінна є
if [ -z "$OPENAI_API_KEY" ]; then
  echo "❌ OPENAI_API_KEY не встановлений"
  exit 1
fi

# Деплой
sam deploy \
  --region eu-central-1 \
  --parameter-overrides OpenAIApiKey="$OPENAI_API_KEY"