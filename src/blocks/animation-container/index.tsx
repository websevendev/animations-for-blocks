import * as React from 'react'
import {__} from '@wordpress/i18n'

import {
	PanelBody,
	ToggleControl,
} from '@wordpress/components'

import {
	// @ts-ignore
	useBlockProps,
	// @ts-ignore
	useInnerBlocksProps,
	// @ts-ignore
	InspectorControls,
} from '@wordpress/block-editor'

import metadata from './block.json'
export {metadata}

import type {
	AnimationsForBlocksBlockAttributes,
	AnimationsForBlocksBlockContext,
	BlockEditProps,
} from '../../types'
import RangeControl from '../../range-control'

export type AnimationContainerBlockAttributes = AnimationsForBlocksBlockAttributes<{
	/** Should this block animate or provide the animation to child blocks. */
	isAnimationProvider?: boolean
	/** Stagger provided animation. */
	animationStagger?: number
}>

const Edit: React.FC<BlockEditProps<AnimationContainerBlockAttributes, AnimationsForBlocksBlockContext>> = props => {

	const {
		attributes,
		setAttributes,
	} = props

	const {
		isAnimationProvider = false,
		animationStagger = 0,
		animationsForBlocks = {},
	} = attributes

	const {
		animation = '',
	} = animationsForBlocks

	const blockProps = useBlockProps()
	const innerBlocksProps = useInnerBlocksProps(blockProps)

	return <>
		<InspectorControls>
			<PanelBody>
				<ToggleControl
					label={__('Is animation provider', 'animations-for-blocks')}
					help={__('Instead of animating this block, provide the current animation to all child blocks that use the "Inherit" animation.', 'animations-for-blocks')}
					checked={isAnimationProvider}
					onChange={() => setAttributes({
						isAnimationProvider: !isAnimationProvider,
						...(!isAnimationProvider && ['inherit', 'default'].includes(animation) && {
							animationsForBlocks: {
								...animationsForBlocks,
								animation: '',
							},
						}),
					})}
					__nextHasNoMarginBottom
				/>
				{isAnimationProvider && <>
					<RangeControl
						label={__('Stagger', 'animations-for-blocks')}
						help={__('Delay subsequent animations incrementally by this amount.', 'animations-for-blocks')}
						value={animationStagger}
						max={1000}
						onChange={(nextValue = 0) => setAttributes({animationStagger: nextValue})}
					/>
				</>}
			</PanelBody>
		</InspectorControls>
		<div {...innerBlocksProps} />
	</>
}

const Save = () => {

	const blockProps = useBlockProps.save()
	const innerBlocksProps = useInnerBlocksProps.save(blockProps)

	return <div {...innerBlocksProps} />
}

export const settings = {
	edit: Edit,
	save: Save,
	__experimentalLabel: (attributes: AnimationContainerBlockAttributes, {context}) => {

		const customName = attributes?.metadata?.name
		if(context === 'list-view' && customName) {
			return customName
		}

		const {
			isAnimationProvider = false,
		} = attributes

		if(isAnimationProvider) {
			return __('Animation provider', 'animations-for-blocks')
		}
	},
}
