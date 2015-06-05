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
 * @var bool $show_max_control
 */

$id_string = '{{data.panel_id}}-'.$this->esc_class($this->name);

?>
<div class="panel-input-group panel-input-posts" id="<?php echo $id_string; ?>" data-name="<?php esc_attr_e($this->name); ?>" data-max="<?php echo $max; ?>" data-min="<?php echo $min; ?>" data-suggested="<?php echo $suggested; ?>">
	<input type="hidden" class="posts-group-name" value="<?php echo $input_name ?>" />
	<input type="hidden" name="<?php echo $input_name ?>[type]" class="query-type" value="{{<?php echo $input_value; ?>.type}}" />
	<fieldset class="manual" id="<?php echo $id_string;?>-manual" data-type="manual">
		<legend><?php echo $this->get_string('tabs.manual'); ?></legend>
		<div class="search-controls">
			<div class="filter-post_type-container"></div>
			<div class="selected-post-input"><label><?php _e('Select Content', 'modular-content'); ?></label><input type="hidden" data-placeholder="<?php esc_attr_e('Choose a Post', 'modular-content'); ?>" /></div>
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
		<legend><?php echo $this->get_string('tabs.dynamic'); ?></legend>
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
		<?php if ( $show_max_control ) { ?>
			<label for="<?php echo $id_string; ?>-max-results-selection">
				<?php _e( 'Max Results:', 'modular-content' ); ?>
				<select name="<?php echo $input_name; ?>[max]" class="max-results-selection">
					<?php for ( $i = $min ; $i <= $max ; $i++ ) { ?>
						<option value="<?php echo $i; ?>"><?php echo $i; ?></option>
					<?php } ?>
				</select>
			</label>
		<?php } else { ?>
			<input class="max-results-selection" type="hidden" name="<?php echo $input_name; ?>[max]" value="0" />
		<?php } ?>
		<div class="select-filters">
			<select class="select-new-filter">
				<option value=""><?php _e('Add a Filter', 'modular-content'); ?></option>
				<optgroup label="<?php esc_attr_e('Taxonomy', 'modular-content'); ?>">
					<?php foreach ( $taxonomies as $tax_name ): ?>
						<?php $tax = get_taxonomy($tax_name); ?>
						<?php if ( !$tax ) { continue; }
						$connected_post_types = \ModularContent\Util::json_encode( \ModularContent\Util::get_post_types_for_taxonomy( $tax_name ) );
						?>
						<option data-filter-group="taxonomy" data-filter-post-types="<?php esc_attr_e($connected_post_types); ?>" value="<?php esc_attr_e($tax_name); ?>"><?php esc_html_e($tax->label); ?></option>
					<?php endforeach; ?>
				</optgroup>
				<?php if ( $p2p ){
					?><optgroup label="<?php esc_attr_e('Relationship', 'modular-content'); ?>"><?php
					foreach ( $p2p as $relationship_id => $relationship ) {
						$post_types_for_p2p = \ModularContent\Util::get_post_types_for_p2p_relationship( $relationship );
						$connected_post_types = \ModularContent\Util::json_encode( array_keys( $post_types_for_p2p ) );
						$connected_post_type_labels = \ModularContent\Util::json_encode( $post_types_for_p2p );
						?><option data-filter-group="p2p" data-filter-post-types="<?php esc_attr_e($connected_post_types); ?>" data-filter-post-type-labels="<?php esc_attr_e($connected_post_type_labels); ?>" data-any-post-type-label="<?php esc_attr_e( '-- Post type --', 'modular-content' ); ?>" value="<?php esc_attr_e($relationship_id); ?>"><?php esc_html_e(\ModularContent\Util::get_p2p_relationship_label( $relationship ) ); ?></option><?php
					}
					?></optgroup><?php
				} ?>
				<option data-filter-group="date" data-filter-post_types="<?php echo \ModularContent\Util::json_encode( \ModularContent\Util::get_post_types_for_date() ); ?>" value="date"><?php _e( 'Date', 'modular-content' ); ?></option>
				<?php do_action( 'modular_content_posts_field_filter_options', $this ); ?>
			</select>
			<div class="query-filters">
			</div>
		</div>
		<div class="query-preview">

		</div>
	</fieldset>
</div>
