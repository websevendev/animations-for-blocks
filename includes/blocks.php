<?php

namespace wsd\anfb;

defined('ABSPATH') || exit;

/**
 * When registering a block, add ANFB argument and wrap `render_callback`.
 *
 * @param array $args
 * @param string $name
 * @return array
 */
function block_args($args, $name) {
	static $not_supported;
	if(!is_array($not_supported)) {
		$not_supported = include WSD_ANFB_DIR . '/includes/unsupported-blocks.php';
	}
	if(in_array($name, $not_supported)) {
		return $args;
	}

	if(!isset($args['attributes'])) {
		$args['attributes'] = [];
	}

	/**
	 * Register ANFB attribute.
	 */
	$args['attributes']['animationsForBlocks'] = [
		'type' => 'object',
		'default' => [],
	];

	/**
	 * Override `render_callback` to add animation attributes.
	 */
	if(isset($args['render_callback']) && is_callable($args['render_callback'])) {
		$cb = $args['render_callback'];
		$args['render_callback'] = function($attributes, $content, $block = null) use ($cb, $name) {
			$rendered = call_user_func($cb, $attributes, $content, $block);
			if(
				!isset($attributes['animationsForBlocks'])
				|| !is_array($attributes['animationsForBlocks'])
			) {
				return $rendered;
			}
			if(
				isset($attributes['animationsForBlocks']['animation'])
				&& $attributes['animationsForBlocks']['animation'] !== 'none'
			) {
				return add_animation_attributes(
					$attributes['animationsForBlocks'],
					$rendered,
					$name
				);
			}
			return $rendered;
		};
	}

	return $args;
}
