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
	public function render_field() {
		printf('<span class="panel-input-field"><input type="text" name="%s" value="%s" size="40" /></span>', $this->get_input_name(), $this->get_input_value());
	}
}