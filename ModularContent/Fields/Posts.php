<?php

namespace ModularContent\Fields;
use ModularContent\Panel;

class Posts extends Field {
	const CACHE_TIMEOUT = 300; // how long to store queries in cache

	protected $max = 12;
	protected $min = 0;
	protected $suggested = 0;
	protected $default = '{ type: "manual", post_ids: [], filters: {} }';

	public function __construct( $args = array() ) {
		$this->defaults['max'] = $this->max;
		$this->defaults['min'] = $this->min;
		$this->defaults['suggested'] = $this->suggested;
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
		// Posts fields don't get to have labels
	}

	protected function render_description() {
		// Description is rendered inside the field
	}

	public function render_field() {
		$taxonomies = $this->taxonomy_options();
		$input_name = $this->get_input_name();
		$input_value = sprintf("data.fields.%s", $this->name);
		$max = (int)$this->max;
		$min = (int)$this->min;
		$suggested = (int)$this->suggested;
		$description = $this->description;
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
			$post_ids = isset($data['filters'])?$this->filter_posts($data['filters']):array();
		}
		return $post_ids;
	}



	/**
	 * Query for posts matching the selected filters
	 *
	 * @param array $filters
	 * @param string $fields
	 *
	 * @return array Matching post IDs
	 */
	protected function filter_posts( $filters, $fields = 'ids' ) {
		$context = get_queried_object_id();
		$ids = self::get_posts_for_filters( $filters, $this->max, $context );
		if ( $fields == 'ids' || empty($ids) ) {
			return $ids;
		}
		$query = array(
			'post_type' => 'any',
			'post_status' => 'any',
			'posts_per_page' => $this->max,
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

	public function post_type_options() {
		$post_types = get_post_types(array('has_archive' => TRUE, 'public' => TRUE), 'objects', 'and');
		$post_types['post'] = get_post_type_object('post'); // posts are special
		unset($post_types['landing_page']); // because, really, why would you?
		return apply_filters('panels_query_post_type_options', $post_types, $this->name );
	}

	public static function print_supporting_templates() {
		?>
		<script type="text/template" class="template" id="tmpl-field-posts-filter">
			<div class="panel-filter-row filter-{{data.type}}">
				<a href="#" class="remove-filter icon-remove" title="<?php _e('Delete this filter', 'modular-content'); ?>"></a>
				<label>{{data.label}}</label>
				<span class="filter-options"></span>
				<!--<label class="filter-lock" title="<?php _e('Unlock to override with current context', 'modular-content'); ?>"><span class="wrapper">--><input type="hidden" name="{{data.name}}[filters][{{data.type}}][lock]" value="1" /><!-- <?php _e('Lock Selection', 'modular-content'); ?></span></label>-->
			</div>
		</script>
		<?php

		foreach ( self::taxonomy_options() as $taxonomy_name ):
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

		<?php endforeach;
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
		global $post;
		$original_post = $post;
		foreach ( $post_ids as $id ) {
			$post = get_post($id);
			setup_postdata($post);
			$excerpt = $post->post_excerpt;
			if ( empty($excerpt) ) {
				$excerpt = $post->post_content;
			}
			$excerpt = wp_trim_words( $excerpt, 40, '&hellip;' );
			$posts[$id] = array(
				'post_title' => get_the_title($post),
				'post_excerpt' => apply_filters( 'get_the_excerpt', $excerpt ),
				'thumbnail_html' => get_the_post_thumbnail($post->ID, array(150, 150)),
			);
		}
		$post = $original_post;
		if ( $original_post ) {
			wp_reset_postdata();
		}
		return $posts;
	}

	public static function get_posts_for_filters( $filters, $max = 10, $context = 0 ) {
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
			if ( $type == 'post_type' ) {
				if ( !empty($filter['lock']) || !is_post_type_archive() ) {
					$query['post_type'] = $filter['selection'];
				} else {
					$post_type_object = get_queried_object();
					$query['post_type'] = $post_type_object->name;
				}
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

		$cache = self::get_cache($query);
		if ( FALSE && !empty($cache) ) {
			return $cache;
		}

		$result = get_posts($query);
		self::set_cache($query, $result);

		return $result;
	}
}