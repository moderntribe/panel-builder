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
		if ( isset($this->data[$key]) ) {
			return $this->data[$key];
		}
		return NULL;
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
		$template = $this->type->get_template();
		if ( empty($template) ) {
			return; // cannot render without a template
		}
		$vars = $this->setup_template_vars();
		do_action( 'render_panel', $this->type, $vars, $this );
		$template->render($vars, $this->data);
	}

	/**
	 * Translate our admin settings into variable to export to the template
	 *
	 * @return array
	 */
	protected function setup_template_vars() {
		$this->type->get_template_vars($this->data);
	}

	public function get_admin_html() {
		return $this->type->get_admin_template($this->data);
	}
} 