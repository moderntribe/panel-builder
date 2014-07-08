<?php

/**
 * The default view for rendering a panel of modular content.
 * Override this by creating modular-content/default.php in
 * your theme directory.
 */

$title = get_panel_var('title');
$panel = get_the_panel();
$children = $panel->get_children();
?>
<div class="panel panel-<?php echo $panel->get_type_object(); ?>" data-depth="<?php echo $panel->get_depth(); ?>">
	<?php if ( $title ): ?>
		<h3><?php echo $title; ?></h3>
	<?php endif; ?>

	<dl>
		<?php foreach ( get_panel_vars() as $key => $value ): ?>
			<?php if ( $key == 'title' ) { continue; } ?>
			<dt><?php esc_html_e($key); ?></dt>
			<dd><pre><?php esc_html_e(print_r($value, TRUE)); ?></pre></dd>
		<?php endforeach; ?>
	</dl>

	<?php if ( $children ): ?>
		<div class="panel-children">
			<?php foreach ( $children as $child ): ?>
				<?php echo $child->render(); ?>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</div>