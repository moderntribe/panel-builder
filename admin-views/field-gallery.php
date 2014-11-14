<?php

/**
 * The admin view for the ImageGallery field
 *
 * @var \ModularContent\Fields\ImageGallery $this
 * @var string $input_name
 * @var string $input_value
 */

$id_string = '{{data.panel_id}}-'.$this->esc_class($this->name);

?>
<div class="panel-input-group panel-input-gallery" id="<?php echo $id_string; ?>" data-label="<?php _e( 'Gallery', 'modular-content' ); ?>" data-name="<?php esc_attr_e($this->name); ?>">
	<input type="hidden" class="gallery-field-name" name="gallery-field-name" value="<?php echo $input_name; ?>"
	<p class="gallery-field-controls">
		<a href="#" class="button button-large edit-gallery-field"><?php _e( 'Edit Gallery', 'modular-content' ); ?></a>
	</p>
	<div class="gallery-field-selection">

	</div>
</div>