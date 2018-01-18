<?php


namespace ModularContent\Fields;


/**
 * Class Radio
 *
 * @package ModularContent\Fields
 *
 * A group of radio buttons.
 *
 * $field = new Checkbox( array(
 *   'label' => __('Pick Options'),
 *   'name' => 'my-field',
 *   'description' => __( 'Pick the things that you pick' )
 *   'options' => array(
 *     'first' => __( 'The First Option' ),
 *     'second' => __( 'The Second Option' ),
 *   ),
 *   'default' => array( 'second' => 1 ),
 * ) );
 */
class Checkbox extends Select {

	protected $default      = [];
	protected $layout       = 'vertical';
	protected $option_width = 12;

	public function __construct( $args = [] ) {
		$this->check_layout( $args );

		$this->defaults['layout']       = $this->layout;
		$this->defaults['option_width'] = $this->option_width;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$blueprint['default']      = (object) $this->default;
		$blueprint['layout']       = $this->layout;
		$blueprint['option_width'] = $this->option_width;

		return $blueprint;
	}

	protected function check_layout( $args ) {
		if ( isset( $args['layout'] ) && $args['layout'] !== 'vertical' && $args['layout'] !== 'horizontal' ) {
			throw new \LogicException( 'Layout argument can only be "vertical" or "horizontal".' );
		}
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * Do not cast to string, checkboxes get arrays
	 * Do not force default on empty submissions, in
	 * case all checkboxes are purposefully unchecked.
	 *
	 * @param array $data
	 *
	 * @return array
	 */
	public function prepare_data_for_save( $data ) {
		return $data;
	}
} 