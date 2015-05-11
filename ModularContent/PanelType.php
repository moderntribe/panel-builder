<?php


namespace ModularContent;
use \ModularContent\Fields\Field;


/**
 * Class PanelType
 *
 * @package ModularContent
 *
 * The configuration object for a Panel type.
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
	protected $active_icon = '';

	/** @var string */
	protected $inactive_icon = '';

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

	/** @var array */
	protected $contexts = array();

	/** @var string */
	protected $child_label_singular = '';

	/** @var string */
	protected $child_label_plural = '';

	/**
	 * @param string $id A unique string identifying this panel type
	 */
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
		call_user_func_array( array($this, 'set_child_labels'), apply_filters( 'modular_content_default_child_labels', array( 'singular' => Plugin::instance()->get_label(), 'plural' => Plugin::instance()->get_label('plural') ) ) );
	}

	public function __get( $name ) {
		if ( method_exists( $this, 'get_'.$name ) ) {
			return $this->{'get_'.$name}();
		} else {
			throw new \InvalidArgumentException(sprintf(__('Undefined property: %s'), $name));
		}
	}

	/**
	 * @return string The panel type's unique identifier
	 */
	public function get_id() {
		return $this->id;
	}

	public function __toString() {
		return $this->id;
	}

	/**
	 * @param Field $field
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
	 * @param PanelViewFinder|string $directory
	 * @return PanelViewFinder
	 */
	public function set_template_dir( $directory = '' ) {
		if ( is_object($directory) && $directory instanceof PanelViewFinder ) {
			$this->view_finder = $directory;
		} else {
			$this->view_finder = new PanelViewFinder($directory);
		}
		return $this->view_finder;
	}

	/**
	 * Get the path to the template file for this panel type
	 *
	 * @return string|bool
	 */
	public function get_template_path() {
		return $this->view_finder->get_template_file_path($this->get_id());
	}

	/**
	 * Set the admin label for the panel type
	 *
	 * @param string $label
	 *
	 * @return void
	 */
	public function set_label( $label ) {
		$this->label = $label;
	}

	/**
	 * Get the admin label
	 *
	 * @return string
	 */
	public function get_label() {
		return $this->label;
	}

	/**
	 * Set the icon to display with this panel type.
	 *
	 * The "active" state is shown when the panel is open
	 * for editing.
	 *
	 * The "inactive" state is shown at all other times.
	 *
	 * @param string $icon The URL to the image file
	 * @param string $state One of: 'both', 'active', or 'inactive'
	 *
	 * @return void
	 */
	public function set_icon( $icon, $state = 'both' ) {
		switch ( $state ) {
			case 'active':
				$this->active_icon = $icon;
				break;
			case 'inactive':
				$this->inactive_icon = $icon;
				break;
			case 'both':
			default:
				$this->active_icon = $icon;
				$this->inactive_icon = $icon;
				break;
		}
	}

	/**
	 * Get the URL for the image file
	 *
	 * @param string $state
	 *
	 * @return string
	 */
	public function get_icon( $state = 'inactive' ) {
		switch ( $state ) {
			case 'active':
				return $this->active_icon ? $this->active_icon : $this->inactive_icon;
			case 'inactive':
			default:
				return $this->inactive_icon ? $this->inactive_icon : $this->active_icon;
		}
	}

	/**
	 * @param $text
	 *
	 * @return void
	 */
	public function set_description( $text ) {
		$this->description = $text;
	}

	/**
	 * @return string
	 */
	public function get_description() {
		return $this->description;
	}

	/**
	 * Set the maximum depth at which this panel type can be added.
	 *
	 * If 0, this can only be a top-level panel.
	 * If 1, this can be top-level or nested inside a top-level panel.
	 *
	 * @param int $depth
	 *
	 * @return void
	 */
	public function set_max_depth( $depth ) {
		$this->max_depth = absint($depth);
	}

	/**
	 * @return int
	 */
	public function get_max_depth() {
		return $this->max_depth;
	}

	/**
	 * Set the maximum number of child panels that this panel can hold.
	 *
	 * Set to 0 if the panel should not have children.
	 * Set to PanelType::NO_LIMIT if it can hold unlimited children.
	 *
	 * @param int $max
	 *
	 * @return void
	 */
	public function set_max_children( $max ) {
		$this->max_children = absint($max);
	}

	/**
	 * @return int
	 */
	public function get_max_children() {
		return $this->max_children;
	}

	/**
	 * Limit the contexts in which this panel can appear
	 *
	 * @param string $id The ID of a panel type that this type can be a child of
	 * @param bool $allowed If TRUE, this panel can _only_ appear in the given context(s)
	 *                      If FALSE, this panel cannot appear in the given context(s)
	 *
	 * @return void
	 */
	public function set_context( $id, $allowed = FALSE ) {
		$this->contexts[$id] = $allowed;
	}

	/**
	 * Remove a context setting
	 *
	 * @param string $id The ID of a panel type
	 *
	 * @return void
	 */
	public function remove_context( $id ) {
		unset($this->contexts[$id]);
	}

	/**
	 * Get the contexts for which this panel type has been explicitly approved
	 *
	 * @return array
	 */
	public function allowed_contexts() {
		return array_keys( array_filter( $this->contexts ) );
	}

	/**
	 * Get the contexts for which this panel type has been explicitly denied.
	 *
	 * If there are allowed contexts set, then forbidden contexts are ignored.
	 *
	 * @return array
	 */
	public function forbidden_contexts() {
		if ( $this->allowed_contexts() ) {
			return array(); // if allowed contexts are set, then forbidden contexts are ignored
		}
		return array_keys( array_filter( $this->contexts, function( $allowed ) {
			return !$allowed;
		}));
	}

	/**
	 * Set the label to use when referring to child panels of this type.
	 *
	 * E.g., blocks, tabs, slides, etc.
	 *
	 * @param string $singular
	 * @param string $plural
	 *
	 * @return void
	 */
	public function set_child_labels( $singular, $plural ) {
		$this->child_label_singular = $singular;
		$this->child_label_plural = $plural;
	}

	/**
	 * Get the label for children of this panel type
	 *
	 * @param string $quantity
	 *
	 * @return string
	 */
	public function get_child_label( $quantity = 'singular' ) {
		return ( $quantity == 'plural' ) ? $this->child_label_plural : $this->child_label_singular;
	}

	/**
	 * Get the admin HTML template for rendering this panel type's controls
	 * @return string
	 */
	public function get_admin_template() {
		ob_start();
		do_action('before_panel_admin_template', $this );
		include( Plugin::plugin_path('admin-views/panel-template.php') );
		do_action('after_panel_admin_template', $this );
		return ob_get_clean();
	}
} 