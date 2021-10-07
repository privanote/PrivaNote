import React from 'react';
import { ModalLayout } from './Modal';
import { BrowseInputField } from './BrowseInputField';
import { TextField } from './TextField';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import fs from 'fs';
import { createNotebook } from '../utils/createNotebook';
import { FileItem } from '../types';

interface Props {
	setCurrentNotebook: React.Dispatch<
		React.SetStateAction<string | undefined>
	>;
	setCurrentFile: React.Dispatch<FileItem | undefined>;
	close: () => void;
}

interface FormValues {
	name: string;
	location: string;
}

const validationSchema = yup.object({
	name: yup.string().required(),
	location: yup.string().required()
});

export function CreateNotebookModal({
	setCurrentNotebook,
	setCurrentFile,
	close
}: Props) {
	const {
		register,
		formState: { errors, isValid },
		setError,
		setValue,
		handleSubmit
	} = useForm<FormValues>({
		resolver: yupResolver(validationSchema)
	});

	const onSubmit = async ({ name, location }: FormValues) => {
		const path = `${location}/${name}`;

		if (!fs.existsSync(location)) {
			setError('location', { message: 'directory not found' });
			return;
		}

		if (fs.existsSync(path)) {
			setError('name', { message: 'name already used' });
			return;
		}
		const isCreated = await createNotebook(`${location}/${name}`);

		if (!isCreated) {
			setError('name', { message: 'an error occurred' });

			return;
		}

		setCurrentFile(undefined);
		setCurrentNotebook(path);
		close();
	};

	return (
		<ModalLayout close={close}>
			<div className='flex flex-col space-y-10'>
				<h1 className='text-white text-3xl text-center select-none'>
					Create Notebook
				</h1>
				<form
					className='w-80 space-y-10'
					onSubmit={handleSubmit(onSubmit)}
				>
					<TextField
						name='name'
						error={errors.name}
						register={register}
					/>
					<BrowseInputField
						name='location'
						error={errors.location}
						setValue={setValue}
						register={register}
					/>
					<div className='flex justify-end'>
						<input
							type='submit'
							value='Create'
							className={`pn-button bg-opacity-50 bg-blue-500 border-blue-500 ${
								isValid
									? 'hover:border-blue-400'
									: 'cursor-not-allowed opacity-20'
							}`}
						/>
					</div>
				</form>
			</div>
		</ModalLayout>
	);
}
