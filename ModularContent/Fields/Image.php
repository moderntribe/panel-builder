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
		parent::__construct($args);
	}

	public function render_field() {

		$args = array(
			'label' => $this->label,
			'value' => $this->get_input_value(),
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

	public function get_blueprint() {
		$blueprint = parent::get_blueprint();
		return $blueprint;
	}

	public static function js_config() {
		return [
			'plupload' => [
				'runtimes' => 'html5,silverlight,flash,html4',
				'browse_button' => 'plupload-browse-button',
				'container' => 'plupload-upload-ui',
				'drop_element' => 'drag-drop-area',
				'file_data_name' => 'async-upload',
				'multiple_queues' => false,
				'multi_selection' => false,
				'max_file_size' => wp_max_upload_size() . 'b',
				'url' => admin_url( 'admin-ajax.php' ),
				'flash_swf_url' => includes_url( 'js/plupload/plupload.flash.swf' ),
				'silverlight_xap_url' => includes_url( 'js/plupload/plupload.silverlight.xap' ),
				'multipart' => true,
				'urlstream_upload' => true,

				// Additional parameters:
				'multipart_params' => [
					'_ajax_nonce' => wp_create_nonce( 'photo-upload' ),
					'action' => 'attachment_helper_upload_image',
					'postID' => get_the_ID(),
					'size' => 'medium',
				],
			]
		];
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
}
