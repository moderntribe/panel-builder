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
 * Creating a group:
 *
 * $first_name = new Text( array(
 *   'label' => __('First Name'),
 *   'name' => 'first',
 * ) );
 * $last_name = new Text( array(
 *   'label' => __('Last Name'),
 *   'name' => 'last',
 * ) );
 * $group = new Group( array(
 *   'label' => __('Name'),
 *   'name' => 'name',
 * ) );
 * $group->add_field( $first_name );
 * $group->add_field( $last_name );
 *
 *
 * Using data from a group in a template:
 *
 * $first_name = get_panel_var( 'name.first' );
 * $last_name = get_panel_var( 'name.last' );
 *
 * OR
 *
 * $name = get_panel_var( 'name' );
 * $first_name = $name['first'];
 * $last_name = $name['last'];
 *
 * OR
 *
 * $vars = get_panel_vars();
 * $first_name = $vars['name']['first'];
 * $last_name = $vars['name']['last'];
 */
class Group extends Field {

	/** @var Field[] */
	protected $fields = array();

	protected $default = '{}';

	/**
	 * @param Field $field
	 *
	 */
	public function add_field( Field $field ) {
		$field->name = $this->name.'.'.$field->name;
		$this->fields[$field->get_name()] = $field;
	}

	/**
	 * @param $name
	 *
	 * @return Field|NULL
	 */
	public function get_field( $name ) {
		foreach( $this->fields as $field ) {
			if ( $field->get_name() == $name ) {
				return $field;
			}
		}
		return NULL;
	}

	protected function render_opening_tag() {
		printf('<fieldset class="panel-input panel-input-type-group input-name-%s">', $this->esc_class($this->name));
	}

	protected function render_label() {
		if ( !empty($this->label) ) {
			printf('<legend class="panel-input-label">%s</legend>', $this->label);
		}
	}

	protected function render_field() {
		foreach ( $this->fields as $field ) {
			$field->render();
		}
	}

	protected function render_closing_tag() {
		echo '</fieldset>';
	}

	protected function get_default_value_js() {
		return $this->default;
	}

	/**
	 * Child fields should have the opportunity to set their own vars
	 *
	 * @param mixed $data
	 * @param Panel $panel
	 * @return array
	 */
	public function get_vars( $data, $panel ) {
		$vars = array();
		foreach ( $this->fields as $field ) {
			$name = str_replace($this->get_name().'.', '', $field->get_name());
			if ( isset($data[$name]) ) {
				$vars[$name] = $field->get_vars($data[$name], $panel);
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
	 * @return array
	 */
	public function get_vars_for_api( $data, $panel ) {
		$vars = array();
		foreach ( $this->fields as $field ) {
			$name = str_replace( $this->get_name() . '.', '', $field->get_name() );
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
	 * @param mixed $data
	 * @param AdminPreCache $cache
	 *
	 * @return void
	 */
	public function precache( $data, AdminPreCache $cache ) {
		foreach ( $this->fields as $field ) {
			$name = str_replace($this->get_name().'.', '', $field->get_name());
			if ( isset($data[$name]) ) {
				$field->precache( $data[$name], $cache );
			}
		}
	}
} 