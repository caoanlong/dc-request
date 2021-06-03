const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const Store = require('electron-store')
const { KEYUTIL } = require('jsrsasign')

const store = new Store()
let mainWindow, privateKey, publicKey

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false    // 解决跨域问题
        }
    })
    mainWindow.loadURL(
        isDev 
            ? 'http://localhost:3000' 
            : `file://${path.join(__dirname, "../build/index.html")}`
    )
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('rsaKeypair', {
            privateKey, publicKey
        })
    })
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    if (!store.has('privateKey') || !store.has('publicKey')) {
        const rsaKeypair = KEYUTIL.generateKeypair('RSA', 2028)
        privateKey = KEYUTIL.getPEM(rsaKeypair.prvKeyObj, "PKCS1PRV")
        publicKey = KEYUTIL.getPEM(rsaKeypair.pubKeyObj)
        store.set('privateKey', privateKey)
        store.set('publicKey', publicKey)
    } else {
        privateKey = store.get('privateKey')
        publicKey = store.get('publicKey')
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})