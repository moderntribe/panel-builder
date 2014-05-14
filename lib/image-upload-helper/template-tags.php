<?php

/**
 * Add an image upload/selection control to a form
 *
 * The defaults are as follows:
 *     'label' - Default is "thumbnail image". The label to use for the field.
 *     'thumbnail_id' - Default is NULL. The attachment ID of the fields current value.
 *     'size' - Default is "post-thumbnail". The size of the thumbnail image that will be displayed in the dialog
 *     'field_name' - Default is "image-upload-helper". The name to give the hidden input field that will hold the attachment ID.
 *
 * @param array $args
 * @return void Prints the image upload/selection control
 */
function image_upload_helper( $args = array() ) {
	$helper = new Image_Upload_Helper();
	echo $helper->thumbnail_html($args);
}
