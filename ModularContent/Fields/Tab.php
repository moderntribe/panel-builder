<?php

namespace ModularContent\Fields;

class Tab extends Group {

	protected $icon     = '';
	protected $viewport = '';

	public function __construct( array $args = [] ) {
		$this->defaults['icon']     = $this->icon;
		$this->defaults['viewport'] = $this->viewport;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint             = parent::get_blueprint();
		$blueprint['icon']     = $this->icon;
		$blueprint['viewport'] = $this->viewport;

		unset( $blueprint['layout'] );

		return $blueprint;
	}

}