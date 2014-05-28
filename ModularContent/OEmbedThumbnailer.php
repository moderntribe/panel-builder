<?php


namespace ModularContent;


class OEmbedThumbnailer {
	private $url = '';
	private $args = array();
	private $providers = array();

	public function __construct( $url, $args ) {
		$this->url = $url;
		$this->args = $args;
		require_once( ABSPATH . WPINC . '/class-oembed.php' );
		$oembed = _wp_oembed_get_object();
		$this->providers = $oembed->providers;
	}

	public function get_thumbnail() {
		$cached = $this->get_cache();
		if ( $cached ) {
			return $cached;
		}
		$provider = $this->get_provider();
		if ( !$provider ) {
			return '';
		}
		$oembed = _wp_oembed_get_object();
		$data = $oembed->fetch( $provider, $this->url, $this->args );

		$thumbnail = $data->thumbnail_url;
		$this->set_cache($thumbnail);
		return $thumbnail;
	}

	protected function get_cache() {
		return wp_cache_get( $this->cache_key(), 'oembed_thumb' );
	}

	protected function set_cache( $value ) {
		wp_cache_set( $this->cache_key(), $value, 'oembed_thumb', WEEK_IN_SECONDS );
	}

	protected function cache_key() {
		return '_oembed_thumb_'.md5($this->url.serialize($this->args));
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
} 