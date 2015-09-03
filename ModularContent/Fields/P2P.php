<?php


namespace ModularContent\Fields;
use ModularContent\Panel;


/**
 * Class P2P
 *
 * @package ModularContent\Fields
 *
 * An invisible helper field. It renders nothing in the admin,
 * but gives a list of P2P-related post IDs to get_panel_var()
 */
class P2P extends Field {
	protected $limit = -1;  // the maximum number of posts to return. -1 for unlimited
	protected $connection_type = ''; // the P2P connection type

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new P2P( array(
	 *   'name' => 'related_posts',
	 *   'connection_type' => 'the_connection_type_id',
	 *   'limit' => 6,
	 * ) );
	 */
	public function __construct( $args = array() ){
		if ( !class_exists('P2P_WP_Query') ) {
			trigger_error(__('The Posts 2 Posts plugin is required for proper operation of the P2P panel input', 'modular-content'), E_USER_WARNING);
		}
		$this->defaults['limit'] = $this->limit;
		$this->defaults['connection_type'] = $this->connection_type;
		parent::__construct($args);
	}

	public function render() {
		// do not render anything
	}

	public function get_vars( $data, $panel ) {
		if (
			!function_exists('p2p_type') // we need P2P to filter the query appropriately
			|| !is_singular() // we need an is_singular() context to find related posts
		) {
			return array(
				$this->name = array(),
			);
		}
		$context_id = get_queried_object_id();
		/** @var $type \P2P_Connection_Type */
		$type = p2p_type($this->connection_type);
		$connected = array();
		if ( $context_id && $type ) {
			/** @var $query \WP_Query */
			$query = @$type->get_connected($context_id, array('fields' => 'ids', 'posts_per_page' => $this->limit));
			if ( $query ) {
				$connected = $query->get_posts();
			}
		}

		$connected = apply_filters( 'panels_field_vars', $connected, $this, $panel );

		return $connected;
	}

	public function get_vars_for_api( $data, $panel ) {
		$ids = $this->get_vars( $data, $panel );

		$new_data = array_map( array( $this, 'post_id_to_array' ), $ids );

		$new_data = apply_filters( 'panels_field_vars_for_api', $new_data, $data, $this, $panel );

		return $new_data;
	}

	// ToDo: Can the P2P field be a child of Post_List too?
	protected function post_id_to_array( $post_id ) {
		if ( empty( $post_id ) ) {
			return false;
		}
		$_post = get_post( $post_id );
		if ( empty( $_post ) ) {
			return false;
		}

		$data = array(
			'title'     => '',
			'content'   => '',
			'excerpt'   => '',
			'image'     => 0,
			'link'      => array(
				'url'    => '',
				'target' => '',
				'label'  => '',
			),
			'post_type' => '',
			'post_id'   => 0,
		);

		global $post;
		$post = $_post;
		setup_postdata( $post );
		$data['title']     = get_the_title();
		$data['content']   = get_the_content();
		$data['excerpt']   = get_the_excerpt();
		$data['image']     = get_post_thumbnail_id();
		$data['link']      = array(
			'url'    => get_permalink(),
			'target' => '',
			'label'  => $data['title'],
		);
		$data['post_type'] = $post->post_type;
		$data['post_id']   = $post->ID;
		wp_reset_postdata();

		return $data;
	}
} 