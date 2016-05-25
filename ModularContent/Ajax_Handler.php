<?php


namespace ModularContent;


class Ajax_Handler {
	private $callbacks = [ ];

	public function hook() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			add_action( 'admin_init', [ $this, 'register_callbacks' ], 10, 0 );
		}
	}

	/**
	 * @param string   $action
	 * @param callable $callback
	 */
	public function add_callback( $action, $callback ) {
		$this->callbacks[ $action ][] = $callback;
	}

	public function register_callbacks() {
		foreach ( $this->callbacks as $action => $callbacks ) {
			foreach ( $callbacks as $c ) {
				add_action( 'wp_ajax_' . $action, $c );
			}
		}
	}
}