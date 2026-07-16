pipeline {
    agent any

    tools {
        allure 'allure'
    }

    stages {
        stage('Run Docker') {
            steps {
                bat 'docker compose up --build'
            }
        }
    }

    post {
        always {
            allure(
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            )
        }
    }
}