#!/usr/bin/env bash
set -e

echo "🔍 Running Sanity Checks..."

# FRONTEND
echo "🧪 Checking Frontend Build..."
cd ../Ai_LMS_Frontend
npm install --silent
npm run build
cd - > /dev/null

# BACKEND
echo "🐍 Checking Backend Dependencies..."
cd ../Backend/Ai_LMS_Backed

# Create virtual environment
python3 -m venv venv
. venv/bin/activate

# Install python requirements (PEP 668 fix)
pip install --quiet --break-system-packages --upgrade pip
pip install --quiet --break-system-packages -r requirements.txt

echo "✔ Checking Django..."
python manage.py check

echo "✔ Backend OK"
cd - > /dev/null

echo "🎉 All checks passed!"
