<?php

/**
 * A wrapper around each modular panel.
 * Override this by creating modular-content/panel-wrapper.php in
 * your theme directory.
 *
 * IMPORTANT: the data attributes are REQUIRED for the live preview iframe to function, on the root panel only though.
 * Child panels should NOT get the data-modular-content attribute.
 *
 * @var \ModularContent\Panel $panel
 * @var int $index 0-based count of panels rendered thus far
 * @var string $html The rendered HTML of the panel
 */

$panel_index = get_nest_index();

$zebra = ( $panel_index % 2 == 0 ) ? 'odd' : 'even';

// Child Panel
if ( $panel->get_depth() >= 1 ) {

	$classes[] = 'panel-child';

	?>

	<article class="panel panel-child">

		<?php echo $html; ?>

	</article>

<?php } else { ?>

	<section
		class="panel panel-type-<?php esc_attr_e( $panel->get( 'type' ) ); ?> panel-<?php echo $zebra; ?>"
		data-type="<?php esc_attr_e( $panel->get( 'type' ) ); ?>"
		data-modular-content
	>
		<?php echo $html; ?>
	</section>

<?php } ?>
