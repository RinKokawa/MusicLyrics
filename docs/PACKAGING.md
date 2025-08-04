# MusicLyrics 应用打包指南

## 概述

本指南将帮助你将 MusicLyrics 应用打包成可执行文件，让普通用户无需安装开发环境即可直接运行。

## 打包前准备

### 1. 确保依赖已安装
```bash
npm install
```

### 2. 检查必要文件
确保以下文件存在于项目根目录：
- `server.py` - Python 后端服务器
- `requirements.txt` - Python 依赖文件
- `package.json` - Node.js 项目配置
- `electron-builder.json5` - Electron 打包配置

## 打包命令

### Windows 版本（推荐）
```bash
npm run package:win
```

### macOS 版本
```bash
npm run package:mac
```

### Linux 版本
```bash
npm run package:linux
```

### 通用打包（自动检测平台）
```bash
npm run package
```

## 打包过程

1. **文件检查** - 验证必要文件是否存在
2. **构建前端** - 编译 Vue 应用
3. **构建 Electron** - 编译主进程和预加载脚本
4. **打包应用** - 使用 electron-builder 创建可执行文件

## 输出文件

打包完成后，可执行文件将位于 `release/` 目录中：

### Windows
- `MusicLyrics-Windows-1.0.0-Setup.exe` - 安装程序
- `MusicLyrics-Windows-1.0.0.exe` - 便携版（无需安装）

### macOS
- `MusicLyrics-Mac-1.0.0-Installer.dmg` - DMG 安装包

### Linux
- `MusicLyrics-Linux-1.0.0.AppImage` - AppImage 文件

## 用户使用说明

### Windows 用户
1. 下载 `MusicLyrics-Windows-1.0.0-Setup.exe`
2. 双击运行安装程序
3. 按照提示完成安装
4. 从开始菜单或桌面快捷方式启动应用

### macOS 用户
1. 下载 `MusicLyrics-Mac-1.0.0-Installer.dmg`
2. 双击打开 DMG 文件
3. 将应用拖拽到 Applications 文件夹
4. 从 Applications 文件夹启动应用

### Linux 用户
1. 下载 `MusicLyrics-Linux-1.0.0.AppImage`
2. 给文件添加执行权限：`chmod +x MusicLyrics-Linux-1.0.0.AppImage`
3. 双击运行或通过终端启动

## 注意事项

### Python 环境要求
- 用户系统需要安装 Python 3.7 或更高版本
- 应用首次运行时会自动安装 Python 依赖
- 确保用户有网络连接以下载 Python 包

### 系统要求
- **Windows**: Windows 10 或更高版本
- **macOS**: macOS 10.14 或更高版本
- **Linux**: 支持 AppImage 的 Linux 发行版

### 文件大小
打包后的应用文件较大（约 100-200MB），这是正常的，因为包含了：
- Electron 运行时
- Python 解释器（部分系统）
- 应用代码和资源
- Python 依赖包

## 故障排除

### 打包失败
1. 确保所有依赖已正确安装
2. 检查 Node.js 和 npm 版本
3. 清理 `node_modules` 并重新安装依赖

### 运行时错误
1. 确保用户系统已安装 Python
2. 检查防火墙设置，确保应用可以访问网络
3. 查看应用日志获取详细错误信息

## 开发模式

如果你需要在开发模式下测试应用：
```bash
npm start
```

这将启动开发服务器和 Electron 应用，适合开发和调试。

## 更新应用

要更新应用版本：
1. 修改 `package.json` 中的 `version` 字段
2. 重新运行打包命令
3. 分发新的可执行文件

---

如有问题，请查看项目文档或提交 Issue。 