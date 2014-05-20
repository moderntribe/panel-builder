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
		
		
		//TODO
		$value = 127;
		
		if( !empty( $value ) ){
			$img = wp_get_attachment_image( $value, $this->size );
		} else {
			$img = '<img class="attachment-medium" src="" />';
		}
		
		# START HERE - Move this into the attachment-helper plugins output
		#TODO // cleaned the css a little to mimize the space taken by the dropzone
		#TODO // Make this update the appropriate form fields when the ajax completes
		#TODO // Add Caption Support		
		#TODO // Make this use the actual $this->get_value() vs 127
		#TODO // Make the remove image work
		#TODO // Cleanup the original js from attachment-helper
		#TODO // Update Evernote with final version
		?>
		
			<div id="uploadContainer" style="margin-top: 10px;">

				<!-- Current image -->
				<div id="current-uploaded-image" class="<?php !empty( $value ) ? 'open' : 'closed'; ?>">
					<?php echo $img; ?>
					<p class="hide-if-no-js">
						<a class="button-secondary" href="#" id="remove-image"><?php echo __('Remove', 'modular-content' ) . ' ' . $this->label; ?></a>
					</p>
				</div>

				<!-- Uploader section -->
				<div id="uploaderSection">
					<div class="loading">
						<img src="/assets/images/loading.gif" alt="Loading..." />
					</div>
					<div id="plupload-upload-ui" class="hide-if-no-js">
						<div id="drag-drop-area">
							<div class="drag-drop-inside">
								<p class="drag-drop-info"><?php _e('Drop files here'); ?></p>
								<p><?php _e('or', 'modular-content'); ?></p>
								<p class="drag-drop-buttons"><input id="plupload-browse-button" type="button" value="<?php esc_attr_e('Select Files'); ?>" class="button" /></p>
								<p><?php _e('from', 'modular-content' ); ?></p>
								<p class="drag-drop-buttons">
									<a href="#" id="dgd_library_button" class="button" title="Add Media">
										<span class="wp-media-buttons-icon"></span><?php _e( 'Media Library', 'modular-content' ); ?>
									</a>
								</p>
							</div>
						</div>
					</div>
				</div>

			</div>
		<?php

		$field = new \ModularContentAttachmentHelper\Field( $args );
		
		echo $field->render();
	}
}
