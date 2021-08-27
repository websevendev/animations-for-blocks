import {
	__,
} from '@wordpress/i18n';

import {
	registerBlockType,
} from '@wordpress/blocks';

import {
	InnerBlocks,
} from '@wordpress/block-editor';

import domReady from '@wordpress/dom-ready';

/**
 * Container block that can be used to wrap and animate blocks that don't support custom attributes.
 */
const settings = {
	title: __('Animation container', 'animations-for-blocks'),
	description: __('A container that can be animated. Can be used to animate dynamic or other unsupported blocks.', 'animations-for-blocks'),
	icon: 'media-interactive',
	category: 'design',
	attributes: {},
	supports: {
		anchor: true,
		animationsForBlocks: true,
	},

	edit() {
		return (
			<div style={{padding: '1px 0'}}>
				<InnerBlocks />
			</div>
		);
	},

	save() {
		return (
			<div>
				<InnerBlocks.Content />
			</div>
		);
	},
};

/**
 * Register the block on domReady to allow late registerBlockType filters to be applied.
 */
domReady(() => {
	registerBlockType('anfb/animation-container', settings);
});
