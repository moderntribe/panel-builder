<?php
/*
Plugin Name:	AJAX Queue
Description:	Group AJAX calls
Author:		    Modern Tribe
Version:	    1.0.0
Author URI:	    http://www.tri.be
*/

require_once trailingslashit( __DIR__ ) . 'vendor/autoload.php';


// Start the core plugin
add_action( 'plugins_loaded', function () {
	\AJAXQueue\Core::init();
} );