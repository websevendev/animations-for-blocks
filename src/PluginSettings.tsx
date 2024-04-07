import {
	useEntityProp,
} from '@wordpress/core-data'

import {
	settings as initialSettings,
} from './data'

export interface PluginSettings {
	animateInEditor: boolean
	lazyloadAssets: boolean
	/** Where to render animation block controls. */
	location: 'default' | 'advanced' | 'styles'
}

export const DEFAULT_SETTINGS: PluginSettings = {
	animateInEditor: true,
	lazyloadAssets: false,
	location: 'default',
}

export const usePluginSettings = (): PluginSettings => {

	const [, , settings = initialSettings] = useEntityProp('root', 'site', 'animations-for-blocks')

	return settings
}

export const usePluginSettingsEdit = (): [PluginSettings, (nextSettings: PluginSettings) => void] => {

	const [editedSettings = initialSettings, setSettings] = useEntityProp('root', 'site', 'animations-for-blocks')

	return [editedSettings, setSettings as (nextSettings: PluginSettings) => void]
}
