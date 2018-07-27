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

	protected $options                = [];
	protected $options_cache          = NULL;
	protected $layout                 = 'compact';
	protected $global_options         = false;
	protected $enable_fonts_injection = false;

	/**
	 * @param array $args
	 */
	public function __construct( $args = [] ) {
		$this->check_layout( $args );

		$this->defaults['options']                = $this->options;
		$this->defaults['layout']                 = $this->layout;
		$this->defaults['global_options']         = $this->global_options;
		$this->defaults['enable_fonts_injection'] = $this->enable_fonts_injection;
		parent::__construct( $args );
	}

	protected function check_layout( $args ) {
		if ( isset( $args['layout'] ) && $args['layout'] !== 'compact' && $args['layout'] !== 'full' && $args['layout'] !== 'inline' ) {
			throw new \LogicException( 'Layout argument can only be "compact" or "full".' );
		}
	}

	protected function get_options() {
		if ( isset( $this->options_cache ) ) {
			return $this->options_cache;
		}
		if ( empty( $this->options ) ) {
			return array();
		}
		if ( is_callable( $this->options ) ) {
			$this->options_cache = call_user_func( $this->options );
		} else {
			$this->options_cache = $this->options;
		}
		return $this->options_cache;
	}

	public function get_blueprint() {
		$blueprint            = parent::get_blueprint();
		$options              = $this->get_options();
		$blueprint['options'] = [];
		foreach ( $options as $key => $label ) {
			$blueprint['options'][] = [
				'label' => $label,
				'value' => (string) $key, // cast to string so react-select has consistent types for comparison
			];
		}
		$blueprint['layout']                 = $this->layout;
		$blueprint['global_options']         = $this->global_options;
		$blueprint['enable_fonts_injection'] = $this->enable_fonts_injection;
		return $blueprint;
	}

	/**
	 * Massage submitted data before it's saved.
	 *
	 * @param mixed $data
	 *
	 * @return string
	 */
	public function prepare_data_for_save( $data ) {
		$data = (string) $data;
		if ( strlen( $data ) === 0 && (string) $this->default ) {
			$data = (string) $this->default;
		}
		return $data;
	}
} 