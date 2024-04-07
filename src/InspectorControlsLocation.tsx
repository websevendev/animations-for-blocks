import * as React from 'react'
import {__, _x} from '@wordpress/i18n'

import {
	// @ts-ignore
	InspectorControls,
	// @ts-ignore
	InspectorAdvancedControls,
} from '@wordpress/block-editor'

import {
	usePluginSettings,
} from './PluginSettings'

export interface InspectorControlsLocationProps extends React.PropsWithChildren {}

const InspectorControlsLocation: React.FC<InspectorControlsLocationProps> = ({
	children,
}) => {

	const {
		location = 'default',
	} = usePluginSettings()

	if(location === 'advanced') {
		return (
			<InspectorAdvancedControls>
				{children}
			</InspectorAdvancedControls>
		)
	}

	return (
		<InspectorControls group={location}>
			{children}
		</InspectorControls>
	)
}

export default InspectorControlsLocation
