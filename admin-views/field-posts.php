<?php

/**
 * The admin view for the Posts field
 *
 * @var array $taxonomies
 * @var string $input_name
 * @var string $input_value
 * @var int $limit
 */

$id_string = '{{data.panel_id}}-'.$this->esc_class($this->name);

?>
<div class="panel-input-group panel-input-posts" id="<?php echo $id_string; ?>" data-name="<?php esc_attr_e($this->name); ?>">
	<input type="hidden" class="posts-group-name" value="<?php echo $input_name ?>" />
	<input type="hidden" name="<?php echo $input_name ?>[type]" class="query-type" value="{{<?php echo $input_value; ?>.type}}" />
	<fieldset class="manual" id="<?php echo $id_string;?>-manual">
		<legend><?php _e('Manual', 'modular-content'); ?></legend>
		<div class="select-posts">
			<input class="search-posts" type="text" placeholder="<?php _e('Search posts', 'modular-content'); ?>" size="20" />
			<div class="search-results" data-spinner="<?php echo esc_url(admin_url('images/wpspin_light.gif')); ?>">

			</div>
		</div>
		<div class="selection" data-field_name="<?php echo $input_name; ?>" data-limit="<?php echo $limit; ?>">

		</div>
	</fieldset>
	<fieldset class="query" id="<?php echo $id_string;?>-query">
		<legend><?php _e('Query', 'modular-content'); ?></legend>
		<div class="select-filters">
			<select class="select-new-filter">
				<option value=""><?php _e('Add a Filter', 'modular-content'); ?></option>
				<option value="post_type"><?php _e('Post Type', 'modular-content'); ?></option>
				<optgroup label="<?php esc_attr_e('Taxonomy', 'modular-content'); ?>">
					<?php foreach ( $taxonomies as $tax_name ): ?>
						<?php $tax = get_taxonomy($tax_name); ?>
						<?php if ( !$tax ) { continue; } ?>
						<option value="<?php esc_attr_e($tax_name); ?>"><?php esc_html_e($tax->label); ?></option>
					<?php endforeach; ?>
				</optgroup>
			</select>
			<div class="query-filters">
			</div>
		</div>
		<div class="preview">

		</div>
	</fieldset>
</div>