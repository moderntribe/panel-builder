<?php


namespace ModularContent\Fields;


class Text extends Field {
	public function render_field() {
		printf('<span class="panel-input-field"><input type="text" name="{{data.panel_id}}[%s]" value="{{data.fields.%s}}" size="40" /></span>', $this->name, $this->name);
	}
}