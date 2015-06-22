<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class Select
 *
 * @package ModularContent\Fields
 *
 * A select box.
 */
class Select extends Field {
	protected $options = array();
	protected $options_cache = NULL;

	/**
	 * @param array $args
	 *
	 * Example usage:
	 *
	 * $field = new Select( array(
	 *   'label' => __('Pick One'),
	 *   'name' => 'my-field',
	 *   'description' => __( 'Pick the thing that you pick' )
	 *   'options' => array(
	 *     'first' => __( 'The First Option' ),
	 *     'second' => __( 'The Second Option' ),
	 *   )
	 * ) );
	 */
	public function __construct( $args = array() ){
		$this->defaults['options'] = $this->options;
		parent::__construct($args);
	}

	public function render_field() {
		$options = array();
		$option = '<option value="%s" %s>%s</option>';
		foreach ( $this->get_options() as $key => $label ) {
			$selected = sprintf('<# if ( data.fields.%s == "%s" ) { #> selected="selected" <# } #> ', $this->name, esc_js($key));
			$options[] = sprintf($option, esc_attr($key), $selected, esc_html($label));
		}

		$select = sprintf('<select name="%s">%s</select>', $this->get_input_name(), implode("\n", $options));
		echo $select;
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