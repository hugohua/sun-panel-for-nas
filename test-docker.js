#!/usr/bin/env node

/**
 * Docker 配置测试脚本
 * 用于验证Docker配置是否正确
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 检查 Docker 配置文件...\n');

// 检查必需文件
const requiredFiles = [
    'Dockerfile',
    'docker-compose.yml',
    '.dockerignore',
    'package.json',
    'server.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} - 存在`);
    } else {
        console.log(`❌ ${file} - 缺失`);
        allFilesExist = false;
    }
});

console.log('\n📋 检查 Dockerfile 内容...');

// 检查Dockerfile内容
if (fs.existsSync('Dockerfile')) {
    const dockerfileContent = fs.readFileSync('Dockerfile', 'utf8');
    
    const requiredLines = [
        'FROM node:',
        'WORKDIR /app',
        'COPY package',
        'RUN npm',
        'EXPOSE 3000',
        'CMD ['
    ];
    
    requiredLines.forEach(line => {
        if (dockerfileContent.includes(line)) {
            console.log(`✅ Dockerfile 包含: ${line}`);
        } else {
            console.log(`❌ Dockerfile 缺少: ${line}`);
        }
    });
}

console.log('\n📋 检查 docker-compose.yml 内容...');

// 检查docker-compose.yml内容
if (fs.existsSync('docker-compose.yml')) {
    const composeContent = fs.readFileSync('docker-compose.yml', 'utf8');
    
    const requiredSections = [
        'version:',
        'services:',
        'ports:',
        'volumes:',
        'restart:'
    ];
    
    requiredSections.forEach(section => {
        if (composeContent.includes(section)) {
            console.log(`✅ docker-compose.yml 包含: ${section}`);
        } else {
            console.log(`❌ docker-compose.yml 缺少: ${section}`);
        }
    });
}

console.log('\n📋 检查 .dockerignore 内容...');

// 检查.dockerignore内容
if (fs.existsSync('.dockerignore')) {
    const ignoreContent = fs.readFileSync('.dockerignore', 'utf8');
    
    const importantIgnores = [
        'node_modules',
        '.git',
        '*.log',
        'Dockerfile',
        '.dockerignore'
    ];
    
    importantIgnores.forEach(ignore => {
        if (ignoreContent.includes(ignore)) {
            console.log(`✅ .dockerignore 包含: ${ignore}`);
        } else {
            console.log(`❌ .dockerignore 缺少: ${ignore}`);
        }
    });
}

console.log('\n📋 检查 package.json...');

// 检查package.json
if (fs.existsSync('package.json')) {
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        console.log(`✅ 项目名称: ${packageJson.name}`);
        console.log(`✅ 版本: ${packageJson.version}`);
        console.log(`✅ 主入口: ${packageJson.main}`);
        
        if (packageJson.dependencies) {
            console.log(`✅ 依赖数量: ${Object.keys(packageJson.dependencies).length}`);
        }
        
        if (packageJson.engines && packageJson.engines.node) {
            console.log(`✅ Node.js 版本要求: ${packageJson.engines.node}`);
        }
    } catch (error) {
        console.log(`❌ package.json 解析错误: ${error.message}`);
    }
}

console.log('\n🎯 Docker 配置检查完成！');

if (allFilesExist) {
    console.log('\n✅ 所有必需文件都存在，可以开始构建 Docker 镜像');
    console.log('\n🚀 运行以下命令开始部署:');
    console.log('   Linux/Mac: ./docker-start.sh');
    console.log('   Windows:   docker-start.bat');
    console.log('   或手动:    docker-compose up -d');
} else {
    console.log('\n❌ 缺少必需文件，请检查项目结构');
}

console.log('\n📖 详细部署说明请参考: DOCKER_DEPLOYMENT.md');
