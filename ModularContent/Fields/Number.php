<?php


namespace ModularContent\Fields;

/**
 * Class Number
 *
 * @package ModularContent\Fields
 *
 * A basic number field.
 *
 * $field = new Number( array(
 *   'label' => __('Width'),
 *   'name' => 'width',
 *   'description' => __( 'How wide should this be?' ),
 *   'min' => 0,
 *   'max' => 100,
 *   'step' => 10,
 *   'unit_display' => '%',
 * ) );
 */
class Number extends Field {

	protected $min          = 0;
	protected $max          = 100;
	protected $step         = 1;
	protected $unit_display = '';

	public function __construct( $args = [] ) {
		$this->defaults['min']          = $this->min;
		$this->defaults['max']          = $this->max;
		$this->defaults['step']         = $this->step;
		$this->defaults['unit_display'] = $this->unit_display;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$blueprint['min']          = $this->min;
		$blueprint['max']          = $this->max;
		$blueprint['step']         = $this->step;
		$blueprint['unit_display'] = $this->unit_display;

		return $blueprint;
	}

}