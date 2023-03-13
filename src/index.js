import domReady from '@wordpress/dom-ready'

import registerAnimationsForBlocks from './AnimationsForBlocks'
import registerBlocks from './blocks'

import './style.scss'

registerAnimationsForBlocks()
domReady(registerBlocks)
