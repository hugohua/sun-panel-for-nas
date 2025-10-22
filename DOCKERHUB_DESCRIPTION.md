# 🚀 Sun Panel 网址导航

> 🎯 **现代化的网址导航网站，支持多种访问模式切换，具备完整的网站管理功能**

## 🐳 一键部署

```bash
docker run -d \
  --name sun-panel-navigation \
  --restart unless-stopped \
  -p 3002:3002 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/images:/app/images \
  baofen14787/sun-panel-navigation:latest
```

**访问地址**: http://localhost:3002

## ✨ 核心功能

- **🚀 多模式访问**: 支持内网、IPv6、Frp、Easytier四种访问模式一键切换
- **🔍 实时搜索**: 支持网站名称和描述的实时搜索过滤
- **🖱️ 右键管理**: 支持右键编辑、删除网站，提供便捷管理
- **📝 网站管理**: 支持拖拽上传、URL获取、图标获取等多种方式
- **🎨 现代化UI**: 渐变背景、毛玻璃效果、圆角设计
- **📱 响应式布局**: 完美适配桌面端和移动端

## 🛠️ 技术特性

- **🐳 容器化部署**: 支持Docker和Docker Compose一键部署
- **🔧 RESTful API**: 完整的后端API接口
- **💚 健康检查**: 自动监控应用状态
- **🔒 安全运行**: 非root用户运行，增强安全性
- **💾 数据持久化**: 网站数据和图片自动保存

## 📋 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `NODE_ENV` | `production` | 运行环境 |
| `PORT` | `3002` | 应用端口 |
| `TZ` | `Asia/Shanghai` | 时区设置 |

## 🔧 数据持久化

- `./data` - 网站数据存储目录
- `./images` - 网站图标存储目录

## 📊 系统要求

- **内存**: 最少 256MB，推荐 512MB
- **存储**: 最少 100MB，推荐 1GB
- **网络**: 端口 3002 可访问

## 🚀 快速开始

### 使用 Docker Compose（推荐）

```yaml
version: '3.8'
services:
  sun-panel-navigation:
    image: baofen14787/sun-panel-navigation:latest
    container_name: sun-panel-navigation
    restart: unless-stopped
    ports:
      - "3002:3002"
    volumes:
      - ./data:/app/data
      - ./images:/app/images
    environment:
      - NODE_ENV=production
      - TZ=Asia/Shanghai
```

### 管理命令

```bash
# 查看日志
docker logs sun-panel-navigation

# 重启服务
docker restart sun-panel-navigation

# 更新镜像
docker pull baofen14787/sun-panel-navigation:latest
```

## 🔗 相关链接

- **GitHub**: https://github.com/hugohua/sun-panel-for-nas
- **Docker Hub**: https://hub.docker.com/r/baofen14787/sun-panel-navigation
- **问题反馈**: 请在GitHub提交Issue

## 📄 许可证

MIT License - 可自由使用、修改和分发

---

**享受您的网址导航体验！** 🎉
