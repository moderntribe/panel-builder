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

	public function render_label() {
		// no label for hidden fields
	}

	public function render_field() {
		printf('<span class="panel-input-field"><input type="hidden" name="%s" value="%s" size="40" /></span>', $this->get_input_name(), $this->get_input_value());
	}

	public function render_description() {
		// no description for hidden fields
	}
} 