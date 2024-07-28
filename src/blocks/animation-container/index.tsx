import * as React from 'react'
import {__} from '@wordpress/i18n'

import {
	// @ts-ignore
	useBlockProps,
	// @ts-ignore
	useInnerBlocksProps,
} from '@wordpress/block-editor'

import metadata from './block.json'
export {metadata}

const Edit = () => {

	const blockProps = useBlockProps()
	const innerBlocksProps = useInnerBlocksProps(blockProps)

	return <div {...innerBlocksProps} />
}

const Save = () => {

	const blockProps = useBlockProps.save()
	const innerBlocksProps = useInnerBlocksProps.save(blockProps)

	return <div {...innerBlocksProps} />
}

export const settings = {
	edit: Edit,
	save: Save,
}
