import * as React from 'react'

import {
	applyFilters,
	addFilter,
} from '@wordpress/hooks'

import {
	hasBlockSupport,
} from '@wordpress/blocks'

import {
	createHigherOrderComponent,
} from '@wordpress/compose'

import InspectorControls from './InspectorControls'
import AnimatedBlockListBlock from './AnimatedBlockListBlock'

import {
	getAnimationProps,
} from './utils'

declare global {
	interface Window {
		anfbData: {
			unsupportedBlocks: string[]
		}
	}
}

export interface AnimationsForBlocks {
	animation?: string
	variation?: string
	delay?: number
	duration?: number
	once?: boolean
	mirror?: boolean
	easing?: string
	offset?: number
	anchorPlacement?: string
}

/**
 * Feature.
 */
const featureName = 'animationsForBlocks'
const featureDefaultEnabled = applyFilters('anfb.defaultEnabled', true)
const featureIsSupported = (block: any) => {
	const name = block.name || block
	if(window.anfbData.unsupportedBlocks.includes(name)) {
		return false
	}
	return hasBlockSupport(block, featureName, featureDefaultEnabled)
}
const featureAttributes = {
	animationsForBlocks: {
		type: 'object',
	},
}

/**
 * Add attributes to block attributes.
 */
const withFeatureAttributes = function(settings) {

	if(featureIsSupported(settings)) {
		settings.attributes = Object.assign(settings.attributes || {}, featureAttributes)
	}

	return settings
}

/**
 * Add Inspector Controls to block edit component.
 */
const withFeatureInspectorControls = createHigherOrderComponent(function(BlockEdit) {
	return function(props) {

		if(featureIsSupported(props.name)) {
			return <>
				<BlockEdit {...props} />
				<InspectorControls {...props} />
			</>
		}

		return <BlockEdit {...props} />
	}
}, 'withAnimationsForBlocksInspectorControls')

/**
 * Add feature extra props to block save component output.
 */
const withAnimationProps = (extraProps, blockType, attributes) => {

	if(featureIsSupported(blockType)) {

		const {
			animationsForBlocks = {},
		} = attributes

		const animationProps = getAnimationProps(animationsForBlocks)

		if(animationProps['data-aos']) {
			extraProps = {
				...extraProps,
				...animationProps,
			}
		}
	}

	return extraProps
}

/**
 * Use feature BlockListBlock.
 */
const withAnimatedBlockListBlock = createHigherOrderComponent(
	BlockListBlock => props =>
		featureIsSupported(props.name)
			? <AnimatedBlockListBlock {...props} BlockListBlock={BlockListBlock} />
			: <BlockListBlock {...props} />,
	'withAnimatedBlockListBlock'
)

/**
 * Register feature filters.
 */
export default () => {
	addFilter('blocks.registerBlockType', 'wsd-anfb/attributes', withFeatureAttributes)
	addFilter('editor.BlockEdit', 'wsd-anfb/inspector-controls', withFeatureInspectorControls)
	addFilter('blocks.getSaveContent.extraProps', 'wsd-anfb/animation-props', withAnimationProps)
	addFilter('editor.BlockListBlock', 'wsd-anfb/blocklistblock-animation', withAnimatedBlockListBlock)
}
