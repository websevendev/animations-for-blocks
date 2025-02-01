import {
	useSelect,
} from '@wordpress/data'

import {
	store as coreStore,
} from '@wordpress/core-data'

import {
	store as blocksStore,
} from '@wordpress/blocks'

import {
	store as blockEditorStore,
} from '@wordpress/block-editor'

import {
	DEFAULT_ANIMATION,
} from './PluginSettings'

import type {
	AnimationsForBlocks,
	AnimationsForBlocksBlockContext,
} from './types'

export {
	usePluginSettings,
	usePluginSettingsEdit,
} from './PluginSettings'

export const useAnimationConfig = (clientId: string, animationsForBlocks: AnimationsForBlocks = {}, enabled = false) => {

	const {
		animation = '',
	} = animationsForBlocks

	const selectedAnimation = useSelect(select => {

		if(!enabled) {
			return false
		}

		const getDefaultAnimation = () => {
			const record = select(coreStore).getEditedEntityRecord('root', 'site', undefined!) as any
			const {'animations-for-blocks': pluginSettings = {}} = record || {}
			const {defaultAnimation = DEFAULT_ANIMATION} = pluginSettings
			return defaultAnimation
		}

		if(animation === 'default') {
			return getDefaultAnimation()
		}

		if(animation === 'inherit') {

			const parentAnimationContainers = select(blockEditorStore).getBlockParentsByBlockName(clientId, 'anfb/animation-container', true) as string[]

			const getAnimationProvider = (containers: string[]) => {
				for(const clientId of containers) {
					const block = select(blockEditorStore).getBlock(clientId)
					if(block) {
						return block
					}
				}
				return false
			}

			const block = getAnimationProvider(parentAnimationContainers)
			if(!block) {
				return false
			}

			const blockType = select(blocksStore).getBlockType(block.name)
			if(!blockType) {
				return false
			}

			if(Object.keys(blockType.providesContext).length === 0) {
				return false
			}

			const context = Object.fromEntries(
				Object.entries(blockType.providesContext).map(
					// @ts-expect-error
					([contextName, attributeName]) => [contextName, block.attributes[attributeName]]
				)
			) as AnimationsForBlocksBlockContext

			const {
				animationsForBlocksAnimation: providedAnimation = {},
			} = context

			if(!providedAnimation?.animation || providedAnimation.animation === 'inherit') {
				return false
			}

			if(providedAnimation.animation === 'default') {
				return getDefaultAnimation()
			}

			return providedAnimation
		}

		return false
	}, [clientId, animation, enabled])

	if(!enabled) {
		return false
	}

	switch(animation) {

		case 'none':
			return false

		case 'default':
			return selectedAnimation || DEFAULT_ANIMATION

		case 'inherit':
			return selectedAnimation
	}

	return animationsForBlocks
}
