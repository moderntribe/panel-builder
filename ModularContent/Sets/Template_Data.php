<?php


namespace ModularContent\Sets;

class Template_Data {

	public function hook() {
		add_action( 'modular_content_metabox_data', [ $this, 'register_data' ], 10, 2 );
	}

	/**
	 * @param array    $data
	 * @param \WP_Post $post
	 * @return array
	 */
	public function register_data( $data, $post ) {
		$templates = $this->get_templates( $post );
		$data[ 'templates' ] = $templates;
		return $data;
	}

	private function get_templates( $context_post ) {
		$posts = get_posts( [
			'post_type'      => Set::POST_TYPE,
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'fields'         => 'ids',
		] );
		if ( empty( $posts ) ) {
			return [ ];
		}
		$templates = [ ];
		foreach ( $posts as $post_id ) {
			$set = new Set( $post_id );
			if ( $set->supports_post_type( $context_post->post_type ) ) {
				$templates[] = $set;
			}
		}
		if ( !empty( $templates ) ) {
			array_unshift( $templates, new Set( 0 ) );
		}
		return $templates;
	}
} 