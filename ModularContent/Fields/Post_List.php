<?php

namespace ModularContent\Fields;

use ModularContent\Panel, ModularContent\AdminPreCache;
use ModularContent\Util;

/**
 * Class Post_List
 *
 * @package ModularContent\Fields
 *
 * A complex field for selecting or querying posts
 *
 * Returns an array of post objects for use in the template.
 *
 * $posts = get_panel_var( 'some-posts' );
 * foreach ( $posts as $post ) {
 *   // do something with a $post array
 * }
 *
 * Each post array will have these fields:
 *   title
 *   content
 *   excerpt
 *   image
 *   link => [ url, target, label ]
 *   post_type
 *   post_id
 */
class Post_List extends Field {
	const CACHE_TIMEOUT = 300; // how long to store queries in cache

	protected $max              = 12;
	protected $min              = 0;
	protected $suggested        = 1;
	protected $default          = [ 'type' => 'manual', 'posts' => [ ], 'filters' => [ ], 'max' => 0 ];
	protected $show_max_control = false;
	protected $strings          = [ ];
	protected $hidden_fields    = [ ];
	protected $post_types       = [ ];

	/**
	 * @param array $args
	 *
	 * Usage example:
	 *
	 * $field = new Post_List( array(
	 *   'label' => __( 'Select some posts' ),
	 *   'name' => 'some-posts',
	 *   'max' => 12, // the maximum number of posts the user can pick, or the max returned by a query
	 *   'min' => 3, // a warning message is displayed to the user until the required number of posts is selected
	 *   'suggested' => 6, // the number of empty slots that will be shown in the admin,
	 *   'show_max_control' => false, // if true, the user can pick the max number of posts (between min and max)
	 *   'hidden_fields' => array( 'post_title, 'post_content', 'url', 'thumbnail_id' ), // Hide the selected fields from
	 *   previews and from manual input
	 * ) );
	 */
	public function __construct( $args = [ ] ) {
		$this->defaults[ 'max' ] = $this->max;
		$this->defaults[ 'min' ] = $this->min;
		$this->defaults[ 'suggested' ] = $this->suggested;
		$this->defaults[ 'show_max_control' ] = $this->show_max_control;
		$this->defaults[ 'strings' ] = [
			'tabs.manual'                                => __( 'Manual', 'modular-content' ),
			'tabs.dynamic'                               => __( 'Dynamic', 'modular-content' ),
			'button.select_post'                         => __( 'Select a post', 'modular-content' ),
			'button.create_content'                      => __( 'Create content', 'modular-content' ),
			'button.remove_post'                         => __( 'Remove this post', 'modular-content' ),
			'button.remove'                              => __( 'Remove', 'modular-content' ), // passed to Image
			'button.select'                              => __( 'Select Files', 'modular-content' ), // passed to Image
			'button.add_to_panel'                        => __( 'Add to Panel', 'modular-content' ),
			'button.cancel_panel'                        => __( 'Cancel', 'modular-content' ),
			'placeholder.no_results'                     => __( 'No Results', 'modular-content' ),
			'placeholder.select_search'                  => __( 'Type to search', 'modular-content' ),
			'placeholder.select_post'                    => __( 'Select...', 'modular-content' ),
			'label.add_another'                          => __( 'Add Another', 'modular-content' ),
			'label.content_type'                         => __( 'Content Type', 'modular-content' ),
			'label.choose_post'                          => __( 'Choose a Post', 'modular-content' ),
			'label.max_results'                          => __( 'Max Results', 'modular-content' ),
			'label.select_post_type'                     => __( 'Select Post Type', 'modular-content' ),
			'label.select_post_types'                    => __( 'Select Post Types', 'modular-content' ),
			'label.add_a_filter'                         => __( 'Add a Filter', 'modular-content' ),
			'label.taxonomy'                             => __( 'Taxonomy', 'modular-content' ),
			'label.taxonomy-placeholder'                 => __( 'Select Term', 'modular-content' ),
			'label.select-placeholder'                   => __( 'Select', 'modular-content' ),
			'label.relationship'                         => __( 'Relationship', 'modular-content' ),
			'label.relationship-post-type-placeholder'   => __( 'Select a Post Type', 'modular-content' ),
			'label.relationship-post-select-placeholder' => __( 'Select a Related Post', 'modular-content' ),
			'label.relationship-no-results'              => __( 'No Results', 'modular-content' ),
			'label.date'                                 => __( 'Date', 'modular-content' ),
			'label.date-start-date-placeholder'          => __( 'Start Date', 'modular-content' ),
			'label.date-end-date-placeholder'            => __( 'End Date', 'modular-content' ),
			'label.title'                                => __( 'Title', 'modular-content' ),
			'label.content'                              => __( 'Content', 'modular-content' ),
			'label.link'                                 => __( 'Link: http://example.com/', 'modular-content' ),
			'label.thumbnail'                            => __( 'Thumbnail', 'modular-content' ),
			'notice.min_posts'                           => _x( 'This field requires %{count} more item |||| This field requires %{count} more items', 'Format should be polyglot.js compatible. See https://github.com/airbnb/polyglot.js#pluralization', 'modular-content' ),
		];
		$this->defaults[ 'hidden_fields' ] = [ ];
		$this->defaults[ 'post_types' ]    = [ ];
		parent::__construct( $args );
		if ( empty( $this->max ) ) {
			$this->max = max( 12, $this->min );
		}
		if ( $this->min > $this->max ) {
			$this->min = $this->max;
		}
		if ( $this->suggested > $this->max ) {
			$this->suggested = $this->max;
		}
		if ( $this->suggested < $this->min ) {
			$this->suggested = $this->min;
		}

	}

	public function get_vars( $data, $panel ) {
		$data = wp_parse_args( $data, $this->default );
		$posts = [ ];
		if ( $data[ 'type' ] === 'manual' ) {
			foreach ( $data[ 'posts' ] as $post_data ) {
				if ( $post_data[ 'method' ] === 'select' && !empty( $post_data[ 'id' ] ) ) {
					$post = $this->post_id_to_array( $post_data[ 'id' ] );
					if ( $post ) {
						$posts[] = $post;
					}
				} elseif ( $post_data[ 'method' ] === 'manual' ) {
					$post = $this->manual_post_to_array( $post_data );
					if ( $post ) {
						$posts[] = $post;
					}
				}
			}
		} else {
			if ( !empty( $data[ 'max' ] ) && $data[ 'max' ] >= $this->min && $data[ 'max' ] <= $this->max ) {
				$max = (int)$data[ 'max' ];
			} else {
				$max = (int)$this->max;
			}
			$post_ids = isset( $data[ 'filters' ] ) ? $this->filter_posts( $data[ 'filters' ], 'ids', $max ) : [ ];
			$posts = array_map( [ $this, 'post_id_to_array' ], $post_ids );
		}

		$posts = apply_filters( 'panels_field_vars', $posts, $this, $panel );

		return $posts;
	}

	public function get_vars_for_api( $data, $panel ) {

		$posts = $this->get_vars( $data, $panel );
		$posts = apply_filters( 'panels_field_vars_for_api', $posts, $data, $this, $panel );

		return $posts;
	}

	protected function post_id_to_array( $post_id ) {
		if ( empty( $post_id ) ) {
			return false;
		}
		$_post = get_post( $post_id );
		if ( empty( $_post ) ) {
			return false;
		}

		$data = [
			'title'     => '',
			'content'   => '',
			'excerpt'   => '',
			'image'     => 0,
			'link'      => [
				'url'    => '',
				'target' => '',
				'label'  => '',
			],
			'post_type' => '',
			'post_id'   => 0,
		];

		global $post;
		$post = $_post;
		setup_postdata( $post );
		$data[ 'title' ] = get_the_title();
		$data[ 'content' ] = get_the_content();
		$data[ 'excerpt' ] = get_the_excerpt();
		$data[ 'image' ] = get_post_thumbnail_id();
		$data[ 'link' ] = [
			'url'    => get_permalink(),
			'target' => '',
			'label'  => $data[ 'title' ],
		];
		$data[ 'post_type' ] = $post->post_type;
		$data[ 'post_id' ] = $post->ID;
		wp_reset_postdata();

		return apply_filters( 'panel_post_id_to_array', $data, $post_id, $_post );
	}

	protected function manual_post_to_array( $post_data ) {
		if ( empty( $post_data[ 'post_title' ] ) && empty( $post_data[ 'post_content' ] ) && empty( $post_data[ 'url' ] ) && empty( $post_data[ 'thumbnail_id' ] ) ) {
			return false; // no data
		}
		$data = [
			'title'     => $post_data[ 'post_title' ],
			'content'   => $post_data[ 'post_content' ],
			'excerpt'   => $post_data[ 'post_content' ],
			'image'     => (int)$post_data[ 'thumbnail_id' ],
			'link'      => [
				'url'    => $post_data[ 'url' ],
				'target' => '',
				'label'  => !empty( $post_data[ 'post_title' ] ) ? $post_data[ 'post_title' ] : $post_data[ 'url' ],
			],
			'post_type' => '',
			'post_id'   => 0,
		];
		return $data;

	}


	/**
	 * Add data relevant to this field to the precache
	 *
	 * @param mixed         $data
	 * @param AdminPreCache $cache
	 *
	 * @return void
	 */
	public function precache( $data, AdminPreCache $cache ) {
		if ( !empty( $data[ 'type' ] ) && $data[ 'type' ] == 'manual' && !empty( $data[ 'posts' ] ) ) {
			foreach ( $data[ 'posts' ] as $post_data ) {
				if ( !empty( $post_data[ 'id' ] ) ) {
					$cache->add_post( $post_data[ 'id' ] );
				}
				if ( !empty( $post_data[ 'image' ] ) ) {
					$cache->add_image( $post_data[ 'image' ], 'thumbnail' );
				}
			}
		}
		if ( !empty( $data[ 'filters' ] ) ) {
			foreach ( $data[ 'filters' ] as $filter_id => $filter_args ) {
				if ( isset( $filter_args[ 'selection' ] ) && !is_array( $filter_args[ 'selection' ] ) ) {
					$filter_args[ 'selection' ] = explode( ',', $filter_args[ 'selection' ] );
				}
				if ( !empty( $filter_args[ 'selection' ] ) ) {
					if ( $filter_id == 'post_type' ) {
						continue;
					}
					if ( in_array( $filter_id, self::taxonomy_options() ) ) {
						foreach ( $filter_args[ 'selection' ] as $term_id ) {
							$cache->add_term( $term_id, $filter_id );
						}
					} elseif ( in_array( $filter_id, array_keys( self::p2p_options() ) ) ) {
						foreach ( $filter_args[ 'selection' ] as $post_id ) {
							$cache->add_post( $post_id );
						}
					}
				}
			}
		}
	}

	/**
	 * Massage submitted data for consistency
	 *
	 * @param array $data
	 * @return array
	 */
	public function prepare_data_for_save( $data ) {
		$data = wp_parse_args( $data, [ 'type' => 'manual', 'posts' => [], 'filters' => [], 'max' => 0 ] );

		foreach ( $data[ 'posts' ] as &$post_data ) {
			switch( $post_data[ 'method' ] ) {
				case 'select':
					if ( empty( $post_data[ 'id' ] ) ) {
						$post_data = null;
					} elseif ( ! get_post_status( $post_data[ 'id' ] ) ) {
						$post_data = null;
					}
					break;
				case 'manual':
					$post_data = wp_parse_args( $post_data, [
						'post_title'   => '',
						'post_content' => '',
						'thumbnail_id' => 0,
						'url'          => '',
					] );
					break;
				default:
					$post_data = null;
					break;
			}
		}

		$data[ 'posts' ] = array_values( array_filter( $data[ 'posts' ] ) ); // values to avoid non-sequential keys

		return $data;
	}

	/**
	 * Query for posts matching the selected filters
	 *
	 * @param array  $filters
	 * @param string $fields
	 * @param int    $max
	 *
	 * @return array Matching post IDs
	 */
	protected function filter_posts( $filters, $fields = 'ids', $max = 0 ) {
		$context = get_queried_object_id();
		$max = $max ? $max : $this->max;
		$ids = self::get_posts_for_filters( $filters, $max, $context );
		if ( $fields == 'ids' || empty( $ids ) ) {
			return $ids;
		}
		$query = [
			'post_type'        => 'any',
			'post_status'      => 'any',
			'posts_per_page'   => $max,
			'post__in'         => $ids,
			'fields'           => $fields,
			'suppress_filters' => false,
		];

		return get_posts( $query );
	}

	protected static function get_cache( $query ) {
		$cache = get_transient( self::cache_key( $query ) );
		if ( !is_array( $cache ) ) {
			return [ ];
		}
		return $cache;
	}

	protected static function set_cache( $query, $value ) {
		set_transient( self::cache_key( $query ), $value, self::CACHE_TIMEOUT );
	}

	protected static function cache_key( $query ) {
		$prefix = 'panel_query_';
		$key = $prefix . maybe_serialize( $query );
		$hash = md5( $key );
		return $hash;
	}

	public static function taxonomy_options() {
		$taxonomies = apply_filters( 'modular_content_posts_field_taxonomy_options', [ 'post_tag' ] );

		return array_values( array_filter( $taxonomies, 'taxonomy_exists' ) );
	}

	public static function p2p_options() {
		$options = [ ];
		if ( class_exists( 'P2P_Connection_Type_Factory' ) ) {
			$options = \P2P_Connection_Type_Factory::get_all_instances();
		}
		return apply_filters( 'modular_content_posts_field_p2p_options', $options );
	}

	public function post_type_options() {
		$post_types = [];
		if ( empty( $this->post_types ) ) {
			// default to all post types that have public archives
			$post_types = get_post_types( [ 'has_archive' => true, 'public' => true ], 'objects', 'and' );
			$post_types[ 'post' ] = get_post_type_object( 'post' ); // posts are special
			unset( $post_types[ 'landing_page' ] ); // because, really, why would you?
			$post_types = apply_filters( 'panels_query_post_type_options', $post_types, $this );
		} else {
			foreach ( $this->post_types as $key => $post_type ) {
				if ( is_object( $post_type ) ) {
					$post_types[ $post_type->name ] = $post_type;
				} else {
					$post_types[ $post_type ] = get_post_type_object( $post_type );
				}
			}
		}
		return array_filter( $post_types );
	}

	protected static function get_filter_groups() {
		$filter_groups = [ ];
		foreach ( self::taxonomy_options() as $taxonomy_name ) {
			$filter_groups[ $taxonomy_name ] = 'taxonomy';
		}
		foreach ( array_keys( self::p2p_options() ) as $p2p_id ) {
			$filter_groups[ $p2p_id ] = 'p2p';
		}
		$filter_groups[ 'date' ] = 'date';
		return $filter_groups;
	}

	protected static function build_hierarchical_term_name( $term, $sep = ' > ' ) {
		$name = $term->name;
		while ( !empty( $term->parent ) ) {
			$term = get_term( $term->parent, $term->taxonomy );
			$name = $term->name . $sep . $name;
		}
		return $name;
	}

	public static function get_post_data( $post_ids ) {
		$posts = [ ];
		foreach ( $post_ids as $id ) {
			$posts[ $id ] = AdminPreCache::get_post_array( $id );
		}
		return $posts;
	}

	public static function get_posts_for_filters( $filters, $max = 10, $context = 0 ) {
		$query = self::get_query_for_filters( $filters, $max, $context );
		$cache = self::get_cache( $query );
		if ( ! empty( $cache ) ) {
			return $cache;
		}

		$result = get_posts( $query );
		self::set_cache( $query, $result );

		return $result;
	}

	public static function get_query_for_filters( $filters, $max = 10, $context = 0 ) {
		$query = [
			'post_type'        => 'any',
			'post_status'      => 'publish',
			'posts_per_page'   => $max,
			'tax_query'        => [
				'relation' => 'AND',
			],
			'meta_query'        => [
				'relation' => 'AND',
			],
			'fields'           => 'ids',
			'suppress_filters' => false,
		];
		foreach ( $filters as $type => $filter ) {
			if ( empty( $filter[ 'selection' ] ) ) {
				continue;
			}
			if ( !is_array( $filter[ 'selection' ] ) ) {
				$filter[ 'selection' ] = explode( ',', $filter[ 'selection' ] );
			}
			$filter_groups = self::get_filter_groups();
			if ( $type == 'post_type' ) {
				if ( !empty( $filter[ 'lock' ] ) || !is_post_type_archive() ) {
					$query[ 'post_type' ] = $filter[ 'selection' ];
				} else {
					$post_type_object = get_queried_object();
					$query[ 'post_type' ] = $post_type_object->name;
				}
			} elseif ( isset( $filter_groups[ $type ] ) && $filter_groups[ $type ] == 'p2p' ) {
				$ids = self::get_p2p_filtered_ids( $type, $filter[ 'selection' ] );
				if ( empty( $ids ) ) {
					$query[ 'post__in' ] = [ -1 ];
					break; // stop filtering. nothing should match
				}
				if ( !isset( $query[ 'post__in' ] ) ) {
					$query[ 'post__in' ] = [ ];
				}
				$query[ 'post__in' ] = array_merge( $query[ 'post__in' ], $ids );
			} elseif ( isset( $filter_groups[ $type ] ) && $filter_groups[ $type ] == 'date' ) {
				$dq = [ 'inclusive' => true, 'relation' => 'AND' ];
				if ( !empty( $filter[ 'selection' ][ 'start' ] ) ) {
					$dq[ 'after' ] = $filter[ 'selection' ][ 'start' ];
				}
				if ( !empty( $filter[ 'selection' ][ 'end' ] ) && $end = strtotime( $filter[ 'selection' ][ 'end' ] ) ) {
					$dq[ 'before' ] = [ // end date must be an array for inclusiveness
					                    'year'  => date( 'Y', $end ),
					                    'month' => date( 'n', $end ),
					                    'day'   => date( 'j', $end ),
					];
				}
				if ( !( empty( $dq[ 'after' ] ) && empty( $dq[ 'before' ] ) ) ) {
					$query[ 'date_query' ] = $dq;
				}
			} elseif ( taxonomy_exists( $type ) ) {
				$locked = false;
				if ( !empty( $filter[ 'lock' ] ) ) {
					$locked = true;
				} elseif ( $type == 'post_tag' ) {
					if ( !is_tag() ) {
						$locked = true;
					}
				} elseif ( $type == 'category' ) {
					if ( !is_category() ) {
						$locked = true;
					}
				} elseif ( !is_tax( $type ) ) {
					$locked = true;
				}
				if ( !$locked ) {
					$term = get_queried_object();
				}
				if ( $locked || !$term ) {
					$query[ 'tax_query' ][] = [
						'taxonomy' => $type,
						'field'    => 'id',
						'terms'    => array_map( 'intval', $filter[ 'selection' ] ),
						'operator' => 'IN',
					];
				} else {
					$query[ 'tax_query' ][] = [
						'taxonomy' => $type,
						'field'    => 'id',
						'terms'    => (int)$term->term_id,
						'operator' => 'IN',
					];
				}
			} else { // assume it's a post meta key
				$query[ 'meta_query' ][] = [
					'key' => $type,
					'value' => $filter[ 'selection' ],
					'operator' => 'IN',
				];
			}
		}

		$query = apply_filters( 'panels_input_query_filter', $query, $filters, $context );

		return $query;
	}

	/**
	 * @param $connection_id
	 * @param $post_ids
	 *
	 * @return array
	 *
	 * Originally this used get_posts with with connected_type and connected arguments.  It was bugging out and the
	 * sql WP was calling for that request was mind boggling complex so I've simplified it using a wpdb query.
	 */
	protected static function get_p2p_filtered_ids( $connection_id, $post_ids ) {
		global $wpdb;
		$post_ids_sql = implode( ',', array_map( 'intval', $post_ids ) );

		/**
		 * Get all p2p connections for request post ids of connection type
		 */
		$sql = $wpdb->prepare(
				"SELECT p2p_to, p2p_from FROM {$wpdb->p2p} WHERE p2p_type=%s AND (p2p_to IN ($post_ids_sql) OR p2p_from IN ($post_ids_sql))",
				$connection_id );

		$connected = [];
		$results = $wpdb->get_results( $sql, ARRAY_A );

		if ( empty( $results ) ) {
			return [];
		}

		/**
		 * Merge all p2p_to and p2p_from into a single array then pull just those that are different from our request post ids.
		 */
		$p2p_results = array_diff( array_merge( array_column( $results, 'p2p_to' ), array_column( $results, 'p2p_from' ) ), $post_ids );
		$connected   = array_unique( $p2p_results );

		return $connected;
	}

	public function get_blueprint() {
		$blueprint = parent::get_blueprint();
		$blueprint[ 'min' ] = $this->min;
		$blueprint[ 'max' ] = $this->max;
		$blueprint[ 'suggested' ] = $this->suggested;
		$blueprint[ 'show_max_control' ] = $this->show_max_control;
		$blueprint[ 'hidden_fields' ] = $this->hidden_fields;
		$blueprint[ 'post_type' ] = [ ];
		foreach ( $this->post_type_options() as $pto ) {
			if ( !is_object( $pto ) ) {
				$pto = get_post_type_object( $pto );
			}
			$blueprint[ 'post_type' ][] = [
				'value' => $pto->name,
				'label' => $pto->label,
			];
		}
		$blueprint[ 'filters' ] = [ ];
		$taxonomy_options = [ ];
		foreach ( $this->taxonomy_options() as $tax ) {
			$taxonomy = get_taxonomy( $tax );
			$taxonomy_options[] = [
				'value'       => $tax,
				'label'       => $taxonomy->label,
				'filter_type' => 'taxonomy',
				'post_type'   => Util::get_post_types_for_taxonomy( $tax ),
			];
		}
		if ( !empty( $taxonomy_options ) ) {
			$blueprint[ 'filters' ][] = [
				'label'   => $this->get_string( 'label.taxonomy' ),
				'options' => $taxonomy_options,
			];
		}

		$p2p_options = [ ];
		foreach ( $this->p2p_options() as $relationship_id => $relationship ) {
			$post_types_for_p2p = \ModularContent\Util::get_post_types_for_p2p_relationship( $relationship );
			$p2p_options[] = [
				'value'       => $relationship_id,
				'label'       => Util::get_p2p_relationship_label( $relationship ),
				'filter_type' => 'p2p',
				'post_type'   => $post_types_for_p2p,
			];
		}
		if ( !empty( $p2p_options ) ) {
			$blueprint[ 'filters' ][] = [
				'label'   => $this->get_string( 'label.relationship' ),
				'options' => $p2p_options,
			];
		}

		$blueprint[ 'filters' ][] = [
			'value'       => 'date',
			'label'       => $this->get_string( 'label.date' ),
			'filter_type' => 'date',
			'post_type'   => Util::get_post_types_for_date(),
		];

		$blueprint[ 'taxonomies' ] = [ ];

		foreach ( $this->taxonomy_options() as $taxonomy_name ) {
			$terms = get_terms( $taxonomy_name, [ 'hide_empty' => false ] );
			$options = [ ];
			foreach ( $terms as $term ) {
				$term_name = self::build_hierarchical_term_name( $term );
				$options[] = [
					'value' => $term->term_id,
					'label' => html_entity_decode( $term_name, ENT_QUOTES | ENT_HTML401 ), // it will be re-encoded later
				];
			}
			usort( $options, [ $this, 'sort_by_label' ] );
			$blueprint[ 'taxonomies' ][ $taxonomy_name ] = $options;
		}

		return $blueprint;
	}

	private function sort_by_label( $a, $b ) {
		return strcasecmp( $a[ 'label' ], $b[ 'label' ] );
	}
}
