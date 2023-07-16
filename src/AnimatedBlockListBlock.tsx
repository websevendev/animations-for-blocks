import * as React from 'react'

import {
	useState,
	useEffect,
	useRef,
	useCallback,
	useContext,
} from '@wordpress/element'

import {
	BlockList,
} from '@wordpress/block-editor'

import cx from 'classnames'

import {
	usePluginSettings,
} from './PluginSettings'

import {
	ANIMATE_EVENT_TYPE,
} from './InspectorControls'

import {
	getAnimationProps,
} from './utils'

import type {
	BlockListBlockProps,
	AnimationsForBlocksBlockAttributes,
} from './types'

export interface AnimatedBlockListBlockProps extends BlockListBlockProps<AnimationsForBlocksBlockAttributes> {
	BlockListBlock: React.FC<BlockListBlockProps<AnimationsForBlocksBlockAttributes>>
}

const AnimatedBlockListBlock: React.FC<AnimatedBlockListBlockProps> = props => {

	const {
		BlockListBlock,
		...blockListBlockProps
	} = props

	const {
		clientId,
		attributes,
		wrapperProps = {},
	} = blockListBlockProps

	const {
		animationsForBlocks = {},
	} = attributes

	const {
		animation,
		delay = 0,
		duration = 400,
	} = animationsForBlocks

	const {
		animateInEditor,
	} = usePluginSettings()

	const hasAnimation = !!(animation && animation !== 'none')
	const [isAnimating, setIsAnimating] = useState<boolean>(false)
	const [hasAnimated, setHasAnimated] = useState<boolean>(!animateInEditor)
	const animationDuration = useRef<number>(delay + duration)
	const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])
	const elementContext = useContext<Element | DocumentFragment | null>(BlockList.__unstableElementContext)

	/** Sync animation duration. */
	useEffect(() => {
		animationDuration.current = delay + duration
	}, [delay, duration])

	const animateBlock = useCallback(() => {

		timeouts.current.forEach(clearTimeout)
		setIsAnimating(false)
		setHasAnimated(true)

		/**
		 * After moving a block up/down in the editor, it gets left with inline styles:
		 *  	`transform-origin: center center; transform: translate3d(0px, 1px, 0px); z-index: 1;`
		 * These mess up the animation preview so get rid of them manually.
		 */
		if(elementContext) {
			const block = elementContext.querySelector(`#block-${clientId}`) as HTMLElement
			if(block) {
				block.style.removeProperty('transform-origin')
				block.style.removeProperty('transform')
				block.style.removeProperty('z-index')
			}
		}

		timeouts.current = [setTimeout(() => setHasAnimated(false), 50)]
	}, [clientId, elementContext])

	useEffect(() => {

		const {
			animation,
		} = animationsForBlocks

		const hasAnimation = !!(animation && animation !== 'none')

		if(hasAnimation && animateInEditor) {
			animateBlock()
		}
	}, [animationsForBlocks, animateBlock, animateInEditor])

	useEffect(() => {
		if(!hasAnimated) {
			timeouts.current.forEach(clearTimeout)
			timeouts.current = [setTimeout(() => setIsAnimating(true), 50)]
		}
	}, [hasAnimated])

	useEffect(() => {
		if(isAnimating) {
			timeouts.current.push(
				setTimeout(() => {
					setIsAnimating(false)
					setHasAnimated(true)
				}, animationDuration.current)
			)
		}
	}, [isAnimating])

	useEffect(() => {

		document.addEventListener(`${ANIMATE_EVENT_TYPE}:${clientId}`, animateBlock)
		document.addEventListener(ANIMATE_EVENT_TYPE, animateBlock)

		return () => {
			timeouts.current.forEach(clearTimeout)
			document.removeEventListener(`${ANIMATE_EVENT_TYPE}:${clientId}`, animateBlock)
			document.removeEventListener(ANIMATE_EVENT_TYPE, animateBlock)
		}
	}, [clientId, animateBlock])

	return (
		<BlockListBlock
			{...blockListBlockProps}
			wrapperProps={{
				...wrapperProps,
				...(hasAnimation && {
					...getAnimationProps(animationsForBlocks, 'edit'),
					className: cx(wrapperProps.className, {
						'aos-init': hasAnimation,
						'aos-animate': isAnimating || hasAnimated,
						'wsd-anfb-is-animating': isAnimating,
					}),
					...(hasAnimation && {
						'data-anfb-init': true,
					}),
					...((isAnimating || hasAnimated) && {
						'data-anfb-animate': true,
					}),
					...(isAnimating && {
						'data-anfb-is-animating': true,
					}),
				}),
			}}
		/>
	)
}

export default AnimatedBlockListBlock
