<?php

namespace ModularContent\Fields;
use ModularContent\Panel;

class Title extends Text {
	protected $label = '';
	protected $name = 'title';

	public function __construct( $args = array() ){
		$this->label = __( 'Title', 'modular-content' );
		parent::__construct($args);
	}
}
