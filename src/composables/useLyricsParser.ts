import { ref } from 'vue'
import type { ParseResult, Platform } from '../types/lyrics'

/**
 * 歌词解析相关功能
 */
export const useLyricsParser = () => {
  const isLoading = ref(false)
  const result = ref<ParseResult | null>(null)
  const error = ref<string>('')

  const platforms: Platform[] = [
    { value: 'netease', label: '网易云音乐', supported: false },
    { value: 'qq', label: 'QQ音乐', supported: false },
    { value: 'qishui', label: '汽水音乐', supported: true }
  ]

  /**
   * 智能提取汽水音乐链接
   */
  const extractQishuiLink = (input: string): string | null => {
    const linkPattern = /https?:\/\/qishui\.douyin\.com\/s\/[a-zA-Z0-9]+\/?/
    const match = input.match(linkPattern)
    return match ? match[0] : null
  }

  /**
   * 验证链接格式
   */
  const validateLink = (input: string, platform: string): { isValid: boolean; processUrl: string; error?: string } => {
    if (!input.trim()) {
      return { isValid: false, processUrl: '', error: '请输入音乐链接' }
    }

    const selectedPlatformData = platforms.find(p => p.value === platform)
    if (!selectedPlatformData?.supported) {
      return { isValid: false, processUrl: '', error: '该平台暂不支持，请选择其他平台' }
    }

    let processUrl = input.trim()

    if (platform === 'qishui') {
      const extractedLink = extractQishuiLink(input)
      if (extractedLink) {
        processUrl = extractedLink
        console.log('🔗 从文本中提取到链接:', processUrl)
      } else if (!input.includes('qishui.douyin.com')) {
        return { isValid: false, processUrl: '', error: '未找到有效的汽水音乐分享链接' }
      }
    } else {
      // 其他平台的基本URL验证
      const urlPattern = /^https?:\/\//i
      if (!urlPattern.test(processUrl)) {
        return { isValid: false, processUrl: '', error: '请输入有效的链接地址' }
      }
    }

    return { isValid: true, processUrl }
  }

  /**
   * 解析歌词
   */
  const parseLink = async (input: string, platform: string): Promise<void> => {
    const validation = validateLink(input, platform)
    
    if (!validation.isValid) {
      error.value = validation.error || '链接验证失败'
      return
    }

    isLoading.value = true
    error.value = ''
    result.value = null

    try {
      // 通过IPC调用主进程的歌词解析功能
      const data = await (window as any).ipcRenderer.invoke('parse-lyrics', validation.processUrl)
      
      if (data.success) {
        result.value = data
        console.log('解析成功:', data)
      } else {
        error.value = data.error || '解析失败'
        console.error('解析失败:', data.error)
      }
    } catch (err) {
      error.value = `解析失败: ${err instanceof Error ? err.message : '未知错误'}`
      console.error('请求失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 清除结果
   */
  const clearResult = (): void => {
    result.value = null
    error.value = ''
  }

  return {
    isLoading,
    result,
    error,
    platforms,
    parseLink,
    clearResult,
    extractQishuiLink,
    validateLink
  }
}