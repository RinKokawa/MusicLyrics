<template>
  <div v-if="songInfo" class="song-info">
    <h4>歌曲信息</h4>
    <div class="info-grid">
      <div class="info-item">
        <span class="label">歌曲名：</span>
        <span class="value">{{ songInfo.track_name || '未知' }}</span>
      </div>
      <div class="info-item">
        <span class="label">艺术家：</span>
        <span class="value">{{ songInfo.artist_name || '未知' }}</span>
      </div>
      <div v-if="songInfo.duration" class="info-item">
        <span class="label">时长：</span>
        <span class="value">{{ songInfo.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SongInfo } from '../types/lyrics'

interface Props {
  songInfo?: SongInfo
}

defineProps<Props>()
</script>

<style scoped>
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

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>