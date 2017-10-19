<?php


namespace ModularContent\Fields;


/**
 * Class Radio
 *
 * @package ModularContent\Fields
 *
 * A group of radio buttons laid out into an intuitive ui for selecting grid widths a panel/group of panels may take up.
 *
 * $field = new Column_Width( array(
 *   'label' => __('Column Width'),
 *   'name' => 'my-field',
 *   'description' => __( 'Select width for this column' )
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