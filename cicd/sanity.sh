#!/usr/bin/env bash
set -e

echo "🔍 Running Sanity Checks..."

#########################################
# FRONTEND CHECK
#########################################

echo "🧪 Checking Frontend Build..."
cd ../Ai_LMS_Frontend

npm install --silent
npm run build

cd - > /dev/null


#########################################
# BACKEND CHECK
#########################################

echo "🐍 Checking Backend Dependencies..."
cd ../Backend/Ai_LMS_Backed

echo "📦 Creating Python venv..."
python3 -m venv venv

# Validate venv creation
if [ ! -f "venv/bin/pip" ]; then
    echo "❌ ERROR: venv was created but pip does NOT exist!"
    echo "👉 FIX REQUIRED: Install python3-venv on this machine:"
    echo "   sudo apt install python3-venv python3-full -y"
    exit 1
fi

echo "⬆️ Upgrading pip..."
venv/bin/pip install --quiet --upgrade pip

echo "📦 Installing backend dependencies..."
venv/bin/pip install --quiet -r requirements.txt

echo "✔ Running Django system checks..."
venv/bin/python manage.py check

echo "✔ Backend OK!"
cd - > /dev/null


echo "🎉 All checks passed!"
