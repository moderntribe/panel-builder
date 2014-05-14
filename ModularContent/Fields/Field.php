<?php


namespace ModularContent\Fields;


abstract class Field {

	/** @var string $label The human-readable label for the field */
	protected $label = '';

	/** @var string $name The machine-readable name for the field*/
	protected $name = '';

	/** @var string $description A helpful description for the field */
	protected $description = '';

	protected $defaults = array(
		'name' => '',
		'label' => '',
		'description' => '',
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
	 * Get a list of variables that should be passed on to views from this input
	 *
	 * The default implementation is pretty simple. Specific inputs may return
	 * more complicated data.
	 *
	 * @param int $post_id
	 * @return array
	 */
	public function get_vars( $post_id ) {
		$vars = array(
			$this->name => $this->get_value($post_id),
		);
		return $vars;
	}

	public function get_value() {
		return FALSE; // TODO
	}

	public function render_before() {
		printf('<div class="panel-input input-name-%s">', esc_attr($this->name));
		printf('<# if ( !data.fields.hasOwnProperty("%s") ) { data.fields.%s = ""; } #>', $this->name, $this->name);
	}

	public function render_label() {
		if ( !empty($this->label) ) {
			printf('<label class="panel-input-label">%s</label>', $this->label);
		}
	}

	public function render_field() {
		printf('<span class="panel-input-field"><input name="{{data.panel_id}}[%s]" value="{{data.fields.%s}}" /></span>', $this->name, $this->name);
	}

	public function render_description() {
		if ( $this->description ) {
			printf('<p class="description panel-input-description">%s</p>', $this->description);
		}
	}

	public function render_after() {
		echo '</div>'."\n";
	}
} 