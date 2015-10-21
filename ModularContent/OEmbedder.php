<?php


namespace ModularContent;

/**
 * Class OEmbedder
 *
 * @package ModularContent
 *
 * A utility class for getting oembed data (e.g., video thumbnails)
 */
class OEmbedder {
	private $url = '';
	private $args = array();
	private $providers = array();
	private $data = NULL;

	public function __construct( $url, $args ) {
		$this->url = $url;
		$this->args = $args;
		require_once( ABSPATH . WPINC . '/class-oembed.php' );
		$oembed = _wp_oembed_get_object();
		$this->providers = $oembed->providers;
	}

	public function get_thumbnail() {
		return $this->get_field('thumbnail_url');
	}

	public function get_thumbnail_width() {
		return $this->get_field('thumbnail_width');
	}

	public function get_thumbnail_height() {
		return $this->get_field('thumbnail_height');
	}

	public function get_html() {
		return $this->get_field('html');
	}

	public function get_height() {
		return $this->get_field('height');
	}

	public function get_width() {
		return $this->get_field('width');
	}

	public function get_title() {
		return $this->get_field('title');
	}

	public function get_url() {
		return $this->url;
	}

	public function get_field( $field_name ) {
		$data = $this->get_oembed_data();
		if ( isset($data->$field_name) ) {
			return $data->$field_name;
		}
		return '';
	}

	public function get_oembed_data() {
		$cached = $this->get_cache();
		if ( $cached ) {
			return $cached;
		}
		$provider = $this->get_provider();
		if ( !$provider ) {
			return new \stdClass();
		}
		$oembed = _wp_oembed_get_object();
		$data = $oembed->fetch( $provider, $this->url, $this->args );
		if ( !$data ) {
			$data = new \stdClass();
		}
		//youku
		if( !empty( $data->data ) ){
			$data = $this->get_youku_data( $data );
		}

		$this->set_cache( $data );
		return $data;
	}

	protected function get_cache() {
		if ( isset($this->data) ) {
			return $this->data;
		}
		return wp_cache_get( $this->cache_key(), 'oembed_thumb' );
	}

	protected function set_cache( $value ) {
		wp_cache_set( $this->cache_key(), $value, 'oembed_thumb', WEEK_IN_SECONDS );
		$this->data = $value;
	}

	protected function cache_key() {
		return '_oembed_thumb_'.md5($this->url.serialize($this->args)) . 2;
	}

	protected function get_provider() {
		$provider = false;
		foreach ( $this->providers as $matchmask => $data ) {
			list( $providerurl, $regex ) = $data;

			// Turn the asterisk-type provider URLs into regex
			if ( !$regex ) {
				$matchmask = '#' . str_replace( '___wildcard___', '(.+)', preg_quote( str_replace( '*', '___wildcard___', $matchmask ), '#' ) ) . '#i';
				$matchmask = preg_replace( '|^#http\\\://|', '#https?\://', $matchmask );
			}

			if ( preg_match( $matchmask, $this->url ) ) {
				$provider = str_replace( '{format}', 'json', $providerurl ); // JSON is easier to deal with than XML
				break;
			}
		}

		if ( !$provider ) {
			$oembed = _wp_oembed_get_object();
			$provider = $oembed->discover( $this->url );
		}

		return $provider;
	}


	function youku_iframe( $matches, $attr = null, $url = null, $rawattr = null ){
		if( !empty( $rawattr[ 'width' ] ) && !empty( $rawattr[ 'height' ] ) ){
			$width  = (int) $rawattr[ 'width' ];
			$height = (int) $rawattr[ 'height' ];
		} else {
			list( $width, $height ) = wp_expand_dimensions( 480, 400, 700, 650 );
		}

		return '<iframe width=' . esc_attr( $width ) . ' height=' . esc_attr( $height ) . ' src="http://player.youku.com/embed/' . esc_attr( $matches[ 1 ] ) . '" frameborder=0 allowfullscreen></iframe>';

	}


	public function get_youku_data( $data ){
		if( empty( $data->data[ 0 ] ) ){
			return $data;
		}
		$data                = $data->data[ 0 ];
		//$data->thumbnail_url = $data->logo; Unreliable
		$data->thumbnail_url = "http://events.youku.com/global/api/video-thumb.php?vid=" . $data->vidEncoded;
		$data->html          = $this->youku_iframe( array( 1 => $data->vidEncoded ) );

		return $data;
	}
} 