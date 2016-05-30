<?php


namespace ModularContent\Preview;

use ModularContent\Loop;
use ModularContent\PanelCollection;
use ModularContent\Plugin;

class Preview_Builder {
	private $post_id = 0;
	private $panels  = [ ];

	/** @var Loop */
	private $loop;

	/**
	 * Preview_Builder constructor.
	 *
	 * @param array $args Expecting the context `post_id` (int) and the `panels` (array)
	 * @param Loop  $loop A panel loop instance, or null to use the default Preview_Loop
	 */
	public function __construct( array $args, Loop $loop = null ) {
		$this->parse_args( $args );
		$this->loop = empty( $loop ) ? new Preview_Loop() : $loop;
	}

	public function render() {
		$this->validate();

		$collection = $this->get_panels();
		$this->setup_environment( $collection );

		$content = Plugin::instance()->get_the_panels();

		$this->cleanup_environment();

		return $content;
	}

	private function parse_args( $args ) {
		$this->post_id = isset( $args[ 'post_id' ] ) ? (int)$args[ 'post_id' ] : 0;
		$this->panels = isset( $args[ 'panels' ] ) ? $args[ 'panels' ] : [ ];
	}

	/**
	 * Validate that the current user can view this preview
	 *
	 * @throws \Exception
	 */
	private function validate() {
		if ( empty( $this->post_id ) ) {
			throw new \InvalidArgumentException( __( 'Missing post ID context for preview', 'modular-content' ), 400 );
		}
		if ( !current_user_can( 'edit_post', $this->post_id ) ) {
			throw new \RuntimeException( __( 'Not authorized to edit this post', 'modular-content' ), 403 );
		}
	}

	/**
	 * @return PanelCollection
	 */
	private function get_panels() {
		$collection = PanelCollection::create_from_array( [ 'panels' => $this->panels ] );
		return $collection;
	}

	/**
	 * Setup the globals that we need to render the panels
	 *
	 * @param PanelCollection $collection
	 */
	private function setup_environment( PanelCollection $collection ) {
		$post = get_post( $this->post_id );
		$GLOBALS[ 'post' ] = $post;
		setup_postdata( $post );

		$this->loop->reset( $collection );
		Plugin::instance()->set_loop( $this->loop );
	}

	/**
	 * Clean up globals that we set earlier
	 */
	private function cleanup_environment() {
		wp_reset_postdata();
	}
}