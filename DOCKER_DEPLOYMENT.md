# Sun Panel 导航网站 Docker 部署指南

## 📋 概述

本指南将帮助您使用Docker容器化部署Sun Panel导航网站，实现快速、可靠的部署。

## 🚀 快速开始

### 方法一：使用 Docker Compose（推荐）

```bash
# 1. 克隆项目（如果还没有）
git clone <your-repo-url>
cd sun-panel

# 2. 使用 Docker Compose 启动
docker-compose up -d

# 3. 查看运行状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f
```

### 方法二：使用 Docker 命令

```bash
# 1. 构建镜像
docker build -t sun-panel-navigation:latest .

# 2. 运行容器
docker run -d \
  --name sun-panel-navigation \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/images:/app/images \
  --restart unless-stopped \
  sun-panel-navigation:latest
```

## 🛠️ 环境要求

### 系统要求
- **操作系统**: Linux, macOS, Windows 10/11
- **Docker**: 版本 20.10+ 
- **Docker Compose**: 版本 2.0+（可选，但推荐）

### 硬件要求
- **内存**: 最少 512MB，推荐 1GB+
- **存储**: 最少 1GB 可用空间
- **CPU**: 1核心即可，推荐 2核心+

## 📦 安装 Docker

### Windows 系统

1. **下载 Docker Desktop**
   - 访问 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - 下载并安装 Docker Desktop

2. **启用 WSL 2（推荐）**
   ```powershell
   # 在 PowerShell 中运行
   wsl --install
   ```

3. **验证安装**
   ```cmd
   docker --version
   docker-compose --version
   ```

### Linux 系统

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
```

### macOS 系统

1. **使用 Homebrew**
   ```bash
   brew install --cask docker
   ```

2. **或下载 Docker Desktop**
   - 访问 [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)

## 🔧 配置说明

### Dockerfile 特性

- **基础镜像**: `node:18-alpine`（轻量级）
- **安全**: 使用非root用户运行
- **健康检查**: 自动监控应用状态
- **优化**: 多阶段构建，减少镜像大小

### Docker Compose 配置

```yaml
services:
  sun-panel:
    build: .
    container_name: sun-panel-navigation
    ports:
      - "3000:3000"  # 端口映射
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data      # 数据持久化
      - ./images:/app/images  # 图片持久化
    restart: unless-stopped   # 自动重启
    healthcheck:             # 健康检查
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
```

## 📁 目录结构

```
sun-panel/
├── Dockerfile              # Docker镜像构建文件
├── docker-compose.yml      # Docker Compose配置
├── .dockerignore          # Docker忽略文件
├── package.json           # Node.js依赖
├── server.js              # 服务器入口
├── data/                  # 数据目录（持久化）
│   └── websites.json
├── images/                # 图片目录（持久化）
└── DOCKER_DEPLOYMENT.md   # 部署文档
```

## 🚀 部署步骤

### 1. 准备环境

```bash
# 确保Docker已安装并运行
docker --version
docker-compose --version

# 检查端口3000是否被占用
netstat -tulpn | grep :3000
```

### 2. 构建和启动

```bash
# 进入项目目录
cd sun-panel

# 使用Docker Compose启动（推荐）
docker-compose up -d

# 或者手动构建和运行
docker build -t sun-panel-navigation .
docker run -d -p 3000:3000 --name sun-panel sun-panel-navigation
```

### 3. 验证部署

```bash
# 检查容器状态
docker ps

# 查看应用日志
docker logs sun-panel-navigation

# 测试健康检查
curl http://localhost:3000/api/health

# 访问网站
curl http://localhost:3000
```

## 🔍 管理命令

### 基本操作

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 查看状态
docker-compose ps
```

### 维护操作

```bash
# 更新镜像
docker-compose pull
docker-compose up -d

# 清理未使用的镜像
docker system prune -a

# 备份数据
cp -r data/ backup/data-$(date +%Y%m%d)
cp -r images/ backup/images-$(date +%Y%m%d)
```

## 🔧 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep :3000
   
   # 修改端口映射
   # 在docker-compose.yml中修改：
   ports:
     - "8080:3000"  # 使用8080端口
   ```

2. **权限问题**
   ```bash
   # 修复数据目录权限
   sudo chown -R 1001:1001 data/ images/
   ```

3. **容器无法启动**
   ```bash
   # 查看详细日志
   docker logs sun-panel-navigation
   
   # 检查镜像
   docker images
   ```

### 健康检查

```bash
# 手动健康检查
curl http://localhost:3000/api/health

# 查看容器健康状态
docker inspect sun-panel-navigation | grep Health
```

## 📊 监控和维护

### 资源监控

```bash
# 查看容器资源使用
docker stats sun-panel-navigation

# 查看容器详细信息
docker inspect sun-panel-navigation
```

### 日志管理

```bash
# 实时查看日志
docker-compose logs -f

# 查看最近100行日志
docker-compose logs --tail=100

# 保存日志到文件
docker-compose logs > sun-panel.log
```

## 🔒 安全建议

1. **网络安全**
   - 使用防火墙限制访问
   - 考虑使用反向代理（Nginx）
   - 启用HTTPS

2. **数据安全**
   - 定期备份数据目录
   - 使用数据卷加密
   - 限制容器权限

3. **更新维护**
   - 定期更新基础镜像
   - 监控安全漏洞
   - 及时应用安全补丁

## 🌐 生产环境部署

### 使用反向代理

```nginx
# nginx.conf 示例
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 使用环境变量

```bash
# 创建.env文件
NODE_ENV=production
PORT=3000
```

## 📞 技术支持

如果遇到问题，请检查：

1. Docker和Docker Compose版本
2. 端口是否被占用
3. 数据目录权限
4. 容器日志信息

---

**部署完成！** 🎉

访问 http://localhost:3000 查看您的Sun Panel导航网站。
