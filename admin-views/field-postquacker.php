<?php

/**
 * The admin view for the PostQuacker field
 *
 * This largely piggybacks on the Posts field for the post picker functionality
 *
 * @var \ModularContent\Fields\PostQuacker $this
 * @var string $input_name
 * @var string $input_value
 * @var string $manual_fields
 */

$id_string = '{{data.panel_id}}-'.$this->esc_class($this->name);

?>
<div class="panel-input-group panel-input-posts" id="<?php echo $id_string; ?>" data-name="<?php esc_attr_e($this->name); ?>" data-max="1" data-min="1" data-suggested="1">
	<input type="hidden" class="posts-group-name" value="<?php echo $input_name ?>" />
	<input type="hidden" name="<?php echo $input_name ?>[type]" class="query-type" value="{{<?php echo $input_value; ?>.type}}" />
	<fieldset class="manual" id="<?php echo $id_string;?>-manual" data-type="manual">
		<legend><?php _e('Search', 'modular-content'); ?></legend>
		<div class="search-controls">
			<div class="filter-post_type-container">
				<div class="panel-filter-row filter-post_type">
					<label><?php _e('Content Type', 'modular-content'); ?></label>
					<span class="filter-options">
						<select name="<?php echo $input_name ?>[filters][post_type][selection][]" class="post-type-select term-select" multiple="multiple" data-placeholder="<?php _e('Select Post Types', 'modular-content'); ?>" data-filter_type="post_type">
							<?php foreach ( $this->post_type_options() as $post_type ): ?>
								<option value="<?php esc_attr_e($post_type->name); ?>"><?php esc_html_e($post_type->label); ?></option>'
							<?php endforeach; ?>
						</select>
					</span>
				</div>
			</div>
			<div class="selected-post-input"><label><?php _e('Select Content', 'modular-content'); ?></label><input type="hidden" data-placeholder="<?php esc_attr_e('Choose a Post', 'modular-content'); ?>" /></div>
			<button class="button button-secondary"><?php printf( __('Add to %s', 'modular-content'), \ModularContent\Plugin::instance()->get_label() ); ?></button>
		</div>

		<div class="selection-notices">
			<span class="icon-exclamation-sign"></span> <?php printf( __('This %s requires <span class="count">0</span> more items.', 'modular-content'), strtolower(\ModularContent\Plugin::instance()->get_label()) ); ?>
		</div>
		<div class="selection" data-field_name="<?php echo $input_name; ?>">
			<?php for ( $i = 0 ; $i < 1 ; $i++ ): ?>
				<div class="selected-post">
					<input type="hidden" name="<?php echo $input_name; ?>[post_ids][]" class="selected-post-id" />
					<div class="selected-post-preview">
						<h5 class="post-title"></h5>
						<div class="post-thumbnail"></div>
						<div class="post-excerpt">
							<div class="text-line"></div>
							<div class="text-line"></div>
						</div>
					</div>
					<a href="#" class="remove-selected-post icon-remove" title="<?php _e('Remove This Post', 'modular-content'); ?>"></a>
				</div>
			<?php endfor; ?>
		</div>
	</fieldset>
	<fieldset class="fieldgroup" id="<?php echo $id_string;?>-fieldgroup" data-type="fieldgroup">
		<legend><?php _e('Manual', 'modular-content'); ?></legend>
		<?php echo $manual_fields; ?>
	</fieldset>
</div>