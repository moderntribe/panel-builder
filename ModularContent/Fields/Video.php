<?php


namespace ModularContent\Fields;
use ModularContent\OEmbedder;
use ModularContent\Panel;

/**
 * Class Video
 *
 * @package ModularContent\Fields
 *
 * A field for adding video embed URLs.
 *
 *
 * $field = new Video( array(
 *   'label' => __('Video URL'),
 *   'name' => 'video',
 *   'description' => __( 'The URL for the video' )
 * ) );
 */
class Video extends Text {
	public function render_field() {
		printf('<span class="panel-input-field"><input type="text" class="video-url" name="%s" value="%s" size="40" /></span>', $this->get_input_name(), $this->get_input_value());
		wp_enqueue_script( 'modular-content-video-field', \ModularContent\Plugin::plugin_url('assets/scripts/js/fields/video-field.js'), array('jquery', 'wp-util'), FALSE, TRUE );
	}

	/**
	 * @param string $url
	 * @param array $args Any additional args you want to pass to the oembed provider
	 *   Common args include:
	 *     - maxwidth
	 *     - maxheight
	 *
	 * Note that the oembed provider may not respect your arguments.
	 *
	 * @return object
	 */
	public static function get_data( $url, $args = array() ) {
		$oembed = new OEmbedder( $url, $args );
		return $oembed->get_oembed_data();
	}
}