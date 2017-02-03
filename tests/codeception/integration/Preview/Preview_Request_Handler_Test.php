<?php

namespace ModularContent\Preview;

use Codeception\TestCase\WPTestCase;

class Preview_Request_Handler_Test extends WPTestCase {
	public function test_validate_post_id() {
		$this->expectException( \InvalidArgumentException::class );
		$args = [];
		$preview_builder = new Preview_Builder( $args, new Ajax_Preview_Loop() );
		$preview_builder->render();
	}

	public function test_validate_permission() {
		$post_id = $this->factory->post->create();

		$filter = function( $caps ) {
			$caps[ 'edit_posts' ] = false;
			return $caps;
		};
		$this->expectException( \RuntimeException::class );
		$args = [ 'post_id' => $post_id ];

		add_filter( 'user_has_cap', $filter, 100 );
		$preview_builder = new Preview_Builder( $args, new Ajax_Preview_Loop() );
		$preview_builder->render();
		remove_filter( 'user_has_cap', $filter, 100 );
	}

	public function test_render() {
		$post_id = $this->factory->post->create();
		$args = [ 'post_id' => $post_id, 'panels' => [] ];

		$filter = function( $caps, $requested ) {
			foreach ( $requested as $cap ) {
				$caps[ $cap ] = true;
			}
			return $caps;
		};
		add_filter( 'user_has_cap', $filter, 100, 2 );
		$preview_builder = new Preview_Builder( $args, new Ajax_Preview_Loop() );
		$output = $preview_builder->render();
		remove_filter( 'user_has_cap', $filter, 100 );

		$this->assertEquals( '', $output );
	}
}