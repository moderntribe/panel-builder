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

	public static function json_encode( $data ) {
		if ( is_object( $data ) && $data instanceof \JsonSerializable ) {
			$data = $data->jsonSerialize();
		}
		$data = self::utf8_encode_recursive( $data );
		return json_encode( $data );
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
				$result[ $key ] = (object)self::utf8_encode_recursive( (array)$value );
			} else if ( is_string( $value ) ) {
				$result[ $key ] = utf8_encode( self::clean_cp1252( $value ) );
			} else {
				$result[ $key ] = $value;
			}
		}

		return $result;
	}

	protected static function clean_cp1252( $string ) {
		static $trans = array();
		if ( empty( $trans ) ) {
			$trans[ chr( 130 ) ] = '&sbquo;';    // Single Low-9 Quotation Mark
			$trans[ chr( 131 ) ] = '&fnof;';    // Latin Small Letter F With Hook
			$trans[ chr( 132 ) ] = '&bdquo;';    // Double Low-9 Quotation Mark
			$trans[ chr( 133 ) ] = '&hellip;';    // Horizontal Ellipsis
			$trans[ chr( 134 ) ] = '&dagger;';    // Dagger
			$trans[ chr( 135 ) ] = '&Dagger;';    // Double Dagger
			$trans[ chr( 136 ) ] = '&circ;';    // Modifier Letter Circumflex Accent
			$trans[ chr( 137 ) ] = '&permil;';    // Per Mille Sign
			$trans[ chr( 138 ) ] = '&Scaron;';    // Latin Capital Letter S With Caron
			$trans[ chr( 139 ) ] = '&lsaquo;';    // Single Left-Pointing Angle Quotation Mark
			$trans[ chr( 140 ) ] = '&OElig;';    // Latin Capital Ligature OE
			$trans[ chr( 145 ) ] = '&lsquo;';    // Left Single Quotation Mark
			$trans[ chr( 146 ) ] = '&rsquo;';    // Right Single Quotation Mark
			$trans[ chr( 147 ) ] = '&ldquo;';    // Left Double Quotation Mark
			$trans[ chr( 148 ) ] = '&rdquo;';    // Right Double Quotation Mark
			$trans[ chr( 149 ) ] = '&bull;';    // Bullet
			$trans[ chr( 150 ) ] = '&ndash;';    // En Dash
			$trans[ chr( 151 ) ] = '&mdash;';    // Em Dash
			$trans[ chr( 152 ) ] = '&tilde;';    // Small Tilde
			$trans[ chr( 153 ) ] = '&trade;';    // Trade Mark Sign
			$trans[ chr( 154 ) ] = '&scaron;';    // Latin Small Letter S With Caron
			$trans[ chr( 155 ) ] = '&rsaquo;';    // Single Right-Pointing Angle Quotation Mark
			$trans[ chr( 156 ) ] = '&oelig;';    // Latin Small Ligature OE
			$trans[ chr( 159 ) ] = '&Yuml;';    // Latin Capital Letter Y With Diaeresis

			$trans = array_map( 'html_entity_decode', $trans ); // convert the above to utf-8 characters
		}

		return strtr( $string, $trans );
	}
}