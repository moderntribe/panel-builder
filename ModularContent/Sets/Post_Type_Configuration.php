<?php


namespace ModularContent\Sets;


class Post_Type_Configuration {
	public function register_post_type() {
		register_post_type( Set::POST_TYPE, $this->post_type_args() );
	}


	/**
	 * Build the args array for the post type definition
	 *
	 * @return array
	 */
	protected function post_type_args() {
		$args = [
			'labels'             => $this->labels(),
			'description'        => __( 'Saved panel templates', 'modular-content' ),
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => 'tools.php',
			'show_in_nav_menus'  => false,
			'show_in_admin_bar'  => false,
			'capability_type'    => Set::POST_TYPE,
			'map_meta_cap'       => true,
			'hierarchical'       => false,
			'supports'           => [ 'title', 'thumbnail', 'excerpt', 'revisions', 'modular-content' ],
			'has_archive'        => false,
		];

		$args = apply_filters( 'panel_set_post_type_args', $args );

		return $args;
	}

	public function labels() {
		$labels = [
			'name'               => __( 'Panel Sets', 'modular-content' ),
			'singular_name'      => __( 'Panel Set', 'modular-content' ),
			'add_new'            => __( 'Add New', 'modular-content' ),
			'add_new_item'       => __( 'Add New Panel Set', 'modular-content' ),
			'edit_item'          => __( 'Edit Panel Set', 'modular-content' ),
			'new_item'           => __( 'New Panel Set', 'modular-content' ),
			'view_item'          => __( 'View Panel Set', 'modular-content' ),
			'search_items'       => __( 'Search Panel Set', 'modular-content' ),
			'not_found'          => __( 'No Panel Sets Found', 'modular-content' ),
			'not_found_in_trash' => __( 'No Panel Sets Found in Trash', 'modular-content' ),
			'menu_name'          => __( 'Panel Sets', 'modular-content' ),
		];

		return $labels;
	}


	/**
	 * Post Updated Messages
	 *
	 * Filter the post updated messages so they match this post type
	 * Smart enough to handle public and none public types
	 *
	 *
	 * @param array $messages
	 *
	 * @return array
	 *
	 */
	public function post_updated_messages( $messages = [ ] ) {
		global $post;

		$messages[ Set::POST_TYPE ] = [
			0  => null,
			1  => __( 'Panel set updated.', 'modular-content' ),
			2  => __( 'Custom field updated.', 'modular-content' ),
			3  => __( 'Custom field deleted.', 'modular-content' ),
			4  => __( 'Panel set updated.', 'modular-content' ),
			5  => isset( $_GET[ 'revision' ] )
				? sprintf( __( 'Panel set restored to revision from %s', 'modular-content' ), wp_post_revision_title( (int)$_GET[ 'revision' ], false ) )
				: false,
			6  => __( 'Panel set published.', 'modular-content' ),
			7  => __( 'Panel set saved.', 'modular-content' ),
			8  => __( 'Panel set submitted. %s', 'modular-content' ),
			9  => sprintf(
				__( 'Panel set scheduled for: <strong>%1$s</strong>.', 'modular-content' ),
				date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) )
			),
			10 => __( 'Panel set draft updated.', 'modular-content' ),
		];

		return $messages;

	}


	/**
	 * Bulk Edit Messages
	 *
	 * Filters the bulk edit message to match the custom post type
	 *
	 * @param array $bulk_messages
	 * @param int   $bulk_counts
	 * @return array
	 */
	public function bulk_edit_messages( $bulk_messages, $bulk_counts ) {
		$bulk_messages[ Set::POST_TYPE ] = [
			'updated' => _n(
				'%s panel set updated.',
				'%s panel sets updated.',
				$bulk_counts[ 'updated' ],
				'modular-content' ),

			'locked' => _n(
				'%s panel set not updated, somebody is editing it.',
				'%s panel sets not updated, somebody is editing them.',
				$bulk_counts[ 'locked' ],
				'modular-content' ),

			'deleted' => _n(
				'%s panel set permanently deleted.',
				'%s panel sets permanently deleted.',
				$bulk_counts[ 'deleted' ],
				'modular-content' ),

			'trashed' => _n(
				'%s panel set moved to the Trash.',
				'%s panel sets moved to the Trash.',
				$bulk_counts[ 'trashed' ],
				'modular-content' ),

			'untrashed' => _n(
				'%s panel set restored from the Trash.',
				'%s panel sets restored from the Trash.',
				$bulk_counts[ 'untrashed' ],
				'modular-content' ),
		];

		return $bulk_messages;
	}
}