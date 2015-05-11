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
		return $connected;
	}
} 