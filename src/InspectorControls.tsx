import * as React from 'react'
import {__, _x, sprintf} from '@wordpress/i18n'

import {
	useRef,
	useState,
	useEffect,
} from '@wordpress/element'

import {
	// @ts-ignore
	RichText,
} from '@wordpress/block-editor'

import {
	Panel,
	PanelHeader,
	PanelBody,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Icon,
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

import AnimationControl from './animation-control'
import HelpModal from './HelpModal'
import PluginSettingsModal from './PluginSettingsModal'
import InspectorControlsLocation from './InspectorControlsLocation'

import {
	ANIMATIONS,
} from './aos-data'

import type {
	AnimationsForBlocks,
	AnimationsForBlocksBlockAttributes,
	AnimationsForBlocksBlockContext,
	AnimationContainerBlockAttributes,
} from './types'

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
	attributes: AnimationsForBlocksBlockAttributes & AnimationContainerBlockAttributes
	setAttributes: (nextAttributes: AnimationsForBlocksBlockAttributes) => void
}

const InspectorControls: React.FC<InspectorControlsProps> = ({
	clientId,
	attributes,
	setAttributes,
}) => {

	const {
		animationsForBlocks = {},
		isAnimationProvider = false,
	} = attributes

	const {
		animation,
	} = animationsForBlocks

	const hasAnimation = !!(animation && animation !== 'none')
	const [showHelp, setShowHelp] = useState(false)
	const [showPluginSettings, setShowPluginSettings] = useState(false)
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
		<InspectorControlsLocation>
			<Panel className='wsd-anfb'>
				<PanelHeader>
					<HStack alignment='center' justify='space-between'>
						<h2 style={{margin: 0}}>{__('Animation', 'animations-for-blocks')}</h2>
						<DropdownMenu
							icon={moreVerticalIcon}
							label={__('More actions', 'animations-for-blocks')}
							toggleProps={{
								size: 'small',
							}}
						>
							{({onClose}) => <>
								<MenuGroup className='wsd-anfb__menu-group'>
									<MenuItem
										icon={playIcon}
										children={__('Animate block', 'animations-for-blocks')}
										disabled={!hasAnimation || isAnimationProvider}
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
										ref={copyAnimationRef as any}
										onClick={onClose}
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
									<MenuItem
										icon={settingsIcon}
										children={__('Settings', 'animations-for-blocks')}
										onClick={() => {
											setShowPluginSettings(true)
											onClose()
										}}
									/>
								</MenuGroup>
								{Object.keys(animationsForBlocks).length > 0 && (
									<MenuGroup>
										<MenuItem
											icon={lineSolidIcon}
											children={__('Reset animation', 'animations-for-blocks')}
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
					<AnimationControl
						allowInherit={!isAnimationProvider}
						allowDefault
						value={animationsForBlocks}
						onChange={nextValue => setAttributes({animationsForBlocks: nextValue})}
					/>
				</PanelBody>
			</Panel>
			{showHelp && <HelpModal onRequestClose={() => setShowHelp(false)} />}
			{showPluginSettings && <PluginSettingsModal onRequestClose={() => setShowPluginSettings(false)} />}
		</InspectorControlsLocation>
	)
}

export default InspectorControls
