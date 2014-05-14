<?php

/**
 * Template for a single panel
 *
 * @var \ModularContent\PanelType $this
 * @var array $data
 */

?>

<div class="panel-template" data-panel-type="<?php esc_attr_e($this->id); ?>">
	<div class="thumbnail">
		<span class="panel-icon"><img src="<?php echo esc_url($this->get_icon()); ?>" alt="<?php esc_attr_e($this->get_label()); ?>" /></span>
		<span class="panel-title"><?php esc_html_e($this->get_label()); ?></span>
		<span class="panel-description"><?php esc_html_e($this->get_description()); ?></span>
	</div>
	<script type="text/html" class="template" id="tmpl-panel-<?php esc_attr_e($this->id); ?>">
		<div class="panel-row panel-type-<?php esc_attr_e($this->id); ?>" id="panel-row-{{data.panel_id}}">
			<div class="panel-row-header">
				<span class="panel-actions"><a class="delete_panel icon-remove" title="<?php _e('Delete this panel', 'modular-content'); ?>" href="#"></a> <span class="move-panel icon-reorder" title="<?php _e('Drag to change panel order', 'modular-content'); ?>"></span></span>
				<a href="#" class="panel-label edit_panel" title="<?php _e('Edit Panel', 'modular-content'); ?>"><span class="panel-type"><?php esc_html_e($this->get_label()); ?></span><span class="divider"> | </span><span class="panel-title">{{data.panel_title}}</span></a>
				<input type="hidden" name="panel_id[]" value="{{data.panel_id}}" />
				<input type="hidden" name="{{data.panel_id}}[type]" value="<?php esc_attr_e($this->id); ?>" />
			</div>
			<div class="panel-row-editor">
				<?php foreach ( $this->fields as $field ) {
					$field->render();
				} ?>
			</div>
		</div>
	</script>
</div>
