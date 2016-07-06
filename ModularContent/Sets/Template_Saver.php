<?php


namespace ModularContent\Sets;


class Template_Saver {
	const ACTION = 'save_panel_template';

	public function hook() {
		add_action( 'modular_content_metabox_data', [ $this, 'register_data' ], 10, 2 );
		add_action( 'wp_ajax_' . self::ACTION, [ $this, 'handle_request' ], 10, 0 );
	}

	public function register_data( $data, $post ) {
		$data[ 'template_saver' ] = [
			'enabled' => current_user_can( Set::EDIT_CAP ),
			'url'     => esc_url( $this->get_request_url() ),
			'params'  => [
				'action' => self::ACTION,
				'nonce'  => wp_create_nonce( self::ACTION ),
			],
		];
		return $data;
	}

	private function get_request_url() {
		$url = admin_url( 'admin-ajax.php' );
		return $url;
	}

	public function handle_request() {
		$request = $_POST;
		if ( !current_user_can( Set::EDIT_CAP ) ) {
			wp_send_json_error( [
				'error' => __( 'Permission Denied', 'modular-content' ),
			] );
		}
		$post_id = $this->create_panel_set( $request );
		if ( !$post_id ) {
			wp_send_json_error( [
				'error' => __( 'Unable to save panel set', 'modular-content' ),
			] );
		}
		$url = get_edit_post_link( $post_id, 'raw' );
		wp_send_json_success( [
			'post_id'  => $post_id,
			'edit_url' => $url,
		] );
	}

	private function create_panel_set( $request ) {
		if ( empty( $request[ 'title' ] ) || empty( $request[ 'state' ] ) ) {
			return 0;
		}
		$post_data = [
			'post_type'             => Set::POST_TYPE,
			'post_status'           => 'draft',
			'post_title'            => $request[ 'title' ],
			'post_content_filtered' => $request[ 'panels' ],
		];
		$post_id = wp_insert_post( $post_data );
		return $post_id;
	}

} 