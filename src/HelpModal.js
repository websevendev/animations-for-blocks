import {
	__,
} from '@wordpress/i18n';

import {
	Fragment,
	useState,
} from '@wordpress/element';

import {
	Button,
	Modal,
} from '@wordpress/components';

/**
 * Modal that displays help info for Animations for Blocks.
 */
let HelpModal;
export default HelpModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Fragment>
			<Button
				isSecondary
				className='anfb-help-button'
				aria-label={__('Show Animations for Blocks help', 'animations-for-blocks')}
				onClick={() => setIsOpen(true)}
				text={__('Show help')}
			/>
			{isOpen && (
				<Modal
					className='wsd-anfb-help'
					title={__('Animations for Blocks help', 'animations-for-blocks')}
					onRequestClose={() => setIsOpen(false)}
				>
					<div className='anfb-help'>
						<h3>{__(`Options`, 'animations-for-blocks')}</h3>
						<h4>{__(`Animation`, 'animations-for-blocks')}</h4>
						<p>{__(`Allows to select the type of animation you wish to use: Fade, Flip, Slide or Zoom. Set to None if you no longer wish to animate that block.`, 'animations-for-blocks')}</p>
						<h4>{__(`Animation variation`, 'animations-for-blocks')}</h4>
						<p>{__(`Allows to switch between the different variations of the selected animation, such as Fade in, Fade down, Slide left, Slide right, Zoom in, Zoom out, Zoom out left, etc.`, 'animations-for-blocks')}</p>
						<h4>{__(`Animation delay`, 'animations-for-blocks')}</h4>
						<p>{__(`Time in milliseconds to delay the animation (0 - 3000ms). Increasing this value will delay the appearance of the animated element.`, 'animations-for-blocks')}</p>
						<h4>{__(`Animation duration`, 'animations-for-blocks')}</h4>
						<p>{__(`Time in milliseconds that the animation takes to complete (0 - 3000ms). Increasing this value will make the animation play longer.`, 'animations-for-blocks')}</p>
						<h4>{__(`Once`, 'animations-for-blocks')}</h4>
						<p>{__(`When enabled, animation will only happen once, when scrolling down the page for the first time. When user scrolls up again and then down, then the block will no longer animate.`, 'animations-for-blocks')}</p>
						<h4>{__(`Mirror`, 'animations-for-blocks')}</h4>
						<p>{__(`When enabled, elements will animate out once the user has scrolled past them and will animate in when the user scrolls up again.`, 'animations-for-blocks')}</p>
						<h4>{__(`Easing`, 'animations-for-blocks')}</h4>
						<p>{__(`Allows to change between various CSS transition timing functions for the animation making it unfold differently.`, 'animations-for-blocks')}</p>
						<h4>{__(`Anchor placement`, 'animations-for-blocks')}</h4>
						<p>{__(`Allows to control what part of the animated element should trigger the animation when it becomes visible in the viewport.`, 'animations-for-blocks')}</p>
						<h4>{__(`Offset`, 'animations-for-blocks')}</h4>
						<p>{__(`Controls the offset (in pixels) from the original trigger point at which the animation should trigger in the viewport.`, 'animations-for-blocks')}</p>
						<h3>{__(`Broken block`, 'animations-for-blocks')}</h3>
						<p>{__(`If you enabled animation and the block broke it means it is not supported. Feel free to report it. To restore the block in working condition try "Undo", if possible "Attempt Block Recovery", or change to "Code editor" (Ctrl + Shift + Alt + M) and remove the animation attributes (eg: '"animationsForBlocks":{"animation":"fade"}') from the broken block.`, 'animations-for-blocks')}</p>
					</div>
				</Modal>
			)}
		</Fragment>
	);
};

