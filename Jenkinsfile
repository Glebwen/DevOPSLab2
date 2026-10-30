pipeline {
    agent any
    
    environment {
        PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin;${env.PATH}"
        REPO = 'https://github.com/Glebwen/DevOPSLab2.git'
        DOCKER_BUILDKIT = '1'
    }
    
    stages {
        stage('Checkout') {
            steps { 
                checkout scm 
            }
        }
        
        stage('Docker Info') {
            steps {
                bat 'docker version'
            }
        }
        
        stage('Test (Build & Pytest in Container)') {
            steps {
                bat 'docker build -t devopslab2-test .'
                bat 'docker run --rm devopslab2-test python -m pytest'
            }
        }
        
        stage('Deploy') {
            when { branch 'main' }
            steps {
                bat """
                    if not exist C:\\deploy\\DevOPSLab2 mkdir C:\\deploy\\DevOPSLab2
                    if exist C:\\deploy\\DevOPSLab2\\.git (
                        cd /d C:\\deploy\\DevOPSLab2 & git pull
                    ) else (
                        git clone %REPO% C:\\deploy\\DevOPSLab2
                    )
                    cd /d C:\\deploy\\DevOPSLab2
                    
                    :: Останавливаем старые контейнеры и удаляем их
                    docker compose down
                    
                    :: Собираем новые образы и запускаем
                    docker compose up -d --build
                """
            }
        }
    }
    
    post {
        success {
            echo '=== Pipeline SUCCESS ==='
            echo 'Сайт доступен по адресу: http://localhost:8081'
        }
        failure {
            echo '=== Pipeline FAILED ==='
        }
    }
}