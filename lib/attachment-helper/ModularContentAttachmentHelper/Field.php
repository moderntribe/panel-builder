<?php

namespace ModularContentAttachmentHelper;

class Field {
	
	private static $count = 1;
		
	private $args = array();

	private $label = 'thumbnail image';
	private $value = NULL;
	private $size = 'thumbnail';
	private $name = 'attachment-helper';
	private $type = 'image';

	public function __construct( $args = array() ) {
		$defaults = array(
			'label' => __('thumbnail image', 'attachment-helper'),
			'value' => $this->value,
			'size'  => $this->size,
			'name'  => $this->name,
			'type'  => $this->type,
		);
		$this->args = wp_parse_args($args, $defaults);
		foreach ( array_keys($defaults) as $key ) {
			$this->{$key} = $this->args[$key];
		}
	}

	public function render() {
		global $content_width;
		UI::instance()->enqueue_scripts( $this->args );
		//TODO
		$value = 127;
		?>
		
		<div id="uploadContainer-<?php echo self::$count; ?>" style="margin-top: 10px;" class="uploadContainer attachment-helper-uploader" data-size="<?php echo $this->args['size']; ?>" data-type="<?php echo $this->args['type']; ?>" >

				<!-- Current image -->
				<div id="current-uploaded-image-<?php echo self::$count; ?>" class="<?php !empty( $value ) ? 'open' : 'closed'; ?> current-uploaded-image">
					<img class="attachment-<?php echo $this->size; ?>" src="" />
					<div class="wp-caption"></div>
					<p class="hide-if-no-js">
						<a class="button-secondary" href="#" id="remove-image-<?php echo self::$count; ?>"  data-count="<?php echo self::$count; ?>">
							<?php printf(__('Remove %s', 'attachment-helper'), $this->label ); ?>
						</a>
					</p>
				</div>

				<!-- Uploader section -->
				<div id="uploaderSection-<?php echo self::$count; ?>" class="uploaderSection">
					<div class="loading">
						<img src="<?php echo get_bloginfo('url'); ?>/wp-admin/images/wpspin_light.gif
" alt="<?php _e( 'Loading', 'modular-content' ); ?>" />
					</div>
					<div id="plupload-upload-ui-<?php echo self::$count; ?>" class="hide-if-no-js plupload-upload-ui">
						<div id="drag-drop-area-<?php echo self::$count; ?>" class="drag-drop-area">
							<div class="drag-drop-inside">
								<p class="drag-drop-info"><?php _e('Drop files here'); ?></p>
								<p><?php _e('or', 'modular-content'); ?></p>
								<p class="drag-drop-buttons"><input id="plupload-browse-button" type="button" value="<?php esc_attr_e('Select Files'); ?>" class="button" /></p>
								<p><?php _e('from', 'modular-content' ); ?></p>
								<p class="drag-drop-buttons">
									<a href="#" id="attachment_helper_library_button-<?php echo self::$count; ?>" class="button attachment_helper_library_button" title="Add Media" data-count="<?php echo self::$count; ?>" data-size="<?php echo $this->args['size']; ?>" data-type="<?php echo $this->args['type']; ?>" >
										<span class="wp-media-buttons-icon"></span><?php _e( 'Media Library', 'modular-content' ); ?>
									</a>
								</p>
							</div>
						</div>
					</div>
				</div>

			</div>
			<input type="hidden" id="attachment_helper_value-<?php echo self::$count; ?>" name="<?php echo $this->name; ?>" value="<?php echo $this->value; ?>" />
		
		<?php
		
		self::$count++;
		
	}
}
 