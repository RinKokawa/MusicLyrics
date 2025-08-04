# MusicLyrics

[![Vue](https://img.shields.io/badge/Vue-3.4.21-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-30.0.1-47848f?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

一个简单的音乐歌词获取工具，支持从汽水音乐等平台获取歌词。

## 功能特性

- 🎵 支持汽水音乐链接解析
- 📝 自动提取歌词内容
- ⚡ 简单易用，无需复杂服务器
- 🖥️ 支持命令行工具（推荐）
- 🖥️ 提供Electron桌面应用

## 快速开始

### 安装依赖

```bash
npm install
```

### 命令行使用（推荐）

最简单的使用方式，直接解析汽水音乐链接：

```bash
# 使用简单脚本
node scripts/simple-parser.js https://qishui.douyin.com/s/imQw1YUw/

# 或者使用npm脚本
npm run simple https://qishui.douyin.com/s/imQw1YUw/
```

### Electron桌面应用

启动Electron桌面应用：

```bash
# 开发模式
npm run electron:dev

# 或者构建后运行
npm run build
npm run electron
```



## 使用示例

### 命令行输出示例

```bash
$ node scripts/simple-parser.js https://qishui.douyin.com/s/imQw1YUw/

🎵 正在解析汽水音乐链接...
📝 链接: https://qishui.douyin.com/s/imQw1YUw/

✅ 解析成功！

📋 歌曲信息:
   歌曲名: 矛盾
   艺术家: z²
   时长: 2:37

🎵 歌词内容:
──────────────────────────────────────────────────
君以外じゃ 叶わない思い
君以外の 恋は知らない
...
──────────────────────────────────────────────────

📊 共 30 行歌词
```

## 项目结构

```
MusicLyrics/
├── scripts/simple-parser.js      # 简单的命令行解析工具（推荐）
├── scripts/lyrics-parser.js      # 歌词解析核心逻辑
├── electron/             # Electron主进程和预加载脚本
├── src/                  # Vue渲染进程源码
└── package.json          # 项目配置
```

## 为什么选择简单方案？

你说得对！一个简单的POST请求确实不需要启动一个完整的服务器。

### 🎯 推荐方案：命令行工具
- **简单直接**：一个脚本文件，无需服务器
- **快速响应**：直接处理，无网络延迟
- **易于使用**：复制链接，运行脚本，获得结果
- **无依赖**：只需要Node.js和node-fetch

### 🖥️ Electron桌面应用
- **原生体验**：桌面应用，无需浏览器
- **IPC通信**：渲染进程通过IPC调用主进程
- **直接调用**：主进程直接调用Node.js脚本，无需HTTP服务器

## 技术栈

- **核心**: Node.js + node-fetch
- **桌面**: Electron + Vue 3 + TypeScript

## 许可证

MIT License 