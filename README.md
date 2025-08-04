# MusicLyrics

[![Vue](https://img.shields.io/badge/Vue-3.4.21-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-30.0.1-47848f?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

一个基于 Vue 3 + TypeScript + Electron 开发的跨平台音乐歌词获取和处理工具，支持网易云音乐、QQ音乐等主流音乐平台的歌词获取、处理和导出功能。

## 主要功能
- 🎵 支持汽水音乐分享链接解析
- 🎵 支持网易云音乐分享链接解析（开发中）
- 🎵 自动提取歌曲信息和歌词内容
- 🎵 简洁美观的用户界面
- 🎵 实时错误提示和结果展示

## 支持的平台

- ✅ 汽水音乐 (qishui.douyin.com)
- 🚧 网易云音乐 (开发中)
- 🚧 QQ音乐 (开发中)

## 快速开始

### 环境要求
- Python 3.7+
- Node.js 16+
- npm 或 yarn

### 安装依赖

1. 安装Node.js依赖：
   ```bash
   npm install
   ```

2. 安装Python依赖：
   ```bash
   pip install -r requirements.txt
   ```

### 启动应用

#### 一键启动（推荐）
```bash
npm start
```

#### 分步启动
1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 启动Electron应用：
   ```bash
   npm run electron:dev
   ```

#### 生产模式
```bash
npm run build
```

### 独立运行Python服务器（可选）
如果需要单独运行Python后端服务进行调试：
```bash
python server.py --standalone
```

### 测试API连接
```bash
npm run test-api
```

## 使用方法

1. 选择音乐平台（目前支持汽水音乐）
2. 复制音乐分享链接到输入框
3. 点击"获取歌词"按钮
4. 查看解析结果，包括歌曲信息和歌词内容

## 示例链接

汽水音乐分享链接格式：
```
《矛盾》@汽水音乐 https://qishui.douyin.com/s/imQw1YUw/
```

## 技术栈

### 前端
- Vue 3
- TypeScript
- Vite
- Electron

### 后端
- Python 3.7+
- Flask
- Requests

## API接口

### 解析汽水音乐链接
- **URL**: `POST /api/parse-soda-link`
- **请求体**:
  ```json
  {
    "url": "https://qishui.douyin.com/s/xxx/",
    "platform": "qishui"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "lyrics": "歌词内容...",
    "lyrics_with_timing": [...],
    "song_info": {
      "track_name": "歌曲名",
      "artist_name": "艺术家",
      "duration": 180
    }
  }
  ```

## 开发说明

### 项目结构
```
MusicLyrics/
├── src/                 # Vue前端源码
│   └── App.vue         # 主应用组件
├── server.py           # Python后端服务
├── requirements.txt    # Python依赖
├── start.bat          # 启动脚本
└── README.md          # 说明文档
```

### 添加新平台支持

1. 在 `server.py` 中添加新的解析函数
2. 在 `src/App.vue` 中更新平台列表
3. 添加相应的API端点

## 注意事项

- 确保网络连接正常
- 汽水音乐链接需要是公开可访问的
- 后端服务默认运行在 5000 端口
- 前端应用默认运行在 5173 端口

## 🙏 致谢

本项目参考了以下开源项目：
- [163MusicLyrics](https://github.com/jitwxs/163MusicLyrics) - 网易云音乐歌词获取工具
- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) - 网易云音乐API
- [QQMusicApi](https://github.com/jsososo/QQMusicApi) - QQ音乐API

## 📞 联系方式

- 项目主页：[GitHub Repository](https://github.com/your-username/MusicLyrics)
- 问题反馈：[Issues](https://github.com/your-username/MusicLyrics/issues)
- 功能建议：[Discussions](https://github.com/your-username/MusicLyrics/discussions)

---

⭐ 如果这个项目对您有帮助，请给我一个 Star！ 