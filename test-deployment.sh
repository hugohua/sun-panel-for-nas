#!/bin/bash

# Sun Panel 简化部署测试脚本
echo "🧪 测试Sun Panel简化部署..."

# 检查是否在项目根目录
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 错误：请在项目根目录下运行此脚本"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down 2>/dev/null || true

# 清理
echo "🧹 清理环境..."
docker system prune -f

# 重新构建
echo "🔨 重新构建镜像..."
docker-compose build --no-cache

# 设置权限
echo "🔐 设置目录权限..."
mkdir -p data images
chown -R 1000:1000 data images 2>/dev/null || true
chmod -R 755 data images

# 启动容器
echo "🚀 启动容器..."
docker-compose up -d

# 等待启动
echo "⏳ 等待容器启动..."
sleep 10

# 检查状态
echo "📋 检查容器状态..."
docker-compose ps

# 检查日志
echo "📋 检查容器日志..."
docker-compose logs --tail=10 sun-panel-navigation

# 测试权限
echo "🧪 测试文件写入权限..."
docker exec sun-panel-navigation sh -c "echo 'test data' > /app/data/test.txt && echo '✅ data目录写入成功' || echo '❌ data目录写入失败'"
docker exec sun-panel-navigation sh -c "echo 'test image' > /app/images/test.txt && echo '✅ images目录写入成功' || echo '❌ images目录写入失败'"

# 检查文件
echo "📁 检查创建的文件..."
docker exec sun-panel-navigation sh -c "ls -la /app/data/ /app/images/"

echo ""
echo "🎯 测试完成！"
echo "🌐 访问地址: http://localhost:3002"
echo "💡 如果看到权限错误，请检查宿主机目录权限"
