<script setup lang="ts">
import { ref } from 'vue'

const linkInput = ref('')
const selectedPlatform = ref('qishui')
const isLoading = ref(false)
const result = ref<any>(null)
const error = ref<string>('')
const displayFormat = ref('plain') // 'plain' | 'timestamp'
const downloadFormat = ref('srt') // 'srt' | 'lrc' | 'json'

const platforms = [
  { value: 'netease', label: '网易云音乐', supported: false },
  { value: 'qq', label: 'QQ音乐', supported: false },
  { value: 'qishui', label: '汽水音乐', supported: true }
]

const handleProcessLink = async () => {
  if (!linkInput.value.trim()) {
    error.value = '请输入音乐链接'
    return
  }
  
  const selectedPlatformData = platforms.find(p => p.value === selectedPlatform.value)
  if (!selectedPlatformData?.supported) {
    error.value = '该平台暂不支持，请选择其他平台'
    return
  }
  
  // 智能提取汽水音乐链接
  let processUrl = linkInput.value.trim()
  if (selectedPlatform.value === 'qishui') {
    const linkPattern = /https?:\/\/qishui\.douyin\.com\/s\/[a-zA-Z0-9]+\/?/
    const match = linkInput.value.match(linkPattern)
    if (match) {
      processUrl = match[0]
      console.log('🔗 从文本中提取到链接:', processUrl)
    } else if (!linkInput.value.includes('qishui.douyin.com')) {
      error.value = '未找到有效的汽水音乐分享链接'
      return
    }
  } else {
    // 其他平台的基本URL验证
    const urlPattern = /^https?:\/\//i
    if (!urlPattern.test(processUrl)) {
      error.value = '请输入有效的链接地址'
      return
    }
  }
  
  isLoading.value = true
  error.value = ''
  result.value = null
  
  try {
    // 通过IPC调用主进程的歌词解析功能
    const data = await (window as any).ipcRenderer.invoke('parse-lyrics', processUrl)
    
    if (data.success) {
      result.value = data
      console.log('解析成功:', data)
    } else {
      error.value = data.error || '解析失败'
      console.error('解析失败:', data.error)
    }
  } catch (err) {
    error.value = `解析失败: ${err instanceof Error ? err.message : '未知错误'}`
    console.error('请求失败:', err)
  } finally {
    isLoading.value = false
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleProcessLink()
  }
}

const clearResult = () => {
  result.value = null
  error.value = ''
}

// 格式化时间戳为 SRT 格式 (00:00:00,000)
const formatSRTTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`
}

// 格式化时间戳为 LRC 格式 [00:00.00]
const formatLRCTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(2)
  
  return `[${minutes.toString().padStart(2, '0')}:${secs.padStart(5, '0')}]`
}

// 生成带时间戳的歌词显示
const getTimestampLyrics = (): string => {
  // 首先检查是否有 lyrics_with_timing 数据
  if (result.value?.lyrics_with_timing && Array.isArray(result.value.lyrics_with_timing)) {
    return result.value.lyrics_with_timing
      .map((line: any) => {
        // 支持两种时间戳格式：毫秒(startMs)和秒(startTime)
        const startTime = line.startMs ? line.startMs / 1000 : (line.startTime || 0)
        return `${formatLRCTime(startTime)} ${line.text}`
      })
      .join('\n')
  }
  
  // 如果没有 lyrics_with_timing，尝试从原始歌词数据中获取
  if (result.value?.lyrics?.sentences && Array.isArray(result.value.lyrics.sentences)) {
    const filteredSentences = result.value.lyrics.sentences.filter((line: any) => line.text && line.text.trim())
    
    return filteredSentences
      .map((line: any) => {
        const startTime = line.startMs ? line.startMs / 1000 : 0
        return `${formatLRCTime(startTime)} ${line.text}`
      })
      .join('\n')
  }
  
  // 如果都没有，返回提示信息
  return '暂无时间戳数据'
}

// 获取歌词数据（统一处理函数）
const getLyricsData = () => {
  // 优先使用 lyrics_with_timing
  if (result.value?.lyrics_with_timing && Array.isArray(result.value.lyrics_with_timing)) {
    return result.value.lyrics_with_timing
  }
  
  // 如果没有，使用原始歌词数据
  if (result.value?.lyrics?.sentences && Array.isArray(result.value.lyrics.sentences)) {
    return result.value.lyrics.sentences.filter((line: any) => line.text && line.text.trim())
  }
  
  return []
}

// 生成 SRT 格式内容
const generateSRT = (): string => {
  const lyricsData = getLyricsData()
  if (lyricsData.length === 0) return ''
  
  return lyricsData
    .map((line: any, index: number) => {
      // 支持两种时间戳格式：毫秒(startMs/endMs)和秒(startTime/endTime)
      const startTime = line.startMs ? line.startMs / 1000 : (line.startTime || 0)
      const endTime = line.endMs ? line.endMs / 1000 : (line.endTime || startTime + 3) // 默认3秒持续时间
      
      const startTimeStr = formatSRTTime(startTime)
      const endTimeStr = formatSRTTime(endTime)
      return `${index + 1}\n${startTimeStr} --> ${endTimeStr}\n${line.text}\n`
    })
    .join('\n')
}

// 生成 LRC 格式内容
const generateLRC = (): string => {
  const lyricsData = getLyricsData()
  if (lyricsData.length === 0) return ''
  
  let lrcContent = ''
  
  // 添加歌曲信息
  if (result.value.song_info) {
    lrcContent += `[ti:${result.value.song_info.track_name || ''}]\n`
    lrcContent += `[ar:${result.value.song_info.artist_name || ''}]\n`
    if (result.value.song_info.album?.name) {
      lrcContent += `[al:${result.value.song_info.album.name}]\n`
    }
    lrcContent += `[by:MusicLyrics]\n\n`
  }
  
  // 添加歌词内容
  lrcContent += lyricsData
    .map((line: any) => {
      // 支持两种时间戳格式：毫秒(startMs)和秒(startTime)
      const startTime = line.startMs ? line.startMs / 1000 : (line.startTime || 0)
      return `${formatLRCTime(startTime)}${line.text}`
    })
    .join('\n')
  
  return lrcContent
}

// 生成 JSON 格式内容
const generateJSON = (): string => {
  if (!result.value) return ''
  
  const lyricsData = getLyricsData()
  
  const jsonData = {
    song_info: result.value.song_info,
    lyrics: {
      plain_text: result.value.lyrics,
      with_timing: lyricsData.length > 0 ? lyricsData : result.value.lyrics_with_timing,
      raw_data: result.value.lyrics // 保留原始数据结构
    },
    source: result.value.source,
    export_time: new Date().toISOString()
  }
  
  return JSON.stringify(jsonData, null, 2)
}

// 下载文件
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 处理下载
const handleDownload = () => {
  if (!result.value) return
  
  const songName = result.value.song_info?.track_name || 'lyrics'
  const artistName = result.value.song_info?.artist_name || 'unknown'
  const baseFilename = `${songName} - ${artistName}`.replace(/[<>:"/\\|?*]/g, '_')
  
  let content = ''
  let filename = ''
  let mimeType = 'text/plain'
  
  switch (downloadFormat.value) {
    case 'srt':
      content = generateSRT()
      filename = `${baseFilename}.srt`
      mimeType = 'text/srt'
      break
    case 'lrc':
      content = generateLRC()
      filename = `${baseFilename}.lrc`
      mimeType = 'text/lrc'
      break
    case 'json':
      content = generateJSON()
      filename = `${baseFilename}.json`
      mimeType = 'application/json'
      break
  }
  
  if (content) {
    downloadFile(content, filename, mimeType)
  }
}
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>MusicLyrics</h1>
      <p>音乐歌词获取处理工具</p>
    </header>

    <main class="main">
      <div class="search-box">
        <h2>获取歌词</h2>
        
        <div class="platform-select">
          <label>选择平台：</label>
          <select 
            v-model="selectedPlatform" 
            class="platform-dropdown"
            :disabled="isLoading"
          >
            <option 
              v-for="platform in platforms" 
              :key="platform.value" 
              :value="platform.value"
              :disabled="!platform.supported"
            >
              {{ platform.label }}{{ !platform.supported ? ' (暂不支持)' : '' }}
            </option>
          </select>
        </div>

        <div class="search-input-group">
          <input
            v-model="linkInput"
            type="text"
            class="search-input"
            placeholder="请输入音乐分享链接或包含链接的分享文本..."
            @keypress="handleKeyPress"
            :disabled="isLoading"
          />
          <button
            class="search-btn"
            @click="handleProcessLink"
            :disabled="isLoading || !linkInput.trim()"
          >
            {{ isLoading ? '处理中...' : '获取歌词' }}
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          <p>❌ {{ error }}</p>
        </div>

        <!-- 结果显示 -->
        <div v-if="result" class="result-container">
          <div class="result-header">
            <h3>解析结果</h3>
            <button @click="clearResult" class="clear-btn">清除</button>
          </div>
          
          <!-- 歌曲信息 -->
          <div v-if="result.song_info" class="song-info">
            <h4>歌曲信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">歌曲名：</span>
                <span class="value">{{ result.song_info.track_name || '未知' }}</span>
              </div>
              <div class="info-item">
                <span class="label">艺术家：</span>
                <span class="value">{{ result.song_info.artist_name || '未知' }}</span>
              </div>
              <div v-if="result.song_info.duration" class="info-item">
                <span class="label">时长：</span>
                <span class="value">{{ result.song_info.duration }}</span>
              </div>
            </div>
          </div>
          
          <!-- 歌词内容 -->
          <div v-if="result.lyrics" class="lyrics-content">
            <div class="lyrics-header">
              <h4>歌词内容</h4>
              <div class="lyrics-controls">
                <div class="display-format">
                  <label>显示格式：</label>
                  <select v-model="displayFormat" class="format-select">
                    <option value="plain">纯文本</option>
                    <option value="timestamp">带时间戳</option>
                  </select>
                </div>
                <div class="download-section">
                  <select v-model="downloadFormat" class="format-select">
                    <option value="srt">SRT字幕</option>
                    <option value="lrc">LRC歌词</option>
                    <option value="json">JSON数据</option>
                  </select>
                  <button @click="handleDownload" class="download-btn">下载</button>
                </div>
              </div>
            </div>
            <div class="lyrics-text">
              {{ displayFormat === 'timestamp' ? getTimestampLyrics() : result.lyrics }}
            </div>
          </div>
        </div>

        <div class="tips">
          <p>💡 使用提示：</p>
          <ul>
            <li>支持汽水音乐的分享链接</li>
            <li>支持直接粘贴完整的分享文本（如：《歌名》@汽水音乐 链接）</li>
            <li>程序会自动从分享文本中提取链接</li>
            <li>支持歌曲、专辑、歌单等链接</li>
            <li>按回车键快速处理</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  background: #333;
  color: white;
  text-align: center;
  padding: 1rem 0;
}

.header h1 {
  margin: 0 0 0.2rem 0;
  font-size: 1.4rem;
}

.header p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.8rem;
}

.main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.search-box {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 600px;
  width: 100%;
}

.search-box h2 {
  margin: 0 0 1rem 0;
  text-align: center;
  color: #333;
  font-size: 1.25rem;
}

.platform-select {
  margin-bottom: 1rem;
}

.platform-select label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.platform-dropdown {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
}

.platform-dropdown:focus {
  outline: none;
  border-color: #007bff;
}

.platform-dropdown:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.platform-dropdown option:disabled {
  color: #999;
  font-style: italic;
}

.search-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-btn {
  padding: 0.6rem 1.2rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.search-btn:hover:not(:disabled) {
  background: #0056b3;
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.error-message p {
  margin: 0;
  color: #721c24;
  font-size: 0.85rem;
}

.result-container {
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.result-header {
  background: #f8f9fa;
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.clear-btn {
  padding: 0.3rem 0.6rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
}

.clear-btn:hover {
  background: #5a6268;
}

.song-info {
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
}

.song-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #333;
}

.info-grid {
  display: grid;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item .label {
  font-weight: 500;
  font-size: 0.8rem;
  color: #666;
  min-width: 60px;
}

.info-item .value {
  font-size: 0.8rem;
  color: #333;
}

.lyrics-content {
  padding: 0.75rem;
}

.lyrics-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.lyrics-header h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}

.lyrics-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.display-format,
.download-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.display-format label {
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
}

.format-select {
  padding: 0.3rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.8rem;
  background-color: white;
  cursor: pointer;
}

.format-select:focus {
  outline: none;
  border-color: #007bff;
}

.download-btn {
  padding: 0.3rem 0.8rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
  white-space: nowrap;
}

.download-btn:hover {
  background: #218838;
}

.download-btn:active {
  background: #1e7e34;
}

.lyrics-text {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 3px;
  padding: 0.75rem;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #333;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}

.tips {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 0.75rem;
}

.tips p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  font-size: 0.85rem;
}

.tips ul {
  margin: 0;
  padding-left: 1rem;
  color: #666;
  font-size: 0.8rem;
}

.tips li {
  margin-bottom: 0.2rem;
}

@media (max-width: 768px) {
  .search-input-group {
    flex-direction: column;
  }
  
  .header {
    padding: 0.8rem 0;
  }
  
  .header h1 {
    font-size: 1.2rem;
  }
  
  .main {
    padding: 1rem;
  }
  
  .search-box {
    padding: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .lyrics-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .lyrics-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .display-format,
  .download-section {
    flex: 1;
    min-width: 0;
  }
  
  .format-select {
    flex: 1;
    min-width: 80px;
  }
  
  .download-btn {
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .lyrics-controls {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .display-format,
  .download-section {
    width: 100%;
    justify-content: space-between;
  }
  
  .format-select {
    min-width: 120px;
  }
}
</style> 