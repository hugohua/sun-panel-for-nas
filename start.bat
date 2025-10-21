@echo off
echo ========================================
echo    网址导航服务器启动脚本
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js环境检查通过
echo.

echo 正在检查依赖包...
if not exist "node_modules" (
    echo 📦 正在安装依赖包...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖包安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖包安装完成
) else (
    echo ✅ 依赖包已存在
)

echo.
echo 🚀 正在启动服务器...
echo.
echo ========================================
echo    服务器信息
echo ========================================
echo 📱 本地访问: http://localhost:3000
echo 🌐 网络访问: http://0.0.0.0:3000
echo 📊 健康检查: http://localhost:3000/api/health
echo 🔧 API文档: http://localhost:3000/api/websites
echo ========================================
echo.
echo 按 Ctrl+C 停止服务器
echo.

npm start

