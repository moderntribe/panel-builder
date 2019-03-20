<?php


namespace ModularContent\Admin;

use ModularContent\Blueprint_Builder;
use ModularContent\TypeRegistry;

class JS_Config {
	private $data;
	/** @var Blueprint_Builder */
	private $blueprint;

	public function __construct( Blueprint_Builder $blueprint ) {
		$this->blueprint = $blueprint;
	}

	public function get_data() {
		if ( ! isset( $this->data ) ) {
			$this->data = [
				'blueprint' => $this->blueprint,
			];

			$this->data = apply_filters( 'modular-content/admin/js_config', $this->data );
		}

		return $this->data;
	}
}