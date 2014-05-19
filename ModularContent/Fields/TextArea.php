<?php

namespace ModularContent\Fields;

class TextArea extends Field {
	protected $richtext = FALSE;

	public function __construct( $args = array() ) {
		$this->defaults['richtext'] = $this->richtext;
		parent::__construct($args);
	}


	public function render_field() {
		if ( $this->richtext ) {
			wp_editor(
				$this->get_input_value(),
				$this->label,
				array(
					'textarea_rows' => 12,
					'textarea_name' => $this->get_input_name(),
					'quicktags'     => false
				)
			);
		} else {
			printf('<span class="panel-input-field"><textarea name="%s" rows="6" cols="40">%s</textarea></span>', $this->get_input_name(), $this->get_input_value() );
		}
	}
}
