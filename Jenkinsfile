pipeline {
    agent any

    tools {
        nodejs "node22"
        python "python3"
    }

    environment {
        FRONTEND_DIR = "Ai_LMS_Frontend"
        BACKEND_DIR  = "Backend/Ai_Lms_Backend"
        CICD_DIR     = "cicd"
    }

    stages {

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

        stage('Sanity Test') {
            steps {
                dir(CICD_DIR) {
                    sh './sanity.sh'
                }
            }
        }

        stage('Deploy') {
            steps {
                dir(CICD_DIR) {
                    sh './deploy.sh'
                }
            }
        }
    }
}
