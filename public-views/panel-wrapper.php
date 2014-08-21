<?php

/**
 * A wrapper around each modular panel.
 * Override this by creating modular-content/panel-wrapper.php in
 * your theme directory.
 *
 * @var \ModularContent\Panel $panel
 * @var int $index 0-based count of panels rendered thus far
 * @var string $html The rendered HTML of the panel
 */

$zebra = ( $index % 2 == 0 ) ? 'odd' : 'even';
?>
<div class="panel panel-type-<?php esc_attr_e($panel->get('type')); ?> panel-<?php echo $zebra; ?>">
	<?php echo $html; ?>
</div>