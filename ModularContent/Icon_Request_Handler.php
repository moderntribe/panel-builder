<?php

namespace ModularContent;

/**
 * Class Icon_Request_Handler
 *
 *
 */
class Icon_Request_Handler {
	const ACTION               = 'panels-fetch-icon-options';
	const ICONS_OPTIONS_FILTER = 'panels_icons_options';

	public function hook() {
		$handler = Plugin::instance()->ajax_handler();
		$handler->add_callback( self::ACTION, [ $this, 'handle_request' ] );
	}

	public function handle_request() {
		$data = apply_filters( self::ICONS_OPTIONS_FILTER, [] );
		$key  = filter_input( INPUT_POST, 'key', FILTER_SANITIZE_STRING );

		if ( ! isset( $data[ $key ] ) ) {
			wp_send_json_success( [] );
		}

		wp_send_json_success( $data[ $key ] );
	}
}