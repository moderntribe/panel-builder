<?php

/**
 * Template for a single panel
 *
 * @var \ModularContent\PanelType $this
 */

$singular = \ModularContent\Plugin::instance()->get_label();

?>

<div
	class="panel-template"
	data-panel-type="<?php esc_attr_e($this->id); ?>"
	<?php if ( $this->max_depth != self::NO_LIMIT ) { ?>data-max_depth="<?php echo $this->max_depth; ?>"<?php } ?>
	<?php
	if ( $this->allowed_contexts() ) {
	?>data-panel-contexts="<?php echo esc_attr(\ModularContent\Util::json_encode($this->allowed_contexts())); ?>"
		data-panel-context-mode="allow"<?php
	} elseif ( $this->forbidden_contexts() ) {
	?>data-panel-contexts="<?php echo esc_attr(\ModularContent\Util::json_encode($this->forbidden_contexts())); ?>"
		data-panel-context-mode="deny"<?php
	}?>
	>
	<div class="thumbnail">
		<span class="panel-icon"><img src="<?php echo esc_url($this->get_icon()); ?>" alt="<?php esc_attr_e($this->get_label()); ?>" /></span>
		<span class="panel-title"><?php esc_html_e($this->get_label()); ?></span>
		<span class="panel-description"><?php esc_html_e($this->get_description()); ?></span>
	</div>
	<script type="text/template" class="template" id="tmpl-panel-<?php esc_attr_e($this->id); ?>"><?php
        ?><div class="panel-row panel-type-<?php esc_attr_e($this->id); ?> clearfix" id="panel-row-{{data.panel_id}}" data-type="<?php esc_attr_e($this->id); ?>" data-id="{{data.panel_id}}">

			<div class="panel-row-header">

				<div class="media">
					<div class="pull-left">
						<img class="media-object" src="<?php echo esc_url($this->get_icon()); ?>" data-default="<?php echo esc_url($this->get_icon()); ?>" data-alt="<?php echo esc_url($this->get_icon('active')); ?>" width="106" height="63">
					</div>
					<div class="media-body">
						<h3 class="media-heading panel-title" title="<?php printf(__('Edit %s', 'modular-content'), $singular); ?>">{{data.panel_title}}</h3>
						<h4 class="panel-type"><?php esc_html_e($this->get_label()); ?></h4>
					</div>
				</div>


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
						<h4 class="panel-toggle child-toggle"><?php echo $this->get_child_label('plural'); ?></h4>
						<div class="panel-children" data-max_children="<?php echo $this->max_children; ?>" data-depth="<# data.child_depth = data.depth + 1 #>{{data.child_depth}}" data-delete-child="<?php echo esc_attr( sprintf( __( 'Delete %s', 'modular-content' ), $this->get_child_label() ) ); ?>" id="{{data.panel_id}}-children">
						</div>
						<a id="create-child-for-{{data.panel_id}}" class="add-new-child-panel hide-if-no-js thickbox icon-plus-sign" href="#TB_inline?height=960&width=700&inlineId=new-panel" data-title="<?php printf(__('Select a %s Type', 'modular-content'), $this->get_child_label('singular')); ?>"><?php printf(__('Add %s', 'modular-content'), $this->get_child_label('singular')); ?></a>
					</div>

				<?php endif; ?>

				<a class="delete-panel" href="JavaScript:void(0);"><?php printf( __('Delete %s', 'modular-content'), $singular ); ?></a>

			</div>

			<button type="button" class="close close-panel" title="<?php _e('Click to toggle'); ?>"><span class="caret"></span></button>

		</div>

	</script>
	<?php do_action( 'after_panel_admin_template_inside' ); ?>
</div>
