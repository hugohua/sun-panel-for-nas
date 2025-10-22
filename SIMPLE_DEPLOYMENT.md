# Sun Panel 简化部署指南

## 概述
简化版部署方案，移除了复杂的权限设置逻辑，通过宿主机权限设置和docker run参数来处理权限问题。

## 快速部署

### 1. 设置目录权限

#### Windows用户
```cmd
# 以管理员身份运行
setup-permissions.bat
```

#### Linux/macOS用户
```bash
# 给脚本执行权限
chmod +x setup-permissions.sh

# 运行权限设置
./setup-permissions.sh
```

### 2. 启动容器
```bash
# 使用docker-compose启动
docker-compose up -d

# 或者使用docker run启动
docker run -d \
  --name sun-panel-navigation \
  -p 3002:3002 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/images:/app/images \
  baofen14787/sun-panel-navigation:latest
```

## 权限问题解决方案

### 方案一：使用docker run设置用户ID
```bash
# 使用特定用户ID运行容器
docker run -d \
  --name sun-panel-navigation \
  -p 3002:3002 \
  --user 1000:1000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/images:/app/images \
  baofen14787/sun-panel-navigation:latest
```

### 方案二：修改宿主机目录权限
```bash
# Linux/macOS
sudo chown -R 1000:1000 data images
sudo chmod -R 755 data images

# Windows (PowerShell)
icacls data /grant:r "Everyone:(OI)(CI)F" /T
icacls images /grant:r "Everyone:(OI)(CI)F" /T
```

### 方案三：使用docker-compose设置用户
在docker-compose.yml中添加：
```yaml
services:
  sun-panel-navigation:
    # ... 其他配置
    user: "1000:1000"
```

## 验证部署

### 1. 检查容器状态
```bash
docker ps
```

### 2. 检查容器日志
```bash
docker logs sun-panel-navigation
```

### 3. 测试文件写入
```bash
# 进入容器
docker exec -it sun-panel-navigation sh

# 测试写入权限
echo "test" > /app/data/test.txt
echo "test" > /app/images/test.txt

# 检查文件
ls -la /app/data/ /app/images/
```

### 4. 访问应用
打开浏览器访问：http://localhost:3002

## 故障排除

### 常见问题

1. **权限被拒绝**
   ```
   Permission denied
   ```
   **解决方案**：检查宿主机目录权限，确保Docker有访问权限

2. **容器启动失败**
   ```
   Container exited with code 1
   ```
   **解决方案**：检查容器日志，查看具体错误信息

3. **无法写入文件**
   ```
   EACCES: permission denied
   ```
   **解决方案**：使用`--user`参数或修改宿主机权限

### 调试命令

```bash
# 查看容器详细信息
docker inspect sun-panel-navigation

# 查看挂载点
docker exec sun-panel-navigation sh -c "mount | grep /app"

# 查看用户信息
docker exec sun-panel-navigation sh -c "id && whoami"

# 查看文件权限
docker exec sun-panel-navigation sh -c "ls -la /app/"
```

## 高级配置

### 自定义用户ID
```bash
# 使用自定义用户ID
docker run -d \
  --name sun-panel-navigation \
  -p 3002:3002 \
  --user 1001:1001 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/images:/app/images \
  baofen14787/sun-panel-navigation:latest
```

### 环境变量配置
```bash
# 设置环境变量
docker run -d \
  --name sun-panel-navigation \
  -p 3002:3002 \
  -e NODE_ENV=production \
  -e PORT=3002 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/images:/app/images \
  baofen14787/sun-panel-navigation:latest
```

## 备份和恢复

### 备份数据
```bash
# 备份数据目录
tar -czf sun-panel-backup-$(date +%Y%m%d).tar.gz data/ images/
```

### 恢复数据
```bash
# 恢复数据
tar -xzf sun-panel-backup-20240127.tar.gz
```

## 性能优化

### 1. 资源限制
```yaml
services:
  sun-panel-navigation:
    # ... 其他配置
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### 2. 健康检查
```yaml
services:
  sun-panel-navigation:
    # ... 其他配置
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3002/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 联系支持

如果问题仍未解决，请提供：
- 操作系统版本
- Docker版本
- 错误日志
- 权限检查结果
