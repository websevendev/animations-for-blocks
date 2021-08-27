/**
 * Construct props needed for animation from animationsForBlocks object.
 *
 * @param {object} animationsForBlocks ANFB settings attribute.
 * @return {object} AOS props.
 */
export const getAnimationProps = animationsForBlocks => {
	let animationProps = {};

	if(!animationsForBlocks) {
		return animationProps;
	}

	const {
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

	if(!animation || animation === 'none') {
		return animationProps;
	}

	/**
	 * Animation.
	 */
	animationProps['data-aos'] = animation === variation ? animation : animation + '-' + variation;

	/**
	 * Delay.
	 */
	if(delay && delay !== 0) {
		animationProps['data-aos-delay'] = parseInt(delay);
	}

	/**
	 * Duration.
	 */
	if(duration && duration !== 400) {
		animationProps['data-aos-duration'] = parseInt(duration);
	}

	/**
	 * Once.
	 */
	if(once) {
		animationProps['data-aos-once'] = 'true';
	}

	/**
	 * Mirror.
	 */
	if(mirror) {
		animationProps['data-aos-mirror'] = 'true';
	}

	/**
	 * Easing.
	 */
	if(easing && easing !== 'ease') {
		animationProps['data-aos-easing'] = easing;
	}

	/**
	 * Offset.
	 */
	if(offset && offset !== 120) {
		animationProps['data-aos-offset'] = parseInt(offset);
	}

	/**
	 * Anchor placement.
	 */
	if(anchorPlacement && anchorPlacement !== 'top-bottom') {
		animationProps['data-aos-anchor-placement'] = anchorPlacement;
	}

	return animationProps;
}
