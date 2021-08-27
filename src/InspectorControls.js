import {
	__,
} from '@wordpress/i18n';

import {
	Component,
	Fragment,
} from '@wordpress/element';

import {
	InspectorControls,
} from '@wordpress/block-editor';

import {
	PanelBody,
	RadioControl,
	RangeControl,
	ToggleControl,
	SelectControl,
	TextControl,
	ButtonGroup,
	Button,
} from '@wordpress/components';

import cx from 'classnames';

import HelpModal from './HelpModal';

import {
	ANIMATIONS,
	VARIATIONS,
	EASINGS,
	ANCHOR_PLACEMENTS,
} from './aos-data';

const GLOBAL_UPDATE_EVENT = new CustomEvent('anfb:update');

/**
 * Inspector controls for Animations for Blocks.
 */
class AFGInspectorControls extends Component {
	static anfbUpdateEvent = false;

	constructor() {
		super(...arguments);

		this.state = {
			showAdvancedSettings: false,
		};

		this.updateAttributes = this.updateAttributes.bind(this);
	}

	/**
	 * Handle component mount.
	 */
	componentDidMount() {
		/**
		 * Setup event that is called when animation options are updated,
		 * used to trigger reanimation of the editor BlockListBlock.
		 */
		this.anfbUpdateEvent = new CustomEvent('anfb:update:' + this.props.clientId);
	}

	/**
	 * Update attributesForGutenberg attribute value.
	 *
	 * @param {object} attributesToUpdate
	 */
	updateAttributes(attributesToUpdate) {
		let {animationsForBlocks} = this.props.attributes;
		let nextAttributes = Object.assign({}, animationsForBlocks, attributesToUpdate);
		this.props.setAttributes({animationsForBlocks: nextAttributes});

		/**
		 * Trigger update event.
		 */
		if(nextAttributes.animation && nextAttributes.animation !== 'none') {
			document.dispatchEvent(this.anfbUpdateEvent);
		}
	}

	/**
	 * Render Animations for Blocks inspector controls.
	 */
	render() {
		let {animationsForBlocks} = this.props.attributes;

		/**
		 * Block doesn't support adding custom attributes.
		 */
		if(!animationsForBlocks) {
			return null;
		}

		let {showAdvancedSettings} = this.state;

		let {
			animation,
			variation,
			delay,
			duration,
			once,
			mirror,
			easing,
			offset,
			anchorPlacement,
		} = animationsForBlocks;

		return (
			<InspectorControls>
				<PanelBody
					title={__('Animation', 'animations-for-blocks')}
					className='wsd-anfb'
					initialOpen={animation ? animation !== 'none' : false}
				>
					<RadioControl
						label={__('Select animation', 'animations-for-blocks')}
						options={ANIMATIONS}
						selected={animation || 'none'}
						onChange={nextAnimation => {
							this.updateAttributes({
								animation: nextAnimation,
								variation: (nextAnimation === 'none' || VARIATIONS[nextAnimation].map(variation => variation.value).includes(variation))
											? variation
											: VARIATIONS[nextAnimation][0].value,
							});
						}}
					/>
					{animation && animation !== 'none' && (
						<Fragment>
							<RadioControl
								label={__('Animation variation', 'animations-for-blocks')}
								options={VARIATIONS[animation]}
								selected={variation || VARIATIONS[animation][0].value}
								onChange={nextVariation => this.updateAttributes({variation: nextVariation})}
							/>
							<RangeControl
								label={__('Animation delay (ms)', 'animations-for-blocks')}
								value={delay || 0}
								onChange={nextDelay => this.updateAttributes({delay: nextDelay})}
								min={0}
								step={50}
								max={3000}
							/>
							<RangeControl
								label={__('Animation duration (ms)', 'animations-for-blocks')}
								value={duration || 400}
								onChange={nextDuration => this.updateAttributes({duration: nextDuration})}
								min={0}
								step={50}
								max={3000}
							/>
							<ButtonGroup className='top attached anfb-button-group'>
								<Button
									className='anfb-button'
									isSecondary
									onClick={() => document.dispatchEvent(this.anfbUpdateEvent)}
									text={__('Animate block', 'animations-for-blocks')}
								/>
								<Button
									className='anfb-button'
									isSecondary
									onClick={() => document.dispatchEvent(GLOBAL_UPDATE_EVENT)}
									text={__('Animate all blocks', 'animations-for-blocks')}
								/>
							</ButtonGroup>
							<ButtonGroup className='bottom attached anfb-button-group'>
								<Button
									className={cx('anfb-button', {'is-toggled': showAdvancedSettings})}
									isSecondary
									onClick={() => this.setState({showAdvancedSettings: !showAdvancedSettings})}
									text={__('Advanced settings', 'animations-for-blocks')}
								/>
								<HelpModal />
							</ButtonGroup>
							<div className='anfb-advanced-settings' style={{display: showAdvancedSettings ? 'block' : 'none'}}>
								<ToggleControl
									label={__('Once', 'animations-for-blocks')}
									help={__('Animate only once, when scrolling down for the first time.', 'animations-for-blocks')}
									checked={!!once}
									onChange={() => this.updateAttributes({
										once: !once,
										mirror: !once && mirror ? !mirror : mirror,
									})}
								/>
								<ToggleControl
									label={__('Mirror', 'animations-for-blocks')}
									help={__('Animate out after scrolling past the element and in when scrolling up again.', 'animations-for-blocks')}
									checked={!!mirror}
									onChange={() => this.updateAttributes({
										mirror: !mirror,
										once: !mirror && once ? !once : once,
									})}
								/>
								<SelectControl
									label={__('Easing', 'animations-for-blocks')}
									help={__('Transition timing function', 'animations-for-blocks')}
									options={EASINGS}
									selected={easing || EASINGS[0].value}
									onChange={nextEasing => this.updateAttributes({easing: nextEasing})}
								/>
								<SelectControl
									label={__('Anchor placement', 'animations-for-blocks')}
									help={__('Defines which position of the element regarding to window should trigger the animation.', 'animations-for-blocks')}
									options={ANCHOR_PLACEMENTS}
									selected={anchorPlacement || ANCHOR_PLACEMENTS[0].value}
									onChange={nextAnchorPlacement => this.updateAttributes({anchorPlacement: nextAnchorPlacement})}
								/>
								<TextControl
									label={__('Offset', 'animations-for-blocks')}
									help={__('Offset (px) from the original trigger point.', 'animations-for-blocks')}
									type='number'
									value={offset || 120}
									onChange={nextOffset => this.updateAttributes({offset: parseInt(nextOffset)})}
								/>
							</div>
						</Fragment>
					)}
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default AFGInspectorControls;
