import type { ParseResult, DownloadFormat } from '../types/lyrics'
import { formatSRTTime, formatLRCTime, getTimeStamp } from '../utils/timeFormatter'

/**
 * 文件下载相关功能
 */
export const useFileDownload = () => {
  /**
   * 获取歌词数据（统一处理函数）
   */
  const getLyricsData = (result: ParseResult) => {
    // 优先使用 lyrics_with_timing
    if (result?.lyrics_with_timing && Array.isArray(result.lyrics_with_timing)) {
      return result.lyrics_with_timing
    }
    
    // 如果没有，使用原始歌词数据
    if (result?.lyrics?.sentences && Array.isArray(result.lyrics.sentences)) {
      return result.lyrics.sentences.filter((line: any) => line.text && line.text.trim())
    }
    
    return []
  }

  /**
   * 生成 SRT 格式内容
   */
  const generateSRT = (result: ParseResult): string => {
    const lyricsData = getLyricsData(result)
    if (lyricsData.length === 0) return ''
    
    return lyricsData
      .map((line: any, index: number) => {
        const { startTime, endTime } = getTimeStamp(line)
        const startTimeStr = formatSRTTime(startTime)
        const endTimeStr = formatSRTTime(endTime)
        return `${index + 1}\n${startTimeStr} --> ${endTimeStr}\n${line.text}\n`
      })
      .join('\n')
  }

  /**
   * 生成 LRC 格式内容
   */
  const generateLRC = (result: ParseResult): string => {
    const lyricsData = getLyricsData(result)
    if (lyricsData.length === 0) return ''
    
    let lrcContent = ''
    
    // 添加歌曲信息
    if (result.song_info) {
      lrcContent += `[ti:${result.song_info.track_name || ''}]\n`
      lrcContent += `[ar:${result.song_info.artist_name || ''}]\n`
      if (result.song_info.album?.name) {
        lrcContent += `[al:${result.song_info.album.name}]\n`
      }
      lrcContent += `[by:MusicLyrics]\n\n`
    }
    
    // 添加歌词内容
    lrcContent += lyricsData
      .map((line: any) => {
        const { startTime } = getTimeStamp(line)
        return `${formatLRCTime(startTime)}${line.text}`
      })
      .join('\n')
    
    return lrcContent
  }

  /**
   * 生成 JSON 格式内容
   */
  const generateJSON = (result: ParseResult): string => {
    if (!result) return ''
    
    const lyricsData = getLyricsData(result)
    
    const jsonData = {
      song_info: result.song_info,
      lyrics: {
        plain_text: result.lyrics,
        with_timing: lyricsData.length > 0 ? lyricsData : result.lyrics_with_timing,
        raw_data: result.lyrics // 保留原始数据结构
      },
      source: result.source,
      export_time: new Date().toISOString()
    }
    
    return JSON.stringify(jsonData, null, 2)
  }

  /**
   * 下载文件
   */
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * 处理下载
   */
  const handleDownload = (result: ParseResult, format: DownloadFormat) => {
    if (!result) return
    
    const songName = result.song_info?.track_name || 'lyrics'
    const artistName = result.song_info?.artist_name || 'unknown'
    const baseFilename = `${songName} - ${artistName}`.replace(/[<>:"/\\|?*]/g, '_')
    
    let content = ''
    let filename = ''
    let mimeType = 'text/plain'
    
    switch (format) {
      case 'srt':
        content = generateSRT(result)
        filename = `${baseFilename}.srt`
        mimeType = 'text/srt'
        break
      case 'lrc':
        content = generateLRC(result)
        filename = `${baseFilename}.lrc`
        mimeType = 'text/lrc'
        break
      case 'json':
        content = generateJSON(result)
        filename = `${baseFilename}.json`
        mimeType = 'application/json'
        break
    }
    
    if (content) {
      downloadFile(content, filename, mimeType)
    }
  }

  return {
    getLyricsData,
    generateSRT,
    generateLRC,
    generateJSON,
    handleDownload
  }
}