<?php

namespace ModularContentAttachmentHelper;

class Field {
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
			'size' => $this->size,
			'name' => $this->name,
			'type' => $this->type,
		);
		$this->args = wp_parse_args($args, $defaults);
		foreach ( array_keys($defaults) as $key ) {
			$this->{$key} = $this->args[$key];
		}
	}

	public function render() {
		global $content_width;
		UI::instance()->enqueue_scripts();
		//TODO
		$value = 127;
		?>
		
		<div id="uploadContainer" style="margin-top: 10px;">

				<!-- Current image -->
				<div id="current-uploaded-image" class="<?php !empty( $value ) ? 'open' : 'closed'; ?>">
					<img class="attachment-<?php echo $this->size; ?>" src="" />
					
					<p class="hide-if-no-js">
						<a class="button-secondary" href="#" id="remove-image">
							<?php printf(__('Remove %s', 'attachment-helper'), $this->label ); ?>
						</a>
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
		

		$label_set = sprintf(__('Set %s', 'attachment-helper'),$this->label);
		$label_remove = 

		$set_thumbnail_link = '<p class="hide-if-no-js"><a title="' . esc_attr__( $label_set ) . '" href="#" class="attachment-helper-set">%s</a></p>';
		$content = sprintf($set_thumbnail_link, esc_html($label_set) );

		if ( $this->value && get_post( $this->value ) ) {
			if ( $this->type == 'image' ) {
				$old_content_width = $content_width;
				$content_width = 266;
				$thumbnail_html = wp_get_attachment_image( $this->value, $this->size );
				if ( !empty( $thumbnail_html ) ) {
					$content = sprintf($set_thumbnail_link, $thumbnail_html);
				}
				$content_width = $old_content_width;
			} else {
				$attachment_url = wp_get_attachment_url($this->value);
				$filename = basename($attachment_url);
				$content = sprintf($set_thumbnail_link, '<span>'.get_the_title($this->value).' ('.$filename.')'.'</span>');
			}
		}
		$hide_remove_button = empty($this->value) ? 'style="display: none;"' : '';
		$content .= '<p class="hide-if-no-js"><a href="#" class="attachment-helper-remove"'.$hide_remove_button.'>' . $label_remove . '</a></p>';

		$content .= sprintf('<input type="hidden" name="%s" value="%d" class="attachment-helper-input" data-label="%s" data-label-set="%s" data-label-remove="%s" data-type="%s" data-size="%s" />',
			esc_attr($this->name), // name
			esc_attr($this->value), // value
			esc_attr($this->label), // data-label
			esc_attr($label_set), // data-label-set
			esc_attr($label_remove), // data-label-remove
			esc_attr($this->type), // data-type
			esc_attr($this->size) // data-size
		);
		$content = '<div class="attachment-helper">'.$content.'</div>';
		return apply_filters( 'attachment_helper_html', $content );
	}
}
 