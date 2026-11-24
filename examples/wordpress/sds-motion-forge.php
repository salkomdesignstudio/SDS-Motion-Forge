<?php
/**
 * Plugin Name: SDS Motion Forge
 * Description: Loads the Motion Forge stylesheet on the front end so any block or template can use its classes.
 * Version: 1.0
 *
 * Drop this file into wp-content/mu-plugins/ (always on) or wp-content/plugins/sds-motion-forge/ and activate it.
 * Tested with WordPress (latest, Twenty Twenty-Five block theme) on PHP 8.3 and Motion Forge 5.1.0.
 */
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'sds-motion-forge',
		'https://cdn.jsdelivr.net/npm/@salkomdesignstudio/sds-motion-forge@5.1.0/dist/motion.min.css',
		array(),
		null
	);
} );

/*
 * Using it in the block editor:
 *   - Select a block, open Advanced and type a class into "Additional CSS class(es)", for example sds-aurora-text.
 *     The class lands on the block's outer element. On a Buttons block that is the wrapper around the link.
 *   - Effects that split text into letters (the physics text effects) or need child elements: use a Custom HTML block
 *     and write the spans yourself, see https://sds-motion-forge.netlify.app/docs.html#frameworks
 *   - To load only one category (about 6 to 9 KB) use dist/categories/text.min.css instead of dist/motion.min.css.
 */
