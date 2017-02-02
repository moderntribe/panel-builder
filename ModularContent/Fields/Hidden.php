<?php


namespace ModularContent\Fields;
use ModularContent\Panel;

/**
 * Class Hidden
 *
 * @package ModularContent\Fields
 *
 * A hidden field. It will be in the HTML, but not visible to the user.
 *
 * $field = new Hidden( array(
 *   'name' => 'secret',
 * ) );
 */
class Hidden extends Field {
	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 * @return string
	 */
	public function prepare_data_for_save( $data ) {
		return (string) $data;
	}
}