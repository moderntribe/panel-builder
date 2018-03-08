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
		add_filter( 'posts_results', array( $this, 'filter_preview_posts' ), 10, 2 );
	}

	/**
	 * Hanels an ajax request for rendered panels
	 *
	 * @return void
	 */
	public function handle_request() {
		try {
			$body = empty( $_POST['panels'] ) ? $this->get_json_body() : $_POST;
			$data = stripslashes_deep( $body );
			$preview_builder = new Preview_Builder( $data, new Ajax_Preview_Loop() );
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

	protected function get_json_body(): array {
		$body = json_decode( file_get_contents( 'php://input' ), true );
		if ( empty( $body ) ) {
			return [];
		}

		return $body;
	}

	/**
	 * WP will give a 404 for a preview of an auto-draft post.
	 *
	 * @param \WP_Post[] $posts
	 * @param \WP_Query $query
	 * @return \WP_Post[]
	 */
	public function filter_preview_posts( $posts, $query ) {
		if ( ! empty( $_GET[ 'preview_panels' ] ) && $query->is_main_query() ) {
			foreach ( $posts as $post ) {
				if ( $post->post_status === 'auto-draft' ) {
					// override the post status so that WP will treat is a viewable
					$post->post_status = 'draft';
				}
			}
		}
		return $posts;
	}
}