#!/usr/bin/env bash
set -e

SERVER_USER="root"
SERVER_IP="213.210.21.150"

# FRONTEND
FRONTEND_BUILD="../Ai_LMS_Frontend/dist"
FRONTEND_PATH="/home/thirdvizion-furnicho/htdocs/furnicho.thirdvizion.com"

# BACKEND
BACKEND_SRC="../Backend/Ai_LMS_Backed"
BACKEND_PATH="/home/thirdvizion-furnicho/backend"

echo "🚀 Deploying Frontend..."
ssh $SERVER_USER@$SERVER_IP "rm -rf ${FRONTEND_PATH}/*"
scp -r ${FRONTEND_BUILD}/* $SERVER_USER@$SERVER_IP:${FRONTEND_PATH}

echo "🚀 Deploying Backend..."
ssh $SERVER_USER@$SERVER_IP "
rm -rf ${BACKEND_PATH}/project
mkdir -p ${BACKEND_PATH}
"

scp -r ${BACKEND_SRC} $SERVER_USER@$SERVER_IP:${BACKEND_PATH}/project

ssh $SERVER_USER@$SERVER_IP "
cd ${BACKEND_PATH}
python3 -m venv venv
source venv/bin/activate
pip install -r project/requirements.txt
cd project
python3 manage.py migrate
python3 manage.py collectstatic --noinput
systemctl restart furnicho
"

echo "💯 Deployment Completed!"
