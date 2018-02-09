<?php


namespace ModularContent\Fields;

/**
 * Class Numeric_Input
 *
 * @package ModularContent\Fields
 *
 * A basic number field.
 *
 * $field = new Numeric_Input( array(
 *   'label' => __('Width'),
 *   'name' => 'width',
 *   'description' => __( 'How wide should this be?' ),
 *   'min' => 0,
 *   'max' => 100,
 *   'step' => 10,
 *   'unit_display' => '%',
 * ) );
 */
class Numeric_Input extends Field {

	protected $min          = 0;
	protected $max          = 100;
	protected $step         = 1;
	protected $unit_display = '';
	protected $input_width  = 12;
	protected $layout       = 'full';
	protected $show_arrows  = false;

	public function __construct( $args = [] ) {
		$this->check_layout( $args );
		$this->check_input_width( $args );

		$this->defaults['min']          = $this->min;
		$this->defaults['max']          = $this->max;
		$this->defaults['step']         = $this->step;
		$this->defaults['unit_display'] = $this->unit_display;
		$this->defaults['input_width']  = $this->input_width;
		$this->defaults['layout']       = $this->layout;
		$this->defaults['show_arrows']  = $this->show_arrows;

		parent::__construct( $args );
	}

	protected function check_layout( $args ) {
		if ( isset( $args['layout'] ) && $args['layout'] !== 'compact' && $args['layout'] !== 'full' ) {
			throw new \LogicException( 'Layout argument can only be "compact" or "full".' );
		}
	}

	protected function check_input_width( $args ) {
		if ( isset( $args['input_width'] ) && ( isset( $args['layout'] ) && $args['layout'] === 'full' ) ) {
			throw new \LogicException( 'input_width only applies to compact layouts.' );
		}

		if ( isset( $args['input_width'] ) && ( $args['input_width'] < 1 || $args['input_width'] > 12 ) ) {
			throw new \LogicException( 'input_width argument must be between 1-12.' );
		}
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$blueprint['min']          = $this->min;
		$blueprint['max']          = $this->max;
		$blueprint['step']         = $this->step;
		$blueprint['unit_display'] = $this->unit_display;
		$blueprint['input_width']  = (int) $this->input_width;
		$blueprint['layout']       = $this->layout;
		$blueprint['show_arrows']  = (bool) $this->show_arrows;

		return $blueprint;
	}

}