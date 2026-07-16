pipeline {
    agent any

    stages {
        stage('Check Docker') {
            steps {
                bat 'docker --version'
                bat 'docker compose version'
            }
        }
    }
}