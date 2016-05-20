<?php


namespace ModularContent\Fields;


/**
 * Class Radio
 *
 * @package ModularContent\Fields
 *
 * A group of radio buttons.
 *
 * $field = new Checkbox( array(
 *   'label' => __('Pick Options'),
 *   'name' => 'my-field',
 *   'description' => __( 'Pick the things that you pick' )
 *   'options' => array(
 *     'first' => __( 'The First Option' ),
 *     'second' => __( 'The Second Option' ),
 *   ),
 *   'default' => array( 'second' => 1 ),
 * ) );
 */
class Checkbox extends Select {
	protected $options       = [ ];
	protected $options_cache = null;
	protected $default       = [ ];

	public function render_field() {
		$options = [ ];
		$option = '<label class="checkbox-option"><input type="checkbox" name="%s[%s]" value="1" %s /> %s</label>';
		foreach ( $this->get_options() as $key => $label ) {
			$checked = sprintf( '<# if ( data.fields.%s[%s] == "1" ) { #> checked="checked" <# } #> ', $this->name, esc_js( $key ) );
			$options[] = sprintf( $option, $this->get_input_name(), esc_attr( $key ), $checked, esc_html( $label ) );
		}

		echo implode( "\n", $options );
	}
} 