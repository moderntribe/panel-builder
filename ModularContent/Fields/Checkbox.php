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
	protected $default       = [ ];

	public function get_blueprint() {
		$blueprint = parent::get_blueprint();
		$blueprint[ 'default' ] = (object) $this->default;
		return $blueprint;
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * Do not cast to string, checkboxes get arrays
	 * Do not force default on empty submissions, in
	 * case all checkboxes are purposefully unchecked.
	 *
	 * @param array $data
	 * @return array
	 */
	public function prepare_data_for_save( $data ) {
		return $data;
	}
} 