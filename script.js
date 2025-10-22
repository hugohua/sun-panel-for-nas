// Header折叠功能
class HeaderManager {
    constructor() {
        this.headerToggle = document.getElementById('header-toggle');
        this.headerControls = document.getElementById('header-controls');
        this.isExpanded = false;
        this.init();
    }

    init() {
        if (this.headerToggle && this.headerControls) {
            // 移动端默认收起
            if (window.innerWidth <= 768) {
                this.collapse();
            }
            
            this.headerToggle.addEventListener('click', () => {
                this.toggle();
            });
        }
    }

    toggle() {
        if (this.isExpanded) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    expand() {
        this.headerControls.classList.remove('collapsed');
        this.headerControls.classList.add('expanded');
        this.headerToggle.classList.add('expanded');
        this.isExpanded = true;
    }

    collapse() {
        this.headerControls.classList.remove('expanded');
        this.headerControls.classList.add('collapsed');
        this.headerToggle.classList.remove('expanded');
        this.isExpanded = false;
    }
}

// 访问模式管理类
class AccessModeManager {
    constructor() {
        this.currentMode = this.loadSavedMode() || 'intranet';
        this.modeSelect = document.getElementById('access-mode');
        this.websiteCards = document.querySelectorAll('.website-card');
        this.init();
    }

    init() {
        // 设置选择器的值
        if (this.modeSelect) {
            this.modeSelect.value = this.currentMode;
        }

        // 绑定模式切换事件
        this.modeSelect.addEventListener('change', (e) => {
            this.switchMode(e.target.value);
        });

        // 初始化所有链接
        this.updateAllLinks();
    }

    // 从localStorage加载保存的模式
    loadSavedMode() {
        try {
            const savedMode = localStorage.getItem('accessMode');
            if (savedMode && ['intranet', 'ipv6', 'frp', 'easytier'].includes(savedMode)) {
                console.log('从localStorage加载访问模式:', savedMode);
                return savedMode;
            }
        } catch (error) {
            console.warn('无法从localStorage读取访问模式:', error);
        }
        console.log('未找到保存的访问模式，使用默认值: intranet');
        return null;
    }

    // 保存模式到localStorage
    saveMode(mode) {
        try {
            localStorage.setItem('accessMode', mode);
            console.log('访问模式已保存到localStorage:', mode);
        } catch (error) {
            console.warn('无法保存访问模式到localStorage:', error);
        }
    }

    switchMode(mode) {
        this.currentMode = mode;
        this.saveMode(mode); // 保存模式到localStorage
        this.updateAllLinks();
        
        // 添加切换动画效果
        this.websiteCards.forEach((card, index) => {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 50);
        });
    }

    updateAllLinks() {
        // 由于移除了website-links元素，这里不需要做任何操作
    }


    getModeIcon(mode) {
        const icons = {
            'intranet': '🏠',
            'ipv6': '🌐',
            'frp': '🔗',
            'easytier': '⚡'
        };
        return icons[mode] || '🔗';
    }

    getModeColor(mode) {
        const colors = {
            'intranet': '#3498db',
            'ipv6': '#2ecc71',
            'frp': '#e74c3c',
            'easytier': '#f39c12'
        };
        return colors[mode] || '#3498db';
    }

}

// 网站数据管理类
class WebsiteDataManager {
    constructor() {
        this.websites = [];
        this.loadSampleData();
    }

    loadSampleData() {
        // 这里可以加载更多示例数据
        this.websites = [
            {
                name: "GitHub",
                description: "代码托管平台",
                image: "github.png",
                intranet: "https://github.intranet.com",
                ipv6: "https://github.ipv6.com",
                frp: "https://github.frp.com",
                easytier: "https://github.easytier.com"
            },
            {
                name: "GitLab",
                description: "DevOps平台",
                image: "gitlab.png",
                intranet: "https://gitlab.intranet.com",
                ipv6: "https://gitlab.ipv6.com",
                frp: "https://gitlab.frp.com",
                easytier: "https://gitlab.easytier.com"
            }
        ];
    }

    addWebsite(websiteData) {
        this.websites.push(websiteData);
        this.renderWebsite(websiteData);
    }

    renderWebsite(website) {
        // 动态添加网站卡片到页面
        const category = document.querySelector('.category:first-child .websites-grid');
        if (category) {
            const card = this.createWebsiteCard(website);
            category.appendChild(card);
        }
    }

    createWebsiteCard(website) {
        const card = document.createElement('div');
        card.className = 'website-card';
        card.setAttribute('data-name', website.name);
        
        // 创建图标HTML，如果没有图片则使用默认图标
        const iconHtml = this.createIconHtml(website);
        
        card.innerHTML = `
            <div class="website-icon">
                ${iconHtml}
            </div>
            <div class="website-info">
                <h3 class="website-name">${website.name}</h3>
            </div>
            <div class="drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
        `;
        
        return card;
    }

    createIconHtml(website) {
        if (website.image && website.image.trim() !== '') {
            // 如果有图片，创建img元素并添加错误处理
            return `<img src="/images/${website.image}" alt="${website.name}" 
                        class="website-icon-image"
                        onerror="this.style.display='none'; this.nextElementSibling.classList.remove('default-icon-hidden');">
                    <div class="default-icon-inline default-icon-hidden">
                        ${website.name.charAt(0).toUpperCase()}
                    </div>`;
        } else {
            // 如果没有图片，直接显示默认图标
            return `<div class="default-icon-inline">
                        ${website.name.charAt(0).toUpperCase()}
                    </div>`;
        }
    }
}

// 工具函数
class Utils {
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }


    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 搜索功能
class SearchManager {
    constructor() {
        this.searchInput = null;
        this.init();
    }

    init() {
        this.createSearchBox();
        this.bindSearchEvents();
    }

    createSearchBox() {
        const header = document.querySelector('.header-content');
        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        searchBox.innerHTML = `
            <div class="search-container">
                <i class="fas fa-search"></i>
                <input type="text" id="search-input" placeholder="搜索网站...">
                <button id="clear-search" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // 搜索框样式已在CSS中定义
        
        header.appendChild(searchBox);
        this.searchInput = document.getElementById('search-input');
    }

    bindSearchEvents() {
        const searchInput = this.searchInput;
        const clearButton = document.getElementById('clear-search');
        
        const debouncedSearch = Utils.debounce((query) => {
            this.performSearch(query);
        }, 300);
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearButton.style.display = query ? 'block' : 'none';
            debouncedSearch(query);
        });
        
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            this.clearSearch();
        });
    }

    performSearch(query) {
        const cards = document.querySelectorAll('.website-card');
        const categories = document.querySelectorAll('.category');
        
        if (!query) {
            cards.forEach(card => card.style.display = '');
            categories.forEach(category => category.style.display = '');
            return;
        }
        
        let hasVisibleCards = false;
        
        cards.forEach(card => {
            const name = card.querySelector('.website-name').textContent.toLowerCase();
            const desc = card.querySelector('.website-desc').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            if (name.includes(searchQuery) || desc.includes(searchQuery)) {
                card.style.display = '';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // 隐藏没有可见卡片的分类
        categories.forEach(category => {
            const visibleCards = category.querySelectorAll('.website-card:not([style*="display: none"])');
            category.style.display = visibleCards.length > 0 ? '' : 'none';
        });
    }

    clearSearch() {
        const cards = document.querySelectorAll('.website-card');
        const categories = document.querySelectorAll('.category');
        
        cards.forEach(card => card.style.display = '');
        categories.forEach(category => category.style.display = '');
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    .search-container {
        position: relative;
        display: flex;
        align-items: center;
        background: white;
        border-radius: 25px;
        padding: 10px 20px;
        border: 2px solid #e9ecef;
        transition: all 0.3s ease;
    }
    
    .search-container:focus-within {
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
    
    .search-container i {
        color: #6c757d;
        margin-right: 10px;
    }
    
    .search-container input {
        border: none;
        outline: none;
        flex: 1;
        font-size: 14px;
        color: #495057;
    }
    
    .search-container input::placeholder {
        color: #adb5bd;
    }
    
    .search-container button {
        background: none;
        border: none;
        color: #6c757d;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .search-container button:hover {
        background: #f8f9fa;
        color: #495057;
    }
`;
document.head.appendChild(style);

// 导入导出管理类
class ImportExportManager {
    constructor() {
        this.importExportModal = document.getElementById('import-export-modal');
        this.importFile = document.getElementById('import-file');
        this.fileDropZone = document.getElementById('file-drop-zone');
        this.fileInfo = document.getElementById('file-info');
        this.fileName = document.getElementById('file-name');
        this.importDataBtn = document.getElementById('import-data-btn');
        this.exportDataBtn = document.getElementById('export-data-btn');
        this.selectedFile = null;
        this.init();
    }

    init() {
        // 绑定事件
        document.getElementById('import-export-btn').addEventListener('click', () => this.open());
        document.getElementById('import-export-close').addEventListener('click', () => this.close());
        document.getElementById('import-export-cancel-btn').addEventListener('click', () => this.close());
        
        // 标签切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // 导出功能
        this.exportDataBtn.addEventListener('click', () => this.exportData());
        
        // 导入功能
        this.importDataBtn.addEventListener('click', () => this.importData());
        
        // 文件选择
        this.importFile.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // 文件拖拽
        this.fileDropZone.addEventListener('click', () => this.importFile.click());
        this.fileDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.fileDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.fileDropZone.addEventListener('drop', (e) => this.handleDrop(e));
        
        // 移除文件
        document.querySelector('.remove-file-btn').addEventListener('click', () => this.removeFile());
        
        // 点击背景关闭
        this.importExportModal.addEventListener('click', (e) => {
            if (e.target === this.importExportModal) this.close();
        });
    }

    open() {
        this.importExportModal.style.display = 'flex';
        this.importExportModal.style.opacity = '0';
        this.importExportModal.offsetHeight;
        requestAnimationFrame(() => {
            this.importExportModal.classList.add('show');
        });
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.importExportModal.classList.remove('show');
        setTimeout(() => {
            this.importExportModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
        this.resetForm();
    }

    switchTab(tabName) {
        // 更新标签状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // 显示对应内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    async exportData() {
        try {
            const response = await fetch('/api/websites');
            const result = await response.json();
            
            if (result.success) {
                const data = {
                    websites: result.data,
                    exportTime: new Date().toISOString(),
                    version: '1.0'
                };
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `websites-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                Utils.showNotification('数据导出成功', 'success');
            } else {
                Utils.showNotification('导出失败: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('导出失败:', error);
            Utils.showNotification('导出失败，请重试', 'error');
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            this.selectedFile = file;
            this.showFileInfo(file.name);
        } else {
            Utils.showNotification('请选择JSON文件', 'error');
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.fileDropZone.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.fileDropZone.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.fileDropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/json') {
                this.selectedFile = file;
                this.showFileInfo(file.name);
            } else {
                Utils.showNotification('请选择JSON文件', 'error');
            }
        }
    }

    showFileInfo(fileName) {
        this.fileName.textContent = fileName;
        this.fileDropZone.style.display = 'none';
        this.fileInfo.style.display = 'flex';
        this.importDataBtn.disabled = false;
    }

    removeFile() {
        this.selectedFile = null;
        this.importFile.value = '';
        this.fileDropZone.style.display = 'block';
        this.fileInfo.style.display = 'none';
        this.importDataBtn.disabled = true;
    }

    async importData() {
        if (!this.selectedFile) {
            Utils.showNotification('请先选择文件', 'error');
            return;
        }

        const backupBeforeImport = document.getElementById('backup-before-import').checked;
        
        if (backupBeforeImport) {
            // 先备份现有数据
            await this.exportData();
        }

        try {
            const text = await this.selectedFile.text();
            const data = JSON.parse(text);
            
            // 验证数据格式
            if (!data.websites || !Array.isArray(data.websites)) {
                throw new Error('无效的数据格式');
            }
            
            const response = await fetch('/api/websites/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                Utils.showNotification('数据导入成功', 'success');
                this.close();
                // 重新加载页面
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                Utils.showNotification('导入失败: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('导入失败:', error);
            Utils.showNotification('导入失败: ' + error.message, 'error');
        }
    }

    resetForm() {
        this.removeFile();
        this.switchTab('export');
    }
}

// 弹窗管理类
class ModalManager {
    constructor() {
        this.modal = document.getElementById('add-website-modal');
        this.form = document.getElementById('add-website-form');
        this.imagePreview = document.getElementById('image-preview');
        this.settingsModal = document.getElementById('settings-modal');
        this.settingsForm = document.getElementById('settings-form');
        this.init();
    }

    init() {
        // 绑定事件
        document.getElementById('add-website-btn').addEventListener('click', () => this.open());
        document.getElementById('modal-close').addEventListener('click', () => this.close());
        document.getElementById('cancel-btn').addEventListener('click', () => this.close());
        document.getElementById('save-btn').addEventListener('click', () => this.save());
        
        // 设置弹窗事件
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());
        document.getElementById('settings-close').addEventListener('click', () => this.closeSettings());
        document.getElementById('settings-cancel-btn').addEventListener('click', () => this.closeSettings());
        document.getElementById('settings-save-btn').addEventListener('click', () => this.saveSettings());
        
        // 图片预览
        document.getElementById('website-image').addEventListener('change', (e) => this.previewImage(e));
        
        // 初始化上传功能
        this.initUploadFeatures();
        
        // 点击背景关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.close();
            }
        });
        
        // 设置弹窗背景关闭
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });
        
        // 内网地址输入时自动填充其他地址
        document.getElementById('intranet-url').addEventListener('input', (e) => this.autoFillAddresses(e));
    }

    // 设置弹窗相关方法
    openSettings() {
        this.settingsModal.style.display = 'flex';
        this.settingsModal.style.opacity = '0';
        this.settingsModal.offsetHeight;
        requestAnimationFrame(() => {
            this.settingsModal.classList.add('show');
        });
        document.body.style.overflow = 'hidden';
        this.loadSettings();
    }

    closeSettings() {
        this.settingsModal.classList.remove('show');
        setTimeout(() => {
            this.settingsModal.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }

    loadSettings() {
        // 从localStorage加载设置
        const settings = JSON.parse(localStorage.getItem('ipSettings') || '{}');
        document.getElementById('intranet-ip').value = settings.intranetIp || '';
        document.getElementById('frp-ip').value = settings.frpIp || '';
        document.getElementById('easytier-ip').value = settings.easytierIp || '';
    }

    saveSettings() {
        const formData = new FormData(this.settingsForm);
        const settings = {
            intranetIp: formData.get('intranetIp'),
            frpIp: formData.get('frpIp'),
            easytierIp: formData.get('easytierIp')
        };

        // 验证必填字段
        if (!settings.intranetIp || !settings.frpIp || !settings.easytierIp) {
            Utils.showNotification('请填写所有IP地址', 'error');
            return;
        }

        // 保存到localStorage
        localStorage.setItem('ipSettings', JSON.stringify(settings));
        Utils.showNotification('设置保存成功', 'success');
        this.closeSettings();
    }

    // IP自动填充功能
    autoFillAddresses(event) {
        const intranetUrl = event.target.value;
        if (!intranetUrl || intranetUrl.trim() === '') return;

        // 从localStorage获取IP配置
        const settings = JSON.parse(localStorage.getItem('ipSettings') || '{}');
        if (!settings.intranetIp || !settings.frpIp || !settings.easytierIp) {
            return; // 如果没有配置IP，不进行自动填充
        }

        try {
            // 解析内网地址
            const url = new URL(intranetUrl.startsWith('http') ? intranetUrl : 'http://' + intranetUrl);
            const hostname = url.hostname;
            const port = url.port;
            const pathname = url.pathname;

            // 检查是否是配置的内网IP
            if (hostname === settings.intranetIp) {
                // 自动填充FRP地址 - 只替换IP，保持端口和路径
                const frpUrl = `http://${settings.frpIp}${port ? ':' + port : ''}${pathname}`;
                document.getElementById('frp-url').value = frpUrl;

                // 自动填充EasyTier地址 - 只替换IP，保持端口和路径
                const easytierUrl = `http://${settings.easytierIp}${port ? ':' + port : ''}${pathname}`;
                document.getElementById('easytier-url').value = easytierUrl;

                Utils.showNotification('已自动填充FRP和EasyTier地址', 'success');
            }
        } catch (error) {
            // 如果URL解析失败，忽略
            console.log('URL解析失败，跳过自动填充');
        }
    }

    initUploadFeatures() {
        // 上传标签切换
        const uploadTabs = document.querySelectorAll('.upload-tab');
        uploadTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchUploadTab(tab.dataset.tab));
        });

        // 拖拽上传
        const dragDropArea = document.getElementById('drag-drop-area');
        if (dragDropArea) {
            dragDropArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            dragDropArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            dragDropArea.addEventListener('drop', (e) => this.handleDrop(e));
            dragDropArea.addEventListener('click', () => this.triggerFileSelect());
        }

        // 选择文件按钮
        const selectFileBtn = document.querySelector('.select-file-btn');
        if (selectFileBtn) {
            selectFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.triggerFileSelect();
            });
        }

        // URL上传
        const fetchImageBtn = document.getElementById('fetch-image-btn');
        if (fetchImageBtn) {
            fetchImageBtn.addEventListener('click', () => this.fetchImageFromUrl());
        }

        const imageUrlInput = document.getElementById('image-url');
        if (imageUrlInput) {
            imageUrlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.fetchImageFromUrl();
                }
            });
        }

        // 获取网站图标按钮
        const fetchIconBtns = document.querySelectorAll('.fetch-icon-btn');
        fetchIconBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.fetch-icon-btn').dataset.target;
                this.fetchWebsiteIcon(target);
            });
        });
    }

    switchUploadTab(tabName) {
        // 更新标签状态
        document.querySelectorAll('.upload-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 显示对应内容
        document.querySelectorAll('.upload-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`${tabName}-upload`).style.display = 'block';
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                this.handleFileSelect(file);
            } else {
                Utils.showNotification('请选择图片文件', 'error');
            }
        }
    }

    triggerFileSelect() {
        document.getElementById('website-image').click();
    }

    handleFileSelect(file) {
        const fileInput = document.getElementById('website-image');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // 触发change事件
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }

    async fetchImageFromUrl() {
        const urlInput = document.getElementById('image-url');
        const url = urlInput.value.trim();
        
        if (!url) {
            Utils.showNotification('请输入图片URL', 'error');
            return;
        }

        if (!this.isValidImageUrl(url)) {
            Utils.showNotification('请输入有效的图片URL', 'error');
            return;
        }

        try {
            // 显示加载状态
            const fetchBtn = document.getElementById('fetch-image-btn');
            const originalText = fetchBtn.textContent;
            fetchBtn.textContent = '获取中...';
            fetchBtn.disabled = true;

            // 创建图片元素来验证URL
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // 将图片转换为blob
                this.convertImageUrlToFile(url, img);
                fetchBtn.textContent = originalText;
                fetchBtn.disabled = false;
            };
            
            img.onerror = () => {
                Utils.showNotification('无法加载图片，请检查URL是否正确', 'error');
                fetchBtn.textContent = originalText;
                fetchBtn.disabled = false;
            };
            
            img.src = url;
        } catch (error) {
            Utils.showNotification('获取图片失败: ' + error.message, 'error');
            const fetchBtn = document.getElementById('fetch-image-btn');
            fetchBtn.textContent = '获取图片';
            fetchBtn.disabled = false;
        }
    }

    isValidImageUrl(url) {
        try {
            const urlObj = new URL(url);
            return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname) || 
                   url.includes('data:image/') ||
                   url.includes('blob:');
        } catch {
            return false;
        }
    }

    async convertImageUrlToFile(url, img) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'image.png', { type: 'image/png' });
                    this.handleFileSelect(file);
                    Utils.showNotification('图片获取成功', 'success');
                } else {
                    Utils.showNotification('图片转换失败', 'error');
                }
            }, 'image/png');
        } catch (error) {
            Utils.showNotification('图片处理失败: ' + error.message, 'error');
        }
    }

    async fetchWebsiteIcon(target) {
        const urlInput = document.getElementById(`${target}-url`);
        const url = urlInput.value.trim();
        
        if (!url) {
            Utils.showNotification('请先输入网站地址', 'warning');
            return;
        }

        if (!this.isValidUrl(url)) {
            Utils.showNotification('请输入有效的网站地址', 'error');
            return;
        }

        const btn = document.querySelector(`[data-target="${target}"]`);
        const originalContent = btn.innerHTML;
        
        try {
            // 显示加载状态
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            // 调用后端接口获取网站图标
            const response = await fetch(`/api/getSiteFaviconList?url=${encodeURIComponent(url)}`);
            const result = await response.json();
            
            if (result.code === 0 && result.data && result.data.list && result.data.list.length > 0) {
                // 如果只有一个图标，直接使用
                if (result.data.list.length === 1) {
                    const iconUrl = result.data.list[0];
                    
                    // 切换到URL上传标签
                    this.switchUploadTab('url');
                    
                    // 填充到URL输入框
                    const imageUrlInput = document.getElementById('image-url');
                    imageUrlInput.value = iconUrl;
                    
                    Utils.showNotification(`网站图标获取成功`, 'success');
                } else {
                    // 多个图标，显示选择弹窗
                    this.showIconSelectionModal(result.data.list, target);
                }
            } else {
                Utils.showNotification('未能获取到网站图标', 'warning');
            }
        } catch (error) {
            console.error('获取网站图标失败:', error);
            Utils.showNotification('获取网站图标失败: ' + error.message, 'error');
        } finally {
            // 恢复按钮状态
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    }

    // 显示图标选择弹窗
    showIconSelectionModal(iconList, targetButton) {
        // 创建弹窗HTML
        const modalHtml = `
            <div id="icon-selection-modal" class="icon-selection-modal">
                <div class="icon-selection-content">
                    <div class="icon-selection-header">
                        <h3>选择网站图标</h3>
                        <button class="icon-selection-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="icon-selection-body">
                        <p>找到 ${iconList.length} 个可用图标，请选择一个：</p>
                        <div class="icon-grid">
                            ${iconList.map((iconUrl, index) => `
                                <div class="icon-option" data-url="${iconUrl}">
                                    <div class="icon-preview">
                                        <img src="${iconUrl}" alt="图标 ${index + 1}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                        <div class="icon-fallback" style="display: none;">
                                            <i class="fas fa-image"></i>
                                        </div>
                                    </div>
                                    <div class="icon-info">
                                        <span class="icon-url">${iconUrl}</span>
                                    </div>
                                    <button class="icon-select-btn">选择此图标</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // 绑定选择事件
        const modal = document.getElementById('icon-selection-modal');
        const iconOptions = modal.querySelectorAll('.icon-option');
        
        iconOptions.forEach(option => {
            const selectBtn = option.querySelector('.icon-select-btn');
            selectBtn.addEventListener('click', () => {
                const selectedUrl = option.dataset.url;
                
                // 切换到URL上传标签
                this.switchUploadTab('url');
                
                // 填充到URL输入框
                const imageUrlInput = document.getElementById('image-url');
                imageUrlInput.value = selectedUrl;
                
                // 关闭弹窗
                modal.remove();
                
                Utils.showNotification('图标选择成功', 'success');
            });
        });

        // 绑定关闭按钮事件
        const closeBtn = modal.querySelector('.icon-selection-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        // 点击背景关闭弹窗
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // 按ESC键关闭弹窗
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // 弹窗关闭时清理事件监听器
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach((node) => {
                        if (node === modal) {
                            document.removeEventListener('keydown', handleKeyDown);
                            observer.disconnect();
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true });
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }


    open() {
        // 设置display
        this.modal.style.display = 'flex';
        
        // 强制重绘，确保初始状态被应用
        this.modal.offsetHeight;
        
        // 使用requestAnimationFrame确保动画流畅
        requestAnimationFrame(() => {
            this.modal.classList.add('show');
        });
        
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
        this.resetForm();
        this.resetEditMode();
    }

    previewImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview.innerHTML = `<img src="${e.target.result}" alt="预览图片">`;
            };
            reader.readAsDataURL(file);
        }
    }

    async save() {
        const formData = new FormData(this.form);
        const saveBtn = document.getElementById('save-btn');
        
        // 验证必填字段
        const name = formData.get('name');
        
        if (!name) {
            Utils.showNotification('请填写网站名称', 'error');
            return;
        }
        
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<div class="loading"></div> 保存中...';
        
        try {
            const isEditing = this.modal.dataset.editingCard === 'true';
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `/api/websites/${this.modal.dataset.cardName}` : '/api/websites';
            
            const response = await fetch(url, {
                method: method,
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                const message = isEditing ? '网站信息更新成功' : '网站添加成功';
                Utils.showNotification(message, 'success');
                this.close();
                // 重新加载页面数据
                location.reload();
            } else {
                Utils.showNotification(result.message || (isEditing ? '更新失败' : '添加失败'), 'error');
            }
        } catch (error) {
            console.error('操作失败:', error);
            Utils.showNotification('网络错误，请重试', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = this.modal.dataset.editingCard === 'true' ? '更新' : '保存';
        }
    }

    resetForm() {
        this.form.reset();
        this.imagePreview.innerHTML = '';
    }

    resetEditMode() {
        // 重置弹窗标题和按钮
        const modalTitle = this.modal.querySelector('h3');
        modalTitle.textContent = '添加新网站';
        
        const saveBtn = document.getElementById('save-btn');
        saveBtn.textContent = '保存';
        
        // 清除编辑标记
        this.modal.removeAttribute('data-editing-card');
        this.modal.removeAttribute('data-card-name');
    }
}

// 拖拽排序管理类
class DragSortManager {
    constructor() {
        this.draggedElement = null;
        this.dragOverElement = null;
        this.init();
    }

    init() {
        // 立即尝试初始化，如果DOM还没准备好，会在数据加载后重新初始化
        this.setupDragAndDrop();
        
        // 如果初始化失败，设置一个延迟重试
        if (!document.querySelector('.websites-grid')) {
            setTimeout(() => {
                this.setupDragAndDrop();
            }, 1000);
        }
    }

    setupDragAndDrop() {
        const websitesGrid = document.querySelector('.websites-grid');
        if (!websitesGrid) {
            console.log('拖拽排序: 等待网站数据加载完成...');
            return;
        }

        console.log('拖拽排序: 开始设置拖拽功能');
        
        // 为所有网站卡片添加拖拽事件
        this.addDragListenersToCards();
        
        // 监听新添加的卡片
        this.observeNewCards();
        
        console.log('拖拽排序: 拖拽功能设置完成');
    }

    addDragListenersToCards() {
        const cards = document.querySelectorAll('.website-card');
        console.log(`拖拽排序: 找到 ${cards.length} 个网站卡片`);
        cards.forEach(card => {
            this.addDragListeners(card);
        });
    }

    addDragListeners(card) {
        // 避免重复添加事件监听器
        if (card.dataset.dragInitialized === 'true') {
            return;
        }
        
        // 设置拖拽属性
        card.draggable = true;
        card.dataset.dragInitialized = 'true';
        
        // 拖拽开始
        card.addEventListener('dragstart', (e) => {
            console.log('拖拽开始:', card.dataset.name);
            this.draggedElement = card;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', card.outerHTML);
            
            // 添加拖拽激活状态到网格
            const grid = document.querySelector('.websites-grid');
            if (grid) {
                grid.classList.add('drag-active');
            }
            
            // 阻止其他事件和右键菜单
            e.stopPropagation();
            card.dataset.dragging = 'true';
        });

        // 拖拽结束
        card.addEventListener('dragend', (e) => {
            console.log('拖拽结束:', card.dataset.name);
            card.classList.remove('dragging');
            this.draggedElement = null;
            this.dragOverElement = null;
            
            // 移除所有拖拽状态
            document.querySelectorAll('.website-card').forEach(c => {
                c.classList.remove('drag-over');
                c.dataset.dragging = 'false';
            });
            
            const grid = document.querySelector('.websites-grid');
            if (grid) {
                grid.classList.remove('drag-active');
            }
            
            // 阻止其他事件
            e.stopPropagation();
        });

        // 拖拽进入
        card.addEventListener('dragenter', (e) => {
            e.preventDefault();
            if (card !== this.draggedElement) {
                card.classList.add('drag-over');
                this.dragOverElement = card;
            }
        });

        // 拖拽离开
        card.addEventListener('dragleave', (e) => {
            if (!card.contains(e.relatedTarget)) {
                card.classList.remove('drag-over');
            }
        });

        // 拖拽悬停
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        // 放置
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            
            if (this.draggedElement && this.draggedElement !== card) {
                this.swapElements(this.draggedElement, card);
                this.saveNewOrder();
            }
        });
    }

    swapElements(element1, element2) {
        const parent = element1.parentNode;
        const next1 = element1.nextSibling;
        const next2 = element2.nextSibling;
        
        parent.insertBefore(element1, next2);
        parent.insertBefore(element2, next1);
    }

    async saveNewOrder() {
        const cards = document.querySelectorAll('.website-card');
        const newOrder = Array.from(cards).map(card => {
            return card.getAttribute('data-name');
        });

        console.log('拖拽排序: 准备保存新顺序:', newOrder);

        try {
            const response = await fetch('/api/websites/reorder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ order: newOrder })
            });

            const result = await response.json();
            console.log('拖拽排序: API响应:', result);
            
            if (result.success) {
                Utils.showNotification('排序已保存', 'success');
            } else {
                Utils.showNotification('保存排序失败: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('保存排序失败:', error);
            Utils.showNotification('保存排序失败，请重试', 'error');
        }
    }

    observeNewCards() {
        // 使用MutationObserver监听新添加的卡片
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('website-card')) {
                            this.addDragListeners(node);
                        }
                        // 检查子节点
                        const cards = node.querySelectorAll && node.querySelectorAll('.website-card');
                        if (cards) {
                            cards.forEach(card => this.addDragListeners(card));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 数据加载管理类
class DataLoader {
    constructor() {
        this.websites = [];
    }

    async loadData() {
        try {
            console.log('开始加载网站数据...');
            const response = await fetch('/api/websites');
            
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('API响应:', result);
            
            if (result.success) {
                this.websites = result.data || [];
                console.log('加载到网站数据:', this.websites.length, '个网站');
                this.renderWebsites();
            } else {
                throw new Error(result.message || '数据加载失败');
            }
        } catch (error) {
            console.error('加载数据失败:', error);
            Utils.showNotification('加载数据失败: ' + error.message, 'error');
        }
    }

    renderWebsites() {
        const categoriesContainer = document.querySelector('.categories');
        categoriesContainer.innerHTML = '';

        // 创建单个网站网格容器
        const websitesContainer = document.createElement('div');
        websitesContainer.className = 'websites-grid';
        
        // 渲染所有网站到单个网格中
        this.websites.forEach(website => {
            const websiteCard = this.createWebsiteCard(website);
            websitesContainer.appendChild(websiteCard);
        });
        
        categoriesContainer.appendChild(websitesContainer);
        
        // 网站渲染完成后，重新初始化拖拽功能
        if (window.dragSortManager) {
            window.dragSortManager.setupDragAndDrop();
        }
    }

    createWebsiteCard(website) {
        const card = document.createElement('div');
        card.className = 'website-card';
        card.setAttribute('data-name', website.name);
        
        // 创建图标HTML，如果没有图片则使用默认图标
        const iconHtml = this.createIconHtml(website);
        
        card.innerHTML = `
            <div class="website-icon">
                ${iconHtml}
            </div>
            <div class="website-info">
                <h3 class="website-name">${website.name}</h3>
            </div>
            <div class="drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
        `;
        
        // 将链接数据存储到卡片上，用于点击时获取当前模式的URL
        card.setAttribute('data-intranet', website.intranet || '');
        card.setAttribute('data-ipv6', website.ipv6 || '');
        card.setAttribute('data-frp', website.frp || '');
        card.setAttribute('data-easytier', website.easytier || '');
        
        // 使整个卡片可点击
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // 获取当前访问模式
            const currentMode = document.getElementById('access-mode').value;
            const url = card.getAttribute(`data-${currentMode}`);
            
            if (url && url.trim() !== '') {
                window.open(url, '_blank');
            } else {
                console.warn(`网站 ${website.name} 的 ${currentMode} 模式URL未配置`);
            }
        });
        
        return card;
    }

    createIconHtml(website) {
        if (website.image && website.image.trim() !== '') {
            // 如果有图片，创建img元素并添加错误处理
            return `<img src="/images/${website.image}" alt="${website.name}" 
                        class="website-icon-image"
                        onerror="this.style.display='none'; this.nextElementSibling.classList.remove('default-icon-hidden');">
                    <div class="default-icon-inline default-icon-hidden">
                        ${website.name.charAt(0).toUpperCase()}
                    </div>`;
        } else {
            // 如果没有图片，直接显示默认图标
            return `<div class="default-icon-inline">
                        ${website.name.charAt(0).toUpperCase()}
                    </div>`;
        }
    }
}

// 右键菜单管理类
class ContextMenuManager {
    constructor(modalManager) {
        this.contextMenu = null;
        this.currentCard = null;
        this.modalManager = modalManager;
        this.init();
    }

    init() {
        this.createContextMenu();
    }

    createContextMenu() {
        this.contextMenu = document.createElement('div');
        this.contextMenu.className = 'context-menu';
        // 右键菜单样式已在CSS中定义
        
        this.contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="edit">
                <i class="fas fa-edit"></i>
                <span>修改站点信息</span>
            </div>
            <div class="context-menu-item" data-action="delete">
                <i class="fas fa-trash"></i>
                <span>删除站点</span>
            </div>
        `;
        
        document.body.appendChild(this.contextMenu);
        
        // 绑定菜单项点击事件
        this.contextMenu.addEventListener('click', (e) => {
            const action = e.target.closest('.context-menu-item')?.dataset.action;
            if (action) {
                this.handleMenuAction(action);
            }
        });
    }

    showContextMenu(event, card, name) {
        this.currentCard = card;
        this.hideContextMenu();
        
        const x = event.clientX;
        const y = event.clientY;
        
        this.contextMenu.style.display = 'block';
        this.contextMenu.style.left = x + 'px';
        this.contextMenu.style.top = y + 'px';
        
        // 确保菜单不超出屏幕边界
        const rect = this.contextMenu.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) {
            this.contextMenu.style.left = (x - rect.width) + 'px';
        }
        if (y + rect.height > window.innerHeight) {
            this.contextMenu.style.top = (y - rect.height) + 'px';
        }
    }

    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.style.display = 'none';
        }
    }

    handleMenuAction(action) {
        if (!this.currentCard) return;
        
        const websiteName = this.currentCard.querySelector('.website-name').textContent;
        
        switch (action) {
            case 'edit':
                this.editWebsite(this.currentCard);
                break;
            case 'delete':
                this.deleteWebsite(this.currentCard, websiteName);
                break;
        }
        
        this.hideContextMenu();
    }

    async editWebsite(card) {
        // 获取当前网站信息
        const name = card.querySelector('.website-name').textContent;
        
        try {
            // 从服务器获取完整的网站数据
            const response = await fetch('/api/websites');
            const result = await response.json();
            
            if (result.success && result.data) {
                const website = result.data.find(w => w.name === name);
                
                if (website) {
                    // 填充所有表单字段
                    document.getElementById('website-name').value = website.name || '';
                    document.getElementById('intranet-url').value = website.intranet || '';
                    document.getElementById('ipv6-url').value = website.ipv6 || '';
                    document.getElementById('frp-url').value = website.frp || '';
                    document.getElementById('easytier-url').value = website.easytier || '';
                    
                    // 如果有图片，显示图片预览
                    if (website.image && website.image.trim() !== '') {
                        const imagePreview = document.getElementById('image-preview');
                        imagePreview.innerHTML = `<img src="/images/${website.image}" alt="${website.name}">`;
                        
                        // 切换到URL上传标签并填充图片URL
                        this.modalManager.switchUploadTab('url');
                        document.getElementById('image-url').value = `/images/${website.image}`;
                    } else {
                        // 如果没有图片，清空图片预览
                        const imagePreview = document.getElementById('image-preview');
                        imagePreview.innerHTML = '';
                    }
                    
                    // 打开编辑弹窗
                    const modal = document.getElementById('add-website-modal');
                    modal.classList.add('show');
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    
                    // 修改弹窗标题
                    const modalTitle = modal.querySelector('h3');
                    modalTitle.textContent = '修改网站信息';
                    
                    // 修改保存按钮文本
                    const saveBtn = document.getElementById('save-btn');
                    saveBtn.textContent = '更新';
                    
                    // 存储当前编辑的卡片
                    modal.dataset.editingCard = 'true';
                    modal.dataset.cardName = name;
                    
                    Utils.showNotification('网站信息已加载', 'success');
                } else {
                    Utils.showNotification('未找到网站信息', 'error');
                }
            } else {
                Utils.showNotification('获取网站信息失败', 'error');
            }
        } catch (error) {
            console.error('获取网站信息失败:', error);
            Utils.showNotification('获取网站信息失败: ' + error.message, 'error');
        }
    }

    async deleteWebsite(card, name) {
        if (confirm(`确定要删除网站 "${name}" 吗？此操作不可撤销。`)) {
            try {
                const response = await fetch(`/api/websites/${encodeURIComponent(name)}`, { 
                    method: 'DELETE' 
                });
                
                const result = await response.json();
                
                if (result.success) {
                    card.remove();
                    Utils.showNotification(`网站 "${name}" 已删除`, 'success');
                } else {
                    Utils.showNotification(result.message || '删除失败', 'error');
                }
            } catch (error) {
                console.error('删除网站失败:', error);
                Utils.showNotification('删除失败，请重试', 'error');
            }
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，开始初始化...');
    
    // 声明全局变量
    let headerManager, modeManager, modalManager, contextMenuManager, dataLoader, dragSortManager, importExportManager;
    
    try {
        // 初始化Header管理器
        headerManager = new HeaderManager();
        console.log('Header管理器初始化完成');
        
        // 初始化访问模式管理器
        modeManager = new AccessModeManager();
        console.log('访问模式管理器初始化完成');
        
        // 初始化弹窗管理器
        modalManager = new ModalManager();
        console.log('弹窗管理器初始化完成');
        
        // 初始化右键菜单管理器
        contextMenuManager = new ContextMenuManager(modalManager);
        console.log('右键菜单管理器初始化完成');
        
        // 初始化数据加载器
        dataLoader = new DataLoader();
        console.log('数据加载器初始化完成');
        
        // 初始化拖拽排序管理器
        dragSortManager = new DragSortManager();
        window.dragSortManager = dragSortManager; // 设置为全局变量
        console.log('拖拽排序管理器初始化完成');
        
        // 初始化导入导出管理器
        importExportManager = new ImportExportManager();
        console.log('导入导出管理器初始化完成');
        
        // 加载数据
        dataLoader.loadData();
        console.log('数据加载完成');
        
        // 显示欢迎通知
        setTimeout(() => {
            Utils.showNotification('欢迎使用网址导航！', 'success');
        }, 1000);
        
        // 监听窗口大小变化，调整header状态
        window.addEventListener('resize', () => {
            if (headerManager) {
                if (window.innerWidth <= 768) {
                    // 移动端默认收起
                    if (headerManager.isExpanded) {
                        headerManager.collapse();
                    }
                } else {
                    // 桌面端默认展开
                    if (!headerManager.isExpanded) {
                        headerManager.expand();
                    }
                }
            }
        });
    } catch (error) {
        console.error('初始化过程中发生错误:', error);
        Utils.showNotification('初始化失败，请刷新页面重试', 'error');
    }
    
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        // ESC键关闭弹窗
        if (e.key === 'Escape') {
            const modal = document.getElementById('add-website-modal');
            if (modal.classList.contains('show')) {
                modalManager.close();
            }
        }
    });
    
    // 添加右键菜单功能
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.website-card')) {
            const card = e.target.closest('.website-card');
            // 如果正在拖拽，不显示右键菜单
            if (card.dataset.dragging === 'true') {
                return;
            }
            e.preventDefault();
            const name = card.querySelector('.website-name').textContent;
            contextMenuManager.showContextMenu(e, card, name);
        }
    });
    
    // 点击其他地方隐藏右键菜单
    document.addEventListener('click', () => {
        contextMenuManager.hideContextMenu();
    });
});

