<?php


namespace ModularContent\Sets;

use ModularContent\PanelCollection;

class Set implements \JsonSerializable {
	const POST_TYPE                 = 'panel-set';
	const EDIT_CAP                  = 'edit_panel-sets';
	const META_KEY_POST_TYPES       = '_panel_set_post_type';
	const META_KEY_PREVIEW_IMAGE_ID = '_panel_set_preview_image';
	const IMAGE_SIZE_THUMBNAIL      = 'panel-set-thumbnail';
	const IMAGE_SIZE_PREVIEW        = 'panel-set-preview';

	private $post_id = '';

	public function __construct( $post_id ) {
		$this->post_id = $post_id;
	}

	/**
	 * (PHP 5 &gt;= 5.4.0)<br/>
	 * Specify data which should be serialized to JSON
	 *
	 * @link http://php.net/manual/en/jsonserializable.jsonserialize.php
	 * @return mixed data which can be serialized by <b>json_encode</b>,
	 * which is a value of any type other than a resource.
	 */
	public function jsonSerialize() {
		return [
			'id'          => $this->post_id,
			'label'       => $this->get_label(),
			'thumbnail'   => $this->get_thumbnail_src(),
			'preview'     => $this->get_preview_image_src( self::IMAGE_SIZE_PREVIEW ),
			'template'    => [ 'panels' => $this->get_template() ],
			'description' => $this->get_description(),
		];
	}

	public function get_label() {
		$label = $this->post_id ? get_the_title( $this->post_id ) : __( 'Make Your Own', 'tribe' );
		return apply_filters( 'panel_set_get_label', $label, $this->post_id );
	}

	/**
	 * Get the HTML for displaying the post thumbnail
	 *
	 * @param string $size
	 * @return string
	 */
	public function get_thumbnail_src( $size = self::IMAGE_SIZE_THUMBNAIL ) {
		$thumbnail_id = 0;
		if ( $this->post_id ) {
			$thumbnail_id = get_post_thumbnail_id( $this->post_id );
		}

		$src = \ModularContent\Plugin::plugin_url( 'assets/images/make-your-own-panel-icon.png' );

		if ( $thumbnail_id ) {
			$image = wp_get_attachment_image_src( $thumbnail_id, $size );
			if ( $image ) {
				$src = $image[ 0 ];
			}
		}
		return apply_filters( 'panel_set_thumbnail_image', $src, $this->post_id, $size );
	}

	public function get_preview_image_id() {
		return $this->post_id ? get_post_meta( $this->post_id, self::META_KEY_PREVIEW_IMAGE_ID, true ) : 0;
	}

	public function set_preview_image_id( $image_id ) {
		update_post_meta( $this->post_id, self::META_KEY_PREVIEW_IMAGE_ID, $image_id );
	}

	public function get_preview_image_src( $size = self::IMAGE_SIZE_PREVIEW ) {
		$image_id = $this->get_preview_image_id();
		$src = '';
		if ( $image_id ) {
			$image = wp_get_attachment_image_src( $image_id, $size );
			if ( $image ) {
				$src = $image[ 0 ];
			}
		}
		return apply_filters( 'panel_set_preview_image', $src, $this->post_id, $size );
	}

	/**
	 * Get the structured data for the Template.
	 *
	 * @return array
	 */
	public function get_template() {
		if ( ! $this->post_id ) {
			return [];

		}
		$build_tree = PanelCollection::find_by_post_id( $this->post_id )->build_tree();

		return apply_filters( 'panel_set_get_template', $build_tree, $this->post_id );
	}

	/**
	 * @return array The post types this Set can be applied to
	 */
	public function get_post_types() {
		$post_types = get_post_meta( $this->post_id, self::META_KEY_POST_TYPES, false );

		return apply_filters( 'panel_set_get_post_types', $post_types, $this->post_id );
	}

	/**
	 * @param array $post_types
	 *
	 * @return void
	 */
	public function set_post_types( array $post_types ) {
		$old_post_types = $this->get_post_types();
		$to_remove = array_diff( $old_post_types, $post_types );
		$to_add = array_diff( $post_types, $old_post_types );
		foreach ( $to_remove as $pt ) {
			delete_post_meta( $this->post_id, self::META_KEY_POST_TYPES, $pt );
		}
		foreach ( $to_add as $pt ) {
			add_post_meta( $this->post_id, self::META_KEY_POST_TYPES, $pt );
		}
	}

	/**
	 * @param string $post_type
	 *
	 * @return bool
	 */
	public function supports_post_type( $post_type ) {
		$supported = $this->get_post_types();
		if ( empty( $supported ) ) {
			return true; // supports all types
		}
		if ( in_array( $post_type, $supported ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Get an HTML description of this Set
	 *
	 * @return string
	 */
	public function get_description() {
		return $this->get_excerpt();
	}

	public function get_excerpt() {
		if ( $this->post_id ) {
			$post = get_post( $this->post_id );
			$excerpt = $post->post_excerpt;
		} else {
			$excerpt = '';
		}
		return apply_filters( 'panel_set_excerpt', $excerpt, $this->post_id );
	}

}
