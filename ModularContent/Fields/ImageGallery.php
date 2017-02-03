<?php


namespace ModularContent\Fields;

use ModularContent\AdminPreCache;
use ModularContent\Panel;


/**
 * Class ImageGallery
 *
 * @package ModularContent\Fields
 *
 * An image gallery field.
 *
 *
 * $field = new ImageGallery( array(
 *   'label' => __('Gallery Images'),
 *   'name' => 'images',
 *   'description' => __( 'Images to display in the gallery' )
 * ) );
 *
 * get_panel_var() will return an array of attachment IDs
 */
class ImageGallery extends Field {
	public function __construct( $args ) {
		$this->defaults[ 'strings' ] = [
			'button.edit_gallery' => __( 'Edit Gallery', 'modular-content' ),
		];
		parent::__construct( $args );
	}

	public function get_vars( $data, $panel ) {
		/*
		 * We have thumbnails stored with the IDs for quick loading in the admin,
		 * but we only want to send IDs to the front-end
		 */
		$images = parent::get_vars( $data, $panel );
		$ids = wp_list_pluck( $images, 'id' );

		$ids = apply_filters( 'panels_field_vars', $ids, $this, $panel );

		return $ids;
	}

	public function get_vars_for_api( $data, $panel ) {
		$image_ids = $this->get_vars( $data, $panel );
		$size = apply_filters( 'panels_image_gallery_field_size_for_api', 'full', $this, $data, $panel );
		$resources = [];

		foreach ( (array) $image_ids as $id ) {
			$resources[] = wp_get_attachment_image_src( $id, $size );
		}

		$resources = apply_filters( 'panels_field_vars_for_api', $resources, $data, $this, $panel );

		return $resources;
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
		$size = apply_filters( 'panels_image_gallery_field_size_for_admin', 'thumbnail', $this, $data );

		if ( is_array( $data ) ) {
			foreach ( $data as $image ) {
				$cache->add_image( $image[ 'id' ], $size );
			}
		}
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 * @return array
	 */
	public function prepare_data_for_save( $data ) {
		$data = (array) $data;
		$cleaned = [];
		foreach ( $data as $image ) {
			if ( empty( $image[ 'id' ] ) ) {
				continue;
			}
			$thumbnail = wp_get_attachment_image_src( $image[ 'id' ], 'thumbnail' );
			if ( ! $thumbnail ) {
				continue;
			}
			$cleaned[] = [
				'id'        => (int) $image[ 'id' ],
				'thumbnail' => $thumbnail[ 0 ],
			];
		}
		return $cleaned;
	}
}