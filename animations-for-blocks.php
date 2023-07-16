<?php
/**
 * Plugin Name: Animations for Blocks
 * Plugin URI: https://wordpress.org/plugins/animations-for-blocks
 * Description: Allows to add animations to Gutenberg blocks on scroll.
 * Version: 1.1.2
 * Author: websevendev
 * Author URI: https://chap.website/author/websevendev
 */

namespace wsd\anfb;

use WP_HTML_Tag_Processor;

defined('ABSPATH') || exit;

function_exists('get_plugin_data') || require_once ABSPATH . 'wp-admin/includes/plugin.php';
$anfb_plugin = get_plugin_data(__FILE__, false, false);
define('WSD_ANFB_VER', $anfb_plugin['Version']);
define('WSD_ANFB_FILE', __FILE__);
define('WSD_ANFB_DIR', dirname(__FILE__));
define('WSD_ANFB_AOS_HANDLE', 'animate-on-scroll');

/**
 * Register global plugin options.
 */
function register_settings() {

	$default_settings = [
		'animateInEditor' => true,
		'lazyloadAssets' => false,
	];

	$sanitize_callback = function($settings) use ($default_settings) {

		if(!is_array($settings)) {
			return $default_settings;
		}

		return [
			'animateInEditor' => (bool)($settings['animateInEditor'] ?? $default_settings['animateInEditor']),
			'lazyloadAssets' => (bool)($settings['lazyloadAssets'] ?? $default_settings['lazyloadAssets']),
		];
	};

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
					],
					'sanitize_callback' => $sanitize_callback,
				],
			],
			'default' => $default_settings,
		]
	);
}
add_action('init', __NAMESPACE__ . '\\register_settings');


/**
 * Blocks known to not work properly with Animations for Blocks.
 *
 * @return array
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
		true
	);

	$asset = include WSD_ANFB_DIR . '/build/init.asset.php';
	wp_register_script(
		'animations-for-blocks',
		plugins_url('build/init.js', WSD_ANFB_FILE),
		array_merge(
			array_diff(
				$asset['dependencies'],
				apply_filters('anfb_init_exclude_deps', ['wp-polyfill']) // Shouldn't need polyfill.
			),
			[apply_filters('anfb_aos_handle', WSD_ANFB_AOS_HANDLE)]
		),
		$asset['version'],
		true
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

	if(function_exists('wp_set_script_translations')) {
		wp_set_script_translations('animations-for-blocks', 'animations-for-blocks');
	}
}
add_action('enqueue_block_editor_assets', __NAMESPACE__ . '\\editor_assets', 5);


/**
 * Enqueues front end assets.
 */
function enqueue_front_end_assets() {

	if(apply_filters('anfb_load_styles', true)) {
		/** Load Animate on Scroll styles. */
		wp_enqueue_style(WSD_ANFB_AOS_HANDLE);
	}

	if(apply_filters('anfb_load_scripts', true)) {
		/** Initialize Animate on Scroll library. */
		wp_enqueue_script('animations-for-blocks');
	}
}

/**
 * Enqueue front end assets in head.
 */
function front_end_assets() {

	$options = get_option('animations-for-blocks');
	if($options['lazyloadAssets']) {
		return;
	}

	enqueue_front_end_assets();
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
 * @param array $args ANFB settings.
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
 * @param array $args ANFB settings.
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
 * @param array $args
 * @param string $name
 * @return array
 */
function block_args($args, $name) {

	static $not_supported;
	if(!is_array($not_supported)) {
		$not_supported = get_unsupported_blocks();
	}

	if(in_array($name, $not_supported)) {
		return $args;
	}

	if(!isset($args['attributes'])) {
		$args['attributes'] = [];
	}

	/** Register ANFB attribute, this is necessary for `/wp-json/wp/v2/block-renderer` REST endpoint to not throw `rest_additional_properties_forbidden`. */
	$args['attributes']['animationsForBlocks'] = [
		'type' => 'object',
	];

	return $args;
}
add_filter('register_block_type_args', __NAMESPACE__ . '\\block_args', 10, 2);


/**
 * Add animation attributes to blocks' root HTML element when applicable.
 *
 * @param string $block_content Rendered block.
 * @param string $block Parsed array representation of block.
 * @return string
 */
function animate_block($block_content, $block) {

	static $not_supported;
	if(!is_array($not_supported)) {
		$not_supported = get_unsupported_blocks();
	}

	if(
		!in_array($block['blockName'], $not_supported, true)
		&& isset($block['attrs']['animationsForBlocks']['animation'])
		&& !empty($block['attrs']['animationsForBlocks']['animation'])
		&& $block['attrs']['animationsForBlocks']['animation'] !== 'none'
	) {

		if(
			defined('REST_REQUEST')
			&& REST_REQUEST
			&& isset($_REQUEST['context'])
			&& $_REQUEST['context'] === 'edit'
		) {
			/** Don't animate server-side rendered blocks. */
			return $block_content;
		}

		/** Lazyload assets. */
		static $lazyloaded = false;
		if(!$lazyloaded) {
			$options = get_option('animations-for-blocks');
			if($options['lazyloadAssets']) {
				enqueue_front_end_assets();
			}
			$lazyloaded = true;
		}

		return add_animation_attributes($block_content, $block['attrs']['animationsForBlocks']);
	}

	return $block_content;
}
add_filter('render_block', __NAMESPACE__ . '\\animate_block', 10, 2);


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
