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
	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 * @return string
	 */
	public function prepare_data_for_save( $data ) {
		return (string) parent::prepare_data_for_save( $data );
	}
}