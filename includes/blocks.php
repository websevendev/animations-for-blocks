<?php

namespace wsd\anfb;

defined('ABSPATH') || exit;

/**
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
		$not_supported = include WSD_ANFB_DIR . '/includes/unsupported-blocks.php';
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

		return add_animation_attributes(
			$block['attrs']['animationsForBlocks'],
			$block_content,
			$block['blockName']
		);
	}

	return $block_content;
}
add_filter('render_block', __NAMESPACE__ . '\\animate_block', 10, 2);
