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
          sh ''
            npm run build
          '''
        }
      }
    }

    stage('Install Backend') {
      steps {
        dir('Backend/Ai_LMS_Backed') {
          sh '''
            python3 -m venv venv
            curl -sS https://bootstrap.pypa.io/get-pip.py -o get-pip.py
            venv/bin/python get-pip.py
            venv/bin/pip install --upgrade pip
            venv/bin/pip install -r requirements.txt
          '''
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
