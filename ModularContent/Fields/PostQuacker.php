<?php


namespace ModularContent\Fields;

/**
 * Class PostQuacker
 *
 * @package ModularContent\Fields
 *
 * This class is deprecated. See Post_Quacker.
 */
class PostQuacker extends Post_Quacker {


	public function __construct( $args ) {

		_deprecated_file( __FILE__, '', 'Post_Quacker', 'Camel Case is out of style' );

		parent::__construct( $args );
	}

}