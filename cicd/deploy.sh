#!/usr/bin/env bash
set -e

SERVER_USER="root"
SERVER_IP="213.210.21.150"

APP_ROOT="/home/thirdvizion-furnicho"
WEB_PATH="${APP_ROOT}/htdocs/furnicho.thirdvizion.com"
BACKEND_PATH="${APP_ROOT}/backend"

FRONTEND_DIR="../Ai_LMS_Frontend"
BACKEND_DIR="../Backend/Ai_LMS_Backed"   # Correct folder name


############################################
# FRONTEND DEPLOYMENT
############################################

echo "🚀 Building React App..."
cd "$FRONTEND_DIR"
npm ci --silent
npm run build
cd - > /dev/null


echo "🧹 Cleaning old frontend files on server..."
ssh $SERVER_USER@$SERVER_IP "rm -rf ${WEB_PATH}/dist"


echo "📦 Uploading new frontend build..."
scp -r "${FRONTEND_DIR}/dist" $SERVER_USER@$SERVER_IP:"${WEB_PATH}/"


echo "✨ Frontend deployed successfully!"


############################################
# BACKEND DEPLOYMENT
############################################

echo "🚀 Preparing backend deploy on server..."
ssh $SERVER_USER@$SERVER_IP "
mkdir -p ${BACKEND_PATH}
rm -rf ${BACKEND_PATH}/project
"

echo "📦 Uploading backend code..."
scp -r "$BACKEND_DIR" $SERVER_USER@$SERVER_IP:"${BACKEND_PATH}/project"


echo "⚙ Running backend setup on server..."
ssh $SERVER_USER@$SERVER_IP "
set -e
cd ${BACKEND_PATH}

echo '🐍 Ensuring Python venv exists...'
if [ ! -d venv ]; then
    echo '🔧 Creating new virtual environment...'
    python3 -m venv venv
fi

# Validate venv
if [ ! -f 'venv/bin/pip' ]; then
    echo '❌ ERROR: venv exists but pip is missing!'
    echo '👉 FIX: Install python3-venv on the server:'
    echo '   sudo apt install python3-venv python3-full -y'
    exit 1
fi

echo '⬆️ Upgrading pip...'
venv/bin/pip install --no-cache-dir --upgrade pip

echo '📦 Installing backend dependencies...'
venv/bin/pip install --no-cache-dir -r project/requirements.txt


echo '🛠 Applying migrations...'
cd project
venv/bin/python manage.py makemigrations --noinput || true
venv/bin/python manage.py migrate --noinput


echo '🧹 Collecting static files...'
rm -rf staticfiles
venv/bin/python manage.py collectstatic --noinput

echo '✔ Backend deployed successfully!'
"


echo "💯 Deployment Completed Successfully!"
