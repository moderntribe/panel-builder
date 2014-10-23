<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


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
		return $ids;
	}
}