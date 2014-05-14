<?php
/**
 * @package Flightless
 * @version 1.0
 */
/*
Plugin Name: Image Upload Helper
Plugin URI: https://github.com/flightless/image-upload-helper
Description: Adds a field for uploading images via WordPress's popup iframe
Author: Flightless, Inc
Author URI: http://flightless.us/
Contributors: jbrinley, Modern Tribe
Version: 1.0
*/

/**
 * Load all the plugin files and initialize appropriately
 *
 * @return void
 */
if ( !function_exists('image_upload_helper_load') ) { // play nice
	function image_upload_helper_load() {
		include(dirname(__FILE__).DIRECTORY_SEPARATOR.'Image_Upload_Helper.php');
		include(dirname(__FILE__).DIRECTORY_SEPARATOR.'template-tags.php');

		Image_Upload_Helper::init();
	}


	// Fire it up!
	image_upload_helper_load();
}
