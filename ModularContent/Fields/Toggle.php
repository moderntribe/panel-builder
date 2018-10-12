<?php


namespace ModularContent\Fields;


/**
 * Class Toggle
 *
 * @package ModularContent\Fields
 *
 * A field which returns a simple true/false value. Can be rendered with a stylized UI to visually resemble a toggle switch.
 */
class Toggle extends Checkbox {

	protected $stylized = true;
	protected $default  = 0;

	public function __construct( $args = [] ) {
		$this->defaults['stylized'] = $this->stylized;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint             = parent::get_blueprint();
		$blueprint['default']  = (int) $this->default;
		$blueprint['stylized'] = (bool) $this->stylized;

		unset( $blueprint['layout'] );
		unset( $blueprint['option_width'] );

		return $blueprint;
	}

	protected function get_options() {
		return [
			'1' => __( 'Enabled', 'panel-builder' ),
		];
	}
} 