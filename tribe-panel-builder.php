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
 * TODO: Move this elsewhere
 * Based on: http://wordpress.stackexchange.com/questions/130943/wordpress-3-8-get-current-admin-color-scheme
 */
global $admin_colors;
add_action('admin_head', function() {
	global $_wp_admin_css_colors;
	global $admin_colors;
	$admin_colors = $_wp_admin_css_colors;

	$user_color_scheme_name = get_user_meta( get_current_user_id(), 'admin_color', true );
	$user_color_scheme = isset( $admin_colors[$user_color_scheme_name] ) ? $admin_colors[$user_color_scheme_name] : false;

	if ( $user_color_scheme ) {

		// This little guy gets the index of the most suitable primary color
		// depending on the actual color scheme
		$primary_color_index;
		switch ( $user_color_scheme_name ) {
			case 'coffee':
			case 'ectoplasm':
			case 'ocean':
			case 'sunrise':
				$primary_color_index = 2;
				break;
			default:
				$primary_color_index = 3;
				break;
		}
		?>
		<style id='panel-builder-colors'>
			.panel-builder-text-color {
				color: <?php echo $user_color_scheme->colors[$primary_color_index]; ?>;
			}
			.panel-builder-bg-color {
				background-color:  <?php echo $user_color_scheme->colors[$primary_color_index]; ?>;
			}
			.panel-builder-border-color {
				border-color: <?php echo $user_color_scheme->colors[$primary_color_index]; ?>;
			}
		</style>
		<?php
	}
});

	// more script content...

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
