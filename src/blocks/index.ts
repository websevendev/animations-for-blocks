import {
	// @ts-ignore
	registerBlockType,
} from '@wordpress/blocks'

import * as animationContainer from './animation-container'

export default () => {
	registerBlockType(animationContainer.metadata, animationContainer.settings)
}
