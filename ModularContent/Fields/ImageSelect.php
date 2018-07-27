<?php


namespace ModularContent\Fields;

/**
 * Class ImageSelect
 *
 * @package ModularContent\Fields
 *
 * Use just like a Radio, but option values should be image URLs
 *
 * Also supports an image with a text label. The option value should
 * be an array with 'src' and 'label' keys.
 */
class ImageSelect extends Radio {

	protected $option_width = 6;

	public function __construct( array $args = [] ) {
		$this->defaults['option_width'] = $this->option_width;
		parent::__construct( $args );
	}

	protected function get_options() {
		if ( isset( $this->options_cache ) ) {
			return $this->options_cache;
		}
		if ( empty( $this->options ) ) {
			return [];
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
		foreach ( $options as $key => $data ) {
			if ( ! is_array( $data ) ) {
				$data = [ 'src' => $data, 'label' => '' ];
			} else {
				$data = wp_parse_args( $data, [ 'src' => '', 'label' => '' ] );
			}
			$data['value']          = (string) $key;
			$blueprint['options'][] = $data;
		}
		$blueprint['option_width'] = (int) $this->option_width;
		unset( $blueprint['layout'] );

		return $blueprint;
	}
}