<?php


namespace ModularContent\Fields;


class Repeater extends Group {

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
		printf('<fieldset class="panel-input input-name-%s panel-input-repeater" data-name="%s">', $this->esc_class($this->name), esc_attr($this->name));
	}

	protected function get_default_value_js() {
		return "{}";
	}

	protected function render_field() {
		echo '<div class="repeater-field-container"></div>';
		echo '<a href="#" class="panel-repeater-new-row icon-plus-sign"> '.__('New', 'panels').'</a>';
		add_action( 'after_panel_admin_template_inside', array( $this, 'print_supporting_templates' ), 10, 0 );
		wp_enqueue_script( 'modular-content-repeater-field', \ModularContent\Plugin::plugin_url('assets/js/repeater-field.js'), array('jquery'), FALSE, TRUE );
	}

	public function print_supporting_templates() {
		?>
		<script type="text/html" class="template" id="tmpl-repeater-<?php esc_attr_e($this->name); ?>">
			<div class="panel-repeater-row">
				<span class="panel-input-repeater-row-controls"><a class="delete icon-remove"></a></span>
				<?php
					foreach ( $this->fields as $field ) {
						$field->render();
					}
				?>
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
	 * @return array
	 */
	public function get_vars( $data ) {
		$vars = array();
		$data = (array)$data; // probably stored as an object with numeric properties
		foreach ( $data as $instance ) {
			$instance_vars = array();
			foreach ( $this->fields as $field ) {
				$name = $field->get_name();
				if ( isset($instance[$name]) ) {
					$instance_vars[$name] = $field->get_vars($data[$name]);
				}
			}
			if ( !empty($instance_vars) ) {
				$vars[] = $instance_vars;
			}
		}
		return $vars;
	}
} 