<?php


namespace ModularContent;


class MetaBox {
	const NONCE_ACTION = 'ModularContent_meta_box';
	const NONCE_NAME = 'ModularContent_meta_box_nonce';

	public function add_hooks() {
		add_action( 'post_submitbox_misc_actions', array( $this, 'display_nonce' ) );
		add_action( 'wp_insert_post_data', array( $this, 'maybe_filter_post_data' ), 10, 2 );
		add_filter( '_wp_post_revision_fields', array( $this, 'filter_post_revision_fields' ) );
		add_action( 'wp_ajax_panel-video-preview', array( $this, 'build_video_preview' ), 10, 0 );
		add_action( 'wp_ajax_posts-field-posts-search', array( $this, 'get_post_field_search_results' ), 10, 0 );
		add_action( 'wp_ajax_posts-field-fetch-titles', array( $this, 'ajax_fetch_titles' ), 10, 0 );
		add_action( 'wp_ajax_posts-field-fetch-preview', array( $this, 'ajax_fetch_preview' ), 10, 0 );
	}

	public function filter_post_revision_fields( $fields ) {
		$fields['post_content_filtered'] = __('Modular Content', 'modular-content');
		return $fields;
	}

	public function register_meta_box() {
		add_meta_box(
			'modular-content',
			Plugin::instance()->get_label('plural'),
			array($this, 'render'),
			null,
			'normal',
			'high'
		);
		$this->enqueue_scripts();
	}

	protected function enqueue_scripts() {
		wp_enqueue_script( 'modular-content-meta-box', Plugin::plugin_url('assets/scripts/js/meta-box-panels.js'), array( 'jquery-ui-sortable', 'wp-util' ), FALSE, TRUE );
		wp_enqueue_style( 'modular-content-meta-box', Plugin::plugin_url('assets/styles/css/main.css'), array( 'font-awesome', 'jquery-ui' ) );
		add_action( 'admin_head', array( $this, 'print_admin_theme_css' ), 10, 0 );
	}

	/**
	 * @see http://wordpress.stackexchange.com/questions/130943/wordpress-3-8-get-current-admin-color-scheme
	 * @return void
	 */
	public function print_admin_theme_css() {

		global $_wp_admin_css_colors;
		global $admin_colors;
		$admin_colors = $_wp_admin_css_colors;

		$user_color_scheme_name = get_user_meta( get_current_user_id(), 'admin_color', true );
		$user_color_scheme = isset( $admin_colors[$user_color_scheme_name] ) ? $admin_colors[$user_color_scheme_name] : false;

		if ( $user_color_scheme ) {

			// This little guy gets the index of the most suitable primary color
			// depending on the actual color scheme
			switch ( $user_color_scheme_name ) {
				case 'coffee':
				case 'ectoplasm':
				case 'ocean':
				case 'sunrise':
					$primary_color_index = 2;
					break;
				default:
					$primary_color_index = 3;
					break;
			}
			?>
			<style id='panel-builder-colors'>
				.panel-builder-text-color {
					color: <?php echo $user_color_scheme->colors[$primary_color_index]; ?>;
				}
				.panel-builder-bg-color {
					background-color:  <?php echo $user_color_scheme->colors[$primary_color_index]; ?>;
				}
				.panel-builder-border-color {
					border-color: <?php echo $user_color_scheme->colors[$primary_color_index]; ?>;
				}
			</style>
		<?php
		}
	}

	/**
	 * Put our nonce in the Publish box, so we can share it
	 * across all meta boxes
	 *
	 * @return void
	 */
	public static function display_nonce() {
		if ( post_type_supports(get_post_type(), 'modular-content') ) {
			wp_nonce_field(self::NONCE_ACTION, self::NONCE_NAME);
		}
	}

	/**
	 * Save the meta boxes for this post type
	 *
	 * @param int $post_id The ID of the post being saved
	 * @param array $post The post being saved
	 * @return array
	 */
	public function maybe_filter_post_data( $post_data, $post ) {
		if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ) {
			return $this->filter_autosave_data( $post_data, $post, $_POST );
		}

		if ( !$this->should_post_be_filtered($post_data, $post, $_POST) ) {
			return $post_data;
		}

		$post_data = $this->filter_post_data( $post_data, $post, $_POST );
		return $post_data;
	}

	public function render( $post ) {
		$collection = PanelCollection::find_by_post_id( $post->ID );
		$localization = array(
			'delete_this_panel' => __( 'Delete this panel?', 'modular-content' ),
			'save_gallery' => __( 'Save Gallery', 'modular-content' ),
			'untitled' => __( 'Untitled', 'modular-content' ),
		);
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
		$post_data['post_content_filtered'] = wp_slash($this->submission_to_json($submission));
		return $post_data;
	}

	protected function submission_to_json( $submission ) {
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
				$data = wp_unslash($data);
				$panels[] = array('type' => $type, 'data' => $data, 'depth' => $depth);
			}
		}
		$collection = PanelCollection::create_from_array( array('panels' => $panels) );
		return json_encode($collection);
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

	public function filter_autosave_data( $post_data, $post, $submission ) {
		if ( empty($post_data['post_content_filtered']) ) {
			$post_data['post_content_filtered'] = $post['post_content_filtered'];
			return $post_data;
		}
		$deserialized = $this->deserialize_to_json($post_data['post_content_filtered']);
		$post_data['post_content_filtered'] = wp_slash($this->submission_to_json($deserialized));
		return $post_data;
	}

	public function deserialize_to_json( $data ) {
		$array = array();
		parse_str( $data, $array );
		return $array;
	}

	public function build_video_preview( $url = '' ) {
		if ( empty($url) && isset($_POST['url']) ) {
			$url = $_POST['url'];
		}
		if ( empty($url) ) {
			wp_send_json_error(array('message' => 'invalid_url')); // exits
		}

		$oembed = new OEmbedder( $url, array('width' => 100, 'height' => 100) );
		$title = $oembed->get_title();
		$image = $oembed->get_thumbnail();

		$preview = '';
		if ( $title ) {
			$preview .= sprintf( '<h5 class="oembed-title">%s</h5>', $title );
		}
		if ( $image ) {
			$preview .= sprintf('<img src="%s" class="oembed-thumbnail" />', $image);
		}
		if ( $preview ) {
			wp_send_json_success(array('url' => $url, 'preview' => $preview));
		}
		wp_send_json_error(array('message' => 'not_found'));
	}

	public function get_post_field_search_results() {
		$response = array(
			'posts' => array(),
			'more' => false,
		);

		$request = wp_parse_args( $_REQUEST, array(
			's' => '',
			'type' => '',
			'paged' => 1,
			'post_type' => 'any',
		));

		if ( !empty($request['s']) || !empty($request['post_type']) ) {
			$args = array(
				'post_type' => apply_filters( 'panel_input_query_post_types', $request['post_type'], $request['type'] ),
				'post_status' => 'publish',
				's' => $request['s'],
				'posts_per_page' => 50,
				'suppress_filters' => true
			);
			if ( !empty($request['paged']) ) {
				$offset = $request['paged'] - 1;
				$offset = $offset * 50;
				if ( $offset > 0 ) {
					$args['offset'] = $offset;
				}
			}

			$args  = apply_filters( 'panel_input_manual_query', $args, $request['type'] );
			$query = new \WP_Query();
			$posts = $query->query( $args );

			foreach ( $posts as $post ) {
				$title = apply_filters( 'panel_manual_query_post_title', get_the_title( $post ), $post );
				$response['posts'][] = array(
					'id' => $post->ID,
					'text' => esc_html( $title ),
				);
			}

			if ( $query->max_num_pages > $request['paged'] ) {
				$response['more'] = TRUE;
			}
		}

		wp_send_json($response); // exits
	}

	public function ajax_fetch_titles() {
		$post_ids = $_POST['post_ids'];
		$response = array('post_ids' => array());
		foreach ( $post_ids as $id ) {
			$response['post_ids'][$id] = get_the_title($id);
		}
		wp_send_json_success($response);
	}

	public function ajax_fetch_preview() {
		$response = array('posts' => array(), 'post_ids' => array());
		if ( !empty($_POST['post_ids']) ) {
			$post_ids = $_POST['post_ids'];
		} elseif ( !empty($_POST['filters']) ) {
			$max = !empty($_POST['max']) ? $_POST['max'] : 12;
			$context = empty($_POST['context']) ? 0 : $_POST['context'];
			$post_ids = Fields\Posts::get_posts_for_filters($_POST['filters'], $max, $context);
		}
		if ( !empty($post_ids) ) {
			$response['post_ids'] = $post_ids;
			$response['posts'] = Fields\Posts::get_post_data($post_ids);
		}
		wp_send_json_success($response);
	}
}