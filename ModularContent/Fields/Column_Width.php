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
 *   'columns' => 12
 * ) );
 */
class Column_Width extends Radio {

	protected $columns = 12;

	public function __construct( $args = [] ) {
		$this->defaults['columns'] = $this->columns;
		parent::__construct( $args );
	}

	protected function get_options() {
		$options = [];

		for ( $i = 1; $i <= $this->columns; $i ++ ) {
			$options[ $i ] = $i;
		}

		return $options;
	}

}