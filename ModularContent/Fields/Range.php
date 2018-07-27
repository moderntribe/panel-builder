<?php


namespace ModularContent\Fields;

/**
 * Class Range
 *
 * @package ModularContent\Fields
 *
 * A range slider field.
 */
class Range extends Numeric_Input {

	protected $handles   = [ 0 ];
	protected $has_input = false;
	protected $default   = [];

	public function __construct( $args = [] ) {
		$this->check_handle_positions( $args );

		$this->defaults['handles']   = $this->handles;
		$this->defaults['has_input'] = $this->has_input;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint              = parent::get_blueprint();
		$blueprint['handles']   = $this->handles;
		$blueprint['has_input'] = $this->has_input;

		unset( $blueprint['input_width'] );
		unset( $blueprint['layout'] );
		unset( $blueprint['show_arrows'] );

		return $blueprint;
	}

	protected function check_handle_positions( $args ) {
		foreach ( $args['handles'] as $handle ) {
			if ( $handle < $args['min'] || $handle > $args['max'] ) {
				throw new \LogicException( 'All handles must fall within the min/max range.' );
			}
		}
	}

}