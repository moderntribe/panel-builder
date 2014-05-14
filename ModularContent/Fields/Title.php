<?php

namespace ModularContent\Fields;

class Title extends Text {
	protected $label = 'Title';
	protected $name = 'title';

	public function __construct( $args = array() ){
		parent::__construct($args);
	}

	public function get_value( $post_id ) {
		return parent::get_value(); // TODO
	}
}
