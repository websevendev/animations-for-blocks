import {
	PluginSettings,
	DEFAULT_SETTINGS,
} from './PluginSettings'

declare global {
	interface Window {
		anfbData: {
			unsupportedBlocks: string[]
			settings: PluginSettings
		}
	}
}

if(!window.anfbData) {
	window.anfbData = {
		unsupportedBlocks: [],
		settings: DEFAULT_SETTINGS,
	}
}

export const unsupportedBlocks = window.anfbData.unsupportedBlocks
export const settings = window.anfbData.settings
