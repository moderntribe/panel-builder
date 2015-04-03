<?php

/**
 * The admin view for the Posts field
 *
 * @var \ModularContent\Fields\Posts $this
 * @var array $taxonomies
 * @var array $p2p
 * @var string $input_name
 * @var string $input_value
 * @var int $max
 * @var int $min
 * @var int $suggested
 * @var string $description
 * @var bool $support_external
 */

$id_string = '{{data.panel_id}}-'.$this->esc_class($this->name);

?>
<div class="panel-input-group panel-input-posts" id="<?php echo $id_string; ?>" data-name="<?php esc_attr_e($this->name); ?>" data-max="<?php echo $max; ?>" data-min="<?php echo $min; ?>" data-suggested="<?php echo $suggested; ?>">
	<input type="hidden" class="posts-group-name" value="<?php echo $input_name ?>" />
	<input type="hidden" name="<?php echo $input_name ?>[type]" class="query-type" value="{{<?php echo $input_value; ?>.type}}" />
	<fieldset class="manual" id="<?php echo $id_string;?>-manual" data-type="manual">
		<legend><?php _e('Selection', 'modular-content'); ?></legend>
		<div class="search-controls">
			<?php if ( $support_external ) : ?>
			<div class="link-type-choices">
				<label class="panel-input-label"><strong><?php _e('Link Source', 'modular-content'); ?></strong></label>
				<label class="radio-option"><input type="radio" name="link-type" id="link-type-internal" value="internal" checked /> Link to an HLS page</label>
				<label class="radio-option"><input type="radio" name="link-type" id="link-type-external" value="external" /> Link to an external link</label>
			</div>
			<?php endif; ?>
			<div class="post-selector">
				<div class="filter-post_type-container"></div>
				<div class="selected-post-input"><label><?php _e('Select Content', 'modular-content'); ?></label><input type="hidden" data-placeholder="<?php esc_attr_e('Choose a Post', 'modular-content'); ?>" /></div>
			</div>
			<div class="external-links-fields">
				<p/>
				<label class="panel-input-label"><strong><?php _e('External Link', 'modular-content'); ?></strong></label>
				<p/>
				<label class="panel-input-label"><?php _e('External URL', 'modular-content'); ?></label>
				<span class="panel-input-field"><input type="text" class="external-url" name="external-url" value="" size="40" placeholder="http://example.com" /></span>
				<p/>
				<label class="panel-input-label"><?php _e('Link Text', 'modular-content'); ?></label>
				<span class="panel-input-field"><input type="text" class="external-title" name="external-title" value="" size="40" /></span>
			</div>
			<button class="button button-secondary"><?php printf( __('Add to %s', 'modular-content'), \ModularContent\Plugin::instance()->get_label() ); ?></button>
			<span class="description"><?php echo $description; ?></span>
		</div>

		<div class="selection-notices"><span class="icon-exclamation-sign"></span> <?php printf( __('This %s requires <span class="count">0</span> more items.', 'modular-content'), strtolower(\ModularContent\Plugin::instance()->get_label()) ); ?></div>
		<div class="selection" data-field_name="<?php echo $input_name; ?>">
			<?php for ( $i = 0 ; $i < $max ; $i++ ): ?>
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
	<fieldset class="query" id="<?php echo $id_string;?>-query" data-type="query">
		<legend><?php _e('Dynamic', 'modular-content'); ?></legend>
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
		<div class="select-filters">
			<select class="select-new-filter">
				<option value=""><?php _e('Add a Filter', 'modular-content'); ?></option>
				<optgroup label="<?php esc_attr_e('Taxonomy', 'modular-content'); ?>">
					<?php foreach ( $taxonomies as $tax_name ): ?>
						<?php $tax = get_taxonomy($tax_name); ?>
						<?php if ( !$tax ) { continue; } ?>
						<option data-filter-group="taxonomy" value="<?php esc_attr_e($tax_name); ?>"><?php esc_html_e($tax->label); ?></option>
					<?php endforeach; ?>
				</optgroup>
				<?php if ( $p2p ){
					?><optgroup label="<?php esc_attr_e('Relationship', 'modular-content'); ?>"><?php
					foreach ( $p2p as $relationship_id => $relationship ){
						?><option data-filter-group="p2p" value="<?php esc_attr_e($relationship_id); ?>"><?php esc_html_e($relationship->get_field( 'title', 'from' )); ?></option><?php
					}
					?></optgroup><?php
				} ?>
				<?php do_action( 'modular_content_posts_field_filter_options', $this ); ?>
			</select>
			<div class="query-filters">
			</div>
		</div>
		<div class="query-preview">

		</div>
	</fieldset>
</div>