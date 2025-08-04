#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 开始打包 MusicLyrics 应用...\n');

// 检查必要文件是否存在
function checkRequiredFiles() {
  const requiredFiles = [
    'server.py',
    'requirements.txt',
    'package.json',
    'electron-builder.json5'
  ];
  
  const missingFiles = [];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    throw new Error(`缺少必要文件: ${missingFiles.join(', ')}`);
  }
  
  console.log('✅ 必要文件检查通过');
}

// 清理之前的构建
function cleanBuild() {
  return new Promise((resolve, reject) => {
    console.log('🧹 清理之前的构建文件...');
    
    const cleanProcess = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      shell: true
    });
    
    cleanProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ 构建完成');
        resolve();
      } else {
        reject(new Error(`构建失败，退出码: ${code}`));
      }
    });
    
    cleanProcess.on('error', (error) => {
      reject(new Error(`构建过程错误: ${error.message}`));
    });
  });
}

// 执行打包
function buildApp(platform = 'win') {
  return new Promise((resolve, reject) => {
    console.log(`📦 开始打包 ${platform} 版本...`);
    
    const buildCommand = platform === 'win' ? 'build:win' : 
                        platform === 'mac' ? 'build:mac' : 
                        platform === 'linux' ? 'build:linux' : 'build';
    
    const buildProcess = spawn('npm', ['run', buildCommand], {
      stdio: 'inherit',
      shell: true
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${platform} 版本打包完成！`);
        resolve();
      } else {
        reject(new Error(`${platform} 版本打包失败，退出码: ${code}`));
      }
    });
    
    buildProcess.on('error', (error) => {
      reject(new Error(`打包过程错误: ${error.message}`));
    });
  });
}

// 主函数
async function main() {
  try {
    // 获取命令行参数
    const args = process.argv.slice(2);
    const platform = args[0] || 'win'; // 默认打包 Windows 版本
    
    console.log(`目标平台: ${platform}`);
    console.log('');
    
    // 检查必要文件
    checkRequiredFiles();
    
    // 执行打包
    await buildApp(platform);
    
    console.log('\n🎉 打包完成！');
    console.log('📁 可执行文件位于 release 目录中');
    console.log('💡 用户可以直接双击运行，无需安装开发环境');
    
  } catch (error) {
    console.error(`❌ 打包失败: ${error.message}`);
    process.exit(1);
  }
}

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n👋 正在退出...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 正在退出...');
  process.exit(0);
});

// 启动打包
main(); 