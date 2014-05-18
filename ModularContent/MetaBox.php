<?php


namespace ModularContent;


class MetaBox {
	const NONCE_ACTION = 'ModularContent_meta_box';
	const NONCE_NAME = 'ModularContent_meta_box_nonce';

	public function add_hooks() {
		add_action( 'post_submitbox_misc_actions', array( $this, 'display_nonce' ) );
		add_action( 'wp_insert_post_data', array( $this, 'maybe_filter_post_data' ), 10, 2 );
		add_filter( '_wp_post_revision_fields', array( $this, 'filter_post_revision_fields' ) );
	}

	public function filter_post_revision_fields( $fields ) {
		$fields['post_content_filtered'] = __('Modular Content', 'modular-content');
		return $fields;
	}

	public function register_meta_box() {
		add_meta_box(
			'modular-content',
			__('Modules', 'modular-content'),
			array($this, 'render')
		);
		$this->enqueue_scripts();
	}

	protected function enqueue_scripts() {
		wp_enqueue_script( 'modular-content-meta-box', Plugin::plugin_url('assets/js/meta-box-panels.js'), array( 'jquery-ui-sortable' ), FALSE, TRUE );
		wp_enqueue_style( 'modular-content-meta-box', Plugin::plugin_url('assets/css/meta-box-panels.css'), array( 'font-awesome' ) );
	}

	/**
	 * Put our nonce in the Publish box, so we can share it
	 * across all meta boxes
	 *
	 * @return void
	 */
	public static function display_nonce() {
		wp_nonce_field(self::NONCE_ACTION, self::NONCE_NAME);
	}

	/**
	 * Save the meta boxes for this post type
	 *
	 * @param int $post_id The ID of the post being saved
	 * @param object $post The post being saved
	 * @return array
	 */
	public function maybe_filter_post_data( $post_data, $post ) {
		if ( !$this->should_post_be_filtered($post_data, $post, $_POST) ) {
			return $post_data;
		}

		$post_data = $this->filter_post_data( $post_data, $post, $_POST );
		return $post_data;
	}

	public function render( $post ) {
		$collection = PanelCollection::find_by_post_id( $post->ID );
		include( Plugin::plugin_path('admin-views/meta-box-panels.php') );
	}

	/**
	 * Filter the post array before it is saved to the DB
	 *
	 * @param $post_data
	 * @param $post
	 * @param $submission
	 *
	 * @return mixed
	 */
	protected function filter_post_data( $post_data, $post, $submission ) {
		$panel_ids = $submission['panel_id'];
		if ( !is_array( $panel_ids ) ) {
			$panel_ids = array();
		}
		$panels = array();
		foreach ( $panel_ids as $id ) {
			if ( isset($submission[$id]) ) {
				$type = $submission[$id]['type'];
				$depth = $submission[$id]['depth'];
				$data = $submission[$id];
				unset($data['type']);
				unset($data['depth']);
				$panels[] = array('type' => $type, 'data' => $data, 'depth' => $depth);
			}
		}
		$collection = PanelCollection::create_from_array( array('panels' => $panels) );
		$json = $collection->to_json();
		$post_data['post_content_filtered'] = wp_slash($json);
		return $post_data;
	}

	/**
	 * Make sure this is a save_post where we actually want to update the meta
	 *
	 * @param array $post_data The updated data for the post that will go into the DB
	 * @param array $post The post that is being saved
	 * @param array $submission
	 * @return bool
	 */
	protected function should_post_be_filtered( $post_data, $post, $submission ) {
		// make sure this is a valid submission
		if ( !isset($submission[self::NONCE_NAME]) || !wp_verify_nonce($submission[self::NONCE_NAME], self::NONCE_ACTION) ) {
			return FALSE;
		}

		// make sure the submission is for the correct post
		if ( !isset($submission['post_ID']) || $submission['post_ID'] != $post['ID'] ) {
			return FALSE;
		}

		// don't do anything on autosave, auto-draft, bulk edit, or quick edit
		if ( wp_is_post_autosave( $post['ID'] ) || $post_data['post_status'] == 'auto-draft' || defined('DOING_AJAX') || isset($_GET['bulk_edit']) ) {
			return FALSE;
		}

		// looks like the answer is Yes
		return TRUE;
	}
} 