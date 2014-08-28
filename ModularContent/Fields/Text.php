<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


class Text extends Field {
	public function render_field() {
		printf('<span class="panel-input-field"><input type="text" name="%s" value="%s" size="40" /></span>', $this->get_input_name(), $this->get_input_value());
	}
}