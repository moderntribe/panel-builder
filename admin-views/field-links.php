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
 */

$id_string = '{{data.panel_id}}-'.$this->esc_class($this->name);

?>
<div class="panel-input-group panel-input-posts" id="<?php echo $id_string; ?>" data-name="<?php esc_attr_e($this->name); ?>" data-max="1" data-min="1" data-suggested="1">
	<fieldset class="manual" id="<?php echo $id_string;?>-manual" data-type="manual">
		<legend><?php _e('Manual', 'modular-content'); ?></legend>
		<div class="search-controls">
			<div class="filter-post_type-container"></div>
		</div>

		<div class="selection-notices"><span class="icon-exclamation-sign"></span> <?php printf( __('This %s requires <span class="count">0</span> more items.', 'modular-content'), strtolower(\ModularContent\Plugin::instance()->get_label()) ); ?></div>
	</fieldset>
</div>