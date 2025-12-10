#!/usr/bin/env bash
set -e

SERVER_USER="root"
SERVER_IP="213.210.21.150"

APP_ROOT="/home/thirdvizion-furnicho"
WEB_PATH="${APP_ROOT}/htdocs/furnicho.thirdvizion.com"
BACKEND_PATH="${APP_ROOT}/backend"

FRONTEND_DIR="../Ai_LMS_Frontend"
BACKEND_DIR="../Backend/Ai_LMS_Backend"

echo "🚀 Building React App..."
cd "$FRONTEND_DIR"
npm ci --silent
npm run build
cd - > /dev/null

echo "🧹 Cleaning old frontend files..."
ssh $SERVER_USER@$SERVER_IP "rm -rf ${WEB_PATH}/dist"

echo "📦 Uploading new frontend build..."
scp -r ${FRONTEND_DIR}/dist $SERVER_USER@$SERVER_IP:${WEB_PATH}/

echo "✨ Frontend deployed!"

echo "🚀 Deploying Django Backend..."

ssh $SERVER_USER@$SERVER_IP "
mkdir -p ${BACKEND_PATH}
rm -rf ${BACKEND_PATH}/project
"

scp -r "$BACKEND_DIR" $SERVER_USER@$SERVER_IP:"${BACKEND_PATH}/project"

ssh $SERVER_USER@$SERVER_IP "
cd ${BACKEND_PATH}
python3 -m venv venv
source venv/bin/activate
pip install -r project/requirements.txt
cd project
python manage.py makemigrations --noinput
python manage.py migrate --noinput

rm -rf staticfiles
python manage.py collectstatic --noinput
"

ssh $SERVER_USER@$SERVER_IP "systemctl restart <your-service-name>"

echo "💯 Deployment Completed!"
