const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    request: (message, data) => ipcRenderer.send(message, data),
    on: (channel, callback) =>
        ipcRenderer.on(channel, (event, argv) => callback(event, argv)),
})
