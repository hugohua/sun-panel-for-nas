#!/bin/bash

# Sun Panel 权限设置脚本（简化版）
echo "🔧 设置Sun Panel目录权限..."

# 检查是否在项目根目录
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 错误：请在项目根目录下运行此脚本"
    exit 1
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p data images

# 设置目录权限（Linux/macOS）
echo "🔐 设置目录权限..."
if command -v sudo >/dev/null 2>&1; then
    # 使用sudo设置权限
    sudo chown -R 1000:1000 data images
    sudo chmod -R 755 data images
    echo "✅ 使用sudo设置权限完成"
else
    # 不使用sudo设置权限
    chown -R 1000:1000 data images 2>/dev/null || true
    chmod -R 755 data images
    echo "✅ 设置权限完成"
fi

# 检查权限设置结果
echo "📋 检查权限设置结果..."
ls -la data/ images/

echo ""
echo "✅ 权限设置完成！"
echo "🚀 现在可以启动容器："
echo "   docker-compose up -d"
echo ""
echo "💡 如果仍有权限问题，请尝试："
echo "   1. 确保Docker有访问这些目录的权限"
echo "   2. 检查SELinux设置（如果适用）"
echo "   3. 使用docker run命令手动设置用户ID"
