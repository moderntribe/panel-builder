<?php

namespace ModularContent\Fields;
use ModularContent\Panel;

class Title extends Text {
	protected $label = 'Title';
	protected $name = 'title';

	public function __construct( $args = array() ){
		parent::__construct($args);
	}
}
