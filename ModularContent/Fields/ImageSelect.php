<?php


namespace ModularContent\Fields;


/**
 * Class ImageSelect
 *
 * @package ModularContent\Fields
 *
 * Use just like a Radio, but option values should be image URLs
 */
class ImageSelect extends Radio {

	public function render_field() {
		$options = array();
		$option = '<label class="radio-option image-option"><input type="radio" name="%s" value="%s" %s /> <img src="%s" alt="%s" width="80" height="52"></label>';
		foreach ( $this->get_options() as $key => $src ) {
			$checked = sprintf('<# if ( data.fields.%s == "%s" ) { #> checked="checked" <# } #> ', $this->name, esc_js($key));
			$options[] = sprintf($option, $this->get_input_name(), esc_attr($key), $checked, esc_url($src), esc_attr($key));
		}

		echo implode("\n", $options);
	}

	protected function get_options() {
		if ( isset($this->options_cache) ) {
			return $this->options_cache;
		}
		if ( empty($this->options) ) {
			return array();
		}
		if ( is_callable($this->options) ) {
			$this->options_cache = call_user_func($this->options);
		} else {
			$this->options_cache = $this->options;
		}
		return $this->options_cache;
	}
}