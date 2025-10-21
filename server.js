const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB限制
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// 静态文件服务
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true,
    lastModified: true
}));

// 路由配置
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 读取JSON数据文件
function readWebsitesData() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', 'websites.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取网站数据失败:', error);
        return { websites: [], categories: [] };
    }
}

// 保存JSON数据文件
function saveWebsitesData(data) {
    try {
        fs.writeFileSync(path.join(__dirname, 'data', 'websites.json'), JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('保存网站数据失败:', error);
        return false;
    }
}

// API路由 - 获取网站数据
app.get('/api/websites', (req, res) => {
    const data = readWebsitesData();
    res.json({
        success: true,
        data: data.websites,
        total: data.websites.length
    });
});

// API路由 - 添加新网站
app.post('/api/websites', upload.single('image'), (req, res) => {
    const { name, description, intranet, ipv6, frp, easytier } = req.body;
    
    // 简单的验证
    if (!name) {
        return res.status(400).json({
            success: false,
            message: '网站名称是必填项'
        });
    }
    
    const data = readWebsitesData();
    const newWebsite = {
        id: Date.now(),
        name,
        description,
        image: req.file ? req.file.filename : null,
        intranet: intranet || '#',
        ipv6: ipv6 || '#',
        frp: frp || '#',
        easytier: easytier || '#'
    };
    
    data.websites.push(newWebsite);
    
    if (saveWebsitesData(data)) {
        res.json({
            success: true,
            data: newWebsite,
            message: '网站添加成功'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '保存数据失败'
        });
    }
});

// API路由 - 重新排序网站
app.put('/api/websites/reorder', (req, res) => {
    const { order } = req.body;
    
    if (!order || !Array.isArray(order)) {
        return res.status(400).json({
            success: false,
            message: '请提供有效的排序数组'
        });
    }
    
    const data = readWebsitesData();
    const reorderedWebsites = [];
    
    // 按照新的顺序重新排列网站
    order.forEach(name => {
        const website = data.websites.find(w => w.name === name);
        if (website) {
            reorderedWebsites.push(website);
        }
    });
    
    // 添加任何未在排序中的网站（新添加的网站）
    data.websites.forEach(website => {
        if (!order.includes(website.name)) {
            reorderedWebsites.push(website);
        }
    });
    
    data.websites = reorderedWebsites;
    
    if (saveWebsitesData(data)) {
        res.json({
            success: true,
            message: '排序保存成功',
            data: data.websites
        });
    } else {
        res.status(500).json({
            success: false,
            message: '保存排序失败'
        });
    }
});

// API路由 - 更新网站
app.put('/api/websites/:name', upload.single('image'), (req, res) => {
    const { name } = req.params;
    const { name: newName, intranet, ipv6, frp, easytier } = req.body;
    
    const data = readWebsitesData();
    const websiteIndex = data.websites.findIndex(w => w.name === name);
    
    if (websiteIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '网站不存在'
        });
    }
    
    // 更新网站信息
    data.websites[websiteIndex] = {
        ...data.websites[websiteIndex],
        name: newName || data.websites[websiteIndex].name,
        image: req.file ? req.file.filename : data.websites[websiteIndex].image,
        intranet: intranet || data.websites[websiteIndex].intranet,
        ipv6: ipv6 || data.websites[websiteIndex].ipv6,
        frp: frp || data.websites[websiteIndex].frp,
        easytier: easytier || data.websites[websiteIndex].easytier
    };
    
    if (saveWebsitesData(data)) {
        res.json({
            success: true,
            data: data.websites[websiteIndex],
            message: '网站信息更新成功'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '保存数据失败'
        });
    }
});

// API路由 - 删除网站
app.delete('/api/websites/:name', (req, res) => {
    const { name } = req.params;
    
    const data = readWebsitesData();
    const websiteIndex = data.websites.findIndex(w => w.name === name);
    
    if (websiteIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '网站不存在'
        });
    }
    
    // 删除网站
    const deletedWebsite = data.websites.splice(websiteIndex, 1)[0];
    
    if (saveWebsitesData(data)) {
        res.json({
            success: true,
            data: deletedWebsite,
            message: '网站删除成功'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '保存数据失败'
        });
    }
});

// API路由 - 导入网站数据
app.post('/api/websites/import', (req, res) => {
    const { websites } = req.body;
    
    if (!websites || !Array.isArray(websites)) {
        return res.status(400).json({
            success: false,
            message: '无效的导入数据格式'
        });
    }
    
    // 验证网站数据格式
    for (const website of websites) {
        if (!website.name) {
            return res.status(400).json({
                success: false,
                message: '网站数据缺少必要字段：name'
            });
        }
    }
    
    const data = {
        websites: websites,
        categories: [] // 保持数据结构兼容性，但不再使用分类
    };
    
    if (saveWebsitesData(data)) {
        res.json({
            success: true,
            message: '数据导入成功',
            data: {
                websitesCount: websites.length
            }
        });
    } else {
        res.status(500).json({
            success: false,
            message: '保存导入数据失败'
        });
    }
});

// API路由 - 上传图片
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: '没有上传文件'
        });
    }
    
    res.json({
        success: true,
        data: {
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            path: `/images/${req.file.filename}`
        },
        message: '图片上传成功'
    });
});

// API路由 - 获取访问模式配置
app.get('/api/modes', (req, res) => {
    const modes = [
        {
            key: 'intranet',
            name: '内网访问',
            icon: '🏠',
            color: '#3498db',
            description: '局域网内访问'
        },
        {
            key: 'ipv6',
            name: 'IPv6访问',
            icon: '🌐',
            color: '#2ecc71',
            description: 'IPv6网络访问'
        },
        {
            key: 'frp',
            name: 'Frp访问',
            icon: '🔗',
            color: '#e74c3c',
            description: 'Frp内网穿透访问'
        },
        {
            key: 'easytier',
            name: 'Easytier访问',
            icon: '⚡',
            color: '#f39c12',
            description: 'Easytier网络访问'
        }
    ];
    
    res.json({
        success: true,
        data: modes
    });
});

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '服务运行正常',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 测试HTML解析的函数
function testIconParsing() {
    const testHtml = `
    <link rel="apple-touch-icon" href="https://i0.hdslb.com/bfs/static/jinkela/long/images/512.png" />
    <link rel="shortcut icon" href="https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico" />
    <link rel="icon" href="/favicon.ico" />
    `;
    
    const iconPatterns = [
        /<link[^>]+rel=["']apple-touch-icon["'][^>]*>/gi,
        /<link[^>]+rel=["']shortcut icon["'][^>]*>/gi,
        /<link[^>]+rel=["']icon["'][^>]*>/gi
    ];
    
    console.log('测试HTML解析:');
    iconPatterns.forEach((pattern, index) => {
        const matches = testHtml.match(pattern);
        if (matches) {
            console.log(`模式 ${index + 1} 匹配到:`, matches);
            matches.forEach(match => {
                const hrefMatch = match.match(/href=["']([^"']+)["']/i);
                if (hrefMatch) {
                    console.log(`  提取的URL: ${hrefMatch[1]}`);
                }
            });
        }
    });
}

// 获取网站图标的函数
async function getWebsiteFavicons(url) {
    const iconUrls = [];
    
    try {
        // 解析URL
        const urlObj = new URL(url);
        const baseUrl = urlObj.origin;
        const hostname = urlObj.hostname;
        
        // 方法1: 尝试直接获取 /favicon.ico
        try {
            const faviconUrl = `${baseUrl}/favicon.ico`;
            const response = await axios.head(faviconUrl, { 
                timeout: 5000,
                validateStatus: (status) => status < 400
            });
            
            if (response.status === 200) {
                iconUrls.push(faviconUrl);
            }
        } catch (error) {
            console.log('favicon.ico 不可用');
        }

        // 方法2: 尝试获取网站HTML中的图标链接
        try {
            const response = await axios.get(url, { 
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            const html = response.data;
            console.log('获取到HTML内容，开始解析图标...');
            
            // 解析各种类型的图标链接，按照优先级排序
            const iconPatterns = [
                // apple-touch-icon (高优先级，通常是高质量图标)
                /<link[^>]+rel=["']apple-touch-icon["'][^>]*>/gi,
                // shortcut icon (传统favicon)
                /<link[^>]+rel=["']shortcut icon["'][^>]*>/gi,
                // 普通icon
                /<link[^>]+rel=["']icon["'][^>]*>/gi,
                // apple-touch-icon-precomposed
                /<link[^>]+rel=["']apple-touch-icon-precomposed["'][^>]*>/gi
            ];
            
            iconPatterns.forEach((pattern, index) => {
                const matches = html.match(pattern);
                if (matches) {
                    console.log(`找到 ${matches.length} 个匹配的图标标签 (模式 ${index + 1})`);
                    matches.forEach(match => {
                        const hrefMatch = match.match(/href=["']([^"']+)["']/i);
                        if (hrefMatch) {
                            let iconUrl = hrefMatch[1];
                            
                            // 处理相对路径
                            if (iconUrl.startsWith('/')) {
                                iconUrl = baseUrl + iconUrl;
                            } else if (!iconUrl.startsWith('http')) {
                                iconUrl = baseUrl + '/' + iconUrl;
                            }
                            
                            // 避免重复添加
                            if (!iconUrls.includes(iconUrl)) {
                                iconUrls.push(iconUrl);
                                console.log(`添加图标: ${iconUrl}`);
                            }
                        }
                    });
                }
            });
            
            // 也尝试匹配meta标签中的图标 (Open Graph)
            const metaIconRegex = /<meta[^>]+property=["']og:image["'][^>]*>/gi;
            const metaMatches = html.match(metaIconRegex);
            
            if (metaMatches) {
                console.log(`找到 ${metaMatches.length} 个Open Graph图片`);
                metaMatches.forEach(match => {
                    const contentMatch = match.match(/content=["']([^"']+)["']/i);
                    if (contentMatch) {
                        let iconUrl = contentMatch[1];
                        if (iconUrl.startsWith('/')) {
                            iconUrl = baseUrl + iconUrl;
                        } else if (!iconUrl.startsWith('http')) {
                            iconUrl = baseUrl + '/' + iconUrl;
                        }
                        
                        // 避免重复添加
                        if (!iconUrls.includes(iconUrl)) {
                            iconUrls.push(iconUrl);
                            console.log(`添加Open Graph图片: ${iconUrl}`);
                        }
                    }
                });
            }
            
            console.log(`总共找到 ${iconUrls.length} 个图标`);
            
            // 如果找到了图标，输出详细信息用于调试
            if (iconUrls.length > 0) {
                console.log('找到的图标列表:');
                iconUrls.forEach((url, index) => {
                    console.log(`  ${index + 1}. ${url}`);
                });
            }
            
        } catch (error) {
            console.log('无法获取网站HTML:', error.message);
        }

        // 方法3: 使用Google favicon服务作为备选
        if (iconUrls.length === 0) {
            try {
                const googleUrl = `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
                const response = await axios.head(googleUrl, { 
                    timeout: 5000,
                    validateStatus: (status) => status < 400
                });
                
                if (response.status === 200) {
                    iconUrls.push(googleUrl);
                }
            } catch (error) {
                console.log('Google favicon API 不可用');
            }
        }

        // 方法4: 使用GitHub favicon服务作为备选
        if (iconUrls.length === 0) {
            try {
                const githubUrl = `https://favicons.githubusercontent.com/${hostname}`;
                const response = await axios.head(githubUrl, { 
                    timeout: 5000,
                    validateStatus: (status) => status < 400
                });
                
                if (response.status === 200) {
                    iconUrls.push(githubUrl);
                }
            } catch (error) {
                console.log('GitHub favicon API 不可用');
            }
        }

        return iconUrls;
        
    } catch (error) {
        throw new Error('解析URL失败: ' + error.message);
    }
}

// API路由 - 获取设置
app.get('/api/settings', (req, res) => {
    try {
        const settings = {
            intranetIp: '',
            frpIp: '',
            easytierIp: '',
            defaultPort: ''
        };
        
        res.json({
            success: true,
            data: settings,
            message: '获取设置成功'
        });
    } catch (error) {
        console.error('获取设置失败:', error);
        res.status(500).json({
            success: false,
            message: '获取设置失败: ' + error.message
        });
    }
});

// API路由 - 保存设置
app.post('/api/settings', (req, res) => {
    try {
        const { intranetIp, frpIp, easytierIp, defaultPort } = req.body;
        
        // 这里可以将设置保存到数据库或文件
        // 目前只是返回成功响应
        res.json({
            success: true,
            message: '设置保存成功'
        });
    } catch (error) {
        console.error('保存设置失败:', error);
        res.status(500).json({
            success: false,
            message: '保存设置失败: ' + error.message
        });
    }
});

// API路由 - 获取网站图标
app.get('/api/getSiteFaviconList', async (req, res) => {
    let { url } = req.query;
    
    if (!url) {
        return res.status(400).json({
            code: 1,
            data: null,
            msg: '请提供网站URL'
        });
    }

    try {
        // 处理URL，移除@前缀
        if (url.startsWith('@')) {
            url = url.substring(1);
        }
        
        // 确保URL有协议
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // 运行测试解析
        testIconParsing();
        
        const iconUrls = await getWebsiteFavicons(url);
        
        res.json({
            code: 0,
            data: {
                count: iconUrls.length,
                list: iconUrls
            },
            msg: 'OK'
        });
    } catch (error) {
        console.error('获取网站图标失败:', error);
        res.status(500).json({
            code: 1,
            data: null,
            msg: '获取网站图标失败: ' + error.message
        });
    }
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: '请求的资源不存在'
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log('🚀 网址导航服务器启动成功!');
    console.log(`📱 本地访问: http://localhost:${PORT}`);
    console.log(`🌐 网络访问: http://0.0.0.0:${PORT}`);
    console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`);
    console.log('📊 健康检查: http://localhost:' + PORT + '/api/health');
    console.log('🔧 API文档: http://localhost:' + PORT + '/api/websites');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，正在优雅关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('收到SIGINT信号，正在优雅关闭服务器...');
    process.exit(0);
});

// 未捕获的异常处理
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
    process.exit(1);
});

