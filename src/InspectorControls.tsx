import * as React from 'react'
import {__, _x, sprintf} from '@wordpress/i18n'

import {
	useRef,
	useState,
	useEffect,
	Platform,
} from '@wordpress/element'

import {
	InspectorControls as WPInspectorControls,
	RichText,
} from '@wordpress/block-editor'

import {
	Panel,
	PanelHeader,
	PanelBody,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	ToggleControl,
	Button,
	Icon,
	__experimentalUnitControl as UnitControl,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
} from '@wordpress/components'

import {
	useDispatch,
} from '@wordpress/data'

import {
	store as noticesStore,
} from '@wordpress/notices'

import {
	useCopyToClipboard,
} from '@wordpress/compose'

import {
	displayShortcut,
} from '@wordpress/keycodes'

import {
	moreVertical as moreVerticalIcon,
	help as helpIcon,
	settings as settingsIcon,
	media as mediaIcon,
	copy as copyIcon,
	shortcode as shortcodeIcon,
	lineSolid as lineSolidIcon,
} from '@wordpress/icons'

import ButtonGroup from './button-group'
import RangeControl from './range-control'
import HelpModal from './HelpModal'

import {
	ANIMATIONS,
	VARIATIONS,
	EASINGS,
	ANCHOR_PLACEMENTS,
} from './aos-data'

import cx from 'classnames'

import type {
	AnimationsForBlocks,
	AnimationsForBlocksBlockAttributes,
} from './types'

const isWeb = Platform.OS === 'web'
const UNIT_CONTROL_UNITS = [{
	value: 'px',
	label: isWeb ? 'px' : __('Pixels (px)', 'animations-for-blocks'),
	a11yLabel: __('Pixels (px)', 'animations-for-blocks'),
	step: 1,
}]

const playIcon = (
	<Icon icon={<>
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' width={20} height={20} fill='currentColor'>
			<path d='M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z' />
		</svg>
	</>} />
)

export const ANIMATE_EVENT_TYPE = 'anfb:animate'
export const GLOBAL_UPDATE_EVENT = new CustomEvent(ANIMATE_EVENT_TYPE)
export const CLIPBOARD_PREFIX = 'anfb:'
export const PASTE_TARGET_ELEMENT_ID = 'wsd-anfb-paste'

export interface InspectorControlsProps {
	clientId: string
	attributes: AnimationsForBlocksBlockAttributes
	setAttributes: (nextAttributes: AnimationsForBlocksBlockAttributes) => void
}

const InspectorControls: React.FC<InspectorControlsProps> = ({
	clientId,
	attributes,
	setAttributes,
}) => {

	const {
		animationsForBlocks = {},
	} = attributes

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
	} = animationsForBlocks

	const hasAnimation = !!(animation && animation !== 'none')
	const [showHelp, setShowHelp] = useState(false)
	const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
	const [manualPasteMode, setManualPasteMode] = useState(false)
	const anfbUpdateEvent = useRef<CustomEvent | null>(null)

	const {
		createSuccessNotice,
		createErrorNotice,
	} = useDispatch(noticesStore)

	const copyAnimationRef = useCopyToClipboard(
		() => `${CLIPBOARD_PREFIX}${JSON.stringify(animationsForBlocks)}`,
		() => createSuccessNotice(__('Copied animation settings to clipboard.', 'animations-for-blocks'), {type: 'snackbar'})
	)

	useEffect(() => {
		anfbUpdateEvent.current = new CustomEvent(`${ANIMATE_EVENT_TYPE}:${clientId}`)
	}, [clientId])

	useEffect(() => {
		if(manualPasteMode) {
			document.getElementById(PASTE_TARGET_ELEMENT_ID)?.focus()
		}
	}, [manualPasteMode])

	const updateAttributes = (attributesToUpdate: AnimationsForBlocksBlockAttributes['animationsForBlocks']) => {
		setAttributes({
			animationsForBlocks: {
				...animationsForBlocks,
				...attributesToUpdate,
			},
		})
	}

	const applyPastedAnimation = (text: string) => {

		const invalidError = () => createErrorNotice(__('Invalid animation.', 'animations-for-blocks'), {type: 'snackbar'})

		if(text.indexOf(CLIPBOARD_PREFIX) !== 0) {
			invalidError()
			return
		}

		let attributes: AnimationsForBlocks = {}
		try {
			attributes = JSON.parse(text.replace(CLIPBOARD_PREFIX, ''))
		} catch(e) {
			invalidError()
			return
		}

		const {
			animation,
		} = attributes

		if(!animation) {
			invalidError()
			return
		}

		const animationData = ANIMATIONS.find(({value}) => value === animation)
		if(!animationData) {
			invalidError()
			return
		}

		updateAttributes(attributes)
		createSuccessNotice(sprintf(__('Applied animation: %s.', 'animations-for-blocks'), animationData.label), {type: 'snackbar'})
	}

	return (
		<WPInspectorControls>
			<Panel className='wsd-anfb'>
				<PanelHeader>
					<HStack align='center' justify='space-between'>
						<h2 style={{margin: 0}}>{__('Animation', 'animations-for-blocks')}</h2>
						<DropdownMenu
							icon={moreVerticalIcon}
							label={__('More actions', 'animations-for-blocks')}
							toggleProps={{
								isSmall: true,
							}}
						>
							{({onClose}) => <>
								<MenuGroup className='wsd-anfb__menu-group'>
									<MenuItem
										icon={playIcon}
										children={__('Animate block', 'animations-for-blocks')}
										disabled={!hasAnimation}
										onClick={() => {
											if(anfbUpdateEvent.current) {
												document.dispatchEvent(anfbUpdateEvent.current)
											}
											onClose()
										}}
									/>
									<MenuItem
										icon={mediaIcon}
										children={__('Animate all blocks', 'animations-for-blocks')}
										onClick={() => {
											document.dispatchEvent(GLOBAL_UPDATE_EVENT)
											onClose()
										}}
									/>
									<MenuItem
										icon={copyIcon}
										children={__('Copy animation', 'animations-for-blocks')}
										disabled={!hasAnimation}
										ref={copyAnimationRef}
										onClick={() => {
											onClose()
										}}
									/>
									<MenuItem
										icon={shortcodeIcon}
										onClick={async () => {
											if(window.navigator.clipboard) {
												applyPastedAnimation(await window.navigator.clipboard.readText())
												onClose()
											} else {
												setManualPasteMode(true)
											}
										}}
									>
										{manualPasteMode && (
											<RichText
												id={PASTE_TARGET_ELEMENT_ID}
												tagName='span'
												placeholder={sprintf(
													_x('Press %s…', 'Keyboard shortcut', 'animations-for-blocks'),
													displayShortcut.primary('v')
												)}
												value=''
												onChange={(text: string) => {
													applyPastedAnimation(text)
													setManualPasteMode(false)
													onClose()
												}}
											/>
										)}
										{!manualPasteMode && __('Paste animation', 'animations-for-blocks')}
									</MenuItem>
									<MenuItem
										icon={helpIcon}
										children={__('Help', 'animations-for-blocks')}
										onClick={() => {
											setShowHelp(true)
											onClose()
										}}
									/>
								</MenuGroup>
								{Object.keys(animationsForBlocks).length > 0 && (
									<MenuGroup>
										<MenuItem
											icon={lineSolidIcon}
											children={__('Reset all', 'animations-for-blocks')}
											onClick={() => {
												setAttributes({animationsForBlocks: undefined})
												onClose()
											}}
										/>
									</MenuGroup>
								)}
							</>}
						</DropdownMenu>
					</HStack>
				</PanelHeader>
				<PanelBody>
					<VStack spacing={4}>
						<ButtonGroup.Radio
							pills
							label={__('Select animation', 'animations-for-blocks')}
							hideLabelFromVision
							options={ANIMATIONS}
							value={animation}
							onChange={nextAnimation => {
								const hasNextAnimation = !!(nextAnimation && nextAnimation !== 'none')
								const nextAnimationVariations = hasNextAnimation ? VARIATIONS[nextAnimation as keyof typeof VARIATIONS].map(variation => variation.value) : []
								const nextVariation = hasNextAnimation ? (
									variation && nextAnimationVariations.includes(variation)
									? variation // Keep current variation if the next animation also has that variation (e.g. fade-left -> slide-left)
									: nextAnimationVariations[0] // or default to first variation of the animation
								) : variation
								updateAttributes({animation: nextAnimation, variation: nextVariation})
							}}
						/>
						{hasAnimation && <>
							<ButtonGroup.Radio
								isSmall
								pills
								label={__('Animation variation', 'animations-for-blocks')}
								hideLabelFromVision
								options={VARIATIONS[animation]}
								value={variation || VARIATIONS[animation][0].value}
								onChange={nextVariation => updateAttributes({variation: nextVariation})}
							/>
							<RangeControl
								label={__('Duration', 'animations-for-blocks')}
								value={duration}
								onChange={(nextDuration: number) => updateAttributes({duration: nextDuration})}
							/>
							<RangeControl
								label={__('Delay', 'animations-for-blocks')}
								value={delay}
								onChange={(nextDelay: number) => updateAttributes({delay: nextDelay})}
							/>
							<Button
								isSmall
								className={cx('wsd-anfb__button', {
									'wsd-anfb__button-active': showAdvancedSettings,
								})}
								isSecondary
								onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
							>
								<HStack align='center' justify='center'>
									<Icon icon={settingsIcon} size={16} />
									<span>{__('Advanced settings', 'animations-for-blocks')}</span>
								</HStack>
							</Button>
							{showAdvancedSettings && <>
								<ToggleControl
									label={__('Once', 'animations-for-blocks')}
									help={__('Animate only once, when scrolling down for the first time.', 'animations-for-blocks')}
									checked={once}
									onChange={() => updateAttributes({
										once: !once,
										mirror: !once && mirror ? !mirror : mirror,
									})}
								/>
								<ToggleControl
									label={__('Mirror', 'animations-for-blocks')}
									help={__('Animate out after scrolling past the element and in when scrolling up again.', 'animations-for-blocks')}
									checked={mirror}
									onChange={() => updateAttributes({
										mirror: !mirror,
										once: !mirror && once ? !once : once,
									})}
								/>
								<ButtonGroup.Radio
									isSmall
									pills
									label={__('Easing', 'animations-for-blocks')}
									help={__('Transition timing function.', 'animations-for-blocks')}
									options={EASINGS}
									value={easing}
									onChange={nextEasing => easing !== nextEasing && updateAttributes({easing: nextEasing})}
								/>
								<ButtonGroup.Radio
									isSmall
									pills
									label={__('Anchor placement', 'animations-for-blocks')}
									help={__('Defines which position of the element regarding to window should trigger the animation.', 'animations-for-blocks')}
									options={ANCHOR_PLACEMENTS}
									value={anchorPlacement}
									onChange={nextAnchorPlacement => anchorPlacement !== nextAnchorPlacement && updateAttributes({anchorPlacement: nextAnchorPlacement})}
								/>
								<UnitControl
									label={__('Offset', 'animations-for-blocks')}
									help={__('Offset from the original trigger point.', 'animations-for-blocks')}
									type='number'
									value={`${offset}px`}
									isDragEnabled={false}
									isUnitSelectTabbable={false}
									units={UNIT_CONTROL_UNITS}
									onChange={(nextOffset: string) => updateAttributes({offset: parseInt(nextOffset.replace('px', ''))})}
								/>
							</>}
						</>}
					</VStack>
				</PanelBody>
			</Panel>
			{showHelp && <HelpModal onRequestClose={() => setShowHelp(false)} />}
		</WPInspectorControls>
	)
}

export default InspectorControls
