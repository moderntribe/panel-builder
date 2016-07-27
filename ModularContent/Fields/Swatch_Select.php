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
 *
 *
 * $field = new Swatch_Select( [
 *   'label'       => __('Background Color'),
 *   'name'        => 'background',
 *   'description' => __( 'The panel background color' ),
 *   'options'     => [
 *     'blue'        => [
 *       'color'       => '#0000BB',
 *       'label'       => __( 'Blue' ),
 *     ],
 *     'green-blue'       => [
 *       'color'         => 'linear-gradient(113.59deg, rgba(186, 191, 16, 1) 0%, rgba(169, 189, 36, 1) 12.24%, rgba(126, 185, 88, 1) 37.36%, rgba(57, 179, 171, 1) 72.79%, rgba(0, 174, 239, 1) 100%)',
 *       'label'       => __( 'Green to Blue Gradient' ),
 *     ],
 *   )
 * ) );
 *
 */
class Swatch_Select extends Radio {

	public function render_field() {
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
			$data['value'] = $key;
			$blueprint['options'][] = $data;
		}
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