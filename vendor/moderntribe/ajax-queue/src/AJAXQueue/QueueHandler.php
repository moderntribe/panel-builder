<?php

namespace AJAXQueue;


/**
 * Class QueueHandler
 *
 * @package AJAXQueue
 */
class QueueHandler {

	/**
	 * Registers the handler in the WP AJAX API
	 *
	 * @param string $action Name of the action this instance is going to handle
	 */
	public function __construct( $action ) {
		add_action( 'wp_ajax_' . $action,        [ $this, 'handler' ] );
		add_action( 'wp_ajax_nopriv_' . $action, [ $this, 'handler' ] );
	}

	/**
	 * Handles the main AJAX call.
	 *
	 * It calls all the individual handlers and collects the responses.
	 */
	public function handler() {

		// Die if it's not a valid request
		$this->_validate_request();

		$requests = $_POST['requests'];
		$data     = [ ];

		// Make sure wp_die() doesn't actually die
		add_filter( 'wp_die_ajax_handler', [ $this, 'die_handler' ] );

		foreach ( $requests as $random_key => $request ) {

			// Simulate the POST request
			// ToDo: Make sure this is valid regarding the PHP config
			$_POST = ! empty( $request['opts'] ) ? $request['opts'] : [ ];

			ob_start();

			// Standard WP AJAX call
			if ( is_user_logged_in() ) {
				do_action( 'wp_ajax_' . $request['action'] );
			} else {
				do_action( 'wp_ajax_nopriv_' . $request['action'] );
			}

			// Store the response from the AJAX handler
			$data[ $random_key ] = json_decode( ob_get_clean() );
		}

		// End the chaos and bring back the sanity
		remove_filter( 'wp_die_ajax_handler', [ $this, 'die_handler' ] );

		// ToDo: Do we want to handle failure here? What need to happen for this handler to fail?
		wp_send_json_success( $data );
	}

	/**
	 * Hooks into wp_die_ajax_handler to make sure it doesn't actually die,
	 * so we can keep calling the individual handlers.
	 *
	 * @return \Closure
	 */
	public function die_handler() {

		return function ( $message, $title, $args ) {
			return;
		};
	}


	/**
	 * Makes sure this is a valid request to our handler
	 */
	protected function _validate_request() {
		if ( empty( $_POST['requests'] ) || ! is_array( $_POST['requests'] ) ) {
			wp_send_json_error();
		}
	}

}