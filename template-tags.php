<?php

function get_panel_var( $name ) {
	return \ModularContent\Plugin::instance()->loop()->get_var( $name );
}

function panel_var( $name ) {
	echo get_panel_var( $name );
}

function get_panel_vars() {
 return \ModularContent\Plugin::instance()->loop()->vars();
}

function the_panel() {
	\ModularContent\Plugin::instance()->loop()->the_panel();
}

function the_panel_content() {
	if ( $panel = get_the_panel() ) {
		echo $panel->render();
	}
}

function get_the_panel() {
	return \ModularContent\Plugin::instance()->loop()->get_the_panel();
}

function have_panels() {
	return \ModularContent\Plugin::instance()->loop()->have_panels();
}

function rewind_panels() {
	\ModularContent\Plugin::instance()->loop()->rewind();
}