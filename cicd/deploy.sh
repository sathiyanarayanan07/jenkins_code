#!/usr/bin/env bash
set -e

SERVER_USER="root"
SERVER_IP="213.210.21.150"

WEB_PATH="/home/thirdvizion-furnicho/htdocs/furnicho.thirdvizion.com"
BACKEND_PATH="${WEB_PATH}/backend"

FRONTEND_DIR="../Ai_LMS_Frontend"
BACKEND_DIR="../Backend/Ai_LMS_Backed"

echo "🚀 Building React App..."
cd "$FRONTEND_DIR"
npm install --silent
npm run build
cd - > /dev/null

echo "🧹 Remove old frontend dist..."
ssh $SERVER_USER@$SERVER_IP "rm -rf ${WEB_PATH}/dist"

echo "📦 Uploading new frontend..."
scp -r ${FRONTEND_DIR}/dist $SERVER_USER@$SERVER_IP:${WEB_PATH}/

echo "✨ Frontend deployed!"

echo "🚀 Deploying Django Backend..."
ssh $SERVER_USER@$SERVER_IP "
mkdir -p ${BACKEND_PATH}
"

echo "🧹 Cleaning old backend..."
ssh $SERVER_USER@$SERVER_IP "rm -rf ${BACKEND_PATH}/*"

echo "📦 Uploading new backend..."
scp -r ${BACKEND_DIR}/* $SERVER_USER@$SERVER_IP:${BACKEND_PATH}/

echo "🐍 Installing backend dependencies..."
ssh $SERVER_USER@$SERVER_IP "
cd ${BACKEND_PATH}

# Create venv if not found
if [ ! -d venv ]; then
    python3 -m venv venv
fi
source venv/bin/activate

# FIX for Python 3.12 / PEP 668
pip install --upgrade pip --break-system-packages
pip install --no-cache-dir -r requirements.txt --break-system-packages

python manage.py makemigrations --noinput || true
python manage.py migrate --noinput
python manage.py collectstatic --clear --noinput
"

echo "🔁 Restarting backend..."
ssh $SERVER_USER@$SERVER_IP "systemctl restart nginx"

echo "💯 Deployment Completed!"
