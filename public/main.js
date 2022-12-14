const { app, dialog, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev')
const ipc = require('./ipc_handlers.js')

const { autoUpdater } = require("electron-updater")

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload/preload.js'),
        }
    });
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    )
    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({ mode: "detach" });
        require('react-devtools-electron');
    };
    if (!isDev) {
        autoUpdater.checkForUpdates();
    }

}


app.on('ready', () => {
    ipc.ipc_handlers();
    createWindow();
});


autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
    console.log(_event);
    console.log(releaseNotes);
    console.log(releaseName);
    const dialogOpts = {
        type: 'info',
        buttons: ['Ok'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version is being downloaded.'
    }
    dialog.showMessageBox(dialogOpts, (response) => {

    });
})

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
});


autoUpdater.on("update-not-available", (_event, releaseNotes, releaseName) => {
    console.log(_event);
    console.log(releaseNotes);
    console.log(releaseName);
    const dialogOpts = {
        type: 'info',
        buttons: ['Ok'],
        title: 'Application No Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'No version found.'
    }
    dialog.showMessageBox(dialogOpts, (response) => {

    });
}
);

autoUpdater.on("error", (_event) => {
    console.log(_event);
    const dialogOpts = {
        type: 'info',
        buttons: ['Ok'],
        title: 'Error',
        message: '',
        detail: 'No version found.' + _event
    }
    dialog.showMessageBox(dialogOpts, (response) => {
    });
}
);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
});