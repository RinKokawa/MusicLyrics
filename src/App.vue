<script setup lang="ts">
import { ref } from 'vue'

const linkInput = ref('')
const selectedPlatform = ref('qishui')
const isLoading = ref(false)
const result = ref<any>(null)
const error = ref<string>('')

const platforms = [
  { value: 'netease', label: '网易云音乐', supported: true },
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
  
  // 验证链接格式
  const urlPattern = /^https?:\/\//i
  if (!urlPattern.test(linkInput.value.trim())) {
    error.value = '请输入有效的链接地址'
    return
  }
  
  isLoading.value = true
  error.value = ''
  result.value = null
  
  try {
    const response = await fetch('http://localhost:5000/api/parse-soda-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: linkInput.value.trim(),
        platform: selectedPlatform.value
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      result.value = data
      console.log('解析成功:', data)
    } else {
      error.value = data.error || '解析失败'
      console.error('解析失败:', data.error)
    }
  } catch (err) {
    error.value = '网络请求失败，请检查后端服务是否启动'
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
            placeholder="请输入音乐分享链接..."
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
                <span class="value">{{ Math.floor(result.song_info.duration / 60) }}:{{ String(result.song_info.duration % 60).padStart(2, '0') }}</span>
              </div>
            </div>
          </div>
          
          <!-- 歌词内容 -->
          <div v-if="result.lyrics" class="lyrics-content">
            <h4>歌词内容</h4>
            <div class="lyrics-text">
              {{ result.lyrics }}
            </div>
          </div>
        </div>

        <div class="tips">
          <p>💡 使用提示：</p>
          <ul>
            <li>支持网易云音乐和汽水音乐的分享链接</li>
            <li>QQ音乐功能正在开发中</li>
            <li>请复制音乐平台的分享链接到输入框</li>
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

.lyrics-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #333;
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
}
</style>
