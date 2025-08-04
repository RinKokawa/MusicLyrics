# MusicLyrics - 音乐歌词获取处理工具

[![Vue](https://img.shields.io/badge/Vue-3.4.21-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-30.0.1-47848f?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

一个基于 Vue 3 + TypeScript + Electron 开发的跨平台音乐歌词获取和处理工具，支持网易云音乐、QQ音乐等主流音乐平台的歌词获取、处理和导出功能。

## ✨ 主要功能

### 🎵 歌词获取
- **多平台支持**：支持网易云音乐、QQ音乐等主流音乐平台
- **智能搜索**：支持歌曲名、歌手名、专辑名等多种搜索方式
- **批量处理**：支持批量获取多首歌曲的歌词
- **实时同步**：获取最新版本的歌词数据

### 📝 歌词处理
- **多语言支持**：支持中文、英文、日文、韩文等多种语言歌词
- **翻译功能**：支持歌词翻译（中文↔英文、日文等）
- **拼音标注**：为中文歌词自动添加拼音标注
- **音译歌词**：支持外文歌曲的音译歌词生成
- **逐字歌词**：支持卡拉OK模式的逐字歌词同步

### 💾 导出格式
- **LRC格式**：标准歌词文件格式，支持时间轴同步
- **SRT格式**：字幕文件格式，兼容性强
- **自定义编码**：支持UTF-8、GBK等多种编码格式
- **自定义命名**：支持自定义文件名输出规则

### 🔧 高级功能
- **歌词编辑**：内置歌词编辑器，支持手动修改和调整
- **时间轴调整**：精确调整歌词显示时间
- **格式转换**：支持不同歌词格式之间的转换
- **批量导出**：支持批量导出处理后的歌词文件

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建应用
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📦 技术栈

- **前端框架**：Vue 3 + TypeScript
- **桌面应用**：Electron
- **构建工具**：Vite
- **开发语言**：TypeScript
- **UI组件**：Vue 3 Composition API

## 🎯 使用场景

- **音乐爱好者**：获取喜欢的歌曲歌词，制作歌词文件
- **卡拉OK用户**：生成带时间轴的歌词文件用于卡拉OK
- **字幕制作**：将歌词转换为SRT格式用于视频字幕
- **学习外语**：通过歌词学习外语，配合翻译功能
- **音乐教学**：为音乐教学准备歌词材料

## 🔍 搜索功能

- **精确搜索**：通过歌曲ID、歌手ID等精确信息搜索
- **模糊搜索**：支持关键词模糊匹配
- **批量搜索**：支持文件批量导入搜索
- **历史记录**：保存搜索历史，快速重复搜索

## 📁 文件管理

- **本地存储**：自动保存获取的歌词到本地
- **文件组织**：按歌手、专辑等分类组织文件
- **备份恢复**：支持歌词文件的备份和恢复
- **导入导出**：支持多种格式的歌词文件导入导出

## 🎨 界面特性

- **现代化UI**：采用现代化的用户界面设计
- **响应式布局**：适配不同屏幕尺寸
- **深色模式**：支持深色/浅色主题切换
- **多语言界面**：支持中文、英文界面语言

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

### 贡献方式
1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

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