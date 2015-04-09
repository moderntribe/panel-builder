<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class Link
 *
 * @package ModularContent\Fields
 *
 * A group of fields for creating a link. Includes form controls for
 * the link title, URL, and optionally open in a new window.
 *
 * $field = new Link( array(
 *   'label' => __('Link'),
 *   'name' => 'link',
 * ) );
 */
class Link extends Field {

	protected $default = '{ url: "", target: "", label: "" }';



	protected function render_opening_tag() {
		printf('<fieldset class="panel-input input-type-link input-name-%s">', $this->esc_class($this->name));
	}

	protected function render_label() {
		if ( !empty($this->label) ) {
			printf('<legend class="panel-input-label">%s</legend>', $this->label);
		}
	}

	public function render_field() {
		printf('<span class="panel-input-field link-field-url"><input type="text" name="%s[url]" value="%s" size="40" placeholder="%s" /></span>', $this->get_input_name(), $this->get_input_value('url'), __('URL', 'modular-content'));
		printf('<span class="panel-input-field link-field-label"><input type="text" name="%s[label]" value="%s" size="40" placeholder="%s" /></span>', $this->get_input_name(), $this->get_input_value('label'), __('Label', 'modular-content'));


		$options = array();
		$option = '<option value="%s" %s>%s</option>';
		foreach ( array( '' => __('Stay in Window', 'modular-content'), '_blank' => __('Open New Window', 'modular-content') ) as $key => $label ) {
			$selected = sprintf('<# if ( data.fields.%s.target == "%s" ) { #> selected="selected" <# } #> ', $this->name, esc_js($key));
			$options[] = sprintf($option, esc_attr($key), $selected, esc_html($label));
		}

		$select = sprintf('<select name="%s[target]">%s</select>', $this->get_input_name(), implode("\n", $options));
		echo '<span class="panel-input-field link-field-target">'.$select.'</span>';
	}

	protected function render_closing_tag() {
		echo '</fieldset>';
	}

	protected function get_default_value_js() {
		return $this->default;
	}

} 