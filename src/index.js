import {
	applyFilters,
	addFilter,
} from '@wordpress/hooks';

import {
	hasBlockSupport,
} from '@wordpress/blocks';

import {
	Fragment,
} from '@wordpress/element';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

import domReady from '@wordpress/dom-ready';

import AOS from 'aos';
import '../node_modules/aos/dist/aos.css';

import InspectorControls from './InspectorControls';
import AnimatedBlockListBlock from './AnimatedBlockListBlock';

import {
	getAnimationProps,
} from './utils';

import './AnimationContainer';

import './style.scss';

/**
 * Feature.
 */
const featureName = 'animationsForBlocks';
const featureDefaultEnabled = applyFilters('anfb.defaultEnabled', true);
const featureIsSupported = block => {
	const name = block.name || block;
	if(window.anfbData.unsupportedBlocks.includes(name)) {
		return false;
	}
	return hasBlockSupport(block, featureName, featureDefaultEnabled);
};
const featureAttributes = {
	animationsForBlocks: {
		type: 'object',
		default: {},
	},
};

/**
 * Add attributes to block attributes.
 */
const withFeatureAttributes = function(settings) {
	if(featureIsSupported(settings)) {
		settings.attributes = Object.assign(settings.attributes || {}, featureAttributes);
	}

	return settings;
}

/**
 * Add Inspector Controls to block edit component.
 */
const withFeatureInspectorControls = createHigherOrderComponent(function(BlockEdit) {
	return function(props) {
		if(featureIsSupported(props.name)) {
			return (
				<Fragment>
					<BlockEdit {...props} />
					<InspectorControls {...props} />
				</Fragment>
			);
		}

		return <BlockEdit {...props} />;
	};
}, 'withAnimationsForBlocksInspectorControls');

/**
 * Add feature extra props to block save component output.
 */
const withAnimationProps = (extraProps, blockType, attributes) => {
	if(featureIsSupported(blockType)) {
		let {animationsForBlocks} = attributes;
		const animationProps = getAnimationProps(animationsForBlocks);
		if(animationProps['data-aos']) {
			extraProps = {
				...extraProps,
				...animationProps,
			};
		}
	}

	return extraProps;
}

/**
 * Use feature BlockListBlock.
 */
const withAnimatedBlockListBlock = createHigherOrderComponent(BlockListBlock => {
	return props =>
		featureIsSupported(props.name)
		? <AnimatedBlockListBlock {...props} BlockListBlock={BlockListBlock} />
		: <BlockListBlock {...props} />
}, 'withAnimatedBlockListBlock');

/**
 * Register feature filters.
 */
addFilter('blocks.registerBlockType', 'wsd-anfb/attributes', withFeatureAttributes);
addFilter('editor.BlockEdit', 'wsd-anfb/inspector-controls', withFeatureInspectorControls);
addFilter('blocks.getSaveContent.extraProps', 'wsd-anfb/animation-props', withAnimationProps);
addFilter('editor.BlockListBlock', 'wsd-anfb/blocklistblock-animation', withAnimatedBlockListBlock);

/**
 * Initialize AOS in the editor.
 */
domReady(() => setTimeout(() => AOS.init(), 250));
