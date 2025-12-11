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

    /* -------------------------------
       INSTALL FRONTEND
    --------------------------------*/
    stage('Install Frontend') {
      steps {
        dir('Ai_LMS_Frontend') {
          sh '''
            echo "📦 Installing frontend dependencies..."
            npm install --silent

            echo "🏗 Building frontend..."
            npm run build
          '''
        }
      }
    }

    /* -------------------------------
       INSTALL BACKEND
    --------------------------------*/
    stage('Install Backend') {
      steps {
        dir('Backend/Ai_LMS_Backed') {
          sh '''
            echo "🐍 Creating virtual environment..."
            python3 -m venv venv

            echo "⬇ Installing pip..."
            curl -sS https://bootstrap.pypa.io/get-pip.py -o get-pip.py
            venv/bin/python get-pip.py

            echo "⬆ Upgrading pip..."
            venv/bin/pip install --upgrade pip setuptools wheel

            echo "📦 Installing backend dependencies..."
            venv/bin/pip install -r requirements.txt
          '''
        }
      }
    }

    /* -------------------------------
       SANITY TEST
    --------------------------------*/
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

    /* -------------------------------
       DEPLOYMENT
    --------------------------------*/
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
