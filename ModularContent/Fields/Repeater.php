<?php


namespace ModularContent\Fields;
use ModularContent\AdminPreCache;
use ModularContent\Panel;


/**
 * Class Repeater
 *
 * A repeatable container for a group of fields. The Repeater can
 * contain one or more fields. An editor can add, remove, or sort
 * instances of the group.
 *
 * Using data from a repeater in a template:
 *
 * $contacts = get_panel_var( 'contacts' );
 * foreach ( $contacts as $contact ) {
 *   $name = $contact['name'];
 *   $email = $contact['email'];
 * }
 *
 */
class Repeater extends Group {
	protected $min = 0;
	protected $max = 0;
	protected $update_index = true;
	protected $new_button_label = '';

	/**
	 * @param array $args
	 */
	public function __construct( $args = array() ) {
		$this->defaults['min'] = $this->min;
		$this->defaults['max'] = $this->max;
		$this->defaults['update_index'] = $this->update_index;
		$this->defaults[ 'strings' ] = [
			'button.new' => __( 'Add Row', 'modular-content' ),
			'button.delete' => __( 'Delete Row', 'modular-content' ),
			'label.row_index' => _x( 'Row %{index} |||| Row %{index}', 'Format should be polyglot.js compatible. See https://github.com/airbnb/polyglot.js#pluralization', 'modular-content' ),
			'notice.max_rows' => __( 'You have reached the row limit of this field', 'modular-content' ),
		];

		// backwards compat
		$this->defaults['new_button_label'] = __( 'New', 'panels' );
		if ( isset( $args['new_button_label'] ) && !isset( $args['strings']['button.new'] ) ) {
			$args['strings']['button.new'] = $args['new_button_label'];
		}

		parent::__construct($args);

	}

	/**
	 * @param Field $field
	 *
	 */
	public function add_field( Field $field ) {
		$this->fields[$field->get_name()] = $field;
	}

	/**
	 * @param $name
	 *
	 * @return Field|NULL
	 */
	public function get_field( $name ) {
		foreach( $this->fields as $field ) {
			if ( $field->get_name() == $name || $this->get_name().'.'.$field->get_name() == $name ) {
				return $field;
			}
		}
		return NULL;
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
		$data = (array)$data; // probably stored as an object with numeric properties
		foreach ( $data as $instance ) {
			$instance_vars = array();
			foreach ( $this->fields as $field ) {
				$name = $field->get_name();
				if ( isset($instance[$name]) ) {
					$instance_vars[$name] = $field->get_vars($instance[$name], $panel);
				}
			}
			if ( !empty($instance_vars) ) {
				$vars[] = $instance_vars;
			}
		}

		$vars = apply_filters( 'panels_field_vars', $vars, $this, $panel );

		return $vars;
	}


	/**
	 * Child fields should have the opportunity to set their own vars
	 *
	 * @param mixed $data
	 * @param Panel $panel
	 *
	 * @return array
	 */
	public function get_vars_for_api( $data, $panel ) {
		$vars = array();
		$data = (array) $data; // probably stored as an object with numeric properties
		foreach ( $data as $instance ) {
			$instance_vars = array();
			foreach ( $this->fields as $field ) {
				$name = $field->get_name();
				if ( isset( $instance[ $name ] ) ) {
					$instance_vars[ $name ] = $field->get_vars_for_api( $instance[ $name ], $panel );
				}
			}
			if ( ! empty( $instance_vars ) ) {
				$vars[] = $instance_vars;
			}
		}

		$vars = apply_filters( 'panels_field_vars_for_api', $vars, $data, $this, $panel );

		return $vars;
	}

	/**
	 * Ensure that the submitted array is keyless
	 *
	 * @param array $data
	 * @return array
	 */
	public function prepare_data_for_save( $data ) {
		if ( ! is_array( $data ) ) {
			$data = [];
		}
		$data = array_values( $data ); // ensure sequential numeric keys
		foreach ( $data as &$instance ) {
			foreach ( $this->fields as $field ) {
				$name = $field->get_name();
				if ( ! isset( $instance[ $name ] ) ) {
					$instance[ $name ] = null;
				}
				$instance[ $name ] = $field->prepare_data_for_save( $instance[ $name ] );
			}
		}
		return $data;
	}

	public function get_blueprint() {
		$blueprint                    = parent::get_blueprint();
		$blueprint['update_index']    = $this->update_index;
		$blueprint['min']             = $this->min;
		$blueprint['max']             = $this->max;

		unset( $blueprint['layout'] );

		return $blueprint;
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
			$name = $field->get_name();
			foreach ( $data as $record ) {
				if ( isset($record[$name]) ) {
					$field->precache( $record[$name], $cache );
				}
			}
		}
	}
}
