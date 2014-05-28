<?php


namespace ModularContent\Fields;


class Radio extends Select {
	protected $options = array();
	protected $options_cache = NULL;

	public function render_field() {
		$options = array();
		$option = '<label class="radio-option"><input type="radio" name="%s" value="%s" %s /> %s</label>';
		foreach ( $this->get_options() as $key => $label ) {
			$checked = sprintf('<# if ( data.fields.%s == "%s" ) { #> checked="checked" <# } #> ', $this->name, esc_js($key));
			$options[] = sprintf($option, $this->get_input_name(), esc_attr($key), $checked, esc_html($label));
		}

		echo implode("\n", $options);
	}
} 