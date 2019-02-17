import {
  app,
  dialog,
  shell,
  BrowserWindow,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron';

export function getMenu(
  mainWindow: BrowserWindow
): MenuItemConstructorOptions[] {
  let menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          click() {
            dialog.showOpenDialog(
              {
                properties: ['openFile'],
              },
              (filePaths: string[]) => {
                if (!filePaths[0]) {
                  return;
                } else {
                  mainWindow.webContents.send('loadImage', filePaths[0]);
                }
              }
            );
          },
          accelerator: 'CmdOrCtrl+O',
        },
        {
          label: 'Save',
          click() {
            mainWindow.webContents.send('saveImage');
          },
          accelerator: 'CmdOrCtrl+S',
        },
        {
          label: 'Quit',
          click() {
            app.quit();
          },
          accelerator: 'CmdOrCtrl+Q',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item: MenuItem, focusedWindow: BrowserWindow) {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F';
            } else {
              return 'F11';
            }
          })(),
          click: function(item: MenuItem, focusedWindow: BrowserWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I';
            } else {
              return 'Ctrl+Shift+I';
            }
          })(),
          click: function(item: MenuItem, focusedWindow: BrowserWindow) {
            if (focusedWindow) {
              focusedWindow.webContents.toggleDevTools();
            }
          },
        },
      ],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
        // {
        //     label: 'Close',
        //     accelerator: 'CmdOrCtrl+W',
        //     role: 'close',
        // },
      ],
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: function() {
            shell.openExternal('http://electron.atom.io');
          },
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    const name = app.getName();
    menuTemplate.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about',
          accelerator: null,
        },
        {
          label: 'Hide ' + name,
          role: 'hide',
          accelerator: 'Command+H',
        } as any,
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit();
          },
        },
      ],
    });
  }

  return menuTemplate;
}
