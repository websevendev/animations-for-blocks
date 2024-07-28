import * as React from 'react'

import {
	useState,
	useEffect,
	useRef,
	useCallback,
} from '@wordpress/element'

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

	/** Sync animation duration. */
	useEffect(() => {
		animationDuration.current = delay + duration
	}, [delay, duration])

	const animateBlock = useCallback(() => {

		timeouts.current.forEach(clearTimeout)
		setIsAnimating(false)
		setHasAnimated(true)

		timeouts.current = [setTimeout(() => setHasAnimated(false), 50)]
	}, [clientId])

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
