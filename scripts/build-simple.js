#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🚀 开始构建 MusicLyrics...');

try {
  // 1. 运行 TypeScript 类型检查
  console.log('📝 运行 TypeScript 类型检查...');
  execSync('vue-tsc', { stdio: 'inherit' });
  
  // 2. 构建 Vue 应用
  console.log('🔨 构建 Vue 应用...');
  execSync('vite build', { stdio: 'inherit' });
  
  // 3. 构建 Electron 主进程
  console.log('⚡ 构建 Electron 主进程...');
  execSync('vite build --config vite.config.ts', { stdio: 'inherit' });
  
  // 4. 复制必要的文件到 dist 目录
  console.log('📁 复制必要文件...');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.join(__dirname, '..', 'dist');
  const simpleParserPath = path.join(__dirname, '..', 'simple-parser.js');
  const scriptsDir = path.join(__dirname, '..', 'scripts');
  
  if (fs.existsSync(simpleParserPath)) {
    console.log('📄 复制 simple-parser.js...');
    fs.copyFileSync(simpleParserPath, path.join(distDir, 'simple-parser.js'));
  } else {
    console.log('⚠️  simple-parser.js 不存在，跳过复制');
  }
  
  if (fs.existsSync(scriptsDir)) {
    console.log('📁 复制 scripts 目录...');
    const scriptsDestDir = path.join(distDir, 'scripts');
    if (!fs.existsSync(scriptsDestDir)) {
      fs.mkdirSync(scriptsDestDir, { recursive: true });
    }
    // 复制 scripts 目录内容
    const scriptsFiles = fs.readdirSync(scriptsDir);
    scriptsFiles.forEach(file => {
      const srcPath = path.join(scriptsDir, file);
      const destPath = path.join(scriptsDestDir, file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  } else {
    console.log('⚠️  scripts 目录不存在，跳过复制');
  }
  
  console.log('✅ 构建完成！');
  console.log('📂 构建输出目录: dist/');
  console.log('🎵 可以运行: npm run electron:dev 来测试应用');
  
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
} 