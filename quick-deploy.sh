#!/bin/bash
# Sun Panel Navigation 快速部署脚本

echo "🚀 Sun Panel Navigation 快速部署脚本"
echo "=================================="

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 创建部署目录
DEPLOY_DIR="sun-panel-navigation"
if [ ! -d "$DEPLOY_DIR" ]; then
    mkdir -p "$DEPLOY_DIR"
    echo "📁 创建部署目录: $DEPLOY_DIR"
fi

cd "$DEPLOY_DIR"

# 创建docker-compose.yml文件
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  sun-panel-navigation:
    image: baofen14787/sun-panel-navigation:latest
    container_name: sun-panel-navigation
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
      - ./images:/app/images
    environment:
      - NODE_ENV=production
      - TZ=Asia/Shanghai
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  sun-panel-network:
    driver: bridge
EOF

echo "📝 创建 docker-compose.yml 配置文件"

# 创建数据目录
mkdir -p data images
echo "📁 创建数据目录"

# 拉取镜像
echo "📦 拉取 sun-panel-navigation 镜像..."
docker pull baofen14787/sun-panel-navigation:latest

# 启动服务
echo "🚀 启动 Sun Panel Navigation 服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
if docker-compose ps | grep -q "Up"; then
    echo "✅ Sun Panel Navigation 启动成功！"
    echo ""
    echo "🌐 访问地址:"
    echo "   本地访问: http://localhost:3000"
    echo "   健康检查: http://localhost:3000/api/health"
    echo ""
    echo "📋 管理命令:"
    echo "   查看日志: docker-compose logs -f"
    echo "   停止服务: docker-compose down"
    echo "   重启服务: docker-compose restart"
    echo ""
    echo "🎉 部署完成！"
else
    echo "❌ 服务启动失败，请检查日志:"
    docker-compose logs
    exit 1
fi
