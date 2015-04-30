<?php

namespace ModularContent\Fields;
use ModularContent\Panel, ModularContent\AdminPreCache;

/**
 * Class Posts
 *
 * @package ModularContent\Fields
 *
 * A complex field for selecting or querying posts
 *
 * Returns an array of post IDs for use in the template.
 *
 * $post_ids = get_panel_var( 'some-posts' );
 * $posts = array_map( 'get_post', $post_ids );
 * foreach ( $posts as $wp_post ) {
 *   // do something with a WP_Post object
 * }
 */
class Posts extends Field {
	const CACHE_TIMEOUT = 300; // how long to store queries in cache

	protected $max = 12;
	protected $min = 0;
	protected $suggested = 0;
	protected $default = '{ type: "manual", post_ids: [], filters: {}, max: 0 }';
	protected $show_max_control = false;

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new Posts( array(
	 *   'label' => __( 'Select some posts' ),
	 *   'name' => 'some-posts',
	 *   'max' => 12, // the maximum number of posts the user can pick, or the max returned by a query
	 *   'min' => 3, // a warning message is displayed to the user until the required number of posts is selected
	 *   'suggested' => 6, // the number of empty slots that will be shown in the admin,
	 *   'show_max_control' => false, // if true, the user can pick the max number of posts (between min and max)
	 * ) );
	 */
	public function __construct( $args = array() ) {
		$this->defaults['max'] = $this->max;
		$this->defaults['min'] = $this->min;
		$this->defaults['suggested'] = $this->suggested;
		$this->defaults['show_max_control'] = $this->show_max_control;
		parent::__construct($args);
		if ( empty($this->max) ) {
			$this->max = max(12, $this->min);
		}
		if ( $this->min > $this->max ) {
			$this->min = $this->max;
		}
		if ( $this->suggested > $this->max ) {
			$this->suggested = $this->max;
		}

	}

	protected function render_label() {
		if ( !empty($this->label) ) {
			printf('<legend class="panel-input-label">%s</legend>', $this->label);
		}
	}

	protected function render_description() {
		// Description is rendered inside the field
	}

	public function render_field() {
		$p2p = $this->p2p_options();
		$taxonomies = $this->taxonomy_options();
		$input_name = $this->get_input_name();
		$input_value = sprintf("data.fields.%s", $this->name);
		$max = (int)$this->max;
		$min = (int)$this->min;
		$suggested = (int)$this->suggested;
		$description = $this->description;
		$show_max_control = $this->show_max_control;
		include(\ModularContent\Plugin::plugin_path('admin-views/field-posts.php'));
		add_action( 'after_panel_admin_template_inside', array( __CLASS__, 'print_supporting_templates' ), 10, 0 );
		wp_enqueue_script( 'modular-content-posts-field', \ModularContent\Plugin::plugin_url('assets/scripts/js/fields/posts-field.js'), array('jquery', 'jquery-ui-tabs', 'select2'), FALSE, TRUE );
		wp_enqueue_style( 'jquery-ui' );
		wp_enqueue_style( 'select2' );

	}

	protected function get_default_value_js() {
		return $this->default;
	}

	public function get_vars( $data, $panel ) {
		if ( $data['type'] == 'manual' ) {
			$post_ids = isset($data['post_ids'])?$data['post_ids']:array();
		} else {
			if ( !empty( $data['max'] ) && $data['max'] > $this->min && $data['max'] < $this->max ) {
				$max = (int) $data['max'];
			} else {
				$max = (int) $this->max;
			}
			$post_ids = isset( $data['filters'] ) ? $this->filter_posts( $data['filters'], 'ids', $max ) : array();
		}
		return $post_ids;
	}



	/**
	 * Add data relevant to this field to the precache
	 *
	 * @param mixed $data
	 * @param AdminPreCache $cache
	 *
	 * @return void
	 */
	public function precache( $data, AdminPreCache $cache ) {
		if ( !empty( $data['type'] ) && $data['type'] == 'manual' && !empty( $data['post_ids'] ) ) {
			foreach ( $data['post_ids'] as $post_id ) {
				$cache->add_post( $post_id );
			}
		}
		if ( !empty( $data['filters'] ) ) {
			foreach ( $data['filters'] as $filter_id => $filter_args ) {
				if ( isset( $filter_args['selection'] ) && !is_array( $filter_args['selection'] ) ) {
					$filter_args['selection'] = explode( ',', $filter_args['selection'] );
				}
				if ( !empty( $filter_args['selection'] ) ) {
					if ( $filter_id == 'post_type' ) {
						continue;
					}
					if ( in_array( $filter_id, self::taxonomy_options() ) ) {
						foreach ( $filter_args['selection'] as $term_id ) {
							$cache->add_term( $term_id, $filter_id );
						}
					} elseif ( in_array( $filter_id, array_keys( self::p2p_options() ) ) ) {
						foreach ( $filter_args['selection'] as $post_id ) {
							$cache->add_post( $post_id );
						}
					}
				}
			}
		}
	}

	/**
	 * Query for posts matching the selected filters
	 *
	 * @param array $filters
	 * @param string $fields
	 * @param int $max
	 *
	 * @return array Matching post IDs
	 */
	protected function filter_posts( $filters, $fields = 'ids', $max = 0 ) {
		$context = get_queried_object_id();
		$max = $max ? $max : $this->max;
		$ids = self::get_posts_for_filters( $filters, $max, $context );
		if ( $fields == 'ids' || empty($ids) ) {
			return $ids;
		}
		$query = array(
			'post_type' => 'any',
			'post_status' => 'any',
			'posts_per_page' => $max,
			'post__in' => $ids,
			'fields' => $fields,
			'suppress_filters' => FALSE,
		);

		return get_posts($query);
	}

	protected static function get_cache( $query ) {
		$cache = get_transient(self::cache_key($query));
		if ( !is_array($cache) ) {
			return array();
		}
		return $cache;
	}

	protected static function set_cache( $query, $value ) {
		set_transient(self::cache_key($query), $value, self::CACHE_TIMEOUT);
	}

	protected static function cache_key( $query ) {
		$prefix = 'panel_query_';
		$key = $prefix.maybe_serialize($query);
		$hash = md5($key);
		return $hash;
	}

	public static function taxonomy_options() {
		return apply_filters('modular_content_posts_field_taxonomy_options', array('post_tag'));
	}

	public static function p2p_options() {
		$options = array();
		if ( class_exists( 'P2P_Connection_Type_Factory' ) ) {
			$options = \P2P_Connection_Type_Factory::get_all_instances();
		}
		return apply_filters('modular_content_posts_field_p2p_options', $options);
	}

	public function post_type_options() {
		$post_types = get_post_types(array('has_archive' => TRUE, 'public' => TRUE), 'objects', 'and');
		$post_types['post'] = get_post_type_object('post'); // posts are special
		unset($post_types['landing_page']); // because, really, why would you?
		$post_types = apply_filters('panels_query_post_type_options', $post_types, $this );
		return array_filter( $post_types );
	}

	protected static function get_filter_groups() {
		$filter_groups = array();
		foreach ( self::taxonomy_options() as $taxonomy_name ) {
			$filter_groups[$taxonomy_name] = 'taxonomy';
		}
		foreach ( array_keys( self::p2p_options() ) as $p2p_id ) {
			$filter_groups[$p2p_id] = 'p2p';
		}
		return $filter_groups;
	}

	public static function print_supporting_templates() {
		?>
		<script type="text/javascript">
			<?php // var declared in meta-box-panels.php ?>
			<?php $filter_groups = self::get_filter_groups(); ?>
			ModularContent.posts_filter_templates = <?php echo \ModularContent\Util::json_encode($filter_groups); ?>;
		</script>
		<script type="text/template" class="template" id="tmpl-field-posts-filter">
			<div class="panel-filter-row filter-{{data.type}}">
				<a href="#" class="remove-filter icon-remove" title="<?php _e('Delete this filter', 'modular-content'); ?>"></a>
				<label>{{data.label}}</label>
				<span class="filter-options"></span>
				<!--<label class="filter-lock" title="<?php _e('Unlock to override with current context', 'modular-content'); ?>"><span class="wrapper">--><input type="hidden" name="{{data.name}}[filters][{{data.type}}][lock]" value="1" /><!-- <?php _e('Lock Selection', 'modular-content'); ?></span></label>-->
			</div>
		</script>

		<script type="text/template" class="template" id="tmpl-field-posts-p2p-options">
			<input name="{{data.name}}[filters][{{data.type}}][selection]" class="term-select" data-placeholder="<?php _e('Select Posts', 'modular-content'); ?>" data-filter_type="{{data.type}}" />
		</script>

		<script type="text/template" class="template" id="tmpl-field-posts-meta-options">
			<input name="{{data.name}}[filters][{{data.type}}][selection]" class="term-select" data-placeholder="<?php _e('Insert Values', 'modular-content'); ?>" data-filter_type="{{data.type}}" />
		</script>

		<?php

		foreach ( self::taxonomy_options() as $taxonomy_name ){
			$terms = get_terms($taxonomy_name, array('hide_empty' => FALSE));
			$options = array();
			foreach ( $terms as $term ) {
				$term_name = self::build_hierarchical_term_name($term);
				$options[$term_name] = sprintf('<option value="%d">%s</option>', $term->term_id, esc_html($term_name));
			}
			ksort($options);
			?>
			<script type="text/template" class="template" id="tmpl-field-posts-taxonomy-<?php echo $taxonomy_name; ?>-options">
				<select name="{{data.name}}[filters][{{data.type}}][selection][]" class="term-select" multiple="multiple" data-placeholder="<?php _e('Select Terms', 'modular-content'); ?>" data-filter_type="{{data.type}}">
					<?php echo implode("\n", $options); ?>
				</select>
			</script>

		<?php }
		add_action( 'after_panel_admin_template', array( __CLASS__, 'dequeue_supporting_templates' ), 10 );

	}


	public static function dequeue_supporting_templates() {
		remove_action( 'after_panel_admin_template_inside', array( __CLASS__, 'print_supporting_templates' ), 10, 0 );
	}

	protected static function build_hierarchical_term_name( $term, $sep = ' > ' ) {
		$name = $term->name;
		while ( !empty($term->parent) ) {
			$term = get_term($term->parent, $term->taxonomy);
			$name = $term->name.$sep.$name;
		}
		return $name;
	}

	public static function get_post_data( $post_ids ) {
		$posts = array();
		foreach ( $post_ids as $id ) {
			$posts[$id] = AdminPreCache::get_post_array( $id );
		}
		return $posts;
	}

	public static function get_posts_for_filters( $filters, $max = 10, $context = 0 ) {
		$query = self::get_query_for_filters( $filters, $max, $context );
		$cache = self::get_cache($query);
		if ( FALSE && !empty($cache) ) {
			return $cache;
		}

		$result = get_posts($query);
		self::set_cache($query, $result);

		return $result;
	}

	public static function get_query_for_filters( $filters, $max = 10, $context = 0 ) {
		$query = array(
			'post_type' => 'any',
			'post_status' => 'publish',
			'posts_per_page' => $max,
			'tax_query' => array(
				'relation' => 'AND',
			),
			'fields' => 'ids',
			'suppress_filters' => FALSE,
		);
		foreach ( $filters as $type => $filter ) {
			if ( empty($filter['selection']) ) {
				continue;
			}
			if ( !is_array( $filter['selection'] ) ) {
				$filter['selection'] = explode( ',', $filter['selection'] );
			}
			$filter_groups = self::get_filter_groups();
			if ( $type == 'post_type' ) {
				if ( !empty($filter['lock']) || !is_post_type_archive() ) {
					$query['post_type'] = $filter['selection'];
				} else {
					$post_type_object = get_queried_object();
					$query['post_type'] = $post_type_object->name;
				}
			} elseif ( isset( $filter_groups[$type] ) && $filter_groups[$type] == 'p2p' ) {
				$ids = self::get_p2p_filtered_ids( $type, $filter['selection'] );
				if ( empty( $ids ) ) {
					$query['post__in'] = array( -1 );
					break; // stop filtering. nothing should match
				}
				if ( !isset($query['post__in']) ) {
					$query['post__in'] = array();
				}
				$query['post__in'] = array_merge( $query['post__in'], $ids );
			} else {
				$locked = FALSE;
				if ( !empty($filter['lock']) ) {
					$locked = TRUE;
				} elseif ( $type == 'post_tag' ) {
					if ( !is_tag() ) { $locked = TRUE; }
				} elseif ( $type == 'category' ) {
					if ( !is_category() ) { $locked = TRUE; }
				} elseif ( !is_tax($type) ) {
					$locked = TRUE;
				}
				if ( !$locked ) {
					$term = get_queried_object();
				}
				if ( $locked || !$term ) {
					$query['tax_query'][] = array(
						'taxonomy' => $type,
						'field' => 'id',
						'terms' => array_map('intval', $filter['selection']),
						'operator' => 'IN',
					);
				} else {
					$query['tax_query'][] = array(
						'taxonomy' => $type,
						'field' => 'id',
						'terms' => (int)$term->term_id,
						'operator' => 'IN',
					);
				}
			}
		}

		$query = apply_filters( 'panels_input_query_filter', $query, $filters, $context );

		return $query;
	}

	protected function get_p2p_filtered_ids( $connection_id, $post_ids ) {
		$connected = get_posts( array(
			'suppress_filters' => FALSE,
			'connected_type' => $connection_id,
			'connected_items' => $post_ids,
			'nopaging' => TRUE,
			'fields' => 'ids',
			'post_type' => 'any',
		));
		return $connected;
	}
}
