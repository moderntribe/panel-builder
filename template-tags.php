<?php

/**
 * Get the value of a single field from the current panel.
 *
 * Example:
 * You set up a panel with a text field with the name "my_field".
 * get_panel_var( 'my_field' ) returns the value entered for that field.
 *
 * @param string $name
 * @return mixed
 */
function get_panel_var( $name ) {
	return \ModularContent\Plugin::instance()->loop()->get_var( $name );
}

/**
 * Get the values of all fields from the current panel.
 *
 * @return array Keys will be the configured field names
 */
function get_panel_vars() {
	return \ModularContent\Plugin::instance()->loop()->vars();
}

/**
 * Get the value of a single field from the current panel for an external source.
 *
 * Example:
 * You set up a panel with a text field with the name "my_field".
 * get_panel_var( 'my_field' ) returns the value entered for that field.
 *
 * @param string $name
 *
 * @return mixed
 */
function get_panel_var_for_api( $name ) {
	return \ModularContent\Plugin::instance()->loop()->get_var_for_api( $name );
}

/**
 * Get the values of all fields from the current panel for using on external sources.
 *
 * @return array Keys will be the configured field names
 */
function get_panel_vars_for_api() {
	return \ModularContent\Plugin::instance()->loop()->vars_for_api();
}


/**
 * Advance the panels loop to the next panel.
 * Analogous to the_post() from a WP posts loop.
 *
 * @return void
 */
function the_panel() {
	\ModularContent\Plugin::instance()->loop()->the_panel();
}

/**
 * Render the current panel.
 * Analogous to the_content() when in a WP posts loop.
 *
 * @return void
 */
function the_panel_content() {
	if ( $panel = get_the_panel() ) {
		echo $panel->render();
	}
}

/**
 * Get the Panel object for the current panel.
 *
 * @return \ModularContent\Panel
 */
function get_the_panel() {
	return \ModularContent\Plugin::instance()->loop()->get_the_panel();
}

/**
 * Whether the current panel loop has any more panels to iterate over.
 * Analogous to have_posts() in a WP posts loop.
 *
 * @return bool
 */
function have_panels() {
	return \ModularContent\Plugin::instance()->loop()->have_panels();
}

/**
 * Move back to the start of the panels loop.
 * Analogous to rewind_posts() in a WP posts loop.
 *
 * @return void
 */
function rewind_panels() {
	\ModularContent\Plugin::instance()->loop()->rewind();
}