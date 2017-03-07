<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class Image_Select
 *
 * @package ModularContent\Fields
 *
 * Use just like a Radio, but option values should be image URLs
 *
 * Also supports an image with a text label. The option value should
 * be an array with 'src' and 'label' keys.
 *
 *
 * $field = new Image_Select( [
 *   'label'       => __('Layout'),
 *   'name'        => 'layout',
 *   'description' => __( 'Images to display in the gallery' ),
 *   'options'     => [
 *     'left'        => [
 *       'src'         => 'http://example.com/path/to/module-layout-left.png',
 *       'label'       => __( 'Left' ),
 *     ],
 *     'right'       => [
 *       'src'         => 'http://example.com/path/to/module-layout-right.png',
 *       'label'       => __( 'Right' ),
 *     ],
 *   )
 * ) );
 *
 */
class Image_Select extends Radio {

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
				$data = [ 'src' => $data, 'label' => '' ];
			} else {
				$data = wp_parse_args( $data, [ 'src' => '', 'label' => '' ] );
			}
			$data['value'] = $key;
			$blueprint['options'][] = $data;
		}
		return $blueprint;
	}
}