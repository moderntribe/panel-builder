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
	protected $thumbnail = '';

	/** @var string */
	protected $description = '';

	/** @var PanelViewFinder */
	protected $view_finder = NULL;

	/** @var Field[] */
	protected $fields = array();

	/** @var array */
	protected $settings_fields = array();

	/** @var int */
	protected $max_depth = 0;

	/** @var int */
	protected $max_children = 0;

	/** @var array */
	protected $contexts = array();

	/** @var string */
	protected $child_label_singular = '';

	/** @var string */
	protected $child_label_plural = '';

	/** @var string[] */
	protected $strings = [];

	/** @var array[] */
	protected $tabs = [];

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
		$this->setup_default_tabbed_fields();
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
	 * @param string $tab
	 */
	public function add_field( Field $field, $tab = 'content' ) {
		$this->fields[$field->get_name()] = $field;

		if ( ! isset( $this->tabs[ $tab ] ) ) {
			$this->tabs[ $tab ] = [];
		}

		$this->tabs[ $tab ][] = $field->get_name();
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
	 * Determine if a given field name is in the specified tab.
	 *
	 * @param $field_name
	 * @param $tab
	 *
	 * @return bool
	 */
	public function is_field_in_tab( $field_name, $tab ) {
		return isset( $this->tabs[ $tab ] ) && in_array( $field_name, $this->tabs[ $tab ] );
	}

	/**
	 * Get all of the tabbed field names, grouped by tab ID.
	 *
	 * @return array[]
	 */
	public function get_tabbed_field_names() {
		return $this->tabs;
	}

	/**
	 * Loop through applied default filters and add the specified fields to the correct tabs.
	 */
	private function setup_default_tabbed_fields() {
		$tabs = apply_filters( 'modular_content_tabs', [ 'content', 'settings' ] );
		foreach ( $tabs as $tab ) {
			foreach( apply_filters( 'modular_content_default_fields/tab=' . $tab, [], $this->id ) as $field ) {
				$this->add_field( $field, $tab );
			}
		}
	}

	/**
	 * Call preg_grep against the keys of an array to match the pattern.
	 *
	 * @param     $pattern
	 * @param     $input
	 * @param int $flags
	 *
	 * @return array
	 */
	function preg_grep_keys( $pattern, $input, $flags = 0 ) {
		return array_intersect_key( $input, array_flip( preg_grep( $pattern, array_keys( $input ), $flags ) ) );
	}

	/**
	 * Add a field to the Settings tab of the panel type
	 *
	 * Alias for add_field( $field, 'settings' );
	 *
	 * @deprecated 3.4 Used for backwards compatibility only.
	 *
	 * @param Field $field
	 * @return void
	 */
	public function add_settings_field( Field $field ) {
		$this->add_field( $field, 'settings' );
	}

	/**
	 * @deprecated 3.4 Used for backwards compatibility only.
	 *
	 * @return array The names of all registered settings fields
	 */
	public function get_settings_field_names() {
		return isset( $this->tabs['settings'] ) ? $this->tabs['settings'] : [];
	}

	/**
	 * Determine if the field with the given name should
	 * be displayed in the Settings tab
	 *
	 * @deprecated 3.4 Used for backwards compatibility only.
	 * @see is_field_in_tab
	 *
	 * @param string $field_name
	 * @return bool
	 */
	public function is_settings_field( $field_name ) {
		return $this->is_field_in_tab( $field_name, 'settings' );
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
	 * @param string $icon The URL to the image file
	 *
	 * @deprecated
	 * @see PanelType::set_thumbnail()
	 * @return void
	 */
	public function set_icon( $icon ) {
		_deprecated_function( __CLASS__ . '::' . __FUNCTION__, '3.0', 'PanelType::set_thumbnail' );
		$this->set_thumbnail( $icon );
	}

	/**
	 * Get the URL for the image file
	 * @deprecated
	 * @see PanelType::get_thumbnail()
	 * @return string
	 */
	public function get_icon() {
		_deprecated_function( __CLASS__ . '::' . __FUNCTION__, '3.0', 'PanelType::get_thumbnail' );
		return $this->get_thumbnail();
	}

	/**
	 * Set the thumbnail to display in the panel picker
	 *
	 * @param string $thumbnail_url
	 * @return void
	 */
	public function set_thumbnail( $thumbnail_url ) {
		$this->thumbnail = $thumbnail_url;
	}

	/**
	 * Get the URL for the thumbnail image file
	 * @return string
	 */
	public function get_thumbnail() {
		return $this->thumbnail;
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
		$this->set_string( 'child.singular', $singular );
		$this->set_string( 'child.plural', $plural );
		$this->set_string( 'child.add', sprintf( _x( 'Add %s', 'Add child panel string', 'panel-builder'), $singular ) );
		$this->set_string( 'child.delete', sprintf( _x( 'Delete %s', 'Remove child panel string', 'panel-builder'), $singular ) );
	}

	/**
	 * Get the label for children of this panel type.
	 * Retained for backwards compatibility, but preferred
	 * to use:
	 * $this->get_string( 'child.singular' )
	 * $this->get_string( 'child.plural' )
	 *
	 * @param string $quantity 'singular' or 'plural'
	 * @return string
	 * @see get_string()
	 */
	public function get_child_label( $quantity = 'singular' ) {
		return $this->get_string( 'child.' . $quantity );
	}


	/**
	 * Configure the value for a string
	 *
	 * @param string $key
	 * @param string $value
	 * @return void
	 */
	public function set_string( $key, $value ) {
		$this->strings[ $key ] = $value;
	}

	/**
	 * Get the configured value for a string
	 *
	 * @param string $key
	 * @return string
	 */
	public function get_string( $key ) {
		if ( isset( $this->strings[ $key ] ) ) {
			return $this->strings[ $key ];
		}
		return '';
	}
}
