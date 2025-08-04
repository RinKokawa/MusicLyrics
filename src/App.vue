<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const searchType = ref('song')
const isLoading = ref(false)

const searchTypes = [
  { value: 'song', label: '歌曲名' },
  { value: 'artist', label: '歌手名' },
  { value: 'album', label: '专辑名' }
]

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    alert('请输入搜索内容')
    return
  }
  
  isLoading.value = true
  console.log('搜索:', searchQuery.value, '类型:', searchType.value)
  
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
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
        <h2>搜索歌词</h2>
        
        <div class="search-type">
          <label>搜索类型：</label>
          <div class="type-buttons">
            <button
              v-for="type in searchTypes"
              :key="type.value"
              :class="['type-btn', { active: searchType === type.value }]"
              @click="searchType = type.value"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <div class="search-input-group">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="请输入歌曲名、歌手名或专辑名..."
            @keypress="handleKeyPress"
            :disabled="isLoading"
          />
          <button
            class="search-btn"
            @click="handleSearch"
            :disabled="isLoading || !searchQuery.trim()"
          >
            {{ isLoading ? '搜索中...' : '搜索' }}
          </button>
        </div>

        <div class="tips">
          <p>💡 搜索提示：</p>
          <ul>
            <li>支持模糊搜索，输入部分关键词即可</li>
            <li>支持网易云音乐、QQ音乐等平台</li>
            <li>可以搜索歌曲名、歌手名或专辑名</li>
            <li>按回车键快速搜索</li>
          </ul>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>Powered by Vue 3 + TypeScript + Electron</p>
    </footer>
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
  padding: 2rem 0;
}

.header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.header p {
  margin: 0;
  opacity: 0.8;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.search-box {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
}

.search-box h2 {
  margin: 0 0 1rem 0;
  text-align: center;
  color: #333;
}

.search-type {
  margin-bottom: 1rem;
}

.search-type label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.type-buttons {
  display: flex;
  gap: 0.5rem;
}

.type-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.type-btn:hover {
  background: #f0f0f0;
}

.type-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.search-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
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
  padding: 1rem;
}

.tips p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.tips ul {
  margin: 0;
  padding-left: 1.2rem;
  color: #666;
}

.tips li {
  margin-bottom: 0.25rem;
}

.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}

.footer p {
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .search-input-group {
    flex-direction: column;
  }
  
  .type-buttons {
    flex-wrap: wrap;
  }
}
</style>
