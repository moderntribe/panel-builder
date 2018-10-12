<?php

namespace ModularContent\Fields;
use ModularContent\Panel, ModularContent\AdminPreCache;

/**
 * Class Posts
 *
 * @package ModularContent\Fields
 * 
 * This field type has been deprecated. Code should be updated
 * to use the Post_List field.
 *
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
class Posts extends Post_List {
	const CACHE_TIMEOUT = 300; // how long to store queries in cache

	protected $max = 12;
	protected $min = 0;
	protected $suggested = 0;
	protected $default = '{ type: "manual", post_ids: [], filters: {}, max: 0 }';
	protected $show_max_control = false;

	/**
	 * @param array $args
	 * @deprecated
	 */
	public function __construct( $args = array() ) {
		$this->defaults['max'] = $this->max;
		$this->defaults['min'] = $this->min;
		$this->defaults['suggested'] = $this->suggested;
		$this->defaults['show_max_control'] = $this->show_max_control;
		$this->defaults['strings'] = array(
			'tabs.manual' => __( 'Manual', 'modular-content' ),
			'tabs.dynamic' => __( 'Dynamic', 'modular-content' ),
		);
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

		$post_ids = apply_filters( 'panels_field_vars', $post_ids, $this, $panel );

		return $post_ids;
	}

	public function get_vars_for_api( $data, $panel ) {
		if ( $data['type'] == 'manual' ) {
			$post_ids = isset( $data['post_ids'] ) ? $data['post_ids'] : array();
		} else {
			if ( ! empty( $data['max'] ) && $data['max'] > $this->min && $data['max'] < $this->max ) {
				$max = (int) $data['max'];
			} else {
				$max = (int) $this->max;
			}
			$post_ids = isset( $data['filters'] ) ? $this->filter_posts( $data['filters'], 'ids', $max ) : array();
		}

		$posts = array_map( [ $this, 'post_id_to_array' ], array_filter( $post_ids ) );

		$posts = apply_filters( 'panels_field_vars_for_api', $posts, $data, $this, $panel );

		return $posts;
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
}
