<?php


namespace ModularContent\Fields;
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
	public function render_field() {
		wp_enqueue_script( 'modular-content-gallery-field', \ModularContent\Plugin::plugin_url('assets/scripts/js/fields/gallery-field.js'), array('jquery', 'jquery-ui-tabs', 'select2'), FALSE, TRUE );
		$input_name = $this->get_input_name();
		$input_value = $this->get_input_value();
		include( \ModularContent\Plugin::plugin_path( 'admin-views/field-gallery.php' ) );
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
		$size      = apply_filters( 'panels_image_gallery_field_size_for_api', 'full', $this, $data, $panel );
		$resources = array();

		foreach ( (array) $image_ids as $id ) {
			$resources[] = wp_get_attachment_image_src( $id, $size );
		}

		$resources = apply_filters( 'panels_field_vars_for_api', $resources, $data, $this, $panel );

		return $resources;
	}
}