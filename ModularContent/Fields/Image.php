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
 * The image is stored in the field as an attachment ID.
 */
class Image extends Field {
	protected $size = 'thumbnail'; // The size that will displayed in the admin

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new Image( array(
	 *   'label' => __('Featured Image'),
	 *   'name' => 'featured-image',
	 *   'description' => __( 'An image to feature' ),
	 *   'size' => 'thumbnail', // the size displayed in the admin
	 * ) );
	 */
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

	public function get_vars_for_api( $data, $panel ) {

		$all_sizes_data = [ ];

		// Full is the only guaranteed size, so it's going to be our default
		$size_data = wp_get_attachment_image_src( $data, 'full' );

		// Something went wrong. Most likely the attachment was deleted.
		if ( $size_data === false ) {
			return new \stdClass;
		}

		$attachment = get_post( $data );

		$return_data = [
			'url'         => $size_data[0],
			'width'       => $size_data[1],
			'height'      => $size_data[2],
			'title'       => $attachment->post_title,
			'alt'         => get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true ),
			'description' => $attachment->post_content,
			'caption'     => $attachment->post_excerpt,
		];

		// Set all the other sizes

		foreach ( get_intermediate_image_sizes() as $size ) {

			if ( $size === 'full' ) {
				continue;
			}

			$size_data = wp_get_attachment_image_src( $data, $size );

			if ( $size_data === false ) {
				continue;
			}

			$all_sizes_data[ $size ] = [
				'url'    => $size_data[0],
				'width'  => $size_data[1],
				'height' => $size_data[2],
			];
		}

		$return_data['sizes'] = $all_sizes_data;

		$return_object = new \stdClass();
		foreach ( $return_data as $key => $value ) {
			$return_object->$key = $value;
		}

		$return_object = apply_filters( 'panels_field_vars_for_api', $return_object, $data, $this, $panel );

		return $return_object;
	}
}
