pipeline {
    agent any

    stages {
        stage('Check Docker') {
            steps {
                docker compose up
            }
        }
    }
}