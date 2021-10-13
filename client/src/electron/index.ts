import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import { menu } from './applicationMenu';
import { selectDirectory } from './handlers/selectDirectory';
import { explorerItemContextMenu } from './explorerItemContextMenu';
import { userContextMenu } from './userContextMenu';

app.on('ready', () => {
	let window = new BrowserWindow({
		width: 1200,
		height: 900,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			devTools: true
		}
	});

	window.loadFile('index.html');

	Menu.setApplicationMenu(menu);

	ipcMain.on('selectDirectory', (event) => selectDirectory(window, event));

	ipcMain.on('openExplorerFileContextMenu', () => {
		explorerItemContextMenu.popup();
	});

	ipcMain.on('openUserContextMenu', () => {
		userContextMenu.popup();
	});
});