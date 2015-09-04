<?php


namespace ModularContent\Fields;
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
	protected $new_button_label = '';

	/**
	 * @param array $args
	 *
	 * Creating a repeater:
	 *
	 * $name = new Text( array(
	 *   'label' => __('Name'),
	 *   'name' => 'name',
	 * ) );
	 * $email = new Text( array(
	 *   'label' => __('Email'),
	 *   'name' => 'email',
	 * ) );
	 * $group = new Repeater( array(
	 *   'label' => __('Contacts'),
	 *   'name' => 'contacts',
	 *   'max' => 5,
	 *   'new_button_label' => __( 'Add a Contact' ),
	 * ) );
	 * $group->add_field( $name );
	 * $group->add_field( $email );
	 */
	public function __construct( $args = array() ) {
		$this->defaults['min'] = $this->min;
		$this->defaults['max'] = $this->max;
		$this->defaults['new_button_label'] = __( 'New', 'panels' );
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

	protected function render_opening_tag() {
		printf('<fieldset class="panel-input input-name-%s panel-input-repeater" data-name="%s" data-min="%d" data-max="%d">', $this->esc_class($this->name), esc_attr($this->name), $this->min, $this->max);
	}

	protected function get_default_value_js() {
		return "{}";
	}

	protected function render_field() {
		echo '<div class="repeater-field-container"></div>';
		echo '<a href="#" class="panel-repeater-new-row icon-plus-sign"> ' . $this->new_button_label . '</a>';
		add_action( 'after_panel_admin_template_inside', array( $this, 'print_supporting_templates' ), 10, 0 );
		wp_enqueue_script( 'modular-content-repeater-field', \ModularContent\Plugin::plugin_url('assets/scripts/js/fields/repeater-field.js'), array('jquery'), FALSE, TRUE );
	}

	public function print_supporting_templates() {
		?>
		<script type="text/template" class="template" id="tmpl-repeater-<?php esc_attr_e($this->name); ?>">
			<div class="panel-repeater-row">
				<div class="panel-toggle repeater-toggle" data-target="panel-input">
					<a class="move icon-reorder repeater-sort"></a>
					<?php _e('Row', 'modular-content'); ?>
				</div>
				<?php
				foreach ( $this->fields as $field ) {
					$field->render();
				}
				?>
				<a class="delete icon-remove"><?php _e('Delete Row', 'modular-content'); ?></a>
			</div>
		</script>
		<?php
		add_action( 'after_panel_admin_template', array( $this, 'dequeue_supporting_templates' ), 10 );
	}

	public function dequeue_supporting_templates() {
		remove_action( 'after_panel_admin_template_inside', array( $this, 'print_supporting_templates' ), 10, 0 );
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
		if ( is_array( $data ) ) {
			return array_values( $data );
		}
		return $data;
	}
}
