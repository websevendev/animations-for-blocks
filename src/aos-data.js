import {
	__,
} from '@wordpress/i18n';

export const ANIMATIONS = [
	{
		label: __('None', 'animations-for-blocks'),
		value: 'none',
	},
	{
		label: __('Fade', 'animations-for-blocks'),
		value: 'fade',
	},
	{
		label: __('Flip', 'animations-for-blocks'),
		value: 'flip',
	},
	{
		label: __('Slide', 'animations-for-blocks'),
		value: 'slide',
	},
	{
		label: __('Zoom', 'animations-for-blocks'),
		value: 'zoom',
	},
];

export const VARIATIONS = {
	fade: [
		{
			label: __('Fade in', 'animations-for-blocks'),
			value: 'fade',
		},
		{
			label: __('Fade up', 'animations-for-blocks'),
			value: 'up',
		},
		{
			label: __('Fade down', 'animations-for-blocks'),
			value: 'down',
		},
		{
			label: __('Fade left', 'animations-for-blocks'),
			value: 'left',
		},
		{
			label: __('Fade right', 'animations-for-blocks'),
			value: 'right',
		},
		{
			label: __('Fade up left', 'animations-for-blocks'),
			value: 'up-left',
		},
		{
			label: __('Fade up right', 'animations-for-blocks'),
			value: 'up-right',
		},
		{
			label: __('Fade down left', 'animations-for-blocks'),
			value: 'down-left',
		},
		{
			label: __('Fade down right', 'animations-for-blocks'),
			value: 'down-right',
		},
	],
	flip: [
		{
			label: __('Flip up', 'animations-for-blocks'),
			value: 'up',
		},
		{
			label: __('Flip down', 'animations-for-blocks'),
			value: 'down',
		},
		{
			label: __('Flip left', 'animations-for-blocks'),
			value: 'left',
		},
		{
			label: __('Flip right', 'animations-for-blocks'),
			value: 'right',
		},
	],
	slide: [
		{
			label: __('Slide up', 'animations-for-blocks'),
			value: 'up',
		},
		{
			label: __('Slide down', 'animations-for-blocks'),
			value: 'down',
		},
		{
			label: __('Slide left', 'animations-for-blocks'),
			value: 'left',
		},
		{
			label: __('Slide right', 'animations-for-blocks'),
			value: 'right',
		},
	],
	zoom: [
		{
			label: __('Zoom in', 'animations-for-blocks'),
			value: 'in',
		},
		{
			label: __('Zoom in up', 'animations-for-blocks'),
			value: 'in-up',
		},
		{
			label: __('Zoom in down', 'animations-for-blocks'),
			value: 'in-down',
		},
		{
			label: __('Zoom in left', 'animations-for-blocks'),
			value: 'in-left',
		},
		{
			label: __('Zoom in right', 'animations-for-blocks'),
			value: 'in-right',
		},
		{
			label: __('Zoom out', 'animations-for-blocks'),
			value: 'out',
		},
		{
			label: __('Zoom out up', 'animations-for-blocks'),
			value: 'out-up',
		},
		{
			label: __('Zoom out down', 'animations-for-blocks'),
			value: 'out-down',
		},
		{
			label: __('Zoom out left', 'animations-for-blocks'),
			value: 'out-left',
		},
		{
			label: __('Zoom out right', 'animations-for-blocks'),
			value: 'out-right',
		},
	],
};

export const EASINGS = [
	{
		label: __('ease', 'animations-for-blocks'),
		value: 'ease',
	},
	{
		label: __('ease-in', 'animations-for-blocks'),
		value: 'ease-in',
	},
	{
		label: __('ease-out', 'animations-for-blocks'),
		value: 'ease-out',
	},
	{
		label: __('ease-in-out', 'animations-for-blocks'),
		value: 'ease-in-out',
	},
	{
		label: __('ease-in-back', 'animations-for-blocks'),
		value: 'ease-in-back',
	},
	{
		label: __('ease-out-back', 'animations-for-blocks'),
		value: 'ease-out-back',
	},
	{
		label: __('ease-in-out-back', 'animations-for-blocks'),
		value: 'ease-in-out-back',
	},
	{
		label: __('ease-in-sine', 'animations-for-blocks'),
		value: 'ease-in-sine',
	},
	{
		label: __('ease-out-sine', 'animations-for-blocks'),
		value: 'ease-out-sine',
	},
	{
		label: __('ease-in-out-sine', 'animations-for-blocks'),
		value: 'ease-in-out-sine',
	},
	{
		label: __('ease-in-quad', 'animations-for-blocks'),
		value: 'ease-in-quad',
	},
	{
		label: __('ease-out-quad', 'animations-for-blocks'),
		value: 'ease-out-quad',
	},
	{
		label: __('ease-in-out-quad', 'animations-for-blocks'),
		value: 'ease-in-out-quad',
	},
	{
		label: __('ease-in-cubic', 'animations-for-blocks'),
		value: 'ease-in-cubic',
	},
	{
		label: __('ease-out-cubic', 'animations-for-blocks'),
		value: 'ease-out-cubic',
	},
	{
		label: __('ease-in-out-cubic', 'animations-for-blocks'),
		value: 'ease-in-out-cubic',
	},
	{
		label: __('ease-in-quart', 'animations-for-blocks'),
		value: 'ease-in-quart',
	},
	{
		label: __('ease-out-quart', 'animations-for-blocks'),
		value: 'ease-out-quart',
	},
	{
		label: __('ease-in-out-quart', 'animations-for-blocks'),
		value: 'ease-in-out-quart',
	},
	{
		label: __('linear', 'animations-for-blocks'),
		value: 'linear',
	},
];

export const ANCHOR_PLACEMENTS = [
	{
		label: __('top-bottom', 'animations-for-blocks'),
		value: 'top-bottom',
	},
	{
		label: __('center-bottom', 'animations-for-blocks'),
		value: 'center-bottom',
	},
	{
		label: __('bottom-bottom', 'animations-for-blocks'),
		value: 'bottom-bottom',
	},
	{
		label: __('top-center', 'animations-for-blocks'),
		value: 'top-center',
	},
	{
		label: __('center-center', 'animations-for-blocks'),
		value: 'center-center',
	},
	{
		label: __('bottom-center', 'animations-for-blocks'),
		value: 'bottom-center',
	},
	{
		label: __('top-top', 'animations-for-blocks'),
		value: 'top-top',
	},
	{
		label: __('bottom-top', 'animations-for-blocks'),
		value: 'bottom-top',
	},
	{
		label: __('center-top', 'animations-for-blocks'),
		value: 'center-top',
	},
];
