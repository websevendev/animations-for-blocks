<?php

namespace wsd\anfb;

defined('ABSPATH') || exit;

/**
 * Register Animate on Scroll library.
 *
 * @see https://github.com/michalsnik/aos
 */
function register_aos() {
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
}

/**
 * Enqueue editor assets.
 */
function editor_assets() {
	$asset = include WSD_ANFB_DIR . '/build/index.asset.php';

	wp_enqueue_style(
		'animations-for-blocks',
		plugins_url('build/style-index.css', WSD_ANFB_FILE),
		[WSD_ANFB_AOS_HANDLE],
		$asset['version'],
		'all'
	);

	wp_enqueue_script(
		'animations-for-blocks',
		plugins_url('build/index.js', WSD_ANFB_FILE),
		array_merge($asset['dependencies'], [WSD_ANFB_AOS_HANDLE]),
		$asset['version']
	);

	wp_localize_script(
		'animations-for-blocks',
		'anfbData',
		[
			'unsupportedBlocks' => include WSD_ANFB_DIR . '/includes/unsupported-blocks.php',
		]
	);

	if(function_exists('wp_set_script_translations')) {
		wp_set_script_translations(
			'animations-for-blocks',
			'animations-for-blocks'
		);
	}
}

/**
 * Front end assets.
 */
function front_end_assets() {
	if(apply_filters('anfb_load_styles', true)) {
		/**
		 * Load Animate on Scroll styles.
		 */
		wp_enqueue_style(WSD_ANFB_AOS_HANDLE);
	}
	if(apply_filters('anfb_load_scripts', true)) {
		/**
		 * Initialize Animate on Scroll library.
		 */
		$asset = include WSD_ANFB_DIR . '/build/init.asset.php';
		wp_enqueue_script(
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
}

/**
 * AMP behavior.
 *
 * @param bool $load Load scripts.
 * @return bool
 */
function disable_on_amp($load) {
	if(function_exists('is_amp_endpoint') && is_amp_endpoint()) {
		return false;
	}
	return $load;
}
