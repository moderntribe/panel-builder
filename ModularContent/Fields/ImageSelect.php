<?php

namespace ModularContent\Fields;


/**
 * Class ImageSelect
 *
 * @package ModularContent\Fields
 *
 * Use just like a Radio, but option values should be image URLs
 *
 * This class is deprecated. See Image_Select.
 *
 */
class ImageSelect extends Image_Select {

	public function __construct( $args = [ ] ) {

		_deprecated_file( __FILE__, '', 'Image_Select', 'Camel Case is out of style' );

		parent::__construct( $args );
	}
}