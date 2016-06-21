<?php


namespace ModularContent\Sets;
use ModularContent\PanelCollection;

class Set implements \JsonSerializable {
	const POST_TYPE = 'panel-set';
	const EDIT_CAP = 'edit_panel-sets';
	const META_KEY_POST_TYPES = '_panel_set_post_type';
	const META_KEY_PREVIEW_IMAGE_ID = '_panel_set_preview_image';

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
		return array(
			'id' => $this->post_id,
			'label' => $this->get_label(),
			'thumbnail' => $this->get_thumbnail_html(),
			'preview' => $this->get_preview_image_html( 'panel-set-preview' ),
			'template' => $this->get_template(),
			'description' => $this->get_description(),
		);
	}

	public function get_label() {
		return $this->post_id ? get_the_title( $this->post_id ) : __('Make Your Own', 'tribe');
	}

	/**
	 * Get the HTML for displaying the post thumbnail
	 *
	 * @param string $size
	 * @return string
	 */
	public function get_thumbnail_html( $size = 'thumbnail' ) {
		if ( $this->post_id ) {
			return get_the_post_thumbnail( $this->post_id, $size );
		} else {
			$image_url = plugins_url( 'assets/make-your-own-panel-icon.png', __DIR__ );
			return sprintf( '<img src="%s" alt="" />', esc_url( $image_url ) );
		}
	}

	public function get_preview_image_id() {
		return $this->post_id ? get_post_meta( $this->post_id, self::META_KEY_PREVIEW_IMAGE_ID, true ) : 0;
	}

	public function set_preview_image_id( $image_id ) {
		update_post_meta( $this->post_id, self::META_KEY_PREVIEW_IMAGE_ID, $image_id );
	}

	public function get_preview_image_html( $size = 'thumbnail' ) {
		return $this->post_id ? wp_get_attachment_image( $this->get_preview_image_id(), $size ) : '';
	}

	/**
	 * @return PanelCollection
	 */
	public function get_template() {
		return $this->post_id ? PanelCollection::find_by_post_id( $this->post_id ) : new PanelCollection();
	}

	/**
	 * @return array The post types this Set can be applied to
	 */
	public function get_post_types() {
		return get_post_meta( $this->post_id, self::META_KEY_POST_TYPES, FALSE );
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
			return TRUE; // supports all types
		}
		if ( in_array( $post_type, $supported ) ) {
			return TRUE;
		}
		return FALSE;
	}

	/**
	 * Get an HTML description of this Set
	 *
	 * @return string
	 */
	public function get_description() {
		$description = '<h2>'.$this->get_label().'</h2>';
		if ( $this->post_id ) {
			$post = get_post( $this->post_id );
			$excerpt = $post->post_excerpt;
		} else {
			$excerpt = '';
		}
		if ( $excerpt ) {
			$description .= '<div class="panel-set-excerpt">'.$excerpt.'</div>';
		}
		$template = $this->get_template();
		$description .= '<div class="panel-set-details"><h5>'.__('Panels:', 'tribe').'</h5>'.$this->panel_set_to_list( $template->panels() ).'</div>';
		return $description;
	}

	/**
	 * @param \ModularContent\Panel[] $panels
	 *
	 * @return string
	 */
	private function panel_set_to_list( $panels ) {
		$html = '';
		if ( empty( $panels ) ) {
			return '<p>'.__('There are currently no panels saved for this panel set.', 'tribe').'</p>';
		}
		foreach ( $panels as $panel ) {
			$html .= sprintf('<p class="depth-%d">', $panel->get_depth());
			$type = $panel->get_type_object();
			$html .= $type->get_label();
			$html .= '</p>';
		}
		return $html;
	}

} 