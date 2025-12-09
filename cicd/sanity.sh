#!/usr/bin/env bash
set -e

echo "🔍 Running Sanity Checks..."

# Frontend
echo "🧪 Checking Frontend Build..."
cd ../Ai_LMS_Frontend
npm ci --prefer-offline --no-audit --silent
npm run build
cd - > /dev/null

# Backend
echo "🐍 Running Backend Checks..."
cd ../Backend/Ai_Lms_Backed
python3 -m py_compile $(find . -name "*.py")
python3 manage.py check
cd - > /dev/null

echo "✔ Sanity checks passed!"
