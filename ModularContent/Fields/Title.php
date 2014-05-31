<?php

namespace ModularContent\Fields;

class Title extends Text {
	protected $label = 'Title';
	protected $name = 'title';

	public function __construct( $args = array() ){
		parent::__construct($args);
	}
}
