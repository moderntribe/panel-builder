<?php

namespace ModularContent\Fields;
use ModularContent\Panel;

/**
 * Class Image
 *
 * @package ModularContent\Fields
 *
 * An image field.
 *
 * Note: this depends on the Attachment Helper library.
 *
 *
 * $field = new Image( array(
 *   'label' => __('Featured Image'),
 *   'name' => 'featured-image',
 *   'description' => __( 'An image to feature' )
 * ) );
 *
 * The image is stored in the field as an attachment ID.
 */
class Image extends Field {
	protected $size = 'thumbnail'; // The size that will displayed in the admin


	public function __construct( $args = array() ) {
		$this->defaults['size'] = $this->size;
		parent::__construct($args);
	}


	public function render_field() {

		$args = array(
			'label' => $this->label,
			'value' => $this->get_input_value(),
			'size'  => $this->size,
			'name'  => $this->get_input_name(),
			'type'  => 'image',
			'id' => preg_replace('/[^\w\{\}\.]/', '_', $this->get_input_name()),
			'settings' => preg_replace('/[^\w\{\}\.]/', '_', str_replace('{{data.field_name}}', '{{data.panel_id}}', $this->get_input_name())),
		);

		$field = new \AttachmentHelper\Field( $args );

		$field->render();

		wp_enqueue_script( 'modular-content-image-field', \ModularContent\Plugin::plugin_url('assets/scripts/js/fields/image-field.js'), array('jquery'), FALSE, TRUE );
	}
}
