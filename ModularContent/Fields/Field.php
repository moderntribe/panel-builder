<?php


namespace ModularContent\Fields;
use ModularContent\AdminPreCache;
use ModularContent\Panel;

/**
 * Class Field
 *
 * @package ModularContent\Fields
 *
 * A field for a Panel. A field can be a single form input, or multiple.
 *
 * A field is responsible for rendering a template for its admin controls,
 * and for preparing data entered in that field for the front-end template.
 */
abstract class Field {

	/** @var string $label The human-readable label for the field */
	protected $label = '';

	/** @var string $name The machine-readable name for the field*/
	protected $name = '';

	/** @var string $description A helpful description for the field */
	protected $description = '';

	protected $default = '';

	protected $strings = array();

	protected $defaults = array(
		'name' => '',
		'label' => '',
		'description' => '',
		'default' => '',
	);

	/**
	 * @param array $args Configuration options for this field.
	 *
	 * $field = new Field_Subclass( array(
	 *   'label' => __('The label for the field'),
	 *   'name' => 'string-identifier',
	 *   'description' => __( 'Helpful text describing the field' ),
	 *   'default' => 'the default value',
	 * ) );
	 */
	public function __construct( $args = array() ) {
		// this allows subclasses to set defaults by overriding the property declaration
		foreach ( array_keys($this->defaults) as $key ) {
			if ( empty($this->defaults[$key]) && isset($this->$key) ) {
				$this->defaults[$key] = $this->$key;
			}
		}

		// merge defaults with passed args
		foreach ( $this->defaults as $key => $value ) {
			if ( is_array( $value ) && isset( $args[ $key ] ) ) {
				// use union operator (+) instead of array_merge() to preserve numeric keys
				$args[ $key ] = $args[ $key ] + $value;
			}
		}
		$args = wp_parse_args($args, $this->defaults);

		// only set properties that we know about
		foreach ( array_keys($this->defaults) as $key ) {
			$this->$key = $args[$key];
		}

		$this->sanitize_name();
	}

	/**
	 * A field name should not have any whitespace or periods
	 *
	 * @return void
	 */
	protected function sanitize_name() {
		$this->name = preg_replace('/[^\w\.]/', '_', $this->name);
	}

	public function render() {
		$this->render_before();
		$this->render_label();
		$this->render_field();
		$this->render_description();
		$this->render_after();
	}

	/**
	 * @return string The form field name associated with this input
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * Get a list of variables that should be passed on to views from this field
	 *
	 * The default implementation is pretty simple. Specific inputs may return
	 * more complicated data.
	 *
	 * @param mixed $data
	 * @param Panel $panel
	 * @return mixed
	 */
	public function get_vars( $data, $panel ) {
		$data = apply_filters( 'panels_field_vars', $data, $this, $panel );

		return $data;
	}

	/**
	 * Get a list of variables from this field that should be passed on to an external source via an API
	 *
	 * @param $data
	 * @param $panel
	 *
	 * @return mixed|void
	 */
	public function get_vars_for_api( $data, $panel ) {

		// By default let's leverage the work done by get_vars
		$new_data = $this->get_vars( $data, $panel );
		$new_data = apply_filters( 'panels_field_vars_for_api', $new_data, $data, $this, $panel );

		return $new_data;
	}

	/**
	 * Add data relevant to this field to the precache
	 *
	 * @param mixed $data
	 * @param AdminPreCache $cache
	 *
	 * @return void
	 */
	public function precache( $data, AdminPreCache $cache ) {
		// nothing to add
	}

	public function set_string( $key, $value ) {
		$this->strings[ $key ] = $value;
	}

	public function get_string( $key ) {
		if ( isset( $this->strings[ $key ] ) ) {
			return $this->strings[ $key ];
		}
		return '';
	}

	protected function render_before() {
		$this->render_opening_tag();
		$this->print_hasOwnProperty_statements();
	}

	protected function render_opening_tag() {
		printf('<div class="panel-input input-name-%s input-type-%s">', $this->esc_class($this->name), $this->get_short_type_name());
	}

	/**
	 * Avoid JS errors by making sure that all required properties
	 * of the data object exist.
	 *
	 * @return void
	 */
	protected function print_hasOwnProperty_statements() {
		$base = 'data.fields';
		$default = '{}';
		$parts = explode('.', $this->name);
		$number_of_parts = count($parts);
		$current = 0;
		foreach ( $parts as $p ) {
			$current++;
			if ( $current == $number_of_parts ) {
				$default = $this->get_default_value_js();
			}
			printf('<# if ( !%s.hasOwnProperty("%s") ) { %s.%s = %s; } #>', $base, $p, $base, $p, $default);
			$base .= '.'.$p;
		}
		if ( strpos($default, '{') === 0 ) {
			// make sure that the data is initialized with all necessary properties
			printf('<# _.defaults(%s, %s); #>', $base, $default);
		}
	}

	/**
	 * @return string The JS string for setting the default value for the field
	 */
	protected function get_default_value_js() {
		return sprintf("'%s'", esc_js($this->default));
	}

	protected function render_label() {
		if ( !empty($this->label) ) {
			$css_class = "panel-input-label";
			if ( strtolower( $this->label ) === "title" ) {
				$css_class .= " panel-input-label-title";
			}
			printf('<label class="%1s">%2s</label>', $css_class, $this->label);
		}
	}

	protected function render_field() {
		printf('<span class="panel-input-field"><input name="%s" value="%s" /></span>', $this->get_input_name(), $this->get_input_value());
	}

	protected function render_description() {
		if ( $this->description ) {
			printf('<p class="description panel-input-description">%s</p>', $this->description);
		}
	}

	protected function render_after() {
		$this->render_closing_tag();
	}

	protected function render_closing_tag() {
		echo '</div>'."\n";
	}

	protected function get_input_name() {
		$parts = explode('.', $this->name);
		$name = '{{data.field_name}}';
		foreach ( $parts as $p ) {
			$name .= '['.$p.']';
		}
		return $name;
	}

	protected function get_input_value( $component = '' ) {
		$name = $this->name;
		if ( !empty($component) ) {
			$name .= '.'.$component;
		}
		return sprintf("{{data.fields.%s}}", $name);
	}

	protected function esc_class( $class ) {
		return esc_attr(preg_replace('/[^\w]/', '_', $class));
	}

	protected function get_short_type_name() {
		$class = get_class($this);
		$class = str_replace(__NAMESPACE__, '', $class);
		$class = trim($class, '\\');
		return strtolower($class);
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * Default implementation is a passthrough.
	 *
	 * @param mixed $data
	 * @return mixed
	 */
	public function prepare_data_for_save( $data ) {
		return $data;
	}
}