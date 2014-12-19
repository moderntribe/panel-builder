<?php
/*
Plugin Name: jQuery UI Themes
Description: Registers jQuery UI theme
Author: Flightless
Version: 1.0
Author URI: http://flightless.us/
*/


function jqueryui_register_default_theme() {
	$theme = apply_filters('jqueryui_default_theme', 'smoothness');
	jqueryui_register_theme($theme);
}

function jqueryui_register_theme( $theme ) {
	global $wp_scripts;
	if ( $wp_scripts ) {
		$ui = $wp_scripts->query('jquery-ui-core');
		if ( $ui ) {
			$ui_base = "//ajax.googleapis.com/ajax/libs/jqueryui/{$ui->ver}/themes/$theme";
			wp_register_style( 'jquery-ui', "$ui_base/jquery-ui.css", FALSE, $ui->ver );
		}
	}
}

add_action( 'admin_enqueue_scripts', 'jqueryui_register_default_theme', 0, 0 );