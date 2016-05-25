<?php

namespace ModularContent\Preview;

use Codeception\TestCase\WPTestCase;

class Preview_Request_Handler_Test extends WPTestCase {
	public function test_validate_post_id() {
		$this->expectException( \InvalidArgumentException::class );
		$args = [];
		$handler = new Preview_Request_Handler();
		$handler->render_panels( $args );
	}

	public function test_validate_permission() {
		$post_id = $this->factory->post->create();

		$filter = function( $caps ) {
			$caps[ 'edit_posts' ] = false;
			return $caps;
		};
		$this->expectException( \RuntimeException::class );
		$args = [ 'post_id' => $post_id ];
		$handler = new Preview_Request_Handler();

		add_filter( 'user_has_cap', $filter, 100 );
		$handler->render_panels( $args );
		remove_filter( 'user_has_cap', $filter, 100 );
	}

	public function test_render() {
		$post_id = $this->factory->post->create();
		$args = [ 'post_id' => $post_id, 'panels' => [] ];
		$handler = new Preview_Request_Handler();

		$filter = function( $caps, $requested ) {
			foreach ( $requested as $cap ) {
				$caps[ $cap ] = true;
			}
			return $caps;
		};
		add_filter( 'user_has_cap', $filter, 100, 2 );
		$output = $handler->render_panels( $args );
		remove_filter( 'user_has_cap', $filter, 100 );

		$this->assertRegExp( '#<div class="panel-collection">.*</div>#s', $output );
	}
}