<?php


namespace ModularContent;


/**
 * Class Util
 *
 * @package ModularContent
 *
 * A collection of utility methods
 */
class Util {

	/**
	 * Get a list of post types that can use the given relationship
	 *
	 * @param \P2P_Connection_Type $relationship
	 * @param string $side
	 *
	 * @return array
	 */
	public static function get_post_types_for_p2p_relationship( $relationship, $side = 'both' ) {
		if ( !class_exists( 'P2P_Side_Post' ) ) {
			return array();
		}

		$connected_post_types = array();
		if ( $side == 'to' ) {
			$sides = array( 'to' );
		} elseif ( $side == 'from' ) {
			$sides = array( 'from' );
		} else {
			$sides = array( 'from', 'to' );
		}
		foreach ( $sides as $direction ) {
			if ( $relationship->side[$direction]->get_object_type() == 'post' ) {
				$connected_post_types = array_merge( $connected_post_types, $relationship->side[$direction]->query_vars['post_type'] );
			}
		}
		return array_unique( $connected_post_types );

	}

	/**
	 * Get an array of post types that can use the given taxonomy
	 *
	 * @param string $taxonomy_id
	 * @return array
	 */
	public static function get_post_types_for_taxonomy( $taxonomy_id ) {
		$taxonomy = get_taxonomy( $taxonomy_id );
		if ( !$taxonomy ) {
			return array();
		}

		return $taxonomy->object_type;
	}

	/**
	 * Get a label to use for displaying a P2P relationship
	 *
	 * @param \P2P_Connection_Type $relationship
	 * @return string
	 */
	public static function get_p2p_relationship_label( $relationship ) {
		$from = $relationship->get_field( 'title', 'from' );
		$to = $relationship->get_field( 'title', 'to' );

		if ( $from == $to ) {
			return $from;
		}

		if ( $relationship->reciprocal ) {
			return "$from &harr; $to";
		} else {
			return "$from &rarr; $to";
		}
	}
}