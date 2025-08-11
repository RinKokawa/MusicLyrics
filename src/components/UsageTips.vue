<template>
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
</template>

<style scoped>
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
</style>