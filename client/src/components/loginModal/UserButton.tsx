import React, { useEffect } from 'react';
import UserCircleIcon from '../../assets/icons/user-circle.svg';
import { ipcRenderer } from 'electron';

interface Props {
	authModalVisible: boolean;
	setAuthModalVisible: React.Dispatch<boolean>;
}

let signedIn = true;

export function UserButton({ authModalVisible, setAuthModalVisible }: Props) {
	const handleClick = () => {
		if (!signedIn) {
			setAuthModalVisible(!authModalVisible);
		} else {
			ipcRenderer.send('openUserContextMenu');
		}
	};

	useEffect(() => {
		ipcRenderer.on('signOut', () => (signedIn = false));
	}, [signedIn]);

	return (
		<div className='text-gray-500 hover:text-gray-400'>
			<UserCircleIcon className='cursor-pointer' onClick={handleClick} />
		</div>
	);
}
