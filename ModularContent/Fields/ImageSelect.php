<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class ImageSelect
 *
 * @package ModularContent\Fields
 *
 * Use just like a Radio, but option values should be image URLs
 *
 * Also supports an image with a text label. The option value should
 * be an array with 'src' and 'label' keys.
 *
 *
 * $field = new ImageGallery( [
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
class ImageSelect extends Radio {

	public function render_field() {
		$options = array();
		$input_template = '<input type="radio" name="%s" value="%s" %s />';
		$image_template = '<img src="%s" alt="%s" width="80" height="52">';
		$label_template = '<span class="label-text">%s</span>';
		$option_template = '<label class="radio-option image-option">%s %s %s</label>';
		foreach ( $this->get_options() as $key => $description ) {
			if ( !is_array( $description ) ) {
				$description = [ 'src' => $description ];
			}
			$description = wp_parse_args( $description, [ 'src' => '', 'label' => '' ] );
			$checked = sprintf('<# if ( data.fields.%s == "%s" ) { #> checked="checked" <# } #> ', $this->name, esc_js($key));
			$input = sprintf( $input_template, $this->get_input_name(), esc_attr( $key ), $checked );
			$image = $description[ 'src' ] ? sprintf( $image_template, $description[ 'src' ], esc_attr( $key ) ) : '';
			$label = $description[ 'label' ] ? sprintf( $label_template, esc_html( $description[ 'label' ] ) ) : '';
			$options[] = sprintf( $option_template, $input, $image, $label );
		}

		echo implode("\n", $options);
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
}