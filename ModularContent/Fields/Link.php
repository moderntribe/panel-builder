<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class Link
 *
 * @package ModularContent\Fields
 *
 * A group of fields for creating a link. Includes form controls for
 * the link title, URL, and optionally open in a new window.
 *
 * $field = new Link( array(
 *   'label' => __('Link'),
 *   'name' => 'link',
 * ) );
 */
class Link extends Field {

	protected $default = [ 'url' => '', 'target' => '', 'label' => '', 'arialabel' => '' ];


	public function __construct( $args ) {
		$this->defaults[ 'strings' ] = [
			'placeholder.arialabel' => __( 'ARIA Label', 'modular-content' ),
			'placeholder.label' => __( 'Label', 'modular-content' ),
			'placeholder.url'   => __( 'URL', 'modular-content' ),
			'placeholder.target'   => __( 'Target', 'modular-content' ),
		];
		parent::__construct( $args );
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 * @return array
	 */
	public function prepare_data_for_save( $data ) {
		return wp_parse_args( $data, [ 'url' => '', 'target' => '', 'label' => '', 'arialabel' => '' ] );
	}
} 