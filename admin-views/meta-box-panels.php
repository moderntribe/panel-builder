<?php
/**
 * The Panels meta box
 *
 * @var \ModularContent\PanelCollection $collection
 */
?>
<div class="panels">
	<script>
		var ModularContent = window.ModularContent || {};
		ModularContent.panels = [];
		<?php foreach ( $collection->panels() as $panel ): ?>
		ModularContent.panels.push(<?php echo json_encode($panel); ?>);
		<?php endforeach; ?>
	</script>
</div>
<a class="create-new-panel hide-if-no-js thickbox" href="#TB_inline?height=960&width=700&inlineId=new-panel"><?php _e('Create Panel', 'panels'); ?></a>
<div id="new-panel">
	<h2><?php _e('Select a Panel Type', 'panels'); ?></h2>
	<ul class="panel-selection-list">
		<?php foreach( \ModularContent\Plugin::instance()->registry()->registered_panels(get_post_type()) as $panel_type ): ?>
			<li class="new-panel-option">
				<?php echo $panel_type->get_admin_template(); ?>
			</li>
		<?php endforeach; ?>
	</ul>
</div>