import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn, ChildProcess } from 'child_process'

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
let pythonProcess: ChildProcess | null = null

// Python服务器配置
const PYTHON_SERVER_PORT = 5000
const PYTHON_SERVER_URL = `http://localhost:${PYTHON_SERVER_PORT}`

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

function startPythonServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const serverPath = getResourcePath('server.py')
    
    console.log('启动Python后端服务...')
    console.log('服务器路径:', serverPath)
    
    // 启动Python服务器
    pythonProcess = spawn('python', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
      cwd: app.isPackaged ? process.resourcesPath : process.env.APP_ROOT
    })
    
    // 监听输出
    pythonProcess.stdout?.on('data', (data) => {
      const output = data.toString()
      console.log('Python服务器输出:', output)
      
      // 检查服务器是否启动成功
      if (output.includes('Running on') && output.includes('5000')) {
        console.log('Python服务器启动成功!')
        resolve()
      }
    })
    
    pythonProcess.stderr?.on('data', (data) => {
      const error = data.toString()
      console.error('Python服务器错误:', error)
      
      // 如果是模块未找到错误，尝试安装依赖
      if (error.includes('ModuleNotFoundError') || error.includes('No module named')) {
        console.log('检测到缺少Python依赖，正在安装...')
        installPythonDependencies().then(() => {
          // 重新启动服务器
          startPythonServer().then(resolve).catch(reject)
        }).catch(reject)
      }
    })
    
    pythonProcess.on('error', (error) => {
      console.error('启动Python服务器失败:', error)
      reject(error)
    })
    
    pythonProcess.on('exit', (code) => {
      console.log('Python服务器退出，退出码:', code)
    })
    
    // 设置超时
    setTimeout(() => {
      if (pythonProcess && !pythonProcess.killed) {
        console.log('Python服务器启动超时，但继续运行...')
        resolve()
      }
    }, 5000)
  })
}

function installPythonDependencies(): Promise<void> {
  return new Promise((resolve, reject) => {
    const requirementsPath = getResourcePath('requirements.txt')
    
    console.log('安装Python依赖...')
    console.log('依赖文件路径:', requirementsPath)
    
    const installProcess = spawn('pip', ['install', '-r', requirementsPath], {
      stdio: 'pipe',
      cwd: app.isPackaged ? process.resourcesPath : process.env.APP_ROOT
    })
    
    installProcess.stdout?.on('data', (data) => {
      console.log('安装输出:', data.toString())
    })
    
    installProcess.stderr?.on('data', (data) => {
      console.error('安装错误:', data.toString())
    })
    
    installProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python依赖安装成功!')
        resolve()
      } else {
        console.error('Python依赖安装失败，退出码:', code)
        reject(new Error(`安装失败，退出码: ${code}`))
      }
    })
    
    installProcess.on('error', (error) => {
      console.error('安装过程错误:', error)
      reject(error)
    })
  })
}

function stopPythonServer() {
  if (pythonProcess && !pythonProcess.killed) {
    console.log('停止Python服务器...')
    pythonProcess.kill('SIGTERM')
    pythonProcess = null
  }
}

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
    stopPythonServer()
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

app.on('before-quit', () => {
  stopPythonServer()
})

app.whenReady().then(async () => {
  try {
    // 启动Python服务器
    await startPythonServer()
    console.log('Python服务器已启动，地址:', PYTHON_SERVER_URL)
    
    // 创建窗口
    createWindow()
  } catch (error) {
    console.error('启动失败:', error)
    app.quit()
  }
})
