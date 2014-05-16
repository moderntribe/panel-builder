<?php


namespace ModularContent\Fields;

/**
 * Class Group
 *
 * A container for a group of fields
 */
class Group extends Field {

	/** @var Field[] */
	protected $fields = array();

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
		printf('<fieldset class="panel-input input-name-%s">', $this->esc_class($this->name));
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
} 