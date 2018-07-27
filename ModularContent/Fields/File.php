<?php

namespace ModularContent\Fields;

use ModularContent\AdminPreCache;

/**
 * Class File
 *
 * @package ModularContent\Fields
 *
 * An file field.
 *
 * The file is stored in the field as an attachment ID.
 */
class File extends Field {

	protected $default            = 0;
	protected $layout             = 'compact';
	protected $allowed_mime_types;
	protected $default_mime_types = [];

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new File( array(
	 *   'label' => __('Featured Image'),
	 *   'name' => 'featured-image',
	 *   'description' => __( 'An image to feature' ),
	 *    'allowed_mime_types' => [ 'text/csv', 'text/css' ],
	 *   'layout' => 'compact',
	 * ) );
	 */
	public function __construct( $args = array() ) {
		$this->check_layout( $args );

		$this->defaults['strings'] = [
			'button.remove' => __( 'Remove', 'modular-content' ),
			'button.select' => __( 'Select Files', 'modular-content' ),
		];

		$this->allowed_mime_types = $this->get_panel_allowed_mime_types( $args );
		$this->defaults['layout'] = $this->layout;
		parent::__construct( $args );
	}

	protected function get_panel_allowed_mime_types( $args ) {
		$user_mime_types = isset( $args['allowed_mime_types'] ) ? $args['allowed_mime_types'] : apply_filters( 'panels_default_allowed_mime_types', $this->default_mime_types );
		$wp_mime_types   = array_values( get_allowed_mime_types() );

		if ( empty( $user_mime_types ) ) {
			return $wp_mime_types;
		}

		return array_values( array_intersect( $wp_mime_types, $user_mime_types ) );
	}

	protected function check_layout( $args ) {
		if ( isset( $args['layout'] ) && $args['layout'] !== 'compact' && $args['layout'] !== 'full' && $args['layout'] !== 'inline' ) {
			throw new \LogicException( 'Layout argument can only be "compact" or "full".' );
		}
	}

	public function get_blueprint() {
		$blueprint                       = parent::get_blueprint();
		$blueprint['allowed_mime_types'] = $this->allowed_mime_types;
		$blueprint['layout']             = $this->layout;
		return $blueprint;
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 *
	 * @return int
	 */
	public function prepare_data_for_save( $data ) {
		return (int) parent::prepare_data_for_save( $data );
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
			$cache->add_file( $data );
		}
	}
}
