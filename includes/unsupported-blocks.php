<?php

namespace wsd\anfb;

defined('ABSPATH') || exit;

return apply_filters('anfb_unsupported_blocks', [
	'core/freeform',
	'core/html',
	'core/shortcode',
	'core/legacy-widget',
]);
