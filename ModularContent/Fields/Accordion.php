<?php


namespace ModularContent\Fields;


/**
 * Class Group
 *
 * A alternate layout for a group of fields that has the same underlying functionality. It wraps fields in the admin
 * in a fieldset to show logical groupings.
 *
 * Creating a group:
 *
 * $first_name = new Text( array(
 *   'label' => __('First Name'),
 *   'name' => 'first',
 * ) );
 * $last_name = new Text( array(
 *   'label' => __('Last Name'),
 *   'name' => 'last',
 * ) );
 * $accordion = new Accordion( array(
 *   'label' => __('Name'),
 *   'name' => 'name',
 * ) );
 * $accordion->add_field( $first_name );
 * $accordion->add_field( $last_name );
 *
 *
 * Using data from a group in a template:
 *
 * $first_name = get_panel_var( 'name.first' );
 * $last_name = get_panel_var( 'name.last' );
 *
 * OR
 *
 * $name = get_panel_var( 'name' );
 * $first_name = $name['first'];
 * $last_name = $name['last'];
 *
 * OR
 *
 * $vars = get_panel_vars();
 * $first_name = $vars['name']['first'];
 * $last_name = $vars['name']['last'];
 */
class Accordion extends Group {}
