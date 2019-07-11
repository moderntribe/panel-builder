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
	 * @return mixed
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

	protected function esc_class( $class ) {
		return esc_attr(preg_replace('/[^\w]/', '_', $class));
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * Default implementation ensures that default values save,
	 * as they will not be passed through from the UI
	 * if the user never interacts with the field.
	 *
	 * @param mixed $data
	 * @return mixed
	 */
	public function prepare_data_for_save( $data ) {
		if ( empty( $data ) && $this->default ) {
			$data = $this->default;
		}
		return $data;
	}

	public function get_blueprint() {
		$blueprint = [
			'type'        => $this->get_component_name(),
			'label'       => $this->label,
			'name'        => $this->get_name(),
			'description' => $this->description,
			'strings'     => $this->strings,
			'default'     => $this->default,
		];
		return $blueprint;
	}

	/**
	 * Returns the name of the react component used to render
	 * this field. When extending core fields in 3rd-party
	 * plugins, override this to re-use one of the core templates.
	 * 
	 * @return string
	 */
	protected function get_component_name() {
		return (new \ReflectionClass( $this ))->getShortName();
	}
}