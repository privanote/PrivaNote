import { Dispatch } from 'react';
export interface FileSystemItem {
	name: string;
	path: string;
	type: 'note' | 'directory';
}

export type FileItem = Omit<FileSystemItem, 'type'>;

export interface PrivaNoteConfig {
	autoSave: boolean;
	spellCheck: boolean;
	dictionaryLanguage: string;
	fontFamily: string;
	fontSize: number;
	tabWidth: number;
	columns: number;
}

// Reducer Types

export interface AppState {
	notebook?: string;
	currentNote?: FileItem;
}

export interface AppAction extends AppState {
	type: 'openNotebook' | 'openNote';
}

export interface ModalManagerState {
	loginModalVisible: boolean;
	registerModalVisible: boolean;
	createNotebookModalVisible: boolean;
	verificationModalVisible: boolean;
}

export interface ModalManagerAction extends Partial<ModalManagerState> {
	type: 'loginModal' | 'registerModal' | 'createNotebookModal' | 'verificationModal';
}

export interface EditorState {
	primarySelection?: FileSystemItem;
	secondarySelection?: FileSystemItem;
	isRenaming: boolean;
}

export interface EditorAction extends EditorState {
	type: 'primarySelect' | 'secondarySelect' | 'rename';
}

export interface RegisterFormValues {
	email: string;
	password: string;
	confirmPassword: string;
}

export interface VerificationFormValues {
	verificationCode: string;
}

export interface FormError {
	message: string;
}

export interface User {
	userID: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    verified: boolean;
}
