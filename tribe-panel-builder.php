<?php
/*
Plugin Name: Tribe Panel Builder
Plugin URI: http://tri.be
Description: A framework for building modular content components
Author: Modern Tribe, Inc.
Author URI: http://tri.be
Contributors: jbrinley
Version: 2.0
*/

/**
 * Load all the plugin files and initialize appropriately
 *
 * @return void
 */
if ( !function_exists('modular_content_load') ) { // play nice
	function modular_content_load() {
		\ModularContent\Plugin::init(__FILE__);
		require_once('lib/jqueryui-themes.php');
	}

	//spl_autoload_register( 'modular_content_autoload' );
	require_once( __DIR__ . '/vendor/autoload.php' );
	add_action( 'plugins_loaded', 'modular_content_load' );
}
