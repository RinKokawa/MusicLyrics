<template>
  <div v-if="result" class="result-container">
    <div class="result-header">
      <h3>解析结果</h3>
      <button @click="$emit('clear')" class="clear-btn">清除</button>
    </div>
    
    <!-- 歌曲信息 -->
    <SongInfo :song-info="result.song_info" />
    
    <!-- 歌词内容 -->
    <LyricsDisplay 
      v-if="result.lyrics"
      :result="result" 
      :lyrics="result.lyrics" 
    />
  </div>
</template>

<script setup lang="ts">
import type { ParseResult } from '../types/lyrics'
import SongInfo from './SongInfo.vue'
import LyricsDisplay from './LyricsDisplay.vue'

interface Props {
  result: ParseResult | null
}

interface Emits {
  (e: 'clear'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
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
</style>