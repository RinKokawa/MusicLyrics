<script setup lang="ts">
import { ref } from 'vue'

const linkInput = ref('')
const selectedPlatform = ref('qishui')
const isLoading = ref(false)

const platforms = [
  { value: 'netease', label: '网易云音乐', supported: true },
  { value: 'qq', label: 'QQ音乐', supported: false },
  { value: 'qishui', label: '汽水音乐', supported: true }
]

const handleProcessLink = () => {
  if (!linkInput.value.trim()) {
    alert('请输入音乐链接')
    return
  }
  
  const selectedPlatformData = platforms.find(p => p.value === selectedPlatform.value)
  if (!selectedPlatformData?.supported) {
    alert('该平台暂不支持，请选择其他平台')
    return
  }
  
  // 验证链接格式
  const urlPattern = /^https?:\/\//i
  if (!urlPattern.test(linkInput.value.trim())) {
    alert('请输入有效的链接地址')
    return
  }
  
  isLoading.value = true
  console.log('处理链接:', linkInput.value, '平台:', selectedPlatform.value)
  
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleProcessLink()
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
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.search-box {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 450px;
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
}
</style>
