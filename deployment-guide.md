# Sun Panel Navigation 网址导航系统 - 部署指南

## 🚀 快速部署

### 1. 准备工作

#### 系统要求
- Docker 20.10+ 
- Docker Compose 2.0+
- 至少 512MB 内存
- 至少 1GB 磁盘空间

#### 创建部署目录
```bash
mkdir sun-panel
cd sun-panel
```

### 2. 镜像部署方式

#### 方式一：使用预构建镜像（推荐）
```bash
# 1. 拉取镜像
docker pull baofen14787/sun-panel-navigation:latest

# 2. 创建配置文件
cat > docker-compose.yml << 'EOF'
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
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3002/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 3
EOF

# 3. 启动服务
docker-compose up -d
```

#### 方式二：从源码构建
```bash
# 1. 克隆项目
git clone <repository-url> sun-panel
cd sun-panel

# 2. 构建镜像
docker build -t baofen14787/sun-panel-navigation:latest .

# 3. 使用 docker-compose 启动
docker-compose up -d
```

### 3. 配置说明

#### 端口配置
- **默认端口**: 3002
- **修改端口**: 在 docker-compose.yml 中修改 `ports` 配置
  ```yaml
  ports:
    - "8080:3002"  # 外部端口:内部端口
  ```

#### 数据持久化
- `./data` - 网站数据存储目录
- `./images` - 网站图标存储目录
- `./logs` - 应用日志目录（可选）

#### 环境变量
- `NODE_ENV=production` - 生产环境模式
- `TZ=Asia/Shanghai` - 时区设置
- `PORT=3002` - 应用端口（默认3002）

### 4. 访问应用

#### 本地访问
- 浏览器打开: `http://localhost:3002`
- 健康检查: `http://localhost:3002/api/health`

#### 网络访问
- 局域网访问: `http://[设备IP]:3002`
- 例如: `http://192.168.1.100:3002`

### 5. 管理命令

#### 启动服务
```bash
docker-compose up -d
```

#### 停止服务
```bash
docker-compose down
```

#### 重启服务
```bash
docker-compose restart
```

#### 查看日志
```bash
docker-compose logs -f sun-panel-navigation
```

#### 更新镜像
```bash
# 拉取最新镜像
docker pull baofen14787/sun-panel-navigation:latest

# 重启服务
docker-compose down
docker-compose up -d
```

### 7. 故障排除

#### 检查容器状态
```bash
docker ps -a
```

#### 查看容器日志
```bash
docker logs sun-panel-navigation
```

#### 进入容器调试
```bash
docker exec -it sun-panel-navigation sh
```

#### 检查端口占用
```bash
netstat -tlnp | grep 3002
```

#### 常见问题
1. **端口被占用**: 修改 docker-compose.yml 中的端口映射
2. **权限问题**: 确保数据目录有正确的读写权限
3. **内存不足**: 增加系统内存或调整Docker资源限制

### 8. 备份与恢复

#### 备份数据
```bash
# 备份网站数据
cp -r ./data ./backup/data-$(date +%Y%m%d)

# 备份图片
cp -r ./images ./backup/images-$(date +%Y%m%d)
```

#### 恢复数据
```bash
# 恢复网站数据
cp -r ./backup/data-20250121 ./data

# 恢复图片
cp -r ./backup/images-20250121 ./images
```

### 9. 性能优化

#### 资源限制
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

#### 日志轮转
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

---

## 📞 技术支持

如有问题，请检查：
1. Docker和Docker Compose版本
2. 端口是否被占用
3. 数据目录权限
4. 容器日志信息

**祝您使用愉快！** 🎉
