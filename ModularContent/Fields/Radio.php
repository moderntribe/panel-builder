<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class Radio
 *
 * @package ModularContent\Fields
 *
 * A group of radio buttons.
 *
 * $field = new Radio( array(
 *   'label' => __('Pick One'),
 *   'name' => 'my-field',
 *   'description' => __( 'Pick the thing that you pick' )
 *   'options' => array(
 *     'first' => __( 'The First Option' ),
 *     'second' => __( 'The Second Option' ),
 *   )
 * ) );
 */
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