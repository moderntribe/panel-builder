<?php
/**
 * The Panels meta box
 *
 * @var \ModularContent\PanelCollection $collection
 */
?>
<?php do_action( 'before_panel_meta_box' ); ?>
<div class="panels" data-depth="0">
	<script>
		var ModularContent = window.ModularContent || {};
		ModularContent.panels = [];
		<?php foreach ( $collection->panels() as $panel ): ?>
		ModularContent.panels.push(<?php echo json_encode($panel); ?>);
		<?php endforeach; ?>
	</script>
</div>
<a class="create-new-panel hide-if-no-js thickbox icon-plus-sign" href="#TB_inline?height=960&width=700&inlineId=new-panel"><?php printf(__('Create %s', 'modular-content'), \ModularContent\Plugin::instance()->get_label()); ?></a>
<div id="new-panel">
	<h2><?php printf(__('Select a %s Type', 'modular-content'), \ModularContent\Plugin::instance()->get_label()); ?></h2>
	<ul class="panel-selection-list">
		<?php foreach( \ModularContent\Plugin::instance()->registry()->registered_panels(get_post_type()) as $panel_type ): ?>
			<li class="new-panel-option">
				<?php echo $panel_type->get_admin_template(); ?>
			</li>
		<?php endforeach; ?>
	</ul>
</div>
<?php do_action( 'after_panel_meta_box' ); ?>