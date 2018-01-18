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

	protected $default = [ 'url' => '', 'target' => '', 'label' => '' ];
	protected $layout  = 'compact';


	public function __construct( $args ) {
		$this->check_layout( $args );

		$this->defaults[ 'strings' ] = [
			'placeholder.label' => __( 'Label', 'modular-content' ),
			'placeholder.url'   => __( 'URL', 'modular-content' ),
		];
		$this->defaults['layout'] = $this->layout;
		parent::__construct( $args );
	}

	protected function check_layout( $args ) {
		if ( isset( $args['layout'] ) && $args['layout'] !== 'compact' && $args['layout'] !== 'full' ) {
			throw new \LogicException( 'Layout argument can only be "compact" or "full".' );
		}
	}

	public function get_blueprint() {
		$blueprint           = parent::get_blueprint();
		$blueprint['layout'] = $this->layout;

		return $blueprint;
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 * @return array
	 */
	public function prepare_data_for_save( $data ) {
		return wp_parse_args( $data, [ 'url' => '', 'target' => '', 'label' => '' ] );
	}
} 