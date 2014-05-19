<?php

namespace ModularContent\Fields;


class Image extends Field {
	protected $size = 'thumbnail'; // The size that will displayed in the admin

	
	public function __construct( $args = array() ) {
		$this->defaults['size'] = $this->size;
		parent::__construct($args);
	}


	public function render_field() {

		$args = array(
			'label' => $this->label,
			'value' => $this->get_value(),
			'size'  => $this->size,
			'name'  => $this->get_input_name(),
			'type'  => 'image'
		);

	    require_once( dirname( dirname( dirname(__DIR__) )).'/insights/lib/attachment-helper/attachment-helper.php' );
		$field = new \AttachmentHelper\Field( $args );
		
		echo $field->render();
	}
}
