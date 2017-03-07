<?php

namespace ModularContent\Fields;

/**
 * Class TextArea
 *
 * @package ModularContent\Fields
 *
 * This class is deprecated. See Text_Area.
 */
class TextArea extends Text_Area {

	public function __construct( $args = [ ] ) {
		_deprecated_file( __FILE__, '', 'Text_Area', 'Camel Case is out of style' );

		parent::__construct( $args );
	}

}
