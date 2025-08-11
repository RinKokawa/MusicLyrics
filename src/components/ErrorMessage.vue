<template>
  <div v-if="error" class="error-message">
    <p>❌ {{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: string
}

defineProps<Props>()
</script>

<style scoped>
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
</style>