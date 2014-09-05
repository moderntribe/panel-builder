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
 * Auto load class files based on namespaced folders
 *
 * @return void
 */
if( !function_exists('modular_content_autoload') ){
	function modular_content_autoload( $class ){
		$parts = explode('\\', $class);
		if ( $parts[0] == 'ModularContent' ) {
			if( file_exists( dirname(__FILE__).'/'.implode(DIRECTORY_SEPARATOR, $parts).'.php' ) ){
				include_once( dirname(__FILE__).'/'.implode(DIRECTORY_SEPARATOR, $parts).'.php' );
			}
		}
	}
}

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

	spl_autoload_register( 'modular_content_autoload' );
	add_action( 'plugins_loaded', 'modular_content_load' );
}
