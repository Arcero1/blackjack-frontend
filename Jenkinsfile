pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'npm install'
        sh 'npm run-script build'
      }
    }
    stage('deploy') {
      steps {
        sh 'sudo docker-compose build'
        sh 'sudo docker-compose up -d'
      }
    }
  }
}