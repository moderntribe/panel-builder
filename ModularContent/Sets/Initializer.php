<?php


namespace ModularContent\Sets;


class Initializer {
	public function hook() {
		add_action( 'init', [ $this, 'register_post_type' ] );
		add_action( 'admin_init', [ $this, 'register_capabilities' ] );
		add_action( 'admin_init', [ $this, 'register_meta_boxes' ] );
	}

	public function register_post_type() {
		$configuration = new Post_Type_Configuration();
		$configuration->register_post_type();
		add_filter( 'post_updated_messages', [ $configuration, 'post_updated_messages' ], 10, 1 );
		add_filter( 'bulk_post_updated_messages', [ $configuration, 'bulk_edit_messages' ], 10, 2 );
	}

	public function register_capabilities() {
		$code_version = 1;
		$db_version = get_option( 'panel-set-capabilities-version', 0 );
		if ( version_compare( $code_version, $db_version, '<=' ) ) {
			return;
		}
		$capabilities = [
			'create',
			'read',
			'read_private',
			'edit',
			'edit_others',
			'edit_private',
			'edit_published',
			'delete',
			'delete_others',
			'delete_private',
			'delete_published',
			'publish',
		];
		foreach ( [ 'administrator', 'editor' ] as $role_name ) {
			$role = get_role( $role_name );
			foreach ( $capabilities as $cap ) {
				$role->add_cap( $cap . '_' . Set::POST_TYPE . 's' );
			}
		}
		update_option( 'panel-set-capabilities-version', 1 );
	}

	public function register_meta_boxes() {
		Panel_Set_Meta_Box::init();
		$content_types = new Content_Types_Meta_Box( Set::POST_TYPE, [
			'title' => __('Supported Content Types', 'tribe'),
			'context' => 'side',
			'priority' => 'default',
		]);
		$content_types->hook();

		$preview_image = new Preview_Image_Meta_Box( Set::POST_TYPE, [
			'title' => __('Image Preview', 'tribe'),
			'context' => 'side',
			'priority' => 'low',
		]);
		$preview_image->hook();
	}
}