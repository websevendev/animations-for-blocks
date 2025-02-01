import * as React from 'react'
import {__, _x} from '@wordpress/i18n'

import {
	RangeControl as WPRangeControl,
} from '@wordpress/components'

import './style.scss'

const MARKS = [
	{
		label: `0`,
		value: 0,
	},
	{
		label: `500${_x('ms', 'Milliseconds', 'animations-for-blocks')}`,
		value: 500,
	},
	{
		label: `1${_x('s', 'Seconds', 'animations-for-blocks')}`,
		value: 1000,
	},
	{
		label: `1.5${_x('s', 'Seconds', 'animations-for-blocks')}`,
		value: 1500,
	},
	{
		label: `2${_x('s', 'Seconds', 'animations-for-blocks')}`,
		value: 2000,
	},
	{
		label: `2.5${_x('s', 'Seconds', 'animations-for-blocks')}`,
		value: 2500,
	},
	{
		label: `3${_x('s', 'Seconds', 'animations-for-blocks')}`,
		value: 3000,
	},
]

const renderTooltip = (value: number | '' | null = 0) => `${value}${_x('ms', 'Milliseconds', 'animations-for-blocks')}`

export interface RangeControlProps {
	label?: string
	help?: string
	max?: number
	value: number
	onChange: (nextValue?: number) => void
}

/**
 * Range control tailored to modify AOS duration and delay.
 */
const RangeControl: React.FC<RangeControlProps> = ({
	label,
	help,
	max = 3000,
	value,
	onChange,
}) => {
	return (
		<WPRangeControl
			className='wsd-anfb__range-control'
			label={label}
			help={help}
			value={value}
			onChange={onChange}
			min={0}
			step={50}
			max={max}
			withInputField={false}
			marks={MARKS}
			renderTooltipContent={renderTooltip}
			__nextHasNoMarginBottom
		/>
	)
}

export default RangeControl
