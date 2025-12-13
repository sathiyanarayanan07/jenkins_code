#!/usr/bin/env bash
set -e


# UPDATED WEB ROOT PATH
WEB_PATH="/home/thirdvizion-lms/htdocs/lms.thirdvizion.com"
BACKEND_PATH="${WEB_PATH}/backend"

# LOCAL PROJECT PATHS
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

ssh $SERVER_USER@$SERVER_IP "rm -rf ${BACKEND_PATH}/*"
scp -r ${BACKEND_DIR}/* $SERVER_USER@$SERVER_IP:${BACKEND_PATH}/

ssh $SERVER_USER@$SERVER_IP "
cd ${BACKEND_PATH}

if [ ! -d venv ]; then
    python3 -m venv venv
fi
source venv/bin/activate

pip install --no-cache-dir -r requirements.txt

python manage.py makemigrations --noinput || true
python manage.py migrate --noinput
python manage.py collectstatic --noinput
"

echo "🔁 Restarting backend..."
ssh $SERVER_USER@$SERVER_IP "systemctl restart nginx"

echo "💯 Deployment Completed!"
