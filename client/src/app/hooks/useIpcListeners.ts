import { verifyUser } from '@shared/Api/verifyUser';
import { getFileName, parseCodeFromUrl } from '@shared/utils';
import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { useConfig, useModalStore, useStore } from '.';

const createListener = (channel: string, callback: (...args: any) => void) => {
	ipcRenderer.removeAllListeners(channel);
	ipcRenderer.on(channel, callback);
};

export function useIpcListeners() {
	const [{ currentNote, notebook }, dispatch] = useStore();
	const [, modalDispatch] = useModalStore();
	const [, configDispatch] = useConfig();

	useEffect(() => {
		createListener('createNotebook', () => {
			modalDispatch({
				type: 'createNotebookModal',
				createNotebookModalVisible: true
			});
		});

		createListener(
			'openNotebook',
			(_, location: string, valid: boolean) => {
				if (!valid) {
					alert(
						`"${getFileName(location)}" is not a valid notebook.`
					);

					return;
				}

				dispatch({
					type: 'openNote',
					currentNote: undefined
				});

				dispatch({
					type: 'openNotebook',
					notebook: location
				});

				configDispatch({
					type: 'LOAD',
					payload: location
				});
			}
		);

		createListener('exportNote', () => {
			ipcRenderer.send('currentFileToExport', currentNote);
		});

		createListener(
			'googleDriveAuth',
			(_, accessToken: string, idToken: string) => {
				if (!notebook) return;

				configDispatch({
					type: 'ADD_PROVIDER',
					payload: {
						providerName: 'Google Drive',
						path: notebook,
						accessToken,
						idToken
					}
				});
			}
		);

		createListener('url-privanote', (_, url) => {
			// parse code out of url
			const code = parseCodeFromUrl(url, 'resetPassword');
			// if successful, render reset password
			verifyUser({ verificationCode: code })
				.then((response) => {
					console.log(code);
					console.log(response);
					if (response.user) {
						modalDispatch({
							type: 'resetPasswordModal',
							resetPasswordModalVisible: true
						});
					}
				})
				.catch((err) => {
					console.error(err);
				});
		});
	}, [currentNote, notebook]);
}
