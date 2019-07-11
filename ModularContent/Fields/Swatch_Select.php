<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class Swatch_Select
 *
 * @package ModularContent\Fields
 *
 * Use just like a Radio, but option values should be colors
 *
 * Also supports a color with a text label. The option value should
 * be an array with 'color' and 'label' keys.
 */
class Swatch_Select extends Radio {

	protected $option_width = 4;

	public function __construct( array $args = [] ) {
		$this->defaults['option_width'] = $this->option_width;
		parent::__construct( $args );
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
		foreach ( $options as $key => $data ) {
			if ( !is_array( $data ) ) {
				$data = [ 'color' => $data, 'label' => '' ];
			} else {
				$data = wp_parse_args( $data, [ 'color' => '', 'label' => '' ] );
			}
			$data['value'] = (string) $key;
			$blueprint['options'][] = $data;
		}
		$blueprint['option_width'] = $this->option_width;
		unset( $blueprint['layout'] );
		return $blueprint;
	}

	public function get_vars( $key, $panel ) {
		$options = $this->get_options();
		$data = [ ];
		if ( isset( $options[ $key ] ) ) {
			$data[ 'key' ] = $key;
			if ( is_array( $options[ $key] ) ) {
				$data[ 'color' ] = isset( $options[ $key ][ 'color' ] ) ? $options[ $key ][ 'color' ] : '';
			} else {
				$data[ 'color' ] = $options[ $key ];
			}
		}
		$data = apply_filters( 'panels_field_vars', $data, $this, $panel );

		return $data;
	}
}