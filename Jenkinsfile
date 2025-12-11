pipeline {
    agent any

    tools {
        nodejs "node22"
    }

    environment {
        FRONTEND_DIR = "Ai_LMS_Frontend"
        BACKEND_DIR  = "Backend/Ai_LMS_Backed"
        CICD_DIR     = "cicd"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir(FRONTEND_DIR) {
                    sh 'npm install'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir(BACKEND_DIR) {
                    sh '''
                        # Create venv
                        python3 -m venv venv

                        # Upgrade pip using venv pip
                        venv/bin/pip install --upgrade pip

                        # Install backend dependencies
                        venv/bin/pip install -r requirements.txt
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    sh 'npm run build'
                }
            }
        }

        stage('Sanity Test') {
            steps {
                dir(CICD_DIR) {
                    sh 'chmod +x sanity.sh'
                    sh './sanity.sh'
                }
            }
        }

        stage('Deploy') {
            steps {
                dir(CICD_DIR) {
                    sh 'chmod +x deploy.sh'
                    sh './deploy.sh'
                }
            }
        }
    }
}
