@echo off
REM Sun Panel Navigation 快速部署脚本 (Windows)

echo 🚀 Sun Panel Navigation 快速部署脚本
echo ==================================

REM 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker 未安装，请先安装 Docker Desktop
    pause
    exit /b 1
)

REM 检查Docker Compose是否安装
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose 未安装，请先安装 Docker Compose
    pause
    exit /b 1
)

echo ✅ Docker 环境检查通过

REM 创建部署目录
set DEPLOY_DIR=sun-panel-navigation
if not exist "%DEPLOY_DIR%" (
    mkdir "%DEPLOY_DIR%"
    echo 📁 创建部署目录: %DEPLOY_DIR%
)

cd "%DEPLOY_DIR%"

REM 创建docker-compose.yml文件
(
echo version: '3.8'
echo.
echo services:
echo   sun-panel-navigation:
echo     image: baofen14787/sun-panel-navigation:latest
echo     container_name: sun-panel-navigation
echo     restart: unless-stopped
echo     ports:
echo       - "3000:3000"
echo     volumes:
echo       - ./data:/app/data
echo       - ./images:/app/images
echo     environment:
echo       - NODE_ENV=production
echo       - TZ=Asia/Shanghai
echo     healthcheck:
echo       test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
echo       interval: 30s
echo       timeout: 10s
echo       retries: 3
echo       start_period: 40s
echo.
echo networks:
echo   sun-panel-network:
echo     driver: bridge
) > docker-compose.yml

echo 📝 创建 docker-compose.yml 配置文件

REM 创建数据目录
mkdir data 2>nul
mkdir images 2>nul
echo 📁 创建数据目录

REM 拉取镜像
echo 📦 拉取 sun-panel-navigation 镜像...
docker pull baofen14787/sun-panel-navigation:latest

REM 启动服务
echo 🚀 启动 Sun Panel Navigation 服务...
docker-compose up -d

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Sun Panel Navigation 启动成功！
    echo.
    echo 🌐 访问地址:
    echo    本地访问: http://localhost:3000
    echo    健康检查: http://localhost:3000/api/health
    echo.
    echo 📋 管理命令:
    echo    查看日志: docker-compose logs -f
    echo    停止服务: docker-compose down
    echo    重启服务: docker-compose restart
    echo.
    echo 🎉 部署完成！
) else (
    echo ❌ 服务启动失败，请检查日志:
    docker-compose logs
    pause
    exit /b 1
)

pause
