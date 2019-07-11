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

	const LAYOUT_COMPACT = 'compact';
	const LAYOUT_FULL    = 'full';
	const LAYOUT_INLINE  = 'inline';

	protected $default = '';

	protected $default_swatches = [];

	protected $swatches     = [];
	protected $picker_type  = 'BlockPicker';
	protected $color_mode   = 'hex';
	protected $input_active = false;
	protected $allow_clear  = false;
	protected $layout       = self::LAYOUT_COMPACT;

	/**
	 * @param array $args
	 */
	public function __construct( $args = [] ) {
		$this->validate_layout( $args );

		$this->defaults['strings']      = [
			'input.placeholder' => __( 'Enter Hex Code', 'modular-content' ),
		];
		$this->defaults['input_active'] = $this->input_active;
		$this->defaults['picker_type']  = $this->picker_type;
		$this->defaults['color_mode']   = $this->color_mode;
		$this->defaults['allow_clear']  = $this->allow_clear;
		$this->defaults['swatches']     = isset( $args['swatches'] ) ? $args['swatches'] : apply_filters( 'panels_default_color_picker_swatches', $this->default_swatches );
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

	protected function get_valid_layouts() {
		return [ self::LAYOUT_COMPACT, self::LAYOUT_FULL, self::LAYOUT_INLINE ];
	}

	/**
	 * Ensure that the layout arg has proper values.
	 *
	 * @param $args
	 */
	protected function validate_layout( $args ) {
		if ( isset( $args['layout'] ) && ! in_array( $args['layout'], $this->get_valid_layouts() ) ) {
			throw new \InvalidArgumentException( 'Layout argument can only be "compact" or "full".' );
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
