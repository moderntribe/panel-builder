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
			'value' => $this->get_input_value(),
			'size'  => $this->size,
			'name'  => $this->get_input_name(),
			'type'  => 'image'
		);
		
		#TODO // Add Caption Support		
		#TODO // Make this use the actual $this->get_value() vs 127
		#TODO // Update Evernote with final version
		?>	
			
		<?php

		$field = new \ModularContentAttachmentHelper\Field( $args );
		
		echo $field->render();
	}
}
