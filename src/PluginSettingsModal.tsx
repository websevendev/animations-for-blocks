import * as React from 'react'
import {__} from '@wordpress/i18n'

import {
	Button,
	Modal,
	ToggleControl,
	RadioControl,
	__experimentalVStack as VStack,
} from '@wordpress/components'

import isShallowEqual from '@wordpress/is-shallow-equal'

import {
	DEFAULT_ANIMATION,
	usePluginSettingsEdit,
	type PluginSettings,
} from './PluginSettings'

import ButtonGroup from './button-group'
import AnimationControl from './animation-control'

const LENIS_OPTIONS = [
	{
		label: __('Never', 'animations-for-blocks'),
		value: 'off',
	},
	{
		label: __('When the current page contains animations', 'animations-for-blocks'),
		value: 'animate',
	},
	{
		label: __('Always', 'animations-for-blocks'),
		value: 'on',
	},
]

const LOCATION_OPTIONS = [
	{
		label: __('Default', 'animations-for-blocks'),
		value: 'default',
	},
	{
		label: __('Styles', 'animations-for-blocks'),
		value: 'styles',
	},
	{
		label: __('Advanced', 'animations-for-blocks'),
		value: 'advanced',
	},
]

/**
 * Modal that displays help info for Animations for Blocks.
 */
const PluginSettingsModal = ({onRequestClose}) => {

	const [settings, setSettings] = usePluginSettingsEdit()

	const {
		animateInEditor,
		lazyloadAssets,
		lenis = 'off',
		location = 'default',
		defaultAnimation = DEFAULT_ANIMATION,
	} = settings

	return (
		<Modal
			className='wsd-anfb__settings'
			title={__('Animations for Blocks settings', 'animations-for-blocks')}
			onRequestClose={onRequestClose}
		>
			<VStack
				className='wsd-anfb__settings__content'
				spacing={8}
			>
				<ToggleControl
					label={__('Automatic animation preview', 'animations-for-blocks')}
					help={__(`Play block animations in the editor automatically.`, 'animations-for-blocks')}
					checked={animateInEditor}
					onChange={() => setSettings({...settings, animateInEditor: !animateInEditor})}
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={__('Lazyload assets', 'animations-for-blocks')}
					help={__('Load assets only when a block with an animation is present on the current page.', 'animations-for-blocks')}
					checked={lazyloadAssets}
					onChange={() => setSettings({...settings, lazyloadAssets: !lazyloadAssets})}
					__nextHasNoMarginBottom
				/>
				<RadioControl
					label={__('Load Lenis', 'animations-for-blocks')}
					help={__('Lenis is a smooth scroll library.', 'animations-for-blocks')}
					options={LENIS_OPTIONS}
					selected={lenis}
					onChange={nextValue => setSettings({...settings, lenis: nextValue as PluginSettings['lenis']})}
				/>
				<ButtonGroup.Radio
					label={__('Inspector controls location', 'animations-for-blocks')}
					options={LOCATION_OPTIONS}
					value={location}
					onChange={nextLocation => setSettings({...settings, location: (nextLocation || 'default') as PluginSettings['location']})}
				/>
				<AnimationControl
					label={__('Default animation', 'animations-for-blocks')}
					help={__('Animation that is used when the chosen animation is "Default".', 'animations-for-blocks')}
					value={defaultAnimation}
					onChange={nextValue => setSettings({...settings, defaultAnimation: nextValue})}
					required
				/>
				<Button
					className='wsd-anfb__settings__reset-button'
					size='small'
					variant='secondary'
					children={__('Reset default animation to default', 'animations-for-blocks')}
					onClick={() => setSettings({...settings, defaultAnimation: DEFAULT_ANIMATION})}
					disabled={isShallowEqual(DEFAULT_ANIMATION, defaultAnimation)}
				/>
			</VStack>
		</Modal>
	)
}

export default PluginSettingsModal
