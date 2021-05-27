const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadURL(
        isDev 
            ? 'http://localhost:3000' 
            : `file://${path.join(__dirname, "../build/index.html")}`
    )
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})