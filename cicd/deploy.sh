#!/usr/bin/env bash
set -e

SERVER_USER="root"
SERVER_IP="213.210.21.150"

APP_ROOT="/home/thirdvizion-furnicho"
WEB_PATH="${APP_ROOT}/htdocs/furnicho.thirdvizion.com"
BACKEND_PATH="${APP_ROOT}/backend"

FRONTEND_DIR="../Ai_LMS_Frontend"
BACKEND_DIR="../Backend/Ai_LMS_Backed"   # FIXED NAME


echo "🚀 Building React App..."
cd "$FRONTEND_DIR"
npm ci --silent
npm run build
cd - > /dev/null


echo "🧹 Cleaning old frontend files on server..."
ssh $SERVER_USER@$SERVER_IP "rm -rf ${WEB_PATH}/dist"


echo "📦 Uploading new frontend build..."
scp -r ${FRONTEND_DIR}/dist $SERVER_USER@$SERVER_IP:${WEB_PATH}/


echo "✨ Frontend deployed!"


echo "🚀 Deploying Django Backend..."
ssh $SERVER_USER@$SERVER_IP "
mkdir -p ${BACKEND_PATH}
rm -rf ${BACKEND_PATH}/project
"

# Upload backend code
scp -r "$BACKEND_DIR" $SERVER_USER@$SERVER_IP:"${BACKEND_PATH}/project"


echo "⚙ Running backend setup..."
ssh $SERVER_USER@$SERVER_IP "
cd ${BACKEND_PATH}

# Create venv if missing
if [ ! -d venv ]; then
    python3 -m venv venv
fi

# Install python deps using venv pip (NO activate needed)
venv/bin/pip install --no-cache-dir --upgrade pip
venv/bin/pip install --no-cache-dir -r project/requirements.txt

# Run Django commands with venv python
cd project
venv/bin/python manage.py makemigrations --noinput || true
venv/bin/python manage.py migrate --noinput

rm -rf staticfiles
venv/bin/python manage.py collectstatic --noinput
"


echo "💯 Deployment Completed Successfully!"
