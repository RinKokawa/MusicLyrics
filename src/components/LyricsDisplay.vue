<template>
  <div v-if="lyrics" class="lyrics-content">
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
      {{ lyricsContent }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
  import type { ParseResult, DisplayFormat, DownloadFormat, LyricsData } from '../types/lyrics'
import { useLyricsFormatter } from '../composables/useLyricsFormatter'
import { useFileDownload } from '../composables/useFileDownload'

interface Props {
    result: ParseResult
    lyrics: string | LyricsData
}

  const props = defineProps<Props>()

const displayFormat = ref<DisplayFormat>('plain')
const downloadFormat = ref<DownloadFormat>('srt')

const { getLyricsContent } = useLyricsFormatter()
const { handleDownload: downloadFile } = useFileDownload()

const lyricsContent = computed(() => {
  return getLyricsContent(props.result, displayFormat.value)
})

const handleDownload = () => {
  downloadFile(props.result, downloadFormat.value)
}
</script>

<style scoped>
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

@media (max-width: 768px) {
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