<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class Select
 *
 * @package ModularContent\Fields
 *
 * A select box.
 */
class Select extends Field {
	protected $options = array();
	protected $options_cache = NULL;

	/**
	 * @param array $args
	 *
	 * Example usage:
	 *
	 * $field = new Select( array(
	 *   'label' => __('Pick One'),
	 *   'name' => 'my-field',
	 *   'description' => __( 'Pick the thing that you pick' )
	 *   'options' => array(
	 *     'first' => __( 'The First Option' ),
	 *     'second' => __( 'The Second Option' ),
	 *   )
	 * ) );
	 */
	public function __construct( $args = array() ){
		$this->defaults['options'] = $this->options;
		parent::__construct($args);
	}

	protected function get_options() {
		if ( isset($this->options_cache) ) {
			return $this->options_cache;
		}
		if ( empty($this->options) ) {
			return array();
		}
		if ( is_callable($this->options) ) {
			$this->options_cache = call_user_func($this->options);
		} else {
			$this->options_cache = $this->options;
		}
		return $this->options_cache;
	}

	public function get_blueprint() {
		$blueprint = parent::get_blueprint();
		$options = $this->get_options();
		$blueprint['options'] = [];
		foreach ( $options as $key => $label ) {
			$blueprint['options'][] = [
				'label' => $label,
				'value' => (string) $key, // cast to string so react-select has consistent types for comparison
			];
		}
		return $blueprint;
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 * @return string
	 */
	public function prepare_data_for_save( $data ) {
		$data = (string) $data;
		if ( strlen( $data ) === 0 && (string) $this->default ) {
			$data = (string) $this->default;
		}
		return  $data;
	}
} 