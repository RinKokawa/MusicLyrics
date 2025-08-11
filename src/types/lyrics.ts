// 平台信息类型
export interface Platform {
  value: string
  label: string
  supported: boolean
}

// 歌曲信息类型
export interface SongInfo {
  track_id?: string
  track_name?: string
  artist_name?: string
  duration?: string | number
  artist_id?: string
  album?: {
    id: string
    name: string
    release_date?: string
    cover_url?: string
  }
  artists?: Array<{
    id: string
    name: string
    avatar_url?: string
    display_name?: string
  }>
  stats?: {
    collected_count?: number
    comment_count?: number
    shared_count?: number
  }
}

// 歌词行类型
export interface LyricsLine {
  text: string
  startTime?: number
  endTime?: number
  startMs?: number
  endMs?: number
  words?: Array<{
    text: string
    startTime?: number
    endTime?: number
    startMs?: number
    endMs?: number
  }>
}

// 歌词数据类型
export interface LyricsData {
  sentences?: LyricsLine[]
  lyricType?: string
}

// 解析结果类型
export interface ParseResult {
  success: boolean
  lyrics?: string
  lyrics_with_timing?: LyricsLine[]
  song_info?: SongInfo
  source?: string
  error?: string
}

// 显示格式类型
export type DisplayFormat = 'plain' | 'timestamp'

// 下载格式类型
export type DownloadFormat = 'srt' | 'lrc' | 'json'