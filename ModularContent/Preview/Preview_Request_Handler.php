<?php


namespace ModularContent\Preview;

use ModularContent\Plugin;

/**
 * Class Preview_Request_Handler
 *
 *
 */
class Preview_Request_Handler {
	const ACTION = 'panel_preview';

	public function hook() {
		$handler = Plugin::instance()->ajax_handler();
		$handler->add_callback( self::ACTION, [ $this, 'handle_request' ] );
	}

	/**
	 * Hanels an ajax request for rendered panels
	 *
	 * @return void
	 */
	public function handle_request() {
		try {
			$preview_builder = new Preview_Builder( $_POST, new Ajax_Preview_Loop() );
			$panels = $preview_builder->render();
			wp_send_json_success( [
				'panels' => $panels,
			] );
		} catch ( \Exception $e ) {
			wp_send_json_error( [
				'code'    => $e->getCode(),
				'message' => $e->getMessage(),
			] );
		}
	}
}