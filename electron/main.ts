import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn, ChildProcess } from 'child_process'
import { promisify } from 'util'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

// 获取资源路径（支持开发和生产环境）
function getResourcePath(relativePath: string): string {
  if (app.isPackaged) {
    // 生产环境：从 app.getAppPath() 获取资源
    return path.join(process.resourcesPath, relativePath)
  } else {
    // 开发环境：从项目根目录获取
    return path.join(process.env.APP_ROOT!, relativePath)
  }
}

// 解析歌词的IPC处理器
ipcMain.handle('parse-lyrics', async (event, url: string) => {
  try {
    const scriptPath = getResourcePath('simple-parser.js')
    
    console.log('解析歌词:', url)
    console.log('脚本路径:', scriptPath)
    
    return new Promise((resolve, reject) => {
      const childProcess = spawn('node', [scriptPath, url], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: app.isPackaged ? process.resourcesPath : process.env.APP_ROOT
      })
      
      let stdout = ''
      let stderr = ''
      
      childProcess.stdout?.on('data', (data) => {
        stdout += data.toString()
      })
      
      childProcess.stderr?.on('data', (data) => {
        stderr += data.toString()
      })
      
      childProcess.on('close', (code) => {
        if (code === 0) {
          // 解析输出结果
          const lines = stdout.split('\n')
          const songInfoMatch = lines.find(line => line.includes('歌曲名:'))
          const artistMatch = lines.find(line => line.includes('艺术家:'))
          const durationMatch = lines.find(line => line.includes('时长:'))
          const lyricsStartIndex = lines.findIndex(line => line.includes('歌词内容:'))
          const lyricsEndIndex = lines.findIndex(line => line.includes('共') && line.includes('行歌词'))
          
          if (songInfoMatch && artistMatch && lyricsStartIndex !== -1 && lyricsEndIndex !== -1) {
            const songName = songInfoMatch.split('歌曲名:')[1]?.trim()
            const artistName = artistMatch.split('艺术家:')[1]?.trim()
            const duration = durationMatch?.split('时长:')[1]?.trim()
            const lyrics = lines.slice(lyricsStartIndex + 2, lyricsEndIndex - 1).join('\n')
            
            resolve({
              success: true,
              song_info: {
                track_name: songName,
                artist_name: artistName,
                duration: duration
              },
              lyrics: lyrics
            })
          } else {
            reject(new Error('解析输出格式错误'))
          }
        } else {
          reject(new Error(stderr || '解析失败'))
        }
      })
      
      childProcess.on('error', (error) => {
        reject(error)
      })
    })
  } catch (error) {
    console.error('解析歌词失败:', error)
    throw error
  }
})

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  console.log('🎵 MusicLyrics Electron 应用启动')
  createWindow()
})
