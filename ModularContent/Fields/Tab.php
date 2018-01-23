<?php

namespace ModularContent\Fields;

class Tab extends Group {

	protected $icon = '';

	public function __construct( array $args = [] ) {
		$this->defaults['icon'] = $this->icon;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint         = parent::get_blueprint();
		$blueprint['icon'] = $this->icon;

		unset( $blueprint['layout'] );

		return $blueprint;
	}

}