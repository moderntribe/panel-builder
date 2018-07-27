<?php


namespace ModularContent\Fields;

use Symfony\Component\Console\Exception\LogicException;

/**
 * Class Style Family Select
 *
 * @package ModularContent\Fields
 *
 * Functionally the same as a Select Field; the UI renders this with some slight differences.
 */
class Style_Family_Select extends Select {

	protected $activation_triggers = [];
	protected $family_id           = '';

	public function __construct( $args = [] ) {
		if ( ! empty( $args[ 'options' ] ) ) {
			throw new \InvalidArgumentException( 'Style Family Selects do not take explicit options.' );
		}

		$this->defaults[ 'activation_triggers' ] = $this->activation_triggers;
		$this->defaults[ 'family_id' ]           = $this->family_id;
		parent::__construct( $args );
	}

	public function get_blueprint() {
		$blueprint                          = parent::get_blueprint();
		$blueprint[ 'activation_triggers' ] = $this->activation_triggers;
		$blueprint[ 'family_id' ]           = $this->family_id;

		return $blueprint;
	}
}