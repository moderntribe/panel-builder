<?php

namespace ModularContent;

/**
 * wp_kses() treats post_content_filtered as HTML, but we're storing
 * JSON there. This filters individual panel fields while leaving the
 * overall JSON structure intact.
 *
 * @package ModularContent
 */
class Kses {
	/** @var self */
	private static $instance = NULL;

	public function __construct() {}

	/**
	 * @param string $value The unfiltered post_content_filtered
	 * @return string The filtered value
	 * @see content_filtered_save_pre
	 * @see wp_filter_post_kses()
	 */
	public function filter_content_filtered( $value ) {
		if ( !$this->is_jsonish( $value ) ) {
			return $value; // it's not a panel set
		}
		$json = wp_unslash( $value );
		try {
			$unfiltered_collection = PanelCollection::create_from_json( $json );
		} catch ( \Exception $e ) {
			return $value; // not a panel set
		}
		$filtered_collection = new PanelCollection();
		foreach ( $unfiltered_collection->panels() as $panel ) {
			$filtered_collection->add_panel( $this->filter_panel( $panel ) );
		}
		return wp_slash( \ModularContent\Util::json_encode($filtered_collection) );
	}

	private function is_jsonish( $value ) {
		return substr( $value, 0, 1 ) == '{';
	}

	/**
	 * @param Panel $panel
	 *
	 * @return Panel
	 */
	private function filter_panel( $panel ) {
		foreach ( $panel->get_settings() as $key => $value ) {
			$panel->set( $key, $this->filter_value( $value ) );
		}
		return $panel;
	}

	private function filter_value( $value ) {
		if ( is_array( $value ) ) {
			foreach ( $value as $k => $v ) {
				$value[$k] = $this->filter_value( $v );
			}
		} elseif ( is_string( $value ) ) {
			$value = $this->filter_string( $value );
		}

		return $value;
	}

	private function filter_string( $value ) {
		return wp_kses( $value, 'post' );
	}

	/**
	 * @return self
	 */
	public static function instance() {
		if ( empty( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
}
