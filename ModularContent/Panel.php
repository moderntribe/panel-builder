<?php


namespace ModularContent;


/**
 * Class Panel
 *
 * @package ModularContent
 */
class Panel implements \JsonSerializable {
	/** @var PanelType */
	private $type = NULL;
	private $depth = 0;
	private $data = array();
	private $template_vars = NULL;
	/** @var Panel[] */
	private $children = array();

	public function __construct( PanelType $type, $data = array(), $depth = 0 ) {
		$this->type = $type;
		$this->data = $data;
		$this->set_depth($depth);
	}

	public function set( $key, $value ) {
		$this->data[$key] = $value;
	}

	public function get( $key ) {
		if ( $key == 'type' ) {
			return $this->type->get_id();
		}

		if ( isset($this->data[$key]) ) {
			return $this->data[$key];
		}
		return NULL;
	}

	public function get_type_object() {
		return $this->type;
	}

	public function set_depth( $depth ) {
		$this->depth = absint($depth);
	}

	public function get_depth() {
		return $this->depth;
	}

	public function add_child( Panel $child ) {
		if ( $this->type->get_max_children() > count($this->children) ) {
			$this->children[] = $child;
			return TRUE;
		}
		return FALSE;
	}

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
		return json_encode($this->jsonSerialize());
	}

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

	public function get_settings() {
		return $this->data;
	}

	public function get_admin_html() {
		return $this->type->get_admin_template($this->data);
	}

	public function update_admin_cache( AdminPreCache $cache ) {
		foreach ( $this->type->all_fields() as $field ) {
			$name = $field->get_name();
			if ( isset($this->data[$name]) ) {
				$field->precache( $this->data[$name], $cache );
			}
		}
	}
} 