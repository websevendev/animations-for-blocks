<?php

namespace wsd\anfb;

defined('ABSPATH') || exit;

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

	/**
	 * Animation.
	 */
	$attributes['data-aos'] = $args['animation'] === $args['variation']
							? $args['animation']
							: $args['animation'] . '-' . $args['variation'];

	/**
	 * Delay.
	 */
	if(is_numeric($args['delay']) && (int)$args['delay'] !== 0) {
		$attributes['data-aos-delay'] = (int)$args['delay'];
	}

	/**
	 * Duration.
	 */
	if(is_numeric($args['duration']) && (int)$args['duration'] !== 400) {
		$attributes['data-aos-duration'] = (int)$args['duration'];
	}

	/**
	 * Once.
	 */
	if($args['once'] === 'true') {
		$attributes['data-aos-once'] = 'true';
	}

	/**
	 * Mirror.
	 */
	if($args['mirror'] === 'true') {
		$attributes['data-aos-mirror'] = 'true';
	}

	/**
	 * Easing.
	 */
	if(!empty($args['easing']) && $args['easing'] !== 'ease') {
		$attributes['data-aos-easing'] = $args['easing'];
	}

	/**
	 * Offset.
	 */
	if(is_numeric($args['offset']) && (int)$args['offset'] !== 120) {
		$attributes['data-aos-offset'] = (int)$args['offset'];
	}

	/**
	 * Anchor placement.
	 */
	if(!empty($args['anchorPlacement']) && $args['anchorPlacement'] !== 'top-bottom') {
		$attributes['data-aos-anchor-placement'] = $args['anchorPlacement'];
	}

	return $attributes;
}

/**
 * Add animation attributes to root element.
 *
 * @param array $args ANFB settings.
 * @param string $html Block HTML.
 * @param string $name Block name.
 * @return string Block HTML with animation attributes.
 */
function add_animation_attributes($args, $html, $name = '') {
	$dom = get_dom($html);
	$body = $dom->getElementsByTagName('body')->item(0);
	/**
	 * Wrap elements when there are more than 1.
	 */
	if($body->childNodes->length > 1) {
		$container = $dom->createElement('div');
		$container->setAttribute('class', 'anfb-animation-container');
		$container->setAttribute('data-block', esc_attr($name));
		$remove = [];
		foreach($body->childNodes as $node) {
			if(is_dom_element($node)) {
				$container->appendChild($node->cloneNode(true));
				$remove[] = $node;
			}
		}
		foreach($remove as $node) {
			$node->parentNode->removeChild($node);
		}
		$body->appendChild($container);
	}
	/**
	 * Add attributes.
	 */
	foreach($body->childNodes as $root) {
		if(method_exists($root, 'setAttribute')) {
			foreach(get_animation_attributes($args) as $key => $value) {
				$root->setAttribute($key, esc_attr($value));
			}
		}
	}
	return get_body($dom->saveHTML());
}
