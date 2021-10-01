import React from 'react';
import { FileSystemItem, FileItem } from '../../types';
import { Directory } from './fileExplorer/Directory';
import { Note } from './fileExplorer/Note';
import PlusIcon from '../../assets/icons/plus.svg';
import FolderOpenIcon from '../../assets/icons/folder-open.svg';
import { getFileName } from '../../utils/getFileName';
import { createFile } from '../../utils/createFile';

interface Props {
	items: FileSystemItem[];
	currentNotebook: string;
	currentFile?: FileItem;
	setCurrentFile: React.Dispatch<FileItem>;
}

export function FileExplorer({
	items,
	currentNotebook,
	currentFile,
	setCurrentFile
}: Props) {
	const handleAddFileClick = () => {
		// hard coded to create file at root
		const newFile = createFile(currentNotebook);
		setCurrentFile(newFile);
	};

	return (
		<div className='bg-gray-800 pt-2 flex flex-col resize-x'>
			<div className='flex justify-between'>
				<p className='text-gray-500 text-sm font-bold px-3 py-1'>
					{getFileName(currentNotebook)}
				</p>
				<div className='mx-2 flex space-x-1'>
					<PlusIcon
						onClick={handleAddFileClick}
						fill='#9CA3AF'
						className='p-0.5 hover:bg-gray-700 rounded-md cursor-pointer'
					/>
					<FolderOpenIcon
						fill='#9CA3AF'
						className='p-0.5 hover:bg-gray-700 rounded-md cursor-pointer'
					/>
				</div>
			</div>
			<div className='flex-grow overflow-y-scroll'>
				{items.map((item) => {
					return item.type === 'directory' ? (
						<Directory
							item={item}
							currentFile={currentFile}
							setCurrentFile={setCurrentFile}
						/>
					) : (
						<Note
							item={item}
							currentFile={currentFile}
							setCurrentFile={setCurrentFile}
						/>
					);
				})}
			</div>
		</div>
	);
}
