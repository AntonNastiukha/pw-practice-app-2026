pipeline {
    agent any

    stages {
        stage('Run Docker') {
            steps {
                bat 'docker compose up'
            }
        }
    }
}