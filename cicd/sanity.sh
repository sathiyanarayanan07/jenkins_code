#!/usr/bin/env bash
set -e

echo "🔍 Running Sanity Checks..."

# ==========================
# FRONTEND CHECK
# ==========================

echo "🧪 Checking Frontend Build..."
cd ../Ai_LMS_Frontend

# Install dependencies
npm install --silent

# Build the project
npm run build

cd - > /dev/null

echo "✔ Frontend build successful!"

# ==========================
# BACKEND CHECK
# ==========================

echo "🐍 Checking Backend Dependencies..."
cd ../Backend/Ai_LMS_Backend  # <-- Fixed directory name

# Remove old venv if exists (optional)
rm -rf venv

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install python requirements
pip install --quiet -r requirements.txt

echo "✔ Checking Django system..."
python manage.py check

echo "✔ Backend OK"
cd - > /dev/null

# ==========================
# DONE
# ==========================

echo "🎉 All checks passed!"
