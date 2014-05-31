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

	public function __construct( PanelType $type, $data = array(), $depth = 0 ) {
		$this->type = $type;
		$this->data = $data;
		$this->set_depth($depth);
	}

	public function set( $key, $value ) {
		$this->data[$key] = $value;
	}

	public function get( $key ) {
		if ( $key == $this->type ) {
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
	 * Translate our admin settings into variable to export to the template
	 *
	 * @return array
	 */
	public function get_template_vars() {
		return $this->type->get_template_vars($this->data);
	}

	public function get_settings() {
		return $this->data;
	}

	public function get_admin_html() {
		return $this->type->get_admin_template($this->data);
	}
} 