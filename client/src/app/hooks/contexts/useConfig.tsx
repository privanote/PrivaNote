import { PrivaNoteConfig, Provider } from '@types';
import { ActionType, getType, createAction } from 'typesafe-actions';
import { defaultConfig, getConfig } from '@shared/utils';
import { ConfigDispatch } from '@types';
import React, {
	useMemo,
	useReducer,
	useContext,
	createContext,
	PropsWithChildren
} from 'react';
import fs from 'fs';

const actions = {
	init: createAction('INIT')<string>(),
	load: createAction('LOAD')<string>(),
	addProvider:
		createAction('ADD_PROVIDER')<{ provider: Provider; path: string }>(),
	removeProvider:
		createAction('REMOVE_PROVIDER')<{ provider: Provider; path: string }>()
};

function defaultGuard<S>(state: S | undefined, _: never) {
	return state;
}

const reducer = (
	state: PrivaNoteConfig | undefined,
	action: ActionType<typeof actions>
) => {
	switch (action.type) {
		// init will be implemented when createNotebook is promoted into a reducer
		case getType(actions.init):
			//const notebookPath = action.payload;
			//fs.writeFileSync(
			//`${notebookPath}/.privanote/app.json`,
			//JSON.stringify(defaultConfig)
			//);

			return defaultConfig;
		case getType(actions.load):
			return getConfig(action.payload) as PrivaNoteConfig;
		case getType(actions.addProvider):
			if (state!.connectedProviders.includes(action.payload.provider)) {
				return state;
			}

			const addProviderState = {
				...state,
				connectedProviders: [
					...state!.connectedProviders,
					action.payload.provider
				]
			};

			fs.writeFileSync(
				action.payload.path + '/.privanote/app.json',
				JSON.stringify(addProviderState)
			);

			return addProviderState as PrivaNoteConfig;
		case getType(actions.removeProvider):
			if (!state!.connectedProviders.includes(action.payload.provider)) {
				return state;
			}

			const removeProviderState = {
				...state,
				connectedProviders: state!.connectedProviders.filter(
					(p) => p !== action.payload.provider
				)
			};

			fs.writeFileSync(
				action.payload.path + '/.privanote/app.json',
				JSON.stringify(removeProviderState)
			);

			return removeProviderState as PrivaNoteConfig;
		default:
			return defaultGuard(state, action);
	}
};

const context = createContext<any>(undefined);

export const ConfigProvider = ({ children }: PropsWithChildren<{}>) => {
	const [config, dispatch] = useReducer(reducer, undefined);

	const contextValue = useMemo(() => {
		return [config, dispatch];
	}, [config, dispatch]);

	return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export const useConfig = () =>
	useContext<[PrivaNoteConfig | undefined, ConfigDispatch]>(context);
