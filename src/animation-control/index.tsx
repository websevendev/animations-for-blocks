import * as React from 'react'
import {__, _x} from '@wordpress/i18n'
import cx from 'classnames'

import {
	useState,
	Platform,
} from '@wordpress/element'

import {
	BaseControl,
	ToggleControl,
	Button,
	Icon,
	__experimentalUnitControl as UnitControl,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components'

import {
	settings as settingsIcon,
} from '@wordpress/icons'

import ButtonGroup from '../button-group'
import RangeControl from '../range-control'

import {
	ANIMATIONS,
	ANIMATION_INHERIT,
	ANIMATION_DEFAULT,
	DYNAMIC_ANIMATION_NAMES,
	VARIATIONS,
	EASINGS,
	ANCHOR_PLACEMENTS,
} from '../aos-data'

import type {
	AnimationsForBlocks,
} from '../types'

import './style.scss'

const isWeb = Platform.OS === 'web'
const UNIT_CONTROL_UNITS = [{
	value: 'px',
	label: isWeb ? 'px' : __('Pixels (px)', 'animations-for-blocks'),
	a11yLabel: __('Pixels (px)', 'animations-for-blocks'),
	step: 1,
}]

export interface AnimationControlProps {
	label?: string
	help?: string
	/** Show options for selecting "Inherit" animation. */
	allowInherit?: boolean
	/** Show options for selecting "Default" animation. */
	allowDefault?: boolean
	/** Prevent deselecting an animation or variation. */
	required?: boolean
	value: AnimationsForBlocks
	onChange: (nextValue: AnimationsForBlocks) => void
}

const AnimationControl: React.FC<AnimationControlProps> = ({
	label,
	help,
	allowInherit = false,
	allowDefault = false,
	required = false,
	value,
	onChange,
}) => {

	const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

	const {
		animation,
		variation,
		delay = 0,
		duration = 400,
		once = false,
		mirror = false,
		easing = EASINGS[0].value,
		anchorPlacement = ANCHOR_PLACEMENTS[0].value,
		offset = 120,
	} = value

	const hasAnimation = !!(animation && animation !== 'none')

	const updateValue = (updates: Partial<AnimationsForBlocks>) => {
		const nextValue = {
			...value,
			...updates,
		}
		onChange(nextValue)
	}

	return (
		<BaseControl
			className='wsd-anfb__animation-control'
			label={label}
			help={help}
			__nextHasNoMarginBottom
		>
			<VStack spacing={4}>
				<ButtonGroup.Radio
					pills
					label={__('Select animation', 'animations-for-blocks')}
					hideLabelFromVision
					options={ANIMATIONS.concat([
						...(allowInherit ? ANIMATION_INHERIT : []),
						...(allowDefault ? ANIMATION_DEFAULT : []),
					])}
					value={animation}
					onChange={nextAnimation => {

						const hasNextAnimation = !!(nextAnimation && nextAnimation !== 'none')
						if(required && !hasNextAnimation) {
							return
						}

						const nextAnimationVariations = hasNextAnimation && nextAnimation in VARIATIONS
							? VARIATIONS[nextAnimation as keyof typeof VARIATIONS].map(variation => variation.value) : ['']

						const nextVariation = hasNextAnimation ? (
							variation && nextAnimationVariations.includes(variation)
								? variation // Keep current variation if the next animation also has that variation (e.g. fade-left -> slide-left)
								: nextAnimationVariations[0] // or default to first variation of the animation
						) : variation

						updateValue({animation: nextAnimation, variation: nextVariation})
					}}
				/>
				{hasAnimation && !DYNAMIC_ANIMATION_NAMES.includes(animation) && <>
					<ButtonGroup.Radio
						isSmall
						pills
						label={__('Animation variation', 'animations-for-blocks')}
						hideLabelFromVision
						options={VARIATIONS[animation]}
						value={variation || VARIATIONS[animation][0].value}
						onChange={nextVariation => {
							if(required && !nextVariation) {
								return
							}
							updateValue({variation: nextVariation})
						}}
					/>
					<RangeControl
						label={__('Duration', 'animations-for-blocks')}
						value={duration}
						onChange={(nextDuration: number = 400) => updateValue({duration: nextDuration})}
					/>
					<RangeControl
						label={__('Delay', 'animations-for-blocks')}
						value={delay}
						onChange={(nextDelay: number = 0) => updateValue({delay: nextDelay})}
					/>
					<Button
						variant='secondary'
						size='small'
						className={cx('wsd-anfb__button', {
							'wsd-anfb__button-active': showAdvancedSettings,
						})}
						onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
					>
						<HStack alignment='center' justify='center'>
							<Icon icon={settingsIcon} size={16} />
							<span>{__('Advanced settings', 'animations-for-blocks')}</span>
						</HStack>
					</Button>
					{showAdvancedSettings && <>
						<ToggleControl
							label={__('Once', 'animations-for-blocks')}
							help={__('Animate only once, when scrolling down for the first time.', 'animations-for-blocks')}
							checked={once}
							onChange={() => updateValue({
								once: !once,
								mirror: !once && mirror ? !mirror : mirror,
							})}
							__nextHasNoMarginBottom
						/>
						<ToggleControl
							label={__('Mirror', 'animations-for-blocks')}
							help={__('Animate out after scrolling past the element and in when scrolling up again.', 'animations-for-blocks')}
							checked={mirror}
							onChange={() => updateValue({
								mirror: !mirror,
								once: !mirror && once ? !once : once,
							})}
							__nextHasNoMarginBottom
						/>
						<ButtonGroup.Radio
							isSmall
							pills
							label={__('Easing', 'animations-for-blocks')}
							help={__('Transition timing function.', 'animations-for-blocks')}
							options={EASINGS}
							value={easing}
							onChange={nextEasing => {
								if(required && !nextEasing) {
									return
								}
								if(easing === nextEasing) {
									return
								}
								updateValue({easing: nextEasing})
							}}
						/>
						<ButtonGroup.Radio
							isSmall
							pills
							label={__('Anchor placement', 'animations-for-blocks')}
							help={__('Defines which position of the element regarding to window should trigger the animation.', 'animations-for-blocks')}
							options={ANCHOR_PLACEMENTS}
							value={anchorPlacement}
							onChange={nextAnchorPlacement => {
								if(required && !nextAnchorPlacement) {
									return
								}
								if(anchorPlacement === nextAnchorPlacement) {
									return
								}
								updateValue({anchorPlacement: nextAnchorPlacement})
							}}
						/>
						<UnitControl
							label={__('Offset', 'animations-for-blocks')}
							help={__('Offset from the original trigger point.', 'animations-for-blocks')}
							type='number'
							value={`${offset}px`}
							isDragEnabled={false}
							isUnitSelectTabbable={false}
							units={UNIT_CONTROL_UNITS}
							onChange={(nextOffset: string = '120') => {
								const nextOffsetValue = parseInt(nextOffset.replace('px', ''))
								updateValue({offset: isNaN(nextOffsetValue) ? 120 : nextOffsetValue})
							}}
						/>
					</>}
				</>}
			</VStack>
		</BaseControl>
	)
}

export default AnimationControl
