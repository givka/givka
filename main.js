const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'quit' },
      { role: 'reload' },
    ],
  },
];

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    // backgroundColor: '#14181C',
    height: 800,
    width: 1280,
    // fullscreen: true,
  });

  console.log(__dirname);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file',
    slashes: true,
  }));

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  Menu.setApplicationMenu(mainMenu);
});

if (process.platform === 'darwin') {
  mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',

    submenu: [{
      label: 'Toggle DevTools',
      accelerator: 'I',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      },
    }],
  });
}
