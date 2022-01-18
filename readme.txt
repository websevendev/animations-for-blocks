=== Animations for Blocks ===
Contributors: websevendev
Tags: gutenberg, block, animation, animate, scroll, fade, flip, slide, zoom, move
Requires at least: 5.6
Tested up to: 5.9
Requires PHP: 5.4
Stable tag: 1.0.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Allows to add animations to Gutenberg blocks on scroll.

== Description ==

Lightweight plugin that adds additional inspector controls to Gutenberg blocks that allow to animate the block once it becomes visible to the user during scrolling. The controls can be used to select an animation type (fade, flip, slide, zoom), variation (different directions), as well as delay, duration and more advanced settings. Upon changing an option the animation can be immediately previewed in the editor.

This plugin uses [AOS - Animate on scroll library](https://github.com/michalsnik/aos) and adds its' stylesheet (**2.8 kB**) and script (**5.2 kB**) to the front end as well as a script that initializes the animations (**1.3 kB**).

== Frequently Asked Questions ==

= How do I add an animation? =
In your selected block's inspector controls (block settings) open the "Animation" panel and select an animation. The current block should display a preview of the selected animation and further options related to that animation will become available below.

= How does it work? =
Animations for Blocks plugin works by using the Animate on Scroll (AOS) library that is mostly CSS based with some JavaScript to handle initialization. The plugin adds attributes to block's root element that tell the AOS library how to animate it. Loading the necessary styles and scripts is also handled automatically by the plugin.

= Does it work for all blocks? =
It should work with normal blocks that render a valid WP Element that can utilize the `blocks.getSaveContent.extraProps` filter as well as dynamic blocks that utilize a `render_callback`. Third party blocks that do something unorthodox may not work.
[Known unsupported blocks](https://plugins.trac.wordpress.org/browser/animations-for-blocks/trunk/includes/unsupported-blocks.php)

= Disable block support =
The `anfb_unsupported_blocks` filter can be used in your child theme's `functions.php` file to disable block animation support.

    add_filter('anfb_unsupported_blocks', function($blocks) {
    	$blocks[] = 'core/button';
    	return $blocks;
    });

= What happens when I disable this plugin? =
After disabling this plugin blocks with animations can become invalid. From there you can attempt to recover the block by clicking "Attempt Block Recovery" which should remove the custom animation attributes. If you don't want to risk blocks becoming invalid you need to disable all animations before disabling the plugin.

= All the animated elements are invisible on the front end =
When none of the animated elements show up on your site it's possibly due to a JavaScript error preventing the initialization of AOS. Please open the Developer Tools (F12 on Chrome/Firefox) and look for any errors in the Console tab. You can contact support with the error message, include your site link if possible.

== Installation ==

= Install via admin dashboard =
1. Go to your **WordPress admin dashboard -> Plugins**.
2. Click "Add New".
3. Click "Upload Plugin".
4. Select the `animations-for-blocks.zip` file.
5. Click "Install Now".
6. Activate the plugin from **WordPress admin dashboard -> Plugins**.

= Manual install via FTP upload =
1. Upload the folder "animations-for-blocks" from `animations-for-blocks.zip` file to your WordPress installations `../wp-content/plugins` folder.
2. Activate the plugin from **WordPress admin dashboard -> Plugins**.

== Screenshots ==

1. Animations on the front end
2. Adding an animation
3. Animation controls

== Changelog ==

= 1.0.4 =
* Update block anchor selector.

= 1.0.3 =
* Use generated version number for AOS library.

= 1.0.2 =
* Fix encoding for dynamic blocks.

= 1.0.1 =
* Add more unsupported blocks.
* Move Animation Container block to "Design" category.

= 1.0.0 =
* Initial release.
