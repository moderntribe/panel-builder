<?php


namespace ModularContent\Preview;

use ModularContent\PanelCollection;
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
			$panels = $this->render_panels( $_POST );
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

	/**
	 * Render the panels indicated in $args
	 *
	 * @param array $args Expecting the context `post_id` (int) and the `panels` (array)
	 * @return string
	 */
	public function render_panels( $args ) {
		$args = $this->parse_args( $args );
		$this->validate_args( $args );

		$collection = $this->get_panels( $args[ 'panels' ] );

		$this->setup_environment( $collection, $args[ 'post_id' ] );

		$content = Plugin::instance()->get_the_panels();

		$this->cleanup_environment();

		return $content;
	}

	private function parse_args( $request ) {
		$args = [ ];
		$args[ 'post_id' ] = isset( $request[ 'post_id' ] ) ? (int)$request[ 'post_id' ] : 0;
		$args[ 'panels' ] = isset( $request[ 'panels' ] ) ? $request[ 'panels' ] : [ ];
		return $args;
	}

	/**
	 * Validate that the current user can view this preview
	 *
	 * @param array $args
	 * @return void
	 * @throws \Exception
	 */
	private function validate_args( $args ) {
		if ( empty( $args[ 'post_id' ] ) ) {
			throw new \InvalidArgumentException( __( 'Missing post ID context for preview', 'modular-content' ), 400 );
		}
		if ( !current_user_can( 'edit_post', $args[ 'post_id' ] ) ) {
			throw new \RuntimeException( __( 'Not authorized to edit this post', 'modular-content' ), 403 );
		}
	}

	/**
	 * @param array $panels
	 * @return PanelCollection
	 */
	private function get_panels( $panels ) {
		$collection = PanelCollection::create_from_array( [ 'panels' => $panels ] );
		return $collection;
	}

	/**
	 * Setup the globals that we need to render the panels
	 *
	 * @param PanelCollection $collection
	 * @param    int          $post_id
	 */
	private function setup_environment( PanelCollection $collection, $post_id ) {
		$post = get_post( $post_id );
		$GLOBALS[ 'post' ] = $post;
		setup_postdata( $post );

		$loop = new Preview_Loop( $collection );
		Plugin::instance()->set_loop( $loop );
	}

	/**
	 * Clean up globals that we set earlier
	 */
	private function cleanup_environment() {
		wp_reset_postdata();
	}
}