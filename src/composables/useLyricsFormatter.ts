import type { ParseResult } from '../types/lyrics'
import { formatLRCTime, getTimeStamp } from '../utils/timeFormatter'

/**
 * 歌词格式化相关功能
 */
export const useLyricsFormatter = () => {
  /**
   * 生成带时间戳的歌词显示
   */
  const getTimestampLyrics = (result: ParseResult): string => {
    // 首先检查是否有 lyrics_with_timing 数据
    if (result?.lyrics_with_timing && Array.isArray(result.lyrics_with_timing)) {
      return result.lyrics_with_timing
        .map((line: any) => {
          const { startTime } = getTimeStamp(line)
          return `${formatLRCTime(startTime)} ${line.text}`
        })
        .join('\n')
    }
    
    // 如果没有 lyrics_with_timing，尝试从原始歌词数据中获取
    if (result?.lyrics?.sentences && Array.isArray(result.lyrics.sentences)) {
      const filteredSentences = result.lyrics.sentences.filter((line: any) => line.text && line.text.trim())
      
      return filteredSentences
        .map((line: any) => {
          const { startTime } = getTimeStamp(line)
          return `${formatLRCTime(startTime)} ${line.text}`
        })
        .join('\n')
    }
    
    // 如果都没有，返回提示信息
    return '暂无时间戳数据'
  }

  /**
   * 获取纯文本歌词
   */
  const getPlainLyrics = (result: ParseResult): string => {
    return result?.lyrics || ''
  }

  /**
   * 根据显示格式获取歌词内容
   */
  const getLyricsContent = (result: ParseResult, displayFormat: 'plain' | 'timestamp'): string => {
    return displayFormat === 'timestamp' 
      ? getTimestampLyrics(result) 
      : getPlainLyrics(result)
  }

  return {
    getTimestampLyrics,
    getPlainLyrics,
    getLyricsContent
  }
}