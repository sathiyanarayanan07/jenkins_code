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
                        python3 -m venv venv
                        . venv/bin/activate
                         pip install --upgrade pip --break-system-packages
                         pip install -r requirements.txt --break-system-packages

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
