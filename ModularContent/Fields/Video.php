<?php


namespace ModularContent\Fields;
use WP_oEmbed;

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
		$oembed = new WP_oEmbed();
		return $oembed->get_html( $url, $args );
	}
}