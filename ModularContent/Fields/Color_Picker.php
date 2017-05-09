<?php

namespace ModularContent\Fields;

/**
 * Class Image
 *
 * @package ModularContent\Fields
 *
 * An image field.
 *
 * Note: this depends on the Attachment Helper library.
 *
 * The image is stored in the field as an attachment ID.
 */
class Color_Picker extends Field {

	protected $default = '';

	protected $default_swatches = [
		'#4a7ef2',
		'#3c73ef',
		'#3b4664',
		'#5cb85c',
		'#d15e61',
		'#ffa700',
		'#eee',
	];

	protected $swatches = [];
	protected $input_active = false;

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
	 *   'input_active' => false,
	 * ) );
	 */
	public function __construct( $args = [] ) {
		$this->defaults['strings']     = [
			'input.placeholder' => __( 'enter hex code', 'modular-content' ),
		];
		$this->defaults['input_active'] = $this->input_active;
		$this->defaults['swatches']     = isset( $args['swatches'] ) ? $args['swatches'] : apply_filters( 'panels_default_color_picker_swatches', $this->default_swatches );
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$blueprint['swatches']     = $this->swatches;
		$blueprint['input_active'] = $this->input_active;

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
