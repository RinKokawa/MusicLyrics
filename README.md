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

## 许可证

MIT License 