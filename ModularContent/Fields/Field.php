<?php


namespace ModularContent\Fields;


abstract class Field {

	/** @var string $label The human-readable label for the field */
	protected $label = '';

	/** @var string $name The machine-readable name for the field*/
	protected $name = '';

	/** @var string $description A helpful description for the field */
	protected $description = '';

	protected $default = '';

	protected $defaults = array(
		'name' => '',
		'label' => '',
		'description' => '',
		'default' => '',
	);

	public function __construct( $args = array() ) {
		// this allows subclasses to set defaults by overriding the property declaration
		foreach ( array_keys($this->defaults) as $key ) {
			if ( empty($this->defaults[$key]) && isset($this->$key) ) {
				$this->defaults[$key] = $this->$key;
			}
		}

		// merge defaults with passed args
		$args = wp_parse_args($args, $this->defaults);

		// only set properties that we know about
		foreach ( array_keys($this->defaults) as $key ) {
			$this->$key = $args[$key];
		}

		$this->sanitize_name();
	}

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
	 * @return mixed
	 */
	public function get_vars( $data ) {
		return $data;
	}

	protected function render_before() {
		$this->render_opening_tag();
		$this->print_hasOwnProperty_statements();
	}

	protected function render_opening_tag() {
		printf('<div class="panel-input input-name-%s input-type-%s">', $this->esc_class($this->name), $this->get_short_type_name());
	}

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
	}

	protected function get_default_value_js() {
		return sprintf("'%s'", esc_js($this->default));
	}

	protected function render_label() {
		if ( !empty($this->label) ) {
			printf('<label class="panel-input-label">%s</label>', $this->label);
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
}