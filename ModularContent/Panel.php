<?php


namespace ModularContent;


/**
 * Class Panel
 *
 * @package ModularContent
 *
 * An instance of a Panel
 */
class Panel implements \JsonSerializable {
	/** @var PanelType */
	private $type = NULL;
	private $depth = 0;
	private $data = array();
	private $template_vars = NULL;
	private $api_vars = NULL;
	/** @var Panel[] */
	private $children = array();

	public function __construct( PanelType $type, $data = array(), $depth = 0 ) {
		$this->type = $type;
		$this->data = $data;
		$this->set_depth($depth);
	}

	/**
	 * Set a value
	 *
	 * @param string $key
	 * @param mixed $value
	 *
	 * @return void
	 */
	public function set( $key, $value ) {
		$this->data[$key] = $value;
	}

	/**
	 * Get a value
	 *
	 * @param string $key
	 *
	 * @return mixed
	 */
	public function get( $key ) {
		if ( $key == 'type' ) {
			return $this->type->get_id();
		}

		if ( isset($this->data[$key]) ) {
			return $this->data[$key];
		}
		return NULL;
	}

	/**
	 * Get the PanelType associated with this panel
	 *
	 * @return PanelType
	 */
	public function get_type_object() {
		return $this->type;
	}

	/**
	 * Set the depth of the panel in the collection tree
	 *
	 * @param int $depth
	 *
	 * @return void
	 */
	public function set_depth( $depth ) {
		$this->depth = absint($depth);
	}

	/**
	 * Get the depth of the panel in the collection tree
	 * @return int
	 */
	public function get_depth() {
		return $this->depth;
	}

	/**
	 * Add a child panel
	 *
	 * @param Panel $child
	 *
	 * @return bool TRUE if the panel was added. FALSE if adding the
	 *              child would exceed its capacity.
	 */
	public function add_child( Panel $child ) {
		if ( $this->type->get_max_children() > count($this->children) ) {
			$this->children[] = $child;
			return TRUE;
		}
		return FALSE;
	}

	/**
	 * Get the child panels
	 *
	 * @return Panel[]
	 */
	public function get_children() {
		return $this->children;
	}

	public function jsonSerialize() {
		return array(
			'type' => (string)$this->type,
			'depth' => $this->depth,
			'data' => $this->data
		);
	}

	public function to_json() {
		return \ModularContent\Util::json_encode($this->jsonSerialize());
	}

	/**
	 * Render the panel to a string
	 *
	 * @return string
	 */
	public function render() {
		$renderer = new PanelRenderer($this);
		return $renderer->render();
	}

	/**
	 * Translate our admin settings into variables to export to the template
	 *
	 * @return array
	 */
	public function get_template_vars() {
		if ( isset($this->template_vars) ) {
			return $this->template_vars;
		}
		$vars = array();
		foreach ( $this->type->all_fields() as $field ) {
			$name = $field->get_name();
			if ( isset($this->data[$name]) ) {
				$vars[$name] = $field->get_vars($this->data[$name], $this);
			}
		}
		$this->template_vars = $vars;
		return $this->template_vars;
	}

	/**
	 * Translate our admin settings into variables to export to an external source
	 *
	 * @return array
	 */
	public function get_api_vars() {
		if ( isset( $this->api_vars ) ) {
			return $this->api_vars;
		}
		$vars = array();
		foreach ( $this->type->all_fields() as $field ) {
			$name = $field->get_name();
			if ( isset( $this->data[ $name ] ) ) {
				$vars[ $name ] = $field->get_vars_for_api( $this->data[ $name ], $this );
			}
		}
		$this->api_vars = $vars;

		return $this->api_vars;
	}

	/**
	 * Get the unprocessed values entered in the admin
	 * @return array
	 */
	public function get_settings() {
		return $this->data;
	}

	/**
	 * Get the HTML for rendering the admin for this panel
	 *
	 * @return string
	 */
	public function get_admin_html() {
		return $this->type->get_admin_template($this->data);
	}

	/**
	 * If this panel will likely need to pull in extra data for
	 * rendering, add it to the cache to avoid extra ajax requests
	 *
	 * @param AdminPreCache $cache
	 *
	 * @return void
	 */
	public function update_admin_cache( AdminPreCache $cache ) {
		foreach ( $this->type->all_fields() as $field ) {
			$name = $field->get_name();
			if ( isset($this->data[$name]) ) {
				$field->precache( $this->data[$name], $cache );
			}
		}
	}

	/**
	 * Manipulate POSTed data before saving to a PanelCollection
	 * @return array
	 */
	public function prepare_data_for_save() {
		$output = $this->data;
		foreach ( $this->type->all_fields() as $field ) {
			$name = $field->get_name();
			if ( isset( $this->data[$name] ) ) {
				$output[$name] = $field->prepare_data_for_save( $this->data[$name] );
			}
		}
		return $output;
	}
} 
