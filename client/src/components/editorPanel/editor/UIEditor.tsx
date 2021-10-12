import React from 'react';
import { Breadcrumb } from './Breadcrumb';

interface Props {
	unsaved: boolean;
	text: string;
	handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function UIEditor({ unsaved, text, handleChange }: Props) {
	return (
		<div className='bg-gray-900 flex-grow flex flex-col'>
			<Breadcrumb unsaved={unsaved} />
			<div className='overflow-auto flex-grow w-full'>
				<textarea
					onChange={handleChange}
					value={text}
					className='w-full h-full bg-transparent outline-none border-none text-gray-200 font-mono p-8 resize-none'
				></textarea>
			</div>
		</div>
	);
}