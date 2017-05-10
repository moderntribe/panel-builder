<?php

namespace ModularContent\Fields;

/**
 * Class Color_Picker
 *
 * @package ModularContent\Fields
 *
 * An color picker field.
 */
class Color_Picker extends Field {

	protected $default = '';

	protected $default_swatches = [];

	protected $swatches     = [];
	protected $input_active = false;
	protected $allow_clear  = false;

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new Color_Picker( array(
	 *   'label' => __('Background Color'),
	 *   'name' => 'background-color',
	 *   'description' => __( 'The color to use as the background.' ),
	 *   'swatches' => [ '#000000', '#fcfcfc' ],
	 *   'input_active' => false, // if true, displays a text input to define a custom swatch in the field
	 *   'allow_clear' => false,
	 * ) );
	 */
	public function __construct( $args = [] ) {
		$this->defaults['strings']      = [
			'input.placeholder' => __( 'Enter Hex Code', 'modular-content' ),
		];
		$this->defaults['input_active'] = $this->input_active;
		$this->defaults['allow_clear']  = $this->allow_clear;
		$this->defaults['swatches']     = isset( $args['swatches'] ) ? $args['swatches'] : apply_filters( 'panels_default_color_picker_swatches', $this->default_swatches );
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$blueprint['swatches']     = $this->swatches;
		$blueprint['input_active'] = $this->input_active;
		$blueprint['allow_clear']  = $this->allow_clear;

		return $blueprint;
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 * @return int
	 */
	public function prepare_data_for_save( $data ) {
		return (string) parent::prepare_data_for_save( $data );
	}
}
