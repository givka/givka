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

// Listen for the app to be ready
app.on('ready', () => {
  // Create new window
  mainWindow = new BrowserWindow({
    backgroundColor: '#14181C',
    height: 800,
    width: 1280,
    fullscreen: true,
  });
  // Monokai backgroundColor: '#262820'
  // Letterboxd backgroundColor: '#14181C'

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'givka.html'),
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
      accelerator: 'Command+I',
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      },
    }],
  });
}
