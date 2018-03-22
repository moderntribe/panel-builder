<?php

namespace ModularContent\Preview;

use ModularContent\Meta_Copier;
use ModularContent\Plugin;

class Autosaver {

	const ACTION = 'panels_create_autosave';

	public function hook() {
		$handler = Plugin::instance()->ajax_handler();
		$handler->add_callback( self::ACTION, [ $this, 'handle_request' ] );
		add_filter( 'panels_js_config', [ $this, 'add_ajax_endpoint' ] );
	}

	public function handle_request() {
		$body      = empty( $_POST['panels'] ) ? $this->get_json_body() : $_POST;
		$post_data = $body['post_data'];

		if ( empty( $post_data ) ) {
			wp_send_json_error( 'Missing required parameter.', 400 );
		}

		$revision_id = wp_autosave( $post_data );

		$this->copy_post_meta_to_autosaves( $revision_id );

		wp_send_json_success( $revision_id, 200 );
	}

	protected function get_json_body(): array {
		$body = json_decode( file_get_contents( 'php://input' ), true );
		if ( empty( $body ) ) {
			return [];
		}

		return $body;
	}

	public function copy_post_meta_to_autosaves( $revision_id ) {
		$parent = wp_is_post_autosave( $revision_id );
		if ( ! empty( $parent ) ) {
			$copier = new Meta_Copier();
			$copier->copy_meta( $parent, $revision_id );
		}
	}

	public function add_ajax_endpoint( $data ) {
		$data['autosave_ajax_endpoint'] = self::ACTION;

		return $data;
	}

}