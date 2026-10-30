pipeline {
    agent any
    
    environment {
        PYTHON = 'C:\\Users\\User\\AppData\\Local\\Programs\\Python\\Python313\\python.exe'
        VENV = '.venv-ci'
        REPO = 'https://github.com/Glebwen/DevOPSLab1.git'
    }
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Setup') {
            steps {
                bat """
                    if not exist %VENV% ("${PYTHON}" -m venv %VENV%)
                    "%VENV%\\Scripts\\python.exe" -m pip install -r requirements.txt
                """
            }
        }
        
        stage('Test') {
            steps {
                bat """
                    if not exist reports mkdir reports
                    "%VENV%\\Scripts\\python.exe" -m pytest --junitxml=reports/junit.xml
                """
            }
            post { always { junit 'reports/junit.xml' } }
        }
        
        stage('Deploy') {
            when { branch 'main' }
            steps {
                bat """
                    if not exist C:\\deploy mkdir C:\\deploy
                    if exist C:\\deploy\\DevOPSLab1 (
                        cd /d C:\\deploy\\DevOPSLab1 & git pull
                    ) else (
                        git clone %REPO% C:\\deploy\\DevOPSLab1
                    )
                    cd /d C:\\deploy\\DevOPSLab1

                    :: Ставим зависимости
                    if not exist .venv ("${PYTHON}" -m venv .venv)
                    .venv\\Scripts\\python.exe -m pip install -r requirements.txt
                    .venv\\Scripts\\python.exe manage.py migrate
                    cd client
                    call npm install
                    cd ..

                    :: Проверяем, что NSSM на месте
                    if not exist C:\\deploy\\nssm.exe (
                        echo "ОШИБКА: Файл C:\\deploy\\nssm.exe не найден!"
                        exit /b 1
                    )

                    :: Удаляем старые службы
                    C:\\deploy\\nssm.exe stop WebGlebBackend 2>nul
                    C:\\deploy\\nssm.exe remove WebGlebBackend confirm 2>nul
                    C:\\deploy\\nssm.exe stop WebGlebFrontend 2>nul
                    C:\\deploy\\nssm.exe remove WebGlebFrontend confirm 2>nul

                    :: Создаем Бэкенд
                    C:\\deploy\\nssm.exe install WebGlebBackend "C:\\deploy\\DevOPSLab1\\.venv\\Scripts\\python.exe" "manage.py runserver 0.0.0.0:8000"
                    if errorlevel 1 exit /b 1
                    C:\\deploy\\nssm.exe set WebGlebBackend AppDirectory "C:\\deploy\\DevOPSLab1"
                    
                    :: Создаем Фронтенд (Убедись, что путь к npm.cmd правильный!)
                    C:\\deploy\\nssm.exe install WebGlebFrontend "C:\\Program Files\\nodejs\\npm.cmd" "run dev"
                    if errorlevel 1 exit /b 1
                    C:\\deploy\\nssm.exe set WebGlebFrontend AppDirectory "C:\\deploy\\DevOPSLab1\\client"

                    :: Запускаем
                    C:\\deploy\\nssm.exe start WebGlebBackend
                    C:\\deploy\\nssm.exe start WebGlebFrontend
                    
                    ping 127.0.0.1 -n 6 > nul
                """
            }
        }
    }
}