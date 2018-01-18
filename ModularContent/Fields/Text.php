<?php


namespace ModularContent\Fields;

use ModularContent\Panel;

/**
 * Class Text
 *
 * @package ModularContent\Fields
 *
 * A basic text field.
 *
 * $field = new Text( array(
 *   'label' => __('Name'),
 *   'name' => 'name',
 *   'description' => __( 'What are you called?' )
 * ) );
 */
class Text extends Field {

	protected $input_width = 12;
	protected $layout      = 'full';


	public function __construct( array $args = [] ) {
		$this->check_input_width( $args );
		$this->check_layout( $args );

		$this->defaults['input_width'] = $this->input_width;
		$this->defaults['layout']      = $this->layout;

		parent::__construct( $args );
	}

	protected function check_layout( $args ) {
		if ( isset( $args['layout'] ) && $args['layout'] !== 'compact' && $args['layout'] !== 'full' ) {
			throw new \LogicException( 'Layout argument can only be "compact" or "full".' );
		}
	}

	public function get_blueprint() {
		$blueprint                = parent::get_blueprint();
		$blueprint['input_width'] = (int) $this->input_width;
		$blueprint['layout']      = $this->layout;

		return $blueprint;
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 *
	 * @return string
	 */
	public function prepare_data_for_save( $data ) {
		return (string) parent::prepare_data_for_save( $data );
	}

	protected function check_input_width( $args ) {
		if ( isset( $args['input_width'] ) && ( isset( $args['layout'] ) && $args['layout'] === 'full' ) ) {
			throw new \LogicException( 'input_width only applies to compact layouts.' );
		}

		if ( isset( $args['input_width'] ) && ( $args['input_width'] < 1 || $args['input_width'] > 12 ) ) {
			throw new \LogicException( 'input_width argument must be between 1-12.' );
		}
	}
}