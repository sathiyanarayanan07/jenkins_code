#!/usr/bin/env bash
set -e

echo "🔍 Running Sanity Checks..."

# Frontend build check
echo "🧪 Checking Frontend Build..."
cd ../Ai_LMS_Frontend
npm ci
npm run build
cd - > /dev/null

# Backend Python syntax check
echo "🐍 Checking Backend Syntax..."
cd ../Backend/Ai_Lms_Backend
python3 -m py_compile $(find . -name "*.py")
cd - > /dev/null

echo "✔ All sanity checks passed!"
