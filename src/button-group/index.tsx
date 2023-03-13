import * as React from 'react'

import {
	BaseControl,
	ButtonGroup as WPButtonGroup,
	Button,
} from '@wordpress/components'

import {
	useInstanceId,
} from '@wordpress/compose'

import cx from 'classnames'

import './style.scss'

export interface ButtonGroupOption {
	label: string
	value: string
}

export interface ButtonGroupProps {
	id?: string
	label?: string
	hideLabelFromVision?: boolean
	help?: string
	className?: string

	options: ButtonGroupOption[]
	value?: ButtonGroupOption['value'][]
	onChange?: (nextValue: ButtonGroupOption['value'][]) => void

	/** Display as pills. */
	pills?: boolean
	/** Full width. */
	fluid?: boolean
	/** Small size buttons. */
	isSmall?: boolean
}

interface SubComponents {
	/** Button group with only one possible selection at a time. */
	Radio: typeof ButtonGroupRadio
}

export interface ButtonGroupButtonProps {
	groupProps: ButtonGroupProps & Record<string, any>
	option: ButtonGroupOption
}

const ButtonGroup: React.FC<ButtonGroupProps> & SubComponents = (props) => {

	const {
		id,
		label,
		hideLabelFromVision = false,
		help,
		className,
		options = [],
		value = [],
		onChange,
		pills = false,
		fluid = false,
		isSmall = false,
	} = props

	const instanceId = useInstanceId(options, 'wsd-anfb-button-group', id)

	return (
		<BaseControl
			id={instanceId}
			className={cx('wsd-anfb__button-group', {
				'wsd-anfb__button-group--fluid': fluid,
				'wsd-anfb__button-group--pills': pills,
			}, className)}
			label={label}
			help={help}
			hideLabelFromVision={hideLabelFromVision}
		>
			<WPButtonGroup>
				{options.map(({label, value: optionValue}) => {
					const isActive = value.includes(optionValue)
					return (
						<Button
							key={optionValue}
							isSmall={isSmall}
							variant={isActive ? 'primary' : 'secondary'}
							children={label}
							{...(onChange && {
								onClick: () => {
									onChange(
										isActive
											? value.filter(v => v !== optionValue)
											: value.concat(optionValue)
									)
								},
							})}
						/>
					)
				})}
			</WPButtonGroup>
		</BaseControl>
	)
}

export interface ButtonGroupRadioProps extends Omit<ButtonGroupProps, 'value' | 'onChange'> {
	value?: ButtonGroupOption['value']
	onChange?: (nextValue: ButtonGroupOption['value']) => void
}

const ButtonGroupRadio: React.FC<ButtonGroupRadioProps> = ({
	className,
	value,
	onChange,
	...props
}) => {
	return (
		<ButtonGroup
			className={cx('wsd-anfb__button-group-radio', className)}
			value={value ? [value] : []}
			{...(onChange && {
				onChange: nextValues => {
					onChange(
						nextValues.length > 0
							? nextValues[nextValues.length - 1]
							: ''
					)
				},
			})}
			{...props}
		/>
	)
}

ButtonGroup.Radio = ButtonGroupRadio

export default ButtonGroup
