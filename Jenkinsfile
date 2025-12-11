pipeline {
  agent any

  tools {
    nodejs "node22"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Frontend') {
      steps {
        dir('Ai_LMS_Frontend') {
          sh '''
            npm install
          '''
        }
      }
    }

    stage('Install Backend') {
      steps {
        dir('Backend/Ai_LMS_Backed') {
          sh '''
            python3 -m venv venv
            venv/bin/python -m pip install --upgrade pip
            venv/bin/python -m pip install -r requirements.txt
          '''
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('Ai_LMS_Frontend') {
          sh 'npm run build'
        }
      }
    }

    stage('Sanity Test') {
      steps {
        dir('cicd') {
          sh '''
            chmod +x sanity.sh
            ./sanity.sh
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        dir('cicd') {
          sh '''
            chmod +x deploy.sh
            ./deploy.sh
          '''
        }
      }
    }
  }
}
