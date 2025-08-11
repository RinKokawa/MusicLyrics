/**
 * 格式化时间戳为 SRT 格式 (00:00:00,000)
 */
export const formatSRTTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`
}

/**
 * 格式化时间戳为 LRC 格式 [00:00.00]
 */
export const formatLRCTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(2)
  
  return `[${minutes.toString().padStart(2, '0')}:${secs.padStart(5, '0')}]`
}

/**
 * 获取时间戳（支持毫秒和秒格式）
 */
export const getTimeStamp = (line: any): { startTime: number; endTime: number } => {
  const startTime = line.startMs ? line.startMs / 1000 : (line.startTime || 0)
  const endTime = line.endMs ? line.endMs / 1000 : (line.endTime || startTime + 3)
  
  return { startTime, endTime }
}