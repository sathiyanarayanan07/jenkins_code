#!/usr/bin/env bash
set -e

echo "🔍 Running Sanity Checks..."

# =======================
# FRONTEND TEST
# =======================
echo "🧪 Testing React Build..."
cd ../Ai_LMS_Frontend
npm install --silent
npm run build
cd - >/dev/null

# =======================
# BACKEND TEST
# =======================
echo "🐍 Checking Django Syntax..."
cd ../Backend/Ai_LMS_Backed
python3 -m py_compile $(find . -name "*.py")
cd - >/dev/null

echo "✔ All sanity checks passed!"
