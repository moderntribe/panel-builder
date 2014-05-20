<?php

/**
 * A library for adding an attachment field to an admin meta box
 */


/**
 * Auto load class files based on namespaced folders
 *
 * @return void
 */
if( !function_exists('modular_content_attachment_helper_autoload') ){
	function modular_content_attachment_helper_autoload( $class ){

		$parts = explode('\\', $class);
		if ( $parts[0] == 'ModularContentAttachmentHelper' ) {
			if( file_exists( dirname(__FILE__).'/'.implode(DIRECTORY_SEPARATOR, $parts).'.php' ) ){
				require_once( dirname(__FILE__).'/'.implode(DIRECTORY_SEPARATOR, $parts).'.php' );
			}
		}
	}
}



/**
 * Load all the plugin files and initialize appropriately
 *
 * @return void
 */
if ( !function_exists('modular_content_attachment_helper_load') ) { // play nice
	function modular_content_attachment_helper_load() {
		spl_autoload_register( 'modular_content_attachment_helper_autoload' );
		add_action( 'plugins_loaded', array( 'ModularContentAttachmentHelper\\Ajax_Handler', 'init' ) );
	}

	modular_content_attachment_helper_load();
}

