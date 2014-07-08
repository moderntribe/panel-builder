<?php

/**
 * Template for a single panel
 *
 * @var \ModularContent\PanelType $this
 */

$singular = \ModularContent\Plugin::instance()->get_label();

?>

<div class="panel-template" data-panel-type="<?php esc_attr_e($this->id); ?>" <?php if ( $this->max_depth != self::NO_LIMIT ): ?>data-max_depth="<?php echo $this->max_depth; ?>"<?php endif; ?>>
	<div class="thumbnail">
		<span class="panel-icon"><img src="<?php echo esc_url($this->get_icon()); ?>" alt="<?php esc_attr_e($this->get_label()); ?>" /></span>
		<span class="panel-title"><?php esc_html_e($this->get_label()); ?></span>
		<span class="panel-description"><?php esc_html_e($this->get_description()); ?></span>
	</div>
	<script type="text/html" class="template" id="tmpl-panel-<?php esc_attr_e($this->id); ?>">
		<div class="panel-row panel-type-<?php esc_attr_e($this->id); ?>" id="panel-row-{{data.panel_id}}">
			<div class="panel-row-header">
				<span class="panel-actions"><a class="delete_panel icon-remove" title="<?php printf(__('Delete this %s', 'modular-content'), strtolower($singular)); ?>" href="#"></a> <span class="move-panel icon-reorder" title="<?php printf(__('Drag to change %s order', 'modular-content'), strtolower($singular)); ?>"></span></span>
				<a href="#" class="panel-label edit_panel" title="<?php printf(__('Edit %s', 'modular-content'), $singular); ?>"><span class="panel-type"><?php esc_html_e($this->get_label()); ?></span><span class="divider"> | </span><span class="panel-title">{{data.panel_title}}</span></a>
				<input type="hidden" name="panel_id[]" class="panel-id" value="{{data.panel_id}}" />
				<input type="hidden" name="{{data.panel_id}}[type]" class="panel-type" value="<?php esc_attr_e($this->id); ?>" />
				<input type="hidden" name="{{data.panel_id}}[depth]" class="panel-depth" value="{{data.depth}}" />
			</div>
			<div class="panel-row-editor">
				<?php foreach ( $this->fields as $field ) {
					$field->render();
				} ?>
				<?php if ( $this->max_children > 0 ): ?>
					<div class="panel-children-container">
						<h4><?php echo $this->get_child_label('plural'); ?></h4>
						<div class="panel-children" data-max_children="<?php echo $this->max_children; ?>" data-depth="<# data.child_depth = data.depth + 1 #>{{data.child_depth}}">
						</div>
						<a class="create-new-panel create-new-child hide-if-no-js thickbox icon-plus-sign" href="#TB_inline?height=960&width=700&inlineId=new-panel"><?php printf(__('Add %s', 'modular-content'), $this->get_child_label('singular')); ?></a>
					</div>

				<?php endif; ?>
			</div>
		</div>
	</script>
	<?php do_action( 'after_panel_admin_template_inside' ); ?>
</div>
