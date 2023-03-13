import {
	registerBlockType,
} from '@wordpress/blocks'

import {
	blockName as animationContainerBlockName,
	settings as animationContainerBlockSettings,
} from './animation-container'

export default () => {
	registerBlockType(animationContainerBlockName, animationContainerBlockSettings)
}
