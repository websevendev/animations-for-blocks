import {__} from '@wordpress/i18n'

import {
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor'

const Edit = props => {

	const blockProps = useBlockProps()
	const innerBlocksProps = useInnerBlocksProps(blockProps)

	return <div {...innerBlocksProps} />
}

const Save = props => {

	const blockProps = useBlockProps.save()
	const innerBlocksProps = useInnerBlocksProps.save(blockProps)

	return <div {...innerBlocksProps} />
}

export const blockName = 'anfb/animation-container'

/**
 * Container block that can be used to wrap and animate blocks that don't support custom attributes.
 */
export const settings = {
	apiVersion: 3,
	title: __('Animation container', 'animations-for-blocks'),
	description: __('A container that can be animated. Can be used to animate dynamic or other unsupported blocks.', 'animations-for-blocks'),
	icon: 'media-interactive',
	category: 'design',
	attributes: {},
	supports: {
		anchor: true,
		animationsForBlocks: true,
	},
	edit: Edit,
	save: Save,
}
