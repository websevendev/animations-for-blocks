<?php
/**
 * Plugin Name: Animations for Blocks
 * Plugin URI: https://wordpress.org/plugins/animations-for-blocks
 * Description: Allows to add animations to Gutenberg blocks on scroll.
 * Version: 1.2
 * Author: websevendev
 * Author URI: https://github.com/websevendev
 */

namespace wsd\anfb;

use WP_HTML_Tag_Processor;
use WP_Block;

defined('ABSPATH') || exit;

function_exists('get_plugin_data') || require_once ABSPATH . 'wp-admin/includes/plugin.php';
$anfb_plugin = get_plugin_data(__FILE__, false, false);
define('WSD_ANFB_VER', $anfb_plugin['Version']);
define('WSD_ANFB_FILE', __FILE__);
define('WSD_ANFB_DIR', dirname(__FILE__));
define('WSD_ANFB_AOS_HANDLE', 'animate-on-scroll');


/**
 * @return array Default plugin options value.
 */
function get_default_settings() {
	return [
		'animateInEditor' => true,
		'lazyloadAssets' => true,
		'lenis' => 'off',
		'location' => 'default',
		'defaultAnimation' => [
			'animation' => 'scale',
			'variation' => 'in-x',
			'delay' => 0,
			'duration' => 800,
			'once' => true,
			'mirror' => false,
			'easing' => 'ease-out-cubic',
			'offset' => 120,
			'anchorPlacement' => 'top-bottom',
		],
	];
}


/**
 * @return array Animation providers provide these contexts and any blocks with animations should consume them.
 */
function get_animation_block_context_types() {
	return [
		/**
		 * @var bool `anfb/animation-container` block always provides contexts,
		 * but they should only be consumed when this is `true`, as in the
		 * "Animation container" block is actually in "provider mode".
		 */
		'animationsForBlocksProvider',
		/**
		 * @var array Provided animation configuration.
		 */
		'animationsForBlocksAnimation',
		/**
		 * @var number Added delay for every subsequent consumption.
		 */
		'animationsForBlocksStagger',
	];
}


/**
 * Register global plugin options.
 */
function register_settings() {

	$default_settings = get_default_settings();

	register_setting(
		'animations-for-blocks',
		'animations-for-blocks',
		[
			'description' => __('Animations for Blocks settings', 'animations-for-blocks'),
			'show_in_rest' => [
				'schema' => [
					'type' => 'object',
					'properties' => [
						'animateInEditor' => [
							'type' => 'boolean',
							'default' => $default_settings['animateInEditor'],
						],
						'lazyloadAssets' => [
							'type' => 'boolean',
							'default' => $default_settings['lazyloadAssets'],
						],
						'lenis' => [
							'type' => 'string',
							'enum' => ['off', 'on', 'animate'],
							'default' => $default_settings['lenis'],
						],
						'location' => [
							'type' => 'string',
							'enum' => ['default', 'advanced', 'styles'],
							'default' => $default_settings['location'],
						],
						'defaultAnimation' => [
							'type' => 'object',
							'properties' => [
								'animation' => [
									'type' => 'string',
									'enum' => ['fade', 'flip', 'slide', 'zoom', 'scale', 'inherit', 'default'],
									'default' => $default_settings['defaultAnimation']['animation'],
								],
								'variation' => [
									'type' => 'string',
									'enum' => ['fade', 'up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right', 'in', 'in-up', 'in-down', 'in-left', 'in-right', 'out', 'out-up', 'out-down', 'out-left', 'out-right', 'in-x', 'in-y', 'out-x', 'out-y'],
									'default' => $default_settings['defaultAnimation']['variation'],
								],
								'delay' => [
									'type' => 'number',
									'default' => $default_settings['defaultAnimation']['delay'],
								],
								'duration' => [
									'type' => 'number',
									'default' => $default_settings['defaultAnimation']['duration'],
								],
								'once' => [
									'type' => 'boolean',
									'default' => $default_settings['defaultAnimation']['once'],
								],
								'mirror' => [
									'type' => 'boolean',
									'default' => $default_settings['defaultAnimation']['mirror'],
								],
								'easing' => [
									'type' => 'string',
									'enum' => ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'ease-in-back', 'ease-out-back', 'ease-in-out-back', 'ease-in-sine', 'ease-out-sine', 'ease-in-out-sine', 'ease-in-quad', 'ease-out-quad', 'ease-in-out-quad', 'ease-in-cubic', 'ease-out-cubic', 'ease-in-out-cubic', 'ease-in-quart', 'ease-out-quart', 'ease-in-out-quart', 'linear'],
									'default' => $default_settings['defaultAnimation']['easing'],
								],
								'offset' => [
									'type' => 'number',
									'default' => $default_settings['defaultAnimation']['offset'],
								],
								'anchorPlacement' => [
									'type' => 'string',
									'enum' => ['top-bottom', 'center-bottom', 'bottom-bottom', 'top-center', 'center-center', 'bottom-center', 'top-top', 'bottom-top', 'center-top'],
									'default' => $default_settings['defaultAnimation']['anchorPlacement'],
								],
							],
							'default' => $default_settings['defaultAnimation'],
						],
					],
					'sanitize_callback' => function($settings) {
						/** Has a strict schema limited to bool/number/enum to guarantee integrity, options should only be updated via REST API. */
						return $settings;
					},
				],
			],
			'default' => $default_settings,
		]
	);
}
add_action('init', __NAMESPACE__ . '\\register_settings');


/**
 * @return array Blocks known to not work properly with Animations for Blocks.
 */
function get_unsupported_blocks() {
	return apply_filters('anfb_unsupported_blocks', [
		'core/freeform',
		'core/html',
		'core/shortcode',
		'core/legacy-widget',
	]);
}


/**
 * Determine if block is supported to have an animation.
 *
 * @param string $block_name
 * @return boolean
 */
function is_supported($block_name) {

	static $not_supported;
	if(!is_array($not_supported)) {
		$not_supported = get_unsupported_blocks();
	}

	return !in_array($block_name, $not_supported, true);
}


/**
 * Register plugin assets.
 *
 * @see https://github.com/michalsnik/aos
 */
function register_assets() {

	$asset = include WSD_ANFB_DIR . '/build/index.asset.php';

	wp_register_style(
		WSD_ANFB_AOS_HANDLE,
		plugins_url('build/aos.css', WSD_ANFB_FILE),
		[],
		$asset['version'], // 3.0.0-beta.6
		'all'
	);

	wp_register_script(
		WSD_ANFB_AOS_HANDLE,
		plugins_url('build/aos.js', WSD_ANFB_FILE),
		[],
		$asset['version'], // 3.0.0-beta.6
		['in_footer' => true, 'strategy' => 'defer']
	);

	$asset = include WSD_ANFB_DIR . '/build/lenis.asset.php';

	wp_register_style(
		'anfb/lenis',
		plugins_url('build/lenis.css', WSD_ANFB_FILE),
		[],
		$asset['version'], // 1.1.19
		'all'
	);

	wp_register_script(
		'anfb/lenis',
		plugins_url('build/lenis.js', WSD_ANFB_FILE),
		[],
		$asset['version'], // 1.1.19
		['in_footer' => true, 'strategy' => 'defer']
	);

	$asset = include WSD_ANFB_DIR . '/build/init.asset.php';
	wp_register_script(
		'animations-for-blocks',
		plugins_url('build/init.js', WSD_ANFB_FILE),
		[
			/** Use the filter below if your current setup already loads AOS. */
			apply_filters('anfb_aos_handle', WSD_ANFB_AOS_HANDLE),
		],
		$asset['version'],
		['in_footer' => true, 'strategy' => 'defer']
	);
}
add_action('init', __NAMESPACE__ . '\\register_assets');


/**
 * Enqueue editor assets.
 */
function editor_assets() {

	$asset = include WSD_ANFB_DIR . '/build/index.asset.php';

	wp_enqueue_style(
		'animations-for-blocks-admin',
		plugins_url('build/style-index.css', WSD_ANFB_FILE),
		[],
		$asset['version'],
		'all'
	);

	wp_enqueue_script(
		'animations-for-blocks-admin',
		plugins_url('build/index.js', WSD_ANFB_FILE),
		$asset['dependencies'],
		$asset['version'],
		false
	);

	wp_localize_script(
		'animations-for-blocks-admin',
		'anfbData',
		[
			'unsupportedBlocks' => get_unsupported_blocks(),
			'settings' => get_option('animations-for-blocks'),
		]
	);

	wp_set_script_translations('animations-for-blocks', 'animations-for-blocks');
}
add_action('enqueue_block_editor_assets', __NAMESPACE__ . '\\editor_assets', 5);


/**
 * Enqueue block assets (styles for `.editor-styles-wrapper`).
 */
function block_assets() {

	if(!is_admin()) {
		return;
	}

	$asset = include WSD_ANFB_DIR . '/build/index.asset.php';

	wp_enqueue_style(
		'animations-for-blocks-editor',
		plugins_url('build/editor.css', WSD_ANFB_FILE),
		[],
		$asset['version'],
		'all'
	);
}
add_action('enqueue_block_assets', __NAMESPACE__ . '\\block_assets');


/**
 * Enqueues front end AOS assets.
 */
function enqueue_front_end_aos_assets() {

	if(apply_filters('anfb_load_styles', true, 'aos')) {
		/** Load Animate on Scroll styles. */
		wp_enqueue_style(WSD_ANFB_AOS_HANDLE);
	}

	if(apply_filters('anfb_load_scripts', true, 'aos')) {
		/** Initialize Animate on Scroll library. */
		wp_enqueue_script('animations-for-blocks');
	}
}


/**
 * Enqueues front end Lenis assets.
 */
function enqueue_front_end_lenis_assets() {

	if(apply_filters('anfb_load_styles', true, 'lenis')) {
		wp_enqueue_style('anfb/lenis');
	}

	if(apply_filters('anfb_load_scripts', true, 'lenis')) {
		wp_enqueue_script('anfb/lenis');
	}
}

/**
 * Enqueue front end assets in head.
 */
function front_end_assets() {

	$options = get_option('animations-for-blocks');

	if(isset($options['lenis']) && $options['lenis'] === 'on') {
		enqueue_front_end_lenis_assets();
	}

	if($options['lazyloadAssets']) {
		return;
	}

	enqueue_front_end_aos_assets();
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\\front_end_assets', 500);


/**
 * AMP behavior.
 *
 * @param bool $load Load assets.
 * @return bool
 */
function disable_on_amp($load) {

	if(function_exists('is_amp_endpoint') && is_amp_endpoint()) {
		return false;
	}

	return $load;
}
add_filter('anfb_load_styles', __NAMESPACE__ . '\\disable_on_amp');
add_filter('anfb_load_scripts', __NAMESPACE__ . '\\disable_on_amp');


/**
 * @param array $args Animation config.
 * @return array Attributes to add to root element.
 */
function get_animation_attributes($args = []) {

	$args = wp_parse_args($args, [
		'animation' => 'none',
		'variation' => '',
		'delay' => 0,
		'duration' => 400,
		'once' => false,
		'mirror' => false,
		'easing' => 'ease',
		'offset' => 120,
		'anchorPlacement' => 'top-bottom',
	]);

	$attributes = [];

	if(empty($args['animation']) || $args['animation'] === 'none') {
		return $attributes;
	}

	/** Animation. */
	$attributes['data-aos'] = $args['animation'] === $args['variation']
							? $args['animation']
							: $args['animation'] . '-' . $args['variation'];

	/** Delay. */
	if(is_numeric($args['delay']) && (int)$args['delay'] !== 0) {
		$attributes['data-aos-delay'] = (int)$args['delay'];
	}

	/** Duration. */
	if(is_numeric($args['duration']) && (int)$args['duration'] !== 400) {
		$attributes['data-aos-duration'] = (int)$args['duration'];
	}

	/** Easing. */
	if(!empty($args['easing']) && $args['easing'] !== 'ease') {
		$attributes['data-aos-easing'] = $args['easing'];
	}

	/** Once. */
	if($args['once'] === 'true' || $args['once'] === true) {
		$attributes['data-aos-once'] = 'true';
	}

	/** Mirror. */
	if($args['mirror'] === 'true' || $args['mirror'] === true) {
		$attributes['data-aos-mirror'] = 'true';
	}

	/** Offset. */
	if(is_numeric($args['offset']) && (int)$args['offset'] !== 120) {
		$attributes['data-aos-offset'] = (int)$args['offset'];
	}

	/** Anchor placement. */
	if(!empty($args['anchorPlacement']) && $args['anchorPlacement'] !== 'top-bottom') {
		$attributes['data-aos-anchor-placement'] = $args['anchorPlacement'];
	}

	return apply_filters('anfb_aos_attributes', $attributes, $args);
}


/**
 * Add animation attributes to root element.
 *
 * @param string $html Block HTML.
 * @param array $args Animation config.
 * @return string Block HTML with animation attributes.
 */
function add_animation_attributes($html, $args) {

	$tags = new WP_HTML_Tag_Processor($html);
	if($tags->next_tag()) {

		/** Already has animation attributes. */
		if($tags->get_attribute('data-aos')) {
			return $html;
		}

		/** Add animation attributes. */
		foreach(get_animation_attributes($args) as $key => $value) {
			$tags->set_attribute($key, $value);
		}

		return $tags->get_updated_html();
	}

	return $html;
}


/**
 * @param array $block_attributes
 * @return bool Block attributes have an animation.
 */
function has_animation($block_attributes) {
	return (
		is_array($block_attributes)
		&& isset($block_attributes['animationsForBlocks'])
		&& isset($block_attributes['animationsForBlocks']['animation'])
		&& !empty($block_attributes['animationsForBlocks']['animation'])
		&& $block_attributes['animationsForBlocks']['animation'] !== 'none'
	);
}


/**
 * @param array $block_attributes
 * @return bool Block with these attributes is an animation provider.
 */
function is_animation_provider($block_attributes) {
	return (
		is_array($block_attributes)
		&& isset($block_attributes['isAnimationProvider'])
		&& $block_attributes['isAnimationProvider']
	);
}


/**
 * @param array $block_context
 * @return array|false
 */
function get_animation_from_context($block_context) {

	if(
		is_array($block_context)
		&& isset($block_context['animationsForBlocksProvider'])
		&& $block_context['animationsForBlocksProvider']
		&& isset($block_context['animationsForBlocksAnimation'])
		&& is_array($block_context['animationsForBlocksAnimation'])
		&& isset($block_context['animationsForBlocksAnimation']['animation'])
		&& !empty($block_context['animationsForBlocksAnimation']['animation'])
		&& !in_array($block_context['animationsForBlocksAnimation']['animation'], ['none', 'inherit'], true)
	) {
		if($block_context['animationsForBlocksAnimation']['animation'] === 'default') {
			return get_default_animation();
		}
		return $block_context['animationsForBlocksAnimation'];
	}

	return false;
}


/**
 * @return array Default animation configuration from plugin options.
 */
function get_default_animation() {

	static $default_animation = null;
	if(!is_null($default_animation)) {
		return $default_animation;
	}

	$options = get_option('animations-for-blocks');
	if(isset($options['defaultAnimation'])) {
		$default_animation = $options['defaultAnimation'];
		return $default_animation;
	}

	$default_settings = get_default_settings();
	$default_animation = $default_settings['defaultAnimation'];
	return $default_animation;
}


/**
 * @return bool This is likely the Block Editor rendering a dynamic block server-side.
 */
function is_rest_edit_request() {
	return (
		defined('REST_REQUEST')
		&& REST_REQUEST
		&& isset($_REQUEST['context'])
		&& $_REQUEST['context'] === 'edit'
	);
}


/**
 * Register blocks added by this plugin.
 */
function register_blocks() {
	register_block_type_from_metadata(__DIR__ . '/build/blocks/animation-container');
}
add_action('init', __NAMESPACE__ . '\\register_blocks');


/**
 * @param array $args Array of arguments for registering a block type.
 * @param string $block_name Block type name including namespace.
 * @return array
 */
function block_args($args, $block_name) {

	if(!is_supported($block_name)) {
		return $args;
	}

	if(!isset($args['attributes']) || !is_array($args['attributes'])) {
		$args['attributes'] = [];
	}

	/** Register ANFB attribute, this is necessary for `/wp-json/wp/v2/block-renderer` REST endpoint to not throw `rest_additional_properties_forbidden`. */
	$args['attributes']['animationsForBlocks'] = [
		'type' => 'object',
	];

	if(!isset($args['uses_context']) || !is_array($args['uses_context'])) {
		$args['uses_context'] = [];
	}

	/** Ensure blocks that can use animations can also consume animation context values. */
	foreach(get_animation_block_context_types() as $context_type) {
		$args['uses_context'][] = $context_type;
	}

	return $args;
}
add_filter('register_block_type_args', __NAMESPACE__ . '\\block_args', 10, 2);


/**
 * @see https://github.com/WordPress/gutenberg/issues/68608
 * @param array $context Block context.
 * @param array $parsed_block
 * @param WP_Block|null $parent_block
 * @return array
 */
function filter_animation_context($context, $parsed_block, $parent_block) {

	/** Used to retain animation-related block context values of the last `core/post-template` block that was rendered. */
	static $stored_context = null;

	/** Apply stored context to blocks that have the `inherit` animation inside Post Template block. */
	if(
		!is_null($stored_context)
		&& !is_null($parent_block)
		&& has_animation($parsed_block['attrs'])
		&& $parsed_block['attrs']['animationsForBlocks']['animation'] === 'inherit'
		&& isset($context['postType']) && isset($context['postId']) // Is probably in Post Template block
	) {
		foreach($stored_context as $key => $value) {
			$context[$key] = $value;
		}
	}

	/** `core/post-template` doesn't pass the context down, store it manually. */
	if(
		$parsed_block['blockName'] === 'core/post-template'
		&& isset($context['animationsForBlocksProvider'])
		&& $context['animationsForBlocksProvider']
		&& isset($context['animationsForBlocksAnimation'])
	) {
		$stored_context = [];
		foreach(get_animation_block_context_types() as $context_type) {
			if(isset($context[$context_type])) {
				$stored_context[$context_type] = $context[$context_type];
			}
		}
	}

	return $context;
}
add_filter('render_block_context', __NAMESPACE__ . '\\filter_animation_context', 11, 3);


/**
 * Add animation attributes to blocks' root HTML element when applicable.
 *
 * @param string $block_content Rendered block.
 * @param string $parsed_block Parsed array representation of block.
 * @param WP_Block $block
 * @return string
 */
function animate_block($block_content, $parsed_block, $block) {

	static $cumulative_stagger = 0;
	if($cumulative_stagger > 0 && is_animation_provider($parsed_block['attrs'])) {
		$cumulative_stagger = 0;
	}

	if(
		is_supported($parsed_block['blockName'])
		&& has_animation($parsed_block['attrs'])
		&& !is_animation_provider($parsed_block['attrs'])
		&& !is_rest_edit_request() // Don't animate server-side rendered blocks.
	) {

		/** Lazyload assets. */
		static $lazyloaded = false;
		if(!$lazyloaded) {

			$options = get_option('animations-for-blocks');

			if(isset($options['lenis']) && $options['lenis'] === 'animate') {
				enqueue_front_end_lenis_assets();
			}

			if($options['lazyloadAssets']) {
				enqueue_front_end_aos_assets();
			}

			$lazyloaded = true;
		}

		$animation_name = $parsed_block['attrs']['animationsForBlocks']['animation'];

		/** Determine the animation configuration to use. */
		if($animation_name === 'inherit') {
			if($inherited_animation = get_animation_from_context($block->context)) {
				$animation_config = $inherited_animation;
				$stagger = (int)$block->context['animationsForBlocksStagger'];
				$animation_config['delay'] = ($animation_config['delay'] ?? 0) + $cumulative_stagger;
				$cumulative_stagger += $stagger;
			} else {
				return $block_content;
			}
		} elseif($animation_name === 'default') {
			$animation_config = get_default_animation();
		} else {
			$animation_config = $parsed_block['attrs']['animationsForBlocks'];
		}

		return add_animation_attributes($block_content, $animation_config);
	}

	return $block_content;
}
add_filter('render_block', __NAMESPACE__ . '\\animate_block', 10, 3);


/**
 * Add GitHub link on the plugins page.
 *
 * @param array $plugin_meta
 * @param string $plugin_file
 * @return array
 */
function github_link($plugin_meta, $plugin_file) {
	if($plugin_file === plugin_basename(WSD_ANFB_FILE)) {
		$plugin_meta[] = '<a href="https://github.com/websevendev/animations-for-blocks" target="_blank" rel="noopener noreferrer">GitHub</a>';
	}
	return $plugin_meta;
}
add_filter('plugin_row_meta', __NAMESPACE__ . '\\github_link', 10, 2);
