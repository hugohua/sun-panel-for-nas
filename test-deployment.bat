@echo off
REM Sun Panel 简化部署测试脚本 (Windows版本)
echo 🧪 测试Sun Panel简化部署...

REM 检查是否在项目根目录
if not exist "docker-compose.yml" (
    echo ❌ 错误：请在项目根目录下运行此脚本
    pause
    exit /b 1
)

REM 停止现有容器
echo 🛑 停止现有容器...
docker-compose down 2>nul

REM 清理
echo 🧹 清理环境...
docker system prune -f

REM 重新构建
echo 🔨 重新构建镜像...
docker-compose build --no-cache

REM 设置权限
echo 🔐 设置目录权限...
if not exist "data" mkdir data
if not exist "images" mkdir images
icacls data /grant:r "Everyone:(OI)(CI)F" /T 2>nul
icacls images /grant:r "Everyone:(OI)(CI)F" /T 2>nul

REM 启动容器
echo 🚀 启动容器...
docker-compose up -d

REM 等待启动
echo ⏳ 等待容器启动...
timeout /t 15 /nobreak >nul

REM 检查状态
echo 📋 检查容器状态...
docker-compose ps

REM 检查日志
echo 📋 检查容器日志...
docker-compose logs --tail=10 sun-panel-navigation

REM 测试权限
echo 🧪 测试文件写入权限...
docker exec sun-panel-navigation sh -c "echo 'test data' > /app/data/test.txt && echo '✅ data目录写入成功' || echo '❌ data目录写入失败'"
docker exec sun-panel-navigation sh -c "echo 'test image' > /app/images/test.txt && echo '✅ images目录写入成功' || echo '❌ images目录写入失败'"

REM 检查文件
echo 📁 检查创建的文件...
docker exec sun-panel-navigation sh -c "ls -la /app/data/ /app/images/"

echo.
echo 🎯 测试完成！
echo 🌐 访问地址: http://localhost:3002
echo 💡 如果看到权限错误，请检查宿主机目录权限
pause
