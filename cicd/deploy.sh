#!/usr/bin/env bash
set -e

# ===== CONFIGURATION =====
SERVER_USER="thirdvizion"  # Replace with your server user (looks like 'thirdvizion')
SERVER_IP="213.210.21.150"  # Replace with your server's IP address
DEPLOY_DIR="/home/thirdvizion-fitnessapp/htdocs/fitnessapp.thirdvizion.com"
LOCAL_BACKEND_DIR="../Backend/fitness"  # Path to your local backend directory

# ===== DEPLOY BACKEND =====
echo "🚀 Deploying backend to server..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p ${DEPLOY_DIR}"
ssh $SERVER_USER@$SERVER_IP "rm -rf ${DEPLOY_DIR}/*"
scp -r ${LOCAL_BACKEND_DIR}/* $SERVER_USER@$SERVER_IP:${DEPLOY_DIR}/

# ===== SETUP VIRTUAL ENV AND DEPENDENCIES =====
echo "🔧 Setting up virtual environment and installing dependencies..."
ssh $SERVER_USER@$SERVER_IP "
cd ${DEPLOY_DIR}
if [ ! -d venv ]; then
    python3 -m venv venv
fi
. venv/bin/activate
if [ -f requirements.txt ]; then
    pip install --no-cache-dir -r requirements.txt
else
    echo 'ERROR: requirements.txt not found!'
    exit 1
fi

# Run migrations and collect static files
python manage.py migrate --noinput || { echo 'Migration failed!'; exit 1; }
python manage.py collectstatic --noinput || { echo 'Static collection failed!'; exit 1; }
"

# ===== RESTART SERVICES =====
echo "🔄 Restarting gunicorn and nginx..."
ssh $SERVER_USER@$SERVER_IP "
sudo systemctl restart gunicorn || { echo 'Gunicorn restart failed!'; exit 1; }
sudo systemctl restart nginx || { echo 'Nginx restart failed!'; exit 1; }
"

echo "💯 Django backend deployed successfully!"
