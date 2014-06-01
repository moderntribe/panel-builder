<?php


namespace ModularContent;
use \ModularContent\Fields\Field;


/**
 * Class PanelType
 *
 * @package ModularContent
 *
 * @property-read string id
 */
class PanelType {
	const NO_LIMIT = -1;

	/** @var string */
	private $id = '';

	/** @var string */
	protected $label = '';

	/** @var string */
	protected $icon = '';

	/** @var string */
	protected $description = '';

	/** @var PanelViewFinder */
	protected $view_finder = NULL;

	/** @var Field[] */
	protected $fields = array();

	/** @var int */
	protected $max_depth = 1;

	/** @var int */
	protected $max_children = 0;

	public function __construct( $id ) {
		$this->id = $id;
		$default_fields = array();
		if ( apply_filters( 'modular_content_always_has_title_field', TRUE ) ) {
			$default_fields[] = new Fields\Title();
		}
		$default_fields = apply_filters('modular_content_default_fields', $default_fields, $this->id);
		foreach ( $default_fields as $field ) {
			$this->add_field( $field );
		}
		$this->max_depth = apply_filters( 'modular_content_default_max_depth', $this->max_depth );
		$this->max_children = apply_filters( 'modular_content_default_max_children', $this->max_children );
	}

	public function __get( $name ) {
		if ( method_exists( $this, 'get_'.$name ) ) {
			return $this->{'get_'.$name}();
		} else {
			throw new \InvalidArgumentException(sprintf(__('Undefined property: %s'), $name));
		}
	}

	public function get_id() {
		return $this->id;
	}

	public function __toString() {
		return $this->id;
	}

	/**
	 * @param Field $field
	 *
	 */
	public function add_field( Field $field ) {
		$this->fields[$field->get_name()] = $field;
	}

	/**
	 * @param $name
	 *
	 * @return Field|NULL
	 */
	public function get_field( $name ) {
		foreach( $this->fields as $field ) {
			if ( $field->get_name() == $name ) {
				return $field;
			}
		}
		return NULL;
	}

	/**
	 * @return Field[]
	 */
	public function all_fields() {
		return $this->fields;
	}

	/**
	 * Set the directory to look in for front-end templates
	 *
	 * @param Template|string $directory
	 * @return Template
	 */
	public function set_template_dir( $directory = '' ) {
		if ( is_object($directory) && $directory instanceof PanelViewFinder ) {
			$this->view_finder = $directory;
		} else {
			$this->view_finder = new PanelViewFinder($directory);
		}
		return $this->view_finder;
	}

	public function get_template_path() {
		return $this->view_finder->get_template_file_path($this->get_id());
	}

	public function set_label( $label ) {
		$this->label = $label;
	}

	public function get_label() {
		return $this->label;
	}

	public function set_icon( $icon ) {
		$this->icon = $icon;
	}

	public function get_icon() {
		return $this->icon;
	}

	public function set_description( $text ) {
		$this->description = $text;
	}

	public function get_description() {
		return $this->description;
	}

	public function set_max_depth( $depth ) {
		$this->max_depth = absint($depth);
	}

	public function get_max_depth() {
		return $this->max_depth;
	}

	public function set_max_children( $max ) {
		$this->max_children = absint($max);
	}

	public function get_max_children() {
		return $this->max_children;
	}

	public function get_admin_template() {
		ob_start();
		do_action('before_panel_admin_template', $this );
		include( Plugin::plugin_path('admin-views/panel-template.php') );
		do_action('after_panel_admin_template', $this );
		return ob_get_clean();
	}
} 