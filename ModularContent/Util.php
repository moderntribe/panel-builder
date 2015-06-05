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
		$labeled_post_types = array();
		foreach( array_unique( $connected_post_types ) as $post_type_id ) {
			$pto = get_post_type_object( $post_type_id );
			if ( $pto ) {
				$labeled_post_types[ $post_type_id ] = $pto->label;
			}
		}
		return $labeled_post_types;

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

	public static function get_post_types_for_date() {
		return get_post_types();
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

	/**
	 * A wrapper around json_encode that attempts to recover from malformed UTF-8
	 *
	 * @param mixed $data
	 *
	 * @return string
	 */
	public static function json_encode( $data ) {
		if ( empty( $data ) ) {
			return json_encode( $data ); // nothing to clean up
		}

		$encoded = json_encode( $data );
		if ( !empty( $encoded ) ) {
			return $encoded; // successful encoding
		}

		if ( json_last_error() === JSON_ERROR_UTF8 && function_exists( 'mb_convert_encoding' ) ) {

			if ( is_object( $data ) && $data instanceof \JsonSerializable ) {
				$data = $data->jsonSerialize();
			}
			$data = self::utf8_encode_recursive( $data );

			$encoded = json_encode( $data );

		}
		return $encoded;
	}

	public static function utf8_encode_recursive( $data ) {
		if ( empty( $data ) ) {
			return $data;
		}
		$result = [ ];
		foreach ( $data as $key => $value ) {
			if ( is_array( $value ) ) {
				$result[ $key ] = self::utf8_encode_recursive( $value );
			} elseif ( is_object( $value ) ) {
				if ( is_object( $value ) && $value instanceof \JsonSerializable ) {
					$value = $value->jsonSerialize();
				} else {
					$value = (array)$value;
				}
				$result[ $key ] = self::utf8_encode_recursive( $value );
			} else if ( is_string( $value ) ) {
				$result[ $key ] = self::utf8_encode_string( $value );
			} else {
				$result[ $key ] = $value;
			}
		}

		return $result;
	}

	protected static function utf8_encode_string( $string ) {
		$encoding = mb_detect_encoding( $string, "UTF-8, ISO-8859-1, ISO-8859-15", true );
		$string = mb_convert_encoding( $string,  'UTF-8', $encoding );
		return $string;
	}
}