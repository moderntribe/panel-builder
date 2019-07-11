<?php


namespace ModularContent\Fields;

use ModularContent\Panel;
use ModularContent\AdminPreCache;

/**
 * Class Group
 *
 * A container for a group of fields. It wraps fields in the admin
 * in a fieldset to show logical groupings.
 *
 */
class Group extends Field {

	/** @var Field[] */
	protected $fields = [];

	protected $default = [];

	protected $layout = 'full';

	public function __construct( $args = [] ) {
		$this->defaults['layout'] = $this->layout;
		parent::__construct( $args );
	}

	/**
	 * @param Field $field
	 *
	 */
	public function add_field( Field $field ) {
		$this->fields[ $field->get_name() ] = $field;
	}

	/**
	 * @param $name
	 *
	 * @return Field|NULL
	 */
	public function get_field( $name ) {
		foreach ( $this->fields as $field ) {
			if ( $field->get_name() == $name || $this->get_name() . '.' . $field->get_name() == $name ) {
				return $field;
			}
		}

		return null;
	}

	/**
	 * Child fields should have the opportunity to set their own vars
	 *
	 * @param mixed $data
	 * @param Panel $panel
	 *
	 * @return array
	 */
	public function get_vars( $data, $panel ) {
		$vars = [];
		foreach ( $this->fields as $field ) {
			$name = $field->get_name();
			if ( isset( $data[ $name ] ) ) {
				$vars[ $name ] = $field->get_vars( $data[ $name ], $panel );
			}
		}

		$vars = apply_filters( 'panels_field_vars', $vars, $this, $panel );

		return $vars;
	}

	/**
	 * Child fields should have the opportunity to set their own vars for API
	 *
	 * @param mixed $data
	 * @param Panel $panel
	 *
	 * @return array
	 */
	public function get_vars_for_api( $data, $panel ) {
		$vars = [];
		foreach ( $this->fields as $field ) {
			$name = $field->get_name();
			if ( isset( $data[ $name ] ) ) {
				$vars[ $name ] = $field->get_vars_for_api( $data[ $name ], $panel );
			}
		}

		$vars = apply_filters( 'panels_field_vars_for_api', $vars, $data, $this, $panel );

		return $vars;
	}

	/**
	 * Add data relevant to this field to the precache
	 *
	 * @param mixed         $data
	 * @param AdminPreCache $cache
	 *
	 * @return void
	 */
	public function precache( $data, AdminPreCache $cache ) {
		foreach ( $this->fields as $field ) {
			$name = $field->get_name();
			if ( isset( $data[ $name ] ) ) {
				$field->precache( $data[ $name ], $cache );
			}
		}
	}

	public function get_blueprint() {
		$blueprint           = parent::get_blueprint();
		$blueprint['fields'] = [];
		foreach ( $this->fields as $field ) {
			$blueprint['fields'][] = $field->get_blueprint();
		}
		$blueprint['layout'] = $this->layout;

		return $blueprint;
	}

	/**
	 * Ensure that the submitted array is keyless
	 *
	 * @param array $data
	 *
	 * @return array
	 */
	public function prepare_data_for_save( $data ) {
		foreach ( $this->fields as $field ) {
			$name = $field->get_name();
			if ( ! isset( $data[ $name ] ) ) {
				$data[ $name ] = null;
			}
			$data[ $name ] = $field->prepare_data_for_save( $data[ $name ] );
		}

		return $data;
	}
} 