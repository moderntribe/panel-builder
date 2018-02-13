<?php


namespace ModularContent\Fields;

use ModularContent\Panel;


/**
 * Class Radio
 *
 * @package ModularContent\Fields
 *
 * A group of radio buttons.
 *
 * $field = new Radio( array(
 *   'label' => __('Pick One'),
 *   'name' => 'my-field',
 *   'description' => __( 'Pick the thing that you pick' )
 *   'options' => array(
 *     'first' => __( 'The First Option' ),
 *     'second' => __( 'The Second Option' ),
 *   )
 * ) );
 */
class Radio extends Select {

	protected $layout       = 'vertical';
	protected $option_width = 12;

	public function __construct( $args = [] ) {
		$this->check_layout( $args );
		$this->check_option_width( $args );

		$this->defaults['layout']       = $this->layout;
		$this->defaults['option_width'] = $this->option_width;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                 = parent::get_blueprint();
		$blueprint['layout']       = $this->layout;
		$blueprint['option_width'] = $this->option_width;

		return $blueprint;
	}

	protected function check_layout( $args ) {
		if ( isset( $args['layout'] ) && $args['layout'] !== 'vertical' && $args['layout'] !== 'horizontal' && $args['layout'] !== 'inline' ) {
			throw new \LogicException( 'Layout argument can only be "vertical", "horizontal", or "inline".' );
		}
	}

	protected function check_option_width( $args ) {
		if ( isset( $args['option_width'] ) && ( $args['option_width'] < 1 || $args['option_width'] > 12 ) ) {
			throw new \LogicException( 'option_width argument must be between 1-12.' );
		}
	}

}