#!/bin/bash

set -e

# === Параметри ===
STACK_NAME="interviewer-ui"
TEMPLATE_FILE="template.yaml"
BUCKET_NAME="ai-interviewer-atelenko"
DISTRIBUTION_ID="E2E9YZ63DI1NIO"  # ← встав після першого деплою

# === Побудова CRA (якщо є package.json)
if [ -f "package.json" ]; then
  echo "📦 Building React app..."
  npm run build
fi

# === Деплой CloudFormation шаблону
echo "☁️ Deploying CloudFormation stack: $STACK_NAME ..."
aws cloudformation deploy \
  --template-file "$TEMPLATE_FILE" \
  --stack-name "$STACK_NAME" \
  --capabilities CAPABILITY_NAMED_IAM

# === Витягування CloudFront Distribution ID (одноразово)
if [ -z "$DISTRIBUTION_ID" ]; then
  echo "🔍 Getting CloudFront Distribution ID..."
  DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" \
    --output text \
    | awk -F/ '{print $3}' | sed 's/\.cloudfront\.net//')
  echo "✅ Found Distribution ID: $DISTRIBUTION_ID"
fi

# === Заливка dist в S3
echo "🚀 Uploading dist to S3: $BUCKET_NAME ..."
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete

# === Інвалідація кешу CloudFront
echo "🧹 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*"

echo "✅ Done! Site deployed."
