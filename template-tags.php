<?php

function get_panel_var( $name ) {
	return \ModularContent\Plugin::instance()->loop()->get_var( $name );
}

function get_panel_vars() {
 return \ModularContent\Plugin::instance()->loop()->vars();
}

function the_panel() {
	\ModularContent\Plugin::instance()->loop()->the_panel();
}

function get_the_panel() {
	\ModularContent\Plugin::instance()->loop()->get_the_panel();
}

function have_panels() {
	return \ModularContent\Plugin::instance()->loop()->have_panels();
}