<?php


namespace ModularContent\Preview;


use ModularContent\Meta_Copier;

class Preview_Revision_Indicator {
	private $autosave_parent_id = 0;
	private $last_post_revision = 0;

	public function hook() {
		add_filter( 'heartbeat_received', [ $this, 'setup_autosave_tracking_hooks' ], 499, 3 ); // autosave runs at 500
		add_filter( 'heartbeat_received', [ $this, 'add_post_revision_to_heartbeat_response' ], 501, 3 ); // autosave runs at 500
	}

	public function setup_autosave_tracking_hooks( $response, $data, $screen_id ) {
		if ( empty( $data[ 'wp_autosave' ] ) ) {
			return $response;
		}
		$this->autosave_parent_id = (int) $data[ 'wp_autosave' ][ 'post_id' ];
		add_action( '_wp_put_post_revision', [ $this, 'track_saved_post_revisions' ], 10, 1 );
		add_action( '_wp_put_post_revision', [ $this, 'copy_post_meta_to_autosaves' ], 10, 1 );
		add_action( 'wp_creating_autosave', [ $this, 'track_updated_post_revisions' ], 10, 1 );

		return $response;
	}

	public function add_post_revision_to_heartbeat_response( $response, $data, $screen_id ) {
		if ( ! empty( $this->last_post_revision ) && ! empty( $response[ 'wp_autosave' ][ 'success' ] ) ) {
			$response[ 'wp_autosave' ][ 'revision_id' ] = $this->last_post_revision;
		}
		return $response;
	}

	public function track_saved_post_revisions( $revision_id ) {
		if ( $this->autosave_parent_id === (int) wp_is_post_autosave( $revision_id ) ) {
			$this->last_post_revision = (int) $revision_id;
		}
	}

	public function track_updated_post_revisions( $revision_data ) {
		if ( $this->autosave_parent_id === (int) $revision_data['post_parent'] ) {
			$this->last_post_revision = (int) $revision_data[ 'ID' ];
		}
	}

	public function copy_post_meta_to_autosaves( $revision_id ) {
		$parent = wp_is_post_autosave( $revision_id );
		if ( ! empty( $parent ) ) {
			$copier = new Meta_Copier();
			$copier->copy_meta( $parent, $revision_id );
		}
	}
}
