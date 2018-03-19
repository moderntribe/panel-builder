<?php


namespace ModularContent;
use ModularContent\Fields\Image;
use ModularContent\Fields\Post_List;
use ModularContent\Fields\PostQuacker;
use ModularContent\Fields\Repeater;
use ModularContent\Fields\TextArea;

/**
 * Class MetaBox
 *
 * @package ModularContent
 *
 * The admin metabox where all the magic happens
 */
class MetaBox {
	const NONCE_ACTION = 'ModularContent_meta_box';
	const NONCE_NAME = 'ModularContent_meta_box_nonce';
	const PANELS_LOADED_FLAG = 'ModularContent_meta_box_loaded';
	const ICONS_ACTION = 'panels-fetch-icon-options';
	const ICONS_OPTIONS_FILTER = 'panels_icons_options';

	public function add_hooks() {
		add_action( 'post_submitbox_misc_actions', array( $this, 'display_nonce' ) );
		add_action( 'wp_insert_post_data', array( $this, 'maybe_filter_post_data' ), 10, 2 );
		add_filter( '_wp_post_revision_fields', array( $this, 'filter_post_revision_fields' ) );
		add_action( 'wp_ajax_posts-field-posts-search', array( $this, 'get_post_field_search_results' ), 10, 0 );
		add_action( 'wp_ajax_posts-field-fetch-preview', array( $this, 'ajax_fetch_preview' ), 10, 0 );
		add_action( 'wp_ajax_' . self::ICONS_ACTION, array( $this, 'ajax_fetch_icon_options' ), 10, 0 );
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

	/**
	 * A string of global js to apply just before the main scripts are loaded. Only use for settings flags
	 * required on window, this isnt a place to write anything beyond a few lines.
	 *
	 * @return string
	 */

	protected function inline_scripts() {
		$inline_scripts = 'window.noZensmooth = true';

		return $inline_scripts;
	}

	protected function enqueue_scripts() {
		$app_scripts = Plugin::plugin_url( 'ui/dist/master.js' );

		if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
			$app_scripts = apply_filters( 'modular_content_js_dev_path', $app_scripts );
			wp_register_script( 'panels-admin-ui', $app_scripts, [ 'wp-util', 'media-upload', 'media-views' ], time(), true );
		} else {
			wp_register_script( 'panels-admin-ui', $app_scripts, [ 'wp-util', 'media-upload', 'media-views' ], time(), true );
		}
		wp_enqueue_style( 'panels-admin-ui', Plugin::plugin_url('ui/dist/master.css'), [] );

		/*
		 * Rather than enqueuing this immediately, delay until after
		 * admin_print_footer_scripts:50. This is when the WP visual
		 * editor prints the tinymce config.
		 */
		add_action( 'admin_print_footer_scripts', function() {
			wp_enqueue_script( 'panels-admin-ui' );
			wp_add_inline_script( 'panels-admin-ui', $this->inline_scripts(), 'before' );
			wp_localize_script( 'panels-admin-ui', 'ModularContentConfig', $this->js_config() );
			wp_localize_script( 'panels-admin-ui', 'ModularContentI18n', $this->js_i18n() );
			// since footer scripts have already printed, process the queue again on the next available action
			add_action( "admin_footer-" . $GLOBALS['hook_suffix'], '_wp_footer_scripts' );
		}, 60, 0 );

		wp_enqueue_style( 'modular-content-meta-box', Plugin::plugin_url('ui/dist/react-libs.css'), ['font-awesome'] );
		add_action( 'admin_head', array( $this, 'print_admin_theme_css' ), 10, 0 );
	}

	/**
	 * Provides config data to be used by front-end JS
	 *
	 * @return array
	 */

	public function js_config() {

		static $data = [ ];
		if ( empty( $data ) ) {
			$data = [
				'iframe_scroll_offset' => 10,
				'css_file'             => Plugin::plugin_url( 'ui/dist/master.css' ),
				'url_config'           => [
					'tool_arg'    => Plugin::TOOL_ARG,
					'tool_arg_id' => Plugin::CONTENT_TOOL_ID,
				],
				'google_fonts'         => apply_filters( 'panels_google_fonts', [] ),
				'style_families'       => apply_filters( 'panels_style_families', [] ),
				'icons_ajax_action'    => self::ICONS_ACTION,
			];
			$data = apply_filters( 'panels_js_config', $data );
		}

		return $data;

	}

	/**
	 * js_i18n stores all text strings needed in the js driven ui
	 *
	 * @return array
	 */

	public function js_i18n() {

		$js_i18n_array = [
			'ui' => [
				// Live edit bar
				'heading.resizer'              => __( 'Resize', 'modular-content' ),

				// collection
				'heading.no_title'             => __( 'No Title', 'modular-content' ),
				'heading.editing_panels'       => __( 'Editing Panels', 'modular-content' ),
				'button.launch_edit'           => __( 'Live Preview', 'modular-content' ),
				'button.add_new'               => __( 'Add a new panel', 'modular-content' ),
				'button.cancel_add_new'        => __( 'Go back to panel editor', 'modular-content' ),
				'button.child_add_new'         => __( 'Add a new ', 'modular-content' ),
				'button.child_cancel_add_new'  => __( 'Cancel', 'modular-content' ),
				'tab.content'                  => _x( 'Content', 'tab name', 'modular-content' ),
				'tab.settings'                 => _x( 'Settings', 'tab name', 'modular-content' ),
				'button.delete'                => __( 'Delete', 'modular-content' ),

				// collection header
				'heading.active_panels'        => __( 'Active Panels', 'modular-content' ),
				'heading.choose_panel'         => __( 'Choose a Panel', 'modular-content' ),

				// panel sets
				'button.select_set'       => __( 'Select Panel Set', 'modular-content' ),
				'button.save_as_template' => __( 'Save as Panel Set', 'modular-content' ),
				'button.edit_template'    => __( 'Edit Panel Set', 'modular-content' ),
				'heading.unsaved_data' => __( 'Unsaved Changes', 'modular-content' ),
				'message.unsaved_data'    => __( 'You have unsaved work, but can still save it with the draft or publish button. Relaunching the preview will keep these unsaved changes intact.', 'modular-content' ),
				'message.unsaved_toggle'  => __( "Don't show me this reminder again on this computer", 'modular-content' ),
				'message.template_saved'  => __( 'Panel Set saved successfully', 'modular-content' ),
				'message.template_error'  => __( 'There was an error saving the Panel Set', 'modular-content' ),
				'heading.start_new_page'  => __( 'Start a New Page', 'modular-content' ),
				'heading.start_from_set'  => __( 'Or Start from a Page Set', 'modular-content' ),
				'heading.start_from_scr'  => __( 'Create Page From Scratch', 'modular-content' ),
				'dialog.panel_set_title'  => __( 'Panel Set Title', 'modular-content' ),

				// style family select
				'button.edit_style_family' => __( 'Edit this family', 'modular-content' ),
				'button.copy_style_family' => __( 'Copy this family', 'modular-content' ),

				// live edit
				'heading.edit_panel_type'      => __( 'Active Panels', 'modular-content' ),
				'heading.editing_panel_type'   => __( 'Choose a Panel', 'modular-content' ),
				'heading.edit_type'            => __( 'Edit', 'modular-content' ),
				'heading.editing_type'         => __( 'Editing', 'modular-content' ),
				'heading.refresh_delay'        => __( 'Refresh Delay (seconds)', 'modular-content' ),
				'message.panel_placeholder'    => __( 'Waiting for panel selection', 'modular-content' ),
				'message.confirm_delete_panel' => __( 'Delete this panel?', 'modular-content' ),
				'button.confirm'               => __( 'Confirm', 'modular-content' ),
				'button.cancel'                => __( 'Cancel', 'modular-content' ),
				'tooltip.panel_up'             => __( 'Move panel up', 'modular-content' ),
				'tooltip.panel_down'           => __( 'Move panel down', 'modular-content' ),
				'tooltip.delete_panel'         => __( 'Delete this panel', 'modular-content' ),
				'tooltip.add_above'            => __( 'Add panel above', 'modular-content' ),
				'tooltip.add_below'            => __( 'Add panel below', 'modular-content' ),
				'button.confirm_exit_preview'  => __( 'Stay in Live Preview', 'modular-content' ),
				'button.cancel_exit_preview'   => __( 'Continue and Close', 'modular-content' ),

				// fields
				'label.uncategorized' => __( 'Uncategorized', 'modular-content' ),
				'button.show_all'     => __( 'Show All', 'modular-content' ),
			]
		];

		return apply_filters( 'panels_js_i18n', $js_i18n_array );

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
			printf( '<input id="panels_meta_box_loaded" type="hidden" name="%s" value="0" />', self::PANELS_LOADED_FLAG );
		}
	}

	/**
	 * Save the meta boxes for this post type
	 *
	 * @param array $post_data The data to be saved
	 * @param \WP_Post $post The post being saved
	 * @return array $post_data with additional panel data
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
		$registry = Plugin::instance()->registry();
		$blueprint = new Blueprint_Builder( $registry );
		$collection = PanelCollection::find_by_post_id( $post->ID );
		$cache = new AdminPreCache();
		foreach ( $collection->panels() as $panel ) {
			$panel->update_admin_cache( $cache );
		}
		$localization = [
			'delete_this_panel' => __( 'Are you sure you want to delete this?', 'modular-content' ),
			'save_gallery'      => __( 'Save Gallery', 'modular-content' ),
			'untitled'          => __( 'Untitled', 'modular-content' ),
			'loading'           => __( 'Loading...', 'modular-content' ),
		];

		$meta_box_data = [
			'blueprint'    => $blueprint,
			'cache'        => $cache,
			'localization' => $localization,
			'panels'       => $collection->build_tree(),
			'preview_url'  => $this->get_preview_link( $post ),
		];

		$meta_box_data = apply_filters( 'modular_content_metabox_data', $meta_box_data, $post );
		$json_encoded_panels = Util::json_encode( $collection );

		include( Plugin::plugin_path( 'admin-views/meta-box-panels.php' ) );
	}

	/**
	 * Get the URL to preview tha panels.
	 *
	 * @see post_preview()
	 * @param \WP_Post $post
	 * @return string
	 */
	private function get_preview_link( $post ) {
		$query_args[ 'preview_id' ] = $post->ID;
		$query_args[ 'preview_nonce' ] = wp_create_nonce( 'post_preview_' . $post->ID );
		$query_args[ 'preview_panels' ] = 'true';
		$query_args[ 'revision_id' ] = $post->ID;

		if ( isset( $_POST[ 'post_format' ] ) ) {
			$query_args[ 'post_format' ] = empty( $_POST[ 'post_format' ] ) ? 'standard' : sanitize_key( $_POST[ 'post_format' ] );
		}

		return get_preview_post_link( $post, $query_args );
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
		if ( empty( $submission[ 'panels' ] ) ) {
			return $post_data;
		}
		// the json string will come in slashed.
		$panels = json_decode( wp_unslash( $submission[ 'panels' ] ), true );

		if ( ! is_array( $panels ) || ! isset( $panels[ 'panels' ] ) ) {
			return $post_data;
		}

		$panels['panels'] = $this->flatten_tree( $panels['panels'] );

		$registry = Plugin::instance()->registry();
		foreach ( $panels[ 'panels' ] as &$panel_data ) {
			$panel = new Panel( $registry->get( $panel_data[ 'type' ] ), $panel_data[ 'data' ], $panel_data[ 'depth' ] );
			$panel_data[ 'data' ] = $panel->prepare_data_for_save();
		}

		// the data must be slashed again, because WP is going to try to unslash it in a moment
		$slashed_json = wp_slash( Util::json_encode( $panels ) );
		$post_data['post_content_filtered'] = $slashed_json;
		return $post_data;
	}

	protected function flatten_tree( $panel_tree ) {
		$flattened = [];
		foreach ( $panel_tree as $panel ) {
			if ( empty( $panel[ 'panels' ] ) ) {
				$flattened[] = $panel;
			} else {
				$children = $this->flatten_tree( $panel[ 'panels' ] );
				unset( $panel[ 'panels' ] );
				$flattened[] = $panel;
				$flattened = array_merge( $flattened, $children );
			}
		}
		return $flattened;
	}

	/**
	 * Make sure this is a save_post where we actually want to update the meta
	 *
	 * @param array $post_data The updated data for the post that will go into the DB
	 * @param \WP_Post $post The post that is being saved
	 * @param array $submission
	 * @return bool
	 */
	protected function should_post_be_filtered( $post_data, $post, $submission ) {
		// make sure this is a valid submission
		if ( !isset($submission[self::NONCE_NAME]) || !wp_verify_nonce($submission[self::NONCE_NAME], self::NONCE_ACTION) ) {
			return FALSE;
		}

		// make sure the submission is for the correct post (or a revision)
		if ( ! isset( $submission['post_ID'] ) || ( $submission['post_ID'] != $post['ID'] && $post['post_parent'] != $submission['post_ID'] ) ) {
			return false;
		}

		// don't do anything on auto-draft, bulk edit, or quick edit
		if (  $post_data['post_status'] == 'auto-draft' || defined('DOING_AJAX') || isset($_GET['bulk_edit']) ) {
			return FALSE;
		}

		// looks like the answer is Yes
		return TRUE;
	}

	/**
	 * If an autosave came in without the panels, store the autosave
	 * with the last saved value. Otherwise, flatten the data.
	 *
	 * @param array $post_data
	 * @param \WP_Post $post
	 * @param array $submission
	 * @return array
	 */
	public function filter_autosave_data( $post_data, $post, $submission ) {
		if ( empty($post_data['post_content_filtered']) ) {
			$post_data['post_content_filtered'] = $post['post_content_filtered'];
		} else {
			$submission[ 'panels' ] = $post_data[ 'post_content_filtered' ];
			$post_data = $this->filter_post_data( $post_data, $post, $submission );
		}
		return $post_data;
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
				$response['posts'][] = array(
					'value' => $post->ID,
					'label' => html_entity_decode( get_the_title($post), ENT_QUOTES | ENT_HTML401 ),
				);
			}

			if ( $query->max_num_pages > $request['paged'] ) {
				$response['more'] = TRUE;
			}
		}

		wp_send_json($response); // exits
	}

	public function ajax_fetch_preview() {
		$response = array('posts' => array(), 'post_ids' => array());
		if ( !empty($_POST['post_ids']) ) {
			$post_ids = $_POST['post_ids'];
		} elseif ( !empty($_POST['filters']) ) {
			$max = !empty($_POST['max']) ? $_POST['max'] : 12;
			$context = empty($_POST['context']) ? 0 : $_POST['context'];
			$post_ids = Fields\Post_List::get_posts_for_filters($_POST['filters'], $max, $context);
		}
		if ( !empty($post_ids) ) {
			$response['post_ids'] = $post_ids;
			$response['posts'] = Fields\Post_List::get_post_data($post_ids);
		}
		wp_send_json_success($response);
	}

	public function ajax_fetch_icon_options() {
		$data = apply_filters( self::ICONS_OPTIONS_FILTER, [] );
		$key  = filter_input( INPUT_POST, 'key', FILTER_SANITIZE_STRING );

		if ( ! isset( $data[ $key ] ) ) {
			wp_send_json_success( [] );
		}

		wp_send_json_success( $data[ $key ] );
	}
}
