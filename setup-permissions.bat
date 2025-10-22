@echo off
REM Sun Panel 权限设置脚本（Windows版本）
echo 🔧 设置Sun Panel目录权限...

REM 检查是否在项目根目录
if not exist "docker-compose.yml" (
    echo ❌ 错误：请在项目根目录下运行此脚本
    pause
    exit /b 1
)

REM 创建必要的目录
echo 📁 创建必要的目录...
if not exist "data" mkdir data
if not exist "images" mkdir images

REM 设置目录权限（Windows）
echo 🔐 设置目录权限...
icacls data /grant:r "Everyone:(OI)(CI)F" /T 2>nul
icacls images /grant:r "Everyone:(OI)(CI)F" /T 2>nul

echo ✅ 权限设置完成！
echo 🚀 现在可以启动容器：
echo    docker-compose up -d
echo.
echo 💡 如果仍有权限问题，请检查：
echo    1. Docker Desktop设置
echo    2. Windows Defender设置
echo    3. 使用docker run命令手动设置用户ID
pause
