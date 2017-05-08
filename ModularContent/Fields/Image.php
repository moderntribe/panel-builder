<?php

namespace ModularContent\Fields;
use ModularContent\AdminPreCache;
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

	protected $default = 0;

	protected $default_mime_types = [
		'image/svg',
		'image/svg+xml',
		'image/jpeg',
		'image/gif',
		'image/png',
		'image/bmp',
		'image/tiff',
		'image/x-icon',
	];

	protected $allowed_image_mime_types;

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new Image( array(
	 *   'label' => __('Featured Image'),
	 *   'name' => 'featured-image',
	 *   'description' => __( 'An image to feature' ),
	 * ) );
	 */
	public function __construct( $args = array() ) {
		$this->defaults[ 'strings' ] = [
			'button.remove' => __( 'Remove', 'modular-content' ),
			'button.select' => __( 'Select Files', 'modular-content' ),
		];
		$this->defaults['allowed_image_mime_types'] = isset( $args['allowed_image_mime_types'] ) ? $args['allowed_image_mime_types'] : apply_filters( 'panels_default_allowed_mime_types', $this->default_mime_types );
		parent::__construct($args);
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

	public function get_blueprint() {
		$blueprint = parent::get_blueprint();
		$blueprint['allowed_image_mime_types'] = $this->allowed_image_mime_types;
		return $blueprint;
	}

	/**
	 * Add data relevant to this field to the precache
	 *
	 * @param mixed         $data
	 * @param AdminPreCache $cache
	 *
	 * @return void
	 */
	public function precache( $data, AdminPreCache $cache ) {
		if ( $data ) {
			$cache->add_image( $data );
		}
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 * @return int
	 */
	public function prepare_data_for_save( $data ) {
		return (int) parent::prepare_data_for_save( $data );
	}
}
