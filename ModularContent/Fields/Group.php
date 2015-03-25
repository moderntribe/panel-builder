<?php


namespace ModularContent\Fields;
use ModularContent\Panel;
use ModularContent\AdminPreCache;

/**
 * Class Group
 *
 * A container for a group of fields
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