# 🚀 Sun Panel 网址导航

[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-baofen14787%2Fsun--panel--navigation-blue?style=flat-square&logo=docker)](https://hub.docker.com/r/baofen14787/sun-panel-navigation)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)

> 🎯 **一个现代化的网址导航网站，支持多种访问模式切换，具备完整的网站管理功能。**

## 🐳 Docker 快速部署

```bash
# 一键部署
docker run -d \
  --name sun-panel-navigation \
  --restart unless-stopped \
  -p 3002:3002 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/images:/app/images \
  baofen14787/sun-panel-navigation:latest
```

**访问地址**: http://localhost:3002

## ✨ 功能特性

### 🚀 核心功能
- **多模式访问**：支持内网、IPv6、Frp、Easytier四种访问模式一键切换
- **本地缓存**：访问模式设置自动保存，下次打开时恢复上次选择
- **实时搜索**：支持网站名称和描述的实时搜索过滤
- **右键菜单**：支持右键编辑、删除网站，提供便捷管理

### 📝 网站管理
- **添加网站**：支持拖拽上传、URL获取、图标获取等多种方式
- **图标获取**：自动获取网站favicon，支持多图标选择
- **图片上传**：支持拖拽上传和URL链接获取图片
- **IP配置**：支持配置内网、FRP、Easytier IP，自动填充地址
- **数据持久化**：网站数据和图片自动保存到本地

### 🎨 界面设计
- **现代化UI**：渐变背景、毛玻璃效果、圆角设计
- **响应式布局**：完美适配桌面端和移动端
- **流畅动画**：平滑的切换动画和悬停效果
- **默认图标**：网站无图标时显示首字母默认图标
- **弹窗优化**：滚动条美化，防止样式变形

### 🔧 技术特性
- **容器化部署**：支持Docker和Docker Compose一键部署
- **RESTful API**：完整的后端API接口
- **健康检查**：自动监控应用状态
- **安全运行**：非root用户运行，增强安全性

## 🚀 快速开始

### 方法一：Docker 部署（推荐）

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd sun-panel

# 2. 使用 Docker Compose 启动
docker-compose up -d

# 3. 访问网站
# 打开浏览器访问: http://localhost:3002
```

### 方法二：传统部署

```bash
# 1. 安装依赖
npm install

# 2. 启动服务
npm start

# 3. 访问网站
# 打开浏览器访问: http://localhost:3002
```

## 📖 使用指南

### 基本操作
1. **切换访问模式**：点击右上角的模式选择器，选择需要的访问模式
2. **访问网站**：点击任意网站卡片即可访问对应网站
3. **搜索网站**：在搜索框中输入关键词快速查找网站
4. **右键管理**：右键点击网站卡片可编辑或删除网站

### 添加网站
1. **打开添加窗口**：点击右上角的"添加网站"按钮
2. **填写基本信息**：网站名称、描述、分类（必填）
3. **上传图标**：
   - **拖拽上传**：直接拖拽图片文件到上传区域
   - **URL获取**：输入图片链接自动获取
   - **图标获取**：输入网站URL，点击"获取图标"按钮自动获取favicon
4. **配置地址**：填写四种访问模式的URL地址
5. **保存网站**：点击保存完成添加

### 图标获取功能
- **自动获取**：输入网站URL，系统自动获取favicon
- **多图标选择**：如果找到多个图标，会弹出选择窗口
- **智能解析**：支持解析HTML中的各种图标标签
- **默认图标**：无图标时显示网站名称首字母

### IP配置功能
1. **打开设置**：点击右上角的"设置"按钮
2. **配置IP**：填写内网、FRP、Easytier的IP地址
3. **自动填充**：添加网站时，系统会根据内网地址自动填充其他地址
4. **保存设置**：设置会自动保存到本地

### 快捷键
- `ESC`：关闭弹窗或取消操作
- `Enter`：确认操作

## 文件结构

```
├── index.html              # 主页面文件
├── style.css               # 样式文件
├── script.js               # JavaScript功能文件
├── server.js               # Node.js服务器文件
├── package.json            # 项目配置文件
├── data/
│   └── websites.json       # 网站数据文件
├── images/                 # 上传的图片存储目录
├── Dockerfile              # Docker镜像构建文件
├── docker-compose.yml      # Docker Compose配置
├── .dockerignore           # Docker忽略文件
├── DOCKER_DEPLOYMENT.md    # Docker部署详细文档
└── README.md               # 说明文档
```

## 数据管理

### JSON数据格式
网站数据存储在 `data/websites.json` 文件中：

```json
{
  "websites": [
    {
      "id": 1,
      "name": "网站名称",
      "image": "图片文件名.png",
      "intranet": "内网地址",
      "ipv6": "IPv6地址",
      "frp": "Frp地址",
      "easytier": "Easytier地址"
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "分类名称",
      "icon": "fas fa-folder",
      "color": "#3498db"
    }
  ]
}
```

### 图片管理
- 上传的图片自动保存到 `images/` 文件夹
- 支持格式：JPEG、PNG、GIF、WebP
- 文件大小限制：5MB
- 自动生成唯一文件名避免冲突

### 修改访问模式
在`script.js`文件中修改`AccessModeManager`类的相关配置：

```javascript
// 修改模式选项
const modeNames = {
    'intranet': '内网访问',
    'ipv6': 'IPv6访问',
    'frp': 'Frp访问',
    'easytier': 'Easytier访问'
};
```

## 🐳 Docker 部署

### 快速部署

```bash
# 使用 Docker Compose（推荐）
docker-compose up -d

```

### Docker 特性

- **轻量级镜像**：基于 Alpine Linux，镜像大小 < 100MB
- **安全运行**：使用非root用户，增强安全性
- **健康检查**：自动监控应用状态
- **数据持久化**：网站数据和图片自动保存
- **自动重启**：容器异常时自动重启


## 📝 更新日志

### v1.2.0 (2025-10-21)
- 🐳 **Docker容器化**：完整的Docker部署支持
- 🔧 **IP配置功能**：支持内网、FRP、Easytier IP自动填充
- 🎯 **图标获取优化**：智能favicon获取，支持多图标选择
- 🖼️ **图片上传增强**：拖拽上传、URL获取、图标获取
- 🎨 **UI优化**：弹窗滚动条美化，默认图标显示
- 💾 **本地缓存**：访问模式设置自动保存

### v1.1.0 (2025-10-20)
- 🔍 **实时搜索**：支持网站名称和描述搜索
- 🖱️ **右键菜单**：支持右键编辑、删除网站
- 📱 **响应式优化**：移动端体验优化
- 🎨 **UI改进**：现代化设计，毛玻璃效果
- 🔧 **后端API**：完整的REST API接口

### v1.0.0 (2025-10-19)
- ✨ **初始版本**：多模式访问功能
- 🚀 **四种模式**：内网、IPv6、Frp、Easytier切换
- 🎨 **现代化UI**：渐变背景、圆角设计
- 📝 **网站管理**：添加、编辑、删除网站
- 📱 **响应式布局**：完美适配各种设备

## 📄 许可证

MIT License - 可自由使用、修改和分发。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

### 贡献指南
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 支持

如果您遇到问题或有建议，请：
- 提交 [Issue](https://github.com/hugohua/sun-panel-for-nas/issues)
- 联系维护者

---

**享受您的网址导航体验！** 🎉

