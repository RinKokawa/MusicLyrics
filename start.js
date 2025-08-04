#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎵 启动 MusicLyrics 应用...\n');

// 检查Python是否安装
function checkPython() {
  return new Promise((resolve, reject) => {
    const pythonCheck = spawn('python', ['--version'], { stdio: 'pipe' });
    
    pythonCheck.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Python 环境检查通过');
        resolve();
      } else {
        reject(new Error('Python 未安装或不在 PATH 中'));
      }
    });
    
    pythonCheck.on('error', () => {
      reject(new Error('Python 未安装或不在 PATH 中'));
    });
  });
}

// 安装Python依赖
function installPythonDeps() {
  return new Promise((resolve, reject) => {
    console.log('📦 检查并安装 Python 依赖...');
    
    const pipInstall = spawn('pip', ['install', '-r', 'requirements.txt'], {
      stdio: 'inherit'
    });
    
    pipInstall.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Python 依赖安装完成\n');
        resolve();
      } else {
        reject(new Error(`Python 依赖安装失败，退出码: ${code}`));
      }
    });
    
    pipInstall.on('error', (error) => {
      reject(new Error(`安装过程错误: ${error.message}`));
    });
  });
}

// 启动Electron应用（包含开发服务器）
function startElectron() {
  console.log('🖥️  启动 Electron 应用...\n');
  
  const electron = spawn('npm', ['run', 'electron:dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  electron.on('close', (code) => {
    console.log(`\n👋 应用已退出，退出码: ${code}`);
    process.exit(code);
  });
  
  electron.on('error', (error) => {
    console.error(`❌ Electron 启动失败: ${error.message}`);
    process.exit(1);
  });
}

// 主函数
async function main() {
  try {
    await checkPython();
    await installPythonDeps();
    // 直接启动Electron，它会自动处理开发服务器
    startElectron();
  } catch (error) {
    console.error(`❌ 启动失败: ${error.message}`);
    console.log('\n💡 请确保已安装 Python 3.7+ 和 Node.js 16+');
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

// 启动应用
main(); 