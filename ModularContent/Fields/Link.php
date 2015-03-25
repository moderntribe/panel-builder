<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


class Link extends Field {

	protected $default = '{ url: "", label: "" }';



	protected function render_opening_tag() {
		printf('<fieldset class="panel-input input-type-link input-name-%s">', $this->esc_class($this->name));
	}

	protected function render_label() {
		if ( !empty($this->label) ) {
			printf('<legend class="panel-input-label">%s</legend>', $this->label);
		}
	}

	public function render_field() {
		printf('<span class="panel-input-field link-field-url"><input type="text" name="%s[url]" value="%s" size="40" placeholder="%s" /></span>', $this->get_input_name(), $this->get_input_value('url'), __('http://example.com', 'modular-content'));
		printf('<span class="panel-input-field link-field-label"><input type="text" name="%s[label]" value="%s" size="40" placeholder="%s" /></span>', $this->get_input_name(), $this->get_input_value('label'), __('Label', 'modular-content'));
	}

	protected function render_closing_tag() {
		echo '</fieldset>';
	}

	protected function get_default_value_js() {
		return $this->default;
	}

} 