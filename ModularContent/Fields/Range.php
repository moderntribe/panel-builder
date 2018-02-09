<?php


namespace ModularContent\Fields;

/**
 * Class Range
 *
 * @package ModularContent\Fields
 *
 * A range slider field. Can return a single value or a range of multiple values.
 *
 * $field = new Range( array(
 *   'label' => __('Ranges'),
 *   'name' => 'ranges',
 *   'description' => __( 'Which value ranges should be allowed?' ),
 *   'min' => 0,
 *   'max' => 100,
 *   'step' => 10,
 *   'unit_display' => '',
 *   'handles' => [0, 10, 20, 30] // defines where the handles should start by default. Must be within the min/max range.
 *   'has_input' => false, // whether to show the number input next to the slider
 * ) );
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