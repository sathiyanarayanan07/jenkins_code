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

        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    sh 'npm run build'
                }
            }
        }

        stage('Backend Sanity Test') {
            steps {
                dir(BACKEND_DIR) {
                    sh 'python3 -m py_compile $(find . -name "*.py")'
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
