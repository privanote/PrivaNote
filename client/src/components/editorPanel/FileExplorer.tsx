import React from 'react';
import { FileSystemItem, FileItem } from '../../types';
import { Directory } from './fileExplorer/Directory';
import { Note } from './fileExplorer/Note';
import PlusIcon from '../../assets/icons/plus.svg';
import FolderOpenIcon from '../../assets/icons/folder-open.svg';
import { getFileName } from '../../utils/getFileName';
import { createFile } from '../../utils/createFile';
import { createDirectory } from '../../utils/createDirectory';
import { getParentDirectory } from '../../utils/getParentDirectory';

interface Props {
	items: FileSystemItem[];
	currentNotebook: string;
	currentFile?: FileItem;
	setCurrentFile: React.Dispatch<FileItem>;
	selection?: FileSystemItem;
	setSelection: React.Dispatch<FileSystemItem | undefined>;
}

export function FileExplorer({
	items,
	currentNotebook,
	currentFile,
	setCurrentFile,
	selection,
	setSelection
}: Props) {
	const handleAddFileClick = () => {
		const newFilePath = selection
			? getParentDirectory(selection.path, { onlyFiles: true })
			: currentNotebook;
		const newFile = createFile(newFilePath);
		setCurrentFile(newFile);
	};

	const handleAddDirectoryClick = () => {
		const newDirectoryPath = selection
			? getParentDirectory(selection.path, { onlyFiles: true })
			: currentNotebook;
		const newDirectory = createDirectory(newDirectoryPath);
		setSelection(newDirectory);
	};

	const handleOuterClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target !== event.currentTarget) return;

		setSelection(undefined);
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
						onClick={handleAddDirectoryClick}
						fill='#9CA3AF'
						className='p-0.5 hover:bg-gray-700 rounded-md cursor-pointer'
					/>
				</div>
			</div>
			<div
				onClick={handleOuterClick}
				className='flex-grow overflow-y-scroll pb-6'
			>
				{items.map((item) => {
					return item.type === 'directory' ? (
						<Directory
							item={item}
							currentFile={currentFile}
							setCurrentFile={setCurrentFile}
							setSelection={setSelection}
							selection={selection}
						/>
					) : (
						<Note
							item={item}
							currentFile={currentFile}
							setCurrentFile={setCurrentFile}
							setSelection={setSelection}
							selection={selection}
						/>
					);
				})}
			</div>
		</div>
	);
}
