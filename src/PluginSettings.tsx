import {
	useEntityProp,
} from '@wordpress/core-data'

import {
	settings as initialSettings,
} from './data'

import type {
	AnimationsForBlocks,
} from './types'

export interface PluginSettings {

	/** Play block animations in the editor automatically. */
	animateInEditor: boolean

	/** Load assets only when a block with an animation is present on the current page. */
	lazyloadAssets: boolean

	/** When to enqueue Lenis. */
	lenis:
		| 'off' // Not enqueued
		| 'on' // Always enqueued
		| 'animate' // Enqueued when the page contains animations

	/** Where to render animation block controls. */
	location:
		| 'default' // Block inspector controls
		| 'advanced' // Advanced inspector controls
		| 'styles' // Styles tab

	/** Animation that is used when the chosen animation is "Default". */
	defaultAnimation?: AnimationsForBlocks
}

export const DEFAULT_ANIMATION: AnimationsForBlocks = {
	animation: 'scale',
	variation: 'in-x',
	delay: 0,
	duration: 800,
	once: true,
	mirror: false,
	easing: 'ease-out-cubic',
	offset: 120,
	anchorPlacement: 'top-bottom',
}

export const DEFAULT_SETTINGS: PluginSettings = {
	animateInEditor: true,
	lazyloadAssets: true,
	lenis: 'off',
	location: 'default',
	defaultAnimation: DEFAULT_ANIMATION,
}

export const usePluginSettings = (): PluginSettings => {

	const [, , settings = initialSettings] = useEntityProp('root', 'site', 'animations-for-blocks')

	return settings
}

export const usePluginSettingsEdit = (): [PluginSettings, (nextSettings: PluginSettings) => void] => {

	const [editedSettings = initialSettings, setSettings] = useEntityProp('root', 'site', 'animations-for-blocks')

	return [editedSettings, setSettings as (nextSettings: PluginSettings) => void]
}
