import * as React from 'react'
import {__} from '@wordpress/i18n'

import {
	Modal,
	ToggleControl,
	__experimentalVStack as VStack,
} from '@wordpress/components'

import {
	usePluginSettingsEdit,
	type PluginSettings,
} from './PluginSettings'

import ButtonGroup from './button-group'

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
		location = 'default',
	} = settings

	return (
		<Modal
			className='wsd-anfb__settings'
			title={__('Animations for Blocks settings', 'animations-for-blocks')}
			onRequestClose={onRequestClose}
		>
			<VStack className='wsd-anfb__settings__content'>
				<ToggleControl
					label={__('Automatic animation preview', 'animations-for-blocks')}
					help={__(`Play block animations in the editor automatically.`, 'animations-for-blocks')}
					checked={animateInEditor}
					onChange={() => setSettings({...settings, animateInEditor: !animateInEditor})}
				/>
				<ToggleControl
					label={__('Lazyload assets', 'animations-for-blocks')}
					help={__('Load assets only when a block with an animation is present on the current page.', 'animations-for-blocks')}
					checked={lazyloadAssets}
					onChange={() => setSettings({...settings, lazyloadAssets: !lazyloadAssets})}
				/>
				<ButtonGroup.Radio
					label={__('Inspector controls location', 'animations-for-blocks')}
					options={LOCATION_OPTIONS}
					value={location}
					onChange={nextLocation => setSettings({...settings, location: (nextLocation || 'default') as PluginSettings['location']})}
				/>
			</VStack>
		</Modal>
	)
}

export default PluginSettingsModal
