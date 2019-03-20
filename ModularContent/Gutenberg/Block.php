<?php


namespace ModularContent\Gutenberg;

use ModularContent\Panel;
use ModularContent\PanelType;

class Block {
	/** @var PanelType */
	private $type;

	public function __construct( PanelType $type ) {
		$this->type = $type;
	}

	public function register() {
		register_block_type( sprintf( '%s/%s', $this->block_prefix(), $this->type->get_id() ), $this->registration_args() );
	}

	private function block_prefix() {
		return 'tribe-panel';
	}

	private function registration_args() {
		return [
			'render_callback' => [ $this, 'render' ],
			'editor_script'   => 'bigcommerce-gutenberg-scripts',
		];
	}

	public function render( $data ) {
		$panel = new Panel( $this->type, $data );
		return $panel->render();
	}

}