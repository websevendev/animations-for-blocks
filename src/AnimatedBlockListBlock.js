import {
	Component,
} from '@wordpress/element';

import AOS from 'aos';

import {
	getAnimationProps,
} from './utils';

/**
 * BlockListBlock wrapper that includes AOS animation handling.
 */
export default class AnimatedBlockListBlock extends Component {
	static onAnimationCompleteTimeout = false;
	static aosRefreshTimeout = false;

	constructor(props) {
		super(props);

		this.state = {
			animated: false,
		};

		this.animate = this.animate.bind(this);
		this.onAnimationStart = this.onAnimationStart.bind(this);
		this.onAnimationComplete = this.onAnimationComplete.bind(this);
		this.refreshAOS = this.refreshAOS.bind(this);
		this.getWrapperProps = this.getWrapperProps.bind(this);
	}

	/**
	 * Animate the block.
	 */
	animate() {
		if(this.state.animated) {
			/**
			 * Reanimate the block.
			 */
			this.setState({animated: false});
		} else {
			/**
			 * Block is currently in previous animation, cancel it and then reanimate.
			 */
			const block = document.getElementById('block-' + this.props.clientId);
			if(block) {
				block.setAttribute('data-aos-duration', 50);
			}
			clearTimeout(this.onAnimationCompleteTimeout);
			this.onAnimationComplete(true);
		}
	}

	/**
	 * Tasks to do when animation started.
	 */
	onAnimationStart() {
		const {animationsForBlocks} = this.props.block.attributes;
		const {
			delay,
			duration,
		} = animationsForBlocks;
		const animationDuration = (delay || 0) + (duration || 400);

		/**
		 * Mark animation complete once the delay + duration time has passed.
		 */
		this.onAnimationCompleteTimeout = setTimeout(() => this.onAnimationComplete(), animationDuration);
	}

	/**
	 * Tasks to do after animation completed.
	 *
	 * @param {boolean} reanimate Animate again immediately.
	 */
	onAnimationComplete(reanimate = false) {
		/**
		 * Remove classes added by AOS library.
		 */
		const block = document.getElementById('block-' + this.props.clientId);
		if(block) {
			block.classList.remove('aos-init');
			block.classList.remove('aos-animate');
		}

		/**
		 * Mark block as animated.
		 */
		this.setState({animated: true}, () => {
			/**
			 * Reanimate immediately.
			 */
			if(reanimate) {
				this.setState({animated: false});
			}
		});
	}

	/**
	 * Refresh AOS to animate blocks that need animation.
	 */
	refreshAOS() {
		clearTimeout(this.aosRefreshTimeout);
		this.aosRefreshTimeout = setTimeout(() => AOS.refreshHard(), 250);
	}

	/**
	 * Listen to events.
	 */
	componentDidMount() {
		/**
		 * Triggered when animation has started.
		 */
		document.addEventListener('aos:in:' + this.props.clientId, this.onAnimationStart);

		/**
		 * Triggered when animation options have been changed.
		 */
		document.addEventListener('anfb:update:' + this.props.clientId, this.animate);

		/**
		 * Triggered when all block animations are requested.
		 */
		document.addEventListener('anfb:update', this.animate);
	}

	/**
	 * Cleanup event listeners.
	 */
	componentWillUnmount() {
		document.removeEventListener('aos:in:' + this.props.clientId, this.onAnimationStart);
		document.removeEventListener('anfb:update:' + this.props.clientId, this.animate);
		document.removeEventListener('anfb:update', this.animate);
	}

	/**
	 * Handle component updates.
	 *
	 * @param {object} prevProps
	 * @param {object} prevState
	 */
	componentDidUpdate(prevProps, prevState) {
		if(prevState.animated && !this.state.animated) {
			/**
			 * Refresh AOS when state changed from animated to not animated.
			 * This initiates new animation.
			 */
			this.refreshAOS();
		}
	}

	/**
	 * Include animation props in wrapper props when needed.
	 *
	 * @return {object} Wrapper props
	 */
	getWrapperProps() {
		let {wrapperProps} = this.props;

		/**
		 * Add animation wrapperProps when it hasn't been animated yet.
		 */
		if(!this.state.animated) {
			const {animationsForBlocks} = this.props.block.attributes;
			const animationProps = getAnimationProps(animationsForBlocks);
			if(animationProps['data-aos']) {
				/**
				 * Remove positioning attributes.
				 * In the editor animations are played on change, not based on position.
				 */
				delete animationProps['data-aos-once'];
				delete animationProps['data-aos-mirror'];
				delete animationProps['data-aos-offset'];
				delete animationProps['data-aos-anchorPlacement'];
				/**
				 * Add animationProps to wrapperProps.
				 */
				wrapperProps = {
					...wrapperProps,
					...animationProps,
					'data-aos-id': this.props.clientId,
					'data-aos-anchor': '.block-editor-block-list__block',
				};
			}
		}

		return wrapperProps;
	}

	/**
	 * Render BlockListBlock with custom wrapperProps.
	 */
	render() {
		const {BlockListBlock} = this.props;
		return <BlockListBlock {...this.props} wrapperProps={this.getWrapperProps()} />;
	}
}
