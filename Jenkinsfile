pipeline {
    agent any
    
    environment {
        PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin;${env.PATH}"
        REPO = 'https://github.com/Glebwen/DevOPSLab2.git'
        DOCKER_BUILDKIT = '1'
        REGISTRY = 'localhost:5000'
    }
    
    triggers {
        pollSCM('H/1 * * * *') 
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
        
        stage('Test (Build & Pytest)') {
            steps {
                bat 'docker build -t devopslab2-test .'
                bat 'docker run --rm devopslab2-test python -m pytest'
            }
        }
        
        stage('Push to Local Registry') {
            when { branch 'main' }
            steps {
                bat """
                    docker ps -a --filter "name=local-registry" --format "{{.Names}}" | findstr "local-registry" >nul
                    if errorlevel 1 (
                        echo "Запускаем локальный Docker Registry..."
                        docker run -d -p 5000:5000 --restart=always --name local-registry registry:2
                        ping 127.0.0.1 -n 4 > nul
                    ) else (
                        echo "Локальный Registry уже работает."
                    )

                    :: Собираем образы с тегами для нашего Registry
                    docker compose build
                    
                    :: Отправляем в локальный Registry
                    docker push %REGISTRY%/devopslab2-backend:latest
                    docker push %REGISTRY%/devopslab2-frontend:latest
                """
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
                    
                    :: КРИТИЧНО: Создаем файл базы, если его нет (чтобы Docker не создал папку)
                    if not exist db.sqlite3 type nul > db.sqlite3
                    
                    :: Останавливаем старые контейнеры (|| exit /b 0 значит "не падать, если их нет")
                    docker compose down --remove-orphans || exit /b 0
                    
                    :: Принудительно удаляем старые контейнеры, если они зависли
                    docker rm -f devopslab2-backend-1 devopslab2-frontend-1 2>nul || exit /b 0
                    
                    :: Скачиваем свежие образы из локального Registry
                    docker compose pull
                    
                    :: Запускаем
                    docker compose up -d
                    
                    :: Ждем 5 секунд, чтобы контейнеры поднялись
                    ping 127.0.0.1 -n 6 > nul
                    
                    :: Применяем миграции
                    docker compose exec -T backend python manage.py migrate
                """
            }
        }
    }
    
    post {
        success {
            echo '=== Pipeline SUCCESS ==='
            echo 'Сайт доступен по адресу: http://localhost:8081'
            echo 'Локальный Registry доступен по адресу: http://localhost:5000/v2/_catalog'
        }
        failure {
            echo '=== Pipeline FAILED ==='
        }
    }
}