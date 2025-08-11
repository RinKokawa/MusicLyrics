<template>
  <div class="search-form">
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
        @click="handleSubmit"
        :disabled="isLoading || !linkInput.trim()"
      >
        {{ isLoading ? '处理中...' : '获取歌词' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Platform } from '../types/lyrics'

interface Props {
  platforms: Platform[]
  isLoading: boolean
}

interface Emits {
  (e: 'submit', linkInput: string, selectedPlatform: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const linkInput = ref('')
const selectedPlatform = ref('qishui')

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSubmit()
  }
}

const handleSubmit = () => {
  emit('submit', linkInput.value, selectedPlatform.value)
}
</script>

<style scoped>
.search-form h2 {
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

@media (max-width: 768px) {
  .search-input-group {
    flex-direction: column;
  }
}
</style>