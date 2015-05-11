<?php

namespace ModularContent\Fields;
use ModularContent\Panel;

/**
 * Class Title
 *
 * @package ModularContent\Fields
 *
 * A special case of the text field. The title
 * field is automatically added to each Panel,
 * and is used to set the title of the panel
 * in the admin.
 */
class Title extends Text {
	protected $label = '';
	protected $name = 'title';

	public function __construct( $args = array() ){
		$this->label = __( 'Title', 'modular-content' );
		parent::__construct($args);
	}
}
