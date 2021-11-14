const path = require('path')
const os = require('os')
const { BrowserWindow, app, ipcMain, screen } = require('electron')
const express = require('express')
const webServer = express()
const ElectronUtility = require('./ElectronUtility')

let mainWindow = null

function createWindow() {
    const pDisplay = screen.getPrimaryDisplay()
    mainWindow = new BrowserWindow({
        width: pDisplay.size.width,
        height: pDisplay.size.height,
        type: 'desktop',
        frame: false,
        transparent: true,
        focusable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.resolve(__dirname, 'ElectronPreload.js'),
        },
    })

    mainWindow.setIgnoreMouseEvents(true)
    mainWindow.loadURL('http://localhost:9999/index.html')
    // mainWindow.webContents.openDevTools()
}

function onWindowAllClosed() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
}

function onAppActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
}

function sendMessage(channel, data = null) {
    if (mainWindow === null) {
        console.error('MainWindow is null.')
        return
    }

    mainWindow.webContents.send(channel, data)
}

function startWebServer(port, rootDir) {
    webServer.use(express.static(rootDir))
    webServer.listen(port, () => {
        console.log('Start WebServer...')
    })
}

async function main() {
    if (!ElectronUtility.isDevelopmentMode()) {
        startWebServer(9999, path.resolve(__dirname, '../', 'dist'))
    }

    await app.whenReady()
    createWindow()
    app.on('window-all-closed', onWindowAllClosed)
    app.on('activate', onAppActivate)

    // 3秒ごとに更新させる
    setInterval(() => {
        sendMessage('update')
    }, 3000)
}

main()

ipcMain.on('requestHostName', () => {
    const hostName = os.hostname()
    sendMessage('hostName', hostName)
})
ipcMain.on('requestOsInfo', () => {
    const arch = os.arch()
    const cpus = os.cpus()

    const mb = 1024 * 1024
    const totalMemory = os.totalmem() / mb
    const freeMemory = os.freemem() / mb
    const memory = `${totalMemory} MB`

    sendMessage('osInfo', {
        arch: arch,
        cpu: cpus.length < 1 ? '???' : cpus[0].model,
        memory: memory,
    })
})
ipcMain.on('requestNetworkInterfaces', () => {
    const interfaces = os.networkInterfaces()
    sendMessage('networkInterfaces', interfaces)
})
