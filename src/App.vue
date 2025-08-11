<script setup lang="ts">
import SearchForm from './components/SearchForm.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import ResultContainer from './components/ResultContainer.vue'
import UsageTips from './components/UsageTips.vue'
import { useLyricsParser } from './composables/useLyricsParser'

const {
  isLoading,
  result,
  error,
  platforms,
  parseLink,
  clearResult
} = useLyricsParser()

const handleSubmit = (linkInput: string, selectedPlatform: string) => {
  parseLink(linkInput, selectedPlatform)
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
        <SearchForm 
          :platforms="platforms"
          :is-loading="isLoading"
          @submit="handleSubmit"
        />

        <ErrorMessage :error="error" />

        <ResultContainer 
          :result="result"
          @clear="clearResult"
        />

        <UsageTips />
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

@media (max-width: 768px) {
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