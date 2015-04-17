<?php
/**
 * The Panels meta box
 *
 * @var \ModularContent\PanelCollection $collection
 * @var array $cache
 * @var array $localization
 */
?>
<?php do_action( 'before_panel_meta_box' ); ?>
<div class="panels" data-depth="0">
	<script>
		var ModularContent = window.ModularContent || {};
		ModularContent.panels = [];
		<?php $cache = \ModularContent\Util::json_encode( $cache ); ?>
		ModularContent.cache = <?php echo $cache ? $cache : json_encode([ 'posts' => [], 'terms' => [], 'data' => [] ]); ?>;
		ModularContent.localization = <?php echo \ModularContent\Util::json_encode($localization); ?>;

		<?php foreach ( $collection->panels() as $panel ) { ?>
			ModularContent.panels.push(<?php echo \ModularContent\Util::json_encode($panel); ?>);
		<?php } ?>
	</script>
</div>
<a class="create-new-panel hide-if-no-js thickbox icon-plus-sign" href="#TB_inline?height=960&width=700&inlineId=new-panel" data-title="<?php printf(__('Select a %s Type', 'modular-content'), \ModularContent\Plugin::instance()->get_label()); ?>"><?php printf(__('Create %s', 'modular-content'), \ModularContent\Plugin::instance()->get_label()); ?></a>
<div id="new-panel">
	<h2 class="new-panel-list-title"></h2>
	<ul class="panel-selection-list">
		<?php foreach( \ModularContent\Plugin::instance()->registry()->registered_panels(get_post_type()) as $panel_type ): ?>
			<li class="new-panel-option">
				<?php echo $panel_type->get_admin_template(); ?>
			</li>
		<?php endforeach; ?>
	</ul>
</div>
<?php do_action( 'after_panel_meta_box' ); ?>
