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
	protected $picker_type  = 'BlockPicker';
	protected $color_mode   = 'hex';
	protected $input_active = false;
	protected $allow_clear  = false;
	protected $layout       = 'compact';

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new Color_Picker( array(
	 * 'label'        => __( 'Background Color' ),
	 * 'name'         => 'background-color',
	 * 'description'  => __( 'The color to use as the background.' ),
	 * 'swatches'     => [ '#000000', '#fcfcfc' ], // must be hex
	 * 'picker_type'  => 'BlockPicker', // supported types AlphaPicker, BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, HuePicker, MaterialPicker, PhotoshopPicker, SketchPicker, SliderPicker, SwatchesPicker, TwitterPicker. More info at https://casesandberg.github.io/react-color/
	 * 'color_mode'   => 'hex', // support hex or rgb. Rgba has alpha channel and must be used if you wish to use the alpha capable pickers. Again, check the site above for more info.
	 * 'input_active' => false, // if true, displays a text input to define a custom swatch in the field. Only applies to some picker types, please check https://casesandberg.github.io/react-color/ for details
	 * ) );
	 */


	public function __construct( $args = [] ) {
		$this->check_layout( $args );

		$this->defaults['strings']      = [
			'input.placeholder' => __( 'Enter Hex Code', 'modular-content' ),
		];
		$this->defaults['input_active'] = $this->input_active;
		$this->defaults['picker_type']  = $this->picker_type;
		$this->defaults['color_mode']   = $this->color_mode;
		$this->defaults['allow_clear']  = $this->allow_clear;
		$this->defaults['swatches']     = isset( $args['swatches'] ) ? $args['swatches'] : apply_filters( 'panels_default_color_picker_swatches',
			$this->default_swatches );
		$this->defaults['layout']       = $this->layout;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$blueprint['swatches']     = $this->swatches;
		$blueprint['picker_type']  = $this->picker_type;
		$blueprint['color_mode']   = $this->color_mode;
		$blueprint['input_active'] = $this->input_active;
		$blueprint['allow_clear']  = $this->allow_clear;
		$blueprint['layout']       = $this->layout;

		return $blueprint;
	}

	/**
	 * Ensure that the layout arg has proper values.
	 *
	 * @param $args
	 */
	protected function check_layout( $args ) {
		if ( isset( $args['layout'] ) && $args['layout'] !== 'compact' && $args['layout'] !== 'full' && $args['layout'] !== 'inline' ) {
			throw new \LogicException( 'Layout argument can only be "compact" or "full".' );
		}
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 *
	 * @return int
	 */
	public function prepare_data_for_save( $data ) {
		return (string) parent::prepare_data_for_save( $data );
	}
}
