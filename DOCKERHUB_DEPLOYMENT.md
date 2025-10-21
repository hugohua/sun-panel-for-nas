# Sun Panel Navigation - DockerHub 部署指南

## 🐳 DockerHub 镜像信息

**镜像地址**: `baofen14787/sun-panel-navigation:latest`  
**DockerHub**: https://hub.docker.com/r/baofen14787/sun-panel-navigation

## 🚀 快速部署

### 方式一：使用 Docker Compose（推荐）

```bash
# 1. 创建部署目录
mkdir sun-panel-navigation && cd sun-panel-navigation

# 2. 创建配置文件
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

# 3. 启动服务
docker-compose up -d
```

### 方式二：直接运行 Docker 容器

```bash
# 拉取镜像
docker pull baofen14787/sun-panel-navigation:latest

# 运行容器
docker run -d \
  --name sun-panel-navigation \
  --restart unless-stopped \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/images:/app/images \
  -e NODE_ENV=production \
  -e TZ=Asia/Shanghai \
  baofen14787/sun-panel-navigation:latest
```

### 方式三：使用快速部署脚本

#### Linux/macOS
```bash
chmod +x quick-deploy.sh
./quick-deploy.sh
```

#### Windows
```cmd
quick-deploy.bat
```

## 📋 管理命令

### 基本操作
```bash
# 查看容器状态
docker ps

# 查看日志
docker logs sun-panel-navigation

# 停止服务
docker stop sun-panel-navigation

# 启动服务
docker start sun-panel-navigation

# 重启服务
docker restart sun-panel-navigation

# 删除容器
docker rm sun-panel-navigation
```

### 使用 Docker Compose
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 更新镜像
docker-compose pull
docker-compose up -d
```

## 🔧 配置说明

### 端口配置
- **默认端口**: 3000
- **修改端口**: 在 docker-compose.yml 中修改 `ports` 配置
  ```yaml
  ports:
    - "8080:3000"  # 外部端口:内部端口
  ```

### 数据持久化
- `./data` - 网站数据存储目录
- `./images` - 网站图标存储目录

### 环境变量
- `NODE_ENV=production` - 生产环境模式
- `TZ=Asia/Shanghai` - 时区设置
- `PORT=3000` - 应用端口（默认3000）

## 🌐 访问应用

### 本地访问
- **主页面**: http://localhost:3000
- **健康检查**: http://localhost:3000/api/health
- **API文档**: http://localhost:3000/api/websites

### 网络访问
- **局域网访问**: http://[设备IP]:3000
- **例如**: http://192.168.1.100:3000

## 🔄 更新镜像

### 手动更新
```bash
# 拉取最新镜像
docker pull baofen14787/sun-panel-navigation:latest

# 停止当前容器
docker stop sun-panel-navigation

# 删除旧容器
docker rm sun-panel-navigation

# 启动新容器
docker run -d \
  --name sun-panel-navigation \
  --restart unless-stopped \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/images:/app/images \
  -e NODE_ENV=production \
  -e TZ=Asia/Shanghai \
  baofen14787/sun-panel-navigation:latest
```

### 使用 Docker Compose 更新
```bash
# 拉取最新镜像
docker-compose pull

# 重启服务
docker-compose down
docker-compose up -d
```

## 🛠️ 故障排除

### 检查容器状态
```bash
docker ps -a
```

### 查看容器日志
```bash
docker logs sun-panel-navigation
```

### 进入容器调试
```bash
docker exec -it sun-panel-navigation sh
```

### 检查端口占用
```bash
netstat -tlnp | grep 3000
```

### 常见问题

1. **端口被占用**
   - 修改 docker-compose.yml 中的端口映射
   - 或停止占用端口的其他服务

2. **权限问题**
   - 确保数据目录有正确的读写权限
   - Linux: `chmod 755 data images`
   - Windows: 以管理员身份运行

3. **内存不足**
   - 增加系统内存
   - 或调整Docker资源限制

4. **网络问题**
   - 检查防火墙设置
   - 确保端口3000未被阻止

## 📊 性能优化

### 资源限制
```yaml
services:
  sun-panel-navigation:
    image: baofen14787/sun-panel-navigation:latest
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### 日志轮转
```yaml
services:
  sun-panel-navigation:
    image: baofen14787/sun-panel-navigation:latest
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 🔒 安全建议

1. **使用非root用户运行容器**（已默认配置）
2. **定期更新镜像**
3. **使用HTTPS**（通过Nginx反向代理）
4. **限制资源使用**
5. **定期备份数据**

## 📞 技术支持

- **GitHub**: https://github.com/your-repo/sun-panel
- **DockerHub**: https://hub.docker.com/r/baofen14787/sun-panel-navigation
- **问题反馈**: 请在GitHub提交Issue

---

**祝您使用愉快！** 🎉
