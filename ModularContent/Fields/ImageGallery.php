<?php


namespace ModularContent\Fields;


/**
 * Class ImageGallery
 *
 * @package ModularContent\Fields
 *
 * This class is deprecated. See Image_Gallery.
 */
class ImageGallery extends Image_Gallery {

	public function __construct( $args ) {

		_deprecated_file( __FILE__, '', 'Image_Gallery', 'Camel Case is out of style' );

		parent::__construct( $args );
	}
}